'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';

import { LAYOUTS } from '@/data/layoutData';
import { useLayout } from '@/context/LayoutContext';
import { selectionsForPage, getPriorityOrder } from '@/utils/previewRender';
import {
  LOCKED_LAYOUT_KEYS,
  NON_DUPLICABLE_LAYOUT_KEYS,
} from '@/utils/sectionRules';

import SectionRow, { SectionRowView, type SectionRowData } from './SectionRow';
import styles from './index.module.css';

/**
 * Lista de seções da página aberta — o lugar onde a edição acontece.
 *
 * O canvas ficou 100% interativo, então reordenar/duplicar/excluir/editar
 * migraram para cá: é o modelo do Shopify, e é o que permite que os carrosséis
 * e megamenus dos templates funcionem sem competir com o gesto de arrastar.
 *
 * Mora na aba "Seções da Página" da dock inferior (`Sidebar`), e não num painel
 * flutuante à esquerda: como coluna fixa ele cobria a gaveta de escolha de
 * componentes, que é larga e cresce de baixo para cima.
 *
 * A ordem continua sendo definida por `getPriorityOrder`. Esta lista não a
 * reproduz com dnd — separa os buckets e só o bucket de conteúdo entra no
 * SortableContext. Assim header/breadcrumb/footer não têm handle e o usuário
 * nunca tenta um arraste que não teria efeito.
 */
export default function SectionsPanel() {
  const {
    selections,
    selectedPage,
    selectedUid,
    setSelectedUid,
    hoveredUid,
    setHoveredUid,
    scrollToSectionRef,
    moveSection,
    duplicateSection,
    removeSection,
    setEditingUid,
  } = useLayout();

  const [activeUid, setActiveUid] = useState<string | null>(null);

  /** O DragOverlay é portalizado para o body; só depois do mount há `document`. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /**
   * Ao sair da aba (ou fechar a dock) este componente desmonta e a seleção
   * perde sentido — sem isso o contorno azul fica preso no canvas, sem nenhuma
   * lista visível para explicar de onde veio ou como desfazê-lo.
   */
  useEffect(
    () => () => {
      setSelectedUid(null);
      setHoveredUid(null);
    },
    [setSelectedUid, setHoveredUid]
  );

  const sensors = useSensors(
    // Sem activationConstraint o dnd-kit ativa o drag no próprio pointerdown e
    // o click da linha nunca chega.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const rows = useMemo<SectionRowData[]>(
    () =>
      selectionsForPage(selections, selectedPage).map(sel => {
        const section = LAYOUTS[sel.layoutKey];
        const layoutItem = section?.items.find(it => it.id === sel.id);

        return {
          uid: sel.uid,
          title: layoutItem?.title ?? sel.id,
          group: section?.name ?? sel.layoutKey,
          isCommon: sel.pagina === 'common',
          canDuplicate: !NON_DUPLICABLE_LAYOUT_KEYS.has(sel.layoutKey),
          canEdit: !!layoutItem?.variablesSchema?.length,
          locked: LOCKED_LAYOUT_KEYS.has(sel.layoutKey),
        };
      }),
    [selections, selectedPage]
  );

  /** Buckets pela mesma prioridade que governa o render. */
  const { top, content, bottom } = useMemo(() => {
    const ordered = selectionsForPage(selections, selectedPage);
    const byUid = new Map(rows.map(r => [r.uid, r]));

    const pick = (test: (order: number) => boolean) =>
      ordered
        .filter(sel => test(getPriorityOrder(sel.layoutKey)))
        .map(sel => byUid.get(sel.uid))
        .filter((r): r is SectionRowData => !!r);

    return {
      top: pick(o => o < 2),
      content: pick(o => o === 2),
      bottom: pick(o => o > 2),
    };
  }, [selections, selectedPage, rows]);

  const contentIds = useMemo(() => content.map(r => r.uid), [content]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveUid(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveUid(null);
      if (!over) return;
      moveSection(active.id as string, over.id as string);
    },
    [moveSection]
  );

  const handleSelect = useCallback(
    (uid: string) => {
      setSelectedUid(uid);
      // O canvas é um iframe: só o documento dele pode rolar até a seção.
      scrollToSectionRef.current?.(uid);
    },
    [setSelectedUid, scrollToSectionRef]
  );

  // O contorno dentro do frame não é aplicado aqui: o PreviewFrame observa
  // `hoveredUid` e manda o `highlight` por postMessage.
  const handleHover = useCallback(
    (uid: string, hovering: boolean) => {
      setHoveredUid(hovering ? uid : null);
    },
    [setHoveredUid]
  );

  const handleRemove = useCallback(
    (row: SectionRowData) => {
      if (
        row.isCommon &&
        !window.confirm(
          `"${row.title}" aparece nas três páginas. Remover de todas?`
        )
      ) {
        return;
      }
      removeSection(row.uid);
    },
    [removeSection]
  );

  const rowHandlers = (row: SectionRowData) => ({
    selected: row.uid === selectedUid,
    hovered: row.uid === hoveredUid,
    onSelect: () => handleSelect(row.uid),
    onHoverChange: (hovering: boolean) => handleHover(row.uid, hovering),
    onEdit: () => setEditingUid(row.uid),
    onDuplicate: () => duplicateSection(row.uid),
    onRemove: () => handleRemove(row),
  });

  const activeRow = activeUid ? rows.find(r => r.uid === activeUid) : null;

  return (
    <section className={`${styles.panel} preview-ui`} aria-label="Seções da página">
      <header className={styles.header}>
        <h2 className={styles.heading}>Seções</h2>
        <span className={styles.count}>
          {rows.length === 1 ? '1 seção' : `${rows.length} seções`}
        </span>
      </header>

      <div className={styles.list}>
        {rows.length === 0 ? (
          <p className={styles.empty}>
            Nenhuma seção nesta página. Abra <strong>Editar o Tema</strong> na
            barra inferior para adicionar componentes.
          </p>
        ) : (
          <>
            {top.map(row => (
              <SectionRowView key={row.uid} data={row} {...rowHandlers(row)} />
            ))}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              // Lista vertical: travar o eixo X e o arraste ao scroller da
              // lista deixa o gesto previsível e impede o clone de sair voando.
              modifiers={[
                restrictToVerticalAxis,
                restrictToFirstScrollableAncestor,
              ]}
              onDragStart={handleDragStart}
              onDragCancel={() => setActiveUid(null)}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={contentIds}
                strategy={verticalListSortingStrategy}
              >
                {content.map(row => (
                  <SectionRow key={row.uid} data={row} {...rowHandlers(row)} />
                ))}
              </SortableContext>

              {/*
                O DragOverlay VAI PARA O BODY, obrigatoriamente.
                Ele é `position: fixed` com coordenadas de viewport, e a
                `.sidebar` que hospeda este painel tem `transform:
                translateX(-50%)`. Um ancestral com transform vira containing
                block de descendentes `fixed`, então o clone era reancorado na
                caixa da sidebar e ainda levava o deslocamento de -50%: a sombra
                aparecia longe do cursor. Pior, o dnd-kit usa o rect do overlay
                na detecção de colisão, então o item também caía na posição
                errada. Portalizar para fora do ancestral transformado corrige
                os dois de uma vez.
              */}
              {mounted &&
                createPortal(
                  <DragOverlay>
                    {activeRow && (
                      // O escopo `.panel` viaja com o clone: fora dele os
                      // seletores `.panel button` (o reset contra o
                      // `.sidebar button` global) não alcançariam a linha e o
                      // clone sairia com os botões sem estilo.
                      <div className={styles.panel}>
                        <SectionRowView data={activeRow} dragging />
                      </div>
                    )}
                  </DragOverlay>,
                  document.body
                )}
            </DndContext>

            {bottom.map(row => (
              <SectionRowView key={row.uid} data={row} {...rowHandlers(row)} />
            ))}
          </>
        )}
      </div>
    </section>
  );
}

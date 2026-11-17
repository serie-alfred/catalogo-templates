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
import { confirmar } from '@/components/gerador/ConfirmDialog/confirmar';
import { useLayout } from '@/context/LayoutContext';
import { selectionsForPage, getPriorityOrder } from '@/utils/previewRender';
import {
  LOCKED_LAYOUT_KEYS,
  NON_DUPLICABLE_SELECTIONS,
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
 * Mora no painel esquerdo do shell, no destino "Componentes" do rail.
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
    selectSection,
    expandedUids,
    toggleExpanded,
    collapseAllSections,
    hoveredUid,
    setHoveredUid,
    scrollToSectionRef,
    moveSection,
    duplicateSection,
    removeSection,
    removeSections,
  } = useLayout();

  const [activeUid, setActiveUid] = useState<string | null>(null);

  /** O DragOverlay é portalizado para o body; só depois do mount há `document`. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* A limpeza de `selectedUid`/`hoveredUid` no unmount saiu junto com a dock:
     ela existia porque a aba desmontava ao fechar a gaveta, deixando o contorno
     preso no canvas sem lista para explicá-lo. O painel agora é permanente e o
     painel direito continua mostrando a seção selecionada mesmo quando o rail
     está em outro destino. */

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
          canDuplicate: !NON_DUPLICABLE_SELECTIONS.has(
            layoutItem?.selection ?? ''
          ),
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
      selectSection(uid);
      // O canvas é um iframe: só o documento dele pode rolar até a seção.
      scrollToSectionRef.current?.(uid);
    },
    [selectSection, scrollToSectionRef]
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
    async (row: SectionRowData) => {
      if (
        row.isCommon &&
        !(await confirmar({
          titulo: `Remover "${row.title}"?`,
          texto: 'Esta seção aparece nas três páginas e sai de todas.',
          ok: 'Remover de todas',
        }))
      ) {
        return;
      }
      removeSection(row.uid);
    },
    [removeSection]
  );

  /**
   * "Remover todas": tira TODAS as seções da página aberta de uma vez. As que
   * valem em todas as páginas (header, rodapé, breadcrumb, card) saem das três —
   * o modal conta quantas e lista os nomes, para ninguém apagar o header da loja
   * achando que mexia só na home. Uma atualização só: o Voltar devolve tudo.
   */
  const handleRemoveAll = useCallback(async () => {
    if (!rows.length) return;
    const comuns = rows.filter(r => r.isCommon).length;
    const ok = await confirmar({
      titulo:
        rows.length === 1
          ? 'Remover a seção desta página?'
          : `Remover as ${rows.length} seções desta página?`,
      texto: comuns
        ? comuns === rows.length
          ? 'Todas aparecem nas três páginas e saem de todas.'
          : `${comuns} delas aparece${comuns === 1 ? '' : 'm'} nas três páginas e sai${
              comuns === 1 ? '' : 'em'
            } de todas.`
        : undefined,
      itens: rows.map(r =>
        r.isCommon ? `${r.title} · todas as páginas` : r.title
      ),
      nota: 'Dá para desfazer com Voltar.',
      ok: 'Remover todas',
      perigo: true,
    });
    if (ok) removeSections(rows.map(r => r.uid));
  }, [rows, removeSections]);

  const rowHandlers = (row: SectionRowData) => ({
    selected: row.uid === selectedUid,
    hovered: row.uid === hoveredUid,
    expanded: expandedUids.has(row.uid),
    onToggleExpanded: () => toggleExpanded(row.uid),
    onSelect: () => handleSelect(row.uid),
    onHoverChange: (hovering: boolean) => handleHover(row.uid, hovering),
    onDuplicate: () => duplicateSection(row.uid),
    onRemove: () => handleRemove(row),
  });

  const activeRow = activeUid ? rows.find(r => r.uid === activeUid) : null;

  // Contar sobre `rows` (as da página aberta), não sobre o set inteiro: uma
  // linha aberta noutra página faria a barra aparecer aqui sem ter o que fechar.
  const abertasNaPagina = rows.filter(r => expandedUids.has(r.uid)).length;

  return (
    <section className={styles.panel} aria-label="Seções da página">
      {/* Sem cabeçalho "Seções · N": o Figma leva o painel direto para o
          primeiro acordeão. */}
      <div className={styles.list}>
        {/* A barra existe com qualquer seção na página: "Remover todas" vale
            sempre. "Recolher todas" só aparece quando resolve algo (duas ou
            mais linhas abertas), como antes. */}
        {rows.length > 0 && (
          <div className={styles.listBar}>
            {abertasNaPagina >= 2 && (
              <button
                type="button"
                className={styles.collapseAll}
                onClick={collapseAllSections}
                aria-label="Recolher todas as seções"
              >
                Recolher todas
              </button>
            )}
            <button
              type="button"
              className={`${styles.collapseAll} ${styles.removeAll}`}
              onClick={handleRemoveAll}
              aria-label="Remover todas as seções desta página"
            >
              Remover todas
            </button>
          </div>
        )}

        {rows.length === 0 ? (
          <p className={styles.empty}>
            Nenhuma seção nesta página. Use <strong>Adicionar seção</strong>{' '}
            para incluir componentes.
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
                      <div className={styles.panel} data-ed-portal>
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

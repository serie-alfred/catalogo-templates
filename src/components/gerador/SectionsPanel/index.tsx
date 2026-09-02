'use client';

import React, { useCallback, useMemo } from 'react';
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

import { LAYOUTS } from '@/data/layoutData';
import { useLayout } from '@/context/LayoutContext';
import { selectionsForPage, getPriorityOrder } from '@/utils/previewRender';
import {
  LOCKED_LAYOUT_KEYS,
  NON_DUPLICABLE_LAYOUT_KEYS,
} from '@/utils/sectionRules';
import { highlightSection, scrollToSection } from '@/hooks/useCanvasInteractions';

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
    canvasRef,
    moveSection,
    duplicateSection,
    removeSection,
    setEditingUid,
  } = useLayout();

  const [activeUid, setActiveUid] = React.useState<string | null>(null);

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
      scrollToSection(canvasRef.current, uid);
    },
    [setSelectedUid, canvasRef]
  );

  const handleHover = useCallback(
    (uid: string, hovering: boolean) => {
      const next = hovering ? uid : null;
      setHoveredUid(next);
      highlightSection(canvasRef.current, next);
    },
    [setHoveredUid, canvasRef]
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
              onDragStart={handleDragStart}
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

              <DragOverlay>
                {activeRow && (
                  <SectionRowView data={activeRow} dragging selected />
                )}
              </DragOverlay>
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

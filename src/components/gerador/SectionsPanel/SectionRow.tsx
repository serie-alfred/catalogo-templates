'use client';

import React, { useEffect, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { iconsGenerator } from '@/assets/icons/generator';
import styles from './index.module.css';

export interface SectionRowData {
  uid: string;
  /** `layoutItem.title`, ex.: "Header Template 1". */
  title: string;
  /** `LAYOUTS[layoutKey].name`, ex.: "Header". */
  group: string;
  /** Aparece nas três páginas. */
  isCommon: boolean;
  canDuplicate: boolean;
  canEdit: boolean;
  /** Posição fixada por getPriorityOrder: sem handle de arraste. */
  locked: boolean;
}

interface SectionRowViewProps {
  data: SectionRowData;
  selected?: boolean;
  hovered?: boolean;
  /** Props do handle de arraste (só as linhas reordenáveis recebem). */
  handleProps?: React.HTMLAttributes<HTMLButtonElement>;
  dragging?: boolean;
  onSelect?: () => void;
  onHoverChange?: (hovering: boolean) => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
}

/**
 * Linha apresentacional pura — sem useSortable. Reusada pelo DragOverlay, que
 * assim não registra um segundo sortable com o mesmo id.
 */
export function SectionRowView({
  data,
  selected = false,
  hovered = false,
  handleProps,
  dragging = false,
  onSelect,
  onHoverChange,
  onEdit,
  onDuplicate,
  onRemove,
}: SectionRowViewProps) {
  return (
    <div
      className={styles.row}
      data-selected={selected ? 'true' : undefined}
      data-hovered={hovered ? 'true' : undefined}
      data-dragging={dragging ? 'true' : undefined}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      {data.locked ? (
        <span
          className={styles.lock}
          title={
            data.group === 'Footer' ? 'Sempre no fim' : 'Posição fixa no topo'
          }
          aria-hidden
        >
          🔒
        </span>
      ) : (
        <button
          type="button"
          className={styles.handle}
          title="Arraste para reordenar"
          aria-label={`Reordenar ${data.title}`}
          {...handleProps}
        >
          ⠿
        </button>
      )}

      <button type="button" className={styles.label} onClick={onSelect}>
        <span className={styles.title}>{data.title}</span>
        <span className={styles.meta}>
          {data.group}
          {data.isCommon && (
            <span className={styles.badge}>Todas as páginas</span>
          )}
        </span>
      </button>

      <span className={styles.actions}>
        {data.canEdit && (
          <button
            type="button"
            className={styles.editBtn}
            onClick={onEdit}
            title="Editar cores e fontes"
          >
            {iconsGenerator.editTheme}
          </button>
        )}
        {data.canDuplicate && (
          <button
            type="button"
            className={styles.duplicateBtn}
            onClick={onDuplicate}
            title="Duplicar seção"
          >
            {iconsGenerator.duplicateTheme}
          </button>
        )}
        <button
          type="button"
          className={styles.remoteBtn}
          onClick={onRemove}
          title="Remover seção"
        >
          {iconsGenerator.deleteTheme}
        </button>
      </span>
    </div>
  );
}

interface SectionRowProps extends Omit<SectionRowViewProps, 'handleProps'> {
  /** Rola a própria linha até a vista quando fica selecionada. */
  scrollIntoViewWhenSelected?: boolean;
}

/** Linha reordenável: o useSortable liga APENAS o handle. */
export default function SectionRow({
  data,
  selected,
  scrollIntoViewWhenSelected = true,
  ...rest
}: SectionRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: data.uid, disabled: data.locked });

  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selected || !scrollIntoViewWhenSelected) return;
    // 'nearest': não rola se a linha já está visível, senão o painel pula a
    // cada clique no canvas.
    rowRef.current?.scrollIntoView({ block: 'nearest' });
  }, [selected, scrollIntoViewWhenSelected]);

  return (
    <div
      ref={node => {
        setNodeRef(node);
        rowRef.current = node;
      }}
      style={{
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
      }}
    >
      <SectionRowView
        data={data}
        selected={selected}
        dragging={isDragging}
        handleProps={
          data.locked
            ? undefined
            : ({ ...attributes, ...listeners } as React.HTMLAttributes<HTMLButtonElement>)
        }
        {...rest}
      />
    </div>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Copy, GripVertical, Trash2 } from 'lucide-react';

import { CaretDown, Minus, Plus, TextBlock } from '@/assets/icons/editor';
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
  onDuplicate?: () => void;
  onRemove?: () => void;
}

/**
 * Linha apresentacional pura — sem useSortable. Reusada pelo DragOverlay, que
 * assim não registra um segundo sortable com o mesmo id.
 *
 * É um acordeão: o cabeçalho traz o nome da SEÇÃO e o expandido traz o modelo
 * escolhido e as ações da linha. O Figma desenha um caret estático à esquerda e
 * o +/− à direita como indicador de estado — os dois são preservados.
 *
 * Em repouso TODA linha mostra o caret, inclusive as travadas: é o que o Figma
 * desenha. O grip só aparece sob o cursor, e só nas linhas reordenáveis — não
 * aparecer já diz que aquela não arrasta, sem precisar de um ícone que o design
 * não tem. O motivo fica no `title`.
 */
export function SectionRowView({
  data,
  selected = false,
  hovered = false,
  handleProps,
  dragging = false,
  onSelect,
  onHoverChange,
  onDuplicate,
  onRemove,
}: SectionRowViewProps) {
  const [open, setOpen] = useState(false);
  const [pointerOver, setPointerOver] = useState(false);
  const expanded = open || selected;

  const showGrip = !data.locked && (pointerOver || dragging);

  return (
    <div
      className={styles.row}
      data-selected={selected ? 'true' : undefined}
      data-hovered={hovered ? 'true' : undefined}
      data-dragging={dragging ? 'true' : undefined}
      onMouseEnter={() => {
        setPointerOver(true);
        onHoverChange?.(true);
      }}
      onMouseLeave={() => {
        setPointerOver(false);
        onHoverChange?.(false);
      }}
    >
      <div className={styles.head}>
        <span
          className={styles.affordance}
          title={
            data.locked
              ? data.group === 'Footer'
                ? 'Posição fixa: sempre no fim'
                : 'Posição fixa no topo'
              : undefined
          }
        >
          {showGrip ? (
            <button
              type="button"
              className={styles.handle}
              title="Arraste para reordenar"
              aria-label={`Reordenar ${data.title}`}
              {...handleProps}
            >
              <GripVertical size={18} />
            </button>
          ) : (
            <CaretDown width={24} height={24} />
          )}
        </span>

        <button type="button" className={styles.name} onClick={onSelect}>
          {data.group}
        </button>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setOpen(prev => !prev)}
          aria-expanded={expanded}
          aria-label={
            expanded ? `Recolher ${data.group}` : `Expandir ${data.group}`
          }
        >
          {expanded ? (
            <Minus width={24} height={24} />
          ) : (
            <Plus width={24} height={24} />
          )}
        </button>
      </div>

      {expanded && (
        <div className={styles.children}>
          <span className={styles.guide} aria-hidden />

          <div className={styles.childList}>
            <button
              type="button"
              className={`${styles.child} ${selected ? styles.childActive : ''}`}
              onClick={onSelect}
            >
              <span className={styles.childLabel}>
                <TextBlock width={22} height={22} />
                Modelo
              </span>
              <span className={styles.childValue}>{data.title}</span>
            </button>

            {data.isCommon && (
              <span className={styles.badge}>Todas as páginas</span>
            )}

            <div className={styles.actions}>
              {/* Não há botão de "variáveis": selecionar a seção já abre o
                  painel direito com elas. Um segundo caminho para a mesma coisa
                  seria só um jeito de os dois discordarem. */}
              {data.canDuplicate && (
                <button
                  type="button"
                  className={styles.action}
                  onClick={onDuplicate}
                  title="Duplicar seção"
                >
                  <Copy size={16} />
                  Duplicar
                </button>
              )}
              <button
                type="button"
                className={`${styles.action} ${styles.danger}`}
                onClick={onRemove}
                title="Remover seção"
              >
                <Trash2 size={16} />
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
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
            : ({
                ...attributes,
                ...listeners,
              } as React.HTMLAttributes<HTMLButtonElement>)
        }
        {...rest}
      />
    </div>
  );
}

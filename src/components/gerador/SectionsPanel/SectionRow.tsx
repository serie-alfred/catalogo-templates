'use client';

import React, { useEffect, useRef } from 'react';
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
  /** Linha aberta. Controlado de fora: o "recolher todas" precisa alcançar
   *  todas de uma vez, e o clone do DragOverlay não pode nascer fechado. */
  expanded?: boolean;
  onToggleExpanded?: () => void;
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
 *
 * O caret e o grip NÃO dividem mais o mesmo slot. Dividiam, e o resultado era
 * uma armadilha: o usuário mirava no caret, o cursor entrava na linha, o caret
 * virava grip, e o clique caía no handle do dnd-kit — que com
 * `activationConstraint: { distance: 4 }` ignora clique sem arraste. Alvo que
 * troca de identidade sob o cursor não é affordance. Agora o grip mora na
 * calha de 24px do `padding-left` da linha (vazia no Figma) e o slot é só do
 * caret, que virou botão.
 */
export function SectionRowView({
  data,
  selected = false,
  hovered = false,
  handleProps,
  dragging = false,
  expanded = false,
  onToggleExpanded,
  onSelect,
  onHoverChange,
  onDuplicate,
  onRemove,
}: SectionRowViewProps) {
  const corpoId = `secao-${data.uid}-corpo`;

  return (
    <div
      className={styles.row}
      data-selected={selected ? 'true' : undefined}
      data-hovered={hovered ? 'true' : undefined}
      data-dragging={dragging ? 'true' : undefined}
      data-expanded={expanded ? 'true' : undefined}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <div className={styles.head}>
        {!data.locked && (
          <button
            type="button"
            className={styles.handle}
            title="Arraste para reordenar"
            aria-label={`Reordenar ${data.title}`}
            {...handleProps}
          >
            <GripVertical size={18} />
          </button>
        )}

        <button
          type="button"
          className={styles.affordance}
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          aria-controls={corpoId}
          aria-label={
            expanded ? `Recolher ${data.group}` : `Expandir ${data.group}`
          }
          title={
            data.locked
              ? data.group === 'Footer'
                ? 'Posição fixa: sempre no fim'
                : 'Posição fixa no topo'
              : undefined
          }
        >
          <CaretDown width={24} height={24} />
        </button>

        <button type="button" className={styles.name} onClick={onSelect}>
          {data.group}
        </button>

        <button
          type="button"
          className={styles.toggle}
          onClick={onToggleExpanded}
          aria-expanded={expanded}
          aria-controls={corpoId}
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
        <div className={styles.children} id={corpoId}>
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

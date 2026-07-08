import React from 'react';

import type { LayoutItem, LayoutKey } from '@/data/layoutData';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';

import styles from './index.module.css';
import { TemplateRegistry } from '@/utils/templateRegistry';

interface SortableItemProps {
  id: string | null;
  data: LayoutItem & { layoutKey: LayoutKey };
  selected: boolean;
  isMobile: boolean;
  isOverlay?: boolean;
}

export default function SortableItem({
  id,
  data,
  selected,
  isMobile,
  isOverlay = false,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id ?? '' });

  const style = isOverlay
    ? undefined
    : {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition,
        transformOrigin: 'top',
      };

  const imageSrc = isMobile ? data.mobile : data.image;
  const Component = TemplateRegistry[data.component];

  return (
    <div className={styles.itemWrapper}>
      <div
        ref={setNodeRef}
        style={style}
        {...(isOverlay ? {} : attributes)}
        {...(isOverlay ? {} : listeners)}
        // classe global estável: marca a subárvore do template para o reset de
        // .preview__area (templates.css) não atingir os componentes selecionados.
        className={`${styles.imageContainer} preview-template`}
      >
        {Component ? (
          data.layoutKey === 'spot' ? (
            // O "Card de Produto" (spot) não tem swiper e não deve ocupar 100%:
            // renderiza direto, como era, preservando sua largura natural.
            <Component isMobile={isMobile} />
          ) : (
            // pointer-events: none garante que componentes interativos (ex.: Swiper)
            // não capturem o gesto de arrastar do dnd-kit. No editor o template é só
            // uma pré-visualização — a interação real acontece no preview compartilhado.
            <div style={{ pointerEvents: 'none', width: '100%' }}>
              <Component isMobile={isMobile} />
            </div>
          )
        ) : (
          <Image
            src={`/images/gerador/${imageSrc}`}
            width={1919}
            height={90}
            alt={data.title}
            style={{ width: '100%', height: 'auto' }}
          />
        )}
        {selected && <div className={styles.selectedOverlay} />}
      </div>
    </div>
  );
}

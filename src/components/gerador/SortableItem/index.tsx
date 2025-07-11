import React from 'react';

import type { LayoutItem, LayoutKey } from '@/data/layoutData';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';

import styles from './index.module.css';

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

  return (
    <div className={styles.itemWrapper}>
      <div
        ref={setNodeRef}
        style={style}
        {...(isOverlay ? {} : attributes)}
        {...(isOverlay ? {} : listeners)}
        className={styles.imageContainer}
      >
        <Image
          src={`/images/gerador/${imageSrc}`}
          width={1919}
          height={90}
          alt={data.title}
          className={styles.carouselImage}
        />
        {selected && <div className={styles.selectedOverlay} />}
      </div>
    </div>
  );
}

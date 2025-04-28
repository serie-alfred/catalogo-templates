'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ImageItem } from '@/app/components/interface';
import styles from './styles/renderPreview.module.css';

interface DraggablePreviewListProps {
  items: { id: string; layoutKey: string }[];
  setItems: React.Dispatch<React.SetStateAction<{ id: string; layoutKey: string }[]>>;
  isMobile: boolean;
}

interface SortableItemProps {
  item: ImageItem;
  id: string;
  selectedImageId: string | null;
  isMobile: boolean;
}

function SortableItem({ item, id, selectedImageId, isMobile }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const imageSrc = isMobile ? item.mobile : item.image;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.imageContainer}>
      <img src={`/layouts/${imageSrc?.split('/').pop()}`} className={styles.carouselImage} />
    </div>
  );
}

export default function DraggablePreviewList({ items, setItems, isMobile }: DraggablePreviewListProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((i) => `${i.layoutKey}-${i.id}` === active.id);
      const newIndex = items.findIndex((i) => `${i.layoutKey}-${i.id}` === over?.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  // 👉 Função para duplicar o item
  const handleDuplicate = (index: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(index + 1, 0, { ...prevItems[index] }); // Duplica logo após o original
      return newItems;
    });
  };

  // 👉 Função para remover o item
  const handleRemove = (index: number) => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.splice(index, 1); // Remove o item
      return newItems;
    });
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext
        items={items.map((i) => `${i.layoutKey}-${i.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((selected, index) => {
          const item = (require('@/app/components/data').LAYOUTS[selected.layoutKey]?.items || []).find(
            (i: ImageItem) => i.id === selected.id
          );
          return (
            item && (
              <div key={`${selected.layoutKey}-${selected.id}-${index}`} className={styles.containerImg}>
                <SortableItem
                  id={`${selected.layoutKey}-${selected.id}`}
                  item={item}
                  selectedImageId={selected.id}
                  isMobile={isMobile}
                />
                <div className={styles.buttonContainer}>
                  <button className={styles.duplicateBtn} onClick={() => handleDuplicate(index)}>+</button>
                  <button className={styles.remoteBtn} onClick={() => handleRemove(index)}>-</button>
                </div>
              </div>
            )
          );
        })}
      </SortableContext>
    </DndContext>
  );
}

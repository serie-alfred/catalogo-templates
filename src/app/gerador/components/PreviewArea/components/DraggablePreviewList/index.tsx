'use client';

import React from 'react';
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

import styles from './styles.module.css';
import { LAYOUTS, LayoutKey, LayoutItem } from '@/app/data/data';
import { LayoutSelection } from '@/app/gerador/hooks/useLayoutGenerator';

interface DraggablePreviewListProps {
  items: LayoutSelection[];
  setItems: React.Dispatch<React.SetStateAction<LayoutSelection[]>>;
  isMobile: boolean;
}

interface SortableItemProps {
  id: string;
  item: LayoutItem & { layoutKey: LayoutKey };
  isSelected: boolean;
  isMobile: boolean;
}

function SortableItem({
  id,
  item,
  isSelected,
  isMobile,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const src = isMobile ? item.mobile : item.image;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.imageContainer}
    >
      <img
        src={`/layouts/${src.split('/').pop()}`}
        alt={item.title}
        className={styles.carouselImage}
      />
      {isSelected && <div className={styles.selectedOverlay} />}
    </div>
  );
}

export default function DraggablePreviewList({
  items,
  setItems,
  isMobile,
}: DraggablePreviewListProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: { active: any; over: any }) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(
        (i) => `${i.layoutKey}-${i.id}` === active.id
      );
      const newIndex = items.findIndex(
        (i) => `${i.layoutKey}-${i.id}` === over.id
      );
      if (oldIndex !== -1 && newIndex !== -1) {
        setItems((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    }
  }

  const handleDuplicate = (index: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, { ...prev[index] });
      return copy;
    });
  };

  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => `${i.layoutKey}-${i.id}`)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((selection, index) => {
          const section = LAYOUTS[selection.layoutKey];
          const found = section.items.find((it) => it.id === selection.id);
          if (!found) return null;

          const layoutItemWithKey = {
            ...found,
            layoutKey: selection.layoutKey,
          } as LayoutItem & { layoutKey: LayoutKey };

          const nodeId = `${selection.layoutKey}-${selection.id}`;
          const isSelected = items.some(
            (s) =>
              s.id === selection.id && s.layoutKey === selection.layoutKey
          );

          return (
            <div
              key={`${nodeId}-${index}`}
              className={styles.containerImg}
            >
              <SortableItem
                id={nodeId}
                item={layoutItemWithKey}
                isSelected={isSelected}
                isMobile={isMobile}
              />
              <div className={styles.buttonContainer}>
                <button
                  className={styles.duplicateBtn}
                  onClick={() => handleDuplicate(index)}
                >
                  +
                </button>
                <button
                  className={styles.remoteBtn}
                  onClick={() => handleRemove(index)}
                >
                  –
                </button>
              </div>
            </div>
          );
        })}
      </SortableContext>
    </DndContext>
  );
}

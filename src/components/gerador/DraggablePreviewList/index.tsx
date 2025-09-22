import React, { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { LAYOUTS, LayoutKey, LayoutItem } from '@/data/layoutData';
import { LayoutSelection } from '@/hooks/useLayoutGenerator';

import styles from './index.module.css';
import SortableItem from '../SortableItem';
import { iconsGenerator } from '@/assets/icons/generator';

interface DraggablePreviewListProps {
  items: LayoutSelection[];
  setItems: React.Dispatch<React.SetStateAction<LayoutSelection[]>>;
  isMobile: boolean;
  selectedPage: string;
}

export default function DraggablePreviewList({
  items,
  setItems,
  isMobile,
  selectedPage,
}: DraggablePreviewListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const getPriorityOrder = (key: LayoutKey) => {
    if (key === 'header') return 0;
    if (key === 'footer') return 2;
    return 1;
  };

  const filteredItems = useMemo(
    () =>
      items.filter(item => {
        // regra: "spot" só aparece em "common"
        if (item.layoutKey === 'spot' && selectedPage !== 'common') {
          return false;
        }

        // regra do breadcrumb na home
        if (
          item.layoutKey === 'breadcrumb' &&
          selectedPage === 'home' &&
          item.pagina === 'common'
        ) {
          return false;
        }

        // regra padrão: renderiza se a página for a selecionada ou for "common"
        return item.pagina === selectedPage || item.pagina === 'common';
      }),
    [items, selectedPage]
  );

  const sortedItems = useMemo(
    () =>
      [...filteredItems].sort(
        (a, b) => getPriorityOrder(a.layoutKey) - getPriorityOrder(b.layoutKey)
      ),
    [filteredItems]
  );

  const sortableItemIds = useMemo(
    () => sortedItems.map(item => item.uid),
    [sortedItems]
  );

  const selectedItemIds = useMemo(
    () => new Set(items.map(item => item.uid)),
    [items]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveId(null);

      if (!over || active.id === over.id) return;

      const oldIndex = items.findIndex(item => item.uid === active.id);
      const newIndex = items.findIndex(item => item.uid === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      setItems(prevItems => arrayMove(prevItems, oldIndex, newIndex));
    },
    [items, setItems]
  );

  const duplicateItem = useCallback(
    (itemToDuplicate: LayoutSelection) => {
      setItems(prevItems => {
        const index = prevItems.findIndex(i => i.uid === itemToDuplicate.uid);
        if (index === -1) return prevItems;

        const duplicatedItem = {
          ...prevItems[index],
          uid: crypto.randomUUID(),
        };

        return [
          ...prevItems.slice(0, index + 1),
          duplicatedItem,
          ...prevItems.slice(index + 1),
        ];
      });
    },
    [setItems]
  );

  const removeItem = useCallback(
    (uidToRemove: string) => {
      setItems(prevItems => prevItems.filter(item => item.uid !== uidToRemove));
    },
    [setItems]
  );

  const activeItem = useMemo(() => {
    if (!activeId) return null;
    const current = items.find(i => i.uid === activeId);
    if (!current) return null;

    const section = LAYOUTS[current.layoutKey];
    const layoutItem = section.items.find(it => it.id === current.id);
    if (!layoutItem) return null;

    return {
      ...layoutItem,
      layoutKey: current.layoutKey,
    } as LayoutItem & { layoutKey: LayoutKey };
  }, [activeId, items]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortableItemIds}
        strategy={verticalListSortingStrategy}
      >
        {sortedItems.map(item => {
          const section = LAYOUTS[item.layoutKey];
          const layoutItem = section.items.find(it => it.id === item.id);
          if (!layoutItem) return null;

          const itemData = {
            ...layoutItem,
            layoutKey: item.layoutKey,
          } as LayoutItem & {
            layoutKey: LayoutKey;
          };

          const isSelected = selectedItemIds.has(item.uid);

          return (
            <div key={item.uid} className={styles.containerImg}>
              <SortableItem
                id={item.uid}
                data={itemData}
                selected={isSelected}
                isMobile={isMobile}
              />
              <div className={styles.buttonContainer}>
                {![
                  'categoryMain',
                  'header',
                  'footer',
                  'breadcrumb',
                  'spot',
                ].includes(item.layoutKey) && (
                  <button
                    className={styles.duplicateBtn}
                    onClick={() => duplicateItem(item)}
                    type="button"
                  >
                    {iconsGenerator.duplicateTheme}
                  </button>
                )}

                <button
                  className={styles.remoteBtn}
                  onClick={() => removeItem(item.uid)}
                  type="button"
                >
                  {iconsGenerator.deleteTheme}
                </button>
              </div>
            </div>
          );
        })}
      </SortableContext>

      <DragOverlay>
        {activeItem && (
          <div style={{ transform: 'scale(1)', transformOrigin: 'top' }}>
            <SortableItem
              id={activeId}
              data={activeItem}
              selected={false}
              isMobile={isMobile}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

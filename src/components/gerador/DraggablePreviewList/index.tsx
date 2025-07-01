import React from 'react';

import type { DragEndEvent } from '@dnd-kit/core';
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
import { LAYOUTS, LayoutKey, LayoutItem } from '@/data/layoutData';
import { LayoutSelection } from '@/hooks/useLayoutGenerator';
import Image from 'next/image';

import styles from './index.module.css';

interface DraggablePreviewListProps {
  items: LayoutSelection[];
  setItems: React.Dispatch<React.SetStateAction<LayoutSelection[]>>;
  isMobile: boolean;
  selectedPage: string;
}

interface SortableItemProps {
  id: string;
  itemData: LayoutItem & { layoutKey: LayoutKey };
  isSelected: boolean;
  isMobile: boolean;
}

/**
 * SortableItem é um item individual que pode ser arrastado dentro da lista.
 * Ele utiliza o hook useSortable do dnd-kit/sortable para habilitar a funcionalidade de arrastar e soltar.
 */
function SortableItem({
  id,
  itemData,
  isSelected,
  isMobile,
}: SortableItemProps) {
  const {
    attributes, // Atributos para aplicar ao elemento do item
    listeners, // Listeners de eventos (drag) para aplicar ao elemento do item
    setNodeRef, // Referência ao nó do DOM do item
    transform, // Transformações CSS para mover o item durante o arrasto
    transition, // Transições CSS para animações suaves
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const imageSource = isMobile ? itemData.mobile : itemData.image;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.imageContainer}
    >
      <Image
        src={`/images/gerador/${imageSource}`}
        width={1919}
        height={90}
        alt={itemData.title}
        className={styles.carouselImage}
      />
      {isSelected && <div className={styles.selectedOverlay} />}
    </div>
  );
}

/**
 * DraggablePreviewList é um componente que renderiza uma lista de itens arrastáveis.
 * Ele utiliza o DndContext e SortableContext do dnd-kit para gerenciar o estado do drag-and-drop.
 */
export default function DraggablePreviewList({
  items,
  setItems,
  isMobile,
  selectedPage,
}: DraggablePreviewListProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  /**
   * handleDragEnd é chamado quando uma operação de arrastar e soltar termina.
   * Ele atualiza a ordem dos itens na lista se o item for solto sobre outro item válido.
   */

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.uid === active.id);
      const newIndex = items.findIndex(item => item.uid === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setItems(prevItems => arrayMove(prevItems, oldIndex, newIndex));
      }
    }
  }

  /**
   * handleDuplicate duplica um item na lista.
   * @param index - O índice do item a ser duplicado.
   */
  const handleDuplicate = (itemToDuplicate: LayoutSelection) => {
    setItems(prevItems => {
      const index = prevItems.findIndex(
        item => item.uid === itemToDuplicate.uid
      );
      if (index === -1) return prevItems;

      const updatedItems = [...prevItems];
      updatedItems.splice(index + 1, 0, {
        ...prevItems[index],
        uid: crypto.randomUUID(), // 👈 novo ID exclusivo
      });

      return updatedItems;
    });
  };

  /**
   * handleRemove remove um item da lista.
   * @param uidToRemove - O UID do item a ser removido.
   */
  const handleRemove = (uidToRemove: string) => {
    setItems(prevItems => prevItems.filter(item => item.uid !== uidToRemove));
  };

  // Filtra os itens para exibir apenas aqueles que correspondem à página selecionada
  const itemsToDisplay = items
    .filter(item => item.pagina === selectedPage || item.pagina === 'common')
    .sort((a, b) => {
      // Prioridade: header primeiro, footer por último
      const order = (key: LayoutKey) => {
        if (key === 'header') return 0;
        if (key === 'footer') return 2;
        return 1; // todos os outros
      };
      return order(a.layoutKey) - order(b.layoutKey);
    });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={itemsToDisplay.map(item => item.uid)}
        strategy={verticalListSortingStrategy}
      >
        {itemsToDisplay.map(item => {
          const section = LAYOUTS[item.layoutKey];
          const foundItem = section.items.find(it => it.id === item.id);
          if (!foundItem) return null;

          const layoutItemWithKey = {
            ...foundItem,
            layoutKey: item.layoutKey,
          } as LayoutItem & { layoutKey: LayoutKey };

          const uniqueId = item.uid;
          const isCurrentlySelected = items.some(
            selectedItem =>
              selectedItem.id === item.id &&
              selectedItem.layoutKey === item.layoutKey
          );

          return (
            <div key={uniqueId} className={styles.containerImg}>
              <SortableItem
                id={uniqueId}
                itemData={layoutItemWithKey}
                isSelected={isCurrentlySelected}
                isMobile={isMobile}
              />
              <div className={styles.buttonContainer}>
                <button
                  className={styles.duplicateBtn}
                  onClick={() => handleDuplicate(item)}
                >
                  +
                </button>
                <button
                  className={styles.remoteBtn}
                  onClick={() => handleRemove(item.uid)}
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

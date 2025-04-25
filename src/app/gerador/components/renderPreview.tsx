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
import styles from './styles/renderPreview.module.css';
import type { ImageItem } from '@/app/components/interface';

interface PreviewListProps {
  selectedImages: ImageItem[];
  setSelectedImages: (images: ImageItem[]) => void;
  isMobile?: boolean;
}

export default function PreviewList({ selectedImages, setSelectedImages, isMobile }: PreviewListProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = selectedImages.findIndex((i) => i.id === active.id);
      const newIndex = selectedImages.findIndex((i) => i.id === over?.id);
      const reordered = arrayMove(selectedImages, oldIndex, newIndex);
      setSelectedImages(reordered);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={selectedImages.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        {selectedImages.map((item) => (
          <SortablePreviewItem key={item.id} item={item} isMobile={isMobile} />
        ))}
      </SortableContext>
    </DndContext>
  );
}

function SortablePreviewItem({ item, isMobile }: { item: ImageItem; isMobile?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const rawImagePath = isMobile && item.mobile ? item.mobile : item.image;
  const imageFileName = rawImagePath.split('/').pop();
  const imageSrc = `/layouts/${imageFileName}`;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={styles.imageContainer}>
      <img src={imageSrc} alt={item.title || 'Preview'} className={styles.carouselImage} />
    </div>
  );
}

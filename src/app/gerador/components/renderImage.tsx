'use client';

import React from 'react';
import { LAYOUTS } from '../../data/data';
import styles from './styles/renderImage.module.css';
import { ImageItem, RenderImageProps } from '@/app/components/interface';


type ImageWithLayout = ImageItem & { layoutKey: string };


const RenderImage: React.FC<RenderImageProps> = ({ activeLayoutKey, selectedImages, onSelect }) => {
  const imageBasePath = "/layouts/";

  const allImages: ImageWithLayout[] = Object.entries(LAYOUTS)
    .flatMap(([layoutKey, layout]) =>
      (layout.items || []).map(item => ({ ...item, layoutKey }))
    );

  const imagesToShow = activeLayoutKey
    ? (LAYOUTS[activeLayoutKey as keyof typeof LAYOUTS]?.items || []).map(item => ({ ...item, layoutKey: activeLayoutKey }))
    : allImages;

  const isSelected = (id: string, layoutKey: string) =>
    selectedImages.some(img => img.id === id && img.layoutKey === layoutKey);

  return (
    <div className={styles.carousel} id="options-list">
      {imagesToShow.map((item) => (
        <div
          key={`${item.layoutKey}-${item.id}`} 
          onClick={() => onSelect(item.id, item.layoutKey)}
          className={`${styles.imageContainer} ${isSelected(item.id, item.layoutKey) ? styles.selected : ''}`}
        >
          <img
            src={`${imageBasePath}${item.image.split('/').pop()}`}
            alt={item.title || 'Imagem'}
            className={styles.carouselImage}
          />
          <div
            className={`${styles.infoContainer} ${isSelected(item.id, item.layoutKey) ? styles.selectedInfo : ''}`}
          >
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
};


export default RenderImage;

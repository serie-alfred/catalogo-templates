'use client';

import React from 'react';
import { LAYOUTS } from '../../components/data';
import styles from './styles/renderImage.module.css';
import { ImageItem, RenderImageProps } from '@/app/components/interface';


type ImageWithLayout = ImageItem & { layoutKey: string };

const RenderImage: React.FC<RenderImageProps> = ({ activeLayoutKey, selectedImageId, onSelect }) => {
  const imageBasePath = "/layouts/";


  const allImages: ImageWithLayout[] = Object.entries(LAYOUTS)
    .flatMap(([layoutKey, layout]) =>
      (layout.items || []).map(item => ({ ...item, layoutKey }))
    );

  const imagesToShow = activeLayoutKey
    ? (LAYOUTS[activeLayoutKey as keyof typeof LAYOUTS]?.items || []).map(item => ({ ...item, layoutKey: activeLayoutKey }))
    : allImages;

  return (
    <div className={styles.carousel} id="options-list">
      {imagesToShow.map((item) => (
        <div
          key={`${item.layoutKey}-${item.id}`} 
          onClick={() => onSelect(item.id, item.layoutKey)}
          className={`${styles.imageContainer} ${item.id === selectedImageId ? styles.selected : ''}`}
        >
          <img
            src={`${imageBasePath}${item.image.split('/').pop()}`}
            alt={item.title || 'Imagem'}
            className={styles.carouselImage}
          />
          <div
            className={`${styles.infoContainer} ${item.id === selectedImageId ? styles.selectedInfo : ''}`}
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

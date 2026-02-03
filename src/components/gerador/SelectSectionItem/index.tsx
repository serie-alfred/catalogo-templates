import React from 'react';

import { LAYOUTS, LayoutKey, LayoutItem, Pagina } from '@/data/layoutData';
import { LayoutSelection } from '@/hooks/useLayoutGenerator';
import Image from 'next/image';

import styles from './index.module.css';
import type { Platform } from '@/types/platform';

interface SelectSectionItemProps {
  activeLayoutKey: LayoutKey | null;
  selectedImages: LayoutSelection[];
  onSelect: (id: string, layoutKey: LayoutKey) => void;
  selectedPage: string;
  platform: Platform | null;
}

export default function SelectSectionItem({
  activeLayoutKey,
  selectedImages,
  onSelect,
  selectedPage,
  platform,
}: SelectSectionItemProps) {
  const imageBasePath = '/images/gerador/';

  const allImages: (LayoutItem & { layoutKey: LayoutKey })[] = (
    Object.entries(LAYOUTS) as [LayoutKey, (typeof LAYOUTS)[LayoutKey]][]
  ).flatMap(([layoutKey, section]) =>
    section.items.map(item => ({ ...item, layoutKey }))
  );

  let imagesToShow = activeLayoutKey
    ? LAYOUTS[activeLayoutKey].items.map(item => ({
        ...item,
        layoutKey: activeLayoutKey,
      }))
    : allImages;

  imagesToShow = imagesToShow.filter(
    item =>
      Array.isArray(item.pagina) &&
      item.pagina.includes(selectedPage as Pagina) &&
      item.platforms.includes(platform as Platform)
  );

  const isSelected = (id: string, layoutKey: LayoutKey) =>
    selectedImages.some(img => img.id === id && img.layoutKey === layoutKey);

  return (
    <div className={styles.carousel} id="options-list">
      {imagesToShow.map(item => (
        <div
          key={`${item.layoutKey}-${item.id}`}
          onClick={() => onSelect(item.id, item.layoutKey)}
          className={`${styles.imageContainer} ${
            isSelected(item.id, item.layoutKey) ? styles.selected : ''
          }`}
        >
          <div className={styles.carouselImage}>
            <Image
              src={
                item.image
                  ? `${imageBasePath}${item.image}`
                  : 'https://placehold.co/371x96/png'
              }
              alt={item.title}
              width={371}
              height={96}
            />
          </div>

          <div
            className={`${styles.infoContainer} ${
              isSelected(item.id, item.layoutKey) ? styles.selectedInfo : ''
            }`}
          >
            <h2>{item.title}</h2>
            <div>
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="27.3333"
                  height="27.3333"
                  rx="13.6667"
                  fill="#E6F9FF"
                />
                <path
                  d="M9 13.6667H18.3333M13.6667 9V18.3333"
                  stroke="#003073"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

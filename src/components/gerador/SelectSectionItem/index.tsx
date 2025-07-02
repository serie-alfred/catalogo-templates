import React from 'react';

import { LAYOUTS, LayoutKey, LayoutItem, Pagina } from '@/data/layoutData';
import { LayoutSelection } from '@/hooks/useLayoutGenerator';
import Image from 'next/image';

import styles from './index.module.css';
import { CirclePlus } from 'lucide-react';
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

  // Monta um array de todos os itens, cada um com sua layoutKey
  const allImages: (LayoutItem & { layoutKey: LayoutKey })[] = (
    Object.entries(LAYOUTS) as [LayoutKey, (typeof LAYOUTS)[LayoutKey]][]
  ).flatMap(([layoutKey, section]) =>
    section.items.map(item => ({ ...item, layoutKey }))
  );

  // Se tiver aba ativa, filtra só aquela seção; senão, mostra tudo
  let imagesToShow = activeLayoutKey
    ? LAYOUTS[activeLayoutKey].items.map(item => ({
        ...item,
        layoutKey: activeLayoutKey,
      }))
    : allImages;

  // Filtrar por página selecionada
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
          <div className={`${styles.icon}`}>
            <CirclePlus size={24} color="white" />
          </div>

          <Image
            src={`${imageBasePath}${item.image}`}
            alt={item.title}
            width={1919}
            height={90}
            className={styles.carouselImage}
          />

          <div
            className={`${styles.infoContainer} ${
              isSelected(item.id, item.layoutKey) ? styles.selectedInfo : ''
            }`}
          >
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

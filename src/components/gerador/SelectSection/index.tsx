'use client';

import React from 'react';
import {
  LAYOUTS,
  LayoutKey,
  LayoutSection,
  type Pagina,
} from '@/data/layoutData';

import styles from './index.module.css';

interface SelectSectionProps {
  activeLayoutKey: LayoutKey | null;
  setActiveLayoutKey: (key: LayoutKey) => void;
  selectedPage: string;
}

interface LayoutTab {
  layoutKey: LayoutKey;
  name: string;
}

export default function SelectSection({
  activeLayoutKey,
  setActiveLayoutKey,
  selectedPage,
}: SelectSectionProps) {
  // Transforma LAYOUTS em um array de [chave, seção] já tipado
  const entries = Object.entries(LAYOUTS) as [LayoutKey, LayoutSection][];

  // Só pega as seções que têm items e monta { layoutKey, name }
  const layoutTabs: LayoutTab[] = entries
    .filter(([, section]) =>
      section.items.some(item => item.pagina.includes(selectedPage as Pagina))
    )
    .map(([layoutKey, section]) => ({
      layoutKey,
      name: section.name,
    }));

  return (
    <div className={styles.tabs} id="dynamic-tabs">
      {layoutTabs.map(({ layoutKey, name }) => (
        <button
          key={layoutKey}
          onClick={() => setActiveLayoutKey(layoutKey)}
          className={layoutKey === activeLayoutKey ? styles.active : ''}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

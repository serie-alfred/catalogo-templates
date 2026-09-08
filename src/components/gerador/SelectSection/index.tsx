'use client';

import React, { useEffect } from 'react';
import {
  LAYOUTS,
  LayoutKey,
  LayoutSection,
  type Pagina,
} from '@/data/layoutData';
import type { Platform } from '@/types/platform';

import styles from './index.module.css';

interface SelectSectionProps {
  activeLayoutKey: LayoutKey | null;
  setActiveLayoutKey: (key: LayoutKey) => void;
  selectedPage: string;
  platform: Platform | null;
}

/**
 * Categorias do catálogo, com a contagem de modelos disponíveis.
 *
 * O filtro combina página E plataforma — o mesmo par que o SelectSectionItem
 * usa para montar a grade. Antes daqui só sair o filtro de página, existiam
 * categorias que abriam uma lista vazia.
 */
export default function SelectSection({
  activeLayoutKey,
  setActiveLayoutKey,
  selectedPage,
  platform,
}: SelectSectionProps) {
  const entries = Object.entries(LAYOUTS) as [LayoutKey, LayoutSection][];

  const tabs = entries
    .map(([layoutKey, section]) => ({
      layoutKey,
      name: section.name,
      count: section.items.filter(
        item =>
          item.pagina.includes(selectedPage as Pagina) &&
          (platform ? item.platforms.includes(platform) : false)
      ).length,
    }))
    .filter(tab => tab.count > 0);

  /**
   * Mantém a categoria ativa dentro do que existe.
   *
   * O `focusedKey` inicial é `Object.keys(LAYOUTS)[0]`, escolhido sem olhar
   * página nem plataforma (useLayoutGenerator), e trocar de página ou de
   * plataforma também não o reposiciona — nos dois casos a grade de modelos
   * abria vazia apontando para uma categoria que não existe aqui.
   */
  const activeIsAvailable = tabs.some(tab => tab.layoutKey === activeLayoutKey);
  useEffect(() => {
    if (!activeIsAvailable && tabs.length > 0) {
      setActiveLayoutKey(tabs[0].layoutKey);
    }
  }, [activeIsAvailable, tabs, setActiveLayoutKey]);

  return (
    <div className={styles.tabs} id="dynamic-tabs">
      {tabs.map(({ layoutKey, name, count }) => (
        <button
          key={layoutKey}
          type="button"
          onClick={() => setActiveLayoutKey(layoutKey)}
          className={layoutKey === activeLayoutKey ? styles.active : ''}
        >
          {name} ({count})
        </button>
      ))}
    </div>
  );
}

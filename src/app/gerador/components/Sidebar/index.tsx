'use client';

import React from 'react';
import styles from './styles.module.css';
import PlatformSelect from './components/PlatformSelect';
import ProgressBar from './components/ProgressBar';
import SelectSection from './components/SelectSection';
import SelectSectionItem from './components/SelectSectionItem';

import { LayoutKey } from '@/app/data/data';
import { LayoutSelection } from '@/app/gerador/hooks/useLayoutGenerator';

export interface SidebarProps {
  /** itens já selecionados */
  selectedImages: LayoutSelection[];
  /** aba atualmente ativa */
  activeLayoutKey: LayoutKey | null;
  /** muda a aba ativa */
  setActiveLayoutKey: (key: LayoutKey) => void;
  /** erro de plataforma não escolhida */
  showError: boolean;
  /** plataforma selecionada (VTEX, Shopify, etc) */
  plataforma: string;
  /** callback ao mudar plataforma */
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** callback ao selecionar/deselecionar um template */
  onImageSelect: (id: string, layoutKey: LayoutKey) => void;
  /** quantas seções existem no total (padrão 8) */
  totalSections?: number;
}

export default function Sidebar({
  selectedImages,
  activeLayoutKey,
  setActiveLayoutKey,
  showError,
  plataforma,
  onSelectChange,
  onImageSelect,
  totalSections = 8,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <PlatformSelect
        value={plataforma}
        showError={showError}
        onChange={onSelectChange}
      />

      <ProgressBar current={selectedImages.length} total={totalSections} />

      <SelectSection
        activeLayoutKey={activeLayoutKey}
        setActiveLayoutKey={setActiveLayoutKey}
      />

      <div id="options-container" className={styles['options-container']}>
        <h3>Selecione um modelo</h3>
        <SelectSectionItem
          activeLayoutKey={activeLayoutKey}
          selectedImages={selectedImages}
          onSelect={onImageSelect}
        />
      </div>
    </aside>
  );
}

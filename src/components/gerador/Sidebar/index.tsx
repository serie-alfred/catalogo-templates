import React from 'react';

import PlatformSelect from '../PlatformSelect';
import ProgressBar from '../ProgressBar';
import SelectPage from '../SelectPage';
import SelectSection from '../SelectSection';
import SelectSectionItem from '../SelectSectionItem';

import { LayoutKey } from '@/data/layouts/layoutData';
import { LayoutSelection } from '@/hooks/useLayoutGenerator';

import styles from './index.module.css';

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
  onImageSelect: (id: string, layoutKey: LayoutKey, pagina: string) => void;
  /** quantas seções existem no total (padrão 8) */
  totalSections?: number;
  selectedPage: string;       // Adicionado
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>; // Adicionado
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
  selectedPage,
  setSelectedPage,
}: SidebarProps) {

  return (
    <aside className={styles.sidebar}>
      <PlatformSelect
        value={plataforma}
        showError={showError}
        onChange={onSelectChange}
      />

      <ProgressBar current={selectedImages.length} total={totalSections} />

      <h3>Selecione uma página</h3>
      <SelectPage selectedPage={selectedPage} setSelectedPage={setSelectedPage} />

      <h3>Selecione um componente</h3>
      <SelectSection
        activeLayoutKey={activeLayoutKey}
        setActiveLayoutKey={setActiveLayoutKey}
      />

      <div id="options-container" className={styles['options-container']}>
        <h3>Selecione um modelo</h3>
        <SelectSectionItem
          activeLayoutKey={activeLayoutKey}
          selectedImages={selectedImages}
          onSelect={(id, layoutKey) => onImageSelect(id, layoutKey, selectedPage)}
          selectedPage={selectedPage}
        />
      </div>
    </aside>
  );
}
import React from 'react';

import PlatformSelect from '../PlatformSelect';
import ProgressBar from '../ProgressBar';
import SelectPage from '../SelectPage';
import SelectSection from '../SelectSection';
import SelectSectionItem from '../SelectSectionItem';

import { LayoutKey } from '@/data/layoutData';
import { LayoutSelection, MAX_PER_PAGE } from '@/hooks/useLayoutGenerator';
import { Platform } from '@/types/platform';

import styles from './index.module.css';

export interface SidebarProps {
  selectedImages: LayoutSelection[];
  activeLayoutKey: LayoutKey | null;
  setActiveLayoutKey: (key: LayoutKey) => void;
  showError: boolean;
  platform: Platform | null;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onImageSelect: (id: string, layoutKey: LayoutKey, pagina: string) => void;
  totalSections?: number;
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

export default function Sidebar({
  selectedImages,
  activeLayoutKey,
  setActiveLayoutKey,
  showError,
  platform,
  onSelectChange,
  onImageSelect,
  totalSections = MAX_PER_PAGE,
  selectedPage,
  setSelectedPage,
}: SidebarProps) {
  const isCommonPage = selectedPage === 'common';
  const currentCount = selectedImages.filter(
    item => item.pagina === selectedPage
  ).length;

  return (
    <aside className={styles.sidebar}>
      <PlatformSelect
        value={platform}
        showError={showError}
        onChange={onSelectChange}
      />

      <ProgressBar
        current={currentCount}
        isCommonPage={isCommonPage}
        total={totalSections}
      />

      <h3>Selecione uma página</h3>
      <SelectPage
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />

      <h3>Selecione um componente</h3>
      <SelectSection
        selectedPage={selectedPage}
        activeLayoutKey={activeLayoutKey}
        setActiveLayoutKey={setActiveLayoutKey}
      />

      <div id="options-container" className={styles['options-container']}>
        <h3>Selecione um modelo</h3>
        <SelectSectionItem
          activeLayoutKey={activeLayoutKey}
          selectedImages={selectedImages}
          onSelect={(id, layoutKey) =>
            onImageSelect(id, layoutKey, selectedPage)
          }
          selectedPage={selectedPage}
          platform={platform}
        />
      </div>
    </aside>
  );
}

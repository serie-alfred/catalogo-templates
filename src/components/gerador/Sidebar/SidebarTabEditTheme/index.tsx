import React from 'react';

import { LayoutKey } from '@/data/layoutData';
import { LayoutSelection } from '@/hooks/useLayoutGenerator';
import { Platform } from '@/types/platform';

import PlatformSelect from '../../PlatformSelect';
import ProgressBar from '../../ProgressBar';
import SelectPage from '../../SelectPage';
import SelectSection from '../../SelectSection';
import SelectSectionItem from '../../SelectSectionItem';

import styles from '../index.module.css';
import { iconsGenerator } from '@/assets/icons/generator';

interface Props {
  selectedImages: LayoutSelection[];
  activeLayoutKey: LayoutKey | null;
  setActiveLayoutKey: (key: LayoutKey) => void;
  showError: boolean;
  platform: Platform | null;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onImageSelect: (id: string, layoutKey: LayoutKey, pagina: string) => void;
  totalSections: number;
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

export default function SidebarTabEditTheme({
  selectedImages,
  activeLayoutKey,
  setActiveLayoutKey,
  showError,
  platform,
  onSelectChange,
  onImageSelect,
  totalSections,
  selectedPage,
  setSelectedPage,
}: Props) {
  const isCommonPage = selectedPage === 'common';
  const currentCount = selectedImages.filter(
    item => item.pagina === selectedPage
  ).length;

  return (
    <div className="sidebar__main">
      <div className="header">
        <div className="icon">{iconsGenerator.editTheme}</div>
      </div>
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
          onSelect={(id: string, layoutKey: LayoutKey) =>
            onImageSelect(id, layoutKey, selectedPage)
          }
          selectedPage={selectedPage}
          platform={platform}
        />
      </div>
    </div>
  );
}

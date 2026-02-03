import React from 'react';

import { LayoutKey } from '@/data/layoutData';
import { LayoutSelection } from '@/hooks/useLayoutGenerator';
import { Platform } from '@/types/platform';

import PlatformSelect from '../../PlatformSelect';
import SelectPage from '../../SelectPage';
import SelectSection from '../../SelectSection';
import SelectSectionItem from '../../SelectSectionItem';

import styles from '../index.module.css';

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
  selectedPage,
  setSelectedPage,
}: Props) {
  return (
    <div className={`${styles.sidebarGlobal} sidebar__main`}>
      <div className={styles.wrapper}>
        <PlatformSelect
          value={platform}
          showError={showError}
          onChange={onSelectChange}
        />
        <SelectPage
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
        />
      </div>
      <div className={styles.wrapper}>
        <h3>Selecione um componente</h3>
        <SelectSection
          selectedPage={selectedPage}
          activeLayoutKey={activeLayoutKey}
          setActiveLayoutKey={setActiveLayoutKey}
        />
      </div>
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

'use client';
import React, { useState } from 'react';
import { LayoutKey } from '@/data/layoutData';
import { LayoutSelection, MAX_PER_PAGE } from '@/hooks/useLayoutGenerator';
import { Platform } from '@/types/platform';
import styles from './index.module.css';

import SidebarIcons from './SidebarIcons';
import SidebarHeader from './SidebarHeader';
import SidebarTabGlobal from './SidebarTabGlobal';
import SidebarTabRegister from './SidebarTabRegister';
import SidebarTabShare from './SidebarTabShare';
import SidebarTabEditTheme from './SidebarTabEditTheme';

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

type Tab = 'global' | 'build' | 'register' | 'share' | null;

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
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(null);

  const toggleTab = (tab: Tab) => {
    if (activeTab === tab && isOpen) {
      setIsOpen(false);
      setActiveTab(null);
    } else {
      setIsOpen(true);
      setActiveTab(tab);
    }
  };

  return (
    <aside
      className={`sidebar ${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      {!isOpen && <SidebarIcons toggleTab={toggleTab} />}

      {isOpen && (
        <div className={styles.content}>
          <SidebarHeader onClose={() => setIsOpen(false)} />

          {activeTab === 'global' && <SidebarTabGlobal />}
          {activeTab === 'build' && (
            <SidebarTabEditTheme
              selectedImages={selectedImages}
              activeLayoutKey={activeLayoutKey}
              setActiveLayoutKey={setActiveLayoutKey}
              showError={showError}
              platform={platform}
              onSelectChange={onSelectChange}
              onImageSelect={onImageSelect}
              totalSections={totalSections}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          )}
          {activeTab === 'register' && <SidebarTabRegister />}
          {activeTab === 'share' && <SidebarTabShare />}
        </div>
      )}
    </aside>
  );
}

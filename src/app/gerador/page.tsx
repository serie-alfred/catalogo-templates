'use client';

import React, { useState } from 'react';

import Sidebar from '@/components/gerador/Sidebar';
import PreviewArea from '@/components/gerador/PreviewArea';
import DesktopOnlyNotice from '@/components/gerador/DesktopOnlyNotice';

import styles from './index.module.css';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useLayout } from '@/context/LayoutContext';

export default function GeradorPage() {
  const isMobile = useIsMobile();

  const {
    selections,
    focusedKey,
    platform,
    showPlatformError,
    isMobileView,
    desktopPreviewRef,
    mobilePreviewRef,
    setFocusedKey,
    toggleMobileView,
    handlePlatformChange,
    toggleSelection,
    exportLayout,
    setSelections,
  } = useLayout();

  const [selectedPage, setSelectedPage] = useState<string>('home');

  if (isMobile) {
    return <DesktopOnlyNotice />;
  }

  return (
    <div className={styles.main}>
      <Sidebar
        selectedImages={selections}
        activeLayoutKey={focusedKey}
        setActiveLayoutKey={setFocusedKey}
        showError={showPlatformError}
        platform={platform}
        onSelectChange={handlePlatformChange}
        onImageSelect={toggleSelection}
        totalSections={8}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />

      <PreviewArea
        selectedImages={selections}
        setSelectedImages={setSelections}
        isMobile={isMobileView}
        onToggleMobile={toggleMobileView}
        onExport={exportLayout}
        desktopPreviewRef={desktopPreviewRef}
        mobilePreviewRef={mobilePreviewRef}
        selectedPage={selectedPage}
      />
    </div>
  );
}

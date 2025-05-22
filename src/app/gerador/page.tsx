'use client';

import React from 'react';
import styles from './style.module.css';

import Sidebar from './components/Sidebar';
import PreviewArea from './components/PreviewArea';
import { useLayoutGenerator } from './hooks/useLayoutGenerator';

export default function GeradorPage() {
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
  } = useLayoutGenerator();

  return (
    <div className={styles.main}>
      <Sidebar
        selectedImages={selections}
        activeLayoutKey={focusedKey}
        setActiveLayoutKey={setFocusedKey}
        showError={showPlatformError}
        plataforma={platform}
        onSelectChange={handlePlatformChange}
        onImageSelect={toggleSelection}
        totalSections={8}
      />

      <PreviewArea
        selectedImages={selections}
        setSelectedImages={setSelections}
        isMobile={isMobileView}
        onToggleMobile={toggleMobileView}
        onExport={exportLayout}
        desktopPreviewRef={desktopPreviewRef}
        mobilePreviewRef={mobilePreviewRef}
      />
    </div>
  );
}

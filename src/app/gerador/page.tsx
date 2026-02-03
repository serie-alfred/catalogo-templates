'use client';

import React, { useState } from 'react';

import Sidebar from '@/components/gerador/Sidebar';
import PreviewArea from '@/components/gerador/PreviewArea';
import DesktopOnlyNotice from '@/components/gerador/DesktopOnlyNotice';

import styles from './index.module.css';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useLayout } from '@/context/LayoutContext';
import { WakePopup } from '@/components/gerador/WakePopup';

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
    wakeCustomValue,
    setWakeCustomValue,
    showWakePopup,
    setShowWakePopup,
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
        onExport={exportLayout}
        isMobile={isMobileView}
        onToggleMobile={toggleMobileView}
      />

      <PreviewArea
        selectedImages={selections}
        setSelectedImages={setSelections}
        isMobile={isMobileView}
        desktopPreviewRef={desktopPreviewRef}
        mobilePreviewRef={mobilePreviewRef}
        selectedPage={selectedPage}
      />

      {showWakePopup && (
        <WakePopup
          wakeCustomValue={wakeCustomValue}
          setWakeCustomValue={setWakeCustomValue}
          onClose={() => setShowWakePopup(false)}
        />
      )}
    </div>
  );
}

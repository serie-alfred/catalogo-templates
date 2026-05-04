'use client';

import React, { useEffect, useRef, useState } from 'react';

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
    wakePopupRef,
  } = useLayout();

  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [isOpen, setIsOpen] = useState(false);
  const [prevCount, setPrevCount] = useState(selections.length);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    //verifica se tamanho atual e maior que o anterior, retorna boole
    const isAddition = selections.length > prevCount;

    if (bottomRef.current && isOpen && isAddition) {
      bottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }

    setPrevCount(selections.length);
  }, [selections.length, isOpen]);

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
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />

      <PreviewArea
        selectedImages={selections}
        setSelectedImages={setSelections}
        isMobile={isMobileView}
        desktopPreviewRef={desktopPreviewRef}
        mobilePreviewRef={mobilePreviewRef}
        selectedPage={selectedPage}
      />
      {isOpen && (
        <div
          ref={bottomRef}
          style={{
            height: isOpen ? '55vh' : '30px',
            width: '100%',
            pointerEvents: 'none',
          }}
        ></div>
      )}

      {showWakePopup && (
        <WakePopup
          wakeCustomValue={wakeCustomValue}
          setWakeCustomValue={setWakeCustomValue}
          onClose={() => setShowWakePopup(false)}
          setShowWakePopup={setShowWakePopup}
          wakePopupRef={wakePopupRef}
        />
      )}
    </div>
  );
}

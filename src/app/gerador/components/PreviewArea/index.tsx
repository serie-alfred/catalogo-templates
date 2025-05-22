'use client';

import React, { useRef } from 'react';
import styles from '../../style.module.css';
import DraggablePreviewList from './components/DraggablePreviewList';

import { LayoutSelection } from '@/app/gerador/hooks/useLayoutGenerator';

interface PreviewAreaProps {
  selectedImages: LayoutSelection[];
  setSelectedImages: React.Dispatch<React.SetStateAction<LayoutSelection[]>>;
  isMobile: boolean;
  onToggleMobile: () => void;
  onExport: (e: React.FormEvent) => Promise<void>;
  desktopPreviewRef: React.RefObject<HTMLDivElement | null>;
  mobilePreviewRef: React.RefObject<HTMLDivElement | null>;
}

export default function PreviewArea({
  selectedImages,
  setSelectedImages,
  isMobile,
  onToggleMobile,
  onExport,
  desktopPreviewRef,
  mobilePreviewRef,
}: PreviewAreaProps) {
  // ref apenas para renderização “in-page”
  const previewRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className={styles['preview-area']}>
      <header className={styles['preview-header']}>
        <h2>Visualização</h2>
        <div className={styles['preview-actions']}>
          <button id="export-btn" onClick={onExport}>
            Exportar Layout
          </button>
          <button id="toggle-mobile-btn" onClick={onToggleMobile}>
            {isMobile ? '🖥️ Visualizar Desktop' : '📱 Visualizar Mobile'}
          </button>
        </div>
      </header>

      <div className={isMobile ? styles.mobile : styles.desktop}>
        <div ref={previewRef}>
          <DraggablePreviewList
            items={selectedImages}
            setItems={setSelectedImages}
            isMobile={isMobile}
          />
        </div>
      </div>

      {/* pré-renders escondidos para captura */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div
          ref={desktopPreviewRef}
          style={{ background: 'white', padding: '10px', width: '100%' }}
        >
          <DraggablePreviewList
            items={selectedImages}
            setItems={setSelectedImages}
            isMobile={false}
          />
        </div>
        <div
          ref={mobilePreviewRef}
          style={{ background: 'white', padding: '10px', width: '375px' }}
        >
          <DraggablePreviewList
            items={selectedImages}
            setItems={setSelectedImages}
            isMobile={true}
          />
        </div>
      </div>
    </main>
  );
}

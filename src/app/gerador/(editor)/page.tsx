'use client';

import React from 'react';

import EditorRail from '@/components/gerador/EditorRail';
import EditorLeftPanel from '@/components/gerador/EditorLeftPanel';
import EditorTopbar from '@/components/gerador/EditorTopbar';
import EditorCanvas from '@/components/gerador/EditorCanvas';
import EditorRightPanel from '@/components/gerador/EditorRightPanel';
import ExportStage from '@/components/gerador/ExportStage';
import DesktopOnlyNotice from '@/components/gerador/DesktopOnlyNotice';

import styles from './index.module.css';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useLayout } from '@/context/LayoutContext';
import { WakePopup } from '@/components/gerador/WakePopup';

export default function GeradorPage() {
  const isMobile = useIsMobile();

  const {
    wakeCustomValue,
    setWakeCustomValue,
    showWakePopup,
    setShowWakePopup,
    wakePopupRef,
  } = useLayout();

  if (isMobile) {
    return <DesktopOnlyNotice />;
  }

  return (
    <>
      <div className={`ed-shell ${styles.shell}`}>
        <EditorRail />
        <EditorLeftPanel />

        <div className={styles.center}>
          <EditorTopbar />
          <EditorCanvas />
        </div>

        <EditorRightPanel />

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

      {/* Fora do shell: ele é `overflow: hidden` e recortaria o palco
          off-screen do export, que fica em top/left -99999px. */}
      <ExportStage />
    </>
  );
}

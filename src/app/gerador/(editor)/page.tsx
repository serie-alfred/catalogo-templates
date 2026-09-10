'use client';

import React from 'react';

import EditorRail from '@/components/gerador/EditorRail';
import EditorLeftPanel from '@/components/gerador/EditorLeftPanel';
import EditorTopbar from '@/components/gerador/EditorTopbar';
import EditorCanvas from '@/components/gerador/EditorCanvas';
import EditorRightPanel from '@/components/gerador/EditorRightPanel';
import ExportStage from '@/components/gerador/ExportStage';
import PanelToggle from '@/components/gerador/PanelToggle';
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
    leftCollapsed,
    setLeftCollapsed,
    rightCollapsed,
    setRightCollapsed,
  } = useLayout();

  if (isMobile) {
    return <DesktopOnlyNotice />;
  }

  return (
    <>
      <div
        className={`ed-shell ${styles.shell}`}
        data-left-collapsed={leftCollapsed ? 'true' : undefined}
        data-right-collapsed={rightCollapsed ? 'true' : undefined}
      >
        <EditorRail className={styles.rail} />
        {!leftCollapsed && <EditorLeftPanel className={styles.left} />}

        {/* Cada toggle vem logo depois do painel que controla. Os dois são
            `position: absolute` num shell `relative`, então a ordem no DOM é
            neutra em layout — mas é ela que dá a ordem de Tab. Juntos no fim,
            eles caíam depois de tudo, inclusive do painel direito. */}
        <PanelToggle
          side="left"
          collapsed={leftCollapsed}
          onToggle={() => setLeftCollapsed(prev => !prev)}
        />

        <div className={styles.center}>
          <EditorTopbar />
          <EditorCanvas />
        </div>

        {!rightCollapsed && <EditorRightPanel className={styles.right} />}

        <PanelToggle
          side="right"
          collapsed={rightCollapsed}
          onToggle={() => setRightCollapsed(prev => !prev)}
        />

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

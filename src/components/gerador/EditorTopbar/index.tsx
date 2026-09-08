'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import SelectPage from '../SelectPage';
import ResponsiveToggle from '../ResponsiveToggle';
import { UndoLeft, UndoRight } from '@/assets/icons/editor';

import styles from './index.module.css';

/**
 * Barra do topo da coluna central: voltar/avançar, seletor de página e o
 * toggle Desktop/Mobile.
 *
 * Voltar/avançar ainda não têm histórico por trás (não existe undo/redo no
 * estado hoje) — ficam desabilitados até a fase que os implementa.
 */
export default function EditorTopbar() {
  const { selectedPage, setSelectedPage, isMobileView, toggleMobileView } =
    useLayout();

  return (
    <header className={styles.topbar}>
      <div className={styles.history}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Voltar"
          disabled
        >
          <UndoLeft width={20} height={20} />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Avançar"
          disabled
        >
          <UndoRight width={20} height={20} />
        </button>
      </div>

      <SelectPage selectedPage={selectedPage} setSelectedPage={setSelectedPage} />

      <ResponsiveToggle isMobile={isMobileView} onToggleMobile={toggleMobileView} />
    </header>
  );
}

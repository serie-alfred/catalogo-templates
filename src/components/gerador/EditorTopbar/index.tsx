'use client';

import React, { useEffect } from 'react';

import { useLayout } from '@/context/LayoutContext';
import SelectPage from '../SelectPage';
import ResponsiveToggle from '../ResponsiveToggle';
import { UndoLeft, UndoRight } from '@/assets/icons/editor';

import styles from './index.module.css';

/** Atalhos de teclado não devem roubar o Cmd+Z de um campo de texto. */
function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable === true;
}

/**
 * Barra do topo da coluna central: voltar/avançar, seletor de página e o
 * toggle Desktop/Mobile.
 */
export default function EditorTopbar() {
  const {
    selectedPage,
    setSelectedPage,
    isMobileView,
    toggleMobileView,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useLayout();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (key === 'y') {
        event.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

  return (
    <header className={styles.topbar}>
      <div className={styles.history}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Voltar"
          onClick={undo}
          disabled={!canUndo}
        >
          <UndoLeft width={20} height={20} />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Avançar"
          onClick={redo}
          disabled={!canRedo}
        >
          <UndoRight width={20} height={20} />
        </button>
      </div>

      <SelectPage
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />

      <ResponsiveToggle
        isMobile={isMobileView}
        onToggleMobile={toggleMobileView}
      />
    </header>
  );
}

'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import ThemeCanvas from '../ThemeCanvas';
import MobileFrame from '../MobileFrame';

import styles from './index.module.css';

/**
 * Scrollport do editor. Guarda o canvas desktop (no documento) e o iframe da
 * visão mobile.
 *
 * O palco off-screen do export NÃO mora aqui: `.preview-area` é
 * `position: relative` + `overflow-y: auto`, então seria o containing block do
 * palco e o recortaria. Ele é irmão desta <main>, montado em page.tsx.
 *
 * `.preview-area` mantém `overflow-y: auto` de propósito: é ele o scrollport a
 * que o header `position: sticky` do tema adere.
 */
export default function PreviewArea() {
  const { isMobileView } = useLayout();

  return (
    <main className={styles['preview-area']}>
      <div
        className={
          (isMobileView ? styles.mobile : styles.desktop) + ' preview__area'
        }
      >
        {/* O iframe fica montado mesmo em desktop — ver MobileFrame. */}
        <MobileFrame hidden={!isMobileView} />
        {!isMobileView && <ThemeCanvas />}
      </div>
    </main>
  );
}

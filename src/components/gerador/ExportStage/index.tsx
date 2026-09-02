'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import ThemeRenderer from '@/components/preview/ThemeRenderer';

/**
 * Palco off-screen do export: as duas cópias em 1920px e 375px que o
 * html2canvas fotografa.
 *
 * Montado SÓ durante a captura (`isCapturing`). Antes ficava montado o tempo
 * todo, o que montava cada template 3× — três Swipers com observer/loop, três
 * baterias de effects e três drawers `position: fixed` disputando com o canvas
 * que o usuário está usando.
 *
 * `stickyHeader={false}`: o html2canvas renderiza `position: sticky` de forma
 * imprevisível, e o editor nunca aplicou sticky nessas cópias.
 */
export default function ExportStage() {
  const { isCapturing, selections, selectedPage, desktopPreviewRef, mobilePreviewRef } =
    useLayout();

  if (!isCapturing) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: '-99999px',
        left: '-99999px',
        pointerEvents: 'none',
      }}
    >
      <div
        ref={desktopPreviewRef}
        style={{ background: 'white', padding: '10px', width: '1920px' }}
      >
        <ThemeRenderer
          selections={selections}
          pagina={selectedPage}
          isMobile={false}
          stickyHeader={false}
        />
      </div>
      <div
        ref={mobilePreviewRef}
        style={{ background: 'white', padding: '10px', width: '375px' }}
      >
        <ThemeRenderer
          selections={selections}
          pagina={selectedPage}
          isMobile
          stickyHeader={false}
        />
      </div>
    </div>
  );
}

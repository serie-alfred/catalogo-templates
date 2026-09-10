'use client';

import React, { useEffect, useRef, useState } from 'react';

import { CaretDown } from '@/assets/icons/editor';
import { useLayout } from '@/context/LayoutContext';
import { ZOOM_MODES, type ZoomMode } from '@/hooks/useLayoutGenerator';

import styles from './index.module.css';

const ROTULOS: Record<ZoomMode, string> = {
  fit: 'Ajustar',
  '0.5': '50%',
  '0.75': '75%',
  '1': '100%',
};

/**
 * Zoom do canvas — pílula flutuante no canto do próprio canvas.
 *
 * POR QUE NÃO NA TOPBAR, que seria o lugar óbvio: a topbar é
 * `justify-content: space-between` com três filhos, e o `.history` tem 213px
 * cravados para espelhar o `ResponsiveToggle` e manter o seletor de página
 * centrado. Um quarto filho desloca `topbar.pagina`, `topbar.toggle`,
 * `topbar.desktop` e `topbar.mobile` — quatro das 37 caixas que o estágio de
 * geometria compara contra o Figma. O controle reprovaria o portão sem que
 * nada estivesse errado no produto.
 *
 * Canto do canvas também é onde Figma, Framer e Webflow põem zoom, e é onde a
 * medição já mora.
 */
export default function CanvasZoom({ escala }: { escala: number }) {
  const { zoomMode, setZoomMode } = useLayout();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const pct = Math.round(escala * 100);
  // No modo `fit` mostrar a fração REAL é o que torna o controle legível: sem
  // isso o usuário não tem como saber que está vendo o tema a 40%.
  const texto = zoomMode === 'fit' ? `Ajustar · ${pct}%` : ROTULOS[zoomMode];

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Zoom do canvas"
      >
        {texto}
        <CaretDown width={16} height={16} />
      </button>

      {open && (
        <ul className={styles.menu} role="listbox" aria-label="Zoom do canvas">
          {ZOOM_MODES.map(modo => (
            <li key={modo}>
              <button
                type="button"
                role="option"
                aria-selected={modo === zoomMode}
                className={styles.item}
                onClick={() => {
                  setZoomMode(modo);
                  setOpen(false);
                }}
              >
                {ROTULOS[modo]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

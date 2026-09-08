'use client';

import React, { useEffect, useRef, useState } from 'react';

import { CaretDown } from '@/assets/icons/editor';

import styles from './index.module.css';

interface SelectPageProps {
  selectedPage: string;
  setSelectedPage: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Contexto aberto no canvas.
 *
 * As QUATRO entradas continuam: "Todas as páginas" (`common`) parece supérflua
 * ao lado das três páginas reais, mas é a única visão em que o Card de Produto
 * aparece como seção — `belongsToPage` só o exibe ali (utils/previewRender.ts).
 * Tirá-la do menu tornaria o card inalcançável.
 */
const PAGES = [
  { key: 'common', name: 'Todas as páginas' },
  { key: 'home', name: 'Homepage' },
  { key: 'category', name: 'Página de Categoria' },
  { key: 'product', name: 'Página de Produto' },
];

export default function SelectPage({
  selectedPage,
  setSelectedPage,
}: SelectPageProps) {
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

  const current = PAGES.find(p => p.key === selectedPage) ?? PAGES[1];

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {current.name}
        <CaretDown width={24} height={24} />
      </button>

      {open && (
        <ul className={styles.menu} role="listbox" aria-label="Página">
          {PAGES.map(page => (
            <li key={page.key}>
              <button
                type="button"
                role="option"
                aria-selected={page.key === selectedPage}
                className={styles.item}
                onClick={() => {
                  setSelectedPage(page.key);
                  setOpen(false);
                }}
              >
                {page.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

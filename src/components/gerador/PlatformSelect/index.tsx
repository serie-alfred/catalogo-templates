'use client';

import React, { useEffect, useRef, useState } from 'react';

import { PLATFORMS, type Platform } from '@/types/platform';
import { ChevronRight, WakeMark } from '@/assets/icons/editor';

import styles from './index.module.css';

interface PlatformSelectProps {
  value: Platform | null;
  onChange: (platform: Platform) => void;
  showError?: boolean;
}

/**
 * Plataforma de destino do tema.
 *
 * NÃO existe mais a opção vazia. Ela punha a string '' num estado tipado
 * `Platform | null` (via um cast que mentia) e, como o efeito de save guarda
 * `if (platform)`, o localStorage ficava com a plataforma antiga: voltar ao
 * placeholder esvaziava a tela e a plataforma "ressuscitava" no reload.
 *
 * O Figma só desenha a marca da Wake. Para Tray e VTEX o nome entra como texto
 * no mesmo lugar, com o mesmo peso.
 */
const MARKS: Partial<Record<Platform, React.ReactNode>> = {
  Wake: <WakeMark width={41.873} height={12} />,
};

export default function PlatformSelect({
  value,
  onChange,
  showError = false,
}: PlatformSelectProps) {
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

  return (
    <div ref={rootRef} className={styles.root}>
      <button
        type="button"
        className={`${styles.card} ${showError ? styles.error : ''}`}
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value ? (
          <>
            {MARKS[value] ?? <span className={styles.mark}>{value}</span>}
            <span className={styles.caption}>(Storefront)</span>
          </>
        ) : (
          <span className={styles.caption}>Selecione uma plataforma</span>
        )}
        <ChevronRight width={20} height={20} />
      </button>

      {open && (
        <ul className={styles.menu} role="listbox" aria-label="Plataforma">
          {PLATFORMS.map(platform => (
            <li key={platform}>
              <button
                type="button"
                role="option"
                aria-selected={platform === value}
                className={styles.item}
                onClick={() => {
                  setOpen(false);
                  if (platform !== value) onChange(platform);
                }}
              >
                {platform}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';

import { CaretDown } from '@/assets/icons/editor';

import styles from './index.module.css';

export interface DropdownOption<K extends string> {
  key: K;
  name: string;
}

/**
 * O seletor da topbar: um gatilho com o nome atual e um `listbox` embaixo.
 *
 * Saiu do SelectPage quando o modo Checkout ganhou o próprio seletor (as
 * etapas no lugar das páginas): os dois são o MESMO controle com listas
 * diferentes, e duas cópias do fecha-ao-clicar-fora divergiriam.
 */
export default function Dropdown<K extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  fallback,
}: {
  options: readonly DropdownOption<K>[];
  value: K;
  onChange: (key: K) => void;
  /** Nome acessível da lista ("Página", "Etapa do checkout"). */
  ariaLabel: string;
  /** Opção mostrada quando `value` não está na lista. */
  fallback: DropdownOption<K>;
}) {
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

  const current = options.find(o => o.key === value) ?? fallback;

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
        <ul className={styles.menu} role="listbox" aria-label={ariaLabel}>
          {options.map(option => (
            <li key={option.key}>
              <button
                type="button"
                role="option"
                aria-selected={option.key === value}
                className={styles.item}
                onClick={() => {
                  onChange(option.key);
                  setOpen(false);
                }}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

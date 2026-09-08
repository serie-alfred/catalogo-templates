'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useLayout } from '@/context/LayoutContext';
import SelectSection from '../SelectSection';
import SelectSectionItem from '../SelectSectionItem';
import ScrollArea from '../ScrollArea';
import { CloseMd } from '@/assets/icons/editor';

import styles from './index.module.css';

/**
 * Catálogo de componentes.
 *
 * Portalizado para o <body>: o shell é `overflow: hidden` e recortaria o
 * diálogo. Herda a página aberta na topbar e a plataforma escolhida — não tem
 * seletores próprios, porque as duas coisas decidem o que existe no catálogo e
 * ter duas fontes de verdade para elas seria um jeito de discordarem.
 */
export default function SectionModal({ onClose }: { onClose: () => void }) {
  const {
    selections,
    focusedKey,
    setFocusedKey,
    selectedPage,
    platform,
    toggleSelection,
  } = useLayout();

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      // Armadilha de foco: sem ela o Tab sai do diálogo e passeia pelo editor
      // atrás do overlay.
      const focusables = cardRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        ref={cardRef}
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-label="Componentes de seções"
        onMouseDown={event => event.stopPropagation()}
      >
        <header className={styles.header}>
          <h2 className={styles.title}>Componentes de seções</h2>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Fechar"
          >
            <CloseMd width={24} height={24} />
          </button>
        </header>

        {!platform ? (
          <p className={styles.empty}>
            Escolha uma plataforma no painel da esquerda para ver os componentes
            disponíveis.
          </p>
        ) : (
          <div className={styles.body}>
            <aside className={styles.categories}>
              <ScrollArea>
                <SelectSection
                  selectedPage={selectedPage}
                  platform={platform}
                  activeLayoutKey={focusedKey}
                  setActiveLayoutKey={setFocusedKey}
                />
              </ScrollArea>
            </aside>

            <div className={styles.grid}>
              <ScrollArea>
                <SelectSectionItem
                  activeLayoutKey={focusedKey}
                  selectedImages={selections}
                  onSelect={(id, layoutKey) =>
                    toggleSelection(id, layoutKey, selectedPage)
                  }
                  selectedPage={selectedPage}
                  platform={platform}
                />
              </ScrollArea>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

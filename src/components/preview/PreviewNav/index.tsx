'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PREVIEW_PAGES } from '@/utils/previewRender';
import { CHECKOUT_ETAPAS } from '@/utils/checkout';
import styles from './index.module.css';

interface PreviewNavProps {
  /** ID do preview compartilhado (prefixo comum das 3 páginas). */
  id: string;
  /** Slug da página atualmente aberta: "home" | "categoria" | "produto" | "checkout/<etapa>". */
  activeSlug: string;
  /** O snapshot tem checkout (tema VTEX): o menu ganha as etapas dele. */
  temCheckout?: boolean;
  /** O snapshot tem LP: só então "Landing page" entra no menu. */
  temLanding?: boolean;
}

/**
 * Balão flutuante no canto direito. Ao clicar, abre um menu para navegar entre
 * as páginas do preview (Home / Categoria / Produto).
 */
export default function PreviewNav({
  id,
  activeSlug,
  temCheckout = false,
  temLanding = false,
}: PreviewNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      {open && (
        <nav className={styles.menu} aria-label="Navegação do preview">
          <span className={styles.menuTitle}>Ver página</span>
          {PREVIEW_PAGES.filter(
            page => page.pagina !== 'landing' || temLanding
          ).map(page => (
            <Link
              key={page.slug}
              href={`/p/${id}/${page.slug}`}
              className={`${styles.menuItem} ${
                page.slug === activeSlug ? styles.active : ''
              }`}
              onClick={() => setOpen(false)}
            >
              {page.label}
            </Link>
          ))}
          {temCheckout && (
            <>
              <span className={styles.menuTitle}>Checkout</span>
              {CHECKOUT_ETAPAS.map(etapa => (
                <Link
                  key={etapa.id}
                  href={`/p/${id}/checkout/${etapa.id}`}
                  className={`${styles.menuItem} ${
                    `checkout/${etapa.id}` === activeSlug ? styles.active : ''
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {etapa.rotulo}
                </Link>
              ))}
            </>
          )}
        </nav>
      )}

      <button
        type="button"
        className={styles.bubble}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-label="Navegar entre as páginas"
        title="Navegar entre as páginas"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 5h18M3 12h18M3 19h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

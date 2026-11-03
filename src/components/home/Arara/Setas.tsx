'use client';

import React from 'react';

import styles from './index.module.css';

/**
 * Setas da arara: no desktop, com mouse, não há gesto horizontal. Rola um
 * card por clique; o `scroll-snap` do trilho acerta o encaixe.
 */
export default function Setas({ trilho }: { trilho: string }) {
  const rolar = (sentido: 1 | -1) => {
    const el = document.getElementById(trilho);
    const card = el?.querySelector<HTMLElement>('[data-spot]');
    if (!el || !card) return;
    el.scrollBy({
      left: sentido * (card.offsetWidth + 28),
      behavior: 'smooth',
    });
  };
  return (
    <div className={styles.setas}>
      <button
        type="button"
        className={styles.seta}
        aria-label="Templates anteriores"
        aria-controls={trilho}
        onClick={() => rolar(-1)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        className={styles.seta}
        aria-label="Próximos templates"
        aria-controls={trilho}
        onClick={() => rolar(1)}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}

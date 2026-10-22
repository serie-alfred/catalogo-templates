import React from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Brands11` do faststore.starter (família 11, Grade; desenho `Brand11` /
 * `Brand11-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá (sem logo: vale o
 * nome em texto, como no desenho).
 */
interface Brands11Brand {
  name?: string;
  url?: string;
  /** Logo opcional; sem logo vale o nome em texto. */
  logo?: string;
}

interface Brands11Props {
  sectionNumber?: string;
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  brands?: Brands11Brand[];
}

// Conteúdo do mock.ts do starter.
const MOCK: Brands11Props = {
  sectionNumber: '07',
  title: 'Designers',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '/s',
  brands: [1, 2, 3, 4, 5, 6].map(n => ({
    name: `[Estúdio 0${n}]`,
    url: '/s',
  })),
};

export default function Brand11() {
  const { sectionNumber, title, viewAllLabel, viewAllUrl, brands = [] } = MOCK;
  if (!brands.length) return null;

  return (
    <div className={styles.brands11Box}>
      <section
        className={styles.brands11}
        aria-label={title || 'Marcas'}
        data-role="br-root"
      >
        <link rel="stylesheet" href={FONTES_11} />
        <div className={styles.inner}>
          {(title || sectionNumber || viewAllLabel) && (
            <div className={styles.head}>
              {(title || sectionNumber) && (
                <h2 className={styles.title} data-role="br-title">
                  {sectionNumber && (
                    <span className={styles.number}>[{sectionNumber}]</span>
                  )}
                  {title}
                </h2>
              )}
              <span className={styles.spacer} />
              {viewAllLabel && (
                <a
                  className={styles.viewAll}
                  href={viewAllUrl || '#'}
                  data-role="br-view-all"
                >
                  {viewAllLabel}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              )}
            </div>
          )}
          <ul className={styles.list}>
            {brands.map((b, i) => (
              <li key={i} className={styles.item}>
                <a
                  className={styles.brand}
                  href={b.url || '#'}
                  data-role="br-item"
                >
                  {b.logo ? (
                    <img
                      className={styles.logo}
                      src={b.logo}
                      alt={b.name ?? ''}
                      width={160}
                      height={48}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className={styles.name}>{b.name}</span>
                  )}
                  <svg
                    className={styles.arrow}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

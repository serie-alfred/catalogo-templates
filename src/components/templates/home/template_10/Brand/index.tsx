import React from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Brands10` do faststore.starter (família 10, Varejo; desenho
 * `Brand10` / `Brand10-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (marcas genéricas, sem logo: vale o rótulo em texto).
 */

// Conteúdo do mock.ts do starter.
// Textos literais do desenho `Brand10` (marcas como marcadores, sem logo).
const MOCK: Brands10Props = {
  title: 'Marcas parceiras',
  viewAllLabel: 'Ver todas',
  viewAllUrl: '/marcas',
  brands: ['01', '02', '03', '04', '05', '06', '07', '08'].map(n => ({
    name: `[Marca ${n}]`,
    url: '/marcas',
  })),
};
interface Brands10Brand {
  name?: string;
  url?: string;
  /** Logo (opcional; sem logo vale o nome em texto). */
  logo?: string;
}

interface Brands10Props {
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  brands?: Brands10Brand[];
}

export default function Brand10() {
  const { title, viewAllLabel, viewAllUrl, brands = [] } = MOCK;
  if (!brands.length) return null;

  return (
    <div className={styles.brands10Box}>
      <section
        className={styles.brands10}
        aria-label={title || 'Marcas'}
        data-role="br-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <div className={styles.head}>
            {title && (
              <h2 className={styles.title} data-role="br-title">
                {title}
              </h2>
            )}
            {viewAllLabel && (
              <a
                className={styles.viewAll}
                href={viewAllUrl || '#'}
                data-role="br-view-all"
              >
                {viewAllLabel}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  aria-hidden="true"
                >
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </a>
            )}
          </div>
          <ul className={styles.list}>
            {brands.map((b, i) => (
              <li key={i} className={styles.item} data-role="br-item">
                <a
                  className={styles.card}
                  href={b.url || '#'}
                  aria-label={b.logo ? b.name : undefined}
                >
                  {b.logo ? (
                    <img
                      className={styles.logo}
                      src={b.logo}
                      alt=""
                      width={120}
                      height={48}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span className={styles.name}>{b.name}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

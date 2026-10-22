import React from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Brands13` do faststore.starter (família 13, Noturno; desenho `Brand13` /
 * `Brand13-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá (os nomes são
 * marcadores do desenho; sem logo). A célula verde que o desenho pinta na 3ª é o `:hover`
 * da classe `.cell` (desktop), que o CSS derivado já traz: em repouso nenhuma fica verde,
 * igual ao palco de lá.
 */
interface Brands13Brand {
  name?: string;
  url?: string;
  logo?: string;
}

// Conteúdo do mock.ts do starter.
const MOCK = {
  title: 'Colabs',
  viewAllLabel: 'Ver todas',
  viewAllUrl: '/s',
  brands: [
    { name: '[Colab 01]', url: '/s' },
    { name: '[Colab 02]', url: '/s' },
    { name: '[Colab 03]', url: '/s' },
    { name: '[Colab 04]', url: '/s' },
    { name: '[Colab 05]', url: '/s' },
    { name: '[Colab 06]', url: '/s' },
  ] as Brands13Brand[],
};

export default function Brand13() {
  const { title, viewAllLabel, viewAllUrl, brands } = MOCK;
  if (!brands.length) return null;

  return (
    <div className={styles.brands13Box}>
      <section
        className={styles.brands13}
        aria-label={title || 'Marcas'}
        data-role="br-root"
      >
        <link rel="stylesheet" href={FONTES_13} />
        <div className={styles.inner}>
          {(title || viewAllLabel) && (
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
                  <span>{viewAllLabel}</span>
                </a>
              )}
            </div>
          )}
          <ul className={styles.grid}>
            {brands.map((b, i) => (
              <li key={i} className={styles.item} data-role="br-item">
                <a className={styles.cell} href={b.url || '#'}>
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
                    b.name
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

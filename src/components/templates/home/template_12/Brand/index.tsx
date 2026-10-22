import React from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Brands12` do faststore.starter (família 12, Suave; desenho `Brand12` /
 * `Brand12-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá (marcadores no lugar
 * dos nomes, sem logo: vale o nome, com a grafia pela posição).
 */
interface Brands12Brand {
  name?: string;
  url?: string;
  logo?: string;
}

// Conteúdo do mock.ts do starter.
const TITLE = 'Marcas que amamos';
const BRANDS: Brands12Brand[] = [
  { name: '[Marca 01]', url: '#' },
  { name: '[Marca 02]', url: '#' },
  { name: '[Marca 03]', url: '#' },
  { name: '[marca 04]', url: '#' },
  { name: '[MARCA 05]', url: '#' },
  { name: '[Marca 06]', url: '#' },
];

export default function Brand12() {
  return (
    <div className={styles.brands12Box}>
      <section className={styles.brands12} aria-label={TITLE} data-role="br-root">
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.inner}>
          <h2 className={styles.title} data-role="br-title">
            {TITLE}
          </h2>
          <ul className={styles.list}>
            {BRANDS.map((b, i) => (
              <li key={i} className={styles.item} data-role="br-item">
                <a className={styles.pill} href={b.url || '#'}>
                  {b.logo ? (
                    <img className={styles.logo} src={b.logo} alt={b.name ?? ''} height={32} loading="lazy" decoding="async" />
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

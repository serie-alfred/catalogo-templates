import React from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Brands15` do faststore.starter (família 15, Luxo; desenho `Brand15`).
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS é
 * derivado do SCSS de lá. Conteúdo = o mock.ts de lá (as seis marcas são marcação do
 * desenho; sem logo, vale o nome).
 *
 * Divergência deliberada: o envelope `.brands15Box` é o container das `@container`.
 */

const EYEBROW = 'Curadoria';
const TITLE = 'Maisons';
const TITLE_EMPHASIS = 'parceiras';
const VIEW_ALL = 'Ver todas as marcas';
const BRANDS: { name: string; url: string; logo?: string }[] = ['01', '02', '03', '04', '05', '06'].map(n => ({
  name: `[Marca ${n}]`,
  url: '#',
}));

export default function Brand15() {
  return (
    <div className={styles.brands15Box}>
      <section className={styles.brands15} aria-label={`${TITLE} ${TITLE_EMPHASIS}`} data-role="br-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <span className={styles.eyebrow}>{EYEBROW}</span>
            <h2 className={styles.title} data-role="br-title">
              {TITLE} <em>{TITLE_EMPHASIS}</em>
            </h2>
          </div>
          <ul className={styles.grid} data-role="br-list">
            {BRANDS.map((b, i) => (
              <li key={i} className={styles.cell}>
                <a className={styles.link} href={b.url || '#'} aria-label={b.logo ? b.name : undefined} data-role="br-item">
                  {b.logo ? <img src={b.logo} alt="" width={160} height={48} loading="lazy" decoding="async" /> : b.name}
                </a>
              </li>
            ))}
          </ul>
          <a className={styles.viewAll} href="#" data-role="br-view-all">
            {VIEW_ALL}
          </a>
        </div>
      </section>
    </div>
  );
}

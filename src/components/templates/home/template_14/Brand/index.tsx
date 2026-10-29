import React from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Brands14` do faststore.starter (família 14, Esportiva; desenho `Brand14`).
 * Mesmo markup, mesmas classes e `data-role`; o CSS é derivado do SCSS de lá. Conteúdo = o
 * mock.ts de lá (os nomes "[Marca 0N]" do desenho, sem logo).
 */

type Marca = { name?: string; url?: string; logo?: string };

const CONTEUDO: { title: string; viewAllLabel: string; brands: Marca[] } = {
  title: 'Marcas que você treina',
  viewAllLabel: 'Ver todas',
  brands: ['01', '02', '03', '04', '05', '06'].map(n => ({ name: `[Marca ${n}]`, url: '#' })),
};

export default function Brand14() {
  const { title, viewAllLabel, brands } = CONTEUDO;

  return (
    <div className={styles.brands14Box}>
      <section className={styles.brands14} aria-label={title || 'Marcas'} data-role="br-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 className={styles.title} data-role="br-title">
              {title}
            </h2>
            <a className={styles.viewAll} href="#" data-role="br-view-all">
              {viewAllLabel}
              <svg className={styles.viewAllIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
          <ul className={styles.grid}>
            {brands.map((b, i) => (
              <li key={i} className={styles.item} data-role="br-item">
                <a className={styles.cell} href={b.url || '#'}>
                  {b.logo ? <img className={styles.logo} src={b.logo} alt={b.name ?? ''} width={160} height={48} /> : b.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

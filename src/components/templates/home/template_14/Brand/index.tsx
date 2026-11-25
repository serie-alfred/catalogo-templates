import React from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/Brands14` do faststore.starter (família 14, Esportiva; desenho `Brand14`).
 * Mesmo markup, mesmas classes e `data-role`; o CSS é derivado do SCSS de lá. Conteúdo = o
 * mock.ts de lá (os nomes "[Marca 0N]" do desenho, sem logo), por baixo do que o CS subir
 * (`useConteudoDaSecao`, campos do schema de lá).
 */

interface Brand14Conteudo {
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  brands: { name?: string; url?: string; logo?: string }[];
}

const MOCK: Brand14Conteudo = {
  title: 'Marcas que você treina',
  viewAllLabel: 'Ver todas',
  viewAllUrl: '/s',
  brands: ['01', '02', '03', '04', '05', '06'].map(n => ({ name: `[Marca ${n}]`, url: '/s' })),
};

export default function Brand14() {
  const { title, viewAllLabel, viewAllUrl, brands } = useConteudoDaSecao(MOCK);
  if (!brands.length) return null;

  return (
    <div className={styles.brands14Box}>
      <section className={styles.brands14} aria-label={title || 'Marcas'} data-role="br-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.inner}>
          {(title || viewAllLabel) && (
            <div className={styles.head}>
              {title && (
                <h2 className={styles.title} data-role="br-title">
                  {title}
                </h2>
              )}
              {viewAllLabel && (
                <a className={styles.viewAll} href={viewAllUrl || '#'} data-role="br-view-all">
                  {viewAllLabel}
                  <svg className={styles.viewAllIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </a>
              )}
            </div>
          )}
          <ul className={styles.grid}>
            {brands.map((b, i) => (
              <li key={i} className={styles.item} data-role="br-item">
                <a className={styles.cell} href={b.url || '#'}>
                  {b.logo ? (
                    <img className={styles.logo} src={b.logo} alt={b.name ?? ''} width={160} height={48} loading="lazy" decoding="async" />
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

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Brand14.conteudoPadrao = MOCK;

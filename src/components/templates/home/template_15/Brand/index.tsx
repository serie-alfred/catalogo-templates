import React from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/Brands15` do faststore.starter (família 15, Luxo; desenho `Brand15`).
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS é
 * derivado do SCSS de lá. Conteúdo = o mock.ts de lá (as seis marcas são marcação do
 * desenho; sem logo, vale o nome).
 *
 * Divergência deliberada: o envelope `.brands15Box` é o container das `@container`.
 */

interface Marca {
  name?: string;
  url?: string;
  logo?: string;
}

interface Brand15Conteudo {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  brands: Marca[];
}

const MOCK: Brand15Conteudo = {
  eyebrow: 'Curadoria',
  title: 'Maisons',
  titleEmphasis: 'parceiras',
  viewAllLabel: 'Ver todas as marcas',
  viewAllUrl: '/s',
  brands: ['01', '02', '03', '04', '05', '06'].map(n => ({ name: `[Marca ${n}]`, url: '/s' })),
};

export default function Brand15() {
  const { eyebrow, title, titleEmphasis, viewAllLabel, viewAllUrl, brands } = useConteudoDaSecao(MOCK);
  if (!brands.length) return null;

  return (
    <div className={styles.brands15Box}>
      <section
        className={styles.brands15}
        aria-label={[title, titleEmphasis].filter(Boolean).join(' ') || 'Marcas'}
        data-role="br-root"
      >
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          {(eyebrow || title || titleEmphasis) && (
            <div className={styles.head}>
              {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
              {(title || titleEmphasis) && (
                <h2 className={styles.title} data-role="br-title">
                  {title} {titleEmphasis && <em>{titleEmphasis}</em>}
                </h2>
              )}
            </div>
          )}
          <ul className={styles.grid} data-role="br-list">
            {brands.map((b, i) => (
              <li key={i} className={styles.cell}>
                <a
                  className={styles.link}
                  href={b.url || '#'}
                  aria-label={b.logo ? b.name : undefined}
                  data-role="br-item"
                >
                  {b.logo ? (
                    <img src={b.logo} alt="" width={160} height={48} loading="lazy" decoding="async" />
                  ) : (
                    b.name
                  )}
                </a>
              </li>
            ))}
          </ul>
          {viewAllLabel && (
            <a className={styles.viewAll} href={viewAllUrl || '#'} data-role="br-view-all">
              {viewAllLabel}
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Brand15.conteudoPadrao = MOCK;

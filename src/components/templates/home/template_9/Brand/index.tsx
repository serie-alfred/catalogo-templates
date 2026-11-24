import React from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/Brands09` do faststore.starter (família 09, Editorial;
 * desenho `Brand09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá (marcadores de texto, cada um num estilo tipográfico do desenho, sem logo),
 * por baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 */

type TextStyle = 'italic' | 'caps' | 'light' | 'sans' | 'italicLight' | 'spaced';

interface Brand09Conteudo {
  eyebrow?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  brands: { name?: string; url?: string; logo?: string; textStyle?: TextStyle }[];
}

const MOCK: Brand09Conteudo = {
  eyebrow: 'Marcas da casa',
  viewAllLabel: 'Ver todas',
  viewAllUrl: '/marcas',
  brands: [
    { name: '[Marca 01]', url: '/s', textStyle: 'italic' },
    { name: '[Marca 02]', url: '/s', textStyle: 'caps' },
    { name: '[Marca 03]', url: '/s', textStyle: 'light' },
    { name: '[Marca 04]', url: '/s', textStyle: 'sans' },
    { name: '[Marca 05]', url: '/s', textStyle: 'italicLight' },
    { name: '[Marca 06]', url: '/s', textStyle: 'spaced' },
  ],
};

export default function Brand09() {
  const { eyebrow, viewAllLabel, viewAllUrl, brands } = useConteudoDaSecao(MOCK);
  if (!brands.length) return null;

  return (
    <div className={styles.brands09Box}>
      <section className={styles.brands09} aria-label={eyebrow || 'Marcas'} data-role="br-root">
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          {(eyebrow || viewAllLabel) && (
            <div className={styles.head}>
              {eyebrow && (
                <span className={styles.eyebrow} data-role="br-eyebrow">
                  <span className={styles.eyebrowRule} aria-hidden="true" />
                  {eyebrow}
                </span>
              )}
              {viewAllLabel && (
                <a className={styles.viewAll} href={viewAllUrl || '#'} data-role="br-view-all">
                  <span>{viewAllLabel}</span>
                </a>
              )}
            </div>
          )}
          <ul className={styles.list}>
            {brands.map((b, i) => (
              <li key={i} className={styles.item} data-role="br-item">
                <a
                  className={`${styles.brand} ${styles[b.textStyle || 'italic'] ?? ''}`}
                  href={b.url || '#'}
                  aria-label={b.logo ? b.name : undefined}
                >
                  {b.logo ? (
                    <img src={b.logo} alt="" width={140} height={56} loading="lazy" decoding="async" />
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
Brand09.conteudoPadrao = MOCK;

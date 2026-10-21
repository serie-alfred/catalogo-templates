import React from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Brands09` do faststore.starter (família 09, Editorial;
 * desenho `Brand09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá: marcadores de texto, cada um num estilo tipográfico do desenho (sem logo).
 */

type TextStyle = 'italic' | 'caps' | 'light' | 'sans' | 'italicLight' | 'spaced';

const BRANDS: { name: string; textStyle: TextStyle }[] = [
  { name: '[Marca 01]', textStyle: 'italic' },
  { name: '[Marca 02]', textStyle: 'caps' },
  { name: '[Marca 03]', textStyle: 'light' },
  { name: '[Marca 04]', textStyle: 'sans' },
  { name: '[Marca 05]', textStyle: 'italicLight' },
  { name: '[Marca 06]', textStyle: 'spaced' },
];

export default function Brand09() {
  return (
    <div className={styles.brands09Box}>
      <section className={styles.brands09} aria-label="Marcas da casa" data-role="br-root">
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <span className={styles.eyebrow} data-role="br-eyebrow">
              <span className={styles.eyebrowRule} aria-hidden="true" />
              Marcas da casa
            </span>
            <a className={styles.viewAll} href="#" data-role="br-view-all">
              <span>Ver todas</span>
            </a>
          </div>
          <ul className={styles.list}>
            {BRANDS.map(b => (
              <li key={b.name} className={styles.item} data-role="br-item">
                <a className={`${styles.brand} ${styles[b.textStyle] ?? ''}`} href="#">
                  {b.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

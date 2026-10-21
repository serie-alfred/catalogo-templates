'use client';

import React, { useState } from 'react';

import styles from './index.module.css';
import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

/**
 * Espelha `organisms/CategoryTitle09` do faststore.starter (família 09, Editorial;
 * desenho `CategoryTitle09`): nome da categoria, contagem e chips de subcategoria em
 * texto. Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Lá nome, contagem e chips vêm do contexto da PLP (breadcrumb, totalCount, facet do
 * nível abaixo); aqui são o exemplo do mock.ts de lá. O chip, que lá troca o filtro pela
 * store de busca, aqui só marca o ativo num `useState`.
 */
interface Subcat {
  value: string;
  label: string;
  quantity?: number;
}

const ALL_LABEL = 'Todos';
const TITULO = 'Vestidos';
const TOTAL = 128;
const SUBCATS: Subcat[] = [
  { value: 'midi', label: 'Midi', quantity: 54 },
  { value: 'longos', label: 'Longos', quantity: 31 },
  { value: 'curtos', label: 'Curtos', quantity: 27 },
  { value: 'chemise', label: 'Chemise', quantity: 16 },
];

export default function CategoryTitle09() {
  const [ativa, setAtiva] = useState('');

  const escolher = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setAtiva(value);
  };

  return (
    <div className={styles.categoryTitle09Box}>
      <link rel="stylesheet" href={FONTES_09} />
      <header className={styles.categoryTitle09} data-role="ct-root">
        <div className={styles.inner}>
          <h1 className={styles.title} data-role="ct-title">
            {TITULO}
            <sup className={styles.count} data-role="ct-count">
              ({TOTAL})
            </sup>
          </h1>
          <ul className={styles.chips} aria-label="Subcategorias" data-role="ct-chips">
            <li>
              <a
                className={`${styles.chip}${!ativa ? ` ${styles.chipActive}` : ''}`}
                href="#"
                aria-current={!ativa ? 'page' : undefined}
                onClick={(e) => escolher(e, '')}
                data-role="ct-chip"
              >
                {ALL_LABEL}
              </a>
            </li>
            {SUBCATS.map((s) => {
              const on = ativa === s.value;
              return (
                <li key={s.value}>
                  <a
                    className={`${styles.chip}${on ? ` ${styles.chipActive}` : ''}`}
                    href="#"
                    aria-current={on ? 'page' : undefined}
                    onClick={(e) => escolher(e, s.value)}
                    data-role="ct-chip"
                  >
                    {s.label}
                    {typeof s.quantity === 'number' && (
                      <span className={styles.chipQty}>({s.quantity})</span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </header>
    </div>
  );
}

'use client';

import React, { useState } from 'react';

import styles from './index.module.css';
import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

/**
 * Espelha `organisms/CategoryTitle11` do faststore.starter (família 11, Grade; desenho
 * `CategoryTitle11`): o nome da categoria em tipo grande com a contagem "[48]" em mono e a
 * faixa de filetes com os chips de subcategoria em texto ("Todos" + cada subcategoria com a
 * quantidade). Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Lá nome, contagem e chips vêm do contexto da PLP (breadcrumb, totalCount, facet do nível
 * abaixo); aqui são o exemplo do mock.ts de lá. O chip, que lá troca o filtro pela store de
 * busca (clicar de novo no ativo volta à categoria inteira), aqui faz o mesmo num `useState`.
 * Como lá fora de contexto, o "Todos" (valor vazio) nasce ativo.
 */
interface Subcat {
  value: string;
  label: string;
  quantity?: number;
}

const ALL_LABEL = 'Todos';
const TITULO = 'Iluminação';
const TOTAL = 48;
const SUBCATS: Subcat[] = [
  { value: 'mesa', label: 'Mesa', quantity: 12 },
  { value: 'piso', label: 'Piso', quantity: 9 },
  { value: 'pendentes', label: 'Pendentes', quantity: 15 },
  { value: 'arandelas', label: 'Arandelas', quantity: 8 },
  { value: 'lampadas', label: 'Lâmpadas', quantity: 4 },
];

export default function CategoryTitle11() {
  const [ativa, setAtiva] = useState('');

  const escolher = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setAtiva(a => (a === value ? '' : value));
  };

  const chips: Subcat[] = [
    { value: '', label: ALL_LABEL, quantity: TOTAL },
    ...SUBCATS,
  ];

  return (
    <div className={styles.categoryTitle11Box}>
      <link rel="stylesheet" href={FONTES_11} />
      <section
        className={styles.categoryTitle11}
        aria-label="Categoria"
        data-role="ct-root"
      >
        <div className={styles.inner}>
          <div className={styles.head}>
            <h1 className={styles.title} data-role="ct-title">
              {TITULO}
              <span className={styles.count} data-role="ct-count">
                [{TOTAL.toLocaleString('pt-BR')}]
              </span>
            </h1>
          </div>
          <nav
            className={styles.chips}
            aria-label="Subcategorias"
            data-role="ct-chips"
          >
            <ul className={styles.chipList}>
              {chips.map(s => {
                const on = ativa === s.value;
                return (
                  <li key={s.value || '_todos'} className={styles.chipItem}>
                    <a
                      className={`${styles.chip}${on ? ` ${styles.chipActive}` : ''}`}
                      href="#"
                      aria-current={on ? 'page' : undefined}
                      onClick={e => escolher(e, s.value)}
                      data-role="ct-chip"
                    >
                      {s.label}
                      {typeof s.quantity === 'number' && (
                        <span className={styles.chipQty}>
                          [{s.quantity.toLocaleString('pt-BR')}]
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>
    </div>
  );
}

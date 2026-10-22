'use client';

import React, { useState } from 'react';

import styles from './index.module.css';
import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

/**
 * Espelha `organisms/CategoryTitle12` do faststore.starter (família 12, Suave; desenho
 * `CategoryTitle12`): o nome da categoria em Young Serif, centralizado, a contagem
 * ("128 produtos") e os chips de subcategoria em pílulas ("Todos" + cada subcategoria com a
 * quantidade). Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Lá nome, contagem e chips vêm do contexto da PLP (breadcrumb, totalCount, facet do nível
 * abaixo); aqui são o exemplo do mock.ts de lá. O chip, que lá troca o filtro pela store de
 * busca, aqui faz o mesmo num `useState`. Como lá fora de contexto, o "Todos" nasce ativo.
 */
interface Subcat {
  value: string;
  label: string;
  quantity?: number;
}

const ALL_LABEL = 'Todos';
const COUNT_LABEL = 'produtos';
const TITULO = 'Skincare';
const TOTAL = 128;
const SUBCATS: Subcat[] = [
  { value: 'limpeza', label: 'Limpeza', quantity: 24 },
  { value: 'hidratantes', label: 'Hidratantes', quantity: 31 },
  { value: 'seruns', label: 'Séruns', quantity: 18 },
  { value: 'protetores', label: 'Protetores', quantity: 22 },
  { value: 'mascaras', label: 'Máscaras', quantity: 16 },
  { value: 'olhos', label: 'Olhos', quantity: 17 },
];

export default function CategoryTitle12() {
  const [ativa, setAtiva] = useState('');

  const escolher = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setAtiva(a => (value && value !== a ? value : ''));
  };

  // "Todos" sem quantidade, como no desenho (a contagem total já está embaixo do título).
  const chips: Subcat[] = [{ value: '', label: ALL_LABEL }, ...SUBCATS];

  return (
    <div className={styles.categoryTitle12Box}>
      <section
        className={styles.categoryTitle12}
        aria-label="Categoria"
        data-role="ct-root"
      >
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <h1 className={styles.title} data-role="ct-title">
              {TITULO}
            </h1>
            <p className={styles.count} data-role="ct-count">
              {TOTAL.toLocaleString('pt-BR')} {COUNT_LABEL}
            </p>
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
                          {s.quantity.toLocaleString('pt-BR')}
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

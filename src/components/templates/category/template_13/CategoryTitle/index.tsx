'use client';

import React, { useState } from 'react';

import styles from './index.module.css';
import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

/**
 * Espelha `organisms/CategoryTitle13` do faststore.starter (família 13, Noturno; desenho
 * `CategoryTitle13`): o nome da categoria enorme em condensada maiúscula, a contagem em verde
 * ao pé dele ("212 PRODUTOS") e os chips de subcategoria com borda, cada um com a quantidade.
 * Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Lá nome, contagem e chips vêm do contexto da PLP (breadcrumb, totalCount, facet do nível
 * abaixo); aqui são o exemplo do mock.ts de lá. Sem chip "Todos" (o desenho não tem) e, como
 * lá fora de contexto, nenhum chip nasce ativo. O chip, que lá troca o filtro pela store de
 * busca, aqui alterna num `useState`.
 */
interface Subcat {
  value: string;
  label: string;
  quantity?: number;
}

const COUNT_LABEL = 'produtos';
const TITULO = 'Tênis';
const TOTAL = 212;
const SUBCATS: Subcat[] = [
  { value: 'corrida', label: 'Corrida', quantity: 64 },
  { value: 'skate', label: 'Skate', quantity: 38 },
  { value: 'basquete', label: 'Basquete', quantity: 27 },
  { value: 'casual', label: 'Casual', quantity: 59 },
  { value: 'trail', label: 'Trail', quantity: 24 },
];

export default function CategoryTitle13() {
  const [ativa, setAtiva] = useState<string | null>(null);

  const escolher = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setAtiva(a => (value && value !== a ? value : null));
  };

  return (
    <div className={styles.categoryTitle13Box}>
      <section className={styles.categoryTitle13} aria-label="Categoria" data-role="ct-root">
        <link rel="stylesheet" href={FONTES_13} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <h1 className={styles.title} data-role="ct-title">
              {TITULO}
            </h1>
            <p className={styles.count} data-role="ct-count">
              {TOTAL.toLocaleString('pt-BR')} {COUNT_LABEL}
            </p>
          </div>
          <nav className={styles.chips} aria-label="Subcategorias" data-role="ct-chips">
            <ul className={styles.chipList}>
              {SUBCATS.map(s => {
                const on = ativa === s.value;
                return (
                  <li key={s.value} className={styles.chipItem}>
                    <a
                      className={`${styles.chip}${on ? ` ${styles.chipActive}` : ''}`}
                      href="#"
                      aria-current={on ? 'page' : undefined}
                      onClick={e => escolher(e, s.value)}
                      data-role="ct-chip"
                    >
                      {s.label}
                      {typeof s.quantity === 'number' && (
                        <span className={styles.chipQty}>{s.quantity.toLocaleString('pt-BR')}</span>
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

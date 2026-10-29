'use client';

import React, { useState } from 'react';

import styles from './index.module.css';
import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

/**
 * Espelha `organisms/CategoryTitle15` do faststore.starter (família 15, Luxo; desenho
 * `CategoryTitle15`): cabeça centralizada com a categoria-mãe em versalete dourado, o nome em
 * serifa grande, a contagem entre dois fios dourados ("148 PEÇAS") e os chips de subcategoria
 * com fio, cada um com a quantidade apagada. Mesmo markup, classes e `data-role`; o CSS é
 * derivado do SCSS de lá.
 *
 * Lá chamada, nome, contagem e chips vêm do contexto da PLP (breadcrumb, totalCount, facet do
 * nível abaixo); aqui são o exemplo do mock.ts de lá. Sem chip "Todos" (o desenho não tem) e,
 * como lá fora de contexto, nenhum chip nasce ativo. O chip, que lá troca o filtro pela store
 * de busca, aqui alterna num `useState`.
 */
interface Subcat {
  value: string;
  label: string;
  quantity?: number;
}

const COUNT_LABEL = 'peças';
const MAE = 'Joias';
const TITULO = 'Anéis';
const TOTAL = 148;
const SUBCATS: Subcat[] = [
  { value: 'solitarios', label: 'Solitários', quantity: 32 },
  { value: 'aliancas', label: 'Alianças', quantity: 41 },
  { value: 'aparadores', label: 'Aparadores', quantity: 18 },
  { value: 'aneis-de-coquetel', label: 'Anéis de coquetel', quantity: 27 },
  { value: 'ouro-branco', label: 'Ouro branco', quantity: 30 },
];

export default function CategoryTitle15() {
  const [ativa, setAtiva] = useState<string | null>(null);

  const escolher = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setAtiva(a => (value && value !== a ? value : null));
  };

  return (
    <div className={styles.categoryTitle15Box}>
      <section className={styles.categoryTitle15} aria-label="Categoria" data-role="ct-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          <span className={styles.eyebrow} data-role="ct-eyebrow">
            {MAE}
          </span>
          <h1 className={styles.title} data-role="ct-title">
            {TITULO}
          </h1>
          <p className={styles.count} data-role="ct-count">
            <span className={styles.rule} aria-hidden="true" />
            <span className={styles.countText}>
              {TOTAL.toLocaleString('pt-BR')} {COUNT_LABEL}
            </span>
            <span className={styles.rule} aria-hidden="true" />
          </p>
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

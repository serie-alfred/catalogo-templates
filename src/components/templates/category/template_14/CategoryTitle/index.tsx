'use client';

import React, { useState } from 'react';

import styles from './index.module.css';
import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

/**
 * Espelha `organisms/CategoryTitle14` do faststore.starter (família 14, Esportiva; desenho
 * `CategoryTitle14`): faixa marinho com o nome da categoria enorme em Saira itálica, a contagem
 * num paralelogramo lima ao lado ("186 PRODUTOS") e os chips de subcategoria em paralelogramo,
 * cada um com a quantidade; no desktop, o nome repetido em contorno vazado ao fundo e o traço
 * lima inclinado (forma, `aria-hidden`). Mesmo markup, classes e `data-role`; o CSS é derivado
 * do SCSS de lá.
 *
 * Lá nome, contagem e chips vêm do contexto da PLP; aqui são o exemplo do mock.ts de lá. Sem
 * chip "Todos" (o desenho não tem) e nenhum chip nasce ativo. O chip, que lá troca o filtro
 * pela store de busca, aqui alterna num `useState`.
 */
interface Subcat {
  value: string;
  label: string;
  quantity?: number;
}

const COUNT_LABEL = 'produtos';
const TITULO = 'Corrida';
const TOTAL = 186;
const SUBCATS: Subcat[] = [
  { value: 'tenis', label: 'Tênis', quantity: 64 },
  { value: 'camisetas', label: 'Camisetas', quantity: 38 },
  { value: 'shorts', label: 'Shorts', quantity: 27 },
  { value: 'leggings', label: 'Leggings', quantity: 22 },
  { value: 'jaquetas', label: 'Jaquetas', quantity: 14 },
  { value: 'acessorios', label: 'Acessórios', quantity: 35 },
];

export default function CategoryTitle14() {
  const [ativa, setAtiva] = useState<string | null>(null);

  const escolher = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setAtiva(a => (value && value !== a ? value : null));
  };

  return (
    <div className={styles.categoryTitle14Box}>
      <section className={styles.categoryTitle14} aria-label="Categoria" data-role="ct-root">
        <link rel="stylesheet" href={FONTES_14} />
        <span className={styles.watermark} aria-hidden="true" data-role="ct-watermark">
          {TITULO}
        </span>
        <span className={styles.stripe} aria-hidden="true" />
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

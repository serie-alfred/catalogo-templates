'use client';

import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/CategoryTitle17` do faststore.starter (família 17, Pet; desenho
 * `CategoryTitle17`): faixa na superfície clara com o nome da categoria grande em Bricolage, a
 * contagem na cor primária ao lado, a descrição curta (só desktop) e as subcategorias em pílulas
 * claras com a quantidade. Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Lá nome, contagem, descrição e chips vêm do contexto da PLP; aqui são o exemplo do mock.ts de lá
 * (o que o palco mostra). O chip, que lá troca o filtro pela store de busca, aqui alterna num
 * `useState`.
 */
const FONTES =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap';

interface Subcat {
  value: string;
  label: string;
  quantity?: number;
}

const COUNT_LABEL = 'produtos';
const TITULO = 'Ração';
const TOTAL = 486;
const DESCRICAO =
  'Seca, úmida ou natural, para cada idade, porte e fase da vida do seu pet.';
const SUBCATS: Subcat[] = [
  { value: 'racao-seca', label: 'Ração seca', quantity: 312 },
  { value: 'racao-umida', label: 'Ração úmida', quantity: 96 },
  { value: 'racao-natural', label: 'Ração natural', quantity: 41 },
  { value: 'filhotes', label: 'Filhotes', quantity: 58 },
  { value: 'castrados', label: 'Castrados', quantity: 44 },
  { value: 'senior', label: 'Sênior', quantity: 37 },
];

export default function CategoryTitle17() {
  const [ativa, setAtiva] = useState('');

  const escolher = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setAtiva(a => (a === value ? '' : value));
  };

  return (
    <div className={styles.categoryTitle17Box}>
      <section
        className={styles.categoryTitle17}
        aria-label="Categoria"
        data-role="ct-root"
      >
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <h1 className={styles.title} data-role="ct-title">
              {TITULO}
            </h1>
            <p className={styles.count} data-role="ct-count">
              {TOTAL.toLocaleString('pt-BR')} {COUNT_LABEL}
            </p>
          </div>
          <p className={styles.description} data-role="ct-description">
            {DESCRICAO}
          </p>
          <nav
            className={styles.chips}
            aria-label="Subcategorias"
            data-role="ct-chips"
          >
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

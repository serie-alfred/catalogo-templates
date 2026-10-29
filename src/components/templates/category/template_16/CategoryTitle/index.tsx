'use client';

import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/CategoryTitle16` do faststore.starter (família 16, Infantil; desenho
 * `CategoryTitle16`): faixa amarela com o nome da categoria em Fredoka, a contagem no selo roxo
 * inclinado, as subcategorias em pílulas brancas com a quantidade e a onda creme no pé (hex fixo
 * de ilustração). Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Lá nome, contagem e chips vêm do contexto da PLP; aqui são o exemplo do mock.ts de lá. O chip,
 * que lá troca o filtro pela store de busca, aqui alterna num `useState`.
 */
const FONTES =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap';

interface Subcat {
  value: string;
  label: string;
  quantity?: number;
}

const COUNT_LABEL = 'produtos';
const TITULO = 'Brinquedos';
const TOTAL = 248;
const SUBCATS: Subcat[] = [
  { value: 'blocos-de-montar', label: 'Blocos de montar', quantity: 42 },
  { value: 'pelucias', label: 'Pelúcias', quantity: 36 },
  { value: 'quebra-cabecas', label: 'Quebra-cabeças', quantity: 51 },
  { value: 'jogos', label: 'Jogos', quantity: 47 },
  { value: 'faz-de-conta', label: 'Faz de conta', quantity: 38 },
  { value: 'ao-ar-livre', label: 'Ao ar livre', quantity: 34 },
];

export default function CategoryTitle16() {
  const [ativa, setAtiva] = useState('');

  const escolher = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setAtiva(a => (a === value ? '' : value));
  };

  return (
    <div className={styles.categoryTitle16Box}>
      <section className={styles.categoryTitle16} aria-label="Categoria" data-role="ct-root">
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
        <svg className={`${styles.wave} ${styles.waveDesk}`} aria-hidden="true" viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path d="M0 20C120 0 240 40 360 20S600 0 720 20s240 20 360 0 240-20 360 0V40H0z" />
        </svg>
        <svg className={`${styles.wave} ${styles.waveMob}`} aria-hidden="true" viewBox="0 0 375 24" preserveAspectRatio="none">
          <path d="M0 12C47 0 94 24 141 12S234 0 281 12s47 12 94 0V24H0z" />
        </svg>
      </section>
    </div>
  );
}

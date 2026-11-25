'use client';

import React, { useState } from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/BenefitsStrip08` do faststore.starter (família 08, Figma "Templates - Serie A").
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS
 * é derivado do SCSS de lá (`yarn derivar:css`). Conteúdo = o mock.ts de lá, por
 * baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá). O
 * envelope `.…Box` é o container das regras mobile (a raiz e o bloco são o mesmo
 * elemento, e uma @container não estiliza o próprio container).
 */

const FONTES =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap';

interface Ruler08Conteudo {
  benefits: { title?: string; subtitle?: string }[];
}

const MOCK: Ruler08Conteudo = {
  benefits: [0, 1, 2, 3].map(() => ({
    title: 'Frete Grátis',
    subtitle: 'Bônus primeira compra',
  })),
};

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d={
        dir === 'next'
          ? 'M8.33333 13.3333L11.6667 10L8.33333 6.66667'
          : 'M11.6667 13.3333L8.33333 10L11.6667 6.66667'
      }
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Ruler08() {
  const { benefits } = useConteudoDaSecao(MOCK);
  const n = benefits.length;
  const [atual, setAtual] = useState(0);
  const ir = (passo: number) => setAtual(i => (i + passo + n) % n);

  if (!n) return null;

  return (
    <div className={styles.benefitsStrip08Box}>
      <section
        className={`${styles.benefitsStrip08} ${styles.benefits}`}
        data-role="bs-root"
        aria-label="Benefícios"
      >
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={FONTES} />
        {n > 1 && (
          <button
            type="button"
            className={styles.benefitsArrow}
            aria-label="Benefício anterior"
            onClick={() => ir(-1)}
          >
            <Chevron dir="prev" />
          </button>
        )}
        <ul className={styles.benefitsList}>
          {benefits.map((b, i) => (
            <li
              key={i}
              className={`${styles.benefit}${i === atual ? ` ${styles.benefitAtual}` : ''}`}
              data-role="bs-item"
            >
              {b.title && (
                <p className={styles.benefitTitle} data-role="bs-title">
                  {b.title}
                </p>
              )}
              {b.subtitle && (
                <p className={styles.benefitText} data-role="bs-text">
                  {b.subtitle}
                </p>
              )}
            </li>
          ))}
        </ul>
        {n > 1 && (
          <button
            type="button"
            className={styles.benefitsArrow}
            aria-label="Próximo benefício"
            onClick={() => ir(1)}
          >
            <Chevron dir="next" />
          </button>
        )}
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Ruler08.conteudoPadrao = MOCK;

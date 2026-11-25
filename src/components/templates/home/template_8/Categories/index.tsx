import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories08` do faststore.starter (família 08, Figma "Templates - Serie A").
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS
 * é derivado do SCSS de lá (`yarn derivar:css`). Conteúdo = o mock.ts de lá, por
 * baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá). O
 * envelope `.…Box` é o container das regras mobile (a raiz e o bloco são o mesmo
 * elemento, e uma @container não estiliza o próprio container).
 */

const RETRATO = '/gerador/familia08/ph-card.png';

const FONTES =
  'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;0,800;1,600&display=swap';

interface Categories08Conteudo {
  categories: {
    image?: string;
    title?: string;
    subtitle?: string;
    buttonLabel?: string;
    url?: string;
  }[];
}

const categoria = (title: string, subtitle: string) => ({
  image: RETRATO,
  title,
  subtitle,
  buttonLabel: 'Ver Produtos',
  url: '#',
});

const MOCK: Categories08Conteudo = {
  categories: [
    categoria('Looks\nfemininos', 'Estilo e ofertas para\ntodas as ocasiões'),
    categoria('Looks\nMasculinos', 'Essenciais Com\naté 70% OFF'),
    categoria('Acessórios', 'O toque final\npara o seu look'),
    categoria('Calçados', 'Conforto e estilo\nem grandes ofertas'),
  ],
};

const ArrowRight = () => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M15.8333 10H4.16667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6667 14.1667L15.8333 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6667 5.83333L15.8333 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Categories08() {
  const { categories } = useConteudoDaSecao(MOCK);
  if (!categories.length) return null;

  return (
    <div className={styles.categories08Box}>
      <section
        className={`${styles.categories08} ${styles.categoryStrip}`}
        data-role="ct-root"
      >
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={FONTES} />
        {categories.map((c, i) => (
          <a
            key={i}
            className={styles.category}
            href={c.url || '#'}
            data-role="ct-card"
          >
            {c.image && (
              <img
                className={styles.categoryImg}
                src={c.image}
                alt=""
                width={292}
                height={340}
              />
            )}
            <div className={styles.categoryContent}>
              {c.title && (
                <p className={styles.categoryTitle} data-role="ct-title">
                  {c.title}
                </p>
              )}
              {c.subtitle && (
                <p className={styles.categoryText} data-role="ct-text">
                  {c.subtitle}
                </p>
              )}
              {c.buttonLabel && (
                <span className={styles.categoryButton} data-role="ct-button">
                  <span>{c.buttonLabel}</span>
                  <ArrowRight />
                </span>
              )}
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Categories08.conteudoPadrao = MOCK;

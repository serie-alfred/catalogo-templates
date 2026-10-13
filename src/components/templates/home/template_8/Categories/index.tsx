import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories08` do faststore.starter (família 08, Figma "Templates - Serie A").
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS
 * é derivado do SCSS de lá (`yarn derivar:css`). Conteúdo = o mock.ts de lá. O
 * envelope `.…Box` é o container das regras mobile (a raiz e o bloco são o mesmo
 * elemento, e uma @container não estiliza o próprio container).
 */

const RETRATO = '/gerador/familia08/ph-card.png';

const FONTES =
  'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;0,800;1,600&display=swap';

const CATEGORIAS = [
  {
    title: 'Looks\nfemininos',
    subtitle: 'Estilo e ofertas para\ntodas as ocasiões',
  },
  { title: 'Looks\nMasculinos', subtitle: 'Essenciais Com\naté 70% OFF' },
  { title: 'Acessórios', subtitle: 'O toque final\npara o seu look' },
  { title: 'Calçados', subtitle: 'Conforto e estilo\nem grandes ofertas' },
];

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
        {CATEGORIAS.map(c => (
          <a
            key={c.title}
            className={styles.category}
            href="#"
            data-role="ct-card"
          >
            <img
              className={styles.categoryImg}
              src={RETRATO}
              alt=""
              width={292}
              height={340}
            />
            <div className={styles.categoryContent}>
              <p className={styles.categoryTitle} data-role="ct-title">
                {c.title}
              </p>
              <p className={styles.categoryText} data-role="ct-text">
                {c.subtitle}
              </p>
              <span className={styles.categoryButton} data-role="ct-button">
                <span>Ver Produtos</span>
                <ArrowRight />
              </span>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}

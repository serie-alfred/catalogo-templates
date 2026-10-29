import React from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories14` do faststore.starter (família 14, Esportiva; desenho
 * `Categories14` / `Categories14-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e
 * as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá, sem
 * foto (o desenho também não tem: vale o cinza-azulado da posição).
 */
interface Categories14Category {
  name?: string;
  url?: string;
  /** Foto da categoria (vertical 3:4, 600 × 800). */
  image?: string;
  imageAlt?: string;
}

interface Categories14Props {
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  categories?: Categories14Category[];
}

const Seta = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="square"
    aria-hidden="true"
  >
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

// Conteúdo do mock.ts do starter.
const CONTEUDO: Categories14Props = {
  title: 'Escolha sua modalidade',
  viewAllLabel: 'Ver todas',
  viewAllUrl: '/s',
  categories: [
    { name: 'Corrida', url: '/s' },
    { name: 'Treino', url: '/s' },
    { name: 'Futebol', url: '/s' },
    { name: 'Ciclismo', url: '/s' },
    { name: 'Suplementos', url: '/s' },
    { name: 'Natação', url: '/s' },
  ],
};

export default function Categories14() {
  const { title, viewAllLabel, viewAllUrl, categories = [] } = CONTEUDO;
  if (!categories.length) return null;

  return (
    <div className={styles.categories14Box}>
      <section
        className={styles.categories14}
        aria-label={title || 'Categorias'}
        data-role="ct-root"
      >
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.inner}>
          {(title || viewAllLabel) && (
            <div className={styles.head}>
              {title && (
                <h2 className={styles.title} data-role="ct-title">
                  {title}
                </h2>
              )}
              {viewAllLabel && (
                <a
                  className={styles.viewAll}
                  href={viewAllUrl || '#'}
                  data-role="ct-view-all"
                >
                  {viewAllLabel}
                  <Seta className={styles.viewAllIcon} />
                </a>
              )}
            </div>
          )}
          <ul className={styles.list}>
            {categories.map((c, i) => (
              <li key={i} className={styles.item} data-role="ct-item">
                <a
                  className={styles.card}
                  href={c.url || '#'}
                  aria-label={c.name || c.imageAlt || undefined}
                >
                  {c.image && (
                    <img
                      className={styles.img}
                      src={c.image}
                      alt={c.imageAlt ?? ''}
                      width={600}
                      height={800}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <span className={styles.num} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {c.name && (
                    <span className={styles.name} aria-hidden="true">
                      {c.name}
                    </span>
                  )}
                  <span className={styles.arrow} aria-hidden="true">
                    <Seta />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

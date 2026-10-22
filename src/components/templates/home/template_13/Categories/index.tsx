import React from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories13` do faststore.starter (família 13, Noturno; desenho
 * `Categories13` / `Categories13-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (sem foto: valem os grafites de placeholder do CSS).
 */
interface Categories13Category {
  name?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
}

// Conteúdo do mock.ts do starter.
const MOCK = {
  title: 'Compre por categoria',
  viewAllLabel: 'Ver tudo',
  viewAllUrl: '/s',
  categories: [
    { name: 'Tênis', url: '/s' },
    { name: 'Roupas', url: '/s' },
    { name: 'Acessórios', url: '/s' },
    { name: 'Outlet', url: '/s' },
  ] as Categories13Category[],
};

const SetaDiagonal = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    aria-hidden="true"
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export default function Categories13() {
  const { title, viewAllLabel, viewAllUrl, categories } = MOCK;
  if (!categories.length) return null;

  return (
    <div className={styles.categories13Box}>
      <section
        className={styles.categories13}
        aria-label={title || 'Categorias'}
        data-role="ct-root"
      >
        <link rel="stylesheet" href={FONTES_13} />
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
                  <span>{viewAllLabel}</span>
                </a>
              )}
            </div>
          )}
          <ul className={styles.list}>
            {categories.map((c, i) => (
              <li key={i} className={styles.item} data-role="ct-item">
                <a className={styles.card} href={c.url || '#'}>
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
                  {c.name && <span className={styles.name}>{c.name}</span>}
                  <span className={styles.arrow}>
                    <SetaDiagonal />
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

import React from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories12` do faststore.starter (família 12, Suave; desenho
 * `Categories12` / `Categories12-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (sem foto: vale o pastel da posição). `styles.name` não tem regra no SCSS de origem
 * (o nome herda do `.label`); fica como lá.
 */
interface Categories12Category {
  name?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
  /** Selo ao lado do nome (ex.: "Novo"); com selo, o anel pinta na cor de destaque. */
  badge?: string;
}

// Conteúdo do mock.ts do starter (textos literais do desenho `Categories12`).
const TITLE = 'Explore por categoria';
const SUBTITLE = 'Tudo para a sua rotina de autocuidado, do rosto aos pés.';
const CATEGORIES: Categories12Category[] = [
  { name: 'Novidades', url: '/s', badge: 'Novo' },
  { name: 'Skincare', url: '/s' },
  { name: 'Maquiagem', url: '/s' },
  { name: 'Cabelos', url: '/s' },
  { name: 'Corpo', url: '/s' },
  { name: 'Kits', url: '/s' },
  { name: 'Infantil', url: '/s' },
];

export default function Categories12() {
  const title = TITLE;
  const subtitle = SUBTITLE;
  const categories = CATEGORIES;
  if (!categories.length) return null;

  return (
    <div className={styles.categories12Box}>
      <section
        className={styles.categories12}
        aria-label={title || 'Categorias'}
        data-role="ct-root"
      >
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.inner}>
          {(title || subtitle) && (
            <div className={styles.head}>
              {title && (
                <h2 className={styles.title} data-role="ct-title">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className={styles.subtitle} data-role="ct-subtitle">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          <ul className={styles.list}>
            {categories.map((c, i) => (
              <li key={i} className={styles.item} data-role="ct-item">
                <a className={styles.link} href={c.url || '#'}>
                  <span
                    className={`${styles.ring}${c.badge ? ` ${styles.ringOn}` : ''}`}
                  >
                    <span className={styles.thumb}>
                      {c.image && (
                        <img
                          src={c.image}
                          alt={c.imageAlt ?? ''}
                          width={264}
                          height={264}
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </span>
                  </span>
                  <span className={styles.label}>
                    {c.name && <span className={styles.name}>{c.name}</span>}
                    {c.badge && (
                      <span className={styles.badge}>{c.badge}</span>
                    )}
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

import React from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories15` do faststore.starter (família 15, Luxo; desenho
 * `Categories15` / `Categories15-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá,
 * sem fotos (vale o placeholder de areia do CSS).
 */
interface Categoria {
  name?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
}

interface Categories15Conteudo {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  linkLabel?: string;
  categories: Categoria[];
}

const MOCK: Categories15Conteudo = {
  eyebrow: 'O universo da maison',
  title: 'Compre por',
  titleEmphasis: 'categoria',
  linkLabel: 'Ver',
  categories: [
    { name: 'Joias', url: '/s' },
    { name: 'Relógios', url: '/s' },
    { name: 'Perfumes', url: '/s' },
    { name: 'Beleza', url: '/s' },
  ],
};

export default function Categories15() {
  const { eyebrow, title, titleEmphasis, linkLabel, categories } = useConteudoDaSecao(MOCK);
  if (!categories.length) return null;

  return (
    <div className={styles.categories15Box}>
      <section className={styles.categories15} aria-label={[title, titleEmphasis].filter(Boolean).join(' ') || 'Categorias'} data-role="cat-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          {(eyebrow || title || titleEmphasis) && (
            <div className={styles.head}>
              {eyebrow && (
                <span className={styles.eyebrow} data-role="cat-eyebrow">
                  {eyebrow}
                </span>
              )}
              {(title || titleEmphasis) && (
                <h2 className={styles.title} data-role="cat-title">
                  {title} {titleEmphasis && <em>{titleEmphasis}</em>}
                </h2>
              )}
              <span className={styles.headRule} aria-hidden="true" />
            </div>
          )}
          <ul className={styles.grid} data-role="cat-list">
            {categories.map((c, i) => (
              <li key={i} className={styles.item}>
                <a className={styles.card} href={c.url || '#'} data-role="cat-item">
                  <span className={styles.media}>
                    {c.image && <img src={c.image} alt={c.imageAlt ?? ''} width={600} height={800} loading="lazy" decoding="async" />}
                  </span>
                  <span className={styles.row}>
                    <span className={styles.name} data-role="cat-name">
                      {c.name}
                    </span>
                    {linkLabel && (
                      <span className={styles.more} aria-hidden="true">
                        {linkLabel}
                      </span>
                    )}
                    <svg className={styles.arrow} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                      <path d="M4 12h16M14 6l6 6-6 6" />
                    </svg>
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

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Categories15.conteudoPadrao = MOCK;

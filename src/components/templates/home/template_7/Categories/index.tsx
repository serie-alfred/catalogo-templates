import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories07` do faststore.starter — grid "Nossa
 * curadoria": 6 cards no desktop, 4 no mobile, com listas de conteúdo
 * diferentes por breakpoint.
 *
 * O mock da origem não manda `image`, então os cards ficam no gradiente de
 * fallback — mesma coisa aqui, para os dois lados baterem.
 */
interface CategoryItem {
  label: string;
  url: string;
}

const conteudo = {
  title: 'Nossa curadoria',
  viewAllLabel: 'Ver todos →',
  viewAllUrl: '/categorias',
  categories: [
    { label: 'Tapetes', url: '/tapetes' },
    { label: 'Cama', url: '/cama' },
    { label: 'Mesa & Cozinha', url: '/mesa-cozinha' },
    { label: 'Banho', url: '/banho' },
    { label: 'Decoração', url: '/decoracao' },
    { label: 'Infantil', url: '/infantil' },
  ] as CategoryItem[],
  categoriesMobile: [
    { label: 'Tapetes', url: '/tapetes' },
    { label: 'Cama', url: '/cama' },
    { label: 'Banho', url: '/banho' },
    { label: 'Decoração', url: '/decoracao' },
  ] as CategoryItem[],
};

function Card({
  c,
  imgClass,
  labelClass,
  cardRole,
  imgRole,
  labelRole,
}: {
  c: CategoryItem;
  imgClass: string;
  labelClass: string;
  cardRole: string;
  imgRole: string;
  labelRole: string;
}) {
  return (
    <a className={styles.card} href={c.url} data-role={cardRole}>
      <div className={imgClass} data-role={imgRole}>
        <span className={styles.scrim} aria-hidden="true" />
      </div>
      <p className={labelClass} data-role={labelRole}>
        {c.label}
      </p>
    </a>
  );
}

export default function Categories() {
  return (
    <div className={styles.categories07Root}>
      <div className={styles.desktop}>
        <div className={styles.header} data-role="cat-header">
          <h2 className={styles.title} data-role="cat-title">
            {conteudo.title}
          </h2>
          <a
            className={styles.viewAll}
            href={conteudo.viewAllUrl}
            data-role="cat-viewall"
          >
            {conteudo.viewAllLabel}
          </a>
        </div>
        <div className={styles.grid} data-role="cat-grid">
          {conteudo.categories.map((c, i) => (
            <Card
              key={i}
              c={c}
              imgClass={styles.img}
              labelClass={styles.label}
              cardRole="cat-card"
              imgRole="cat-img"
              labelRole="cat-label"
            />
          ))}
        </div>
      </div>

      <div className={styles.mobile}>
        <div className={styles.mSection} data-role="m-cat">
          <h2 className={styles.mTitle} data-role="m-cat-title">
            {conteudo.title}
          </h2>
          <div className={styles.mGrid} data-role="m-cat-grid">
            {conteudo.categoriesMobile.map((c, i) => (
              <Card
                key={i}
                c={c}
                imgClass={styles.mImg}
                labelClass={styles.mLabel}
                cardRole="m-cat-card"
                imgRole="m-cat-img"
                labelRole="m-cat-label"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

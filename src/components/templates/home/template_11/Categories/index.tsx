import React, { useState } from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories11` do faststore.starter (família 11, Grade; desenho
 * `Categories11` / `Categories11-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (sem arte: vale o placeholder do CSS). A linha em foco (hover/teclado; a 1ª ao abrir)
 * fica invertida, como lá.
 */
interface Categories11Category {
  name?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
}

interface Categories11Props {
  sectionNumber?: string;
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  categories?: Categories11Category[];
}

// Conteúdo do mock.ts do starter.
const MOCK: Categories11Props = {
  sectionNumber: '01',
  title: 'Categorias',
  viewAllLabel: 'Ver tudo',
  viewAllUrl: '/s',
  categories: [
    { name: 'Iluminação', url: '/iluminacao' },
    { name: 'Mobiliário', url: '/mobiliario' },
    { name: 'Objetos', url: '/objetos' },
    { name: 'Têxteis', url: '/texteis' },
    { name: 'Outlet', url: '/outlet' },
  ],
};

const Seta = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const dois = (n: number) => String(n).padStart(2, '0');

export default function Categories11() {
  const {
    sectionNumber,
    title,
    viewAllLabel,
    viewAllUrl,
    categories = [],
  } = MOCK;
  const [foco, setFoco] = useState(0);

  if (!categories.length) return null;
  const ativa = categories[Math.min(foco, categories.length - 1)];

  return (
    <div className={styles.categories11Box}>
      <section
        className={styles.categories11}
        aria-label={title || 'Categorias'}
        data-role="cat-root"
      >
        <link rel="stylesheet" href={FONTES_11} />
        <div className={styles.box}>
          <div className={styles.head}>
            {(title || sectionNumber) && (
              <h2 className={styles.title} data-role="cat-title">
                {sectionNumber && (
                  <span className={styles.number}>[{sectionNumber}]</span>
                )}
                {title}
              </h2>
            )}
            <span className={styles.spacer} />
            {viewAllLabel && (
              <a
                className={styles.viewAll}
                href={viewAllUrl || '#'}
                data-role="cat-view-all"
              >
                {viewAllLabel}
                <Seta size={16} />
              </a>
            )}
          </div>
          <div className={styles.body}>
            <ul className={styles.list}>
              {categories.map((c, i) => (
                <li key={i}>
                  <a
                    className={`${styles.row}${i === foco ? ` ${styles.rowOn}` : ''}`}
                    href={c.url || '#'}
                    onMouseEnter={() => setFoco(i)}
                    onFocus={() => setFoco(i)}
                    data-role="cat-item"
                  >
                    <span className={styles.num} aria-hidden="true">
                      {dois(i + 1)}
                    </span>
                    <span className={styles.name}>{c.name}</span>
                    <span className={styles.arrow}>
                      <Seta size={20} />
                    </span>
                    <span className={styles.thumb}>
                      {c.image && (
                        <img
                          src={c.image}
                          alt=""
                          width={144}
                          height={144}
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div
              className={styles.panel}
              aria-hidden="true"
              data-role="cat-image"
            >
              {ativa?.image && (
                <img
                  src={ativa.image}
                  alt={ativa.imageAlt ?? ''}
                  width={960}
                  height={720}
                  loading="lazy"
                  decoding="async"
                />
              )}
              {ativa?.name && (
                <span className={styles.panelLabel}>{ativa.name}</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

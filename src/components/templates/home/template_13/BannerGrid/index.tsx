import React from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BannerGrid13` do faststore.starter (família 13, Noturno; desenho
 * `BannerGrid13` / `BannerGrid13-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (sem arte: valem os grafites de placeholder do CSS).
 */
interface BannerGrid13Banner {
  eyebrow?: string;
  title?: string;
  ctaLabel?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

// Conteúdo do mock.ts do starter.
const BANNERS: BannerGrid13Banner[] = [
  {
    eyebrow: '01',
    title: 'Corrida',
    ctaLabel: 'Comprar',
    url: '/s',
    imageAlt: 'Corrida',
  },
  {
    eyebrow: '02',
    title: 'Skate',
    ctaLabel: 'Comprar',
    url: '/s',
    imageAlt: 'Skate',
  },
  {
    eyebrow: '03',
    title: 'Street',
    ctaLabel: 'Comprar',
    url: '/s',
    imageAlt: 'Street',
  },
];

const Seta = () => (
  <svg
    className={styles.arrow}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function BannerGrid13() {
  const banners = BANNERS;
  if (!banners.length) return null;

  return (
    <div className={styles.bannerGrid13Box}>
      <section
        className={styles.bannerGrid13}
        aria-label="Lookbook"
        data-role="bg-root"
      >
        <link rel="stylesheet" href={FONTES_13} />
        <ul className={styles.grid}>
          {banners.map((b, i) => (
            <li key={i} className={styles.item} data-role="bg-item">
              <a className={styles.card} href={b.url || '#'}>
                {(b.imageDesktop || b.imageMobile) && (
                  <picture className={styles.art}>
                    {b.imageMobile && (
                      <source
                        media="(max-width: 960px)"
                        srcSet={b.imageMobile}
                      />
                    )}
                    <img
                      src={b.imageDesktop || b.imageMobile}
                      alt={b.imageAlt ?? ''}
                      width={640}
                      height={900}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                )}
                <span className={styles.copy}>
                  {b.eyebrow && (
                    <span className={styles.eyebrow}>{b.eyebrow}</span>
                  )}
                  {b.title && (
                    <span className={styles.title} data-role="bg-title">
                      {b.title}
                    </span>
                  )}
                  {b.ctaLabel && (
                    <span className={styles.cta} data-role="bg-cta">
                      {b.ctaLabel}
                      <Seta />
                    </span>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

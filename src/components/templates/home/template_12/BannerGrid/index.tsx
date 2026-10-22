import React from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BannerGrid12` do faststore.starter (família 12, Suave; desenho
 * `BannerGrid12` / `BannerGrid12-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (sem arte: valem os arcos de placeholder). O cartão inteiro é o link.
 */
interface BannerGrid12Banner {
  eyebrow?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

// Conteúdo do mock.ts do starter (textos literais do desenho `BannerGrid12`).
const BANNERS: BannerGrid12Banner[] = [
  {
    eyebrow: 'Skincare',
    title: 'Pele radiante',
    text: 'Vitamina C e niacinamida para um brilho que vem de dentro.',
    ctaLabel: 'Comprar skincare',
    url: '/s',
    imageAlt: 'Pele radiante',
  },
  {
    eyebrow: 'Corpo e banho',
    title: 'Um ritual sem pressa',
    text: 'Óleos, loções e esfoliantes para cuidar do corpo todo.',
    ctaLabel: 'Ver corpo e banho',
    url: '/s',
    imageAlt: 'Um ritual sem pressa',
  },
  {
    eyebrow: 'Cabelos',
    title: 'Fios fortes e macios',
    text: 'Máscaras e finalizadores para todo tipo de cabelo.',
    ctaLabel: 'Ver cabelos',
    url: '/s',
    imageAlt: 'Fios fortes e macios',
  },
];

export default function BannerGrid12() {
  const banners = BANNERS;
  if (!banners.length) return null;

  return (
    <div className={styles.bannerGrid12Box}>
      <section
        className={styles.bannerGrid12}
        aria-label="Destaques"
        data-role="bg-root"
      >
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.grid}>
          {banners.map((b, i) => (
            <a
              key={i}
              className={styles.card}
              href={b.url || '#'}
              data-role="bg-card"
            >
              {b.eyebrow && <span className={styles.eyebrow}>{b.eyebrow}</span>}
              {b.title && (
                <h3 className={styles.title} data-role="bg-title">
                  {b.title}
                </h3>
              )}
              {b.text && <p className={styles.text}>{b.text}</p>}
              {b.ctaLabel && (
                <span className={styles.cta} data-role="bg-cta">
                  {b.ctaLabel}
                </span>
              )}
              <span className={styles.art} data-role="bg-image">
                {(b.imageDesktop || b.imageMobile) && (
                  <picture>
                    {b.imageMobile && (
                      <source media="(max-width: 960px)" srcSet={b.imageMobile} />
                    )}
                    <img
                      src={b.imageDesktop || b.imageMobile}
                      alt={b.imageAlt ?? ''}
                      width={600}
                      height={640}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                )}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

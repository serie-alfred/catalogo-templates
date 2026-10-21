import React from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BannerGrid10` do faststore.starter (família 10, Varejo;
 * desenho `BannerGrid10`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá: o banner grande no acento e quatro menores, um em cada tom, sem arte (o
 * starter só renderiza `<picture>` quando há URL; vale o fundo da mídia).
 */

type Tom = 'highlight' | 'neutral' | 'tint' | 'outline';

interface Banner {
  eyebrow: string;
  title: string;
  priceText: string;
  ctaLabel: string;
  tone?: Tom;
}

const TONS: Record<Tom, string> = {
  highlight: styles.toneHighlight,
  neutral: styles.toneNeutral,
  tint: styles.toneTint,
  outline: styles.toneOutline,
};

const BANNERS: Banner[] = [
  {
    eyebrow: 'Eletrodomésticos',
    title: 'Cozinha completa com até 35% OFF',
    priceText: 'a partir de R$ 99,90',
    ctaLabel: 'Ver ofertas',
  },
  {
    tone: 'highlight',
    eyebrow: 'Games',
    title: 'Consoles e acessórios',
    priceText: 'a partir de R$ 99',
    ctaLabel: 'Comprar',
  },
  {
    tone: 'neutral',
    eyebrow: 'Informática',
    title: 'Notebooks e monitores',
    priceText: 'a partir de R$ 499',
    ctaLabel: 'Comprar',
  },
  {
    tone: 'tint',
    eyebrow: 'Casa',
    title: 'Utilidades para o dia a dia',
    priceText: 'a partir de R$ 29,90',
    ctaLabel: 'Comprar',
  },
  {
    tone: 'outline',
    eyebrow: 'Áudio',
    title: 'Fones e caixas de som',
    priceText: 'a partir de R$ 79,90',
    ctaLabel: 'Comprar',
  },
];

export default function BannerGrid10() {
  const [grande, ...menores] = BANNERS;

  return (
    <div className={styles.bannerGrid10Box}>
      <section
        className={styles.bannerGrid10}
        aria-label="Destaques por departamento"
        data-role="bg-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <a className={styles.main} href="#" data-role="bg-main">
            <span className={styles.mainCopy}>
              <span className={styles.mainEyebrow}>{grande.eyebrow}</span>
              <span className={styles.mainTitle}>{grande.title}</span>
              <span className={styles.mainPrice}>{grande.priceText}</span>
              <span className={styles.mainCta}>
                {grande.ctaLabel}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </span>
            <span className={styles.mainArt} />
          </a>
          <div className={styles.grid}>
            {menores.slice(0, 4).map(b => (
              <a
                key={b.eyebrow}
                className={`${styles.tile} ${TONS[b.tone ?? 'neutral']}`}
                href="#"
                data-role="bg-item"
              >
                {/* sem arte mobile → `artDeskOnly`, como no starter */}
                <span className={`${styles.tileArt} ${styles.artDeskOnly}`} />
                <span className={styles.tileEyebrow}>{b.eyebrow}</span>
                <span className={styles.tileTitle}>{b.title}</span>
                <span className={styles.tilePrice}>{b.priceText}</span>
                <span className={styles.tileCta}>{b.ctaLabel}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import React, { useRef, useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/BannerMain09` do faststore.starter (família 09, Editorial;
 * desenho `BannerMain09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá: três slides sem arte (vale o fundo de placeholder da mídia).
 */

interface Slide {
  eyebrow: string;
  title: string;
  titleEmphasis: string;
  text: string;
  primaryLabel: string;
  secondaryLabel: string;
}

const BASE: Slide = {
  eyebrow: 'Nova coleção',
  title: 'O essencial,',
  titleEmphasis: 'reescrito.',
  text: 'Linho, algodão e alfaiataria em cortes que atravessam estações. Peças para usar muito e por muito tempo.',
  primaryLabel: 'Ver coleção',
  secondaryLabel: 'Lookbook',
};

const SLIDES: Slide[] = [BASE, { ...BASE, eyebrow: 'Alfaiataria' }, { ...BASE, eyebrow: 'Linho' }];

const Seta = ({ dir, size = 20 }: { dir: 'prev' | 'next'; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'} />
  </svg>
);

const dois = (n: number) => String(n).padStart(2, '0');

export default function BannerMain09() {
  const [atual, setAtual] = useState(0);
  const toqueX = useRef<number | null>(null);
  const total = SLIDES.length;
  const ir = (i: number) => setAtual((i + total) % total);
  const s = SLIDES[Math.min(atual, total - 1)];

  return (
    <div className={styles.bannerMain09Box}>
      <section
        className={styles.bannerMain09}
        aria-label="Destaque"
        aria-roledescription="carrossel"
        data-role="bm-root"
        onTouchStart={e => (toqueX.current = e.touches[0].clientX)}
        onTouchEnd={e => {
          if (toqueX.current === null || total < 2) return;
          const dx = e.changedTouches[0].clientX - toqueX.current;
          toqueX.current = null;
          if (Math.abs(dx) > 40) ir(atual + (dx < 0 ? 1 : -1));
        }}
      >
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          <div className={styles.content}>
            <div className={styles.spacer} aria-hidden="true" />
            <div className={styles.copy} aria-live="polite">
              <span className={styles.eyebrow} data-role="bm-eyebrow">
                <span className={styles.eyebrowRule} aria-hidden="true" />
                {s.eyebrow}
              </span>
              <h2 className={styles.title} data-role="bm-title">
                {s.title} <em>{s.titleEmphasis}</em>
              </h2>
              <p className={styles.text} data-role="bm-text">
                {s.text}
              </p>
              <div className={styles.ctas}>
                <a className={styles.primary} href="#" data-role="bm-cta">
                  {s.primaryLabel} <Seta dir="next" size={16} />
                </a>
                <a className={styles.secondary} href="#" data-role="bm-cta-secondary">
                  {s.secondaryLabel}
                </a>
              </div>
            </div>
            <div className={styles.nav} data-role="bm-nav">
              <span className={styles.count}>
                {dois(atual + 1)} <span className={styles.muted}>/ {dois(total)}</span>
              </span>
              <div className={styles.bars}>
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.bar}${i === atual ? ` ${styles.barOn}` : ''}`}
                    onClick={() => ir(i)}
                    aria-label={`Ir para o slide ${i + 1}`}
                    aria-current={i === atual}
                  >
                    <span />
                  </button>
                ))}
              </div>
              <div className={styles.arrows}>
                <button
                  type="button"
                  className={styles.arrow}
                  onClick={() => ir(atual - 1)}
                  aria-label="Slide anterior"
                >
                  <Seta dir="prev" />
                </button>
                <button
                  type="button"
                  className={styles.arrow}
                  onClick={() => ir(atual + 1)}
                  aria-label="Próximo slide"
                >
                  <Seta dir="next" />
                </button>
              </div>
            </div>
          </div>
          <div className={styles.media} data-role="bm-image" />
        </div>
      </section>
    </div>
  );
}

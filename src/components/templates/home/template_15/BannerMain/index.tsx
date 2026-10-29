import React, { useRef, useState } from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/BannerMain15` do faststore.starter (família 15, Luxo; desenho
 * `BannerMain15` / `BannerMain15-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (3 slides, sem arte: vale o placeholder do CSS). Sem autoplay: setas, fios e arraste,
 * como lá.
 */
interface BannerMain15Slide {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  titleEnd?: string;
  text?: string;
  primaryLabel?: string;
  primaryUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

// Conteúdo do mock.ts do starter.
const slide: BannerMain15Slide = {
  eyebrow: 'Coleção Lumière',
  title: 'A luz que',
  titleEmphasis: 'atravessa',
  titleEnd: 'gerações',
  text: 'Ouro 18k, diamantes de lapidação brilhante e pérolas barrocas. Peças feitas para durar e para serem passadas adiante.',
  primaryLabel: 'Descobrir a coleção',
  primaryUrl: '/s',
  secondaryLabel: 'Agendar atendimento',
  secondaryUrl: '/s',
  url: '/s',
  imageAlt: 'Descobrir a Coleção Lumière',
};

const SLIDES: BannerMain15Slide[] = [
  slide,
  { ...slide, eyebrow: 'Alta joalheria' },
  { ...slide, eyebrow: 'Relojoaria' },
];

const Seta = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

const dois = (n: number) => String(n).padStart(2, '0');

export default function BannerMain15() {
  const slides = SLIDES;
  const [atual, setAtual] = useState(0);
  const toqueX = useRef<number | null>(null);

  if (!slides.length) return null;
  const total = slides.length;
  const ir = (i: number) => setAtual((i + total) % total);
  const s = slides[Math.min(atual, total - 1)];
  const titulo = [s.title, s.titleEmphasis, s.titleEnd].filter(Boolean).join(' ');

  const fios = (
    <div className={styles.bars}>
      {slides.map((_, i) => (
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
  );

  return (
    <div className={styles.bannerMain15Box}>
      <section
        className={styles.bannerMain15}
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
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          <div className={styles.content}>
            <div className={styles.copy} aria-live="polite">
              {s.eyebrow && (
                <span className={styles.eyebrow} data-role="bm-eyebrow">
                  <span className={styles.rule} aria-hidden="true" />
                  {s.eyebrow}
                </span>
              )}
              {titulo && (
                <h2 className={styles.title} data-role="bm-title">
                  {s.title} {s.titleEmphasis && <em>{s.titleEmphasis}</em>} {s.titleEnd}
                </h2>
              )}
              {s.text && (
                <p className={styles.text} data-role="bm-text">
                  {s.text}
                </p>
              )}
              {(s.primaryLabel || s.secondaryLabel) && (
                <div className={styles.ctas}>
                  {s.primaryLabel && (
                    <a className={styles.primary} href={s.primaryUrl || '#'} data-role="bm-cta">
                      {s.primaryLabel}
                    </a>
                  )}
                  {s.secondaryLabel && (
                    <a className={styles.secondary} href={s.secondaryUrl || '#'} data-role="bm-cta-secondary">
                      {s.secondaryLabel}
                    </a>
                  )}
                </div>
              )}
            </div>
            {total > 1 && (
              <div className={styles.nav} data-role="bm-nav">
                <span className={styles.count}>
                  {dois(atual + 1)} <span className={styles.muted}>/ {dois(total)}</span>
                </span>
                {fios}
                <div className={styles.arrows}>
                  <button type="button" className={styles.arrow} onClick={() => ir(atual - 1)} aria-label="Slide anterior">
                    <Seta dir="prev" />
                  </button>
                  <button type="button" className={styles.arrow} onClick={() => ir(atual + 1)} aria-label="Próximo slide">
                    <Seta dir="next" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <a
            className={styles.media}
            href={s.url || s.primaryUrl || '#'}
            aria-label={s.imageAlt || titulo || undefined}
            data-role="bm-image"
          >
            {(s.imageDesktop || s.imageMobile) && (
              <picture>
                {s.imageMobile && <source media="(max-width: 960px)" srcSet={s.imageMobile} />}
                <img
                  src={s.imageDesktop || s.imageMobile}
                  alt=""
                  width={1200}
                  height={900}
                  loading={atual === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </picture>
            )}
          </a>
          {total > 1 && <div className={styles.navMob}>{fios}</div>}
        </div>
      </section>
    </div>
  );
}

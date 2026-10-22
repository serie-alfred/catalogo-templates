import React, { useRef, useState } from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/BannerMain12` do faststore.starter (família 12, Suave; desenho
 * `BannerMain12` / `BannerMain12-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (3 banners, sem arte: vale o arco de placeholder do CSS). Sem autoplay: pontos e arraste.
 */
interface BannerMain12Slide {
  eyebrow?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  linkLabel?: string;
  linkUrl?: string;
  cardTitle?: string;
  cardText?: string;
  cardUrl?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

// Conteúdo do mock.ts do starter.
const base = {
  eyebrow: 'Nova rotina · Vitamina C',
  text: 'Três passos, ativos que a sua pele entende e uma textura que some em segundos.',
  ctaLabel: 'Montar minha rotina',
  ctaUrl: '/s',
  linkLabel: 'Ver kits',
  linkUrl: '/s',
  cardTitle: 'Sérum Vitamina C',
  cardText: 'Conheça o passo 2',
  cardUrl: '/s',
};

const SLIDES: BannerMain12Slide[] = [
  { ...base, title: 'Pele leve, rotina simples.', imageAlt: 'Pele leve, rotina simples.' },
  { ...base, title: 'Hidratação que dura o dia.', imageAlt: 'Hidratação que dura o dia.' },
  { ...base, title: 'Cuidado gentil, todo dia.', imageAlt: 'Cuidado gentil, todo dia.' },
];

const Seta = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function BannerMain12() {
  const slides = SLIDES;
  const [atual, setAtual] = useState(0);
  const toqueX = useRef<number | null>(null);

  if (!slides.length) return null;
  const total = slides.length;
  const ir = (i: number) => setAtual((i + total) % total);
  const idx = Math.min(atual, total - 1);
  const s = slides[idx];

  return (
    <div className={styles.bannerMain12Box}>
      <section
        className={styles.bannerMain12}
        aria-label="Destaques"
        data-role="bm-root"
      >
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.inner}>
          <div
            className={styles.slide}
            aria-roledescription="carrossel"
            aria-label="Banner principal"
            onTouchStart={e => (toqueX.current = e.touches[0].clientX)}
            onTouchEnd={e => {
              if (toqueX.current === null || total < 2) return;
              const dx = e.changedTouches[0].clientX - toqueX.current;
              toqueX.current = null;
              if (Math.abs(dx) > 40) ir(idx + (dx < 0 ? 1 : -1));
            }}
          >
            <div className={styles.copy} aria-live="polite">
              {s.eyebrow && (
                <span className={styles.eyebrow} data-role="bm-eyebrow">
                  {s.eyebrow}
                </span>
              )}
              {s.title && (
                <h2 className={styles.title} data-role="bm-title">
                  {s.title}
                </h2>
              )}
              {s.text && (
                <p className={styles.text} data-role="bm-text">
                  {s.text}
                </p>
              )}
              {(s.ctaLabel || s.linkLabel) && (
                <div className={styles.actions}>
                  {s.ctaLabel && (
                    <a
                      className={styles.cta}
                      href={s.ctaUrl || '#'}
                      data-role="bm-cta"
                    >
                      {s.ctaLabel}
                    </a>
                  )}
                  {s.linkLabel && (
                    <a
                      className={styles.link}
                      href={s.linkUrl || '#'}
                      data-role="bm-link"
                    >
                      {s.linkLabel}
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className={styles.media}>
              <div className={styles.arch} data-role="bm-image">
                {(s.imageDesktop || s.imageMobile) && (
                  <picture>
                    {s.imageMobile && (
                      <source media="(max-width: 960px)" srcSet={s.imageMobile} />
                    )}
                    <img
                      src={s.imageDesktop || s.imageMobile}
                      alt={s.imageAlt ?? ''}
                      width={720}
                      height={900}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </picture>
                )}
              </div>
              {s.cardTitle && (
                <a
                  className={styles.card}
                  href={s.cardUrl || '#'}
                  data-role="bm-card"
                >
                  <span className={styles.cardCopy}>
                    <span className={styles.cardTitle}>{s.cardTitle}</span>
                    {s.cardText && (
                      <span className={styles.cardText}>{s.cardText}</span>
                    )}
                  </span>
                  <span className={styles.cardArrow} aria-hidden="true">
                    <Seta />
                  </span>
                </a>
              )}
            </div>
          </div>
          {total > 1 && (
            <div className={styles.dots} data-role="bm-nav">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={styles.dotBtn}
                  onClick={() => ir(i)}
                  aria-current={i === idx}
                  aria-label={
                    i === idx ? `Slide ${i + 1}, atual` : `Slide ${i + 1}`
                  }
                  data-role="bm-dot"
                >
                  <span
                    className={`${styles.dot}${i === idx ? ` ${styles.dotOn}` : ''}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

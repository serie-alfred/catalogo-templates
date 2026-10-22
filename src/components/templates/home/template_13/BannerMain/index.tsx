import React, { useRef, useState } from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/BannerMain13` do faststore.starter (família 13, Noturno; desenho
 * `BannerMain13` / `BannerMain13-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (3 banners, sem arte: vale o grafite de placeholder do CSS). Sem autoplay: setas,
 * segmentos e arraste, como lá.
 */
interface BannerMain13Slide {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  text?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

// Conteúdo do mock.ts do starter.
const base = {
  eyebrow: 'Disponível agora',
  text: 'Nylon técnico, detalhes refletivos e o novo Runner V2. Edição limitada, sem reposição.',
  ctaLabel: 'Comprar o drop',
  ctaUrl: '/s',
  secondaryLabel: 'Ver lookbook',
  secondaryUrl: '/s',
  url: '/s',
};

const SLIDES: BannerMain13Slide[] = [
  { ...base, title: 'Drop', titleAccent: '07', imageAlt: 'Ver o Drop 07' },
  { ...base, title: 'Runner', titleAccent: 'V2', imageAlt: 'Ver o Runner V2' },
  {
    ...base,
    title: 'Noite',
    titleAccent: 'Fria',
    imageAlt: 'Ver a coleção Noite Fria',
  },
];

const Seta = () => (
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
);

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={dir === 'next' ? 2 : 1.8}
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function BannerMain13() {
  const slides = SLIDES;
  const [atual, setAtual] = useState(0);
  const toqueX = useRef<number | null>(null);

  if (!slides.length) return null;
  const total = slides.length;
  const idx = Math.min(atual, total - 1);
  const ir = (i: number) => setAtual((i + total) % total);
  const s = slides[idx];
  const temArte = !!(s.imageDesktop || s.imageMobile);

  return (
    <div className={styles.bannerMain13Box}>
      <section
        className={styles.bannerMain13}
        aria-roledescription="carrossel"
        aria-label="Destaques"
        data-role="bm-root"
        onTouchStart={e => (toqueX.current = e.touches[0].clientX)}
        onTouchEnd={e => {
          if (toqueX.current === null || total < 2) return;
          const dx = e.changedTouches[0].clientX - toqueX.current;
          toqueX.current = null;
          if (Math.abs(dx) > 40) ir(idx + (dx < 0 ? 1 : -1));
        }}
      >
        <link rel="stylesheet" href={FONTES_13} />
        <a
          className={styles.art}
          href={s.url || s.ctaUrl || '#'}
          aria-label={
            temArte
              ? undefined
              : s.imageAlt ||
                [s.title, s.titleAccent].filter(Boolean).join(' ') ||
                'Ver destaque'
          }
          data-role="bm-image"
        >
          {temArte && (
            <picture>
              {s.imageMobile && (
                <source media="(max-width: 960px)" srcSet={s.imageMobile} />
              )}
              <img
                src={s.imageDesktop || s.imageMobile}
                alt={s.imageAlt ?? ''}
                width={1920}
                height={1000}
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </picture>
          )}
        </a>
        <div className={styles.inner}>
          <div className={styles.copy} aria-live="polite">
            {s.eyebrow && (
              <span className={styles.eyebrow} data-role="bm-eyebrow">
                {s.eyebrow}
              </span>
            )}
            {(s.title || s.titleAccent) && (
              <h2 className={styles.title} data-role="bm-title">
                {s.title}
                {s.title && s.titleAccent && ' '}
                {s.titleAccent && (
                  <span className={styles.accent}>{s.titleAccent}</span>
                )}
              </h2>
            )}
            {s.text && (
              <p className={styles.text} data-role="bm-text">
                {s.text}
              </p>
            )}
            {(s.ctaLabel || s.secondaryLabel) && (
              <div className={styles.actions}>
                {s.ctaLabel && (
                  <a
                    className={styles.cta}
                    href={s.ctaUrl || '#'}
                    data-role="bm-cta"
                  >
                    {s.ctaLabel}
                    <Seta />
                  </a>
                )}
                {s.secondaryLabel && (
                  <a
                    className={styles.secondary}
                    href={s.secondaryUrl || '#'}
                    data-role="bm-link"
                  >
                    {s.secondaryLabel}
                  </a>
                )}
              </div>
            )}
          </div>
          {total > 1 && (
            <div className={styles.nav} data-role="bm-nav">
              <span className={styles.counter} aria-hidden="true">
                {idx + 1}
                <span className={styles.counterTotal}>/{total}</span>
              </span>
              <div className={styles.segments}>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={styles.segmentBtn}
                    onClick={() => ir(i)}
                    aria-current={i === idx}
                    aria-label={
                      i === idx
                        ? `Slide ${i + 1} de ${total}, atual`
                        : `Slide ${i + 1} de ${total}`
                    }
                    data-role="bm-dot"
                  >
                    <span
                      className={`${styles.segment}${i === idx ? ` ${styles.segmentOn}` : ''}`}
                    />
                  </button>
                ))}
              </div>
              <div className={styles.arrows}>
                <button
                  type="button"
                  className={styles.prev}
                  onClick={() => ir(idx - 1)}
                  aria-label="Slide anterior"
                >
                  <Chevron dir="prev" />
                </button>
                <button
                  type="button"
                  className={styles.next}
                  onClick={() => ir(idx + 1)}
                  aria-label="Próximo slide"
                >
                  <Chevron dir="next" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

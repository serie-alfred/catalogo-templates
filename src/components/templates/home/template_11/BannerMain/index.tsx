import React, { useRef, useState } from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/BannerMain11` do faststore.starter (família 11, Grade; desenho
 * `BannerMain11` / `BannerMain11-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (3 banners, sem arte: vale o placeholder do CSS). Sem autoplay: abas, setas e arraste.
 */
interface BannerMain11Slide {
  eyebrow?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  note?: string;
  tabLabel?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

interface BannerMain11Props {
  slides?: BannerMain11Slide[];
}

// Conteúdo do mock.ts do starter.
const base = {
  eyebrow: '[Coleção 04]',
  text: 'Luminárias de mesa, piso e pendentes em edição numerada. Desenho em aço, vidro e latão.',
  ctaLabel: 'Ver coleção',
  ctaUrl: '/s',
  note: 'Coleção N°04 · peças numeradas',
};

const MOCK: BannerMain11Props = {
  slides: [
    {
      ...base,
      title: 'Luz baixa, casa calma.',
      tabLabel: 'Luz baixa',
      imageAlt: 'Luz baixa, casa calma.',
    },
    {
      ...base,
      title: 'Madeira que dura.',
      tabLabel: 'Madeira',
      imageAlt: 'Madeira que dura.',
    },
    {
      ...base,
      title: 'Objetos de uso diário.',
      tabLabel: 'Objetos',
      imageAlt: 'Objetos de uso diário.',
    },
  ],
};

const Seta = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      d={dir === 'next' ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'}
    />
  </svg>
);

const dois = (n: number) => String(n).padStart(2, '0');

export default function BannerMain11() {
  const { slides = [] } = MOCK;
  const [atual, setAtual] = useState(0);
  const toqueX = useRef<number | null>(null);

  if (!slides.length) return null;
  const total = slides.length;
  const ir = (i: number) => setAtual((i + total) % total);
  const idx = Math.min(atual, total - 1);
  const s = slides[idx];

  return (
    <div className={styles.bannerMain11Box}>
      <section
        className={styles.bannerMain11}
        aria-label="Destaques"
        data-role="bm-root"
      >
        <link rel="stylesheet" href={FONTES_11} />
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
            <div className={styles.media} data-role="bm-image">
              {(s.imageDesktop || s.imageMobile) && (
                <picture>
                  {s.imageMobile && (
                    <source media="(max-width: 960px)" srcSet={s.imageMobile} />
                  )}
                  <img
                    src={s.imageDesktop || s.imageMobile}
                    alt={s.imageAlt ?? ''}
                    width={1600}
                    height={1100}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </picture>
              )}
              {total > 1 && (
                <span className={styles.counter} data-role="bm-counter">
                  {dois(idx + 1)} / {dois(total)}
                </span>
              )}
            </div>
            <div className={styles.copy} aria-live="polite">
              {s.eyebrow ? (
                <span className={styles.eyebrow} data-role="bm-eyebrow">
                  {s.eyebrow}
                </span>
              ) : (
                <span aria-hidden="true" />
              )}
              <div className={styles.body}>
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
                {s.ctaLabel && (
                  <a
                    className={styles.cta}
                    href={s.ctaUrl || '#'}
                    data-role="bm-cta"
                  >
                    {s.ctaLabel}
                    <Seta dir="next" />
                  </a>
                )}
              </div>
              {s.note && (
                <span className={styles.note} data-role="bm-note">
                  {s.note}
                </span>
              )}
            </div>
          </div>
          {total > 1 && (
            <div className={styles.nav} data-role="bm-nav">
              <div className={styles.tabs}>
                {slides.map((sl, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.tab}${i === idx ? ` ${styles.tabOn}` : ''}`}
                    onClick={() => ir(i)}
                    aria-current={i === idx}
                    aria-label={
                      sl.tabLabel
                        ? `Slide ${i + 1}, ${sl.tabLabel}`
                        : `Slide ${i + 1} de ${total}`
                    }
                    data-role="bm-tab"
                  >
                    <span className={styles.tabNum}>{dois(i + 1)}</span>
                    {sl.tabLabel && (
                      <span className={styles.tabLabel}>{sl.tabLabel}</span>
                    )}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => ir(idx - 1)}
                aria-label="Slide anterior"
              >
                <Seta dir="prev" />
              </button>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => ir(idx + 1)}
                aria-label="Próximo slide"
              >
                <Seta dir="next" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

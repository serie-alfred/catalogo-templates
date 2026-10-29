import React from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BannerGrid14` do faststore.starter (família 14, Esportiva; desenho
 * `BannerGrid14` / `BannerGrid14-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e
 * as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá, sem
 * arte (vale o placeholder por posição, como no desenho).
 */
interface BannerGrid14Banner {
  /** Chamada acima do título (ex.: "Desafio 10K"). */
  eyebrow?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

interface BannerGrid14Props {
  banners?: BannerGrid14Banner[];
}

// Conteúdo do mock.ts do starter.
const CONTEUDO: BannerGrid14Props = {
  banners: [
    {
      eyebrow: 'Desafio 10K',
      title: 'Linha Velox',
      text: 'Tênis, meias e garrafas para a sua próxima prova.',
      ctaLabel: 'Comprar corrida',
      url: '/s',
      imageAlt: 'Linha Velox',
    },
    {
      eyebrow: 'Treino em casa',
      title: 'Monte seu espaço',
      ctaLabel: 'Ver treino',
      url: '/s',
      imageAlt: 'Treino em casa',
    },
    {
      eyebrow: 'Suplementação',
      title: 'Recupere melhor',
      ctaLabel: 'Ver suplementos',
      url: '/s',
      imageAlt: 'Suplementação',
    },
  ],
};

export default function BannerGrid14() {
  const { banners = [] } = CONTEUDO;
  const lista = banners.slice(0, 3);
  if (!lista.length) return null;

  return (
    <div className={styles.bannerGrid14Box}>
      <section
        className={styles.bannerGrid14}
        aria-label="Campanhas"
        data-role="bg-root"
      >
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.grid}>
          {lista.map((b, i) => {
            const temArte = !!(b.imageDesktop || b.imageMobile);
            return (
              <a
                key={i}
                className={`${styles.card}${i === 0 ? ` ${styles.big}` : ''}`}
                href={b.url || '#'}
                aria-label={b.title ? undefined : b.imageAlt || 'Ver campanha'}
                data-role="bg-item"
              >
                {temArte && (
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
                      width={i === 0 ? 1000 : 760}
                      height={i === 0 ? 1240 : 600}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                )}
                {(b.eyebrow || b.title || b.text || b.ctaLabel) && (
                  <span className={styles.plate}>
                    {b.eyebrow && (
                      <span className={styles.eyebrow}>{b.eyebrow}</span>
                    )}
                    {b.title && (
                      <span className={styles.title} data-role="bg-title">
                        {b.title}
                      </span>
                    )}
                    {b.text && <span className={styles.text}>{b.text}</span>}
                    {b.ctaLabel && (
                      <span className={styles.cta} data-role="bg-cta">
                        {b.ctaLabel}
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="square"
                          aria-hidden="true"
                        >
                          <path d="M4 12h15M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    )}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}

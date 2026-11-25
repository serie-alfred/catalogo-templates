import React from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

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
  eyebrow?: string;
  title?: string;
  priceText?: string;
  ctaLabel?: string;
  url?: string;
  tone?: Tom;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

/** O conteúdo da seção: os campos do `section.schema` do BannerGrid10. */
interface BannerGrid10Conteudo {
  /** O 1º é o grande; os seguintes (até 4) vão para a grade. */
  banners: Banner[];
}

const TONS: Record<Tom, string> = {
  highlight: styles.toneHighlight,
  neutral: styles.toneNeutral,
  tint: styles.toneTint,
  outline: styles.toneOutline,
};

const TONS_PADRAO: Tom[] = ['highlight', 'neutral', 'tint', 'outline'];

const MOCK: BannerGrid10Conteudo = {
  banners: [
    {
      eyebrow: 'Eletrodomésticos',
      title: 'Cozinha completa com até 35% OFF',
      priceText: 'a partir de R$ 99,90',
      ctaLabel: 'Ver ofertas',
      url: '/eletrodomesticos',
      imageAlt: 'Cozinha completa',
    },
    {
      tone: 'highlight',
      eyebrow: 'Games',
      title: 'Consoles e acessórios',
      priceText: 'a partir de R$ 99',
      ctaLabel: 'Comprar',
      url: '/games',
    },
    {
      tone: 'neutral',
      eyebrow: 'Informática',
      title: 'Notebooks e monitores',
      priceText: 'a partir de R$ 499',
      ctaLabel: 'Comprar',
      url: '/informatica',
    },
    {
      tone: 'tint',
      eyebrow: 'Casa',
      title: 'Utilidades para o dia a dia',
      priceText: 'a partir de R$ 29,90',
      ctaLabel: 'Comprar',
      url: '/casa',
    },
    {
      tone: 'outline',
      eyebrow: 'Áudio',
      title: 'Fones e caixas de som',
      priceText: 'a partir de R$ 79,90',
      ctaLabel: 'Comprar',
      url: '/audio',
    },
  ],
};

/** Arte do banner: `<picture>` só com imagem; sem a mobile, `artDeskOnly` (como no starter). */
function Arte({
  b,
  className,
  width,
  height,
}: {
  b: Banner;
  className: string;
  width: number;
  height: number;
}) {
  return (
    <span
      className={`${className}${b.imageMobile ? '' : ` ${styles.artDeskOnly}`}`}
    >
      {(b.imageDesktop || b.imageMobile) && (
        <picture>
          {b.imageMobile && (
            <source media="(max-width: 960px)" srcSet={b.imageMobile} />
          )}
          <img
            src={b.imageDesktop || b.imageMobile}
            alt={b.imageAlt ?? ''}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
          />
        </picture>
      )}
    </span>
  );
}

export default function BannerGrid10() {
  const { banners } = useConteudoDaSecao(MOCK);
  if (!banners.length) return null;
  const [grande, ...menores] = banners;

  return (
    <div className={styles.bannerGrid10Box}>
      <section
        className={styles.bannerGrid10}
        aria-label="Destaques por departamento"
        data-role="bg-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <a
            className={styles.main}
            href={grande.url || '#'}
            data-role="bg-main"
          >
            <span className={styles.mainCopy}>
              {grande.eyebrow && (
                <span className={styles.mainEyebrow}>{grande.eyebrow}</span>
              )}
              {grande.title && (
                <span className={styles.mainTitle}>{grande.title}</span>
              )}
              {grande.priceText && (
                <span className={styles.mainPrice}>{grande.priceText}</span>
              )}
              {grande.ctaLabel && (
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
              )}
            </span>
            <span className={styles.mainArt}>
              {(grande.imageDesktop || grande.imageMobile) && (
                <picture>
                  {grande.imageMobile && (
                    <source
                      media="(max-width: 960px)"
                      srcSet={grande.imageMobile}
                    />
                  )}
                  <img
                    src={grande.imageDesktop || grande.imageMobile}
                    alt={grande.imageAlt ?? ''}
                    width={680}
                    height={620}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              )}
            </span>
          </a>
          {menores.length > 0 && (
            <div className={styles.grid}>
              {menores.slice(0, 4).map((b, i) => (
                <a
                  key={i}
                  className={`${styles.tile} ${TONS[b.tone ?? TONS_PADRAO[i]] ?? styles.toneNeutral}`}
                  href={b.url || '#'}
                  data-role="bg-item"
                >
                  <Arte
                    b={b}
                    className={styles.tileArt}
                    width={240}
                    height={150}
                  />
                  {b.eyebrow && (
                    <span className={styles.tileEyebrow}>{b.eyebrow}</span>
                  )}
                  {b.title && (
                    <span className={styles.tileTitle}>{b.title}</span>
                  )}
                  {b.priceText && (
                    <span className={styles.tilePrice}>{b.priceText}</span>
                  )}
                  {b.ctaLabel && (
                    <span className={styles.tileCta}>{b.ctaLabel}</span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerGrid10.conteudoPadrao = MOCK;

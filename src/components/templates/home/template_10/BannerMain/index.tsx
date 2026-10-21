import React, { useRef, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/BannerMain10` do faststore.starter (família 10, Varejo; desenho
 * `BannerMain10` / `BannerMain10-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá:
 * cinco slides e dois cartões, sem arte (vale o placeholder da cor do banner).
 * Carrossel grande (selo, título com destaque, CTA + observação, setas e pontos) e os dois
 * cartões de promoção ao lado; no mobile a arte vai ao topo e os cartões rolam de lado.
 */
interface BannerMain10Slide {
  eyebrow?: string;
  title?: string;
  /** Trecho do título em destaque (fundo no acento), logo depois de `title`. */
  titleHighlight?: string;
  /** Fim do título, depois do destaque. */
  titleAfter?: string;
  text?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  /** Observação ao lado do CTA (ex.: "Ofertas válidas enquanto durarem os estoques."). */
  note?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

type BannerMain10PromoTone = 'accent' | 'outline';
type BannerMain10PromoIcon = 'none' | 'truck' | 'card' | 'pix' | 'store';

interface BannerMain10Promo {
  /** `accent`: fundo no acento (amarelo); `outline`: branco com borda. */
  tone?: BannerMain10PromoTone;
  icon?: BannerMain10PromoIcon;
  /** Selo em pílula acima do título (ex.: "NO APP"). */
  badge?: string;
  title?: string;
  /** Linha de apoio com seta (ex.: "Para todo o Brasil · Saiba mais"). */
  text?: string;
  /** Botão escuro (ex.: "Baixar o app"). */
  buttonLabel?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

interface BannerMain10Props {
  slides?: BannerMain10Slide[];
  promos?: BannerMain10Promo[];
}

// Conteúdo do mock.ts do starter.
// Textos do desenho `BannerMain10` (5 banners, como os pontos do desenho). Sem arte: o desenho
// também não tem (vale o placeholder da cor do banner).
const slide = {
  eyebrow: 'Ofertas da semana',
  title: 'Até',
  titleHighlight: '40% OFF',
  titleAfter: 'em eletros',
  text: 'Air fryers, TVs, notebooks e mais, com frete grátis acima de R$ 199.',
  ctaLabel: 'Aproveitar',
  ctaUrl: '/s',
  note: 'Ofertas válidas enquanto durarem os estoques.',
  imageAlt: 'Ofertas da semana',
};

const MOCK: BannerMain10Props = {
  slides: [slide, slide, slide, slide, slide],
  promos: [
    {
      tone: 'accent',
      icon: 'truck',
      title: 'Frete grátis acima de R$ 199',
      text: 'Para todo o Brasil · Saiba mais',
      url: '/s',
    },
    {
      tone: 'outline',
      icon: 'none',
      badge: 'NO APP',
      title: '10% OFF na 1ª compra',
      buttonLabel: 'Baixar o app',
      url: '/s',
    },
  ],
};

const svg = (size: number, d: React.ReactNode, strokeWidth = '2.2') => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    aria-hidden="true"
  >
    {d}
  </svg>
);

const ICONES: Record<
  Exclude<BannerMain10PromoIcon, 'none'>,
  React.ReactNode
> = {
  truck: (
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </>
  ),
  pix: (
    <>
      <path d="M12 3 21 12 12 21 3 12z" />
      <path d="m8.5 12 3.5-3.5 3.5 3.5-3.5 3.5z" />
    </>
  ),
  store: (
    <>
      <path d="M4 9 5 4h14l1 5" />
      <path d="M4 9h16v11H4z" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
};

export default function BannerMain10() {
  const { slides = [], promos = [] } = MOCK;
  const [atual, setAtual] = useState(0);
  const toqueX = useRef<number | null>(null);

  if (!slides.length && !promos.length) return null;
  const total = slides.length;
  const ir = (i: number) => setAtual((i + total) % total);
  const s = slides[Math.min(atual, total - 1)];

  return (
    <div className={styles.bannerMain10Box}>
      <section
        className={styles.bannerMain10}
        aria-label="Destaques"
        data-role="bm-root"
      >
        {/* <link> de stylesheet no body é "body-ok" no HTML: o navegador aplica sem hoist. */}
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          {s && (
            <div
              className={styles.hero}
              aria-roledescription="carrossel"
              aria-label="Banner principal"
              data-role="bm-hero"
              onTouchStart={e => (toqueX.current = e.touches[0].clientX)}
              onTouchEnd={e => {
                if (toqueX.current === null || total < 2) return;
                const dx = e.changedTouches[0].clientX - toqueX.current;
                toqueX.current = null;
                if (Math.abs(dx) > 40) ir(atual + (dx < 0 ? 1 : -1));
              }}
            >
              <div className={styles.copy} aria-live="polite">
                {s.eyebrow && (
                  <span className={styles.eyebrow} data-role="bm-eyebrow">
                    {s.eyebrow}
                  </span>
                )}
                {(s.title || s.titleHighlight || s.titleAfter) && (
                  <h2 className={styles.title} data-role="bm-title">
                    {s.title}
                    {s.titleHighlight && (
                      <>
                        {' '}
                        <span className={styles.highlight}>
                          {s.titleHighlight}
                        </span>
                      </>
                    )}
                    {s.titleAfter && ` ${s.titleAfter}`}
                  </h2>
                )}
                {s.text && (
                  <p className={styles.text} data-role="bm-text">
                    {s.text}
                  </p>
                )}
                {(s.ctaLabel || s.note) && (
                  <div className={styles.ctaRow}>
                    {s.ctaLabel && (
                      <a
                        className={styles.cta}
                        href={s.ctaUrl || '#'}
                        data-role="bm-cta"
                      >
                        {s.ctaLabel}
                        {svg(20, <path d="M5 12h14M13 6l6 6-6 6" />)}
                      </a>
                    )}
                    {s.note && (
                      <span className={styles.note} data-role="bm-note">
                        {s.note}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className={styles.media} data-role="bm-image">
                {(s.imageDesktop || s.imageMobile) && (
                  <picture>
                    {s.imageMobile && (
                      <source
                        media="(max-width: 960px)"
                        srcSet={s.imageMobile}
                      />
                    )}
                    <img
                      src={s.imageDesktop || s.imageMobile}
                      alt={s.imageAlt ?? ''}
                      width={960}
                      height={580}
                      loading={atual === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      {...(atual === 0 ? { fetchpriority: 'high' } : {})}
                    />
                  </picture>
                )}
              </div>
              {total > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.arrow} ${styles.arrowPrev}`}
                    onClick={() => ir(atual - 1)}
                    aria-label="Banner anterior"
                  >
                    {svg(20, <path d="m15 6-6 6 6 6" />)}
                  </button>
                  <button
                    type="button"
                    className={`${styles.arrow} ${styles.arrowNext}`}
                    onClick={() => ir(atual + 1)}
                    aria-label="Próximo banner"
                  >
                    {svg(20, <path d="m9 6 6 6-6 6" />)}
                  </button>
                  <div className={styles.dots} data-role="bm-dots">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`${styles.dotBtn}${i === atual ? ` ${styles.dotBtnOn}` : ''}`}
                        onClick={() => ir(i)}
                        aria-label={`Banner ${i + 1} de ${total}`}
                        aria-current={i === atual}
                      >
                        <span />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          {promos.length > 0 && (
            <div className={styles.promos} data-role="bm-promos">
              {promos.map((p, i) => {
                const tone =
                  p.tone === 'outline' ? styles.toneOutline : styles.toneAccent;
                const temArte = p.imageDesktop || p.imageMobile;
                return (
                  <a
                    key={i}
                    className={`${styles.promo} ${tone}`}
                    href={p.url || '#'}
                    data-role="bm-promo"
                  >
                    <span
                      className={`${styles.promoArt}${p.imageMobile ? '' : ` ${styles.promoArtDeskOnly}`}`}
                      aria-hidden={temArte ? undefined : true}
                    >
                      {temArte && (
                        <picture>
                          {p.imageMobile && (
                            <source
                              media="(max-width: 960px)"
                              srcSet={p.imageMobile}
                            />
                          )}
                          <img
                            src={p.imageDesktop || p.imageMobile}
                            alt={p.imageAlt ?? ''}
                            width={240}
                            height={192}
                            loading="lazy"
                            decoding="async"
                          />
                        </picture>
                      )}
                    </span>
                    {p.icon && p.icon !== 'none' && ICONES[p.icon] && (
                      <span className={styles.promoIcon}>
                        {svg(36, ICONES[p.icon], '1.8')}
                      </span>
                    )}
                    {p.badge && (
                      <span className={styles.promoBadge}>{p.badge}</span>
                    )}
                    {p.title && (
                      <span className={styles.promoTitle}>{p.title}</span>
                    )}
                    {p.text && (
                      <span className={styles.promoText}>
                        {p.text}
                        {svg(16, <path d="m9 6 6 6-6 6" />)}
                      </span>
                    )}
                    {p.buttonLabel && (
                      <span className={styles.promoButton}>
                        {p.buttonLabel}
                      </span>
                    )}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

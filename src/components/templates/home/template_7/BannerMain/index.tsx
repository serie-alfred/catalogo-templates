import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/BannerMain07` do faststore.starter — hero com eyebrow,
 * título, subtítulo e CTAs sobre a arte, com conteúdo e altura próprios no
 * mobile.
 *
 * O mock da origem não manda imagem, então o fundo é o gradiente de fallback —
 * mesma coisa aqui; com a arte do CS, ela vira o fundo (como no starter). Os
 * `data-role` são os da origem. Conteúdo = o mock.ts de lá, por baixo do que o CS
 * subir (`useConteudoDaSecao`, campos do schema de lá). Sem carrossel aqui: o
 * primeiro banner de `banners` é o desenhado.
 */
interface Cta {
  label?: string;
  url?: string;
  variant?: string;
}

interface Banner07 {
  imageDesktop?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctas?: Cta[];
  imageMobile?: string;
  eyebrowMobile?: string;
  titleMobile?: string;
  subtitleMobile?: string;
  ctasMobile?: Cta[];
}

interface BannerMain07Conteudo {
  banners: Banner07[];
}

const banner: Banner07 = {
  eyebrow: 'Coleção 2026 · Nova Temporada',
  title: 'Transforme cada ambiente com conforto, textura e estilo',
  subtitle:
    'Tapetes, cama, mesa, banho e decoração selecionados para deixar sua casa mais acolhedora.',
  ctas: [
    { label: 'Comprar Tapetes', url: '/tapetes', variant: 'primary' },
    { label: 'Ver Decoração', url: '/decoracao', variant: 'outline' },
    { label: 'Conhecer Lançamentos →', url: '/lancamentos', variant: 'link' },
  ],
  eyebrowMobile: 'Nova Coleção 2026',
  titleMobile: 'Transforme cada ambiente com conforto e estilo',
  subtitleMobile: 'Tapetes e decoração selecionados para a sua casa.',
  ctasMobile: [
    { label: 'Comprar Tapetes', url: '/tapetes', variant: 'primary' },
    { label: 'Ver Decoração', url: '/decoracao', variant: 'outline' },
  ],
};

const MOCK: BannerMain07Conteudo = { banners: [banner] };

const ctaClass = (v?: string) =>
  v === 'outline'
    ? styles.ctaOutline
    : v === 'link'
      ? styles.ctaLink
      : styles.ctaPrimary;

export default function BannerMain() {
  const { banners } = useConteudoDaSecao(MOCK);
  const b = banners[0];
  if (!b) return null;
  const temTexto =
    !!(b.eyebrow || b.title || b.subtitle) || !!b.ctas?.length;

  return (
    <div className={styles.bannerMain07Root}>
      <div className={styles.desktop}>
        <section className={styles.hero} data-role="hero">
          <div
            className={styles.heroBg}
            style={
              b.imageDesktop
                ? { backgroundImage: `url(${b.imageDesktop})` }
                : undefined
            }
          />
          {temTexto && <div className={styles.heroScrimA} aria-hidden="true" />}
          {temTexto && <div className={styles.heroScrimB} aria-hidden="true" />}
          <div className={styles.heroScrimC} aria-hidden="true" />
          <div className={styles.heroFrame} aria-hidden="true" />
          {temTexto && <div className={styles.heroBox} aria-hidden="true" />}
          <div className={styles.heroContent} data-role="hero-content">
            {b.eyebrow && (
              <p className={styles.eyebrow} data-role="eyebrow">
                {b.eyebrow}
              </p>
            )}
            {b.title && (
              <h1 className={styles.title} data-role="title">
                {b.title}
              </h1>
            )}
            {b.subtitle && (
              <p className={styles.subtitle} data-role="subtitle">
                {b.subtitle}
              </p>
            )}
            {!!b.ctas?.length && (
              <div className={styles.ctaRow} data-role="cta-row">
                {b.ctas.map((c, i) => (
                  <a
                    key={i}
                    href={c.url || '#'}
                    className={ctaClass(c.variant)}
                    data-role="cta"
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <div className={styles.mobile}>
        <section className={styles.mHero} data-role="m-hero">
          <div
            className={styles.mHeroBg}
            style={
              b.imageMobile
                ? { backgroundImage: `url(${b.imageMobile})` }
                : undefined
            }
          />
          <div className={styles.mHeroScrim} aria-hidden="true" />
          <div className={styles.mHeroContent} data-role="m-hero-content">
            {b.eyebrowMobile && (
              <p className={styles.mEyebrow} data-role="m-eyebrow">
                {b.eyebrowMobile}
              </p>
            )}
            {b.titleMobile && (
              <h1 className={styles.mTitle} data-role="m-title">
                {b.titleMobile}
              </h1>
            )}
            {b.subtitleMobile && (
              <p className={styles.mSubtitle} data-role="m-subtitle">
                {b.subtitleMobile}
              </p>
            )}
            {!!b.ctasMobile?.length && (
              <div className={styles.mCtaRow} data-role="m-cta-row">
                {b.ctasMobile.map((c, i) => (
                  <a
                    key={i}
                    href={c.url || '#'}
                    className={ctaClass(c.variant)}
                    data-role="m-cta"
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerMain.conteudoPadrao = MOCK;

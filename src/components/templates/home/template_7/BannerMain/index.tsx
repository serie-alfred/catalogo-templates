import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/BannerMain07` do faststore.starter — hero com eyebrow,
 * título, subtítulo e CTAs sobre a arte, com conteúdo e altura próprios no
 * mobile.
 *
 * O mock da origem não manda imagem, então o fundo é o gradiente de fallback —
 * mesma coisa aqui. Os `data-role` são os da origem.
 */
type Variant = 'primary' | 'outline' | 'link';

interface Cta {
  label: string;
  url: string;
  variant: Variant;
}

const conteudo = {
  eyebrow: 'Coleção 2026 · Nova Temporada',
  title: 'Transforme cada ambiente com conforto, textura e estilo',
  subtitle:
    'Tapetes, cama, mesa, banho e decoração selecionados para deixar sua casa mais acolhedora.',
  ctas: [
    { label: 'Comprar Tapetes', url: '/tapetes', variant: 'primary' },
    { label: 'Ver Decoração', url: '/decoracao', variant: 'outline' },
    { label: 'Conhecer Lançamentos →', url: '/lancamentos', variant: 'link' },
  ] as Cta[],
  eyebrowMobile: 'Nova Coleção 2026',
  titleMobile: 'Transforme cada ambiente com conforto e estilo',
  subtitleMobile: 'Tapetes e decoração selecionados para a sua casa.',
  ctasMobile: [
    { label: 'Comprar Tapetes', url: '/tapetes', variant: 'primary' },
    { label: 'Ver Decoração', url: '/decoracao', variant: 'outline' },
  ] as Cta[],
};

const ctaClass = (v: Variant) =>
  v === 'outline'
    ? styles.ctaOutline
    : v === 'link'
      ? styles.ctaLink
      : styles.ctaPrimary;

export default function BannerMain() {
  return (
    <div className={styles.bannerMain07Root}>
      <div className={styles.desktop}>
        <section className={styles.hero} data-role="hero">
          <div className={styles.heroBg} />
          <div className={styles.heroScrimA} aria-hidden="true" />
          <div className={styles.heroScrimB} aria-hidden="true" />
          <div className={styles.heroScrimC} aria-hidden="true" />
          <div className={styles.heroFrame} aria-hidden="true" />
          <div className={styles.heroBox} aria-hidden="true" />
          <div className={styles.heroContent} data-role="hero-content">
            <p className={styles.eyebrow} data-role="eyebrow">
              {conteudo.eyebrow}
            </p>
            <h1 className={styles.title} data-role="title">
              {conteudo.title}
            </h1>
            <p className={styles.subtitle} data-role="subtitle">
              {conteudo.subtitle}
            </p>
            <div className={styles.ctaRow} data-role="cta-row">
              {conteudo.ctas.map((c, i) => (
                <a
                  key={i}
                  href={c.url}
                  className={ctaClass(c.variant)}
                  data-role="cta"
                >
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className={styles.mobile}>
        <section className={styles.mHero} data-role="m-hero">
          <div className={styles.mHeroBg} />
          <div className={styles.mHeroScrim} aria-hidden="true" />
          <div className={styles.mHeroContent} data-role="m-hero-content">
            <p className={styles.mEyebrow} data-role="m-eyebrow">
              {conteudo.eyebrowMobile}
            </p>
            <h1 className={styles.mTitle} data-role="m-title">
              {conteudo.titleMobile}
            </h1>
            <p className={styles.mSubtitle} data-role="m-subtitle">
              {conteudo.subtitleMobile}
            </p>
            <div className={styles.mCtaRow} data-role="m-cta-row">
              {conteudo.ctasMobile.map((c, i) => (
                <a
                  key={i}
                  href={c.url}
                  className={ctaClass(c.variant)}
                  data-role="m-cta"
                >
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

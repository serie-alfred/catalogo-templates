import React from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/BannerGrid15` do faststore.starter (família 15, Luxo; desenho
 * `BannerGrid15` / `BannerGrid15-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá,
 * sem arte (vale o placeholder do CSS).
 */
interface Banner15 {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  ctaLabel?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

interface BannerGrid15Conteudo {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  banners: Banner15[];
}

const MOCK: BannerGrid15Conteudo = {
  eyebrow: 'Presentes',
  title: 'Para cada',
  titleEmphasis: 'ocasião',
  banners: [
  { eyebrow: 'Noivado', title: 'Solitários que dizem', titleEmphasis: 'sim', ctaLabel: 'Explorar', url: '/s', imageAlt: 'Noivado' },
  { eyebrow: 'Para ele', title: 'Relógios com alma mecânica', ctaLabel: 'Explorar', url: '/s', imageAlt: 'Para ele' },
  { eyebrow: 'Rituais', title: 'Perfumes e cuidados de assinatura', ctaLabel: 'Explorar', url: '/s', imageAlt: 'Rituais' },
  ],
};

function Banner({ b, main }: { b: Banner15; main: boolean }) {
  return (
    <a className={`${styles.card}${main ? ` ${styles.cardMain}` : ''}`} href={b.url || '#'} data-role="bg-item">
      <span className={styles.media}>
        {(b.imageDesktop || b.imageMobile) && (
          <picture>
            {b.imageMobile && <source media="(max-width: 960px)" srcSet={b.imageMobile} />}
            <img
              src={b.imageDesktop || b.imageMobile}
              alt={b.imageAlt ?? ''}
              width={main ? 1400 : 1000}
              height={main ? 1400 : 560}
              loading="lazy"
              decoding="async"
            />
          </picture>
        )}
      </span>
      <span className={styles.copy}>
        {b.eyebrow && (
          <span className={styles.eyebrow} data-role="bg-eyebrow">
            {b.eyebrow}
          </span>
        )}
        {(b.title || b.titleEmphasis) && (
          <span className={styles.cardTitle} data-role="bg-title">
            {b.title} {b.titleEmphasis && <em>{b.titleEmphasis}</em>}
          </span>
        )}
        {b.ctaLabel && (
          <span className={styles.cta} data-role="bg-cta">
            {b.ctaLabel}
          </span>
        )}
      </span>
    </a>
  );
}

export default function BannerGrid15() {
  const { eyebrow, title, titleEmphasis, banners } = useConteudoDaSecao(MOCK);
  if (!banners.length) return null;
  const [principal, ...demais] = banners;

  return (
    <div className={styles.bannerGrid15Box}>
      <section className={styles.bannerGrid15} aria-label={[title, titleEmphasis].filter(Boolean).join(' ') || 'Destaques'} data-role="bg-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          {(eyebrow || title || titleEmphasis) && (
            <div className={styles.head}>
              {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
              {(title || titleEmphasis) && (
                <h2 className={styles.title} data-role="bg-heading">
                  {title} {titleEmphasis && <em>{titleEmphasis}</em>}
                </h2>
              )}
            </div>
          )}
          <div className={styles.grid}>
            <Banner b={principal} main />
            {demais.length > 0 && (
              <div className={styles.side}>
                {demais.map((b, i) => (
                  <Banner key={i} b={b} main={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerGrid15.conteudoPadrao = MOCK;

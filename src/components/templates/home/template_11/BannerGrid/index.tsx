import React from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/BannerGrid11` do faststore.starter (família 11, Grade; desenho
 * `BannerGrid11` / `BannerGrid11-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (sem arte: vale o placeholder do CSS). O manifesto entra depois do 1º banner.
 * `manifestoCell` não tem regra no SCSS de lá (só marca a célula), então não existe no CSS.
 */
interface BannerGrid11Banner {
  title?: string;
  caption?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

interface BannerGrid11Manifesto {
  eyebrow?: string;
  text?: string;
  linkLabel?: string;
  linkUrl?: string;
  title?: string;
  caption?: string;
}

interface BannerGrid11Props {
  sectionNumber?: string;
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  banners?: BannerGrid11Banner[];
  manifesto?: BannerGrid11Manifesto;
}

// Conteúdo do mock.ts do starter.
const MOCK: BannerGrid11Props = {
  sectionNumber: '03',
  title: 'Ambientes',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '/s',
  banners: [
    {
      title: 'Sala de estar',
      caption: '[Ambiente 01]',
      url: '/s',
      imageAlt: 'Sala de estar',
    },
    {
      title: 'Home office',
      caption: '[Ambiente 02]',
      url: '/s',
      imageAlt: 'Home office',
    },
  ],
  manifesto: {
    eyebrow: '[Manifesto]',
    text: 'Peças feitas para durar décadas, não estações.',
    linkLabel: 'Conheça o estúdio',
    linkUrl: '/s',
    title: 'Estúdio',
    caption: '[Desenho e produção]',
  },
};

const Seta = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function Banner({ b }: { b: BannerGrid11Banner }) {
  return (
    <a className={styles.cell} href={b.url || '#'} data-role="bg-banner">
      <span className={styles.art}>
        {(b.imageDesktop || b.imageMobile) && (
          <picture>
            {b.imageMobile && (
              <source media="(max-width: 960px)" srcSet={b.imageMobile} />
            )}
            <img
              src={b.imageDesktop || b.imageMobile}
              alt={b.imageAlt ?? ''}
              width={960}
              height={960}
              loading="lazy"
              decoding="async"
            />
          </picture>
        )}
      </span>
      <span className={styles.foot}>
        <span className={styles.footCopy}>
          {b.title && <span className={styles.footTitle}>{b.title}</span>}
          {b.caption && <span className={styles.footCaption}>{b.caption}</span>}
        </span>
        <Seta size={20} />
      </span>
    </a>
  );
}

export default function BannerGrid11() {
  const {
    sectionNumber,
    title,
    viewAllLabel,
    viewAllUrl,
    banners = [],
    manifesto,
  } = MOCK;
  const temManifesto =
    !!manifesto &&
    !!(manifesto.text || manifesto.eyebrow || manifesto.linkLabel);
  if (!banners.length && !temManifesto) return null;

  const [primeiro, ...resto] = banners;

  return (
    <div className={styles.bannerGrid11Box}>
      <section
        className={styles.bannerGrid11}
        aria-label={title || 'Ambientes'}
        data-role="bg-root"
      >
        <link rel="stylesheet" href={FONTES_11} />
        <div className={styles.inner}>
          {(title || sectionNumber || viewAllLabel) && (
            <div className={styles.head}>
              {(title || sectionNumber) && (
                <h2 className={styles.title} data-role="bg-title">
                  {sectionNumber && (
                    <span className={styles.number}>[{sectionNumber}]</span>
                  )}
                  {title}
                </h2>
              )}
              <span className={styles.spacer} />
              {viewAllLabel && (
                <a
                  className={styles.viewAll}
                  href={viewAllUrl || '#'}
                  data-role="bg-view-all"
                >
                  {viewAllLabel}
                  <Seta size={16} />
                </a>
              )}
            </div>
          )}
          <div className={styles.grid}>
            {primeiro && <Banner b={primeiro} />}
            {temManifesto && manifesto && (
              <div className={styles.cell} data-role="bg-manifesto">
                <div className={styles.manifesto}>
                  {manifesto.eyebrow ? (
                    <span className={styles.eyebrow}>{manifesto.eyebrow}</span>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                  {manifesto.text && (
                    <p className={styles.quote}>{manifesto.text}</p>
                  )}
                  {manifesto.linkLabel ? (
                    <a
                      className={styles.link}
                      href={manifesto.linkUrl || '#'}
                      data-role="bg-manifesto-link"
                    >
                      {manifesto.linkLabel}
                      <Seta size={16} />
                    </a>
                  ) : (
                    <span aria-hidden="true" />
                  )}
                </div>
                {(manifesto.title || manifesto.caption) && (
                  <span className={`${styles.foot} ${styles.manifestoFoot}`}>
                    <span className={styles.footCopy}>
                      {manifesto.title && (
                        <span className={styles.footTitle}>
                          {manifesto.title}
                        </span>
                      )}
                      {manifesto.caption && (
                        <span className={styles.footCaption}>
                          {manifesto.caption}
                        </span>
                      )}
                    </span>
                  </span>
                )}
              </div>
            )}
            {resto.map((b, i) => (
              <Banner key={i} b={b} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

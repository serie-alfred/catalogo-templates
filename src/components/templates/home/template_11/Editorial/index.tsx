import React from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Editorial11` do faststore.starter (família 11, Grade; desenho
 * `Editorial11` / `Editorial11-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (sem arte: vale o placeholder do CSS). o `<ol>` sai sem classe, como lá
 * (o `:where(ol)` da raiz zera a lista).
 */
interface Editorial11Post {
  date?: string;
  tag?: string;
  title?: string;
  url?: string;
}

interface Editorial11Props {
  sectionNumber?: string;
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  featuredDate?: string;
  featuredTag?: string;
  featuredTitle?: string;
  featuredText?: string;
  ctaLabel?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  posts?: Editorial11Post[];
}

// Conteúdo do mock.ts do starter.
const MOCK: Editorial11Props = {
  sectionNumber: '05',
  title: 'Journal',
  viewAllLabel: 'Todos os textos',
  viewAllUrl: '/s',
  featuredDate: '12.10.2026',
  featuredTag: '[Entrevista]',
  featuredTitle: 'Desenhar luz para casas pequenas',
  featuredText:
    'Uma conversa sobre altura de pendentes, luz indireta e como um só ponto bem colocado muda um ambiente inteiro.',
  ctaLabel: 'Ler texto',
  url: '/s',
  imageAlt: 'Desenhar luz para casas pequenas',
  posts: [
    {
      date: '28.09.2026',
      tag: '[Guia]',
      title: 'Como escolher a temperatura de cor da sala',
      url: '/s',
    },
    {
      date: '14.09.2026',
      tag: '[Materiais]',
      title: 'Freijó, cumaru e carvalho: um glossário',
      url: '/s',
    },
    {
      date: '02.09.2026',
      tag: '[Bastidores]',
      title: 'Uma tarde no ateliê de cerâmica',
      url: '/s',
    },
    {
      date: '19.08.2026',
      tag: '[Guia]',
      title: 'Plantas de iluminação para home office',
      url: '/s',
    },
  ],
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

export default function Editorial11() {
  const {
    sectionNumber,
    title,
    viewAllLabel,
    viewAllUrl,
    featuredDate,
    featuredTag,
    featuredTitle,
    featuredText,
    ctaLabel,
    url,
    imageDesktop,
    imageMobile,
    imageAlt,
    posts = [],
  } = MOCK;

  const temDestaque = !!(
    featuredTitle ||
    featuredText ||
    imageDesktop ||
    imageMobile
  );
  if (!temDestaque && !posts.length) return null;

  return (
    <div className={styles.editorial11Box}>
      <section
        className={styles.editorial11}
        aria-label={title || 'Editorial'}
        data-role="ed-root"
      >
        <link rel="stylesheet" href={FONTES_11} />
        <div className={styles.inner}>
          {(title || sectionNumber || viewAllLabel) && (
            <div className={styles.head}>
              {(title || sectionNumber) && (
                <h2 className={styles.title} data-role="ed-title">
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
                  data-role="ed-view-all"
                >
                  {viewAllLabel}
                  <Seta size={16} />
                </a>
              )}
            </div>
          )}
          {temDestaque && (
            <article className={styles.featured} data-role="ed-featured">
              <a
                className={styles.art}
                href={url || '#'}
                tabIndex={-1}
                aria-hidden="true"
                data-role="ed-image"
              >
                {(imageDesktop || imageMobile) && (
                  <picture>
                    {imageMobile && (
                      <source media="(max-width: 960px)" srcSet={imageMobile} />
                    )}
                    <img
                      src={imageDesktop || imageMobile}
                      alt={imageAlt ?? ''}
                      width={1200}
                      height={800}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                )}
              </a>
              <div className={styles.copy}>
                {(featuredDate || featuredTag) && (
                  <div className={styles.meta}>
                    <span>{featuredDate}</span>
                    {featuredTag && (
                      <span className={styles.tag}>{featuredTag}</span>
                    )}
                  </div>
                )}
                <div className={styles.body}>
                  {featuredTitle && (
                    <h3
                      className={styles.featuredTitle}
                      data-role="ed-featured-title"
                    >
                      {featuredTitle}
                    </h3>
                  )}
                  {featuredText && (
                    <p className={styles.text}>{featuredText}</p>
                  )}
                </div>
                {ctaLabel && (
                  <a
                    className={styles.cta}
                    href={url || '#'}
                    aria-label={
                      featuredTitle
                        ? `${ctaLabel}: ${featuredTitle}`
                        : undefined
                    }
                    data-role="ed-cta"
                  >
                    {ctaLabel}
                    <Seta size={16} />
                  </a>
                )}
              </div>
            </article>
          )}
          {posts.length > 0 && (
            <ol>
              {posts.map((p, i) => (
                <li key={i} className={styles.item}>
                  <a
                    className={styles.post}
                    href={p.url || '#'}
                    data-role="ed-post"
                  >
                    {p.date && (
                      <span className={styles.postDate}>{p.date}</span>
                    )}
                    <span className={styles.postBody}>
                      {(p.date || p.tag) && (
                        <span className={styles.postMeta} aria-hidden="true">
                          {[p.date, p.tag].filter(Boolean).join(' · ')}
                        </span>
                      )}
                      <span className={styles.postTitle}>{p.title}</span>
                    </span>
                    {p.tag && <span className={styles.postTag}>{p.tag}</span>}
                    <Seta size={18} />
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}

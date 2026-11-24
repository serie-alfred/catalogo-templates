import React from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Editorial09` do faststore.starter (família 09, Editorial;
 * desenho `Editorial09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá (sem arte: vale o placeholder da caixa), por baixo do que o CS subir
 * (`useConteudoDaSecao`, campos do schema de lá).
 */

interface Post {
  kicker?: string;
  title?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
}

interface Editorial09Conteudo {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  text?: string;
  ctaLabel?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  posts: Post[];
}

const MOCK: Editorial09Conteudo = {
  eyebrow: 'Diário · Estilo',
  title: 'Como montar um armário de',
  titleEmphasis: 'poucas peças',
  text: 'Menos peças, mais combinações. Separamos o que vale ter, o que vale repetir e como pensar o armário por estação, sem perder a vontade de se vestir.',
  ctaLabel: 'Ler matéria',
  url: '/diario',
  imageAlt: 'Como montar um armário de poucas peças',
  posts: [
    { kicker: 'Cuidados', title: 'Linho: como cuidar para durar', url: '/diario' },
    { kicker: 'Estilo', title: 'Cinco formas de usar o blazer cru', url: '/diario' },
    { kicker: 'Ateliê', title: 'Bastidores da nova coleção', url: '/diario' },
  ],
};

export default function Editorial09() {
  const {
    eyebrow,
    title,
    titleEmphasis,
    text,
    ctaLabel,
    url,
    imageDesktop,
    imageMobile,
    imageAlt,
    posts,
  } = useConteudoDaSecao(MOCK);
  const href = url || '#';

  return (
    <div className={styles.editorial09Box}>
      <section className={styles.editorial09} aria-label={eyebrow || 'Diário'} data-role="ed-root">
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          <article className={styles.feature}>
            <a
              className={styles.media}
              href={href}
              aria-label={imageAlt || 'Abrir matéria'}
              tabIndex={-1}
              data-role="ed-image"
            >
              {(imageDesktop || imageMobile) && (
                <picture>
                  {imageMobile && <source media="(max-width: 960px)" srcSet={imageMobile} />}
                  <img
                    src={imageDesktop || imageMobile}
                    alt={imageAlt ?? ''}
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              )}
            </a>
            <div className={styles.copy}>
              {eyebrow && (
                <span className={styles.eyebrow} data-role="ed-eyebrow">
                  <span className={styles.eyebrowRule} aria-hidden="true" />
                  {eyebrow}
                </span>
              )}
              {(title || titleEmphasis) && (
                <h2 className={styles.title} data-role="ed-title">
                  {title} {titleEmphasis && <em>{titleEmphasis}</em>}
                </h2>
              )}
              {text && (
                <p className={styles.text} data-role="ed-text">
                  {text}
                </p>
              )}
              {ctaLabel && (
                <a className={styles.cta} href={href} data-role="ed-cta">
                  {ctaLabel}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              )}
            </div>
          </article>
          {posts.length > 0 && (
            <ul className={styles.posts}>
              {posts.slice(0, 3).map((p, i) => (
                <li key={i} data-role="ed-post">
                  <a className={styles.post} href={p.url || '#'}>
                    <span className={styles.thumb}>
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.imageAlt ?? ''}
                          width={192}
                          height={192}
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </span>
                    <span className={styles.postCopy}>
                      {p.kicker && <span className={styles.kicker}>{p.kicker}</span>}
                      {p.title && <span className={styles.postTitle}>{p.title}</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Editorial09.conteudoPadrao = MOCK;

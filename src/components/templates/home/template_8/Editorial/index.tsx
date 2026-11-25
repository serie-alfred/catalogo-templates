import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Editorial08` do faststore.starter (família 08, Figma "Templates - Serie A").
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS
 * é derivado do SCSS de lá (`yarn derivar:css`). Conteúdo = o mock.ts de lá, por
 * baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá). O
 * envelope `.…Box` é o container das regras mobile (a raiz e o bloco são o mesmo
 * elemento, e uma @container não estiliza o próprio container).
 */

const IMG = '/gerador/familia08';
const RETRATO = `${IMG}/ph-card.png`;

const FONTES =
  'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;0,800;1,600&display=swap';

const TEXTO =
  'Lorem ipsum dolor sit amet consectetur. Turpis auctor et orci feugiat. Purus tellus a molestie ornare et sed quis justo pellentesque. Scelerisque purus elit et urna aliquam. Dolor vel arcu a adipiscing enim habitasse. Quis cras sapien dignissim hendrerit purus vitae. Nullam ut a sed sit dictumst vitae vel tortor sit. Sollicitudin mattis odio ornare eget dolor enim eu volutpat. Neque tortor cursus nulla quis ullamcorper facilisi. Pretium suspendisse feugiat tellus commodo porttitor arcu turpis maecenas. Ultricies tellus odio amet elementum orci aliquam leo libero.';

interface Editorial08Conteudo {
  eyebrowStart?: string;
  eyebrowHighlight?: string;
  title?: string;
  text?: string;
  collage?: { image?: string; alt?: string }[];
  banners?: { desktop?: string; mobile?: string; alt?: string; url?: string }[];
}

const MOCK: Editorial08Conteudo = {
  eyebrowStart: 'Black',
  eyebrowHighlight: 'Friday',
  title: 'Moda com mais estilo, economia e propósito',
  text: TEXTO,
  collage: [
    { image: RETRATO, alt: '' },
    { image: RETRATO, alt: '' },
    { image: RETRATO, alt: '' },
  ],
  banners: [
    {
      desktop: `${IMG}/ph-banner-desktop.png`,
      mobile: `${IMG}/ph-banner-mobile.png`,
      alt: '',
      url: '#',
    },
    {
      desktop: `${IMG}/ph-banner-desktop.png`,
      mobile: `${IMG}/ph-banner-mobile.png`,
      alt: '',
      url: '#',
    },
  ],
};

export default function Editorial08() {
  const {
    eyebrowStart,
    eyebrowHighlight,
    title,
    text,
    collage = [],
    banners = [],
  } = useConteudoDaSecao(MOCK);
  const [a, b, c] = collage;

  return (
    <div className={styles.editorial08Box}>
      <section
        className={`${styles.editorial08} ${styles.about}`}
        data-role="ed-root"
      >
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={FONTES} />
        <span className={styles.aboutGlow} aria-hidden="true" />
        <div className={styles.aboutRow}>
          <div className={styles.collage} data-role="ed-collage">
            <span className={styles.collageGlow} aria-hidden="true" />
            {a?.image && (
              <img
                className={`${styles.collageImg} ${styles.collageA}`}
                src={a.image}
                alt={a.alt ?? ''}
              />
            )}
            {b?.image && (
              <img
                className={`${styles.collageImg} ${styles.collageB}`}
                src={b.image}
                alt={b.alt ?? ''}
              />
            )}
            {c?.image && (
              <img
                className={`${styles.collageImg} ${styles.collageC}`}
                src={c.image}
                alt={c.alt ?? ''}
              />
            )}
          </div>
          <div className={styles.aboutText}>
            {(eyebrowStart || eyebrowHighlight) && (
              <p className={styles.aboutEyebrow} data-role="ed-eyebrow">
                {eyebrowStart}
                {eyebrowHighlight && (
                  <span className={styles.accent}> {eyebrowHighlight}</span>
                )}
              </p>
            )}
            {title && (
              <h2 className={styles.aboutTitle} data-role="ed-title">
                {title}
              </h2>
            )}
            {text && (
              <p className={styles.aboutBody} data-role="ed-text">
                {text}
              </p>
            )}
          </div>
        </div>
        {banners.length > 0 && (
          <div className={styles.aboutBanners}>
            {banners.map((bn, i) => {
              const src = bn.desktop || bn.mobile;
              const pic = src && (
                <picture className={styles.aboutBanner} data-role="ed-banner">
                  <img
                    className={styles.onlyDesktop}
                    src={src}
                    alt={bn.alt ?? ''}
                    width={507}
                    height={241}
                  />
                  <img
                    className={styles.onlyMobile}
                    src={bn.mobile || src}
                    alt={bn.alt ?? ''}
                    width={342}
                    height={148}
                  />
                </picture>
              );
              return bn.url ? (
                <a
                  key={i}
                  className={styles.aboutBannerLink}
                  href={bn.url}
                  aria-label={bn.alt || 'Ver ofertas'}
                >
                  {pic}
                </a>
              ) : (
                <div key={i} className={styles.aboutBannerLink}>
                  {pic}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Editorial08.conteudoPadrao = MOCK;

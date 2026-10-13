import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/Editorial08` do faststore.starter (família 08, Figma "Templates - Serie A").
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS
 * é derivado do SCSS de lá (`yarn derivar:css`). Conteúdo = o mock.ts de lá. O
 * envelope `.…Box` é o container das regras mobile (a raiz e o bloco são o mesmo
 * elemento, e uma @container não estiliza o próprio container).
 */

const IMG = '/gerador/familia08';
const RETRATO = `${IMG}/ph-card.png`;

const FONTES =
  'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;0,800;1,600&display=swap';

const TEXTO =
  'Lorem ipsum dolor sit amet consectetur. Turpis auctor et orci feugiat. Purus tellus a molestie ornare et sed quis justo pellentesque. Scelerisque purus elit et urna aliquam. Dolor vel arcu a adipiscing enim habitasse. Quis cras sapien dignissim hendrerit purus vitae. Nullam ut a sed sit dictumst vitae vel tortor sit. Sollicitudin mattis odio ornare eget dolor enim eu volutpat. Neque tortor cursus nulla quis ullamcorper facilisi. Pretium suspendisse feugiat tellus commodo porttitor arcu turpis maecenas. Ultricies tellus odio amet elementum orci aliquam leo libero.';

export default function Editorial08() {
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
            <img
              className={`${styles.collageImg} ${styles.collageA}`}
              src={RETRATO}
              alt=""
            />
            <img
              className={`${styles.collageImg} ${styles.collageB}`}
              src={RETRATO}
              alt=""
            />
            <img
              className={`${styles.collageImg} ${styles.collageC}`}
              src={RETRATO}
              alt=""
            />
          </div>
          <div className={styles.aboutText}>
            <p className={styles.aboutEyebrow} data-role="ed-eyebrow">
              Black<span className={styles.accent}> Friday</span>
            </p>
            <h2 className={styles.aboutTitle} data-role="ed-title">
              Moda com mais estilo, economia e propósito
            </h2>
            <p className={styles.aboutBody} data-role="ed-text">
              {TEXTO}
            </p>
          </div>
        </div>
        <div className={styles.aboutBanners}>
          {[0, 1].map(i => (
            <a
              key={i}
              className={styles.aboutBannerLink}
              href="#"
              aria-label="Ver ofertas"
            >
              <picture className={styles.aboutBanner} data-role="ed-banner">
                <img
                  className={styles.onlyDesktop}
                  src={`${IMG}/ph-banner-desktop.png`}
                  alt=""
                  width={507}
                  height={241}
                />
                <img
                  className={styles.onlyMobile}
                  src={`${IMG}/ph-banner-mobile.png`}
                  alt=""
                  width={342}
                  height={148}
                />
              </picture>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

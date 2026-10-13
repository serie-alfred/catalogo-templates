import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/BannerMain08` do faststore.starter (família 08, Figma "Templates - Serie A").
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS
 * é derivado do SCSS de lá (`yarn derivar:css`). Conteúdo = o mock.ts de lá. O
 * envelope `.…Box` é o container das regras mobile (a raiz e o bloco são o mesmo
 * elemento, e uma @container não estiliza o próprio container).
 * Onde o starter usa `<picture media>`, aqui são duas `<img>` trocadas por `@container`:
 * o palco de export renderiza o mobile num div de 375px dentro do documento do editor.
 */

const IMG = '/gerador/familia08';

const FONTES =
  'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,600;0,800;1,800&display=swap';

export default function BannerMain08() {
  return (
    <div className={styles.bannerMain08Box}>
      <section
        className={`${styles.bannerMain08} ${styles.hero}`}
        data-role="bm-root"
      >
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={FONTES} />
        <picture
          className={`${styles.heroMedia} ${styles.heroMediaContain}`}
          data-role="bm-img"
        >
          <img
            className={styles.onlyDesktop}
            src={`${IMG}/ph-square.png`}
            alt=""
            width={1280}
            height={459}
          />
          <img
            className={styles.onlyMobile}
            src={`${IMG}/ph-card.png`}
            alt=""
            width={390}
            height={540}
          />
        </picture>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow} data-role="bm-eyebrow">
            Moda com até 70% off
          </p>
          <h1 className={styles.heroTitle} data-role="bm-title">
            <span className={styles.heroTitleDesktop}>
              {'Black Friday Moda\nque combina com você'}
            </span>
            <span className={styles.heroTitleMobile}>
              {'Black Friday\nModa que combina\ncom você'}
            </span>
          </h1>
          <p className={styles.heroText} data-role="bm-text">
            {
              'As melhores ofertas de moda feminina, masculina,\ncalçados e acessórios em uma só Black Friday.\nEstilo, qualidade e preços imperdíveis para renovar\no seu guarda-roupa.'
            }
          </p>
        </div>
      </section>
    </div>
  );
}

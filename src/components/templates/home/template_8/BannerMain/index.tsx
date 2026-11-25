import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/BannerMain08` do faststore.starter (família 08, Figma "Templates - Serie A").
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS
 * é derivado do SCSS de lá (`yarn derivar:css`). Conteúdo = o mock.ts de lá, por baixo
 * do que o CS subir (`useConteudoDaSecao`, campos do schema de lá). O
 * envelope `.…Box` é o container das regras mobile (a raiz e o bloco são o mesmo
 * elemento, e uma @container não estiliza o próprio container).
 * Onde o starter usa `<picture media>`, aqui são duas `<img>` trocadas por `@container`:
 * o palco de export renderiza o mobile num div de 375px dentro do documento do editor.
 */

const IMG = '/gerador/familia08';

const FONTES =
  'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,600;0,800;1,800&display=swap';

interface BannerMain08Conteudo {
  eyebrow?: string;
  title?: string;
  titleMobile?: string;
  description?: string;
  image?: {
    desktop?: string;
    mobile?: string;
    alt?: string;
    url?: string;
    fit?: string;
  };
}

const MOCK: BannerMain08Conteudo = {
  eyebrow: 'Moda com até 70% off',
  title: 'Black Friday Moda\nque combina com você',
  titleMobile: 'Black Friday\nModa que combina\ncom você',
  description:
    'As melhores ofertas de moda feminina, masculina,\ncalçados e acessórios em uma só Black Friday.\nEstilo, qualidade e preços imperdíveis para renovar\no seu guarda-roupa.',
  image: {
    desktop: `${IMG}/ph-square.png`,
    mobile: `${IMG}/ph-card.png`,
    alt: '',
    fit: 'contain',
  },
};

export default function BannerMain08() {
  const { eyebrow, title, titleMobile, description, image } =
    useConteudoDaSecao(MOCK);
  // Sem arte de mobile, a do desktop vale para os dois (e vice-versa).
  const imgDesktop = image?.desktop || image?.mobile;
  const imgMobile = image?.mobile || image?.desktop;

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
        {imgDesktop && (
          <picture
            className={`${styles.heroMedia}${image?.fit === 'contain' ? ` ${styles.heroMediaContain}` : ''}`}
            data-role="bm-img"
          >
            <img
              className={styles.onlyDesktop}
              src={imgDesktop}
              alt={image?.alt ?? ''}
              width={1280}
              height={459}
            />
            <img
              className={styles.onlyMobile}
              src={imgMobile}
              alt={image?.alt ?? ''}
              width={390}
              height={540}
            />
          </picture>
        )}
        <div className={styles.heroContent}>
          {eyebrow && (
            <p className={styles.heroEyebrow} data-role="bm-eyebrow">
              {eyebrow}
            </p>
          )}
          {title && (
            <h1 className={styles.heroTitle} data-role="bm-title">
              <span className={styles.heroTitleDesktop}>{title}</span>
              <span
                className={
                  titleMobile
                    ? styles.heroTitleMobile
                    : styles.heroTitleMobileAuto
                }
              >
                {titleMobile || title}
              </span>
            </h1>
          )}
          {description && (
            <p className={styles.heroText} data-role="bm-text">
              {description}
            </p>
          )}
        </div>
        {image?.url && (
          <a
            className={styles.cover}
            href={image.url}
            aria-label={image.alt || title || 'Ver ofertas'}
          />
        )}
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerMain08.conteudoPadrao = MOCK;

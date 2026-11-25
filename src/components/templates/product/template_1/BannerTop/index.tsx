import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do BannerTop01. */
interface BannerTop01Conteudo {
  desktopImage?: string;
  mobileImage?: string;
  alt?: string;
  link?: string;
  width?: number;
  height?: number;
}

const MOCK: BannerTop01Conteudo = {
  desktopImage: 'https://placehold.co/1377x136',
  alt: 'Banner para desktop',
};

export default function ProductBanner() {
  const { desktopImage, mobileImage, alt, link, width, height } =
    useConteudoDaSecao(MOCK);

  if (!desktopImage) return null;

  const img = (
    <picture>
      {mobileImage && (
        <source media="(max-width: 1023px)" srcSet={mobileImage} />
      )}
      <img
        data-role="bt-img"
        src={desktopImage}
        alt={alt ?? ''}
        width={width}
        height={height}
        rel="preload"
        fetchPriority="high"
      />
    </picture>
  );

  return (
    <div className={styles.productBanner} data-role="bt-root">
      <div className={`${styles.bannerContainer} component__container`}>
        <div className={styles.bannerRow}>
          <div className={styles.bannerWrapper} data-role="bt-banner">
            {link ? <a href={link}>{img}</a> : img}
          </div>
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductBanner.conteudoPadrao = MOCK;

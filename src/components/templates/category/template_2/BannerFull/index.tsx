import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do BannerFullCategory02. */
interface BannerFullCategory02Conteudo {
  desktopSrc?: string;
  mobileSrc?: string;
  alt?: string;
  href?: string;
}

const MOCK: BannerFullCategory02Conteudo = {
  desktopSrc: 'https://placehold.co/1920x450',
  mobileSrc: 'https://placehold.co/1920x450',
};

const CategoryBanner = () => {
  const { desktopSrc, mobileSrc, alt, href } = useConteudoDaSecao(MOCK);

  if (!desktopSrc && !mobileSrc) return null;

  const envolver = (img: React.ReactNode) =>
    href ? <a href={href}>{img}</a> : img;

  return (
    <div className={styles.bannerFull} data-role="category-banner">
      {desktopSrc && (
        <div
          className={styles.categoryBannerDesktop}
          data-role="category-banner-desktop"
        >
          {envolver(
            <img
              src={desktopSrc}
              alt={alt ?? 'Banner para desktop'}
              rel="preload"
              fetchPriority="high"
            />
          )}
        </div>
      )}

      {(mobileSrc || desktopSrc) && (
        <div
          className={styles.categoryBannerMobile}
          data-role="category-banner-mobile"
        >
          {envolver(
            <img
              src={mobileSrc || desktopSrc}
              alt={alt ?? 'Banner para mobile'}
              rel="preload"
              fetchPriority="high"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryBanner;

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
CategoryBanner.conteudoPadrao = MOCK;

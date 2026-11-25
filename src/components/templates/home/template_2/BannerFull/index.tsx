import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do BannerFull02. */
interface BannerFull02Conteudo {
  desktopSrc?: string;
  mobileSrc?: string;
  alt?: string;
  href?: string;
}

const MOCK: BannerFull02Conteudo = {
  desktopSrc: 'https://placehold.co/1920x647',
  mobileSrc: 'https://placehold.co/390x647',
  alt: 'Banner Desktop',
  href: '#',
};

export default function BannerFull() {
  const { desktopSrc, mobileSrc, alt, href } = useConteudoDaSecao(MOCK);

  if (!desktopSrc && !mobileSrc) return null;

  return (
    <div className={styles.homeBannerFull} data-role="banner-full">
      <div className={styles.bannerContainer}>
        <div className={styles.bannerWrapper}>
          <a href={href || '#'} data-role="banner-full-link">
            {desktopSrc && (
              <img
                alt={alt ?? ''}
                className={styles.bannerDesktop}
                data-role="banner-full-desktop"
                src={desktopSrc}
                width="1920"
                height="647"
              />
            )}

            {mobileSrc && (
              <img
                alt={alt ?? ''}
                className={styles.bannerMobile}
                data-role="banner-full-mobile"
                src={mobileSrc}
                width="390"
                height="647"
              />
            )}
          </a>
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerFull.conteudoPadrao = MOCK;

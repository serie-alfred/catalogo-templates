import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/** Um banner: os campos de `mainBanner` e de `secondaryBanners[]` no `section.schema` do BannerGrid01. */
interface Banner {
  img?: string;
  link?: string;
  alt?: string;
  width?: number;
  height?: number;
}

/** O conteúdo da seção: os campos do `section.schema` do BannerGrid01. */
interface BannerGrid01Conteudo {
  sectionTitle?: string;
  mainBanner?: Banner;
  secondaryBanners: Banner[];
}

const MOCK: BannerGrid01Conteudo = {
  sectionTitle: 'Nossas Ofertas',
  mainBanner: {
    img: 'https://placehold.co/702x668',
    link: '/promo-principal',
    alt: 'Banner Principal',
    width: 926,
    height: 881,
  },
  secondaryBanners: [
    {
      img: 'https://placehold.co/330x330',
      link: '/promo-lateral-1',
      alt: 'Banner Lateral 1',
      width: 459,
      height: 459,
    },
    {
      img: 'https://placehold.co/330x330',
      link: '/promo-lateral-2',
      alt: 'Banner Lateral 2',
      width: 459,
      height: 459,
    },
    {
      img: 'https://placehold.co/330x330',
      link: '/promo-lateral-3',
      alt: 'Banner Lateral 3',
      width: 459,
      height: 459,
    },
    {
      img: 'https://placehold.co/330x330',
      link: '/promo-lateral-4',
      alt: 'Banner Lateral 4',
      width: 459,
      height: 459,
    },
  ],
};

export default function BannersGrid() {
  const { sectionTitle, mainBanner, secondaryBanners } =
    useConteudoDaSecao(MOCK);

  if (!mainBanner && !secondaryBanners.length) return null;

  return (
    <div className={styles.homeBannerGrid}>
      <div className={`${styles.bannerContainer} component__container`}>
        <div className={`${styles.bannerRow} component__row`}>
          {sectionTitle && (
            <div className={styles.bannerTitle}>
              <h2>{sectionTitle}</h2>
            </div>
          )}

          <div className={styles.bannerWrapper}>
            {/* Banner principal */}
            {mainBanner && (
              <div className={styles.bannerLeft}>
                <div className={styles.bannerItem}>
                  <a href={mainBanner.link || '#'}>
                    <img
                      src={mainBanner.img}
                      alt={mainBanner.alt ?? ''}
                      width={mainBanner.width ?? 926}
                      height={mainBanner.height ?? 881}
                    />
                  </a>
                </div>
              </div>
            )}

            {/* Banners secundários */}
            {secondaryBanners.length > 0 && (
              <div className={styles.bannerRight}>
                {secondaryBanners.slice(0, 4).map((banner, i) => (
                  <div key={i} className={styles.bannerItem}>
                    <a href={banner.link || '#'}>
                      <img
                        src={banner.img}
                        alt={banner.alt ?? ''}
                        width={banner.width ?? 459}
                        height={banner.height ?? 459}
                      />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannersGrid.conteudoPadrao = MOCK;

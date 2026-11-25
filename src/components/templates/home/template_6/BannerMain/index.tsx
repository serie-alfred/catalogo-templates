'use client';

import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Hero da família 06. Conteúdo: os nomes do `section.schema` do BannerMain06 do
 * starter (`banners[]`). A réplica é um banner só, sem carrossel: desenha o
 * primeiro banner ativo. Ficam fora do tipo o vídeo (`desktopVideo`,
 * `mobileVideo`, `videoEmbed`), o agendamento (`startDate`/`endDate`), a
 * analytics, o loop/setas/dots e `disableAspectRatio` — sem markup nem CSS aqui.
 */
interface Banner {
  active?: boolean;
  desktopImg?: string;
  mobileImg?: string;
  alt?: string;
  link?: string;
  linkNewTab?: boolean;
  linkNofollow?: boolean;
  linkTitle?: string;
  desktopWidth?: number;
  desktopHeight?: number;
}

interface BannerMainConteudo {
  banners: Banner[];
}

const MOCK: BannerMainConteudo = {
  banners: [
    {
      desktopImg: 'https://placehold.co/1920x400',
      mobileImg: 'https://placehold.co/600x300',
      alt: 'Banner',
      link: 'https://exemplo.com',
      desktopWidth: 1860,
      desktopHeight: 574,
    },
  ],
};

export default function BannerFull() {
  const { banners } = useConteudoDaSecao(MOCK);
  const banner = banners.find(b => b.active !== false);

  if (!banner) return null;

  return (
    <div className={styles.homeBannerFull}>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerWrapper}>
          <a
            href={banner.link || '#'}
            title={banner.linkTitle || undefined}
            {...(banner.linkNewTab
              ? {
                  target: '_blank',
                  rel: banner.linkNofollow
                    ? 'noopener noreferrer nofollow'
                    : 'noopener noreferrer',
                }
              : banner.linkNofollow
                ? { rel: 'nofollow' }
                : {})}
          >
            <img
              alt={banner.alt ?? ''}
              className={`${styles.bannerDesktop} lazy`}
              src={banner.desktopImg}
              data-src={banner.desktopImg}
              data-srcset={banner.desktopImg}
              width={banner.desktopWidth ?? 1860}
              height={banner.desktopHeight ?? 574}
            />

            <img
              alt={banner.alt ?? ''}
              className={`${styles.bannerMobile} lazy`}
              src={banner.mobileImg || banner.desktopImg}
              data-src={banner.mobileImg || banner.desktopImg}
              data-srcset={banner.mobileImg || banner.desktopImg}
              width={450}
              height={139}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerFull.conteudoPadrao = MOCK;

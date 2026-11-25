import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do BannerFull01. */
interface BannerFull01Conteudo {
  desktopSrc?: string;
  mobileSrc?: string;
  href?: string;
  alt?: string;
  width?: number;
  height?: number;
}

const MOCK: BannerFull01Conteudo = {
  desktopSrc: 'https://placehold.co/1296x400',
  href: '#',
  alt: 'Banner Full',
  width: 1860,
  height: 574,
};

export default function BannerFull() {
  const { desktopSrc, mobileSrc, href, alt, width, height } =
    useConteudoDaSecao(MOCK);

  if (!desktopSrc && !mobileSrc) return null;
  const img = desktopSrc || mobileSrc;

  return (
    <div className={styles.homeBannerFull}>
      <div className={`${styles.bannerContainer} component__container`}>
        <div className={styles.bannerWrapper}>
          <a href={href || '#'}>
            <picture>
              {mobileSrc && (
                <source media="(max-width: 767px)" srcSet={mobileSrc} />
              )}
              <img
                alt={alt ?? ''}
                src={img}
                data-src={img}
                data-srcset={`${img} 1296w`}
                sizes="(max-width: 768px) 450px, 100vw"
                width={width}
                height={height}
              />
            </picture>
          </a>
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerFull.conteudoPadrao = MOCK;

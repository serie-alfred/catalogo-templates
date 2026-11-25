import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do BannerSide01. */
interface BannerSide01Conteudo {
  leftImg?: string;
  leftLink?: string;
  leftTitle?: string;
  leftWidth?: number;
  leftHeight?: number;
  rightImg?: string;
  rightLink?: string;
  rightTitle?: string;
  rightWidth?: number;
  rightHeight?: number;
}

const MOCK: BannerSide01Conteudo = {
  leftImg: 'https://placehold.co/915x360',
  leftLink: '#',
  leftTitle: 'placehold',
  leftWidth: 915,
  leftHeight: 360,
  rightImg: 'https://placehold.co/915x360',
  rightLink: '#',
  rightTitle: 'placehold',
  rightWidth: 915,
  rightHeight: 360,
};

export default function BannerSide() {
  const data = useConteudoDaSecao(MOCK);

  if (!data.leftImg && !data.rightImg) return null;

  return (
    <div className={styles.homeBannerSide}>
      <div className={`${styles.bannerContainer} component__container`}>
        <div className={`${styles.bannerRow} component__row`}>
          {data.leftImg && (
            <div className={styles.bannerItem}>
              <a href={data.leftLink || '#'}>
                <img
                  className={`${styles.lazy} ${styles.bannersDesktop}`}
                  src={data.leftImg}
                  data-src={data.leftImg}
                  data-srcset={data.leftImg}
                  width={data.leftWidth}
                  height={data.leftHeight}
                  loading="lazy"
                  alt={`Banner - ${data.leftTitle ?? ''}`}
                />
              </a>
            </div>
          )}

          {data.rightImg && (
            <div className={styles.bannerItem}>
              <a href={data.rightLink || '#'}>
                <img
                  className={`${styles.lazy} ${styles.bannersDesktop}`}
                  src={data.rightImg}
                  data-src={data.rightImg}
                  data-srcset={data.rightImg}
                  width={data.rightWidth}
                  height={data.rightHeight}
                  loading="lazy"
                  alt={`Banner - ${data.rightTitle ?? ''}`}
                />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerSide.conteudoPadrao = MOCK;

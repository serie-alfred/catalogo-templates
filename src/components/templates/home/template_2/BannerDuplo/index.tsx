import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do BannerDuplo02. */
interface BannerDuplo02Conteudo {
  title?: string;
  banners: { src?: string; alt?: string; href?: string }[];
}

const MOCK: BannerDuplo02Conteudo = {
  title: 'Títulos dos Banners',
  banners: [
    {
      src: 'https://placehold.co/676x676',
      alt: 'Banner - Esquerdo',
      href: '#',
    },
    {
      src: 'https://placehold.co/676x676',
      alt: 'Banner - Direito',
      href: '#',
    },
  ],
};

export default function BannerSide() {
  const { title, banners } = useConteudoDaSecao(MOCK);
  const visiveis = banners.filter(b => b?.src).slice(0, 2);

  if (!visiveis.length) return null;

  return (
    <div className={styles.bannerSide} data-role="banner-duplo">
      {title && <h2 data-role="banner-duplo-title">{title}</h2>}

      <div className={`${styles.bannerContainer} component__container`}>
        <div className={styles.bannerRow}>
          {visiveis.map((b, i) => (
            <div
              key={i}
              className={styles.bannerItem}
              data-role="banner-duplo-item"
            >
              <a href={b.href || '#'}>
                <img
                  className="banners__desktop"
                  src={b.src}
                  width="676"
                  height="676"
                  alt={b.alt ?? ''}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerSide.conteudoPadrao = MOCK;

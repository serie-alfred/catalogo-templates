'use client';

import React from 'react';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do BannerTripleSwiper05. */
interface BannerTripleSwiper05Conteudo {
  banners: { image?: string; alt?: string; link?: string }[];
}

const MOCK: BannerTripleSwiper05Conteudo = {
  banners: [
    { image: 'https://placehold.co/800x1020', alt: 'Banner 1', link: '#' },
    { image: 'https://placehold.co/800x1020', alt: 'Banner 2', link: '#' },
    { image: 'https://placehold.co/800x1020', alt: 'Banner 3', link: '#' },
  ],
};

export default function BannerTripleSwiper() {
  const { banners } = useConteudoDaSecao(MOCK);
  const lista = banners.filter(b => b.image).slice(0, 3);
  if (!lista.length) return null;

  return (
    <section className={styles.homeCategoriesLower} data-role="bw-root">
      <div className={styles.categoriesContentLower}>
        <div className={styles.gridImageLower}>
          <div className={styles.swiper}>
            <div className={styles.swiper__wrapper}>
              {lista.map((banner, i) => (
                <div key={i} className={styles.swiper__slide} data-role="bw-item">
                  <div className={styles.bannerImageText}>
                    <a href={banner.link || '#'}>
                      <img
                        src={banner.image}
                        loading="lazy"
                        data-role="bw-img"
                        alt={banner.alt ?? ''}
                      />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerTripleSwiper.conteudoPadrao = MOCK;

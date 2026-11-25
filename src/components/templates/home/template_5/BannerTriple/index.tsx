'use client';
import React from 'react';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do BannerTriple05. */
interface BannerTriple05Conteudo {
  banners: { image?: string; alt?: string; link?: string }[];
}

const MOCK: BannerTriple05Conteudo = {
  banners: [
    { image: 'https://placehold.co/500x623', alt: 'Banner 1', link: '#' },
    { image: 'https://placehold.co/500x623', alt: 'Banner 2', link: '#' },
    { image: 'https://placehold.co/500x623', alt: 'Banner 3', link: '#' },
  ],
};

export default function BannerTriple() {
  const { banners } = useConteudoDaSecao(MOCK);
  const lista = banners.filter(b => b.image).slice(0, 3);
  if (!lista.length) return null;

  return (
    <section className={styles.homeCategories} data-role="bt-root">
      <div className={styles.categoriesContent}>
        <div className={styles.gridImage}>
          {lista.map((banner, i) => (
            <div key={i} className={styles.bannerImageText} data-role="bt-item">
              <a href={banner.link || '#'}>
                <img
                  className={styles.lazy}
                  data-role="bt-img"
                  src={banner.image}
                  loading="lazy"
                  alt={banner.alt ?? ''}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerTriple.conteudoPadrao = MOCK;

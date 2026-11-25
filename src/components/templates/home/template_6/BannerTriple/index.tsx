import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Conteúdo: os nomes do `section.schema` do BannerTriple06 do starter
 * (`banners[]`: `img`, `alt`, `link`), com o mock por baixo do que o CS subir.
 * O link é opcional: sem ele a arte sai sem `<a>`.
 */
interface BannerTripleConteudo {
  banners: { img?: string; alt?: string; link?: string }[];
}

const MOCK: BannerTripleConteudo = {
  banners: [
    { img: 'https://placehold.co/400x180', alt: 'banner 1' },
    { img: 'https://placehold.co/400x180', alt: 'banner 2' },
    { img: 'https://placehold.co/400x180', alt: 'banner 3' },
  ],
};

export default function BannerTriple() {
  const { banners } = useConteudoDaSecao(MOCK);
  const items = banners.filter(b => b?.img).slice(0, 3);

  if (!items.length) return null;

  return (
    <section className={`${styles.bannerColumnContainer} component__container`} data-role="btr-root">
      <div className={styles.bannerColumn}>
        {items.map((banner, index) => {
          const img = (
            <img src={banner.img} alt={banner.alt ?? ''} data-role="btr-img" />
          );
          return (
            <div key={index} className={styles.banner} data-role="btr-banner">
              {banner.link ? <a href={banner.link}>{img}</a> : img}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerTriple.conteudoPadrao = MOCK;

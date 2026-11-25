import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Conteúdo: os nomes do `section.schema` do HomeCarousel06 do starter
 * (`categories[]`: `img`, `title`, `link`), com o mock por baixo do que o CS subir.
 */
interface HomeCarouselConteudo {
  categories: { img?: string; title?: string; link?: string }[];
}

const MOCK: HomeCarouselConteudo = {
  categories: [
    { title: 'Categoria 1', link: '#', img: 'https://placehold.co/250x250' },
    { title: 'Categoria 2', link: '#', img: 'https://placehold.co/250x250' },
    { title: 'Categoria 3', link: '#', img: 'https://placehold.co/250x250' },
    { title: 'Categoria 4', link: '#', img: 'https://placehold.co/250x250' },
    { title: 'Categoria 5', link: '#', img: 'https://placehold.co/250x250' },
    { title: 'Categoria 6', link: '#', img: 'https://placehold.co/250x250' },
    { title: 'Categoria 7', link: '#', img: 'https://placehold.co/250x250' },
    { title: 'Categoria 8', link: '#', img: 'https://placehold.co/250x250' },
  ],
};

export default function HomeCarousel() {
  const { categories } = useConteudoDaSecao(MOCK);
  const items = categories.filter(c => c && (c.img || c.title));

  if (!items.length) return null;

  return (
    <section className={styles.carouselContainer} data-role="hc-root">
      <div className="component__container">
        <div className={styles.swiper}>
          <div className={styles.swiperWrapper}>
            {items.map((cat, index) => (
              <div key={index} className={styles.swiperSlide}>
                <a href={cat.link || '#'} className={styles.rulerItem} data-role="hc-item">
                  {cat.img && (
                    <img src={cat.img} alt={cat.title ?? ''} data-role="hc-img" />
                  )}
                  <span data-role="hc-title">{cat.title}</span>
                </a>
              </div>
            ))}
          </div>
          <div className={styles.swiperButtonPrev}></div>
          <div className={styles.swiperButtonNext}></div>
        </div>
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
HomeCarousel.conteudoPadrao = MOCK;

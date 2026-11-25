import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Conteúdo: os nomes do `section.schema` do CategoryTriple06 do starter
 * (`slides[]`: `img`, `alt`, `link`), com o mock por baixo do que o CS subir.
 */
interface CategoryTripleConteudo {
  slides: { img?: string; alt?: string; link?: string }[];
}

const MOCK: CategoryTripleConteudo = {
  slides: [
    { img: 'https://placehold.co/480x480', alt: 'slide 1' },
    { img: 'https://placehold.co/480x480', alt: 'slide 2' },
    { img: 'https://placehold.co/480x480', alt: 'slide 3' },
  ],
};

export default function CategoryCarousel() {
  const { slides } = useConteudoDaSecao(MOCK);
  const items = slides.filter(s => s?.img);

  if (!items.length) return null;

  return (
    <section className={styles.categoryCarousel} data-role="ctr-root">
      <div
        className={`${styles.componentContainerCarousel} component__container`}
      >
        <div className={styles.swiper}>
          <div className={styles.swiperWrapper}>
            {items.map((slide, index) => {
              const img = (
                <img src={slide.img} alt={slide.alt ?? ''} data-role="ctr-img" />
              );
              return (
                <div key={index} className={styles.swiperSlide} data-role="ctr-slide">
                  <div className={styles.rulerItem}>
                    {slide.link ? <a href={slide.link}>{img}</a> : img}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
CategoryCarousel.conteudoPadrao = MOCK;

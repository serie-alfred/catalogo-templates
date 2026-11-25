'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/BannerCarousel06` do faststore.starter — "Outras Linhas":
 * título à esquerda e carrossel de cards de linha, 4 por página no desktop e 1
 * em tablet/phone, sem dots e sem setas (navegação por swipe, como a origem).
 *
 * A origem serve arte própria no mobile via `<picture>`; o mesmo aqui, com
 * placeholders no lugar do CDN do cliente. `aspect-ratio` no CSS é quem manda
 * na altura, então a caixa não muda.
 *
 * Conteúdo: os nomes do `section.schema` do starter (`sectionTitle`, `cards[]`),
 * com o mock por baixo do que o CS subir (`useConteudoDaSecao`). A analytics
 * (`promotionId`/`promotionName`) fica fora: o preview não emite evento.
 */
interface Card {
  desktopImg?: string;
  mobileImg?: string;
  alt?: string;
  link?: string;
  ctaLabel?: string;
}

interface BannerCarouselConteudo {
  sectionTitle?: string;
  cards: Card[];
}

const MOCK: BannerCarouselConteudo = {
  sectionTitle: 'Outras Linhas:',
  cards: [
  {
    desktopImg: 'https://placehold.co/458x766/2e2e2e/f2f2f2?text=Speed',
    mobileImg: 'https://placehold.co/780x912/2e2e2e/f2f2f2?text=Speed',
    alt: 'Linha Speed',
    link: '/SPEED',
    ctaLabel: 'COMPRAR',
  },
  {
    desktopImg: 'https://placehold.co/458x766/383838/f2f2f2?text=Still',
    mobileImg: 'https://placehold.co/780x912/383838/f2f2f2?text=Still',
    alt: 'Linha Still',
    link: '/still',
    ctaLabel: 'COMPRAR',
  },
  {
    desktopImg: 'https://placehold.co/458x766/424242/f2f2f2?text=424',
    mobileImg: 'https://placehold.co/780x912/424242/f2f2f2?text=424',
    alt: 'Linha 424',
    link: '/424?map=productClusterIds',
    ctaLabel: 'COMPRAR',
  },
  {
    desktopImg: 'https://placehold.co/458x766/4c4c4c/f2f2f2?text=Flip+Classic',
    mobileImg: 'https://placehold.co/780x912/4c4c4c/f2f2f2?text=Flip+Classic',
    alt: 'Linha Flip Classic',
    link: '/flip%20classic',
    ctaLabel: 'COMPRAR',
  },
  ],
};

export default function BannerCarousel() {
  const { sectionTitle, cards } = useConteudoDaSecao(MOCK);

  if (!sectionTitle && !cards.length) return null;

  return (
    /* wrapper só do catálogo — ver o comentário no index.module.css */
    <div className={styles.bannerCarousel06Root}>
      <div className={styles.outer} data-role="bc-outer">
        <div className={styles.wrapper} data-role="bc-wrapper">
          {sectionTitle && (
            <div className={styles.titleRow} data-role="bc-title-row">
              <div className={styles.titleWrap}>
                <h2 className={styles.title} data-role="bc-title">
                  {sectionTitle}
                </h2>
              </div>
            </div>
          )}

          {cards.length > 0 && (
          <Swiper
            className={styles.slider}
            slidesPerView={1}
            spaceBetween={4}
            loop
            breakpoints={{ 1200: { slidesPerView: 4, spaceBetween: 4 } }}
          >
            {cards.map((card, index) => (
              <SwiperSlide key={index} className={styles.slide}>
                <div className={styles.card} data-role="bc-card">
                  <a className={styles.cardLink} href={card.link || '#'}>
                    <picture>
                      <source
                        media="(max-width: 1199px)"
                        srcSet={card.mobileImg || card.desktopImg}
                      />
                      <img
                        className={styles.cardImg}
                        data-role="bc-card-img"
                        src={card.desktopImg}
                        alt={card.alt ?? ''}
                        width={458}
                        height={766}
                        loading="lazy"
                      />
                    </picture>
                  </a>
                  {card.ctaLabel && (
                    <div className={styles.overlay} data-role="bc-overlay">
                      <div className={styles.overlayInner}>
                        <a className={styles.comprar} href={card.link || '#'}>
                          <span
                            className={styles.comprarLabel}
                            data-role="bc-cta-label"
                          >
                            {card.ctaLabel}
                          </span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          )}
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerCarousel.conteudoPadrao = MOCK;

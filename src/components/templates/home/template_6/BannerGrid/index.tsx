'use client';

import React, { useEffect, useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import styles from './index.module.css';

/**
 * Espelha `molecules/BannerGrid06` do faststore.starter — título centrado e
 * slider de banner-cards de categoria: 3 por página no desktop, 1 em
 * tablet/phone com dots e setas.
 *
 * As artes são placeholders (o catálogo é público e não aponta para CDN de
 * cliente); `aspect-ratio` no CSS é quem manda na altura, então a caixa não
 * muda.
 */
interface Card {
  img: string;
  alt: string;
  title: string;
  link: string;
}

const cards: Card[] = [
  {
    img: 'https://placehold.co/637x811/3a3a3a/f2f2f2?text=Tenis+Casuais',
    alt: 'Tênis casuais',
    title: 'TENIS CASUAIS',
    link: '/calcados/sapatenis',
  },
  {
    img: 'https://placehold.co/637x811/2f2f2f/f2f2f2?text=Botas',
    alt: 'Botas',
    title: 'BOTAS',
    link: '/calcados/botas',
  },
  {
    img: 'https://placehold.co/637x811/444444/f2f2f2?text=Sapatos',
    alt: 'Sapatos',
    title: 'SAPATOS',
    link: '/calcados/sapatos',
  },
];

const sectionTitle = 'Feito no Brasil, inspirado em você.';

export default function BannerGrid() {
  const swiperRef = useRef<SwiperType | null>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !prevRef.current || !nextRef.current) return;
    const nav = swiper.params.navigation;
    if (typeof nav === 'boolean' || !nav) return;
    nav.prevEl = prevRef.current;
    nav.nextEl = nextRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
  }, []);

  return (
    /* wrapper só do catálogo — ver o comentário no index.module.css */
    <div className={styles.bannerGrid06Root}>
      <div className={styles.wrapper} data-role="bg-wrapper">
        <div className={styles.titleRow} data-role="bg-title-row">
          <h2 className={styles.title} data-role="bg-title">
            {sectionTitle}
          </h2>
        </div>

        <Swiper
          className={styles.slider}
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={0}
          loop
          breakpoints={{ 1200: { slidesPerView: 3 } }}
          pagination={{
            clickable: true,
            bulletClass: styles.dot,
            bulletActiveClass: styles.dotActive,
          }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onSwiper={swiper => {
            swiperRef.current = swiper;
          }}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index} className={styles.slide}>
              <div className={styles.slideInner} data-role="bg-slide-inner">
                <div className={styles.card} data-role="bg-card">
                  {/* o link cobre só a imagem; o texto sobreposto não é clicável */}
                  <a className={styles.cardLink} href={card.link}>
                    <img
                      className={styles.cardImg}
                      data-role="bg-card-img"
                      src={card.img}
                      alt={card.alt}
                      width={637}
                      height={811}
                      loading="lazy"
                    />
                  </a>
                  <div
                    className={styles.cardTextBox}
                    data-role="bg-card-textbox"
                  >
                    <h4 className={styles.cardTitle} data-role="bg-card-title">
                      {card.title}
                    </h4>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          <button
            ref={prevRef}
            type="button"
            className={styles.arrowPrev}
            aria-label="Banner anterior"
          >
            <svg
              className={styles.arrowIcon}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M10.8 13.5 5.3 8l5.5-5.5 1.2 1.2L7.7 8l4.3 4.3z" />
            </svg>
          </button>
          <button
            ref={nextRef}
            type="button"
            className={styles.arrowNext}
            aria-label="Próximo banner"
          >
            <svg
              className={styles.arrowIcon}
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="M5.2 2.5 10.7 8l-5.5 5.5-1.2-1.2L8.3 8 4 3.7z" />
            </svg>
          </button>
        </Swiper>
      </div>
    </div>
  );
}

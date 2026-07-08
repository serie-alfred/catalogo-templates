'use client';
import React, { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import styles from './index.module.css';

// Mock base (mantido do catálogo). Ciclado para ~10 slides para o carrossel rolar.
const baseCategories = [
  { id: 1, title: 'Categoria', link: '#', img: 'https://placehold.co/250x250' },
  { id: 2, title: 'Categoria', link: '#', img: 'https://placehold.co/250x250' },
  { id: 3, title: 'Categoria', link: '#', img: 'https://placehold.co/250x250' },
  { id: 4, title: 'Categoria', link: '#', img: 'https://placehold.co/250x250' },
  { id: 5, title: 'Categoria', link: '#', img: 'https://placehold.co/250x250' },
  { id: 6, title: 'Categoria', link: '#', img: 'https://placehold.co/250x250' },
  { id: 7, title: 'Categoria', link: '#', img: 'https://placehold.co/250x250' },
];

const categories = Array.from({ length: 10 }).map((_, index) => {
  const cat = baseCategories[index % baseCategories.length];
  return { ...cat, id: index + 1 };
});

// Espelha molecules/Categories01 do faststore.starter:
// Swiper com Navigation, slidesPerView 3/4/5/6 por breakpoint e spaceBetween crescente.
const BREAKPOINTS = {
  768: { slidesPerView: 4, spaceBetween: 8 },
  1024: { slidesPerView: 5, spaceBetween: 12 },
  1100: { slidesPerView: 6, spaceBetween: 24 },
};

export default function Categories() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const syncNavState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className={styles.homeCategories}>
      <div className={`${styles.categoriesContainer} component__container`}>
        <div className={styles.categoriesTitle}>
          <h2>Categorias em Destaque</h2>
        </div>

        <div className={styles.categoriesWrapper}>
          <Swiper
            breakpointsBase="container"
            className={styles.categoriesSwiper}
            modules={[Navigation]}
            slidesPerView={3}
            spaceBetween={8}
            breakpoints={BREAKPOINTS}
            onSwiper={swiper => {
              swiperRef.current = swiper;
              syncNavState(swiper);
            }}
            onSlideChange={syncNavState}
            onBreakpoint={syncNavState}
          >
            {categories.map(cat => (
              <SwiperSlide key={cat.id} className={styles.swiper__slide}>
                <div className={styles.categoriesItem}>
                  <a href={cat.link}>
                    <div className={styles.categoriesImage}>
                      <img
                        src={cat.img}
                        width="250"
                        height="250"
                        alt={`Categoria - ${cat.title}`}
                      />
                    </div>
                    <h3>{cat.title}</h3>
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {!isBeginning && (
            <div
              className={styles.swiperCategoriesButtonPrev}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <svg
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 8L10 12L14 16"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          )}

          {!isEnd && (
            <div
              className={styles.swiperCategoriesButtonNext}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <svg
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 16L14 12L10 8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

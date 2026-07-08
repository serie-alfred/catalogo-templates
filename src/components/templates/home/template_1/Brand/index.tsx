'use client';
import React, { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import styles from './index.module.css';

// Mock base (mantido do catálogo). Ciclado para ~10 slides para o carrossel rolar.
const baseBrands = [
  {
    position: 1,
    title: 'Marca 1',
    link: 'https://exemplo.com/marca1',
    img: 'https://placehold.co/180x100',
  },
  {
    position: 2,
    title: 'Marca 2',
    link: 'https://exemplo.com/marca2',
    img: 'https://placehold.co/180x100',
  },
  {
    position: 3,
    title: 'Marca 3',
    link: 'https://exemplo.com/marca3',
    img: 'https://placehold.co/180x100',
  },
  {
    position: 4,
    title: 'Marca 4',
    link: 'https://exemplo.com/marca4',
    img: 'https://placehold.co/180x100',
  },
  {
    position: 5,
    title: 'Marca 5',
    link: 'https://exemplo.com/marca5',
    img: 'https://placehold.co/180x100',
  },
  {
    position: 6,
    title: 'Marca 6',
    link: 'https://exemplo.com/marca6',
    img: 'https://placehold.co/180x100',
  },
  {
    position: 7,
    title: 'Marca 7',
    link: 'https://exemplo.com/marca6',
    img: 'https://placehold.co/180x100',
  },
];

const brands = Array.from({ length: 10 }).map((_, index) => {
  const brand = baseBrands[index % baseBrands.length];
  return { ...brand, position: index + 1 };
});

// Espelha molecules/Brands01 do faststore.starter:
// Swiper com Navigation, slidesPerView 2/3/5/6 por breakpoint e spaceBetween crescente.
const BREAKPOINTS = {
  768: { slidesPerView: 3, spaceBetween: 8 },
  1024: { slidesPerView: 5, spaceBetween: 12 },
  1100: { slidesPerView: 6, spaceBetween: 24 },
};

export default function Brands() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const syncNavState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className={styles.homeBrands}>
      <div className={`${styles.brandsContainer} component__container`}>
        <div className={styles.brandsWrapper}>
          <Swiper
            breakpointsBase="container"
            className={styles.brandsSwiper}
            modules={[Navigation]}
            slidesPerView={2}
            spaceBetween={8}
            breakpoints={BREAKPOINTS}
            onSwiper={swiper => {
              swiperRef.current = swiper;
              syncNavState(swiper);
            }}
            onSlideChange={syncNavState}
            onBreakpoint={syncNavState}
          >
            {brands.map(brand => (
              <SwiperSlide
                key={brand.position}
                className={styles.swiper__slide}
              >
                <div className={styles.brandsItem}>
                  <a href={brand.link}>
                    <div className={styles.brandsImage}>
                      <img
                        src={brand.img}
                        width="180"
                        height="100"
                        alt={`Marca ${brand.title}`}
                        loading="lazy"
                      />
                    </div>
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {!isBeginning && (
            <div
              className={styles.swiperBrandsButtonPrev}
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
                  stroke="#141414"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          )}

          {!isEnd && (
            <div
              className={styles.swiperBrandsButtonNext}
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
                  stroke="#141414"
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

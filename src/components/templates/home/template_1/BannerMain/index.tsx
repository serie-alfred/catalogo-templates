'use client';
import React, { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import styles from './index.module.css';

interface SlideItem {
  link: string;
  target: string;
  image: string;
  label: string;
  width: number;
  height: number;
}

const slidesDesktop: SlideItem[] = [
  {
    link: '#',
    target: '_blank',
    image: 'https://placehold.co/1920x400',
    label: 'Banner Desktop',
    width: 1200,
    height: 400,
  },
];

const slidesMobile: SlideItem[] = [
  {
    link: '#',
    target: '_blank',
    image: 'https://placehold.co/390x460',
    label: 'Banner Mobile',
    width: 600,
    height: 300,
  },
];

// Loop/autoplay do Swiper precisam de mais de um slide; replica o mock
// existente até ter ao menos 3 quando só há um banner cadastrado.
function ensureSlides(slides: SlideItem[]): SlideItem[] {
  if (slides.length === 0) return slides;
  if (slides.length >= 3) return slides;
  return Array.from({ length: 3 }).map((_, index) => slides[index % slides.length]);
}

// Espelha organisms/BannerMain01 do faststore.starter:
// Swiper com loop + observer e paginação/setas custom.
function BannerSlider({ slides }: { slides: SlideItem[] }) {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Swiper
        breakpointsBase="container"
        loop
        observer
        observeParents
        onSwiper={setSwiper}
        onSlideChange={s => setActiveIndex(s.realIndex)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <a href={slide.link} target={slide.target}>
              <img
                src={slide.image}
                alt={slide.label}
                width={slide.width}
                height={slide.height}
                fetchPriority="high"
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.swiperBannerPagination}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`${styles.swiperPaginationBullet} ${
              index === activeIndex ? styles.swiperPaginationBulletActive : ''
            }`}
            role="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => swiper?.slideToLoop(index)}
          />
        ))}
      </div>

      <div
        className={styles.swiperBannerButtonPrev}
        onClick={() => swiper?.slidePrev()}
      >
        <svg
          fill="none"
          height="24"
          width="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 8L10 12L14 16"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div
        className={styles.swiperBannerButtonNext}
        onClick={() => swiper?.slideNext()}
      >
        <svg
          fill="none"
          height="24"
          width="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 16L14 12L10 8"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </>
  );
}

export default function BannerMain() {
  const desktopSlides = ensureSlides(slidesDesktop);
  const mobileSlides = ensureSlides(slidesMobile);

  if (!desktopSlides.length && !mobileSlides.length) return null;

  return (
    <div className={styles.home__banner__main}>
      {/* Banner Desktop */}
      {desktopSlides.length > 0 && (
        <div className={styles.banner__home}>
          <div className={styles.desktop}>
            <div className={styles.bannerMain}>
              <BannerSlider slides={desktopSlides} />
            </div>
          </div>
        </div>
      )}

      {/* Banner Mobile */}
      {mobileSlides.length > 0 && (
        <div className={styles.banner__home}>
          <div className={styles.mobile}>
            <div className={styles.bannerMainMobile}>
              <BannerSlider slides={mobileSlides} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

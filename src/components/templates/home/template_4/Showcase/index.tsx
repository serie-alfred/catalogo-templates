'use client';
import React, { useId, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import styles from './index.module.css';
import Spot from '../../../common/template_4/Spot';
import { LAYOUTS } from '@/data/layoutData';
import { TemplateRegistry } from '@/utils/templateRegistry';
import { useLayout } from '@/context/LayoutContext';

// Espelha organisms/ProductShelfCustom04 do faststore.starter:
// Swiper com Pagination externa (bottom_nav), slidesPerView 2/3/4/5 por
// breakpoint, setas laterais redondas e botões de navegação na barra inferior.
const BREAKPOINTS = {
  0: { slidesPerView: 2 },
  768: { slidesPerView: 3 },
  1024: { slidesPerView: 4 },
  1280: { slidesPerView: 5 },
};

const ChevronLeft = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="#141414"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="#141414"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Showcase() {
  const { selections } = useLayout();
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const paginationId = `shelf04-pg-${useId().replace(/:/g, '')}`;

  const syncNavState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // Spots selecionados no gerador; se nenhum, usa o Spot padrão do template.
  const selectedSpots = selections.filter(item => item.layoutKey === 'spot');

  // Monta ~8 slides (ciclando os spots escolhidos) para o carrossel ter o que rolar.
  const slides = Array.from({ length: 8 }).map((_, index) => {
    const spot = selectedSpots[index % selectedSpots.length];
    if (spot) {
      const layoutItem = LAYOUTS.spot.items.find(it => it.id === spot.id);
      const SpotComponent = layoutItem
        ? TemplateRegistry[layoutItem.component]
        : null;
      return {
        key: `${spot.uid}-${index}`,
        variables: spot.variables as React.CSSProperties | undefined,
        Component: SpotComponent,
      };
    }
    return { key: `default-${index}`, variables: undefined, Component: null };
  });

  return (
    <div className={styles.shelf}>
      <div className={`${styles.shelf__container} component__container`}>
        <div className={styles.shelf__header}>
          <h2 className={styles.shelf__title}>Lorem Ipsum Dolor</h2>
          <a
            className={styles.shelf__link}
            href="#"
            onClick={e => e.preventDefault()}
          >
            Ver Todos
          </a>
        </div>

        <div className={styles.showcase__wrapper}>
          <Swiper
            breakpointsBase="container"
            className={styles.showcase__swiper}
            slidesPerView={2}
            modules={[Pagination]}
            pagination={{ clickable: true, el: `#${paginationId}` }}
            breakpoints={BREAKPOINTS}
            onSwiper={swiper => {
              swiperRef.current = swiper;
              syncNavState(swiper);
            }}
            onSlideChange={syncNavState}
            onBreakpoint={syncNavState}
            data-tray-tst="vitrine_home"
          >
            {slides.map(({ key, variables, Component }) => (
              <SwiperSlide
                key={key}
                className={styles.swiper__slide}
                style={variables}
                data-tray-tst="vitrine_produto"
                itemScope
                itemType="https://schema.org/SomeProducts"
              >
                {Component ? <Component /> : <Spot />}
              </SwiperSlide>
            ))}
          </Swiper>

          {!isBeginning && (
            <button
              className={`${styles.arrow} ${styles.arrow__prev}`}
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Anterior"
            >
              <ChevronLeft />
            </button>
          )}
          {!isEnd && (
            <button
              className={`${styles.arrow} ${styles.arrow__next}`}
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Próximo"
            >
              <ChevronRight />
            </button>
          )}
        </div>

        <div className={styles.bottom_nav}>
          <button
            className={styles.nav_btn}
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Anterior"
          >
            <ChevronLeft />
          </button>
          <div id={paginationId} className={styles.pagination_dots} />
          <button
            className={styles.nav_btn}
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Próximo"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

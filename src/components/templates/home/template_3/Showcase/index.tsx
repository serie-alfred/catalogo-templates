'use client';
import React, { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import styles from './index.module.css';
import Spot from '../../../common/template_3/Spot';
import { LAYOUTS } from '@/data/layoutData';
import { TemplateRegistry } from '@/utils/templateRegistry';
import { useLayout } from '@/context/LayoutContext';

// Espelha organisms/ProductShelfCustom03 do faststore.starter:
// Swiper com Pagination, slidesPerView 1.5/3/4 por breakpoint e setas custom.
const BREAKPOINTS = {
  0: { slidesPerView: 1.5 },
  768: { slidesPerView: 3 },
  1024: { slidesPerView: 4 },
};

export default function Showcase() {
  const { selections } = useLayout();
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

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
          <h2 className={styles.shelf__title}>Lorem Ipsum Dolor Sit</h2>
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
            pagination={{ clickable: true }}
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
            <div
              className={styles.swiper__button__prev}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#141414"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {!isEnd && (
            <div
              className={styles.swiper__button__next}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#141414"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

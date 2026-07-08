'use client';
import React, { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import styles from './index.module.css';
import Spot from '../../../common/template_1/Spot';
import { LAYOUTS } from '@/data/layoutData';
import { TemplateRegistry } from '@/utils/templateRegistry';
import { useLayout } from '@/context/LayoutContext';

// Espelha organisms/ProductShowcase01 do faststore.starter:
// Swiper com Pagination, slidesPerView 2/3/4 por breakpoint e setas custom.
const BREAKPOINTS = {
  0: { slidesPerView: 2 },
  768: { slidesPerView: 3 },
  1024: { slidesPerView: 4 },
};

export default function ProductRelated() {
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

  // Herda as variáveis visuais da vitrine selecionada na home (cores, fonte, bullet)
  const showcaseSelection = selections.find(
    item => item.layoutKey === 'showcase'
  );
  const showcaseVars = showcaseSelection?.variables as
    | React.CSSProperties
    | undefined;

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
    <div className={styles.home__showcase} style={showcaseVars}>
      <div className={`${styles.showcase__container} component__container`}>
        <div className={styles.showcase__title}>
          <h2>Produtos relacionados</h2>
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
              className={styles.swiper__button__next}
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

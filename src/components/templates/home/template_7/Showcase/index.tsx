'use client';
import React from 'react';
import styles from './index.module.css';
import Spot from '../../../common/template_7/Spot';
import { LAYOUTS } from '@/data/layoutData';
import { TemplateRegistry } from '@/utils/templateRegistry';
import { useLayout } from '@/context/LayoutContext';

export default function Showcase() {
  const { selections } = useLayout();

  // Filtra os spots selecionados
  const selectedSpots = selections.filter(item => item.layoutKey === 'spot');

  return (
    <div className={styles.home__showcase}>
      <div className={`${styles.showcase__container}`}>
        <div className={styles.showcase__title}>
          <h2>Lorem Ipsum Dolor Sit</h2>
          <a href="/">Ver Todos</a>
        </div>

        <div className={styles.showcase__wrapper}>
          <div className={styles.showcase__swiper} data-tray-tst="vitrine_home">
            <div className={styles.swiper__wrapper}>
              {selectedSpots.length > 0
                ? selectedSpots.map((spot: { id: string; uid: string }) => {
                    const layoutItem = LAYOUTS.spot.items.find(
                      it => it.id === spot.id
                    );
                    if (!layoutItem) return null;

                    const SpotComponent =
                      TemplateRegistry[layoutItem.component];

                    return SpotComponent ? (
                      [1, 2, 3, 4].map((_, index) => (
                        <div
                          key={`${spot?.uid}-${index}`}
                          className={styles.swiper__slide}
                          data-tray-tst="vitrine_produto"
                          itemScope
                          itemType="https://schema.org/SomeProducts"
                        >
                          <SpotComponent />
                        </div>
                      ))
                    ) : (
                      <></>
                    );
                  })
                : [1, 2, 3, 4].map((_, index) => (
                    <div
                      key={`${index}`}
                      className={styles.swiper__slide}
                      data-tray-tst="vitrine_produto"
                      itemScope
                      itemType="https://schema.org/SomeProducts"
                    >
                      <Spot />
                    </div>
                  ))}
            </div>
          </div>

          {/* Paginação */}
          <div
            className={`${styles.swiper__showcase__pagination} ${styles.swiper__pagination__clickable} ${styles.swiper__pagination__bullets} ${styles.swiper__pagination__horizontal}`}
          >
            {[...Array(8)].map((_, index) => (
              <span
                key={index}
                className={`${styles.swiper__bullet} ${
                  index == 0 ? styles.swiper__bullet__active : ''
                }`}
                role="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index == 0 ? 'true' : undefined}
              ></span>
            ))}
          </div>
          <div className={styles.swiper__pagination}></div>

          {/* Botão prev */}
          <div className={styles.swiper__button__prev}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>

          {/* Botão next */}
          <div className={styles.swiper__button__next}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

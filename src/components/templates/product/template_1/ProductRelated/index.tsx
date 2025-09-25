'use client';
import React from 'react';
import styles from './index.module.css';
import Spot from '../../../common/template_1/Spot';
import { LAYOUTS } from '@/data/layoutData';
import { TemplateRegistry } from '@/utils/templateRegistry';
import { useLayout } from '@/context/LayoutContext';

export default function Showcase() {
  const { selections } = useLayout();

  // Filtra os spots selecionados
  const selectedSpots = selections.filter(item => item.layoutKey === 'spot');

  return (
    <div className={styles.home__showcase}>
      <div className={`${styles.showcase__container} component__container`}>
        <div className={styles.showcase__title}>
          <h2>Em destaque</h2>
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
                  index === 0 ? styles.swiper__bullet__active : ''
                }`}
                role="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === 0 ? 'true' : undefined}
              ></span>
            ))}
          </div>
          <div className={styles.swiper__pagination}></div>

          {/* Botão prev */}
          <div className={styles.swiper__button__prev}>
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

          {/* Botão next */}
          <div className={styles.swiper__button__next}>
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
        </div>
      </div>
    </div>
  );
}

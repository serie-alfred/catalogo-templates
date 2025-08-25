// Showcase.jsx
import React from 'react';
import styles from './index.module.css';
import Spot from '@/components/templates/common/template_1/Spot';
import { useLayoutGenerator } from '@/hooks/useLayoutGenerator';
import { TemplateRegistry } from '@/utils/templateRegistry';
import { LAYOUTS } from '@/data/layoutData';

export default function Showcase() {
  const { selections } = useLayoutGenerator();

  // Filtra os spots selecionados
  const selectedSpots = selections.filter(item => item.layoutKey === 'spot');

  return (
    <div className={styles.homeShowcase}>
      <div className={`${styles.showcaseContainer} component__container`}>
        <div className={styles.showcaseTitle}>
          <h2>Vitrine de Ofertas</h2>
        </div>

        <div className={styles.showcaseWrapper}>
          <div
            className={`swiper ${styles.showcaseSwiper}`}
            data-tray-tst="vitrine_home"
          >
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

          <div className={`${styles.swiperShowcasePagination}`}>
            <span
              className={`${styles.swiperPaginationBullet} ${styles.swiperPaginationBulletActive}`}
              role="button"
              aria-label="Go to slide 1"
              aria-current="true"
            ></span>
            <span
              className={`${styles.swiperPaginationBullet}`}
              role="button"
              aria-label="Go to slide 2"
            ></span>
            <span
              className={`${styles.swiperPaginationBullet}`}
              role="button"
              aria-label="Go to slide 3"
            ></span>
            <span
              className={`${styles.swiperPaginationBullet}`}
              role="button"
              aria-label="Go to slide 4"
            ></span>
            <span
              className={`${styles.swiperPaginationBullet}`}
              role="button"
              aria-label="Go to slide 5"
            ></span>
            <span
              className={`${styles.swiperPaginationBullet}`}
              role="button"
              aria-label="Go to slide 6"
            ></span>
          </div>

          <div className={styles.swiperShowcaseButtonPrev}>
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

          <div className={styles.swiperShowcaseButtonNext}>
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

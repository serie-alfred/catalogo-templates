'use client';
import React from 'react';
import styles from './index.module.css';
import Spot from '../../../common/template_4/Spot';
import { LAYOUTS } from '@/data/layoutData';
import { TemplateRegistry } from '@/utils/templateRegistry';
import { useLayout } from '@/context/LayoutContext';

const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M15 18L9 12L15 6" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M9 18L15 12L9 6" stroke="#141414" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Preview da vitrine ProductShelfCustom04. Carrossel apenas simulado (setas
// laterais + dots na barra inferior, sem clique). Colunas por view via
// @container. Spots dinâmicos conforme a seleção do usuário.
export default function Showcase() {
  const { selections } = useLayout();
  const selectedSpots = selections.filter(item => item.layoutKey === 'spot');

  return (
    <div className={styles.shelf}>
      <div className={`${styles.shelf__container} component__container`}>
        <div className={styles.shelf__header}>
          <h2 className={styles.shelf__title}>Lorem Ipsum Dolor</h2>
          <a className={styles.shelf__link} href="#" onClick={e => e.preventDefault()}>
            Ver Todos
          </a>
        </div>

        <div className={styles.showcase__wrapper}>
          <div className={styles.showcase__swiper} data-tray-tst="vitrine_home">
            <div className={styles.swiper__wrapper}>
              {selectedSpots.length > 0
                ? selectedSpots.map(
                    (spot: {
                      id: string;
                      uid: string;
                      variables?: Record<string, string>;
                    }) => {
                      const layoutItem = LAYOUTS.spot.items.find(
                        it => it.id === spot.id
                      );
                      if (!layoutItem) return null;

                      const SpotComponent =
                        TemplateRegistry[layoutItem.component];

                      return SpotComponent
                        ? [1, 2, 3, 4, 5].map((_, index) => (
                            <div
                              key={`${spot?.uid}-${index}`}
                              className={styles.swiper__slide}
                              style={spot.variables as React.CSSProperties}
                              data-tray-tst="vitrine_produto"
                              itemScope
                              itemType="https://schema.org/SomeProducts"
                            >
                              <SpotComponent />
                            </div>
                          ))
                        : null;
                    }
                  )
                : [1, 2, 3, 4, 5].map((_, index) => (
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

          {/* Setas laterais (apenas visuais) */}
          <div className={`${styles.arrow} ${styles.arrow__prev}`}>
            <ChevronLeft />
          </div>
          <div className={`${styles.arrow} ${styles.arrow__next}`}>
            <ChevronRight />
          </div>
        </div>

        {/* Barra inferior: nav (mobile) + dots (apenas visuais) */}
        <div className={styles.bottom_nav}>
          <div className={styles.nav_btn}>
            <ChevronLeft />
          </div>
          <div className={styles.pagination_dots}>
            {[...Array(6)].map((_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${index === 0 ? styles.dot__active : ''}`}
                role="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === 0 ? 'true' : undefined}
              ></span>
            ))}
          </div>
          <div className={styles.nav_btn}>
            <ChevronRight />
          </div>
        </div>
      </div>
    </div>
  );
}

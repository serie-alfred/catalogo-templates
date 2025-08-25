// Showcase.jsx
import React from 'react';
import styles from './index.module.css';
import Spot from '@/components/templates/common/template_1/Spot';

const products = [
  {
    id: 1,
    title: 'Tênis Esportivo Masculino',
    link: '/produto/tenis-esportivo',
    img: '/img/produtos/tenis1.jpg',
    available: true,
    stock: 10,
    price: 299.9,
    priceOffer: 199.9,
    hasVariation: false,
    payment: 'ou 10x de R$ 19,99 sem juros',
  },
  {
    id: 2,
    title: 'Camiseta Básica',
    link: '/produto/camiseta-basica',
    img: '/img/produtos/camiseta1.jpg',
    available: true,
    stock: 20,
    price: 79.9,
    priceOffer: 59.9,
    hasVariation: false,
    payment: 'ou 3x de R$ 19,97 sem juros',
  },
  {
    id: 3,
    title: 'Mochila Casual',
    link: '/produto/mochila',
    img: '/img/produtos/mochila1.jpg',
    available: true,
    stock: 5,
    price: 199.9,
    priceOffer: 0,
    hasVariation: false,
    payment: 'ou 5x de R$ 39,98 sem juros',
  },
  {
    id: 4,
    title: 'Boné Estiloso',
    link: '/produto/bone',
    img: '/img/produtos/bone1.jpg',
    available: false,
    stock: 0,
    price: 89.9,
    priceOffer: 0,
    hasVariation: false,
    payment: '',
  },
];

export default function Showcase() {
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
              {products.map(product => (
                <div
                  className={styles.swiper__slide}
                  key={product.id}
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

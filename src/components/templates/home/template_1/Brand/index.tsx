import React from 'react';
import styles from './index.module.css';

const brands = [
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
];

export default function Brands() {
  return (
    <div className={styles.homeBrands}>
      <div className={`${styles.brandsContainer} component__container`}>
        <div className={styles.brandsWrapper}>
          <div className={`swiper ${styles.brandsSwiper}`}>
            <div className={styles.swiper__wrapper}>
              {brands.map(brand => (
                <div className={styles.swiper__slide} key={brand.position}>
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
                </div>
              ))}
            </div>
          </div>

          <div className={styles.swiperBrandsButtonPrev}>
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

          <div className={styles.swiperBrandsButtonNext}>
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

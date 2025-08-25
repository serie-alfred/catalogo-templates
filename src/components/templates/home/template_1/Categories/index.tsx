import React from 'react';
import styles from './index.module.css';

const categories = [
  {
    id: 1,
    title: 'Categoria',
    link: '#',
    img: 'https://placehold.co/250x250',
  },
  {
    id: 2,
    title: 'Categoria',
    link: '#',
    img: 'https://placehold.co/250x250',
  },
  {
    id: 3,
    title: 'Categoria',
    link: '#',
    img: 'https://placehold.co/250x250',
  },
  {
    id: 4,
    title: 'Categoria',
    link: '#',
    img: 'https://placehold.co/250x250',
  },
  {
    id: 5,
    title: 'Categoria',
    link: '#',
    img: 'https://placehold.co/250x250',
  },
  {
    id: 6,
    title: 'Categoria',
    link: '#',
    img: 'https://placehold.co/250x250',
  },
];

export default function Categories() {
  return (
    <div className={styles.homeCategories}>
      <div className={`${styles.categoriesContainer} component__container`}>
        <div className={styles.categoriesTitle}>
          <h2>Categorias em Destaque</h2>
        </div>

        <div className={styles.categoriesWrapper}>
          <div className={`swiper ${styles.categoriesSwiper}`}>
            <div className={styles.swiper__wrapper}>
              {categories.map(cat => (
                <div className={styles.swiper__slide} key={cat.id}>
                  <div className={styles.categoriesItem}>
                    <a href={cat.link}>
                      <div className={styles.categoriesImage}>
                        <img
                          src={cat.img}
                          width="250"
                          height="250"
                          alt={`Categoria - ${cat.title}`}
                        />
                      </div>
                      <h3>{cat.title}</h3>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.swiperCategoriesButtonPrev}>
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

          <div className={styles.swiperCategoriesButtonNext}>
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

import React from 'react';
import styles from './index.module.css';

export default function CategoryCarousel() {
  const slides = [
    'https://placehold.co/480x480',
    'https://placehold.co/480x480',
    'https://placehold.co/480x480',
  ];

  return (
    <section className={styles.categoryCarousel}>
      <div
        className={`${styles.componentContainerCarousel} component__container`}
      >
        <div className={styles.swiper}>
          <div className={styles.swiperWrapper}>
            {slides.map((src, index) => (
              <div key={index} className={styles.swiperSlide}>
                <div className={styles.rulerItem}>
                  <img src={src} alt={`slide ${index + 1}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

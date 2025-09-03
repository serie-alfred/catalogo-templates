'use client';

import React from 'react';
import styles from './index.module.css';

export default function BannerTripleSwiper() {
  return (
    <section className={styles.homeCategoriesLower}>
      <div className={styles.categoriesContentLower}>
        <div className={styles.gridImageLower}>
          <div className={styles.swiper}>
            <div className={styles.swiper__wrapper}>
              <div className={`${styles.swiper__slide}`}>
                <div className={styles.bannerImageText}>
                  <a href="#">
                    <img
                      src="https://placehold.co/800x1020"
                      loading="lazy"
                      alt="Banner 1"
                    />
                  </a>
                </div>
              </div>
              <div className={`${styles.swiper__slide}`}>
                <div className={styles.bannerImageText}>
                  <a href="#">
                    <img
                      src="https://placehold.co/800x1020"
                      loading="lazy"
                      alt="Banner 2"
                    />
                  </a>
                </div>
              </div>
              <div className={`${styles.swiper__slide}`}>
                <div className={styles.bannerImageText}>
                  <a href="#">
                    <img
                      src="https://placehold.co/800x1020"
                      loading="lazy"
                      alt="Banner 3"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

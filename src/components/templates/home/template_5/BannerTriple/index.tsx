'use client';
import React from 'react';
import styles from './index.module.css';

export default function BannerTriple() {
  return (
    <section className={styles.homeCategories} data-role="bt-root">
      <div className={styles.categoriesContent}>
        <div className={styles.gridImage}>
          <div className={styles.bannerImageText} data-role="bt-item">
            <a href="#">
              <img
                className={styles.lazy}
                data-role="bt-img"
                src="https://placehold.co/500x623"
                loading="lazy"
                alt="Banner 1"
              />
            </a>
          </div>

          <div className={styles.bannerImageText} data-role="bt-item">
            <a href="#">
              <img
                className={styles.lazy}
                data-role="bt-img"
                src="https://placehold.co/500x623"
                loading="lazy"
                alt="Banner 2"
              />
            </a>
          </div>

          <div className={styles.bannerImageText} data-role="bt-item">
            <a href="#">
              <img
                className={styles.lazy}
                data-role="bt-img"
                src="https://placehold.co/500x623"
                loading="lazy"
                alt="Banner 3"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

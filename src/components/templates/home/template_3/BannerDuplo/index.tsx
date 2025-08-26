'use client';

import React from 'react';
import styles from './index.module.css';

export default function BannerDuplo() {
  return (
    <div className={styles.home__banner__side}>
      <div className={`${styles.banner__container} component__container`}>
        <h2 className={styles.title__bannerDuplo}>
          Título Fixo do Banner Duplo
        </h2>
        <div className={styles.banner__row}>
          <div className={styles.banner__item}>
            <a href="#">
              <img
                className={styles.banners__desktop}
                src="https://placehold.co/770x775"
                width="770"
                height="775"
                alt="Banner - Esquerdo"
              />
            </a>
          </div>

          <div className={styles.banner__item}>
            <a href="#">
              <img
                className={styles.banners__desktop}
                src="https://placehold.co/770x775"
                width="770"
                height="775"
                alt="Banner - Direito"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

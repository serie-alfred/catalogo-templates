'use client';

import React from 'react';
import styles from './index.module.css';

export default function BannerMain() {
  return (
    <section className={styles.homeBannerFull}>
      <div className={styles.contentBannerFull}>
        <a href="#">
          <img
            className={styles.bannerImage}
            src="/images/banner-main-top.jpg"
            loading="lazy"
            alt="Banner"
          />
        </a>
      </div>
    </section>
  );
}

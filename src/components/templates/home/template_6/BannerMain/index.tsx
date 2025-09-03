'use client';

import React from 'react';
import styles from './index.module.css';

export default function BannerFull() {
  return (
    <div className={styles.homeBannerFull}>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerWrapper}>
          <a href="https://exemplo.com">
            <img
              alt="Banner Desktop"
              className={`${styles.bannerDesktop} lazy`}
              src="https://placehold.co/1920x400"
              data-src="https://placehold.co/1920x400"
              data-srcset="https://placehold.co/1920x400"
              width="1860"
              height="574"
            />

            <img
              alt="Banner Mobile"
              className={`${styles.bannerMobile} lazy`}
              src="https://placehold.co/600x300"
              data-src="https://placehold.co/600x300"
              data-srcset="https://placehold.co/600x300"
              width="450"
              height="139"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

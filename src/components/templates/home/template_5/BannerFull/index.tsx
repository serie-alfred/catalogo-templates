'use client';

import React from 'react';
import styles from './index.module.css';

export default function BannerFull() {
  return (
    <section className={styles.homeBannerFull} data-role="bf-root">
      <div className={styles.contentBannerFull}>
        <a href="#">
          <img
            alt="Título do Banner Desktop"
            className={styles.bannerDesktop}
            data-role="bf-img-desktop"
            src="https://placehold.co/1920x640"
            width="1920"
            height="640"
          />

          <img
            alt="Título do Banner Mobile"
            className={styles.bannerMobile}
            data-role="bf-img-mobile"
            src="https://placehold.co/390x640"
            width="390"
            height="640"
          />
        </a>
      </div>
    </section>
  );
}

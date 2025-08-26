import React from 'react';
import styles from './index.module.css';

export default function BannerFull() {
  return (
    <div className={styles.homeBannerFull}>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerWrapper}>
          <a href="https://meusite.com/promocao">
            <img
              alt="Banner Desktop"
              className={`${styles.bannerDesktop} lazy`}
              src="https://placehold.co/1920x647"
              width="1920"
              height="647"
            />

            <img
              alt="Banner Mobile"
              className={`${styles.bannerMobile} lazy`}
              src="https://placehold.co/390x647"
              width="390"
              height="647"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

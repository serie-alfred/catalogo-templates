import React from 'react';
import styles from './index.module.css';

export default function BannerTriple() {
  return (
    <section className={`${styles.bannerColumnContainer} component__container`} data-role="btr-root">
      <div className={styles.bannerColumn}>
        <div className={styles.banner} data-role="btr-banner">
          <img src="https://placehold.co/400x180" alt="banner 1" data-role="btr-img" />
        </div>
        <div className={styles.banner} data-role="btr-banner">
          <img src="https://placehold.co/400x180" alt="banner 2" data-role="btr-img" />
        </div>
        <div className={styles.banner} data-role="btr-banner">
          <img src="https://placehold.co/400x180" alt="banner 3" data-role="btr-img" />
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import styles from './index.module.css';

export default function BannerTriple() {
  return (
    <section className={`${styles.bannerColumnContainer} component__container`}>
      <div className={styles.bannerColumn}>
        <div className={styles.banner}>
          <img src="https://placehold.co/400x180" alt="banner 1" />
        </div>
        <div className={styles.banner}>
          <img src="https://placehold.co/400x180" alt="banner 2" />
        </div>
        <div className={styles.banner}>
          <img src="https://placehold.co/400x180" alt="banner 3" />
        </div>
      </div>
    </section>
  );
}

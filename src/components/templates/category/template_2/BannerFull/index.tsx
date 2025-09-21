import React from 'react';
import styles from './index.module.css';

const CategoryBanner = () => {
  return (
    <div className={styles.bannerFull}>
      <div className={styles.categoryBannerDesktop}>
        <img
          src="https://placehold.co/1920x450"
          alt="Banner para desktop"
          rel="preload"
          fetchPriority="high"
        />
      </div>

      <div className={styles.categoryBannerMobile}>
        <img
          src="https://placehold.co/1920x450"
          alt="Banner para mobile"
          rel="preload"
          fetchPriority="high"
        />
      </div>
    </div>
  );
};

export default CategoryBanner;

import React from 'react';
import styles from './index.module.css';

export default function ProductBanner() {
  return (
    <div className={styles.productBanner} data-role="bt-root">
      <div className={`${styles.bannerContainer} component__container`}>
        <div className={styles.bannerRow}>
          <div className={styles.bannerWrapper} data-role="bt-banner">
            <img
              data-role="bt-img"
              src="https://placehold.co/1377x136"
              alt="Banner para desktop"
              rel="preload"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import styles from './index.module.css';

export default function BannerSide() {
  return (
    <div className={styles.bannerSide}>
      <h2>Títulos dos Banners</h2>

      <div className={`${styles.bannerContainer} component__container`}>
        <div className={styles.bannerRow}>
          <div className={styles.bannerItem}>
            <a href="#">
              <img
                className="banners__desktop"
                src="https://placehold.co/676x676"
                width="676"
                height="676"
                alt="Banner - Esquerdo"
              />
            </a>
          </div>

          <div className={styles.bannerItem}>
            <a href="#">
              <img
                className="banners__desktop"
                src="https://placehold.co/676x676"
                width="676"
                height="676"
                alt="Banner - Direito"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

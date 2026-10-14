import React from 'react';
import styles from './index.module.css';

const HomeBanner = () => {
  return (
    <div className={styles.homeBannerSide} data-role="banner-side">
      <div className={styles.bannerContainer}>
        <div className={styles.bannerRow}>
          <div className={styles.sectionText}>
            <div className={styles.textContent}>
              <h2 data-role="banner-side-title">
                Lorem ipsum dolor sit amet consectetur. Quisque massa vel quis.
              </h2>
              <span data-role="banner-side-text">
                Lorem ipsum dolor sit amet consectetur. Senectus sagittis
                maecenas imperdiet lorem blandit diam arcu morbi. Sed
                scelerisque turpis massa est amet. Ut integer sit habitasse
                nullam donec sagittis condimentum vestibulum felis. Maecenas
                vulputate aliquet aliquam.
              </span>
            </div>
          </div>
          <div className={styles.bannerItem} data-role="banner-side-image">
            <a href="#">
              <img
                src="https://placehold.co/960x700"
                width="960"
                height="700"
                alt="Banner"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;

import React from 'react';
import styles from './index.module.css';

const data = {
  leftLink: '#',
  leftImg: 'https://placehold.co/915x360',
  leftTitle: 'placehold',
  rightLink: '#',
  rightImg: 'https://placehold.co/915x360',
  rightTitle: 'placehold',
};

export default function BannerSide() {
  return (
    <div className={styles.homeBannerSide}>
      <div className={`${styles.bannerContainer} component__container`}>
        <div className={`${styles.bannerRow} component__row`}>
          <div className={styles.bannerItem}>
            <a href={data.leftLink}>
              <img
                className={`${styles.lazy} ${styles.bannersDesktop}`}
                src={data.leftImg}
                data-src={data.leftImg}
                data-srcset={data.leftImg}
                width="915"
                height="360"
                loading="lazy"
                alt={`Banner - ${data.leftTitle}`}
              />
            </a>
          </div>

          <div className={styles.bannerItem}>
            <a href={data.rightLink}>
              <img
                className={`${styles.lazy} ${styles.bannersDesktop}`}
                src={data.leftImg}
                data-src={data.rightImg}
                data-srcset={data.rightImg}
                width="915"
                height="360"
                loading="lazy"
                alt={`Banner - ${data.rightTitle}`}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

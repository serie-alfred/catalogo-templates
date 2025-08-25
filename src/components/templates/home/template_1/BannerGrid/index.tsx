import React from 'react';
import styles from './index.module.css';

const banners = [
  {
    position: 1,
    title: 'Banner Principal',
    link: '/promo-principal',
    img: 'https://placehold.co/702x668',
  },
  {
    position: 2,
    title: 'Banner Lateral 1',
    link: '/promo-lateral-1',
    img: 'https://placehold.co/330x330',
  },
  {
    position: 3,
    title: 'Banner Lateral 2',
    link: '/promo-lateral-2',
    img: 'https://placehold.co/330x330',
  },
  {
    position: 4,
    title: 'Banner Lateral 3',
    link: '/promo-lateral-3',
    img: 'https://placehold.co/330x330',
  },
  {
    position: 5,
    title: 'Banner Lateral 4',
    link: '/promo-lateral-4',
    img: 'https://placehold.co/330x330',
  },
];

export default function BannersGrid() {
  return (
    <div className={styles.homeBannerGrid}>
      <div className={`${styles.bannerContainer} component__container`}>
        <div className={`${styles.bannerRow} component__row`}>
          <div className={styles.bannerTitle}>
            <h2>Nossas Ofertas</h2>
          </div>

          <div className={styles.bannerWrapper}>
            {/* Banner principal (position === 1) */}
            <div className={styles.bannerLeft}>
              {banners
                .filter(banner => banner.position === 1)
                .map((banner, index) => (
                  <div key={index} className={styles.bannerItem}>
                    <a href={banner.link}>
                      <img
                        src={banner.img}
                        alt={banner.title}
                        width="926"
                        height="881"
                      />
                    </a>
                  </div>
                ))}
            </div>

            {/* Banners secundários (position !== 1) */}
            <div className={styles.bannerRight}>
              {banners
                .filter(banner => banner.position !== 1)
                .map((banner, index) => (
                  <div key={index} className={styles.bannerItem}>
                    <a href={banner.link}>
                      <img
                        src={banner.img}
                        alt={banner.title}
                        width="459"
                        height="459"
                      />
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

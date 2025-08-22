'use client';
import React from 'react';
import styles from './index.module.css';

const slidesDesktop = [
  {
    link: '#',
    target: '_blank',
    image: 'https://placehold.co/1920x400',
    label: 'Banner Desktop',
    width: 1200,
    height: 400,
  },
];

const slidesMobile = [
  {
    link: '#',
    target: '_blank',
    image: 'https://placehold.co/600x300',
    label: 'Banner Mobile',
    width: 600,
    height: 300,
  },
];

export default function BannerMain() {
  const hasDesktopBanner = true;
  const hasMobileBanner = true;

  return (
    <div className={styles.home__banner__main}>
      {/* Banner Desktop */}
      {hasDesktopBanner && (
        <div className={`${styles.banner__home}`}>
          <div className={`${styles.desktop}`}>
            <div className={styles.bannerMain}>
              <div
                className={`${styles.swiper} ${styles.swiperBannerFullHome}`}
              >
                <div className={`${styles.swiperWrapper}`}>
                  {slidesDesktop.map((slide, index) => (
                    <div key={index} className="swiper-slide">
                      <a href={slide.link} target={slide.target}>
                        <img
                          src={slide.image}
                          alt={slide.label}
                          width={slide.width}
                          height={slide.height}
                          fetchPriority="high"
                        />
                      </a>
                    </div>
                  ))}
                </div>

                <div
                  className={`${styles.swiperBannerPagination} ${styles.swiperPaginationClickable} ${styles.swiperPaginationBullets} ${styles.swiperPaginationHorizontal}  `}
                >
                  <span
                    className={`${styles.swiperPaginationBullet} ${styles.swiperPaginationBulletActive}  `}
                    role="button"
                    aria-label="Go to slide 1"
                    aria-current="true"
                  ></span>
                  <span
                    className={`${styles.swiperPaginationBullet}  `}
                    role="button"
                    aria-label="Go to slide 2"
                  ></span>
                </div>

                <div className={styles.swiperBannerButtonPrev}>
                  <svg
                    fill="none"
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 8L10 12L14 16"
                      stroke="#682A77"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                <div className={styles.swiperBannerButtonNext}>
                  <svg
                    fill="none"
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 16L14 12L10 8"
                      stroke="#682A77"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner Mobile */}
      {hasMobileBanner && (
        <div className={`${styles.banner__home}`}>
          <div className={`${styles.mobile}`}>
            <div className={styles.bannerMainMobile}>
              <div
                className={`${styles.swiper} ${styles.swiperBannerFullHomeMobile}`}
              >
                <div className={`${styles.swiperWrapper}`}>
                  {slidesMobile.map((slide, index) => (
                    <div key={index} className="swiper-slide">
                      <a href={slide.link} target={slide.target}>
                        <img
                          src={slide.image}
                          alt={slide.label}
                          width={slide.width}
                          height={slide.height}
                          fetchPriority="high"
                        />
                      </a>
                    </div>
                  ))}
                </div>

                <div
                  className={`${styles.swiperBannerPagination} ${styles.swiperPaginationClickable} ${styles.swiperPaginationBullets} ${styles.swiperPaginationHorizontal}  `}
                >
                  <span
                    className={`${styles.swiperPaginationBullet} ${styles.swiperPaginationBulletActive}  `}
                    role="button"
                    aria-label="Go to slide 1"
                    aria-current="true"
                  ></span>
                  <span
                    className={`${styles.swiperPaginationBullet}  `}
                    role="button"
                    aria-label="Go to slide 2"
                  ></span>
                </div>

                <div className={styles.swiperBannerButtonNext}>
                  <svg
                    fill="none"
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 16L14 12L10 8"
                      stroke="#141414"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

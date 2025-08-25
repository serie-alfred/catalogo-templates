import React from 'react';
import styles from './index.module.css';

interface BannerFullProps {
  active?: boolean;
  link?: string;
  title?: string;
  img?: string;
  imgMobile?: string;
}

export default function BannerFull({
  active = true,
  link = '#',
  title = 'Banner Full',
  img = 'https://placehold.co/1296x400',
}: BannerFullProps) {
  if (!active) return null;

  return (
    <div className={styles.homeBannerFull}>
      <div className={`${styles.bannerContainer} component__container`}>
        <div className={styles.bannerWrapper}>
          <a href={link}>
            <img
              alt={title}
              src={img}
              data-src={img}
              data-srcset={`${img} 1296w`}
              sizes="(max-width: 768px) 450px, 100vw"
              width={1860}
              height={574}
            />
          </a>
        </div>
      </div>
    </div>
  );
}

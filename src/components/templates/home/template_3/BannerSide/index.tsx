'use client';

import React from 'react';
import styles from './index.module.css';

export default function BannerSide() {
  return (
    <div className={styles.bannerSideSolo}>
      <div className={styles.bannerContainer}>
        <div className={styles.bannerRow}>
          <div className={styles.textItem}>
            <div className={styles.textContent}>
              <h2>Lorem ipsum dolor sit amet consectetur. Tempus tincidunt.</h2>
              <span>
                Lorem ipsum dolor sit amet consectetur. Commodo viverra et
                consectetur faucibus aliquam ornare neque. Mauris pretium a
                pretium sed vulputate id posuere a volutpat. Arcu lorem ipsum
                amet semper facilisis sit vitae semper consequat. Ipsum vel
                purus integer.
              </span>
            </div>
          </div>

          <div className={styles.bannerItem}>
            <a href="#">
              <img
                className={styles.bannerDesktop}
                src="https://placehold.co/960x700"
                width="960"
                height="700"
                alt="Banner - Right"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import styles from './index.module.css';

export default function SoloBannerWithLink() {
  return (
    <section className={styles.homeCollection} data-role="bl-root">
      <div className={styles.collectionContent}>
        <div className={styles.gridImage}>
          <div className={styles.bannerImageText}>
            <a href="#">
              <img
                className={styles.bannerImage}
                data-role="bl-img"
                src="https://placehold.co/500x529"
                loading="lazy"
                alt="Banner"
              />
            </a>
            <div className={styles.bannerText}>
              <h2 data-role="bl-title">ÖAK Style collection</h2>
              <span data-role="bl-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit
                maecenas volutpat. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Blandit maecenas volutpat.
              </span>
              <a href="#" className={styles.bannerButton} data-role="bl-cta">
                Ver Coleção
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

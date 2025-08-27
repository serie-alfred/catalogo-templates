'use client';

import React from 'react';
import styles from './index.module.css';

export default function SoloBannerWithLink() {
  return (
    <section className={styles.homeCollection}>
      <div className={styles.collectionContent}>
        <div className={styles.gridImage}>
          <div className={styles.bannerImageText}>
            <a href="#">
              <img
                className={styles.bannerImage}
                src="https://placehold.co/500x529"
                loading="lazy"
                alt="Banner"
              />
            </a>
            <div className={styles.bannerText}>
              <h2>ÖAK Style collection</h2>
              <span>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit
                maecenas volutpat. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Blandit maecenas volutpat.
              </span>
              <a href="#" className={styles.bannerButton}>
                Ver Coleção
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

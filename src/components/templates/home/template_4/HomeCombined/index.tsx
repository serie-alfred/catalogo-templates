'use client';

import React from 'react';
import styles from './index.module.css';

export default function HomeCombined() {
  return (
    <section className={styles.homeCombined}>
      <div className={`${styles.rowAlignwide} component__container`}>
        <div className={styles.rowContent}>
          {/* Texto */}
          <div className={styles.columnText}>
            <h2 className={styles.heading}>
              Exquisite design combined with functionalities
            </h2>
            <p className={styles.text}>
              Pellentesque ullamcorper dignissim condimentum volutpat consequat
              mauris nunc lacinia quis.
            </p>

            <div className={styles.avatars}>
              <img
                src="https://startersites.io/blocksy/furniture/wp-content/uploads/2024/05/home-avatar-1.webp"
                alt="Avatar 1"
                width="30"
                height="48"
              />
              <img
                src="https://startersites.io/blocksy/furniture/wp-content/uploads/2024/05/home-avatar-2.webp"
                alt="Avatar 2"
                width="30"
                height="48"
              />
              <img
                src="https://startersites.io/blocksy/furniture/wp-content/uploads/2024/05/home-avatar-3.webp"
                alt="Avatar 3"
                width="30"
                height="48"
              />
              <p className={styles.contactExpert}>Contact with our expert</p>
            </div>

            <div className={styles.buttonWrapper}>
              <a
                className={styles.button}
                href="https://startersites.io/blocksy/furniture/shop/"
                rel="noopener"
              >
                Shop Now
              </a>
            </div>
          </div>

          {/* Imagens e Desconto */}
          <div className={styles.columnImage}>
            <div className={styles.productVertical}>
              <a href="/">
                <img
                  className={styles.banner}
                  src="https://placehold.co/290x516"
                  alt="Banner 1"
                  loading="lazy"
                />
              </a>
            </div>

            <div className={styles.containerProduct}>
              <div className={styles.productHorizontal}>
                <a href="/">
                  <img
                    className={styles.banner}
                    src="https://placehold.co/311x309"
                    alt="Banner 2"
                    loading="lazy"
                  />
                </a>
              </div>

              <div className={styles.discount}>
                <h3 className={styles.discountTitle}>25% OFF</h3>
                <p className={styles.discountText}>
                  Donec ac odio tempor dapibus.
                </p>
                <a
                  className={styles.button}
                  href="https://startersites.io/blocksy/furniture/shop/"
                  rel="noopener"
                >
                  Explore Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

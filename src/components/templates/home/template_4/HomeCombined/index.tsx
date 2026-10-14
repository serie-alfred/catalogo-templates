'use client';

import React from 'react';
import styles from './index.module.css';

export default function HomeCombined() {
  return (
    <section className={styles.homeCombined} data-role="hc-root">
      <div className={`${styles.rowAlignwide} component__container`}>
        <div className={styles.rowContent}>
          {/* Texto */}
          <div className={styles.columnText}>
            <h2 className={styles.heading} data-role="hc-title">
              Exquisite design combined with functionalities
            </h2>
            <p className={styles.text} data-role="hc-text">
              Pellentesque ullamcorper dignissim condimentum volutpat consequat
              mauris nunc lacinia quis.
            </p>

            <div className={styles.avatars} data-role="hc-avatars">
              <img data-role="hc-avatar"
                src="https://startersites.io/blocksy/furniture/wp-content/uploads/2024/05/home-avatar-1.webp"
                alt="Avatar 1"
                width="30"
                height="48"
              />
              <img data-role="hc-avatar"
                src="https://startersites.io/blocksy/furniture/wp-content/uploads/2024/05/home-avatar-2.webp"
                alt="Avatar 2"
                width="30"
                height="48"
              />
              <img data-role="hc-avatar"
                src="https://startersites.io/blocksy/furniture/wp-content/uploads/2024/05/home-avatar-3.webp"
                alt="Avatar 3"
                width="30"
                height="48"
              />
              <p className={styles.contactExpert} data-role="hc-avatars-text">Contact with our expert</p>
            </div>

            <div className={styles.buttonWrapper}>
              <a
                className={styles.button}
                href="https://startersites.io/blocksy/furniture/shop/"
                rel="noopener"
                data-role="hc-cta"
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
                  data-role="hc-banner"
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
                    data-role="hc-banner"
                    src="https://placehold.co/311x309"
                    alt="Banner 2"
                    loading="lazy"
                  />
                </a>
              </div>

              <div className={styles.discount} data-role="hc-discount">
                <h3 className={styles.discountTitle} data-role="hc-discount-title">25% OFF</h3>
                <p className={styles.discountText} data-role="hc-discount-text">
                  Donec ac odio tempor dapibus.
                </p>
                <a
                  className={styles.button}
                  href="https://startersites.io/blocksy/furniture/shop/"
                  rel="noopener"
                  data-role="hc-discount-cta"
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

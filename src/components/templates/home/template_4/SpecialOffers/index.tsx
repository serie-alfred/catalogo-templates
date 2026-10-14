'use client';

import React from 'react';
import styles from './index.module.css';

export default function SpecialOffers() {
  return (
    <section className={styles.specialoffersContainer} data-role="so-root">
      <div className={`${styles.specialoffersContent} component__container`}>
        <div className={styles.specialText}>
          <div className={styles.titleOffers}>
            <h3 data-role="so-title">Special Offers</h3>
            <p data-role="so-text">
              Quam elementum pulvinar etiam non quam tincidunt eget nullam non.
            </p>
          </div>
          <div className={styles.actOffers}>
            <a href="/" data-role="so-cta">
              Ver Todos
              <svg
                fill="none"
                height="10"
                viewBox="0 0 12 10"
                width="12"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.6666 5.00033H1.33331"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.33331 8.33333L10.6666 5"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.33331 1.66699L10.6666 5.00033"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Ofertas */}
        <div className={styles.specialContent}>
          {/* Card 1 */}
          <div className={`${styles.specialContainer} ${styles.green}`} data-role="so-card">
            <div className={styles.containerImage}>
              <div className={styles.image}>
                <img data-role="so-card-image"
                  src="https://placehold.co/400x600"
                  alt="Special Discount"
                  width="400"
                  height="600"
                  loading="lazy"
                />
              </div>
            </div>
            <div className={styles.containerText}>
              <h3 data-role="so-card-title">Special Discount</h3>
              <h4 data-role="so-card-discount">30% OFF</h4>
              <p data-role="so-card-text">Aproveite descontos especiais em itens selecionados.</p>
              <a className={styles.button} href="/">
                <div className={styles.buttonWrapper} data-role="so-card-button">Browse Now</div>
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className={`${styles.specialContainer} ${styles.salmao}`} data-role="so-card">
            <div className={styles.containerImage}>
              <div className={styles.image}>
                <img data-role="so-card-image"
                  src="https://placehold.co/400x600"
                  alt="Weekly Discount"
                  width="400"
                  height="600"
                  loading="lazy"
                />
              </div>
            </div>
            <div className={styles.containerText}>
              <h3 data-role="so-card-title">Weekly Discount</h3>
              <h4 data-role="so-card-discount">40% OFF</h4>
              <p data-role="so-card-text">Ofertas semanais para você renovar seu carrinho.</p>
              <a className={styles.button} href="/">
                <div className={styles.buttonWrapper} data-role="so-card-button">Browse Now</div>
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className={`${styles.specialContainer} ${styles.grey}`} data-role="so-card">
            <div className={styles.containerImage}>
              <div className={styles.image}>
                <img data-role="so-card-image"
                  src="https://placehold.co/400x600"
                  alt="Birthday Discount"
                  width="400"
                  height="600"
                  loading="lazy"
                />
              </div>
            </div>
            <div className={styles.containerText}>
              <h3 data-role="so-card-title">Birthday Discount</h3>
              <h4 data-role="so-card-discount">50% OFF</h4>
              <p data-role="so-card-text">Celebre com a gente e ganhe um super desconto.</p>
              <a className={styles.button} href="/">
                <div className={styles.buttonWrapper} data-role="so-card-button">Browse Now</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

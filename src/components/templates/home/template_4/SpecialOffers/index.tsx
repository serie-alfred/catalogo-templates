'use client';

import React from 'react';
import styles from './index.module.css';

export default function SpecialOffers() {
  return (
    <section className={styles.specialoffersContainer}>
      <div className={`${styles.specialoffersContent} component__container`}>
        <div className={styles.specialText}>
          <div className={styles.titleOffers}>
            <h3>Special Offers</h3>
            <p>
              Quam elementum pulvinar etiam non quam tincidunt eget nullam non.
            </p>
          </div>
          <div className={styles.actOffers}>
            <a href="/">
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
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.33331 8.33333L10.6666 5"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.33331 1.66699L10.6666 5.00033"
                  stroke="white"
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
          <div className={`${styles.specialContainer} ${styles.green}`}>
            <div className={styles.containerImage}>
              <div className={styles.image}>
                <img
                  src="/images/special1.jpg"
                  alt="Special Discount"
                  height="600"
                  loading="lazy"
                />
              </div>
            </div>
            <div className={styles.containerText}>
              <h3>Special Discount</h3>
              <h4>30% OFF</h4>
              <p>Aproveite descontos especiais em itens selecionados.</p>
              <a className={styles.button} href="/">
                <div className={styles.buttonWrapper}>Browse Now</div>
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className={`${styles.specialContainer} ${styles.salmao}`}>
            <div className={styles.containerImage}>
              <div className={styles.image}>
                <img
                  src="/images/special2.jpg"
                  alt="Weekly Discount"
                  height="600"
                  loading="lazy"
                />
              </div>
            </div>
            <div className={styles.containerText}>
              <h3>Weekly Discount</h3>
              <h4>40% OFF</h4>
              <p>Ofertas semanais para você renovar seu carrinho.</p>
              <a className={styles.button} href="/">
                <div className={styles.buttonWrapper}>Browse Now</div>
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className={`${styles.specialContainer} ${styles.grey}`}>
            <div className={styles.containerImage}>
              <div className={styles.image}>
                <img
                  src="/images/special3.jpg"
                  alt="Birthday Discount"
                  height="600"
                  loading="lazy"
                />
              </div>
            </div>
            <div className={styles.containerText}>
              <h3>Birthday Discount</h3>
              <h4>50% OFF</h4>
              <p>Celebre com a gente e ganhe um super desconto.</p>
              <a className={styles.button} href="/">
                <div className={styles.buttonWrapper}>Browse Now</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

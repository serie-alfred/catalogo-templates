'use client';
import React from 'react';
import styles from './index.module.css';

export default function RulerFooter() {
  return (
    <section className={styles.rulerFooter}>
      <div className={`${styles.rulerContainer} component__container`}>
        <div className={styles.rulerContent}>
          <a href="#">
            <img
              alt="Título 1"
              decoding="async"
              src="https://placehold.co/300x77"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              height="50"
              width="306"
            />
          </a>
        </div>

        <div className={styles.rulerContent}>
          <a href="#">
            <img
              alt="Título 2"
              decoding="async"
              height="50"
              src="https://placehold.co/300x77"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              width="306"
            />
          </a>
        </div>

        <div className={styles.rulerContent}>
          <a href="#">
            <img
              alt="Título 3"
              decoding="async"
              height="50"
              src="https://placehold.co/300x77"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              width="194"
            />
          </a>
        </div>

        <div className={styles.rulerContent}>
          <a href="#">
            <img
              alt="Título 4"
              decoding="async"
              height="50"
              loading="lazy"
              src="https://placehold.co/300x77"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              width="196"
            />
          </a>
        </div>

        <div className={styles.rulerContent}>
          <a href="#">
            <img
              alt="Título 5"
              decoding="async"
              height="50"
              loading="lazy"
              src="https://placehold.co/300x77"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              width="223"
            />
          </a>
        </div>

        <div className={styles.rulerContent}>
          <a href="#">
            <img
              alt="Título 6"
              decoding="async"
              height="50"
              loading="lazy"
              src="https://placehold.co/300x77"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              width="215"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

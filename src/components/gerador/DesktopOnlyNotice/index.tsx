'use client';
import React from 'react';
import styles from './index.module.css';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function DesktopOnlyNotice() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.svgContainer}>
          <DotLottieReact src="/icons/error-cone.lottie" loop autoplay />
        </div>
        <h1 className={styles.title}>Melhor em telas maiores</h1>
        <p className={styles.text}>
          Para aproveitar todos os recursos, acesse pelo seu{' '}
          <strong>computador ou tablet</strong>. Estamos trabalhando para
          otimizar a experiência mobile em breve!
        </p>
      </div>
    </div>
  );
}

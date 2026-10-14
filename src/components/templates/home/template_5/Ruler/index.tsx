'use client';
import React from 'react';
import styles from './index.module.css';

export default function Ruler() {
  return (
    <section className={styles.homeRuler} data-role="rl-root">
      <div className={`${styles.rulerContainer} component__container`}>
        <div className={`${styles.swiper}`}>
          <div className={styles.swiper__wrapper}>
            <div className={`${styles.swiper__slide} ${styles.rulerItem}`} data-role="rl-item">
              <p data-role="rl-title">
                Frete Grátis
                <br />
                <span data-role="rl-desc">para compras acima de R$199</span>
              </p>
            </div>

            <div className={`${styles.swiper__slide} ${styles.rulerItem}`} data-role="rl-item">
              <p data-role="rl-title">
                Até 10x sem juros
                <br />
                <span data-role="rl-desc">em todos os cartões</span>
              </p>
            </div>

            <div className={`${styles.swiper__slide} ${styles.rulerItem}`} data-role="rl-item">
              <p data-role="rl-title">
                Primeira troca grátis
                <br />
                <span data-role="rl-desc">sem complicação</span>
              </p>
            </div>

            <div className={`${styles.swiper__slide} ${styles.rulerItem}`} data-role="rl-item">
              <p data-role="rl-title">
                Suporte 24h
                <br />
                <span data-role="rl-desc">via WhatsApp</span>
              </p>
            </div>
          </div>

          {/* Botões de navegação */}

          <div className={styles.swiperButtonPrevRuler}></div>
          <div className={styles.swiperButtonNextRuler}></div>
        </div>
      </div>
    </section>
  );
}

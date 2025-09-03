'use client';
import React from 'react';
import styles from './index.module.css';

export default function Ruler() {
  return (
    <section className={styles.homeRuler}>
      <div className={`${styles.rulerContainer} component__container`}>
        <div className={`${styles.swiper}`}>
          <div className={styles.swiper__wrapper}>
            <div className={`${styles.swiper__slide} ${styles.rulerItem}`}>
              <p>
                Frete Grátis
                <br />
                <span>para compras acima de R$199</span>
              </p>
            </div>

            <div className={`${styles.swiper__slide} ${styles.rulerItem}`}>
              <p>
                Até 10x sem juros
                <br />
                <span>em todos os cartões</span>
              </p>
            </div>

            <div className={`${styles.swiper__slide} ${styles.rulerItem}`}>
              <p>
                Primeira troca grátis
                <br />
                <span>sem complicação</span>
              </p>
            </div>

            <div className={`${styles.swiper__slide} ${styles.rulerItem}`}>
              <p>
                Suporte 24h
                <br />
                <span>via WhatsApp</span>
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

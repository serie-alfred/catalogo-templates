'use client';
import React from 'react';
import styles from './Ruler.module.css';

export default function Ruler() {
  return (
    <section className={styles.homeRuler}>
      <div className="component__container">
        <div className={`${styles.swiper} swiper`}>
          <div className="swiper-wrapper">
            <div className={`${styles.rulerItem} swiper-slide`}>
              <p>
                Frete Grátis
                <br />
                <span>para compras acima de R$199</span>
              </p>
            </div>

            <div className={`${styles.rulerItem} swiper-slide`}>
              <p>
                Até 10x sem juros
                <br />
                <span>em todos os cartões</span>
              </p>
            </div>

            <div className={`${styles.rulerItem} swiper-slide`}>
              <p>
                Primeira troca grátis
                <br />
                <span>sem complicação</span>
              </p>
            </div>

            <div className={`${styles.rulerItem} swiper-slide`}>
              <p>
                Suporte 24h
                <br />
                <span>via WhatsApp</span>
              </p>
            </div>
          </div>

          {/* Botões de navegação */}
          <div className="swiper-button-prev-ruler"></div>
          <div className="swiper-button-next-ruler"></div>
        </div>
      </div>
    </section>
  );
}

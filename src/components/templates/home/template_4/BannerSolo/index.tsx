'use client';

import React from 'react';
import styles from './index.module.css';

export default function BannerSolo() {
  return (
    <section className={styles.collectionSoloContainer} data-role="bs-root">
      <div className={`${styles.collectionContent} component__container`}>
        <div className={styles.bannerImageText}>
          <a href="#">
            <img data-role="bs-image"
              src="https://placehold.co/749x570"
              width="749"
              height="570"
              alt="Banner promocional"
              loading="lazy"
            />
          </a>
          <div className={styles.bannerText}>
            <div className={styles.containerBannerText}>
              <h2 data-role="bs-title">Título Fixo do Banner</h2>
              <p data-role="bs-text">
                Descrição fixa do banner para destacar a campanha ou produto.
              </p>
              <a href="https://meusite.com/produtos" data-role="bs-cta">
                <span>Ver Mais</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

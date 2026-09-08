import React from 'react';

import { catalogMock } from '@/mocks/catalogMock';
import type { CatalogItem } from '@/types/catalog';
import CatalogSwiper from '../CatalogSwiper';

import styles from './index.module.css';

export default function ThemeReleases() {
  const catalog: CatalogItem[] = catalogMock[0]?.novidade || [];

  return (
    <div className={styles.newsContainer}>
      <div className={styles.container}>
        <div className={styles.containerTitle}>
          <h3 className={styles.title}>Novos</h3>
          <span>Porem ipsum dolor sit amet, consectetur adipiscing elit.</span>
        </div>

        <div className={styles.containerSpots}>
          <CatalogSwiper items={catalog} />
        </div>
      </div>
    </div>
  );
}

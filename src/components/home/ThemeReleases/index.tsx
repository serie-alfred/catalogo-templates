import React from 'react';

import type { CatalogItem } from '@/types/catalog';
import CatalogSwiper from '../CatalogSwiper';

import styles from './index.module.css';

/** Os templates mais recentes (a home passa os `NOVIDADES` primeiros). */
export default function ThemeReleases({ items }: { items: CatalogItem[] }) {
  return (
    <div className={styles.newsContainer} data-home-novos="">
      <div className={styles.container}>
        <div className={styles.containerTitle}>
          <h2 className={styles.title}>Novos</h2>
          <span>Os templates completos mais recentes do catálogo.</span>
        </div>

        <div className={styles.containerSpots}>
          <CatalogSwiper items={items} />
        </div>
      </div>
    </div>
  );
}

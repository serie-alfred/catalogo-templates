'use client';

import React, { useState } from 'react';

import { catalogMock } from '@/mocks/catalogMock';
import { icons } from '../../../assets/icons/icons';

import Spot from '../Spot';

import type { CatalogItem } from '@/types/catalog';

import styles from './index.module.css';

export default function CatalogSpots() {
  const [search, setSearch] = useState('');
  const catalog = catalogMock[0]?.catalogo || [];

  const filteredCatalog: CatalogItem[] = catalog.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.catalogoContainer}>
      <div className={styles.container}>
        <div className={styles.infoTitle}>
          <h3>Descubra diversos templates</h3>
          <span>Porem ipsum dolor sit amet, consectetur adipiscing elit. </span>
        </div>

        <div className={styles.search}>
          <div className={styles.searchInputContainer}>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Buscar modelo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {icons.MagnifierIcon}
          </div>
          <span>{filteredCatalog.length} templates</span>
        </div>

        <div className={styles.containerCatalogo}>
          <div className={styles.containerSpots}>
            {filteredCatalog.map(item => (
              <Spot key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

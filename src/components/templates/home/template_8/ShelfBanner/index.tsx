import React from 'react';

import ProductShelf08 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfBanner08`: o núcleo das vitrines 08 com o banner ao lado (3 por vez). */
export default function ShelfBanner08() {
  return <ProductShelf08 variant="banner" styles={styles} />;
}

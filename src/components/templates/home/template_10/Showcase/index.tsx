import React from 'react';

import ProductShelf10 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfCustom10`: o núcleo das vitrines 10, variante `full`, com o mock de lá. */
export default function Showcase10() {
  return (
    <ProductShelf10
      variant="full"
      styles={styles}
      title="Ofertas do dia"
      viewAllLabel="Ver todas"
      viewAllUrl="#"
    />
  );
}

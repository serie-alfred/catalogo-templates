import React from 'react';

import ProductShelf13 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfCustom13`: o núcleo das vitrines 13, variante `full`, com o mock de lá. */
export default function Showcase13() {
  return (
    <ProductShelf13
      variant="full"
      styles={styles}
      title="Mais vendidos"
      viewAllLabel="Ver todos"
      viewAllUrl="#"
      tagLabel="Drop 07"
    />
  );
}

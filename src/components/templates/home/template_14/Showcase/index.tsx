import React from 'react';

import ProductShelf14 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfCustom14`: o núcleo das vitrines 14, variante `full`, com o mock de lá. */
export default function Showcase14() {
  return (
    <ProductShelf14
      variant="full"
      styles={styles}
      title="Mais vendidos da semana"
      viewAllLabel="Ver todos"
      viewAllUrl="#"
      tagLabel="Top da semana"
    />
  );
}

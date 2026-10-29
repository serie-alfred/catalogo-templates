import React from 'react';

import ProductShelf15 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfCustom15`: o núcleo das vitrines 15, variante `full`, com o mock de lá. */
export default function Showcase15() {
  return (
    <ProductShelf15
      variant="full"
      styles={styles}
      eyebrow="Os mais desejados"
      title="Clássicos da"
      titleEmphasis="maison"
      viewAllLabel="Ver todos"
      viewAllUrl="#"
      tagLabel="Atelier"
    />
  );
}

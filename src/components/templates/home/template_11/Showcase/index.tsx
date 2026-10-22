import React from 'react';

import ProductShelf11 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfCustom11`: o núcleo das vitrines 11, variante `full`, com o mock de lá. */
export default function Showcase11() {
  return (
    <ProductShelf11
      variant="full"
      styles={styles}
      sectionNumber="02"
      title="Novidades"
      subtitle="Peças que chegaram este mês"
      viewAllLabel="Ver todos"
      viewAllUrl="#"
    />
  );
}

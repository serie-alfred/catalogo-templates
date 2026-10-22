import React from 'react';

import ProductShelf12 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfCustom12`: o núcleo das vitrines 12, variante `full`, com o mock de lá. */
export default function Showcase12() {
  return (
    <ProductShelf12
      variant="full"
      styles={styles}
      title="Queridinhos da semana"
      subtitle="Os produtos que mais entraram nas rotinas de quem compra aqui."
      viewAllLabel="Ver todos"
      viewAllUrl="#"
    />
  );
}

import React from 'react';

import ProductShelf09 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfCustom09`: o núcleo das vitrines 09, variante `full`, com o mock de lá. */
export default function Showcase09() {
  return (
    <ProductShelf09
      variant="full"
      styles={styles}
      title="Mais"
      titleEmphasis="desejados"
      subtitle="As peças que mais saíram nas últimas semanas."
      viewAllLabel="Ver tudo"
      viewAllUrl="#"
    />
  );
}

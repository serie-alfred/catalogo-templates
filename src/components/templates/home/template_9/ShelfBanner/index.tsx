import React from 'react';

import ProductShelf09 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfBanner09`: o núcleo das vitrines 09, variante `banner`, com o mock de lá (sem arte). */
export default function ShelfBanner09() {
  return (
    <ProductShelf09
      variant="banner"
      styles={styles}
      title="O look em"
      titleEmphasis="peças"
      banner={{
        eyebrow: 'Look 04',
        title: 'Compre o',
        titleEmphasis: 'look',
        ctaLabel: 'Ver o look completo',
        url: '#',
        imageAlt: 'Compre o look',
      }}
    />
  );
}

import React from 'react';

import ProductShelf11 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfBanner11`: o núcleo das vitrines 11, variante `banner`, com o mock de lá (sem arte). */
export default function ShelfBanner11() {
  return (
    <ProductShelf11
      variant="banner"
      styles={styles}
      sectionNumber="04"
      title="Escritório"
      viewAllLabel="Ver todos"
      viewAllUrl="#"
      banner={{
        eyebrow: '[Ambiente]',
        title: 'Escritório em aço e freijó.',
        ctaLabel: 'Ver o ambiente',
        url: '#',
        imageAlt: 'Escritório em aço e freijó',
      }}
    />
  );
}

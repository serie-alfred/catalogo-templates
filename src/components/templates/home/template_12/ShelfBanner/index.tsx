import React from 'react';

import ProductShelf12 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfBanner12`: o núcleo das vitrines 12, variante `banner`, com o mock de lá (sem arte). */
export default function ShelfBanner12() {
  return (
    <ProductShelf12
      variant="banner"
      styles={styles}
      title="Para a sua rotina da noite"
      viewAllLabel="Ver todos"
      viewAllUrl="#"
      banner={{
        eyebrow: 'Kit da vez',
        title: 'Kit Rotina Noturna',
        text: 'Gel de limpeza, sérum e hidratante em três passos.',
        ctaLabel: 'Conhecer o kit',
        url: '#',
        imageAlt: 'Kit Rotina Noturna',
      }}
    />
  );
}

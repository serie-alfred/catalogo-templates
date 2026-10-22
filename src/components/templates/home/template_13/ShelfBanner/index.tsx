import React from 'react';

import ProductShelf13 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner13`: o núcleo das vitrines 13, variante `banner`, com o
 * mock de lá (sem arte: vale o grafite de placeholder; sem rótulo nos cards; sem "Ver todos",
 * o CTA do banner faz esse papel).
 */
export default function ShelfBanner13() {
  return (
    <ProductShelf13
      variant="banner"
      styles={styles}
      title="Essenciais do drop"
      banner={{
        eyebrow: 'Drop 07',
        title: 'Feito pra rodar à noite',
        text: 'Refletivos 360°, nylon que corta o vento e bolsos que fecham.',
        ctaLabel: 'Ver tudo',
        url: '#',
        imageAlt: 'Feito pra rodar à noite',
      }}
    />
  );
}

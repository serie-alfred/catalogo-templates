import React from 'react';

import ProductShelf14 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner14`: o núcleo das vitrines 14, variante `banner`, com o
 * mock de lá (sem arte: vale o placeholder; sem rótulo nos cards; sem "Ver todos", o link do
 * banner faz esse papel).
 */
export default function ShelfBanner14() {
  return (
    <ProductShelf14
      variant="banner"
      styles={styles}
      title="Monte seu kit de treino"
      banner={{
        eyebrow: 'Guia de treino',
        title: 'Kit academia completo',
        text: 'Proteína, hidratação e mochila para o pós-treino.',
        ctaLabel: 'Ver o kit',
        url: '#',
        imageAlt: 'Kit academia completo',
      }}
    />
  );
}

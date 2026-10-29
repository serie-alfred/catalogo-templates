import React from 'react';

import ProductShelf16 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner16`: o núcleo das vitrines 16, variante `banner`, com o
 * mock de lá (sem arte: vale o placeholder; sem rótulo nos cards; sem "Ver todos", o botão do
 * banner faz esse papel).
 */
export default function ShelfBanner16() {
  return (
    <ProductShelf16
      variant="banner"
      styles={styles}
      title="Pequenos leitores"
      banner={{
        title: 'Histórias pra ler juntinho',
        text: 'Livros cartonados, de banho e de pano para os primeiros anos.',
        ctaLabel: 'Ver livros',
        url: '#',
        imageAlt: 'Histórias pra ler juntinho',
      }}
    />
  );
}

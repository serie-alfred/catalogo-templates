import React from 'react';

import ProductShelf15 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner15`: o núcleo das vitrines 15, variante `banner`, com o
 * mock de lá (sem arte: vale o escuro de placeholder; sem rótulo nos cards; sem "Ver todos",
 * o link do banner faz esse papel).
 */
export default function ShelfBanner15() {
  return (
    <ProductShelf15
      variant="banner"
      styles={styles}
      eyebrow="Perfumaria"
      title="A arte da"
      titleEmphasis="fragrância"
      banner={{
        eyebrow: 'Ambre Nuit',
        title: 'Âmbar, baunilha e',
        titleEmphasis: 'madeiras raras',
        text: 'Uma assinatura olfativa para as noites que pedem presença.',
        ctaLabel: 'Ver a linha',
        url: '#',
        imageAlt: 'Ambre Nuit',
      }}
    />
  );
}

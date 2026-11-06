import React from 'react';

import ProductShelf17 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfBanner17`: o núcleo das vitrines 17, variante `banner`, com o
 * mock de lá (sem arte: vale o recorte neutro; sem rótulo nos cards; sem "Ver todos", o botão do
 * banner faz esse papel; o título usa a cor do texto, sem `showcaseTitleColor`).
 */
export default function ShelfBanner17() {
  return (
    <ProductShelf17
      variant="banner"
      styles={styles}
      title="Cantinho dos gatos"
      banner={{
        eyebrow: 'Gatos',
        title: 'Tudo para o gato que manda na casa',
        text: 'Arranhadores, areias, fontes e ração para cada fase.',
        ctaLabel: 'Ver tudo para gatos',
        url: '#',
        imageAlt: 'Tudo para o gato que manda na casa',
      }}
    />
  );
}

import React from 'react';

import ProductShelf10 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfBanner10`: o núcleo das vitrines 10, variante `banner`, com o mock de lá (sem arte). */
export default function ShelfBanner10() {
  return (
    <ProductShelf10
      variant="banner"
      styles={styles}
      title="Seleção da semana"
      viewAllLabel="Ver todos"
      viewAllUrl="#"
      banner={{
        eyebrow: 'Só esta semana',
        title: 'Semana [Sua Marca]',
        text: 'Até 50% OFF em áudio, vídeo e acessórios.',
        ctaLabel: 'Ver tudo',
        url: '#',
        imageAlt: 'Semana [Sua Marca]',
      }}
    />
  );
}

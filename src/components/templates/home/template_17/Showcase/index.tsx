import React from 'react';

import ProductShelf17 from '../ProductShelf';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductShelfCustom17`: o núcleo das vitrines 17, variante `full`, com o
 * mock de lá (sem rótulo fixo nos cards: o desenho só mostra o -N%).
 */
export default function Showcase17() {
  return (
    <ProductShelf17
      variant="full"
      styles={styles}
      title="Os mais pedidos da semana"
      subtitle="O que os tutores mais colocaram na sacola nos últimos dias."
      viewAllLabel="Ver todos"
      viewAllUrl="#"
    />
  );
}

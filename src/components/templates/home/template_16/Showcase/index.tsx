import React from 'react';

import ProductShelf16 from '../ProductShelf';

import styles from './index.module.css';

/** Espelha `organisms/ProductShelfCustom16`: o núcleo das vitrines 16, variante `full`, com o mock de lá. */
export default function Showcase16() {
  return (
    <ProductShelf16
      variant="full"
      styles={styles}
      title="Os queridinhos da criançada"
      subtitle="Os brinquedos e roupinhas que mais saíram este mês."
      viewAllLabel="Ver todos"
      viewAllUrl="#"
      tagLabel="Mais amado"
    />
  );
}

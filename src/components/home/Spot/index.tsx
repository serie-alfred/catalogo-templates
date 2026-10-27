import React from 'react';
import Image from 'next/image';

import type { CatalogItem } from '@/types/catalog';

import styles from './index.module.css';

type SpotProps = {
  item: CatalogItem;
  className?: string;
};

/**
 * Card de template da home: o card INTEIRO é o link para a vitrine
 * (`/templates/<NN>/home`). Desktop ou Mobile se escolhe lá, na barra.
 *
 * `<a>` comum, não `<Link>`: a vitrine é outro root layout, e a navegação entre
 * root layouts recarrega a página de qualquer jeito.
 */
export default function Spot({ item, className }: SpotProps) {
  return (
    <a
      href={item.link}
      className={`${styles.productSpot} ${className || ''}`}
      data-spot={item.id}
    >
      <div className={styles.containerImg}>
        <Image
          aria-hidden
          src={item.image}
          alt={item.title}
          width={400}
          height={304}
        />
      </div>
      <div className={styles.containerInfo}>
        <h3 className={styles.nameText}>{item.title}</h3>
        <span>{item.subtitle}</span>
      </div>
    </a>
  );
}

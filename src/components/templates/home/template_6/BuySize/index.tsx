import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories06` do faststore.starter — "Compre por tamanho":
 * título centrado, fileira de 14 chips (38×38 no desktop, 33×33 em duas
 * fileiras a partir de 1200) e o link "Todos os tamanhos".
 *
 * A seta do link vem de um `::after` com data-URI, como na origem: nó de texto
 * mudaria a caixa e a contagem de filhos.
 */
const sizeLink = (n: number) =>
  `/calcados?initialMap=c&initialQuery=calcados&map=category-1,tamanho&query=/calcados/${n}&searchState=`;

const conteudo = {
  sectionTitle: 'Compre por tamanho',
  sizes: Array.from({ length: 14 }, (_, i) => ({
    label: String(34 + i),
    link: sizeLink(34 + i),
  })),
  allLabel: 'Todos os tamanhos',
  allLink: '/calcados',
};

export default function BuySize() {
  return (
    <div className={styles.outer}>
      <div className={styles.wrapper} data-role="bsz-wrapper">
        <div className={styles.titleRow} data-role="bsz-title-row">
          <h2 className={styles.title} data-role="bsz-title">
            {conteudo.sectionTitle}
          </h2>
        </div>

        <div className={styles.contentCol} data-role="bsz-content">
          <div className={styles.chipsRow} data-role="bsz-chips">
            {conteudo.sizes.map((size, index) => (
              <a
                key={index}
                className={styles.chip}
                href={size.link}
                data-role="bsz-chip"
              >
                <span className={styles.chipLabel} data-role="bsz-chip-label">
                  {size.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        <a
          className={styles.allLink}
          href={conteudo.allLink}
          data-role="bsz-all-link"
        >
          <span className={styles.allLabel} data-role="bsz-all-label">
            {conteudo.allLabel}
          </span>
        </a>
      </div>
    </div>
  );
}

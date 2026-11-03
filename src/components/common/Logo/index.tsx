import React from 'react';

import styles from './index.module.css';

/**
 * A marca: um E montado com as seções de uma loja — header, banner e uma
 * vitrine de três produtos. O banner é o módulo que troca: tem a cor do
 * template provado (`--p-acento`) e sai e volta no hover. O mesmo bloco vira
 * o hífen do nome.
 */
export default function Logo({ tamanho = 28 }: { tamanho?: number }) {
  return (
    <span
      className={styles.logo}
      style={{ '--logo-h': `${tamanho}px` } as React.CSSProperties}
    >
      <span className={styles.marca} aria-hidden>
        <span className={styles.espinha} />
        <span className={styles.secoes}>
          <span className={styles.header} />
          <span className={styles.banner}>
            <span className={styles.modulo} />
          </span>
          <span className={styles.vitrine}>
            <span />
            <span />
            <span />
          </span>
        </span>
      </span>
      <span className={styles.nome}>
        e<span className={styles.hifen} aria-hidden />
        <span className="siteSr">-</span>temas
      </span>
    </span>
  );
}

import React from 'react';

import styles from './index.module.css';

/**
 * A marca. O símbolo é um E montado com as seções de uma loja — header,
 * banner e uma vitrine de três produtos —, com o banner na cor do template
 * provado (`--p-acento`). O nome é o "e.temas" do logo antigo, que fica: as
 * letras vêm de `public/logo-etemas-nome.svg` (os traços originais, sem o
 * símbolo de camadas) como máscara pintada com a cor do texto, e o ponto é um
 * círculo à parte, na mesma cor do banner — troca junto com o site.
 */
export default function Logo({
  tamanho = 28,
  nome = true,
}: {
  tamanho?: number;
  /** false: só o E (o rail do editor, o carregando da vitrine). */
  nome?: boolean;
}) {
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
      {nome && (
        <span className={styles.nome} aria-hidden>
          <span className={styles.letras} />
          <span className={styles.ponto} />
        </span>
      )}
      <span className="siteSr">e-temas</span>
    </span>
  );
}

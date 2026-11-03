import React from 'react';

import styles from './index.module.css';

const TEXTO =
  'O E-temas nasceu dentro de uma agência que constrói lojas todos os dias. Cada template sai da mesma base de componentes que usamos com nossos clientes, só que pronta, para você não começar do zero.';

/**
 * A parte institucional: um parágrafo que acende palavra por palavra conforme
 * a página rola (`animation-timeline: view()`, só CSS; sem suporte, aparece
 * inteiro) e uma linha de fatos tirados do catálogo.
 */
export default function QuemFaz({ fatos }: { fatos: string[] }) {
  const palavras = TEXTO.split(' ');
  return (
    <section
      id="quem-faz"
      className={styles.secao}
      aria-labelledby="quem-titulo"
    >
      <h2 id="quem-titulo" className={styles.rotulo}>
        Quem faz
      </h2>
      <p className={styles.manifesto}>
        {palavras.map((p, i) => {
          const inicio = Math.round(18 + (i / palavras.length) * 44);
          return (
            <span
              key={i}
              className={styles.palavra}
              style={{
                animationRange: `cover ${inicio}% cover ${inicio + 8}%`,
              }}
            >
              {p}{' '}
            </span>
          );
        })}
      </p>
      <ul className={styles.fatos}>
        {fatos.map(f => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </section>
  );
}

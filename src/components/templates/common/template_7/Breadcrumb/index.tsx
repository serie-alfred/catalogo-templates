import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `overrides/Breadcrumb07` do faststore.starter: a seção nativa `Breadcrumb`
 * (raiz `.breadcrumbSection07`) com a trilha `BreadcrumbTrail07` dentro. É a trilha que
 * ficava no topo do ProductInfo07 antes da PDP 07 virar peças (como a família 01): faixa
 * branca com filete, separador `›`, níveis anteriores apagados e o atual em 500. No
 * mobile, as medidas da trilha que a PLP 07 tinha no topo (saiu de lá para esta peça).
 * Mesmo markup, classes e `data-role` do starter.
 *
 * Trilha de exemplo da PDP de antes (no starter ela vem do contexto da PLP/PDP).
 */
const TRILHA_07 = [
  { item: '/decoracao', name: 'Decoração' },
  { item: '/decoracao/tapetes', name: 'Tapetes' },
  { item: '/decoracao/tapetes/tapete-para-sala', name: 'Tapete para Sala' },
  { name: 'Tapete Belga Essence Clássico' },
];

export default function Breadcrumb07() {
  const niveis = [{ name: 'Início', item: '/' }, ...TRILHA_07];

  return (
    /* envelope só do catálogo: carrega o container-type das @container */
    <div className={styles.breadcrumbSection07Box}>
      <section className={styles.breadcrumbSection07}>
        <nav className={styles.breadcrumb07} aria-label="breadcrumb" data-role="breadcrumb">
          {niveis.map((c, i) => (
            <React.Fragment key={`${c.item ?? c.name}-${i}`}>
              {i > 0 && (
                <span className={styles.sep} aria-hidden="true">
                  ›
                </span>
              )}
              {i < niveis.length - 1 ? (
                <a className={styles.link} href={c.item || '/'}>
                  {c.name}
                </a>
              ) : (
                <span className={styles.current} aria-current="page">
                  {c.name}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </section>
    </div>
  );
}

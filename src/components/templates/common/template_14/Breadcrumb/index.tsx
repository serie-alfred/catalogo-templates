import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `overrides/Breadcrumb14` do faststore.starter (família 14, Esportiva; desenho
 * `Breadcrumb14` / `Breadcrumb14-mobile`): a seção nativa `Breadcrumb` (raiz
 * `.breadcrumbSection14`) com a trilha `BreadcrumbTrail14` dentro. Mesmo markup, mesmas
 * classes, mesmos `data-role`; o CSS é derivado de `sass/breadcrumb14.module.scss`.
 *
 * Faixa branca com a trilha em versalete: "Início" e os níveis apagados, separados pelo
 * traço vermelho inclinado, e o atual em texto cheio. Trilha de exemplo do palco do starter
 * (`Comum14Stage`; lá ela vem do contexto da PLP/PDP). A trilha baixa só a Inter, com a
 * mesma URL de lá.
 */

const FONTES = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap';

const TRILHA_14 = [
  { name: 'Corrida', item: '/corrida' },
  { name: 'Tênis de corrida', item: '/corrida/tenis' },
];

export default function Breadcrumb14() {
  const trilha = TRILHA_14;

  const sep = <li className={styles.sep} aria-hidden="true" data-role="breadcrumb-sep" />;

  return (
    <div className={styles.breadcrumbSection14Box}>
      <section className={styles.breadcrumbSection14}>
        <div className={styles.breadcrumb14} data-role="breadcrumb">
          <link rel="stylesheet" href={FONTES} />
          <nav className={styles.nav} aria-label="Trilha de navegação">
            <ol className={styles.list}>
              <li data-role="breadcrumb-item">
                <a className={styles.link} href="/" data-role="breadcrumb-home">
                  Início
                </a>
              </li>
              {trilha.map((c, i) => {
                const ultimo = i === trilha.length - 1;
                return (
                  <React.Fragment key={`${c.item}-${i}`}>
                    {sep}
                    <li data-role="breadcrumb-item">
                      {ultimo ? (
                        <span className={styles.current} aria-current="page" data-role="breadcrumb-current">
                          {c.name}
                        </span>
                      ) : (
                        <a className={styles.link} href={c.item || '/'} data-role="breadcrumb-link">
                          {c.name}
                        </a>
                      )}
                    </li>
                  </React.Fragment>
                );
              })}
            </ol>
          </nav>
        </div>
      </section>
    </div>
  );
}

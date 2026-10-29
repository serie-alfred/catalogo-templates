import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `overrides/Breadcrumb16` do faststore.starter (família 16, Infantil; desenho
 * `Breadcrumb16` / `Breadcrumb16-mobile`): a seção nativa `Breadcrumb` (raiz
 * `.breadcrumbSection16`) com a trilha `BreadcrumbTrail16` dentro. Mesmo markup, mesmas
 * classes, mesmos `data-role`; o CSS é derivado de `sass/breadcrumb16.module.scss`.
 *
 * Faixa creme com "Início" e a casinha, os níveis anteriores apagados separados por setas e o
 * atual numa pílula na cor de destaque. Mobile: só a casinha, numa linha que rola de lado.
 * Trilha de exemplo do palco do starter (lá ela vem do contexto da PLP/PDP).
 */

const FONTES_16 =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap';

const TRILHA_16 = [
  { name: 'Brinquedos', item: '/brinquedos' },
  { name: 'Blocos de montar', item: '/brinquedos/blocos-de-montar' },
];

const Casa = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" />
  </svg>
);

const Seta = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export default function Breadcrumb16() {
  const trilha = TRILHA_16;

  return (
    <div className={styles.breadcrumbSection16Box}>
      <section className={styles.breadcrumbSection16}>
        <div className={styles.breadcrumb16} data-role="breadcrumb">
          <link rel="stylesheet" href={FONTES_16} />
          <nav className={styles.nav} aria-label="Trilha de navegação">
            <ol className={styles.list}>
              <li className={styles.item} data-role="breadcrumb-item">
                <a className={`${styles.link} ${styles.home}`} href="/" aria-label="Início" data-role="breadcrumb-home">
                  <Casa />
                  <span className={styles.homeLabel}>Início</span>
                </a>
              </li>
              {trilha.map((c, i) => {
                const ultimo = i === trilha.length - 1;
                return (
                  <React.Fragment key={`${c.item}-${i}`}>
                    <li className={styles.sep} aria-hidden="true" data-role="breadcrumb-sep">
                      <Seta />
                    </li>
                    <li className={styles.item} data-role="breadcrumb-item">
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

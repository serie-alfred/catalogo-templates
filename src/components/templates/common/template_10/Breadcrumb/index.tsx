import React from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `overrides/Breadcrumb10` do faststore.starter (família 10, Varejo; desenho
 * `Breadcrumb10` / `Breadcrumb10-mobile`): a seção nativa `Breadcrumb` (raiz
 * `.breadcrumbSection10`) com a trilha `BreadcrumbTrail10` dentro. Mesmo markup, mesmas
 * classes, mesmos `data-role`; o CSS é derivado de `sass/breadcrumb10.module.scss`.
 *
 * Cápsula com a casinha (início), os níveis como links separados por chevron e o nível
 * atual em pílula. Trilha de exemplo do desenho (no starter ela vem do contexto da
 * PLP/PDP).
 */

const TRILHA_10 = [
  { name: 'Celulares e Smartphones', item: '/celulares' },
  { name: 'Smartphones', item: '/celulares/smartphones' },
];

const Casa = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M4 11 12 4l8 7" />
    <path d="M6 10v10h12V10" />
  </svg>
);

const Seta = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export default function Breadcrumb10() {
  const trilha = TRILHA_10;

  return (
    <div className={styles.breadcrumbSection10Box}>
      <section className={styles.breadcrumbSection10}>
        <div className={styles.breadcrumb10} data-role="breadcrumb">
          <link rel="stylesheet" href={FONTES_10} />
          <div className={styles.inner}>
            <nav className={styles.nav} aria-label="Trilha de navegação">
              <ol className={styles.list}>
                <li>
                  <a
                    className={styles.home}
                    href="/"
                    aria-label="Página inicial"
                    data-role="breadcrumb-home"
                  >
                    <Casa />
                  </a>
                </li>
                {trilha.map((c, i) => {
                  const ultimo = i === trilha.length - 1;
                  return (
                    <React.Fragment key={`${c.item}-${i}`}>
                      <li
                        className={styles.sep}
                        aria-hidden="true"
                        data-role="breadcrumb-sep"
                      >
                        <Seta />
                      </li>
                      <li data-role="breadcrumb-item">
                        {ultimo ? (
                          <span
                            className={styles.current}
                            aria-current="page"
                            data-role="breadcrumb-current"
                          >
                            {c.name}
                          </span>
                        ) : (
                          <a
                            className={styles.link}
                            href={c.item}
                            data-role="breadcrumb-link"
                          >
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
        </div>
      </section>
    </div>
  );
}

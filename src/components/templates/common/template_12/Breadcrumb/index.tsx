import React from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `overrides/Breadcrumb12` do faststore.starter (família 12, Suave; desenho
 * `Breadcrumb12` / `Breadcrumb12-mobile`): a seção nativa `Breadcrumb` (raiz
 * `.breadcrumbSection12`) com a trilha `BreadcrumbTrail12` dentro. Mesmo markup, mesmas
 * classes, mesmos `data-role`; o CSS é derivado de `sass/breadcrumb12.module.scss`.
 *
 * Pílula branca com filete: "Início" com a casinha, os níveis separados por pontos e o
 * atual numa pílula rosada; à direita, "Voltar". Mobile: só a casinha, a trilha numa linha
 * e sem o "Voltar". Trilha de exemplo do palco do starter (lá ela vem do contexto da
 * PLP/PDP).
 */

const TRILHA_12 = [
  { name: 'Skincare', item: '/skincare' },
  { name: 'Séruns', item: '/skincare/seruns' },
];

const svg = (children: React.ReactNode) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Casa = () =>
  svg(
    <>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v10h12V10" />
    </>
  );
const Voltar = () => svg(<path d="m15 6-6 6 6 6" />);

export default function Breadcrumb12() {
  const trilha = TRILHA_12;
  // "Voltar" leva ao nível de cima do atual (ou ao início, quando a trilha tem um nível só).
  const acima = trilha.length > 1 ? trilha[trilha.length - 2].item || '/' : '/';

  return (
    <div className={styles.breadcrumbSection12Box}>
      <section className={styles.breadcrumbSection12}>
        <div className={styles.breadcrumb12} data-role="breadcrumb">
          <link rel="stylesheet" href={FONTES_12} />
          <div className={styles.inner}>
            <nav className={styles.nav} aria-label="Você está em">
              <ol className={styles.list}>
                <li className={styles.item} data-role="breadcrumb-item">
                  <a
                    className={`${styles.link} ${styles.home}`}
                    href="/"
                    aria-label="Início"
                    data-role="breadcrumb-home"
                  >
                    <Casa />
                    <span className={styles.homeLabel}>Início</span>
                  </a>
                  <span
                    className={styles.sep}
                    aria-hidden="true"
                    data-role="breadcrumb-sep"
                  />
                </li>
                {trilha.map((c, i) => {
                  const ultimo = i === trilha.length - 1;
                  return (
                    <li
                      key={`${c.item ?? c.name}-${i}`}
                      className={styles.item}
                      data-role="breadcrumb-item"
                    >
                      {ultimo ? (
                        <span
                          className={styles.current}
                          aria-current="page"
                          data-role="breadcrumb-current"
                        >
                          {c.name}
                        </span>
                      ) : (
                        <>
                          <a
                            className={styles.link}
                            href={c.item || '/'}
                            data-role="breadcrumb-link"
                          >
                            {c.name}
                          </a>
                          <span
                            className={styles.sep}
                            aria-hidden="true"
                            data-role="breadcrumb-sep"
                          />
                        </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
            <a className={styles.back} href={acima} data-role="breadcrumb-back">
              <Voltar />
              Voltar
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

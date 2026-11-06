import React from 'react';

import { FONTES_17 } from '@/components/templates/common/template_17/Spot';

import styles from './index.module.css';

/**
 * Espelha `overrides/Breadcrumb17` do faststore.starter (família 17, Pet; desenho
 * `Breadcrumb17` / `Breadcrumb17-mobile`): a seção nativa `Breadcrumb` (raiz
 * `.breadcrumbSection17`) com a trilha `BreadcrumbTrail17` dentro. Mesmo markup, mesmas
 * classes, mesmos `data-role`; o CSS é derivado de `sass/breadcrumb17.module.scss`.
 *
 * "Início" e os níveis anteriores apagados, separados por setas na cor de destaque, e o nível
 * atual numa pílula clara em negrito. Mobile: a mesma trilha numa linha só, que rola de lado.
 * Trilha de exemplo do palco do starter (`Breadcrumb17Stage`; lá ela vem do contexto da
 * PLP/PDP). Sem a casinha em "Início": o desenho da 17 não tem.
 */


const TRILHA_17 = [
  { name: 'Cachorros', item: '/cachorros' },
  { name: 'Ração seca', item: '/cachorros/racao-seca' },
];

const Seta = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export default function Breadcrumb17() {
  const trilha = TRILHA_17;

  return (
    <div className={styles.breadcrumbSection17Box}>
      <section className={styles.breadcrumbSection17}>
        <div className={styles.breadcrumb17} data-role="breadcrumb">
          <link rel="stylesheet" href={FONTES_17} />
          <nav className={styles.nav} aria-label="Trilha de navegação">
            <ol className={styles.list}>
              <li className={styles.item} data-role="breadcrumb-item">
                <a
                  className={styles.link}
                  href="/"
                  data-role="breadcrumb-home"
                >
                  Início
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
                    <li className={styles.item} data-role="breadcrumb-item">
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
                          href={c.item || '/'}
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
      </section>
    </div>
  );
}

import React from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

import styles from './index.module.css';

/**
 * Espelha `overrides/Breadcrumb13` do faststore.starter (família 13, Noturno; desenho
 * `Breadcrumb13` / `Breadcrumb13-mobile`): a seção nativa `Breadcrumb` (raiz
 * `.breadcrumbSection13`) com a trilha `BreadcrumbTrail13` dentro. Mesmo markup, mesmas
 * classes, mesmos `data-role`; o CSS é derivado de `sass/breadcrumb13.module.scss`.
 *
 * Faixa preta com filete embaixo e a trilha em condensada maiúscula: "Início" e os níveis
 * apagados, separados por "/" em verde, e o atual em texto cheio sublinhado de verde.
 * Mobile: uma linha só, que rola de lado se não couber. Trilha de exemplo do palco do
 * starter (lá ela vem do contexto da PLP/PDP).
 */

const TRILHA_13 = [
  { name: 'Tênis', item: '/tenis' },
  { name: 'Corrida', item: '/tenis/corrida' },
];

export default function Breadcrumb13() {
  const trilha = TRILHA_13;

  const sep = (
    <li className={styles.sep} aria-hidden="true" data-role="breadcrumb-sep">
      /
    </li>
  );

  return (
    <div className={styles.breadcrumbSection13Box}>
      <section className={styles.breadcrumbSection13}>
        <div className={styles.breadcrumb13} data-role="breadcrumb">
          <link rel="stylesheet" href={FONTES_13} />
          <nav className={styles.nav} aria-label="Trilha de navegação">
            <ol className={styles.list}>
              <li className={styles.item} data-role="breadcrumb-item">
                <a className={styles.link} href="/" data-role="breadcrumb-home">
                  Início
                </a>
              </li>
              {trilha.map((c, i) => {
                const ultimo = i === trilha.length - 1;
                return (
                  <React.Fragment key={`${c.item}-${i}`}>
                    {sep}
                    <li className={styles.item} data-role="breadcrumb-item">
                      {ultimo ? (
                        <span className={styles.current} aria-current="page" data-role="breadcrumb-current">
                          <span className={styles.currentText}>{c.name}</span>
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

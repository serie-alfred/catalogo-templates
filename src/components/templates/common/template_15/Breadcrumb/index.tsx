import React from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import styles from './index.module.css';

/**
 * Espelha `overrides/Breadcrumb15` do faststore.starter (família 15, Luxo; desenho
 * `Breadcrumb15` / `Breadcrumb15-mobile`): a seção nativa `Breadcrumb` (raiz
 * `.breadcrumbSection15`) com a trilha `BreadcrumbTrail15` dentro. Mesmo markup, mesmas
 * classes, mesmos `data-role`; o CSS é derivado de `sass/breadcrumb15.module.scss`.
 *
 * "Início — Joias — Anéis" em versalete espaçado: níveis anteriores apagados, fio dourado
 * entre eles e o atual em peso cheio. Mobile: uma linha só, que rola de lado. Trilha de
 * exemplo do palco do starter (`Breadcrumb15Stage`; lá ela vem do contexto da PLP/PDP).
 */

const TRILHA_15 = [
  { name: 'Joias', item: '/joias' },
  { name: 'Anéis', item: '/joias/aneis' },
];

export default function Breadcrumb15() {
  const niveis = [{ name: 'Início', item: '/' }, ...TRILHA_15];

  return (
    <div className={styles.breadcrumbSection15Box}>
      <section className={styles.breadcrumbSection15}>
        <div className={styles.breadcrumb15} data-role="breadcrumb">
          <link rel="stylesheet" href={FONTES_15} />
          <div className={styles.inner}>
            <nav aria-label="Trilha de navegação">
              <ol className={styles.list}>
                {niveis.map((c, i) => {
                  const ultimo = i === niveis.length - 1;
                  return (
                    <React.Fragment key={`${c.item}-${i}`}>
                      {i > 0 && (
                        <li
                          className={styles.sep}
                          aria-hidden="true"
                          data-role="breadcrumb-sep"
                        />
                      )}
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
        </div>
      </section>
    </div>
  );
}

import React from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `overrides/Breadcrumb09` do faststore.starter (família 09, Editorial; desenho
 * `Breadcrumb09` / `Breadcrumb09-mobile`): a seção nativa `Breadcrumb` (raiz
 * `.breadcrumbSection09`) com a trilha `BreadcrumbTrail09` dentro. Mesmo markup, mesmas
 * classes, mesmos `data-role`; o CSS é derivado de `sass/breadcrumb09.module.scss`.
 *
 * Trilha de exemplo do desenho (no starter ela vem do contexto da PLP/PDP). O "Voltar"
 * do desenho não entra: não faz parte da trilha nativa, e o starter também não o tem.
 */

const TRILHA_09 = [
  { name: 'Feminino', item: '/feminino' },
  { name: 'Vestidos', item: '/feminino/vestidos' },
];

export default function Breadcrumb09() {
  const niveis = [{ name: 'Início', item: '/' }, ...TRILHA_09];

  return (
    <div className={styles.breadcrumbSection09Box}>
      <section className={styles.breadcrumbSection09}>
        <div className={styles.breadcrumb09} data-role="breadcrumb">
          <link rel="stylesheet" href={FONTES_09} />
          <div className={styles.inner}>
            <nav aria-label="Trilha de navegação">
              <ol className={styles.list}>
                {niveis.map((c, i) => {
                  const ultimo = i === niveis.length - 1;
                  return (
                    <React.Fragment key={`${c.item}-${i}`}>
                      {i > 0 && (
                        <li className={styles.sep} aria-hidden="true" data-role="breadcrumb-sep">
                          /
                        </li>
                      )}
                      <li data-role="breadcrumb-item">
                        {ultimo ? (
                          <span className={styles.current} aria-current="page" data-role="breadcrumb-current">
                            {c.name}
                          </span>
                        ) : (
                          <a className={styles.link} href={c.item} data-role="breadcrumb-link">
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

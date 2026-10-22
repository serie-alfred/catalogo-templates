import React from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha `overrides/Breadcrumb11` do faststore.starter (família 11, Grade; desenho
 * `Breadcrumb11` / `Breadcrumb11-mobile`): a seção nativa `Breadcrumb` (raiz
 * `.breadcrumbSection11`) com a trilha `BreadcrumbTrail11` dentro. Mesmo markup, mesmas
 * classes, mesmos `data-role`; o CSS é derivado de `sass/breadcrumb11.module.scss`.
 *
 * Uma faixa com filete, a célula "Voltar" (o nível de cima da trilha) e a trilha em mono
 * caixa-alta, "Início / nível / atual", com o atual em `aria-current="page"`. Mobile:
 * "Voltar" vira a célula quadrada só com a seta, e a trilha rola de lado numa linha.
 * Trilha de exemplo do desenho (no starter ela vem do contexto da PLP/PDP).
 */

const TRILHA_11 = [
  { name: 'Iluminação', item: '/iluminacao' },
  { name: 'Luminárias de mesa', item: '/iluminacao/luminarias-de-mesa' },
];

const Voltar = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export default function Breadcrumb11() {
  const trilha = TRILHA_11;
  // "Voltar" leva ao nível de cima do atual (ou ao início, quando a trilha tem um nível só).
  const acima = trilha.length > 1 ? trilha[trilha.length - 2].item || '/' : '/';
  const niveis = [{ name: 'Início', item: '/' }, ...trilha];

  return (
    <div className={styles.breadcrumbSection11Box}>
      <section className={styles.breadcrumbSection11}>
        <div className={styles.breadcrumb11} data-role="breadcrumb">
          <link rel="stylesheet" href={FONTES_11} />
          <nav className={styles.nav} aria-label="Trilha de navegação">
            <a
              className={styles.back}
              href={acima}
              aria-label="Voltar"
              data-role="breadcrumb-back"
            >
              <Voltar />
              <span className={styles.backLabel}>Voltar</span>
            </a>
            <ol className={styles.list}>
              {niveis.map((c, i) => {
                const ultimo = i === niveis.length - 1;
                return (
                  <li
                    key={`${c.item ?? c.name}-${i}`}
                    className={styles.item}
                    data-role="breadcrumb-item"
                  >
                    {ultimo ? (
                      <span
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
                          data-role={
                            i === 0 ? 'breadcrumb-home' : 'breadcrumb-link'
                          }
                        >
                          {c.name}
                        </a>
                        <span
                          className={styles.sep}
                          aria-hidden="true"
                          data-role="breadcrumb-sep"
                        >
                          /
                        </span>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </section>
    </div>
  );
}

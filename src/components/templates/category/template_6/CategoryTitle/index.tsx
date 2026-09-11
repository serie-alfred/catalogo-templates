import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/CategoryTitle06` do faststore.starter — a linha de título
 * e contagem da PLP.
 *
 * Na origem o título e a contagem vêm do contexto REAL da página (`usePLP` /
 * `useSearchPage`); o conteúdo abaixo é o mesmo exemplo que o starter passou a
 * usar quando não há PLP no contexto.
 *
 * A origem tem DUAS cópias da contagem — uma para a linha da trilha (injetada
 * por portal no `[data-role="breadcrumb06"]`) e outra para a linha do título —
 * e o CSS escolhe qual aparece. Sem seção de trilha na página, a da trilha nem
 * chega a existir e a do título vale nos dois breakpoints: é esse o caso aqui.
 */
const conteudo = {
  title: 'Sneakers',
  totalCount: 128,
  countLabel: 'Produtos encontrados',
};

export default function CategoryTitle() {
  return (
    <div className={styles.root}>
      <section className={styles.categoryTitle06} data-role="plp-title-row">
        <h1 className={styles.title} data-role="plp-title">
          {conteudo.title}
        </h1>
        <span className={styles.count} data-role="plp-count">
          {conteudo.totalCount} {conteudo.countLabel}
        </span>
      </section>
    </div>
  );
}

import React, { useContext } from 'react';

import { LayoutContext } from '@/context/LayoutContext';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useCategoriaDaLoja } from '@/hooks/useCategoriaDaLoja';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';

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
 * por portal no `[data-role="breadcrumb"]`) e outra para a linha do título —
 * e o CSS escolhe qual aparece. Sem seção de trilha na página, a da trilha nem
 * chega a existir e a do título vale nos dois breakpoints: é esse o caso aqui.
 *
 * Do CS vem só o rótulo (`countLabel`, nome do `section.schema`); a categoria e a
 * contagem seguem as de exemplo. `countInBreadcrumb` fica fora: não há trilha aqui.
 */
interface CategoryTitleConteudo {
  countLabel?: string;
}

const MOCK: CategoryTitleConteudo = {
  countLabel: 'Produtos encontrados',
};

const EXEMPLO = {
  title: 'Sneakers',
  totalCount: 128,
};

export default function CategoryTitle() {
  const { countLabel } = useConteudoDaSecao(MOCK);
  // O nome é o da categoria da loja; a contagem, a dos produtos da loja.
  const conteudo = {
    title: useCategoriaDaLoja()?.name || EXEMPLO.title,
    totalCount: useProdutosDaLoja()?.length ?? EXEMPLO.totalCount,
  };
  /* O Category Main 06 já traz a trilha, o título e a contagem (o MainCategory06 da
     origem desenha os três). Com ele na mesma página de categoria, esta seção sai de
     cena — senão título e contagem aparecem duas vezes. Sozinha, ela vale. */
  const selecoes = useContext(LayoutContext)?.selections ?? [];
  const comMain06 = selecoes.some(
    s => s.layoutKey === 'categoryMain' && s.id === '06' && (s.pagina ?? []).includes('category')
  );
  if (comMain06) return null;

  return (
    <div className={styles.root}>
      <section className={styles.categoryTitle06} data-role="plp-title-row">
        <h1 className={styles.title} data-role="plp-title">
          {conteudo.title}
        </h1>
        <span className={styles.count} data-role="plp-count">
          {conteudo.totalCount} {countLabel}
        </span>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
CategoryTitle.conteudoPadrao = MOCK;

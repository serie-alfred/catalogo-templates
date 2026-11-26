'use client';

import React, { useState } from 'react';

import styles from './index.module.css';
import { FONTES_10 } from '@/components/templates/common/template_10/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';
import { useCategoriaDaLoja } from '@/hooks/useCategoriaDaLoja';
import { categoriaDoExemplo } from '@/utils/categoriaDaLoja';

/**
 * Espelha `organisms/CategoryTitle10` do faststore.starter (família 10, Varejo;
 * desenho `CategoryTitle10`): cartão na cor da marca com o nome da categoria, a
 * contagem e os chips de subcategoria em texto. Mesmo markup, classes e `data-role`;
 * o CSS é derivado do SCSS de lá.
 *
 * O único campo de CMS é o rótulo da contagem (`useConteudoDaSecao`). Lá nome,
 * contagem e chips vêm do contexto da PLP (breadcrumb, totalCount, facet do
 * nível abaixo); aqui são o exemplo do mock.ts de lá. O chip, que lá troca o filtro pela
 * store de busca (clicar de novo no ativo volta à categoria inteira), aqui faz o mesmo
 * num `useState`.
 */
interface Subcat {
  value: string;
  label: string;
  quantity?: number;
}

/** O conteúdo da seção: os campos do `section.schema` do CategoryTitle10. */
interface CategoryTitle10Conteudo {
  countLabel?: string;
}

const MOCK: CategoryTitle10Conteudo = { countLabel: 'produtos' };

const TITULO = 'Smartphones';
const TOTAL = 1248;
const SUBCATS: Subcat[] = [
  { value: 'smartphones-5g', label: 'Smartphones 5G', quantity: 642 },
  { value: 'smartphones-4g', label: 'Smartphones 4G', quantity: 418 },
  { value: 'dobraveis', label: 'Dobráveis', quantity: 36 },
  { value: 'seminovos', label: 'Seminovos', quantity: 152 },
];

export default function CategoryTitle10() {
  // O nome é o da categoria da loja; a contagem, a dos produtos da loja (a mesma
  // da grade). Sem eles, os de exemplo.
  const nome = useCategoriaDaLoja()?.name || TITULO;
  const total = useProdutosDaLoja()?.length ?? TOTAL;
  const { countLabel } = useConteudoDaSecao(MOCK);
  const [ativa, setAtiva] = useState('');

  const escolher = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setAtiva(a => (a === value ? '' : value));
  };

  return (
    <div className={styles.categoryTitle10Box}>
      <link rel="stylesheet" href={FONTES_10} />
      <header className={styles.categoryTitle10} data-role="ct-root">
        <div className={styles.inner}>
          <div className={styles.card}>
            <div className={styles.head}>
              <h1 className={styles.title} data-role="ct-title">
                {nome}
              </h1>
              <span className={styles.count} data-role="ct-count">
                {total.toLocaleString('pt-BR')} {countLabel}
              </span>
            </div>
            <nav
              className={styles.chips}
              aria-label="Subcategorias"
              data-role="ct-chips"
            >
              {SUBCATS.map(s => {
                const on = ativa === s.value;
                return (
                  <a
                    key={s.value}
                    className={`${styles.chip}${on ? ` ${styles.chipActive}` : ''}`}
                    href="#"
                    aria-current={on ? 'page' : undefined}
                    onClick={e => escolher(e, s.value)}
                    data-role="ct-chip"
                  >
                    {s.label}
                    {typeof s.quantity === 'number' && (
                      <span className={styles.chipQty}>({s.quantity})</span>
                    )}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
CategoryTitle10.conteudoPadrao = MOCK;

/** A categoria de exemplo, para o painel partir do que a tela mostra (FichaDaCategoria). */
CategoryTitle10.categoriaPadrao = categoriaDoExemplo({ nome: TITULO });

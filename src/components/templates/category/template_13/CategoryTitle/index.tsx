'use client';

import React, { useState } from 'react';

import styles from './index.module.css';
import { FONTES_13 } from '@/components/templates/common/template_13/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';
import { useCategoriaDaLoja } from '@/hooks/useCategoriaDaLoja';
import { categoriaDoExemplo } from '@/utils/categoriaDaLoja';

/**
 * Espelha `organisms/CategoryTitle13` do faststore.starter (família 13, Noturno; desenho
 * `CategoryTitle13`): o nome da categoria enorme em condensada maiúscula, a contagem em verde
 * ao pé dele ("212 PRODUTOS") e os chips de subcategoria com borda, cada um com a quantidade.
 * Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Lá nome, contagem e chips vêm do contexto da PLP (breadcrumb, totalCount, facet do nível
 * abaixo); aqui são o exemplo do mock.ts de lá. Sem chip "Todos" (o desenho não tem) e, como
 * lá fora de contexto, nenhum chip nasce ativo. O chip, que lá troca o filtro pela store de
 * busca, aqui alterna num `useState`.
 *
 * O único campo de CMS são os dois rótulos (`useConteudoDaSecao`): o do chip "Todos" (o
 * desenho não tem; sem `allLabel` o chip não nasce) e o texto depois da contagem.
 */
interface Subcat {
  value: string;
  label: string;
  quantity?: number;
}

/** O conteúdo da seção: os campos do `section.schema` do CategoryTitle13. */
interface CategoryTitle13Conteudo {
  allLabel?: string;
  countLabel?: string;
}

const MOCK: CategoryTitle13Conteudo = { countLabel: 'produtos' };

const TITULO = 'Tênis';
const TOTAL = 212;
const SUBCATS: Subcat[] = [
  { value: 'corrida', label: 'Corrida', quantity: 64 },
  { value: 'skate', label: 'Skate', quantity: 38 },
  { value: 'basquete', label: 'Basquete', quantity: 27 },
  { value: 'casual', label: 'Casual', quantity: 59 },
  { value: 'trail', label: 'Trail', quantity: 24 },
];

export default function CategoryTitle13() {
  // O nome é o da categoria da loja; a contagem, a dos produtos da loja (a mesma
  // da grade). Sem eles, os de exemplo.
  const nome = useCategoriaDaLoja()?.name || TITULO;
  const total = useProdutosDaLoja()?.length ?? TOTAL;
  const { allLabel, countLabel } = useConteudoDaSecao(MOCK);
  const [ativa, setAtiva] = useState<string | null>(null);

  const escolher = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setAtiva(a => (value === '' || value !== a ? value : null));
  };

  // O chip "Todos" (a categoria inteira) só existe com `allLabel`, como no starter.
  const chips: Subcat[] = allLabel
    ? [{ value: '', label: allLabel }, ...SUBCATS]
    : SUBCATS;

  return (
    <div className={styles.categoryTitle13Box}>
      <section
        className={styles.categoryTitle13}
        aria-label="Categoria"
        data-role="ct-root"
      >
        <link rel="stylesheet" href={FONTES_13} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <h1 className={styles.title} data-role="ct-title">
              {nome}
            </h1>
            <p className={styles.count} data-role="ct-count">
              {total.toLocaleString('pt-BR')}
              {countLabel ? ` ${countLabel}` : ''}
            </p>
          </div>
          <nav
            className={styles.chips}
            aria-label="Subcategorias"
            data-role="ct-chips"
          >
            <ul className={styles.chipList}>
              {chips.map(s => {
                const on = ativa === s.value;
                return (
                  <li key={s.value || '_todos'} className={styles.chipItem}>
                    <a
                      className={`${styles.chip}${on ? ` ${styles.chipActive}` : ''}`}
                      href="#"
                      aria-current={on ? 'page' : undefined}
                      onClick={e => escolher(e, s.value)}
                      data-role="ct-chip"
                    >
                      {s.label}
                      {typeof s.quantity === 'number' && (
                        <span className={styles.chipQty}>
                          {s.quantity.toLocaleString('pt-BR')}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
CategoryTitle13.conteudoPadrao = MOCK;

/** A categoria de exemplo, para o painel partir do que a tela mostra (FichaDaCategoria). */
CategoryTitle13.categoriaPadrao = categoriaDoExemplo({ nome: TITULO });

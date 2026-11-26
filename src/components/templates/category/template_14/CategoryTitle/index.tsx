'use client';

import React, { useState } from 'react';

import styles from './index.module.css';
import { FONTES_14 } from '@/components/templates/common/template_14/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';
import { useCategoriaDaLoja } from '@/hooks/useCategoriaDaLoja';

/**
 * Espelha `organisms/CategoryTitle14` do faststore.starter (família 14, Esportiva; desenho
 * `CategoryTitle14`): faixa marinho com o nome da categoria enorme em Saira itálica, a contagem
 * num paralelogramo lima ao lado ("186 PRODUTOS") e os chips de subcategoria em paralelogramo,
 * cada um com a quantidade; no desktop, o nome repetido em contorno vazado ao fundo e o traço
 * lima inclinado (forma, `aria-hidden`). Mesmo markup, classes e `data-role`; o CSS é derivado
 * do SCSS de lá.
 *
 * Os campos de CMS são os dois rótulos (`useConteudoDaSecao`): o texto depois da contagem e o
 * chip "Todos" (vazio = sem ele, como no desenho). Lá nome, contagem e chips vêm do contexto da
 * PLP; aqui são o exemplo do mock.ts de lá. Nenhum chip nasce ativo. O chip, que lá troca o filtro
 * pela store de busca, aqui alterna num `useState`.
 */
interface Subcat {
  value: string;
  label: string;
  quantity?: number;
}

interface CategoryTitle14Conteudo {
  allLabel?: string;
  countLabel?: string;
}

const MOCK: CategoryTitle14Conteudo = { countLabel: 'produtos' };

const TITULO = 'Corrida';
const TOTAL = 186;
const SUBCATS: Subcat[] = [
  { value: 'tenis', label: 'Tênis', quantity: 64 },
  { value: 'camisetas', label: 'Camisetas', quantity: 38 },
  { value: 'shorts', label: 'Shorts', quantity: 27 },
  { value: 'leggings', label: 'Leggings', quantity: 22 },
  { value: 'jaquetas', label: 'Jaquetas', quantity: 14 },
  { value: 'acessorios', label: 'Acessórios', quantity: 35 },
];

export default function CategoryTitle14() {
  // O nome é o da categoria da loja; a contagem, a dos produtos da loja (a mesma
  // da grade). Sem eles, os de exemplo.
  const nome = useCategoriaDaLoja()?.name || TITULO;
  const total = useProdutosDaLoja()?.length ?? TOTAL;
  const { allLabel, countLabel } = useConteudoDaSecao(MOCK);
  const [ativa, setAtiva] = useState<string | null>(null);

  const escolher = (e: React.MouseEvent, value: string) => {
    e.preventDefault();
    setAtiva(a => (value && value !== a ? value : null));
  };

  const chips: Subcat[] = allLabel
    ? [{ value: '', label: allLabel }, ...SUBCATS]
    : SUBCATS;

  return (
    <div className={styles.categoryTitle14Box}>
      <section
        className={styles.categoryTitle14}
        aria-label="Categoria"
        data-role="ct-root"
      >
        <link rel="stylesheet" href={FONTES_14} />
        <span
          className={styles.watermark}
          aria-hidden="true"
          data-role="ct-watermark"
        >
          {nome}
        </span>
        <span className={styles.stripe} aria-hidden="true" />
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
                const on = s.value ? ativa === s.value : !ativa;
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
CategoryTitle14.conteudoPadrao = MOCK;

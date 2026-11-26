'use client';

import React, { useEffect, useMemo } from 'react';

import { useLayout } from '@/context/LayoutContext';
import { LAYOUTS } from '@/data/layoutData';
import { GRUPOS_DA_LOJA, SCHEMA_DA_LOJA } from '@/data/conteudo/schemaDaLoja';
import type { ConteudoDaSecao, ValorDeConteudo } from '@/types/conteudo';
import { resolverConteudo } from '@/utils/conteudo';
import { ouvirFocoNaLoja } from '@/utils/focoNaLoja';
import { partirDaPagina, type SecaoDaPagina } from '@/utils/lojaDaPagina';
import Campo from '../../ConteudoPanel/Campo';
import { conteudoPadraoDe } from '../../ConteudoPanel';

import styles from './index.module.css';

/**
 * "Conteúdo da loja" (rail): o que o cliente tem UMA vez e todas as seções
 * mostram — menus, contato, redes, dados legais, pagamentos, selos,
 * banners e categorias (o Nível 2, src/types/conteudo.ts).
 *
 * Cada slot chega às seções pelos vínculos (src/utils/conteudoLoja.ts): o menu
 * principal vira o menu de qualquer header, por isso sobrevive à troca do
 * Header09 pelo Header12 e ao "Por template". Slot vazio = cada seção mostra o
 * próprio conteúdo. Com o slot vazio e uma seção que já o mostra, o painel
 * oferece começar por ele.
 */
export default function PanelConteudoLoja() {
  const { conteudoLoja, setCampoDaLoja, limparConteudoLoja, selections } =
    useLayout();

  /** O que cada seção da página mostra hoje (mock + Nível 1), para o "Começar com…". */
  const secoes = useMemo<SecaoDaPagina[]>(
    () =>
      selections.flatMap(sel => {
        const item = LAYOUTS[sel.layoutKey]?.items.find(i => i.id === sel.id);
        const mock = item ? conteudoPadraoDe(item.component) : null;
        if (!item || !mock) return [];
        return [
          {
            componente: item.component,
            titulo: item.title,
            conteudo: resolverConteudo(mock, sel.content) as ConteudoDaSecao,
          },
        ];
      }),
    [selections]
  );

  const loja = (conteudoLoja ?? {}) as Record<string, ValorDeConteudo>;

  // "Editar produtos" (e afins) vindo da aba Conteúdo: rola o slot para o topo.
  useEffect(
    () =>
      ouvirFocoNaLoja(slot =>
        document
          .querySelector(`[data-slot-loja="${slot}"]`)
          ?.scrollIntoView({ block: 'start' })
      ),
    []
  );

  return (
    <div className={styles.wrap} data-painel-loja>
      <p className={styles.intro}>
        O conteúdo do cliente que vale para a loja inteira: o menu vai para
        qualquer header, o contato para qualquer rodapé, e tudo continua aqui ao
        trocar de template. Campo vazio, cada seção mostra o próprio conteúdo.
      </p>

      {GRUPOS_DA_LOJA.map(grupo => (
        <section key={grupo.titulo} className={styles.grupo}>
          <h3 className={styles.titulo}>{grupo.titulo}</h3>
          {grupo.slots.map(slot => {
            const schema = SCHEMA_DA_LOJA[slot];
            const preenchido = slot in loja;
            const inicio = preenchido
              ? null
              : partirDaPagina(slot, schema, secoes);
            return (
              <div
                key={slot}
                className={`${styles.slot}${preenchido ? ` ${styles.preenchido}` : ''}`}
                data-slot-loja={slot}
              >
                <Campo
                  chave={slot}
                  schema={schema}
                  valor={loja[slot]}
                  onChange={v => setCampoDaLoja(slot, v)}
                  id={`loja-${slot}`}
                />
                {inicio && (
                  <button
                    type="button"
                    className={styles.acao}
                    data-comecar-da-pagina
                    onClick={() => setCampoDaLoja(slot, inicio.valor)}
                  >
                    Começar com o do {inicio.titulo}
                  </button>
                )}
                {preenchido && (
                  <button
                    type="button"
                    className={styles.acao}
                    data-limpar-slot
                    onClick={() => setCampoDaLoja(slot, undefined)}
                  >
                    Limpar (cada seção volta ao próprio)
                  </button>
                )}
              </div>
            );
          })}
        </section>
      ))}

      <footer className={styles.rodape}>
        <button
          type="button"
          className={styles.limparTudo}
          disabled={!conteudoLoja}
          onClick={limparConteudoLoja}
        >
          Limpar todo o conteúdo da loja
        </button>
      </footer>
    </div>
  );
}

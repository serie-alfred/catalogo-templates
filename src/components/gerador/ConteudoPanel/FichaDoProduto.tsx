'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import { SCHEMA_DA_LOJA } from '@/data/conteudo/schemaDaLoja';
import type { ProdutoDaLoja, ValorDeConteudo } from '@/types/conteudo';
import { pedirFocoNaLoja } from '@/utils/focoNaLoja';
import Campo from './Campo';

import styles from './index.module.css';

const CAMPOS_DO_PRODUTO = SCHEMA_DA_LOJA.produtos.items?.properties ?? {};

/**
 * A descrição e a ficha do produto, na aba Conteúdo da seção da PDP que as
 * desenha. Na loja elas vêm do cadastro de cada produto, em toda plataforma —
 * então se editam aqui mesmo, no 1º produto do Conteúdo da loja (o que a PDP
 * mostra). Sem produto cadastrado, leva a "Produtos".
 */
export default function FichaDoProduto({
  campos,
}: {
  campos: readonly ('description' | 'specs')[];
}) {
  const { conteudoLoja, setCampoDaLoja, setRailTarget } = useLayout();
  const produtos: ProdutoDaLoja[] = Array.isArray(conteudoLoja?.produtos)
    ? conteudoLoja.produtos
    : [];
  const primeiro = produtos[0];

  if (!primeiro)
    return (
      <p
        className={styles.daLoja}
        data-ficha-do-produto="sem-produto"
        style={{ padding: '16px 16px 0' }}
      >
        A descrição e as especificações vêm do cadastro do produto, em toda
        plataforma. Cadastre um produto para editá-las aqui.{' '}
        <button
          type="button"
          onClick={() => {
            setRailTarget('loja');
            pedirFocoNaLoja('produtos');
          }}
        >
          Cadastrar produto
        </button>
      </p>
    );

  const mudar = (
    campo: 'description' | 'specs',
    valor: ValorDeConteudo | undefined
  ) => {
    const proximo: ProdutoDaLoja = { ...primeiro };
    if (valor === undefined) delete proximo[campo];
    else Object.assign(proximo, { [campo]: valor });
    setCampoDaLoja('produtos', [
      proximo,
      ...produtos.slice(1),
    ] as unknown as ValorDeConteudo);
  };

  return (
    <div className={styles.campos} data-ficha-do-produto>
      <p className={styles.daLoja}>
        Do cadastro do produto <strong>{primeiro.name || 'Produto 1'}</strong>,
        o que a página de produto mostra. Vale em toda plataforma.
      </p>
      {campos.map(campo => (
        <div
          key={campo}
          className={styles.campoDaSecao}
          data-campo-ficha={campo}
        >
          <Campo
            chave={campo}
            schema={CAMPOS_DO_PRODUTO[campo]}
            valor={primeiro[campo] as ValorDeConteudo | undefined}
            onChange={v => mudar(campo, v)}
            id={`ficha-${campo}`}
          />
        </div>
      ))}
    </div>
  );
}

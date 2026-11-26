'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import { SCHEMA_DA_LOJA } from '@/data/conteudo/schemaDaLoja';
import type { CategoriaDaPlp, ValorDeConteudo } from '@/types/conteudo';
import Campo from './Campo';

import styles from './index.module.css';

const CAMPOS_DA_CATEGORIA = SCHEMA_DA_LOJA.categoria.properties ?? {};

export type CampoDaCategoria = 'name' | 'description' | 'faq';

/**
 * O nome, a descrição e as perguntas da categoria, na aba Conteúdo da seção da
 * página de categoria que os desenha. Na loja eles vêm do cadastro da categoria,
 * em toda plataforma — então se editam aqui mesmo, na categoria do Conteúdo da
 * loja (a mesma que o título, a descrição e a grade de toda família leem).
 */
export default function FichaDaCategoria({ campos }: { campos: readonly CampoDaCategoria[] }) {
  const { conteudoLoja, setCampoDaLoja } = useLayout();
  const categoria: CategoriaDaPlp =
    conteudoLoja?.categoria && typeof conteudoLoja.categoria === 'object'
      ? conteudoLoja.categoria
      : {};

  const mudar = (campo: CampoDaCategoria, valor: ValorDeConteudo | undefined) => {
    const proxima: CategoriaDaPlp = { ...categoria };
    if (valor === undefined) delete proxima[campo];
    else Object.assign(proxima, { [campo]: valor });
    setCampoDaLoja(
      'categoria',
      Object.keys(proxima).length ? (proxima as unknown as ValorDeConteudo) : undefined
    );
  };

  return (
    <div className={styles.campos} data-ficha-da-categoria>
      <p className={styles.daLoja}>
        Do cadastro da categoria: vale para o título, a descrição e a grade da página de
        categoria, em toda plataforma. Vazio, a de exemplo.
      </p>
      {campos.map(campo => (
        <div key={campo} className={styles.campoDaSecao} data-campo-categoria={campo}>
          <Campo
            chave={campo}
            schema={CAMPOS_DA_CATEGORIA[campo]}
            valor={categoria[campo] as ValorDeConteudo | undefined}
            onChange={v => mudar(campo, v)}
            id={`categoria-${campo}`}
          />
        </div>
      ))}
    </div>
  );
}

'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { useLayout } from '@/context/LayoutContext';
import { LAYOUTS } from '@/data/layoutData';
import camposDasReplicas from '@/data/conteudo/campos.generated.json';
import type { CampoDoSchema, SchemaDeConteudo, ValorDeConteudo } from '@/types/conteudo';
import { resolverConteudo, sanitizarConteudoLoja } from '@/utils/conteudo';
import { projetarLoja, ROTULO_DO_SLOT } from '@/utils/conteudoLoja';
import {
  camposDaCategoria,
  camposDaFicha,
  camposDoProduto,
  camposEditaveis,
  subcamposEditaveis,
} from '@/utils/editaveis';
import { rotuloDaPlataforma } from '@/types/platform';
import { pedirFocoNaLoja } from '@/utils/focoNaLoja';
import { TemplateRegistry } from '@/utils/templateRegistry';
import Campo from './Campo';
import FichaDaCategoria from './FichaDaCategoria';
import FichaDoProduto from './FichaDoProduto';

import styles from './index.module.css';

/**
 * A aba **Conteúdo** do painel da direita: os textos, imagens e listas da seção
 * selecionada (o Nível 1, `LayoutSelection.content`; ver src/types/conteudo.ts).
 *
 * - Os campos são os do `section.schema` do starter (`schemas.generated.json`,
 *   744 KB, por isso carregado sob demanda), filtrados pelos que a réplica
 *   DESENHA (`campos.generated.json`): o conteúdo é só preview, e campo sem
 *   efeito na tela só confundiria o CS. E só os que o lojista da plataforma
 *   escolhida consegue mudar depois (src/utils/editaveis.ts): o resto fica fixo
 *   no tema, e oferecê-lo aqui seria prometer um texto que o cliente não troca.
 * - O valor de partida de cada campo é o mock da peça (`XNN.conteudoPadrao`),
 *   com o que o CS já mudou por cima — o mesmo `resolverConteudo` do render.
 * - Mexeu num campo, ele fica "personalizado" e ganha o "Voltar ao padrão".
 * - Campo que vem do conteúdo da LOJA (menu, contato…, ver conteudoLoja.ts)
 *   diz de onde vem e leva ao "Conteúdo da loja"; mudar aqui vale só para esta
 *   seção, e o "Voltar" devolve ao da loja.
 */

type Schemas = Record<string, { path: string; schema: SchemaDeConteudo }>;

let schemasCarregando: Promise<Schemas> | null = null;
function carregarSchemas() {
  schemasCarregando ??= import('@/data/conteudo/schemas.generated.json').then(
    m => (m.default as unknown as { componentes: Schemas }).componentes
  );
  return schemasCarregando;
}

/** O mock que a peça expõe (`XNN.conteudoPadrao = MOCK`), ou null se ela ainda não lê conteúdo. */
export function conteudoPadraoDe(componente: string): Record<string, unknown> | null {
  const peca = TemplateRegistry[componente] as unknown as
    | { conteudoPadrao?: Record<string, unknown> }
    | undefined;
  return peca?.conteudoPadrao ?? null;
}

const DESENHADOS = (camposDasReplicas as { componentes: Record<string, string[]> }).componentes;

/** As peças que desenham produtos (os da loja, `useProdutosDaLoja`). */
const MOSTRA_PRODUTOS =
  /^(Spot|Showcase|ShelfBanner|CategoryMain|ProductRelated|ProductInfo|ProductDescription)\d+$/;

export default function ConteudoPanel() {
  const {
    selectedUid,
    selections,
    setConteudoDaSecao,
    resetConteudoDaSecao,
    conteudoLoja,
    setRailTarget,
    platform,
  } = useLayout();
  // O mesmo filtro do ThemeRenderer: o painel mostra o que o canvas desenha.
  const loja = useMemo(() => sanitizarConteudoLoja(conteudoLoja), [conteudoLoja]);
  const [schemas, setSchemas] = useState<Schemas | null>(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    let vivo = true;
    carregarSchemas().then(
      s => vivo && setSchemas(s),
      () => vivo && setFalhou(true)
    );
    return () => {
      vivo = false;
    };
  }, []);

  const selection = useMemo(
    () => selections.find(s => s.uid === selectedUid) ?? null,
    [selections, selectedUid]
  );
  const layoutItem = useMemo(
    () =>
      selection
        ? (LAYOUTS[selection.layoutKey].items.find(i => i.id === selection.id) ?? null)
        : null,
    [selection]
  );

  if (!selectedUid || !selection || !layoutItem) {
    return (
      <p className={styles.vazio}>
        Selecione uma seção no preview ou na lista para editar os textos, imagens e listas dela.
      </p>
    );
  }

  // Peças que mostram produtos: os produtos são os da loja, não um campo da seção.
  const ficha = camposDaFicha(layoutItem.component);
  const avisoDeProdutos = MOSTRA_PRODUTOS.test(layoutItem.component) && (
    <>
    <p className={styles.daLoja} data-produtos-da-loja style={{ padding: '16px 16px 0' }}>
      Os produtos desta seção são os do Conteúdo da loja: valem para toda vitrine, grade,
      relacionados e página de produto, no formato do card escolhido.{' '}
      <button
        type="button"
        onClick={() => {
          setRailTarget('loja');
          pedirFocoNaLoja('produtos');
        }}
      >
        Editar produtos
      </button>
    </p>
      {ficha.length > 0 && <FichaDoProduto campos={ficha} />}
    </>
  );
  // Peças da página de categoria: nome, descrição e FAQ são do cadastro da categoria.
  const daCategoria = camposDaCategoria(layoutItem.component);
  const doCadastro = (avisoDeProdutos || daCategoria.length > 0) && (
    <>
      {avisoDeProdutos}
      {daCategoria.length > 0 && <FichaDaCategoria campos={daCategoria} />}
    </>
  );

  const mock = conteudoPadraoDe(layoutItem.component);
  const desenhados = DESENHADOS[layoutItem.component];
  if (!mock || !desenhados) {
    // O card de produto (Spot) não tem conteúdo próprio: só os produtos da loja.
    if (doCadastro) return <div className={styles.painel}>{doCadastro}</div>;
    return (
      <p className={styles.vazio}>
        <strong>{layoutItem.title}</strong> não tem conteúdo próprio: o que ela mostra vem do
        catálogo da plataforma (produtos, trilha de navegação).
      </p>
    );
  }

  if (!schemas) {
    return (
      <p className={styles.vazio} role="status">
        {falhou ? 'Não foi possível carregar os campos. Recarregue a página.' : 'Carregando os campos…'}
      </p>
    );
  }

  const schema = schemas[layoutItem.component]?.schema;
  const editaveis = camposEditaveis(platform, layoutItem.component);
  const doSchema: [string, CampoDoSchema][] = schema
    ? Object.entries(schema.properties).filter(([chave]) => desenhados.includes(chave))
    : [];
  // Campo-objeto editável só em parte (a `topbar` do Header01 na Wake): o grupo
  // mostra só os subcampos que o lojista muda; o `Campo` preserva os outros.
  const campos: [string, CampoDoSchema][] = doSchema.flatMap(([chave, filho]) => {
    const subs = subcamposEditaveis(editaveis, chave);
    if (!subs) return [[chave, filho]];
    if (!subs.length || !filho.properties) return [];
    const properties = Object.fromEntries(
      Object.entries(filho.properties).filter(([k]) => subs.includes(k))
    );
    return [[chave, { ...filho, properties }]];
  });
  if (!campos.length) {
    const fixos = doSchema.length > 0 && (
      <p className={styles.vazio} data-sem-editaveis={platform ?? undefined}>
        Em <strong>{rotuloDaPlataforma(platform ?? '')}</strong>, os títulos e rótulos de{' '}
        <strong>{layoutItem.title}</strong> ficam no código do tema: o lojista não os muda
        depois de publicado.
      </p>
    );
    if (doCadastro)
      return (
        <div className={styles.painel}>
          {doCadastro}
          {fixos}
        </div>
      );
    return (
      fixos || (
        <p className={styles.vazio}>
          <strong>{layoutItem.title}</strong> não tem campos de conteúdo.
        </p>
      )
    );
  }

  const uid = selectedUid;
  const doProduto = camposDoProduto(layoutItem.component);
  const nivel1 = selection.content ?? {};
  const daLoja = projetarLoja(layoutItem.component, loja, mock);
  const valores = resolverConteudo(mock, daLoja.conteudo, nivel1) as Record<
    string,
    ValorDeConteudo | undefined
  >;

  return (
    <div className={styles.painel} aria-label="Editar conteúdo da seção">
      {doCadastro}
      <div className={styles.campos}>
        {campos.map(([chave, filho]) => {
          const personalizado = chave in nivel1;
          const slot = daLoja.origem[chave];
          return (
            <div
              key={chave}
              className={`${styles.campoDaSecao}${personalizado ? ` ${styles.personalizado}` : ''}`}
              data-campo-conteudo={chave}
            >
              <Campo
                chave={chave}
                schema={filho}
                valor={valores[chave]}
                onChange={v => setConteudoDaSecao(uid, chave, v)}
                id={`ct-${uid}-${chave}`}
              />
              {doProduto.includes(chave) && (
                <p className={styles.daLoja} data-do-produto>
                  Na loja, vem do cadastro de cada produto.
                </p>
              )}
              {slot && !personalizado && (
                <p className={styles.daLoja} data-vem-da-loja={slot}>
                  Vem do conteúdo da loja ({ROTULO_DO_SLOT[slot]}). Mudar aqui vale só para esta
                  seção.{' '}
                  <button type="button" onClick={() => setRailTarget('loja')}>
                    Editar na loja
                  </button>
                </p>
              )}
              {personalizado && (
                <button
                  type="button"
                  className={styles.voltar}
                  onClick={() => setConteudoDaSecao(uid, chave, undefined)}
                >
                  {slot ? 'Voltar ao conteúdo da loja' : 'Voltar ao padrão'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <footer className={styles.rodape}>
        <button
          type="button"
          className={styles.restaurar}
          disabled={!selection.content}
          onClick={() => resetConteudoDaSecao(uid)}
        >
          Restaurar conteúdo padrão
        </button>
      </footer>
    </div>
  );
}

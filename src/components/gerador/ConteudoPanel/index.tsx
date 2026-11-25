'use client';

import React, { useEffect, useMemo, useState } from 'react';

import { useLayout } from '@/context/LayoutContext';
import { LAYOUTS } from '@/data/layoutData';
import camposDasReplicas from '@/data/conteudo/campos.generated.json';
import type { CampoDoSchema, SchemaDeConteudo, ValorDeConteudo } from '@/types/conteudo';
import { resolverConteudo, sanitizarConteudoLoja } from '@/utils/conteudo';
import { projetarLoja, ROTULO_DO_SLOT } from '@/utils/conteudoLoja';
import { TemplateRegistry } from '@/utils/templateRegistry';
import Campo from './Campo';

import styles from './index.module.css';

/**
 * A aba **Conteúdo** do painel da direita: os textos, imagens e listas da seção
 * selecionada (o Nível 1, `LayoutSelection.content`; ver src/types/conteudo.ts).
 *
 * - Os campos são os do `section.schema` do starter (`schemas.generated.json`,
 *   744 KB, por isso carregado sob demanda), filtrados pelos que a réplica
 *   DESENHA (`campos.generated.json`): o conteúdo é só preview, e campo sem
 *   efeito na tela só confundiria o CS.
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

export default function ConteudoPanel() {
  const {
    selectedUid,
    selections,
    setConteudoDaSecao,
    resetConteudoDaSecao,
    conteudoLoja,
    setRailTarget,
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

  const mock = conteudoPadraoDe(layoutItem.component);
  const desenhados = DESENHADOS[layoutItem.component];
  if (!mock || !desenhados) {
    return (
      <p className={styles.vazio}>
        <strong>{layoutItem.title}</strong> ainda não tem conteúdo editável. As peças estão ficando
        editáveis família por família — hoje, as famílias 09 a 17.
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
  const campos: [string, CampoDoSchema][] = schema
    ? Object.entries(schema.properties).filter(([chave]) => desenhados.includes(chave))
    : [];
  if (!campos.length) {
    return (
      <p className={styles.vazio}>
        <strong>{layoutItem.title}</strong> não tem campos de conteúdo.
      </p>
    );
  }

  const uid = selectedUid;
  const nivel1 = selection.content ?? {};
  const daLoja = projetarLoja(layoutItem.component, loja, mock);
  const valores = resolverConteudo(mock, daLoja.conteudo, nivel1) as Record<
    string,
    ValorDeConteudo | undefined
  >;

  return (
    <div className={styles.painel} aria-label="Editar conteúdo da seção">
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

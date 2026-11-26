'use client';

import React, { useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Plus, Trash2, Upload } from 'lucide-react';

import { enviarImagem } from '@/services/midiaService';
import type { CampoDoSchema, ValorDeConteudo } from '@/types/conteudo';
import { larguraMaximaDoCampo } from '@/utils/imagem';

import styles from './index.module.css';

/**
 * Um campo do formulário de conteúdo, montado a partir do nó do schema (o
 * `section.schema` do starter, copiado por `yarn derivar:conteudo`). Recursivo:
 * grupo e lista desenham os campos de dentro com este mesmo componente.
 *
 * Só apresentação: quem grava é o `onChange`, que recebe o valor INTEIRO do
 * campo (uma lista volta inteira, como o `resolverConteudo` espera).
 */

export type TipoDeCampo =
  | 'texto'
  | 'textarea'
  | 'link'
  | 'imagem'
  | 'opcao'
  | 'numero'
  | 'booleano'
  | 'lista'
  | 'grupo';

export function tipoDoCampo(schema: CampoDoSchema, chave: string): TipoDeCampo {
  if (schema.type === 'array') return 'lista';
  if (schema.type === 'object') return 'grupo';
  if (schema.type === 'boolean') return 'booleano';
  if (schema.type === 'number' || schema.type === 'integer') return 'numero';
  if (schema.enum?.length) return 'opcao';
  const widget = schema.widget?.['ui:widget'];
  if (widget === 'image-uploader' || widget === 'media-gallery') return 'imagem';
  // `html` (TextArea): o preview o desenha como texto em blocos, nunca como HTML.
  if (widget === 'textarea' || schema.format === 'textarea' || chave === 'html') return 'textarea';
  if (/(url|href|link)$/i.test(chave)) return 'link';
  return 'texto';
}

/** O que um link do preview aceita; fora disso o campo avisa (e `javascript:` nem chega à tela). */
const LINK_VALIDO = /^(https?:\/\/|\/|#|mailto:|tel:)/i;
const IMAGEM_VALIDA = /^(https:\/\/|\/)/i;

type Objeto = { [chave: string]: ValorDeConteudo };
const ehObjeto = (v: unknown): v is Objeto =>
  Object.prototype.toString.call(v) === '[object Object]';

/** O objeto com `chave` trocada; `undefined` tira a chave (o item volta a não ter o campo). */
function comCampo(obj: Objeto, chave: string, valor: ValorDeConteudo | undefined): Objeto {
  const novo = { ...obj };
  if (valor === undefined) delete novo[chave];
  else novo[chave] = valor;
  return novo;
}

/** Título do item fechado: o primeiro texto que diz o que ele é. */
function resumoDoItem(item: ValorDeConteudo, schema: CampoDoSchema, i: number) {
  if (typeof item === 'string' && item.trim()) return item;
  if (ehObjeto(item))
    for (const chave of ['label', 'title', 'name', 'question', 'text', 'eyebrow', 'kicker', 'author', 'method', 'network']) {
      const v = item[chave];
      if (typeof v === 'string' && v.trim()) return v;
    }
  return `${schema.title ?? 'Item'} ${i + 1}`;
}

export interface CampoProps {
  chave: string;
  schema: CampoDoSchema;
  valor: ValorDeConteudo | undefined;
  onChange: (valor: ValorDeConteudo | undefined) => void;
  /** Base dos `id` (label ↔ controle); os campos de dentro estendem. */
  id: string;
}

export default function Campo({ chave, schema, valor, onChange, id }: CampoProps) {
  const tipo = tipoDoCampo(schema, chave);
  const rotulo = schema.title ?? chave;
  const texto = typeof valor === 'string' ? valor : '';

  const cabecalho = (
    <label className={styles.rotulo} htmlFor={id}>
      {rotulo}
    </label>
  );

  switch (tipo) {
    case 'texto':
    case 'link':
      return (
        <div className={styles.campo} data-tipo={tipo}>
          {cabecalho}
          <input
            id={id}
            className={styles.input}
            type="text"
            value={texto}
            placeholder={tipo === 'link' ? 'https://… ou /caminho' : undefined}
            onChange={e => onChange(e.target.value)}
          />
          {tipo === 'link' && texto && !LINK_VALIDO.test(texto.trim()) && (
            <p className={styles.aviso}>Use https://…, /caminho, #, mailto: ou tel:.</p>
          )}
          {schema.description && <p className={styles.dica}>{schema.description}</p>}
        </div>
      );

    case 'textarea':
      return (
        <div className={styles.campo} data-tipo={tipo}>
          {cabecalho}
          <textarea
            id={id}
            className={`${styles.input} ${styles.textarea}`}
            rows={3}
            value={texto}
            onChange={e => onChange(e.target.value)}
          />
          {(schema.description || chave === 'html') && (
            <p className={styles.dica}>
              {schema.description ??
                'Texto, sem HTML: linha em branco separa parágrafos, e "# " no começo do bloco faz um título.'}
            </p>
          )}
        </div>
      );

    case 'imagem':
      return (
        <CampoImagem chave={chave} schema={schema} valor={valor} onChange={onChange} id={id} cabecalho={cabecalho} />
      );

    case 'opcao':
      return (
        <div className={styles.campo} data-tipo={tipo}>
          {cabecalho}
          <select
            id={id}
            className={styles.input}
            value={valor === undefined ? '' : String(valor)}
            onChange={e => {
              const escolhido = e.target.value;
              if (!escolhido) return onChange(undefined);
              const original = schema.enum?.find(op => String(op) === escolhido);
              onChange(original ?? escolhido);
            }}
          >
            <option value="">—</option>
            {schema.enum?.map((op, i) => (
              <option key={String(op)} value={String(op)}>
                {schema.enumNames?.[i] ?? String(op)}
              </option>
            ))}
          </select>
        </div>
      );

    case 'numero':
      return (
        <div className={styles.campo} data-tipo={tipo}>
          {cabecalho}
          <input
            id={id}
            className={styles.input}
            type="number"
            min={schema.minimum}
            max={schema.maximum}
            step={schema.type === 'integer' ? 1 : 'any'}
            value={typeof valor === 'number' ? valor : ''}
            onChange={e => {
              if (e.target.value === '') return onChange(undefined);
              const n = Number(e.target.value);
              if (Number.isFinite(n)) onChange(schema.type === 'integer' ? Math.round(n) : n);
            }}
          />
        </div>
      );

    case 'booleano':
      return (
        <div className={`${styles.campo} ${styles.campoLinha}`} data-tipo={tipo}>
          <input
            id={id}
            className={styles.check}
            type="checkbox"
            checked={valor === true}
            onChange={e => onChange(e.target.checked)}
          />
          {cabecalho}
        </div>
      );

    case 'grupo': {
      const obj = ehObjeto(valor) ? valor : {};
      return (
        <fieldset className={styles.grupo} data-tipo={tipo}>
          <legend className={styles.rotulo}>{rotulo}</legend>
          {Object.entries(schema.properties ?? {}).map(([k, filho]) => (
            <Campo
              key={k}
              chave={k}
              schema={filho}
              valor={obj[k]}
              onChange={v => onChange(comCampo(obj, k, v))}
              id={`${id}-${k}`}
            />
          ))}
        </fieldset>
      );
    }

    case 'lista':
      return <Lista chave={chave} schema={schema} valor={valor} onChange={onChange} id={id} />;
  }
}

/**
 * Imagem: enviar um arquivo (preparado no navegador e subido para
 * `/gerador/api/midias`) ou colar uma URL. A miniatura mostra o que está valendo.
 */
function CampoImagem({
  chave,
  valor,
  onChange,
  id,
  cabecalho,
}: CampoProps & { cabecalho: React.ReactNode }) {
  const texto = typeof valor === 'string' ? valor : '';
  const arquivoRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const aoEscolher = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    e.target.value = '';
    if (!arquivo) return;
    setErro('');
    setEnviando(true);
    try {
      onChange(await enviarImagem(arquivo, larguraMaximaDoCampo(chave)));
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Falha no envio.');
    } finally {
      setEnviando(false);
    }
  };

  const urlValida = !!texto && IMAGEM_VALIDA.test(texto.trim());

  return (
    <div className={styles.campo} data-tipo="imagem">
      {cabecalho}
      <div className={styles.imagem}>
        {urlValida ? (
          <img className={styles.miniatura} src={texto} alt="" />
        ) : (
          <span className={styles.miniaturaVazia} aria-hidden="true" />
        )}
        <input
          id={id}
          className={styles.input}
          type="text"
          value={texto}
          placeholder="https://… ou envie um arquivo"
          onChange={ev => onChange(ev.target.value)}
        />
      </div>
      <input
        ref={arquivoRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        hidden
        onChange={aoEscolher}
        data-enviar-imagem={chave}
      />
      <button
        type="button"
        className={styles.enviar}
        onClick={() => arquivoRef.current?.click()}
        disabled={enviando}
      >
        <Upload size={14} /> {enviando ? 'Enviando…' : urlValida ? 'Trocar imagem' : 'Enviar imagem'}
      </button>
      {erro ? (
        <p className={styles.aviso} role="alert">
          {erro}
        </p>
      ) : texto && !urlValida ? (
        <p className={styles.aviso}>A imagem precisa de uma URL https:// (ou /caminho).</p>
      ) : null}
    </div>
  );
}

/** Lista do schema: itens recolhíveis, com subir, descer, duplicar e remover. */
function Lista({ chave, schema, valor, onChange, id }: CampoProps) {
  const itens = Array.isArray(valor) ? valor : [];
  const doItem: CampoDoSchema = schema.items ?? { type: 'string' };
  const [aberto, setAberto] = useState<number | null>(null);
  const cheia = schema.maxItems !== undefined && itens.length >= schema.maxItems;
  const minimo = schema.minItems ?? 0;
  const mudar = (novos: ValorDeConteudo[]) => onChange(novos);
  const mover = (de: number, para: number) => {
    const novos = [...itens];
    const [item] = novos.splice(de, 1);
    novos.splice(para, 0, item);
    mudar(novos);
    setAberto(a => (a === de ? para : a));
  };
  const vazioDoItem = (): ValorDeConteudo => (doItem.type === 'object' ? {} : '');

  return (
    <div className={styles.lista} data-tipo="lista">
      <div className={styles.listaTopo}>
        <span className={styles.rotulo}>{schema.title ?? chave}</span>
        <span className={styles.contagem}>{itens.length}</span>
      </div>
      {itens.length > 0 && (
        <ol className={styles.itens}>
          {itens.map((item, i) => {
            const idItem = `${id}-${i}`;
            const obj = ehObjeto(item) ? item : {};
            return (
              <li key={i} className={styles.item}>
                <div className={styles.itemTopo}>
                  <button
                    type="button"
                    className={styles.itemTitulo}
                    aria-expanded={aberto === i}
                    aria-controls={`${idItem}-campos`}
                    onClick={() => setAberto(aberto === i ? null : i)}
                  >
                    {resumoDoItem(item, doItem, i)}
                  </button>
                  <div className={styles.itemAcoes}>
                    <button type="button" aria-label="Subir" title="Subir" disabled={i === 0} onClick={() => mover(i, i - 1)}>
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Descer"
                      title="Descer"
                      disabled={i === itens.length - 1}
                      onClick={() => mover(i, i + 1)}
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Duplicar"
                      title="Duplicar"
                      disabled={cheia}
                      onClick={() => mudar([...itens.slice(0, i + 1), structuredClone(item), ...itens.slice(i + 1)])}
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Remover"
                      title="Remover"
                      disabled={itens.length <= minimo}
                      onClick={() => {
                        mudar(itens.filter((_, j) => j !== i));
                        setAberto(null);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {aberto === i && (
                  <div id={`${idItem}-campos`} className={styles.itemCampos}>
                    {doItem.type === 'object' ? (
                      Object.entries(doItem.properties ?? {}).map(([k, filho]) => (
                        <Campo
                          key={k}
                          chave={k}
                          schema={filho}
                          valor={obj[k]}
                          onChange={v => mudar(itens.map((x, j) => (j === i ? comCampo(ehObjeto(x) ? x : {}, k, v) : x)))}
                          id={`${idItem}-${k}`}
                        />
                      ))
                    ) : (
                      <Campo
                        chave={chave}
                        schema={doItem}
                        valor={item}
                        onChange={v => mudar(itens.map((x, j) => (j === i ? (v ?? '') : x)))}
                        id={idItem}
                      />
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
      <button
        type="button"
        className={styles.adicionar}
        disabled={cheia}
        onClick={() => {
          mudar([...itens, vazioDoItem()]);
          setAberto(itens.length);
        }}
      >
        <Plus size={14} /> Adicionar {(doItem.title ?? 'item').toLocaleLowerCase('pt-BR')}
      </button>
    </div>
  );
}

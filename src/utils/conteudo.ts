import type { ConteudoDaSecao, ValorDeConteudo } from '@/types/conteudo';

/**
 * Conteúdo em 3 níveis — a função ÚNICA que decide o que cada seção mostra.
 * Canvas, /p e palco do export passam por aqui (via `useConteudoDaSecao`), então
 * o preview e a captura não divergem. Ver src/types/conteudo.ts.
 *
 * Só importa tipos: o funil carrega este arquivo direto no Node
 * (`--experimental-strip-types`) para testar as regras.
 */

/**
 * Objeto literal (JSON). Por `toString`, não por protótipo: o conteúdo chega ao
 * iframe do canvas por postMessage, e o `Object.prototype` de lá é outro.
 */
function ehObjetoSimples(v: unknown): v is Record<string, unknown> {
  return Object.prototype.toString.call(v) === '[object Object]';
}

/**
 * Texto que não pode virar `href`/`src`. O `data:` só cai com cara de URL
 * (`data:image/png;…`): "Data: 25/11 a 30/11" é texto legítimo em português.
 */
const PROIBIDO = /^\s*(?:javascript|vbscript)\s*:|^\s*data:[a-z]+\/[\w.+-]+[;,]/i;

const LIMITES = { profundidade: 8, itens: 200, chaves: 200, texto: 20_000 };
const CHAVES_PERIGOSAS = new Set(['__proto__', 'constructor', 'prototype']);

function limpar(v: unknown, profundidade: number): ValorDeConteudo | undefined {
  if (profundidade > LIMITES.profundidade) return undefined;
  if (typeof v === 'string')
    return PROIBIDO.test(v) ? undefined : v.slice(0, LIMITES.texto);
  if (typeof v === 'number') return Number.isFinite(v) ? v : undefined;
  if (typeof v === 'boolean') return v;
  if (Array.isArray(v)) {
    const lista: ValorDeConteudo[] = [];
    for (const item of v.slice(0, LIMITES.itens)) {
      const limpo = limpar(item, profundidade + 1);
      if (limpo !== undefined) lista.push(limpo);
    }
    return lista;
  }
  if (ehObjetoSimples(v)) {
    const objeto: { [chave: string]: ValorDeConteudo } = {};
    for (const [chave, valor] of Object.entries(v).slice(0, LIMITES.chaves)) {
      if (CHAVES_PERIGOSAS.has(chave)) continue;
      const limpo = limpar(valor, profundidade + 1);
      if (limpo !== undefined) objeto[chave] = limpo;
    }
    return objeto;
  }
  return undefined; // null, função, Date, classe: nada disso é conteúdo
}

/**
 * Nível 1 vindo de fora (sessionStorage, tema salvo, snapshot do /p, que é
 * público): só JSON, sem `javascript:`/`data:` de URL, com tetos de tamanho.
 * Devolve `undefined` quando não sobra nada.
 */
export function sanitizarConteudo(valor: unknown): ConteudoDaSecao | undefined {
  if (!ehObjetoSimples(valor)) return undefined;
  const limpo = limpar(valor, 0) as ConteudoDaSecao;
  return Object.keys(limpo).length ? limpo : undefined;
}

/** Mesma forma: lista com lista, objeto com objeto, primitivo do mesmo tipo. */
function mesmaForma(a: unknown, b: unknown) {
  if (Array.isArray(a) || Array.isArray(b))
    return Array.isArray(a) && Array.isArray(b);
  if (ehObjetoSimples(a) || ehObjetoSimples(b))
    return ehObjetoSimples(a) && ehObjetoSimples(b);
  return typeof a === typeof b;
}

/**
 * Resolve o conteúdo de uma seção: o mock (Nível 3) por baixo e cada nível por
 * cima, do menos ao mais forte — `resolverConteudo(MOCK, nivel2, nivel1)`.
 *
 * A troca é por CHAVE DE PRIMEIRO NÍVEL, como o `withMock` do starter: uma lista
 * ou um objeto vem inteiro, nunca mesclado item a item (o formulário copia o
 * valor resolvido antes de editar um item). Diferença deliberada do `withMock`:
 * campo presente e vazio fica vazio, para o CS conseguir apagar um texto — o
 * mesmo que o Design Studio da Wake faz. Campo ausente herda.
 *
 * Um valor com forma diferente da do mock (texto onde o mock tem lista) é
 * ignorado: nível 1 de outro componente, levado numa troca, não quebra o render.
 */
export function resolverConteudo<T extends object>(
  mock: T,
  ...niveis: (ConteudoDaSecao | null | undefined)[]
): T {
  const base = mock as Record<string, unknown>;
  const resolvido: Record<string, unknown> = { ...base };
  for (const nivel of niveis) {
    if (!nivel) continue;
    for (const [campo, valor] of Object.entries(nivel)) {
      if (valor === undefined) continue;
      if (base[campo] !== undefined && !mesmaForma(base[campo], valor)) continue;
      resolvido[campo] = valor;
    }
  }
  return resolvido as T;
}

/**
 * O Nível 1 que acompanha uma seção trocada no lugar (outro header no slot do
 * header, outra vitrine no lugar das vitrines). Vai inteiro: as chaves que o
 * componente novo não tem são ignoradas pelo `resolverConteudo` e voltam a
 * valer se o CS desfizer a troca. O schema filtra o que o painel mostra.
 */
export function levarConteudo(antiga: { content?: ConteudoDaSecao }): {
  content?: ConteudoDaSecao;
} {
  return antiga.content ? { content: antiga.content } : {};
}

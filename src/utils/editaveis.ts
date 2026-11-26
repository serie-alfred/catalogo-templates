import dados from '@/data/conteudo/editaveis.generated.json';

/**
 * Os campos de conteúdo que o LOJISTA consegue mudar depois do tema publicado,
 * na plataforma escolhida (`yarn derivar:editaveis`, a partir dos portes em
 * global-templates). O painel Conteúdo mostra só esses, e o preview desenha o
 * mock nos outros — o texto que fica fixo no tema —, para o CS não prometer um
 * texto que o cliente não consegue trocar.
 *
 * `null` = sem restrição: VTEX (o painel é o schema do CMS), sem plataforma, ou
 * peça fora do mapa.
 */
const DADOS = dados as unknown as {
  doProduto: Record<string, string[]>;
  daFicha: Record<string, string[]>;
  daCategoria: Record<string, string[]>;
  componentes: Record<string, Record<string, string[]>>;
};
const MAPA = DADOS.componentes;

/**
 * Os campos da peça que, na loja, vêm do CADASTRO de cada produto (a tag, os
 * acordeões da descrição…): editáveis em toda plataforma, e o painel diz isso.
 */
export function camposDoProduto(componente: string): readonly string[] {
  return DADOS.doProduto[componente] ?? [];
}

/**
 * Os campos do PRODUTO da loja (`description`, `specs`) que a peça da PDP desenha:
 * o painel da seção os oferece ali mesmo, editando o 1º produto (o da PDP).
 */
export function camposDaFicha(
  componente: string
): readonly ('description' | 'specs')[] {
  return (DADOS.daFicha[componente] ?? []) as ('description' | 'specs')[];
}

/**
 * Os campos da CATEGORIA da loja (`name`, `description`, `faq`) que a peça da
 * página de categoria desenha: o painel da seção os oferece ali mesmo.
 */
export function camposDaCategoria(
  componente: string
): readonly ('name' | 'description' | 'faq')[] {
  return (DADOS.daCategoria[componente] ?? []) as ('name' | 'description' | 'faq')[];
}

export function camposEditaveis(
  platform: string | null | undefined,
  componente: string
): readonly string[] | null {
  if (!platform || platform === 'VTEX') return null;
  const porPlataforma = MAPA[componente];
  if (!porPlataforma) return null;
  // A Wake legado saiu do seletor; o que sobrar dela segue a do Design Studio.
  return porPlataforma[platform === 'Wake' ? 'Wake 2.0' : platform] ?? null;
}

/**
 * Os subcampos editáveis de um campo-objeto (`topbar.socials` → `socials`).
 * `null` = o campo inteiro é editável; `[]` = nada dele é.
 */
export function subcamposEditaveis(
  editaveis: readonly string[] | null,
  campo: string
): readonly string[] | null {
  if (!editaveis || editaveis.includes(campo)) return null;
  return editaveis
    .filter(e => e.startsWith(`${campo}.`))
    .map(e => e.slice(campo.length + 1));
}

const ehObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * O conteúdo só com o que é editável (o mesmo objeto quando não há restrição).
 * Num campo-objeto editável só em parte, os subcampos fixos voltam ao `mock`: o
 * objeto vem inteiro no resolvedor, e o que o tema não deixa trocar fica o dele.
 */
export function soEditaveis<T extends object>(
  conteudo: T | undefined,
  editaveis: readonly string[] | null,
  mock: object = {}
): T | undefined {
  if (!conteudo || !editaveis) return conteudo;
  const doMock = mock as Record<string, unknown>;
  const saida: Record<string, unknown> = {};
  let mudou = false;
  for (const [campo, valor] of Object.entries(conteudo)) {
    const subs = subcamposEditaveis(editaveis, campo);
    if (!subs) saida[campo] = valor;
    else if (subs.length && ehObjeto(valor)) {
      const base = ehObjeto(doMock[campo]) ? doMock[campo] : {};
      saida[campo] = {
        ...base,
        ...Object.fromEntries(Object.entries(valor).filter(([k]) => subs.includes(k))),
      };
      mudou = true;
    } else mudou = true;
  }
  return mudou ? (saida as T) : conteudo;
}

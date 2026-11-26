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

/** O objeto só com as chaves editáveis (o mesmo objeto quando não há restrição). */
export function soEditaveis<T extends object>(
  conteudo: T | undefined,
  editaveis: readonly string[] | null
): T | undefined {
  if (!conteudo || !editaveis) return conteudo;
  const chaves = Object.keys(conteudo);
  if (chaves.every(k => editaveis.includes(k))) return conteudo;
  return Object.fromEntries(
    Object.entries(conteudo).filter(([k]) => editaveis.includes(k))
  ) as T;
}

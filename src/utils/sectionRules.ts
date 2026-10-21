/**
 * Regras por `selection` que o painel de seções, o canvas e o `toggleSelection`
 * aplicam — as três a partir DESTE arquivo.
 *
 * Antes o `toggleSelection` carregava a mesma lista escrita à mão em sete ramos
 * `if`, e um comentário aqui pedia "ao introduzir um novo singleton, atualize os
 * dois". Duas listas do mesmo conjunto divergem — foi exatamente assim que o botão
 * de duplicar apareceu em slots que o `toggleSelection` já tratava como singleton.
 * Agora só existe uma fonte: as duas metades abaixo, e a união derivada delas.
 */

/**
 * Singletons de PÁGINA COMUM: existem uma vez por página, nas três páginas ao
 * mesmo tempo. O `toggleSelection` os trata no ramo `pagina === 'common'`.
 */
export const COMMON_SINGLETON_SELECTIONS: ReadonlySet<string> = new Set([
  'header',
  'footer',
  'breadcrumb',
  'spot',
]);

/**
 * Singletons de UMA página: só um por página, e escolher outro SUBSTITUI o que
 * está lá, na mesma posição. O `toggleSelection` os trata num ramo só.
 *
 * `showcase` fica de fora de propósito: ele também é singleton, mas com semântica
 * própria — substitui TODAS as ocorrências (`map`), não só a primeira, porque uma
 * vitrine pode aparecer mais de uma vez na mesma página.
 *
 * `product-related` é singleton por causa da VTEX: os relacionados são override da
 * seção nativa `CrossSellingShelf` (o 01 auto-injeta `overrides/CrossSellingShelf01`,
 * o 09 é `overrides/CrossSellingShelf09`), e os dois achatam para o MESMO
 * `overrides/CrossSellingShelf.tsx` no tema — o VALIDATE do generator reprova o
 * config com dois. A seção nativa é uma só por PDP, então a escolha também.
 */
export const PAGE_SINGLETON_SELECTIONS: ReadonlySet<string> = new Set([
  'category-main',
  'category-description',
  'category-banner',
  'product-info',
  'product-description',
  'product-related',
  'banner-main',
  'banner-top',
]);

/**
 * Seções que não podem ser duplicadas — o botão de duplicar não aparece.
 *
 * A chave é o `selection` do `LayoutItem`, NÃO a `layoutKey`. A distinção é
 * load-bearing: a seção `bannerFull` mistura `banner-full` (duplicável) com
 * `category-banner` (singleton), então nenhuma regra por `layoutKey` consegue
 * separar os dois.
 *
 * **Derivado**, não escrito à mão: é a união das duas metades acima. `showcase`
 * não entra — ele é duplicável de propósito.
 */
export const NON_DUPLICABLE_SELECTIONS: ReadonlySet<string> = new Set([
  ...COMMON_SINGLETON_SELECTIONS,
  ...PAGE_SINGLETON_SELECTIONS,
]);

/**
 * Seções cuja posição é fixada por `getPriorityOrder` (header=0, breadcrumb=1,
 * footer=3) e que portanto ficam FORA da lista reordenável do painel — sem
 * handle de arraste. Assim o usuário nunca tenta um arraste que não teria
 * efeito, e `previewRender.getPriorityOrder` segue como única fonte de verdade
 * da ordem.
 *
 * Esta continua sendo por `layoutKey`: ela anda junto com `getPriorityOrder`,
 * que recebe `LayoutKey`.
 */
export const LOCKED_LAYOUT_KEYS: ReadonlySet<string> = new Set([
  'header',
  'breadcrumb',
  'footer',
]);

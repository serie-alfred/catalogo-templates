/**
 * Regras por `selection` que o painel de seções e o canvas aplicam.
 *
 * ATENÇÃO: este Set e os singletons de `useLayoutGenerator.toggleSelection`
 * descrevem o mesmo conjunto de slots "só um por página" por dois caminhos
 * diferentes. Ao introduzir um novo singleton, atualize os dois.
 */

/**
 * Seções que não podem ser duplicadas — o botão de duplicar não aparece.
 *
 * A chave é o `selection` do `LayoutItem`, NÃO a `layoutKey`. A distinção é
 * load-bearing: a seção `bannerFull` mistura `banner-full` (duplicável) com
 * `category-banner` (singleton), então nenhuma regra por `layoutKey` consegue
 * separar os dois.
 *
 * O conteúdo é exatamente o conjunto de singletons do `toggleSelection` — os
 * sete que têm ramo próprio, mais os quatro que a regra de `pagina === 'common'`
 * trata como um-por-página — menos `showcase`, que pode ser duplicado de
 * propósito.
 */
export const NON_DUPLICABLE_SELECTIONS: ReadonlySet<string> = new Set([
  'header',
  'footer',
  'breadcrumb',
  'spot',
  'category-main',
  'category-description',
  'category-banner',
  'product-info',
  'product-description',
  'banner-main',
  'banner-top',
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

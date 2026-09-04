/**
 * Regras por `layoutKey` que o painel de seções aplica.
 *
 * ATENÇÃO: `NON_DUPLICABLE_LAYOUT_KEYS` e os singletons de
 * `useLayoutGenerator.toggleSelection` descrevem o mesmo conjunto de slots
 * "só um por página" por dois caminhos diferentes. Ao introduzir um novo
 * singleton, atualize os dois.
 */

/**
 * Seções que não podem ser duplicadas — o botão de duplicar não aparece.
 * Lista herdada verbatim do antigo DraggablePreviewList.
 *
 * Tipada como ReadonlySet<string> (e não Set<LayoutKey>) porque `bannerTop`
 * não existe como chave em LAYOUTS: a entrada é inócua hoje e foi mantida de
 * propósito, para o dia em que esse slot existir.
 */
export const NON_DUPLICABLE_LAYOUT_KEYS: ReadonlySet<string> = new Set([
  'categoryMain',
  'productInfo',
  'header',
  'footer',
  'breadcrumb',
  'spot',
  'productDescription',
  'categoryDescription',
  'bannerTop',
  'bannerMain',
  'categoryBanner',
]);

/**
 * Seções cuja posição é fixada por `getPriorityOrder` (header=0, breadcrumb=1,
 * footer=3) e que portanto ficam FORA da lista reordenável do painel — sem
 * handle de arraste. Assim o usuário nunca tenta um arraste que não teria
 * efeito, e `previewRender.getPriorityOrder` segue como única fonte de verdade
 * da ordem.
 */
export const LOCKED_LAYOUT_KEYS: ReadonlySet<string> = new Set([
  'header',
  'breadcrumb',
  'footer',
]);

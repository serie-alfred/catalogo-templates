import type { LayoutKey } from '@/data/layoutData';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';

/**
 * Regras de renderização por página. Fonte de verdade única do que aparece em
 * cada página e em que ordem — consumida pelo ThemeRenderer (que serve /p, o
 * canvas do editor, o iframe mobile e o palco de export) e pelo SectionsPanel,
 * para que as visões nunca divirjam.
 */

/** Ordem de renderização: header no topo, breadcrumb, conteúdo, footer no fim. */
export function getPriorityOrder(key: LayoutKey): number {
  if (key === 'header') return 0;
  if (key === 'breadcrumb') return 1;
  if (key === 'footer') return 3;
  return 2;
}

/** Um item pertence à página atual? (`common` aparece em todas, com exceções.) */
export function belongsToPage(
  item: LayoutSelection,
  selectedPage: string
): boolean {
  // "spot" (card de produto) só aparece na visão "common".
  if (item.layoutKey === 'spot' && selectedPage !== 'common') {
    return false;
  }

  // breadcrumb "common" fica escondido na home.
  if (
    item.layoutKey === 'breadcrumb' &&
    selectedPage === 'home' &&
    item.pagina === 'common'
  ) {
    return false;
  }

  return item.pagina === selectedPage || item.pagina === 'common';
}

/** Filtra por página e ordena por prioridade (sem mutar o array de entrada). */
export function selectionsForPage(
  items: LayoutSelection[],
  selectedPage: string
): LayoutSelection[] {
  return items
    .filter(item => belongsToPage(item, selectedPage))
    .sort((a, b) => getPriorityOrder(a.layoutKey) - getPriorityOrder(b.layoutKey));
}

/** Páginas navegáveis do preview compartilhável e seus slugs de URL. */
export const PREVIEW_PAGES = [
  { slug: 'home', pagina: 'home', label: 'Home' },
  { slug: 'categoria', pagina: 'category', label: 'Categoria' },
  { slug: 'produto', pagina: 'product', label: 'Produto' },
] as const;

export type PreviewPageSlug = (typeof PREVIEW_PAGES)[number]['slug'];

/** Slug de URL (`categoria`) → `pagina` interna (`category`). null se inválido. */
export function slugToPagina(slug: string): string | null {
  return PREVIEW_PAGES.find(p => p.slug === slug)?.pagina ?? null;
}

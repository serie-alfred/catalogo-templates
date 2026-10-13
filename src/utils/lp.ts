import { LAYOUTS, type LayoutItem, type LayoutKey } from '@/data/layoutData';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';
import type { Platform } from '@/types/platform';

import { sanitizeSelections } from './platformCompat';

/**
 * O modo LP do /gerador: uma área à parte, como o checkout, em que o usuário
 * monta UMA landing page com qualquer componente de miolo do catálogo e exporta
 * só ela (`tipo: "lp"` no config). Não existe componente "só de LP": a LP é uma
 * página como a home, feita das mesmas seções.
 *
 * As seções da LP ficam fora de `layoutSelections`: a loja e a LP são dois
 * documentos, e trocar de modo não pode misturar um no outro.
 */
export interface LpState {
  nome: string;
  selections: LayoutSelection[];
}

/** Slug da URL da LP, derivado do nome: minúsculo, sem acento, com hífen. */
export function slugDaLp(nome: string): string {
  const slug = nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'lp';
}

/**
 * Componente de miolo: o que vai no `<main>` de uma página. Header, footer,
 * breadcrumb e spot são da loja (a LP herda os dela); seções de categoria e de
 * produto dependem do contexto daquela página (PLP, PDP) e não funcionam soltas.
 */
export function disponivelNaLp(item: LayoutItem, platform: Platform | null): boolean {
  return !!platform && item.pagina.includes('home') && item.platforms.includes(platform);
}

/**
 * A LP com que o modo abre pela primeira vez: a Black Friday do Figma
 * "Templates - Serie A", feita das seções da família 08. É um ponto de partida,
 * não um tipo — dá para tirar, trocar e somar qualquer outra seção.
 */
const COMPOSICAO_INICIAL: [LayoutKey, string][] = [
  ['banner', '08'],
  ['countdown', '08'],
  ['categories', '08'],
  ['showcase', '08'],
  ['bannerSide', '08'],
  ['editorial', '08'],
  ['ruler', '08'],
  ['newsletter', '08'],
];

export function lpInicial(): LpState {
  return {
    nome: 'Black Friday',
    // uid fixo: o 1º render do servidor e o do cliente precisam bater.
    selections: COMPOSICAO_INICIAL.filter(([key, id]) =>
      LAYOUTS[key]?.items.some(i => i.id === id)
    ).map(([layoutKey, id]) => ({
      uid: `lp-${layoutKey}-${id}`,
      id,
      layoutKey,
      pagina: 'home',
    })),
  };
}

/** `lp` lido do localStorage: nome em texto e só seções de miolo que ainda existem. */
export function sanitizeLp(value: unknown): LpState {
  if (!value || typeof value !== 'object') return lpInicial();
  const { nome, selections } = value as Partial<LpState>;
  return {
    nome: typeof nome === 'string' && nome.trim() ? nome : lpInicial().nome,
    selections: sanitizeSelections(selections).filter(s =>
      LAYOUTS[s.layoutKey].items.find(i => i.id === s.id)?.pagina.includes('home')
    ),
  };
}

import { LAYOUTS, type LayoutKey } from '@/data/layoutData';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';
import type { Platform } from '@/types/platform';

import { plataformaTemLp, sanitizeSelections } from './platformCompat';

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
 * A LP com que o modo abre pela primeira vez: a Black Friday do Figma
 * "Templates - Serie A", feita das seções da família 08. É um ponto de partida,
 * não um tipo — dá para tirar, trocar e somar qualquer outra seção.
 *
 * Plataforma sem a família 08 (a Wake 2.0 só tem a 10 e a 17) abre com as
 * mesmas oito seções da primeira família da lista que ela tem inteira: sem
 * isso a LP inicial seria feita de seções que o export dela descarta.
 */
const COMPOSICAO_INICIAL: LayoutKey[] = [
  'banner',
  'countdown',
  'categories',
  'showcase',
  'bannerSide',
  'editorial',
  'ruler',
  'newsletter',
];
const FAMILIAS_INICIAIS = ['08', '10'];

export function lpInicial(platform: Platform | null = null): LpState {
  const id =
    FAMILIAS_INICIAIS.find(
      f =>
        !platform ||
        COMPOSICAO_INICIAL.every(key =>
          LAYOUTS[key]?.items.find(i => i.id === f)?.platforms.includes(platform)
        )
    ) ?? FAMILIAS_INICIAIS[0];
  return {
    nome: 'Black Friday',
    // uid fixo: o 1º render do servidor e o do cliente precisam bater.
    selections: COMPOSICAO_INICIAL.filter(key =>
      LAYOUTS[key]?.items.some(i => i.id === id)
    ).map(layoutKey => ({
      uid: `lp-${layoutKey}-${id}`,
      id,
      layoutKey,
      pagina: 'home',
    })),
  };
}

/**
 * `lp` lido do localStorage (ou de um tema salvo): nome em texto e só seções de
 * miolo que ainda existem — e, numa plataforma com modo LP, que ela oferece. Sem
 * esse filtro o canvas mostrava seções que o `buildLpConfigJson` descarta em
 * silêncio. Plataforma sem LP (Tray) não filtra: a LP fica guardada como está.
 */
export function sanitizeLp(value: unknown, platform: Platform | null): LpState {
  if (!value || typeof value !== 'object') return lpInicial(platform);
  const { nome, selections } = value as Partial<LpState>;
  const filtra = plataformaTemLp(platform) ? platform : null;
  return {
    nome: typeof nome === 'string' && nome.trim() ? nome : lpInicial().nome,
    selections: sanitizeSelections(selections).filter(s => {
      const item = LAYOUTS[s.layoutKey].items.find(i => i.id === s.id);
      return (
        !!item?.pagina.includes('home') &&
        (!filtra || item.platforms.includes(filtra))
      );
    }),
  };
}

// Espelha `organisms/MainCategory11/facets.ts` do faststore.starter (cópia literal: funções puras).
/*
 * Facetas da PLP 11 — o que o contrato (§4) deixa a PLP oferecer, a partir das facetas que a
 * busca da VTEX devolve (`usePLP().data.search.facets`):
 * Categoria (o nível logo abaixo da página), Marca, Tamanho, Cor por nome, Preço e no máximo
 * UMA especificação (a chave vem do CMS). Qualquer outra faceta é descartada.
 *
 * Ordem do desenho `CategoryMain11`: [01] Categoria, [02] a especificação, [03] Preço (Marca e
 * Tamanho, que o desenho não mostra, entram antes da especificação; Cor, no lugar do "[04]
 * Material" — uma 2ª especificação, que o contrato não permite —, por último).
 */

export interface FacetValue11 {
  value: string;
  label: string;
  selected?: boolean;
  quantity?: number;
}

/** Formato da faceta como a busca entrega (StoreFacetBoolean | StoreFacetRange). */
export interface RawFacet11 {
  __typename?: string;
  key: string;
  label: string;
  values?: FacetValue11[];
  min?: { absolute: number; selected?: number };
  max?: { absolute: number; selected?: number };
}

/** `list` = checkbox (todas, como no desenho); `price` = faixa + mínimo/máximo. */
export type FacetKind11 = 'list' | 'price';

export interface Facet11 {
  key: string;
  label: string;
  kind: FacetKind11;
  /** A Categoria: o chip ativo dela não leva o nome da faceta (desenho: "Mesa"). */
  isCategory: boolean;
  values: FacetValue11[];
  min: number;
  max: number;
}

export interface Selected11 {
  key: string;
  value: string;
}

const norm = (s: string) =>
  (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

const SIZE = /^(tamanho|tamanhos|size|sizes)$/;
const COLOR = /^(cor|cores|color|colors)$/;

/** Facetas que DEFINEM a página (nível de categoria da rota + comportamento da busca). */
export function isScopeFacet(f: { key: string }, pageLevel: number) {
  if (f.key === 'fuzzy' || f.key === 'operator') return true;
  const lvl = /^category-(\d+)$/.exec(f.key)?.[1];
  return !!lvl && Number(lvl) <= pageLevel;
}

export function pickFacets(
  raw: RawFacet11[],
  pageLevel: number,
  specKey?: string
): Facet11[] {
  const spec = norm(specKey ?? '');
  const out: { order: number; facet: Facet11 }[] = [];
  const used: Record<number, boolean> = {};
  raw.forEach(f => {
    if (!f?.key || isScopeFacet(f, pageLevel)) return;
    const k = norm(f.key);
    const l = norm(f.label);
    let order = -1;
    if (f.__typename === 'StoreFacetRange' || k === 'price') order = 4;
    else if (k === `category-${pageLevel + 1}`) order = 0;
    else if (k === 'brand') order = 1;
    else if (SIZE.test(k) || SIZE.test(l)) order = 2;
    else if (spec && (k === spec || l === spec)) order = 3;
    else if (COLOR.test(k) || COLOR.test(l)) order = 5;
    if (order < 0 || used[order]) return;
    const kind: FacetKind11 = order === 4 ? 'price' : 'list';
    if (
      kind === 'price'
        ? !(Number(f.max?.absolute) > Number(f.min?.absolute))
        : !(f.values ?? []).length
    )
      return;
    used[order] = true;
    out.push({
      order,
      facet: {
        key: f.key,
        label: f.label,
        kind,
        isCategory: order === 0,
        values: f.values ?? [],
        min: Math.floor(f.min?.absolute ?? 0),
        max: Math.ceil(f.max?.absolute ?? 0),
      },
    });
  });
  return out.sort((a, b) => a.order - b.order).map(x => x.facet);
}

export const moeda = (n: number) =>
  `R$ ${Math.round(n).toLocaleString('pt-BR')}`;

/** Valor de faixa no formato da busca (`min-to-max`, como o FilterFacetRange nativo). */
export const rangeValue = (lo: number, hi: number) =>
  `${Math.round(lo)}-to-${Math.round(hi)}`;

export function parseRange(value?: string): [number, number] | null {
  const [a, b] = String(value ?? '')
    .split('-to-')
    .map(Number);
  return isFinite(a) && isFinite(b) ? [a, b] : null;
}

/** Só o nome do valor (ou a faixa de preço), sem o nome da faceta. */
export function valueLabel(s: Selected11, facets: Facet11[]) {
  const f = facets.find(x => x.key === s.key);
  const r =
    f?.kind === 'price' || s.value.includes('-to-')
      ? parseRange(s.value)
      : null;
  if (r) return `${moeda(r[0])} a ${moeda(r[1])}`;
  return f?.values.find(v => v.value === s.value)?.label ?? s.value;
}

/** Prefixo do chip ativo no desktop ("Acabamento: "); a Categoria vai sem ele. */
export function chipPrefix(s: Selected11, facets: Facet11[]) {
  const f = facets.find(x => x.key === s.key);
  return f && !f.isCategory ? `${f.label}: ` : '';
}

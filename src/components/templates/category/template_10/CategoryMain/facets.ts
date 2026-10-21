// Espelha `organisms/MainCategory10/facets.ts` do faststore.starter (cópia literal: funções puras).
/*
 * Facetas da PLP 10 — o que o contrato (§4) deixa a PLP oferecer, a partir das facetas que a
 * busca da VTEX devolve (`usePLP().data.search.facets`):
 * Categoria (o nível logo abaixo da página), Marca, Tamanho, Cor por nome, Preço e no máximo
 * UMA especificação (a chave vem do CMS). Qualquer outra faceta é descartada.
 * Ordem do desenho `CategoryMain10`: Marca, Preço, a especificação e Cor (Categoria e Tamanho,
 * que o desenho não mostra, entram antes da Marca e antes da especificação).
 */

export interface FacetValue10 {
  value: string;
  label: string;
  selected?: boolean;
  quantity?: number;
}

/** Formato da faceta como a busca entrega (StoreFacetBoolean | StoreFacetRange). */
export interface RawFacet10 {
  __typename?: string;
  key: string;
  label: string;
  values?: FacetValue10[];
  min?: { absolute: number; selected?: number };
  max?: { absolute: number; selected?: number };
}

/** `list` = checkbox (com busca na Marca); `buttons` = botões (Tamanho e a especificação). */
export type FacetKind10 = 'list' | 'buttons' | 'price';

export interface Facet10 {
  key: string;
  label: string;
  kind: FacetKind10;
  /** Marca: a lista ganha a caixa de busca e o cabeçalho recolhível, como no desenho. */
  searchable: boolean;
  values: FacetValue10[];
  min: number;
  max: number;
}

export interface Selected10 {
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
  raw: RawFacet10[],
  pageLevel: number,
  specKey?: string
): Facet10[] {
  const spec = norm(specKey ?? '');
  const out: { order: number; facet: Facet10 }[] = [];
  const used: Record<number, boolean> = {};
  raw.forEach(f => {
    if (!f?.key || isScopeFacet(f, pageLevel)) return;
    const k = norm(f.key);
    const l = norm(f.label);
    let kind: FacetKind10 | null = null;
    let order = 0;
    if (f.__typename === 'StoreFacetRange' || k === 'price') {
      kind = 'price';
      order = 2;
    } else if (k === `category-${pageLevel + 1}`) {
      kind = 'list';
      order = 0;
    } else if (k === 'brand') {
      kind = 'list';
      order = 1;
    } else if (SIZE.test(k) || SIZE.test(l)) {
      kind = 'buttons';
      order = 3;
    } else if (spec && (k === spec || l === spec)) {
      kind = 'buttons';
      order = 4;
    } else if (COLOR.test(k) || COLOR.test(l)) {
      kind = 'list';
      order = 5;
    }
    if (!kind || used[order]) return;
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
        searchable: order === 1,
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

/** Rótulo do chip ativo: o nome do valor na faceta, ou a faixa de preço. */
export function selectedLabel(s: Selected10, facets: Facet10[]) {
  const f = facets.find(x => x.key === s.key);
  const r =
    f?.kind === 'price' || s.value.includes('-to-')
      ? parseRange(s.value)
      : null;
  if (r) return `${moeda(r[0])} a ${moeda(r[1])}`;
  return f?.values.find(v => v.value === s.value)?.label ?? s.value;
}

/** Plural simples do nome da faceta para o "Ver mais N marcas" (marca → marcas, cor → cores). */
export function plural(label: string) {
  const l = label.toLocaleLowerCase('pt-BR');
  return /[rsz]$/.test(l) ? `${l}es` : `${l}s`;
}

/** Páginas da paginação: 1, vizinhas da atual e a última, com reticências nos saltos. */
export function pageList(current: number, last: number): Array<number | null> {
  const set: Record<number, true> = {
    1: true,
    [last]: true,
    [current - 1]: true,
    [current]: true,
    [current + 1]: true,
  };
  if (current <= 2) set[3] = true;
  if (current >= last - 1) set[last - 2] = true;
  const nums = Object.keys(set)
    .map(Number)
    .filter(n => n >= 1 && n <= last)
    .sort((a, b) => a - b);
  const out: Array<number | null> = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push(null);
    out.push(n);
  });
  return out;
}

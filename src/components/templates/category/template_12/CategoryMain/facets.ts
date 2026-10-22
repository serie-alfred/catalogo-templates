// Espelha `organisms/MainCategory12/facets.ts` do faststore.starter (cópia literal: funções puras).
/*
 * Facetas da PLP 12 — o que o contrato (§4) deixa a PLP oferecer, a partir das facetas que a
 * busca da VTEX devolve (`usePLP().data.search.facets`):
 * Categoria (o nível logo abaixo da página), Marca, Tamanho, Cor por nome, Preço e no máximo
 * UMA especificação (a chave vem do CMS). Qualquer outra faceta é descartada.
 *
 * Ordem do desenho `CategoryMain12`: Categoria, a especificação ("Tipo de pele", em pílulas),
 * Faixa de preço (pílulas) e Marca (busca + lista). Tamanho (pílulas) e Cor por nome (lista), que
 * o desenho não mostra, entram antes da especificação e depois da Marca.
 */

export interface FacetValue12 {
  value: string;
  label: string;
  selected?: boolean;
  quantity?: number;
}

/** Formato da faceta como a busca entrega (StoreFacetBoolean | StoreFacetRange). */
export interface RawFacet12 {
  __typename?: string;
  key: string;
  label: string;
  values?: FacetValue12[];
  min?: { absolute: number; selected?: number };
  max?: { absolute: number; selected?: number };
}

/** `list` = checkbox (com busca na Marca); `pills` = pílulas (Tamanho, especificação); `price` = faixas. */
export type FacetKind12 = 'list' | 'pills' | 'price';

export interface Facet12 {
  key: string;
  label: string;
  kind: FacetKind12;
  /** Marca: a lista ganha a caixa de busca, como no desenho. */
  searchable: boolean;
  values: FacetValue12[];
  min: number;
  max: number;
}

export interface Selected12 {
  key: string;
  value: string;
}

/** Uma faixa de preço do filtro (pílula): o valor vai à busca como `lo-to-hi`. */
export interface PriceBucket12 {
  label: string;
  value: string;
  lo: number;
  hi: number;
}

const norm = (s: string) =>
  (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

const SIZE = /^(tamanho|tamanhos|size|sizes)$/;
const COLOR = /^(cor|cores|color|colors)$/;

/** Teto da última faixa ("Acima de R$ 200"): fixo, para o valor não mudar quando a busca refiltra. */
export const PRICE_CEIL = 999999;

/** Facetas que DEFINEM a página (nível de categoria da rota + comportamento da busca). */
export function isScopeFacet(f: { key: string }, pageLevel: number) {
  if (f.key === 'fuzzy' || f.key === 'operator') return true;
  const lvl = /^category-(\d+)$/.exec(f.key)?.[1];
  return !!lvl && Number(lvl) <= pageLevel;
}

export function pickFacets(
  raw: RawFacet12[],
  pageLevel: number,
  specKey?: string
): Facet12[] {
  const spec = norm(specKey ?? '');
  const out: { order: number; facet: Facet12 }[] = [];
  const used: Record<number, boolean> = {};
  raw.forEach(f => {
    if (!f?.key || isScopeFacet(f, pageLevel)) return;
    const k = norm(f.key);
    const l = norm(f.label);
    let kind: FacetKind12 | null = null;
    let order = 0;
    if (f.__typename === 'StoreFacetRange' || k === 'price') {
      kind = 'price';
      order = 3;
    } else if (k === `category-${pageLevel + 1}`) {
      kind = 'list';
      order = 0;
    } else if (k === 'brand') {
      kind = 'list';
      order = 4;
    } else if (SIZE.test(k) || SIZE.test(l)) {
      kind = 'pills';
      order = 1;
    } else if (spec && (k === spec || l === spec)) {
      kind = 'pills';
      order = 2;
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
        searchable: order === 4,
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

const fill = (tpl: string, vars: Record<string, string>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

/**
 * Faixas de preço a partir dos limites do CMS ("50, 100, 200" → Até R$ 50 · R$ 50 a R$ 100 ·
 * R$ 100 a R$ 200 · Acima de R$ 200). Só entram as que cruzam o intervalo que a busca devolve.
 */
export function priceBuckets(
  steps: string | undefined,
  facet: Facet12,
  labels: { upTo: string; between: string; over: string }
): PriceBucket12[] {
  const nums = String(steps ?? '')
    .split(/[^\d.]+/)
    .map(Number)
    .filter(n => n > 0)
    .sort((a, b) => a - b)
    .filter((n, i, a) => a.indexOf(n) === i);
  if (!nums.length) return [];
  const out: PriceBucket12[] = [];
  const add = (lo: number, hi: number, label: string) => {
    if (hi <= facet.min || lo >= facet.max) return;
    out.push({ label, value: rangeValue(lo, hi), lo, hi });
  };
  add(0, nums[0], fill(labels.upTo, { max: moeda(nums[0]) }));
  for (let i = 1; i < nums.length; i++) {
    add(
      nums[i - 1],
      nums[i],
      fill(labels.between, { min: moeda(nums[i - 1]), max: moeda(nums[i]) })
    );
  }
  add(
    nums[nums.length - 1],
    PRICE_CEIL,
    fill(labels.over, { min: moeda(nums[nums.length - 1]) })
  );
  return out;
}

/** Rótulo do chip ativo: o nome do valor, a faixa do CMS que bate, ou a faixa crua. */
export function selectedLabel(
  s: Selected12,
  facets: Facet12[],
  buckets: PriceBucket12[]
) {
  const f = facets.find(x => x.key === s.key);
  const isPrice = f?.kind === 'price' || s.value.includes('-to-');
  if (isPrice) {
    const b = buckets.find(x => x.value === s.value);
    if (b) return b.label;
    const r = parseRange(s.value);
    if (r) return `${moeda(r[0])} a ${moeda(r[1])}`;
  }
  return f?.values.find(v => v.value === s.value)?.label ?? s.value;
}

/** Plural simples do nome da faceta ("Ver todas as marcas"; cor → cores). */
export function plural(label: string) {
  const l = label.toLocaleLowerCase('pt-BR');
  return /[rsz]$/.test(l) ? `${l}es` : `${l}s`;
}

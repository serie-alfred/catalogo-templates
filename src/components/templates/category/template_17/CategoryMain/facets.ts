/*
 * Facetas da PLP 17 — o que o contrato (§4) deixa a PLP oferecer, a partir das facetas que a
 * busca da VTEX devolve (`usePLP().data.search.facets`):
 * Categoria, Marca, Tamanho, Cor por nome, Preço e no máximo UMA especificação (a chave vem do
 * CMS; no desenho, o "Porte"). Qualquer outra faceta é descartada.
 *
 * A Categoria aparece em DOIS lugares, em níveis diferentes:
 *  - os atalhos por espécie no topo são os valores de `category-1` (o departamento: Cães, Gatos…);
 *  - a lista "Categoria" da coluna é o nível logo abaixo da página (e nunca o `category-1`
 *    quando os atalhos estão ligados, para não repetir a mesma escolha).
 *
 * Ordem do desenho `CategoryMain17`: Categoria (lista), Marca (lista), Porte (pílulas) e Preço
 * (faixas em rádio). Tamanho (pílulas) e Cor (lista), que o desenho não mostra, entram depois da
 * especificação.
 */

export interface FacetValue17 {
  value: string;
  label: string;
  selected?: boolean;
  quantity?: number;
}

/** Formato da faceta como a busca entrega (StoreFacetBoolean | StoreFacetRange). */
export interface RawFacet17 {
  __typename?: string;
  key: string;
  label: string;
  values?: FacetValue17[];
  min?: { absolute: number; selected?: number };
  max?: { absolute: number; selected?: number };
}

/** `list` = checkbox; `pills` = pílulas (especificação, Tamanho); `price` = faixas em rádio. */
export type FacetKind17 = 'list' | 'pills' | 'price';

export interface Facet17 {
  key: string;
  label: string;
  kind: FacetKind17;
  /** A faceta da especificação do CMS (o chip ativo leva o nome dela: "Porte: Médio"). */
  spec: boolean;
  values: FacetValue17[];
  min: number;
  max: number;
}

export interface Selected17 {
  key: string;
  value: string;
}

/** Uma faixa de preço do filtro: o valor vai à busca como `lo-to-hi`. */
export interface PriceBucket17 {
  label: string;
  value: string;
  lo: number;
  hi: number;
}

export const norm = (s: string) =>
  (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

const SIZE = /^(tamanho|tamanhos|size|sizes)$/;
const COLOR = /^(cor|cores|color|colors)$/;

/** A faceta dos atalhos por espécie: o departamento. */
export const SPECIES_KEY = 'category-1';

/** Teto da última faixa ("Acima de R$ 300"): fixo, para o valor não mudar quando a busca refiltra. */
export const PRICE_CEIL = 999999;

/** Facetas que DEFINEM a página (nível de categoria da rota + comportamento da busca). */
export function isScopeFacet(f: { key: string }, pageLevel: number) {
  if (f.key === 'fuzzy' || f.key === 'operator') return true;
  const lvl = /^category-(\d+)$/.exec(f.key)?.[1];
  return !!lvl && Number(lvl) <= pageLevel;
}

/**
 * Facetas da coluna. `catLevel` = o nível da lista "Categoria" (o de baixo da página; com os
 * atalhos ligados, nunca o 1).
 */
export function pickFacets(
  raw: RawFacet17[],
  pageLevel: number,
  catLevel: number,
  specKey?: string
): Facet17[] {
  const spec = norm(specKey ?? '');
  const out: { order: number; facet: Facet17 }[] = [];
  const used: Record<number, boolean> = {};
  raw.forEach(f => {
    if (!f?.key || isScopeFacet(f, pageLevel)) return;
    const k = norm(f.key);
    const l = norm(f.label);
    let kind: FacetKind17 | null = null;
    let order = 0;
    if (f.__typename === 'StoreFacetRange' || k === 'price') {
      kind = 'price';
      order = 5;
    } else if (k === `category-${catLevel}`) {
      kind = 'list';
      order = 0;
    } else if (/^category-\d+$/.test(k)) {
      return;
    } else if (k === 'brand') {
      kind = 'list';
      order = 1;
    } else if (spec && (k === spec || l === spec)) {
      kind = 'pills';
      order = 2;
    } else if (SIZE.test(k) || SIZE.test(l)) {
      kind = 'pills';
      order = 3;
    } else if (COLOR.test(k) || COLOR.test(l)) {
      kind = 'list';
      order = 4;
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
        spec: order === 2,
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
export const rangeValue = (lo: number, hi: number) => `${lo}-to-${hi}`;

export function parseRange(value?: string): [number, number] | null {
  const [a, b] = String(value ?? '')
    .split('-to-')
    .map(Number);
  return isFinite(a) && isFinite(b) ? [a, b] : null;
}

const fill = (tpl: string, vars: Record<string, string>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

/**
 * Faixas de preço a partir dos limites do CMS ("50, 150, 300" → Até R$ 50 · R$ 50 a R$ 150 ·
 * R$ 150 a R$ 300 · Acima de R$ 300, como o desenho). O rótulo usa os limites redondos; o VALOR
 * de cada faixa vai de um limite até um centavo antes do próximo, para nenhuma se sobrepor. Só
 * entram as que cruzam o intervalo que a busca devolve.
 */
export function priceBuckets(
  steps: string | undefined,
  facet: Facet17,
  labels: { upTo: string; between: string; over: string }
): PriceBucket17[] {
  const nums = String(steps ?? '')
    .split(/[^\d.]+/)
    .map(Number)
    .filter(n => n > 0)
    .sort((a, b) => a - b)
    .filter((n, i, a) => a.indexOf(n) === i);
  if (!nums.length) return [];
  const out: PriceBucket17[] = [];
  const teto = (n: number) => Math.round((n - 0.01) * 100) / 100;
  const add = (lo: number, hi: number, label: string) => {
    if (hi <= facet.min || lo >= facet.max) return;
    out.push({ label, value: rangeValue(lo, hi), lo, hi });
  };
  add(0, teto(nums[0]), fill(labels.upTo, { max: moeda(nums[0]) }));
  for (let i = 1; i < nums.length; i++) {
    add(
      nums[i - 1],
      teto(nums[i]),
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
  s: Selected17,
  facets: Facet17[],
  buckets: PriceBucket17[],
  species?: RawFacet17
) {
  const f = facets.find(x => x.key === s.key);
  const isPrice = f?.kind === 'price' || s.value.includes('-to-');
  if (isPrice) {
    const b = buckets.find(x => x.value === s.value);
    if (b) return b.label;
    const r = parseRange(s.value);
    if (r) return `${moeda(r[0])} a ${moeda(r[1])}`;
  }
  const values =
    f?.values ?? (s.key === species?.key ? species?.values : undefined) ?? [];
  return values.find(v => v.value === s.value)?.label ?? s.value;
}

/** Plural simples do nome da faceta ("Ver mais 6 marcas"; cor → cores). */
export function plural(label: string) {
  const l = label.toLocaleLowerCase('pt-BR');
  return /[rsz]$/.test(l) ? `${l}es` : `${l}s`;
}

/** Ícone do atalho por espécie, casado pelo NOME do valor; o que não casa leva a patinha. */
export type Species17 =
  | 'dog'
  | 'cat'
  | 'bird'
  | 'fish'
  | 'rodent'
  | 'reptile'
  | 'paw';

const SPECIES: Array<[Species17, RegExp]> = [
  ['dog', /\b(cao|caes|cachorros?|caninos?|dogs?|filhotes? de cao)\b/],
  ['cat', /\b(gatos?|gatas?|felinos?|cats?)\b/],
  [
    'bird',
    /\b(passaros?|aves?|calopsitas?|periquitos?|canarios?|papagaios?|birds?)\b/,
  ],
  ['fish', /\b(peixes?|aquarios?|aquarismo|fish)\b/],
  [
    'rodent',
    /\b(roedores?|hamsters?|coelhos?|porquinhos?|chinchilas?|furoes?)\b/,
  ],
  ['reptile', /\b(repteis|reptil|tartarugas?|jabutis?|lagartos?|cobras?)\b/],
];

export function speciesIcon(label: string): Species17 {
  const l = norm(label);
  return SPECIES.find(([, re]) => re.test(l))?.[0] ?? 'paw';
}

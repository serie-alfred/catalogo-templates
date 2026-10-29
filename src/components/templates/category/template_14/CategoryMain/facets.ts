// Espelha `organisms/MainCategory14/facets.ts` do faststore.starter (cópia literal: funções puras).
/*
 * Facetas da PLP 14 — o que o contrato (§4) deixa a PLP oferecer, a partir das facetas que a
 * busca da VTEX devolve (`usePLP().data.search.facets`):
 * Categoria (o nível logo abaixo da página), Marca, Tamanho, Cor por nome, Preço e no máximo
 * UMA especificação (a chave vem do CMS). Qualquer outra faceta é descartada.
 *
 * Ordem do desenho `CategoryMain14`: a especificação ("Modalidade") vira a fileira de chips grandes
 * acima da barra (no painel do mobile, o 1º item do acordeão); na coluna, Categoria (lista),
 * Tamanho (grade de botões), Cor (lista), Preço (faixas em rádio) e Marca (lista).
 */

export interface FacetValue14 {
  value: string
  label: string
  selected?: boolean
  quantity?: number
}

/** Formato da faceta como a busca entrega (StoreFacetBoolean | StoreFacetRange). */
export interface RawFacet14 {
  __typename?: string
  key: string
  label: string
  values?: FacetValue14[]
  min?: { absolute: number; selected?: number }
  max?: { absolute: number; selected?: number }
}

/**
 * `list` = checkbox; `pills` = grade de botões (Tamanho); `price` = faixas em rádio;
 * `spec` = a especificação do CMS, escolha única (fileira de chips no topo).
 */
export type FacetKind14 = 'list' | 'pills' | 'price' | 'spec'

export interface Facet14 {
  key: string
  label: string
  kind: FacetKind14
  values: FacetValue14[]
  min: number
  max: number
}

export interface Selected14 {
  key: string
  value: string
}

/** Uma faixa de preço do filtro (rádio): o valor vai à busca como `lo-to-hi`. */
export interface PriceBucket14 {
  label: string
  value: string
  lo: number
  hi: number
}

const norm = (s: string) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()

const SIZE = /^(tamanho|tamanhos|size|sizes)$/
const COLOR = /^(cor|cores|color|colors)$/

/** Teto da última faixa ("Acima de R$ 200"): fixo, para o valor não mudar quando a busca refiltra. */
export const PRICE_CEIL = 999999

/** Facetas que DEFINEM a página (nível de categoria da rota + comportamento da busca). */
export function isScopeFacet(f: { key: string }, pageLevel: number) {
  if (f.key === 'fuzzy' || f.key === 'operator') return true
  const lvl = /^category-(\d+)$/.exec(f.key)?.[1]
  return !!lvl && Number(lvl) <= pageLevel
}

export function pickFacets(raw: RawFacet14[], pageLevel: number, specKey?: string): Facet14[] {
  const spec = norm(specKey ?? '')
  const out: { order: number; facet: Facet14 }[] = []
  const used: Record<number, boolean> = {}
  raw.forEach((f) => {
    if (!f?.key || isScopeFacet(f, pageLevel)) return
    const k = norm(f.key)
    const l = norm(f.label)
    let kind: FacetKind14 | null = null
    let order = 0
    if (f.__typename === 'StoreFacetRange' || k === 'price') {
      kind = 'price'
      order = 4
    } else if (k === `category-${pageLevel + 1}`) {
      kind = 'list'
      order = 1
    } else if (k === 'brand') {
      kind = 'list'
      order = 5
    } else if (spec && (k === spec || l === spec)) {
      kind = 'spec'
      order = 0
    } else if (SIZE.test(k) || SIZE.test(l)) {
      kind = 'pills'
      order = 2
    } else if (COLOR.test(k) || COLOR.test(l)) {
      kind = 'list'
      order = 3
    }
    if (!kind || used[order]) return
    if (kind === 'price' ? !(Number(f.max?.absolute) > Number(f.min?.absolute)) : !(f.values ?? []).length) return
    used[order] = true
    out.push({
      order,
      facet: {
        key: f.key,
        label: f.label,
        kind,
        values: f.values ?? [],
        min: Math.floor(f.min?.absolute ?? 0),
        max: Math.ceil(f.max?.absolute ?? 0),
      },
    })
  })
  return out.sort((a, b) => a.order - b.order).map((x) => x.facet)
}

export const moeda = (n: number) => `R$ ${Math.round(n).toLocaleString('pt-BR')}`

/** Valor de faixa no formato da busca (`min-to-max`, como o FilterFacetRange nativo). */
export const rangeValue = (lo: number, hi: number) => `${Math.round(lo)}-to-${Math.round(hi)}`

export function parseRange(value?: string): [number, number] | null {
  const [a, b] = String(value ?? '').split('-to-').map(Number)
  return isFinite(a) && isFinite(b) ? [a, b] : null
}

const fill = (tpl: string, vars: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')

/**
 * Faixas de preço a partir dos limites do CMS ("50, 100, 200" → Até R$ 50 · R$ 50 a R$ 100 ·
 * R$ 100 a R$ 200 · Acima de R$ 200). Só entram as que cruzam o intervalo que a busca devolve.
 */
export function priceBuckets(
  steps: string | undefined,
  facet: Facet14,
  labels: { upTo: string; between: string; over: string }
): PriceBucket14[] {
  const nums = String(steps ?? '')
    .split(/[^\d.]+/)
    .map(Number)
    .filter((n) => n > 0)
    .sort((a, b) => a - b)
    .filter((n, i, a) => a.indexOf(n) === i)
  if (!nums.length) return []
  const out: PriceBucket14[] = []
  const add = (lo: number, hi: number, label: string) => {
    if (hi <= facet.min || lo >= facet.max) return
    out.push({ label, value: rangeValue(lo, hi), lo, hi })
  }
  add(0, nums[0], fill(labels.upTo, { max: moeda(nums[0]) }))
  for (let i = 1; i < nums.length; i++) {
    add(nums[i - 1], nums[i], fill(labels.between, { min: moeda(nums[i - 1]), max: moeda(nums[i]) }))
  }
  add(nums[nums.length - 1], PRICE_CEIL, fill(labels.over, { min: moeda(nums[nums.length - 1]) }))
  return out
}

/** Rótulo do chip ativo: o nome do valor, a faixa do CMS que bate, ou a faixa crua. */
export function selectedLabel(s: Selected14, facets: Facet14[], buckets: PriceBucket14[]) {
  const f = facets.find((x) => x.key === s.key)
  const isPrice = f?.kind === 'price' || s.value.includes('-to-')
  if (isPrice) {
    const b = buckets.find((x) => x.value === s.value)
    if (b) return b.label
    const r = parseRange(s.value)
    if (r) return `${moeda(r[0])} a ${moeda(r[1])}`
  }
  return f?.values.find((v) => v.value === s.value)?.label ?? s.value
}

/** Plural simples do nome da faceta ("Ver mais 5 cores"; marca → marcas). */
export function plural(label: string) {
  const l = label.toLocaleLowerCase('pt-BR')
  return /[rsz]$/.test(l) ? `${l}es` : `${l}s`
}

/** Páginas da paginação: 1, vizinhas da atual e a última, com reticências nos saltos. */
export function pageList(current: number, last: number): Array<number | null> {
  const set: Record<number, true> = { 1: true, [last]: true, [current - 1]: true, [current]: true, [current + 1]: true }
  if (current <= 2) set[3] = true
  if (current >= last - 1) set[last - 2] = true
  const nums = Object.keys(set)
    .map(Number)
    .filter((n) => n >= 1 && n <= last)
    .sort((a, b) => a - b)
  const out: Array<number | null> = []
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push(null)
    out.push(n)
  })
  return out
}

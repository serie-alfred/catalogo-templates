/*
 * Cópia de `organisms/MainCategory15/facets.ts` do faststore.starter (família 15), sem mudança de
 * lógica — as funções são puras e servem a réplica igual servem lá.
 *
 * Facetas da PLP 15 — o que o contrato (§4) deixa a PLP oferecer, a partir das facetas que a
 * busca da VTEX devolve (`usePLP().data.search.facets`):
 * Categoria (o nível logo abaixo da página), Marca, Tamanho (ou Aro), Cor por nome, Preço e no máximo
 * UMA especificação (a chave vem do CMS). Qualquer outra faceta é descartada.
 */

export interface FacetValue15 {
  value: string
  label: string
  selected?: boolean
  quantity?: number
}

/** Formato da faceta como a busca entrega (StoreFacetBoolean | StoreFacetRange). */
export interface RawFacet15 {
  __typename?: string
  key: string
  label: string
  values?: FacetValue15[]
  min?: { absolute: number; selected?: number }
  max?: { absolute: number; selected?: number }
}

export type FacetKind15 = 'list' | 'size' | 'color' | 'price'

export interface Facet15 {
  key: string
  label: string
  kind: FacetKind15
  values: FacetValue15[]
  min: number
  max: number
}

export interface Selected15 {
  key: string
  value: string
}

const norm = (s: string) =>
  (s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase()

// Joalheria: o tamanho costuma se chamar "Aro" e a cor, "Cor do metal" (contrato: Tamanho/Aro e Cor por nome).
const SIZE = /^(tamanho|tamanhos|size|sizes|aro|tamanho do aro)$/
const COLOR = /^(cor|cores|color|colors)( d[oae]s? [a-z ]+)?$/

/** Facetas que DEFINEM a página (nível de categoria da rota + comportamento da busca). */
export function isScopeFacet(f: { key: string }, pageLevel: number) {
  if (f.key === 'fuzzy' || f.key === 'operator') return true
  const lvl = /^category-(\d+)$/.exec(f.key)?.[1]
  return !!lvl && Number(lvl) <= pageLevel
}

export function pickFacets(raw: RawFacet15[], pageLevel: number, specKey?: string): Facet15[] {
  const spec = norm(specKey ?? '')
  const out: { order: number; facet: Facet15 }[] = []
  const used: Record<string, boolean> = {}
  raw.forEach((f) => {
    if (!f?.key || isScopeFacet(f, pageLevel)) return
    const k = norm(f.key)
    const l = norm(f.label)
    let kind: FacetKind15 | null = null
    let order = 0
    if (f.__typename === 'StoreFacetRange' || k === 'price') {
      kind = 'price'
      order = 4
    } else if (k === `category-${pageLevel + 1}`) {
      kind = 'list'
      order = 0
    } else if (k === 'brand') {
      kind = 'list'
      order = 1
    } else if (SIZE.test(k) || SIZE.test(l)) {
      kind = 'size'
      order = 2
    } else if (COLOR.test(k) || COLOR.test(l)) {
      kind = 'color'
      order = 3
    } else if (spec && (k === spec || l === spec)) {
      kind = 'list'
      order = 5
    }
    if (!kind || used[`${kind}:${order}`]) return
    if (kind !== 'price' && !(f.values ?? []).length) return
    used[`${kind}:${order}`] = true
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

const moeda = (n: number) => `R$ ${Math.round(n).toLocaleString('pt-BR')}`

/** Valor de faixa no formato da busca (`min-to-max`, como o FilterFacetRange nativo). */
export const rangeValue = (lo: number, hi: number) => `${lo}-to-${hi}`

/**
 * Faixas de preço a partir do min/max absolutos da busca (a VTEX só entrega os extremos).
 * Cortes em 1/4 e 1/2 do teto, arredondados a 50. São valores de FILTRO, não preço exibido.
 */
export function priceBuckets(f: Facet15): FacetValue15[] {
  const { min, max } = f
  if (!(max > min)) return []
  const r = (n: number) => Math.max(50, Math.round(n / 50) * 50)
  const cuts = [r(max / 4), r(max / 2)].filter((n, i, a) => n > min && n < max && a.indexOf(n) === i)
  const edges = [min, ...cuts, max]
  return edges.slice(0, -1).map((lo, i) => {
    const hi = edges[i + 1]
    return { value: rangeValue(lo, hi), label: priceLabel(rangeValue(lo, hi), f) }
  })
}

/** "Até R$ 500" / "Acima de R$ 1.000" / "R$ 500 a R$ 1.000" a partir do valor `a-to-b`. */
export function priceLabel(value: string, f?: Facet15) {
  const [a, b] = value.split('-to-').map(Number)
  if (!isFinite(a) || !isFinite(b)) return value
  if (a <= (f?.min ?? 0)) return `Até ${moeda(b)}`
  if (f && b >= f.max) return `Acima de ${moeda(a)}`
  return `${moeda(a)} a ${moeda(b)}`
}

/** Rótulo do chip ativo: o nome do valor na faceta (ou a faixa de preço). */
export function selectedLabel(s: Selected15, facets: Facet15[]) {
  const f = facets.find((x) => x.key === s.key)
  if (f?.kind === 'price' || s.value.includes('-to-')) return priceLabel(s.value, f)
  return f?.values.find((v) => v.value === s.value)?.label ?? s.value
}

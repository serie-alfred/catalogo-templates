'use client';

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import styles from './index.module.css';
import {
  FONTES_11,
  ProductCard11,
  produto11,
  type Produto11,
} from '@/components/templates/common/template_11/Spot';
import {
  type Facet11,
  type RawFacet11,
  type Selected11,
  chipPrefix,
  moeda,
  parseRange,
  pickFacets,
  rangeValue,
  valueLabel,
} from './facets';

/**
 * Espelha `organisms/MainCategory11` do faststore.starter (família 11, Grade; desenhos
 * `CategoryMain11`, `CategoryMain11-mobile-filtros` e `SearchEmpty11`). Mesmo markup, classes
 * e `data-role`; o CSS é derivado do SCSS de lá e as facetas passam pelo mesmo `facets.ts`
 * (cópia).
 *
 * O que sai em relação à origem:
 *  • `usePLP`/`useSearchPage`/`useProductsQuery`/`useSearch` → as constantes abaixo, que são
 *    os dados de exemplo do `mock.ts` de lá (12 produtos, facetas, seleção do desenho,
 *    contagem e ordenação); faceta, ordenação e densidade mudam num `useState` local — o
 *    mesmo que lá acontece fora de uma PLP real. "Carregar mais", como lá no palco, não
 *    carrega nada;
 *  • `toggleFacet`/`setFacet` do @faststore/sdk → as duas funções locais equivalentes;
 *  • analytics e sessão (useViewItemList, useAuth) → preview não emite evento.
 *
 * O estado vazio da busca (desenho `SearchEmpty11`) mora AQUI, como lá: renderiza quando a
 * lista de produtos sai vazia. Lá isso só acontece numa busca sem resultado (ou no palco,
 * pela prop `stageEmptyTerm`); aqui `TERMO_VAZIO` faz o papel da prop do palco — vazio, o
 * canvas mostra a grade.
 */

/* ── rótulos (o mock.ts de lá) ── */
const PAGE = 12;
const SPEC_FACET_KEY = 'acabamento';
const L = {
  countLabel: 'produtos',
  filterLabel: 'Filtros',
  sortLabel: 'Ordenar',
  columnsLabel: 'colunas',
  clearLabel: 'Limpar',
  clearAllLabel: 'Limpar tudo',
  minLabel: 'Mínimo',
  maxLabel: 'Máximo',
  resultsLabel: 'Ver {total} resultados',
  progressLabel: 'Mostrando {shown} de {total}',
  loadMoreLabel: 'Carregar mais',
  emptyEyebrow: 'Busca',
  emptyCountLabel: 'resultados',
  emptyTitle: 'Nenhum resultado para',
  emptyText:
    'Confira a grafia ou tente um termo mais curto, como o tipo de peça ou o material.',
  emptyPrimaryLabel: 'Voltar para a página inicial',
  emptyPrimaryUrl: '#',
  emptySecondaryLabel: 'Ver novidades',
  emptySecondaryUrl: '#',
};

/** O papel do `stageEmptyTerm` do palco: com um termo, a réplica mostra o estado vazio. */
const TERMO_VAZIO = '';

/* ── dados de exemplo (o mock.ts de lá) ── */
const PRODUTOS: Produto11[] = [
  produto11(
    '024',
    'luminaria-de-mesa-arco',
    'Luminária de Mesa Arco',
    890,
    10,
    89
  ),
  produto11(
    '042',
    'pendente-globo-vidro',
    'Pendente Globo Vidro',
    1120,
    10,
    112
  ),
  produto11('061', 'arandela-tubo-latao', 'Arandela Tubo Latão', 640, 10, 64),
  produto11(
    '012',
    'luminaria-de-piso-haste',
    'Luminária de Piso Haste',
    1290,
    10,
    129
  ),
  produto11(
    '048',
    'pendente-cone-aluminio',
    'Pendente Cone Alumínio',
    980,
    10,
    98
  ),
  produto11('036', 'abajur-ceramica', 'Abajur Cerâmica', 560, 10, 56),
  produto11('070', 'arandela-disco', 'Arandela Disco', 720, 10, 72),
  produto11('027', 'luminaria-clipe', 'Luminária Clipe', 390, 10, 39),
  produto11(
    '053',
    'pendente-trilho-linear',
    'Pendente Trilho Linear',
    1680,
    10,
    168
  ),
  produto11(
    '019',
    'luminaria-de-mesa-cogumelo',
    'Luminária de Mesa Cogumelo',
    470,
    10,
    47
  ),
  produto11('066', 'plafon-anel', 'Plafon Anel', 1050, 10, 105),
  produto11(
    '040',
    'lampada-filamento-globo',
    'Lâmpada Filamento Globo',
    89,
    3,
    29.67
  ),
];

const lista = (pares: Array<[string, string, number]>) =>
  pares.map(([value, label, quantity]) => ({ value, label, quantity }));

const FACETAS: RawFacet11[] = [
  {
    __typename: 'StoreFacetBoolean',
    key: 'category-1',
    label: 'Categoria',
    values: lista([
      ['mesa', 'Mesa', 12],
      ['piso', 'Piso', 9],
      ['pendentes', 'Pendentes', 15],
      ['arandelas', 'Arandelas', 8],
      ['lampadas', 'Lâmpadas', 4],
    ]),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'acabamento',
    label: 'Acabamento',
    values: lista([
      ['preto-fosco', 'Preto fosco', 14],
      ['branco', 'Branco', 11],
      ['latao', 'Latão', 8],
      ['cromado', 'Cromado', 6],
      ['opalino', 'Opalino', 9],
    ]),
  },
  {
    __typename: 'StoreFacetRange',
    key: 'price',
    label: 'Preço',
    min: { absolute: 60, selected: 200 },
    max: { absolute: 2430, selected: 2000 },
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'cor',
    label: 'Cor',
    values: lista([
      ['preto', 'Preto', 18],
      ['branco', 'Branco', 15],
      ['dourado', 'Dourado', 7],
    ]),
  },
];

/** Seleção do desenho: Mesa e Acabamento: Preto fosco. */
const SELECAO: Selected11[] = [
  { key: 'category-1', value: 'mesa' },
  { key: 'acabamento', value: 'preto-fosco' },
];
const TOTAL = 48;
const ORDEM = 'release_desc';

/** Rótulos do enum `StoreSort` da busca. */
const SORT_OPTIONS: Array<[string, string]> = [
  ['score_desc', 'Relevância'],
  ['release_desc', 'Mais recentes'],
  ['orders_desc', 'Mais vendidos'],
  ['price_asc', 'Menor preço'],
  ['price_desc', 'Maior preço'],
  ['discount_desc', 'Maior desconto'],
  ['name_asc', 'Nome, A a Z'],
  ['name_desc', 'Nome, Z a A'],
];

const fill = (tpl: string, vars: Record<string, number | string>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const pad2 = (n: number) => String(n).padStart(2, '0');
const digits = (s: string) => Number(String(s).replace(/\D/g, '')) || 0;

/* ── toggleFacet/setFacet do @faststore/sdk, equivalentes ── */
const toggleFacet = (list: Selected11[], f: Selected11) =>
  list.some(x => x.key === f.key && x.value === f.value)
    ? list.filter(x => !(x.key === f.key && x.value === f.value))
    : [...list, f];
const setFacet = (list: Selected11[], f: Selected11) => [
  ...list.filter(x => x.key !== f.key),
  f,
];

/* ── ícones (decorativos; seguem o texto via currentColor) ── */
const Ico = ({
  size = 16,
  children,
}: {
  size?: number;
  children: React.ReactNode;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    {children}
  </svg>
);
const Sliders = () => (
  <Ico size={18}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </Ico>
);
const Chevron = () => (
  <Ico>
    <path d="m6 9 6 6 6-6" />
  </Ico>
);
const Close = ({ size = 14 }: { size?: number }) => (
  <Ico size={size}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Ico>
);
const Sign = ({ open }: { open: boolean }) => (
  <Ico>
    <path d={open ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
  </Ico>
);
const ArrowRight = ({ size = 18 }: { size?: number }) => (
  <Ico size={size}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Ico>
);
const ArrowDown = () => (
  <Ico size={18}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Ico>
);

/** Faixa de preço: dois controles deslizantes + Mínimo/Máximo; aplica ao soltar/sair. */
function PriceBody11({
  facet,
  value,
  minLabel,
  maxLabel,
  onApply,
}: {
  facet: Facet11;
  value?: string;
  minLabel: string;
  maxLabel: string;
  onApply: (lo: number, hi: number) => void;
}) {
  const sel = parseRange(value);
  const lo0 = sel?.[0] ?? facet.min;
  const hi0 = sel?.[1] ?? facet.max;
  const [lo, setLo] = useState(lo0);
  const [hi, setHi] = useState(hi0);
  useEffect(() => {
    setLo(lo0);
    setHi(hi0);
  }, [lo0, hi0]);

  const span = Math.max(1, facet.max - facet.min);
  const frac = (n: number) =>
    (Math.min(Math.max(n, facet.min), facet.max) - facet.min) / span;
  const step = Math.max(1, Math.round(span / 100));
  const a = Math.min(lo, hi);
  const b = Math.max(lo, hi);
  const apply = () => {
    if (a !== lo0 || b !== hi0) onApply(a, b);
  };
  const onEnter = (e: React.KeyboardEvent) => e.key === 'Enter' && apply();

  return (
    <>
      {/* O polegar (16 + borda) anda de 8px a (100% - 8px): o preenchimento acompanha o centro. */}
      <div
        className={styles.range}
        style={{ '--lo': frac(a), '--hi': frac(b) } as React.CSSProperties}
      >
        <span className={styles.rangeTrack} aria-hidden="true" />
        <span className={styles.rangeFill} aria-hidden="true" />
        <input
          type="range"
          aria-label={minLabel}
          min={facet.min}
          max={facet.max}
          step={step}
          value={a}
          onChange={e => setLo(Number(e.target.value))}
          onPointerUp={apply}
          onKeyUp={apply}
        />
        <input
          type="range"
          aria-label={maxLabel}
          min={facet.min}
          max={facet.max}
          step={step}
          value={b}
          onChange={e => setHi(Number(e.target.value))}
          onPointerUp={apply}
          onKeyUp={apply}
        />
      </div>
      <div className={styles.priceRow}>
        <label className={styles.priceField}>
          {minLabel}
          <input
            type="text"
            inputMode="numeric"
            value={moeda(lo)}
            onChange={e => setLo(digits(e.target.value))}
            onBlur={apply}
            onKeyDown={onEnter}
          />
        </label>
        <label className={styles.priceField}>
          {maxLabel}
          <input
            type="text"
            inputMode="numeric"
            value={moeda(hi)}
            onChange={e => setHi(digits(e.target.value))}
            onBlur={apply}
            onKeyDown={onEnter}
          />
        </label>
      </div>
    </>
  );
}

/** Faixa corrente que a busca informa no `StoreFacetRange` (`selected`), se diferente dos extremos. */
function priceSelectedOf(f: Facet11, raw: RawFacet11[]) {
  const r = raw.find(x => x.key === f.key);
  const lo = Number(r?.min?.selected);
  const hi = Number(r?.max?.selected);
  return isFinite(lo) && isFinite(hi) && hi > lo
    ? rangeValue(lo, hi)
    : undefined;
}

export default function CategoryMain11() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  const term = TERMO_VAZIO;
  const stageEmpty = !!term;

  const [mockSelected, setMockSelected] = useState<Selected11[]>(SELECAO);
  const [sort, setSort] = useState(ORDEM);
  const userFacets = stageEmpty ? [] : mockSelected;

  const products: Produto11[] = stageEmpty ? [] : PRODUTOS.slice(0, PAGE);
  const totalCount = stageEmpty ? 0 : TOTAL;
  const rawFacets = FACETAS;
  const facets = useMemo(
    () => pickFacets(rawFacets, 0, SPEC_FACET_KEY),
    [rawFacets]
  );

  const commit = useCallback(
    (nextUser: Selected11[]) => setMockSelected(nextUser),
    []
  );
  const isSelected = (key: string, value: string) =>
    userFacets.some(f => f.key === key && f.value === value);
  const toggleValue = (key: string, value: string) =>
    commit(toggleFacet(userFacets, { key, value }));
  const setPrice = (key: string, lo: number, hi: number) =>
    commit(setFacet(userFacets, { key, value: rangeValue(lo, hi) }));
  const removeChip = (f: Selected11) =>
    commit(userFacets.filter(x => !(x.key === f.key && x.value === f.value)));

  /* ── densidade (desktop): 4 colunas (desenho) ou 2 ── */
  const [cols, setCols] = useState<2 | 4>(4);

  /* ── gaveta de filtros: aplica na hora ── */
  const [panelOpen, setPanelOpen] = useState(false);
  const [acc, setAcc] = useState<Record<string, boolean>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const openPanel = () => {
    // Como os desenhos: no desktop as 3 primeiras facetas abertas; no mobile só a 1ª.
    const mobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 960px)').matches;
    const inicial: Record<string, boolean> = {};
    facets.slice(0, mobile ? 1 : 3).forEach(f => (inicial[f.key] = true));
    setAcc(inicial);
    setPanelOpen(true);
  };
  const closePanel = () => {
    setPanelOpen(false);
    filterBtnRef.current?.focus();
  };
  useEffect(() => {
    if (!panelOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPanelOpen(false);
        filterBtnRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [panelOpen]);

  const listName = 'Listagem de produtos';
  const shown = products.length;
  const hasMore = shown > 0 && shown < totalCount;
  const isEmpty = products.length === 0;
  const sortName = SORT_OPTIONS.find(([k]) => k === sort)?.[1] ?? 'Relevância';
  const userCount = userFacets.length;
  const temBarra = !isEmpty || userCount > 0;
  const total = totalCount.toLocaleString('pt-BR');
  const resumo = (f: Facet11) =>
    userFacets
      .filter(s => s.key === f.key)
      .map(s => valueLabel(s, facets))
      .join(', ');
  const priceSelected = (f: Facet11) =>
    userFacets.find(s => s.key === f.key)?.value ??
    priceSelectedOf(f, rawFacets);

  return (
    <div className={styles.mainCategory11Box}>
      <link rel="stylesheet" href={FONTES_11} />
      <section
        className={styles.mainCategory11}
        aria-label={listName}
        data-role="cm-root"
      >
        <div
          className={`${styles.inner}${temBarra ? '' : ` ${styles.innerEmpty}`}`}
        >
          {temBarra && (
            <div className={styles.bar} data-role="cm-bar">
              <button
                ref={filterBtnRef}
                type="button"
                className={styles.filterBtn}
                aria-haspopup="dialog"
                aria-expanded={panelOpen}
                aria-controls={panelOpen ? `${uid}-panel` : undefined}
                onClick={openPanel}
                data-role="m-filter-btn"
              >
                <Sliders />
                {L.filterLabel}
                {userCount > 0 && ` (${userCount})`}
              </button>
              <label className={styles.sortBtn} data-role="sort-btn">
                <span className={styles.sortLabel}>{L.sortLabel}</span>
                <span className={styles.sortName}>{sortName}</span>
                <Chevron />
                <select
                  className={styles.sortSelect}
                  value={sort}
                  aria-label={L.sortLabel}
                  onChange={e => setSort(e.target.value)}
                  data-role="sort-select"
                >
                  {SORT_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <div
                className={styles.density}
                role="group"
                aria-label={L.columnsLabel}
              >
                {([2, 4] as const).map(n => (
                  <button
                    key={n}
                    type="button"
                    className={styles.densityBtn}
                    aria-pressed={cols === n}
                    aria-label={`${n} ${L.columnsLabel}`}
                    onClick={() => setCols(n)}
                    data-role="cm-density"
                  >
                    {n}
                  </button>
                ))}
              </div>
              <span className={styles.barFill} aria-hidden="true" />
              <span className={styles.count} data-role="cm-count">
                [{total} {L.countLabel}]
              </span>
            </div>
          )}

          {temBarra && (
            <div
              className={`${styles.active}${userCount > 0 ? '' : ` ${styles.activeNone}`}`}
              data-role="cm-active"
            >
              <span className={styles.mCount} data-role="cm-mcount">
                [{total}]
              </span>
              {userFacets.map(f => {
                const nome = valueLabel(f, facets);
                const prefixo = chipPrefix(f, facets);
                return (
                  <button
                    key={`${f.key}:${f.value}`}
                    type="button"
                    className={styles.chip}
                    aria-label={`Remover filtro ${prefixo}${nome}`}
                    onClick={() => removeChip(f)}
                    data-role="cm-active-chip"
                  >
                    <span>
                      {prefixo && (
                        <span className={styles.chipPrefix}>{prefixo}</span>
                      )}
                      {nome}
                    </span>
                    <Close />
                  </button>
                );
              })}
              {userCount > 0 && (
                <button
                  type="button"
                  className={styles.clearLink}
                  onClick={() => commit([])}
                  data-role="cm-clear"
                >
                  <span className={styles.clearDesk}>{L.clearAllLabel}</span>
                  <span className={styles.clearMob}>{L.clearLabel}</span>
                </button>
              )}
            </div>
          )}

          {isEmpty ? (
            <div className={styles.empty} data-role="cm-empty">
              <div className={styles.emptyHead}>
                <span>{L.emptyEyebrow}</span>
                <span>[0 {L.emptyCountLabel}]</span>
              </div>
              <div className={styles.emptyBody}>
                <div className={styles.emptyText}>
                  {React.createElement(
                    term ? 'h1' : 'h2',
                    {
                      className: styles.emptyTitle,
                      'data-role': 'cm-empty-title',
                    },
                    L.emptyTitle,
                    term && <> “{term}”</>
                  )}
                  {L.emptyText && (
                    <p className={styles.emptyDesc}>{L.emptyText}</p>
                  )}
                </div>
                {(L.emptyPrimaryLabel || L.emptySecondaryLabel) && (
                  <div className={styles.emptyActions}>
                    {L.emptyPrimaryLabel && (
                      <a
                        className={`${styles.emptyLink} ${styles.emptyPrimary}`}
                        href={L.emptyPrimaryUrl}
                        data-role="cm-empty-primary"
                      >
                        {L.emptyPrimaryLabel}
                        <ArrowRight size={20} />
                      </a>
                    )}
                    {L.emptySecondaryLabel && (
                      <a
                        className={styles.emptyLink}
                        href={L.emptySecondaryUrl}
                        data-role="cm-empty-secondary"
                      >
                        {L.emptySecondaryLabel}
                        <ArrowRight size={20} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <ul
              className={`${styles.grid}${cols === 2 ? ` ${styles.grid2}` : ''}`}
              data-role="cm-grid"
            >
              {products.map((p, i) => (
                <li key={p.id ?? i} className={styles.gridItem}>
                  <ProductCard11 product={p} variant="grid" />
                </li>
              ))}
            </ul>
          )}

          {!isEmpty && totalCount > 0 && (
            <div className={styles.more} data-role="cm-more">
              <span className={styles.progressText}>
                {fill(L.progressLabel, { shown, total })}
                <span className={styles.progress} aria-hidden="true">
                  <span
                    style={{
                      width: `${Math.min(100, (shown / totalCount) * 100)}%`,
                    }}
                  />
                </span>
              </span>
              {hasMore && (
                <button
                  type="button"
                  className={styles.moreBtn}
                  data-role="cm-load-more"
                >
                  {L.loadMoreLabel}
                  <ArrowDown />
                </button>
              )}
            </div>
          )}
        </div>

        {panelOpen && (
          <>
            <div
              className={styles.overlay}
              aria-hidden="true"
              onClick={closePanel}
            />
            <aside
              id={`${uid}-panel`}
              className={styles.panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${uid}-panel-title`}
              data-role="m-filter-panel"
            >
              <div className={styles.panelHead}>
                <h2 id={`${uid}-panel-title`} className={styles.panelTitle}>
                  {L.filterLabel}
                  <span className={styles.panelCount}>[{userCount}]</span>
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  className={styles.panelClose}
                  aria-label="Fechar filtros"
                  onClick={closePanel}
                >
                  <Close size={20} />
                </button>
              </div>
              <div className={styles.panelBody}>
                {facets.map((f, i) => {
                  const on = !!acc[f.key];
                  const sum = on ? '' : resumo(f);
                  return (
                    <div key={f.key} className={styles.facet}>
                      <button
                        type="button"
                        className={styles.facetHead}
                        aria-expanded={on}
                        aria-controls={`${uid}-f-${i}`}
                        onClick={() => setAcc(a => ({ ...a, [f.key]: !on }))}
                        data-role="facet-head"
                      >
                        [{pad2(i + 1)}] {f.label}
                        <span className={styles.facetEnd}>
                          {sum && (
                            <span className={styles.facetSum}>{sum}</span>
                          )}
                          <Sign open={on} />
                        </span>
                      </button>
                      {on && (
                        <div
                          id={`${uid}-f-${i}`}
                          className={`${styles.facetBody}${
                            f.kind === 'price'
                              ? ` ${styles.facetBodyPrice}`
                              : ''
                          }`}
                          role="group"
                          aria-label={f.label}
                        >
                          {f.kind === 'price' ? (
                            <PriceBody11
                              facet={f}
                              value={priceSelected(f)}
                              minLabel={L.minLabel}
                              maxLabel={L.maxLabel}
                              onApply={(lo, hi) => setPrice(f.key, lo, hi)}
                            />
                          ) : (
                            f.values.map((v, k) => {
                              const id = `${uid}-f-${i}-${k}`;
                              return (
                                <label
                                  key={v.value}
                                  className={styles.check}
                                  htmlFor={id}
                                  data-role="facet-check"
                                >
                                  <input
                                    id={id}
                                    type="checkbox"
                                    checked={isSelected(f.key, v.value)}
                                    onChange={() => toggleValue(f.key, v.value)}
                                  />
                                  <span className={styles.checkName}>
                                    {v.label}
                                  </span>
                                  {typeof v.quantity === 'number' && (
                                    <span className={styles.checkQty}>
                                      {v.quantity.toLocaleString('pt-BR')}
                                    </span>
                                  )}
                                </label>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className={styles.panelFoot}>
                <button
                  type="button"
                  className={styles.panelClear}
                  onClick={() => commit([])}
                >
                  {L.clearLabel}
                </button>
                <button
                  type="button"
                  className={styles.panelApply}
                  onClick={closePanel}
                  data-role="m-filter-results"
                >
                  {fill(L.resultsLabel, { total })}
                  <ArrowRight />
                </button>
              </div>
            </aside>
          </>
        )}
      </section>
    </div>
  );
}

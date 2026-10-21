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
  FONTES_10,
  ProductCard10,
  produto10,
  type Produto10,
} from '@/components/templates/common/template_10/Spot';
import {
  type Facet10,
  type RawFacet10,
  type Selected10,
  moeda,
  pageList,
  parseRange,
  pickFacets,
  plural,
  rangeValue,
  selectedLabel,
} from './facets';

/**
 * Espelha `organisms/MainCategory10` do faststore.starter (família 10, Varejo;
 * desenhos `CategoryMain10`, `CategoryMain10-mobile-filtros` e `SearchEmpty10`).
 * Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá e as facetas
 * passam pelo mesmo `facets.ts` (cópia).
 *
 * O que sai em relação à origem:
 *  • `usePLP`/`useSearchPage`/`useProductsQuery`/`useSearch` → as constantes abaixo,
 *    que são os dados de exemplo do `mock.ts` de lá (12 produtos, facetas, seleção do
 *    desenho, contagem e ordenação); faceta, ordenação, página e "Exibir" mudam num
 *    `useState` local — o mesmo que lá acontece fora de uma PLP real;
 *  • `toggleFacet`/`setFacet` do @faststore/sdk → as duas funções locais equivalentes;
 *  • analytics e sessão (useViewItemList, useAuth) → preview não emite evento.
 *
 * O estado vazio da busca (desenho `SearchEmpty10`) mora AQUI, como lá: renderiza
 * quando a lista de produtos sai vazia. Lá isso só acontece numa busca sem resultado
 * (ou no palco, pela prop `stageEmptyTerm`); aqui `TERMO_VAZIO` faz o papel da prop
 * do palco — vazio, o canvas mostra a grade.
 */

/* ── rótulos (o mock.ts de lá) ── */
const PAGE_SIZE = 12;
const SPEC_FACET_KEY = 'memoria-interna';
const L = {
  countLabel: 'produtos encontrados',
  filterLabel: 'Filtrar',
  sortLabel: 'Ordenar',
  sortPrefix: 'Ordenar por',
  perPageLabel: 'Exibir',
  activeLabel: 'Filtros ativos:',
  clearLabel: 'Limpar',
  clearAllLabel: 'Limpar tudo',
  searchPlaceholder: 'Buscar {faceta}',
  showMoreLabel: 'Ver mais {n} {faceta}',
  showLessLabel: 'Ver menos',
  minLabel: 'Mínimo',
  maxLabel: 'Máximo',
  resultsLabel: 'Ver {total} resultados',
  pageLabel: 'Página {page} de {pages}',
  emptyTitle: 'Nenhum resultado para',
  emptyText:
    'Confira a ortografia ou tente termos mais gerais, como o nome do produto sem a especificação.',
  emptyPrimaryLabel: 'Voltar para a página inicial',
  emptyPrimaryUrl: '#',
  emptySecondaryLabel: 'Ver ofertas do dia',
  emptySecondaryUrl: '#',
};

/** O papel do `stageEmptyTerm` do palco: com um termo, a réplica mostra o estado vazio. */
const TERMO_VAZIO = '';

/* ── dados de exemplo (o mock.ts de lá) ── */
const BASE: Array<
  [string, string, number, number, number, number, number, number]
> = [
  [
    'smartphone-x5-128gb-preto',
    'Smartphone X5 128 GB 5G Tela 6,7" Preto',
    1799,
    2299,
    179.9,
    1709.05,
    4.8,
    1284,
  ],
  [
    'smartphone-x5-128gb-azul',
    'Smartphone X5 128 GB 5G Tela 6,7" Azul',
    1799,
    2299,
    179.9,
    1709.05,
    4.8,
    1284,
  ],
  [
    'smartphone-x3-128gb-grafite',
    'Smartphone X3 128 GB 5G Tela 6,5" Grafite',
    1299,
    1599,
    129.9,
    1234.05,
    4.6,
    742,
  ],
  [
    'smartphone-x7-pro-256gb-prata',
    'Smartphone X7 Pro 256 GB 5G Tela 6,8" Prata',
    3199,
    3999,
    319.9,
    3039.05,
    4.9,
    318,
  ],
];

/** Os 12 cards do desenho (os 4 modelos em 3 voltas), com ids distintos. */
const PRODUTOS: Produto10[] = [0, 1, 2].flatMap(volta =>
  BASE.map(([id, name, price, listPrice, parcela, pix, average, totalCount]) =>
    produto10(
      `${id}-${volta + 1}`,
      name,
      price,
      listPrice,
      10,
      parcela,
      pix,
      true,
      {
        average,
        totalCount,
      }
    )
  )
);

const lista = (pares: Array<[string, number?]>) =>
  pares.map(([label, quantity]) => ({
    value: label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
    label,
    quantity,
  }));

const FACETAS: RawFacet10[] = [
  {
    __typename: 'StoreFacetBoolean',
    key: 'brand',
    label: 'Marca',
    values: lista(
      [
        412, 318, 204, 167, 98, 86, 74, 61, 55, 48, 40, 33, 27, 21, 16, 11, 6,
      ].map(
        (q, i) =>
          [`[Marca ${String(i + 1).padStart(2, '0')}]`, q] as [string, number]
      )
    ),
  },
  {
    __typename: 'StoreFacetRange',
    key: 'price',
    label: 'Preço',
    min: { absolute: 20, selected: 500 },
    max: { absolute: 4020, selected: 2500 },
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'memoria-interna',
    label: 'Memória interna',
    values: lista([['64 GB'], ['128 GB'], ['256 GB'], ['512 GB']]),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'cor',
    label: 'Cor',
    values: lista([
      ['Preto', 386],
      ['Azul', 214],
      ['Grafite', 172],
      ['Prata', 140],
      ['Branco', 118],
    ]),
  },
];

/** Seleção do desenho: [Marca 01], 128 GB e Preto. */
const SELECAO: Selected10[] = [
  { key: 'brand', value: 'marca-01' },
  { key: 'memoria-interna', value: '128-gb' },
  { key: 'cor', value: 'preto' },
];
const TOTAL = 1248;
const ORDEM = 'orders_desc';

/** Rótulos do enum `StoreSort` da busca. */
const SORT_OPTIONS: Array<[string, string]> = [
  ['score_desc', 'Relevância'],
  ['orders_desc', 'Mais vendidos'],
  ['release_desc', 'Lançamentos'],
  ['price_asc', 'Menor preço'],
  ['price_desc', 'Maior preço'],
  ['discount_desc', 'Maior desconto'],
  ['name_asc', 'Nome, A a Z'],
  ['name_desc', 'Nome, Z a A'],
];

const LIST_LIMIT = 5;

const fill = (tpl: string, vars: Record<string, number | string>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const digits = (s: string) => Number(String(s).replace(/\D/g, '')) || 0;

/* ── o que o @faststore/sdk faz com a lista de facetas ── */
const toggleFacet = (list: Selected10[], f: Selected10) =>
  list.some(x => x.key === f.key && x.value === f.value)
    ? list.filter(x => !(x.key === f.key && x.value === f.value))
    : [...list, f];
const setFacet = (list: Selected10[], f: Selected10) => [
  ...list.filter(x => x.key !== f.key),
  f,
];

/* ── ícones (decorativos; seguem o texto via currentColor) ── */
const Ico = ({
  size = 18,
  w = 2,
  children,
}: {
  size?: number;
  w?: number;
  children: React.ReactNode;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={w}
    aria-hidden="true"
  >
    {children}
  </svg>
);
const Sliders = ({ size = 18 }: { size?: number }) => (
  <Ico size={size}>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </Ico>
);
const Chevron = ({
  dir = 'down',
  size = 16,
}: {
  dir?: 'down' | 'up' | 'left' | 'right';
  size?: number;
}) => {
  const d = {
    down: 'm6 9 6 6 6-6',
    up: 'm6 15 6-6 6 6',
    left: 'm15 6-6 6 6 6',
    right: 'm9 6 6 6-6 6',
  }[dir];
  return (
    <Ico size={size} w={dir === 'right' && size === 16 ? 2.4 : 2}>
      <path d={d} />
    </Ico>
  );
};
const Close = ({ size = 16, w = 2.2 }: { size?: number; w?: number }) => (
  <Ico size={size} w={w}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Ico>
);

type Labels = {
  searchPlaceholder: string;
  showMoreLabel: string;
  showLessLabel: string;
  minLabel: string;
  maxLabel: string;
};

/** Opções de uma faceta: as mesmas na coluna do desktop e no acordeão do mobile. */
function FacetBody10({
  facet,
  idBase,
  isOn,
  onToggle,
  onPrice,
  priceValue,
  labels,
}: {
  facet: Facet10;
  idBase: string;
  isOn: (value: string) => boolean;
  onToggle: (value: string) => void;
  onPrice: (lo: number, hi: number) => void;
  priceValue?: string;
  labels: Labels;
}) {
  const [query, setQuery] = useState('');
  const [all, setAll] = useState(false);

  /* ── preço: duas caixas + dois controles deslizantes, aplicados no botão ── */
  const sel = parseRange(priceValue);
  const lo0 = sel?.[0] ?? facet.min;
  const hi0 = sel?.[1] ?? facet.max;
  const [lo, setLo] = useState(lo0);
  const [hi, setHi] = useState(hi0);
  useEffect(() => {
    setLo(lo0);
    setHi(hi0);
  }, [lo0, hi0]);

  if (facet.kind === 'price') {
    const span = Math.max(1, facet.max - facet.min);
    const frac = (n: number) =>
      (Math.min(Math.max(n, facet.min), facet.max) - facet.min) / span;
    const step = Math.max(1, Math.round(span / 100));
    return (
      <>
        <div className={styles.priceRow}>
          <label className={styles.priceField}>
            {labels.minLabel}
            <input
              type="text"
              inputMode="numeric"
              value={moeda(lo)}
              onChange={e => setLo(digits(e.target.value))}
            />
          </label>
          <label className={styles.priceField}>
            {labels.maxLabel}
            <input
              type="text"
              inputMode="numeric"
              value={moeda(hi)}
              onChange={e => setHi(digits(e.target.value))}
            />
          </label>
          <button
            type="button"
            className={styles.priceApply}
            aria-label="Aplicar faixa de preço"
            onClick={() => onPrice(Math.min(lo, hi), Math.max(lo, hi))}
            data-role="facet-price-apply"
          >
            <Chevron dir="right" />
          </button>
        </div>
        <div className={styles.range}>
          <span className={styles.rangeTrack} aria-hidden="true" />
          <span
            className={styles.rangeFill}
            style={{
              left: `calc(10px + (100% - 20px) * ${frac(Math.min(lo, hi))})`,
              right: `calc(10px + (100% - 20px) * ${1 - frac(Math.max(lo, hi))})`,
            }}
            aria-hidden="true"
          />
          <input
            type="range"
            aria-label={labels.minLabel}
            min={facet.min}
            max={facet.max}
            step={step}
            value={Math.min(lo, hi)}
            onChange={e => setLo(Number(e.target.value))}
          />
          <input
            type="range"
            aria-label={labels.maxLabel}
            min={facet.min}
            max={facet.max}
            step={step}
            value={Math.max(lo, hi)}
            onChange={e => setHi(Number(e.target.value))}
          />
        </div>
      </>
    );
  }

  if (facet.kind === 'buttons') {
    return (
      <div className={styles.btnGrid} role="group" aria-label={facet.label}>
        {facet.values.map(v => (
          <button
            key={v.value}
            type="button"
            className={styles.optBtn}
            aria-pressed={isOn(v.value)}
            onClick={() => onToggle(v.value)}
            data-role="facet-btn"
          >
            {v.label}
          </button>
        ))}
      </div>
    );
  }

  const nome = facet.label.toLocaleLowerCase('pt-BR');
  const q = query.trim().toLocaleLowerCase('pt-BR');
  const filtrados = q
    ? facet.values.filter(v => v.label.toLocaleLowerCase('pt-BR').includes(q))
    : facet.values;
  const visiveis = all || q ? filtrados : filtrados.slice(0, LIST_LIMIT);
  const resto = filtrados.length - LIST_LIMIT;
  return (
    <>
      {facet.searchable && (
        <label className={styles.search}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className={styles.srOnly}>
            {fill(labels.searchPlaceholder, { faceta: nome })}
          </span>
          <input
            type="search"
            value={query}
            placeholder={fill(labels.searchPlaceholder, { faceta: nome })}
            onChange={e => setQuery(e.target.value)}
          />
        </label>
      )}
      {visiveis.map((v, i) => {
        const id = `${idBase}-${i}`;
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
              checked={isOn(v.value)}
              onChange={() => onToggle(v.value)}
            />
            <span className={styles.checkName}>{v.label}</span>
            {typeof v.quantity === 'number' && (
              <span className={styles.checkQty}>
                ({v.quantity.toLocaleString('pt-BR')})
              </span>
            )}
          </label>
        );
      })}
      {!q && resto > 0 && (
        <button
          type="button"
          className={styles.linkBtn}
          aria-expanded={all}
          onClick={() => setAll(a => !a)}
        >
          {all
            ? labels.showLessLabel
            : fill(labels.showMoreLabel, {
                n: resto,
                faceta: plural(facet.label),
              })}
        </button>
      )}
    </>
  );
}

/** Faixa corrente que a busca informa no `StoreFacetRange` (`selected`), se diferente dos extremos. */
function priceSelectedOf(f: Facet10, raw: RawFacet10[]) {
  const r = raw.find(x => x.key === f.key);
  const lo = Number(r?.min?.selected);
  const hi = Number(r?.max?.selected);
  return isFinite(lo) && isFinite(hi) && hi > lo
    ? rangeValue(lo, hi)
    : undefined;
}

export default function CategoryMain10() {
  const BASE_PAGE = PAGE_SIZE;
  const perPageOptions = useMemo(
    () =>
      [1, 2, 3, 4]
        .map(m => Math.min(BASE_PAGE * m, 50))
        .filter((n, i, a) => a.indexOf(n) === i),
    [BASE_PAGE]
  );
  const [perPage, setPerPage] = useState(BASE_PAGE);
  const PAGE = perPageOptions.indexOf(perPage) >= 0 ? perPage : BASE_PAGE;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  const term = TERMO_VAZIO;
  const stageEmpty = !!term;

  const [mockSelected, setMockSelected] = useState<Selected10[]>(SELECAO);
  const [sort, setSort] = useState(ORDEM);
  const [page, setPage] = useState(0);
  const userFacets = stageEmpty ? [] : mockSelected;

  const products: Produto10[] = stageEmpty ? [] : PRODUTOS.slice(0, PAGE);
  const totalCount = stageEmpty ? 0 : TOTAL;
  const rawFacets = FACETAS;
  const facets = useMemo(
    () => pickFacets(rawFacets, 0, SPEC_FACET_KEY),
    [rawFacets]
  );

  const commit = useCallback((nextUser: Selected10[]) => {
    setMockSelected(nextUser);
    setPage(0);
  }, []);
  const isSelected = (key: string, value: string) =>
    userFacets.some(f => f.key === key && f.value === value);
  const toggleValue = (key: string, value: string) =>
    commit(toggleFacet(userFacets, { key, value }));
  const setPrice = (key: string, lo: number, hi: number) =>
    commit(setFacet(userFacets, { key, value: rangeValue(lo, hi) }));
  const removeChip = (f: Selected10) =>
    commit(userFacets.filter(x => !(x.key === f.key && x.value === f.value)));

  const onSort = (value: string) => {
    setSort(value);
    setPage(0);
  };
  const onPerPage = (n: number) => {
    setPerPage(n);
    setPage(0);
  };
  const goPage = (e: React.MouseEvent, p: number) => {
    e.preventDefault();
    setPage(p);
  };

  /* ── grade × lista ── */
  const [view, setView] = useState<'grid' | 'list'>('grid');

  /* ── coluna de filtros: só a Marca recolhe (desenho) ── */
  const [shut, setShut] = useState<Record<string, boolean>>({});

  /* ── painel mobile (tela cheia): aplica na hora ── */
  const [panelOpen, setPanelOpen] = useState(false);
  const [acc, setAcc] = useState<Record<string, boolean>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const openPanel = () => {
    setAcc(facets[0] ? { [facets[0].key]: true } : {});
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

  const isEmpty = products.length === 0;
  const userCount = userFacets.length;
  const temBarra = !isEmpty || userCount > 0;
  const pages = Math.max(1, Math.ceil(totalCount / PAGE));
  const atual = Math.min(page, pages - 1) + 1;
  const labels: Labels = {
    searchPlaceholder: L.searchPlaceholder,
    showMoreLabel: L.showMoreLabel,
    showLessLabel: L.showLessLabel,
    minLabel: L.minLabel,
    maxLabel: L.maxLabel,
  };
  const resumo = (f: Facet10) =>
    userFacets
      .filter(s => s.key === f.key)
      .map(s => selectedLabel(s, facets))
      .join(', ');

  const sortSelect = (cls: string, aria?: string) => (
    <select
      className={cls}
      value={sort}
      aria-label={aria}
      onChange={e => onSort(e.target.value)}
      data-role="sort-select"
    >
      {SORT_OPTIONS.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );

  const body = (f: Facet10, idBase: string) => (
    <FacetBody10
      facet={f}
      idBase={idBase}
      labels={labels}
      isOn={v => isSelected(f.key, v)}
      onToggle={v => toggleValue(f.key, v)}
      onPrice={(lo, hi) => setPrice(f.key, lo, hi)}
      priceValue={
        userFacets.find(s => s.key === f.key)?.value ??
        (f.kind === 'price' ? priceSelectedOf(f, rawFacets) : undefined)
      }
    />
  );

  const count = (cls: string, role: string) => (
    <span className={cls} data-role={role}>
      <strong>{totalCount.toLocaleString('pt-BR')}</strong> {L.countLabel}
    </span>
  );

  return (
    <div className={styles.mainCategory10Box}>
      <div className={styles.mainCategory10} data-role="cm-root">
        <link rel="stylesheet" href={FONTES_10} />
        <div
          className={`${styles.inner}${temBarra ? '' : ` ${styles.innerEmpty}`}`}
        >
          {temBarra && (
            <>
              {count(styles.mCount, 'cm-mcount')}

              {/* desktop: contagem, ordenação, por página, grade/lista */}
              <div className={styles.bar} data-role="cm-bar">
                {count(styles.count, 'cm-count')}
                <div className={styles.barEnd}>
                  <label className={styles.selectLabel}>
                    {L.sortPrefix}
                    <span className={styles.selectBox}>
                      {sortSelect(styles.select)}
                      <Chevron />
                    </span>
                  </label>
                  <label className={styles.selectLabel}>
                    {L.perPageLabel}
                    <span
                      className={`${styles.selectBox} ${styles.selectBoxSmall}`}
                    >
                      <select
                        className={styles.select}
                        value={PAGE}
                        onChange={e => onPerPage(Number(e.target.value))}
                        data-role="per-page"
                      >
                        {perPageOptions.map(n => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                      <Chevron />
                    </span>
                  </label>
                  <div className={styles.viewToggle}>
                    <button
                      type="button"
                      className={styles.viewBtn}
                      aria-label="Ver em grade"
                      aria-pressed={view === 'grid'}
                      onClick={() => setView('grid')}
                    >
                      <Ico>
                        <rect x="4" y="4" width="7" height="7" />
                        <rect x="13" y="4" width="7" height="7" />
                        <rect x="4" y="13" width="7" height="7" />
                        <rect x="13" y="13" width="7" height="7" />
                      </Ico>
                    </button>
                    <button
                      type="button"
                      className={styles.viewBtn}
                      aria-label="Ver em lista"
                      aria-pressed={view === 'list'}
                      onClick={() => setView('list')}
                    >
                      <Ico>
                        <path d="M4 6h16M4 12h16M4 18h16" />
                      </Ico>
                    </button>
                  </div>
                </div>
              </div>

              {/* mobile: Filtrar (n) | Ordenar */}
              <div className={styles.mBar} data-role="cm-mbar">
                <button
                  ref={filterBtnRef}
                  type="button"
                  className={styles.mBtn}
                  aria-haspopup="dialog"
                  aria-expanded={panelOpen}
                  onClick={openPanel}
                  data-role="m-filter-btn"
                >
                  <Sliders />
                  {L.filterLabel}
                  {userCount > 0 && ` (${userCount})`}
                </button>
                <label className={styles.mBtn}>
                  <Ico>
                    <path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4" />
                  </Ico>
                  {L.sortLabel}
                  {sortSelect(styles.mSelect, L.sortLabel)}
                </label>
              </div>
            </>
          )}

          {userCount > 0 && (
            <div className={styles.active} data-role="cm-active">
              {L.activeLabel && (
                <span className={styles.activeLabel}>{L.activeLabel}</span>
              )}
              {userFacets.map(f => {
                const label = selectedLabel(f, facets);
                return (
                  <button
                    key={`${f.key}:${f.value}`}
                    type="button"
                    className={styles.activeChip}
                    aria-label={`Remover filtro ${label}`}
                    onClick={() => removeChip(f)}
                    data-role="cm-active-chip"
                  >
                    {label}
                    <Close />
                  </button>
                );
              })}
              <button
                type="button"
                className={styles.clearAll}
                onClick={() => commit([])}
                data-role="cm-clear-all"
              >
                <span className={styles.dskOnly}>{L.clearAllLabel}</span>
                <span className={styles.mobOnly}>{L.clearLabel}</span>
              </button>
            </div>
          )}

          {isEmpty ? (
            <section
              className={styles.empty}
              aria-label="Busca sem resultado"
              data-role="cm-empty"
            >
              <span className={styles.emptyIcon} aria-hidden="true">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                  <path d="M8.5 8.5l5 5M13.5 8.5l-5 5" />
                </svg>
              </span>
              {React.createElement(
                term ? 'h1' : 'h2',
                { className: styles.emptyTitle, 'data-role': 'cm-empty-title' },
                L.emptyTitle,
                term ? ` “${term}”` : null
              )}
              {L.emptyText && <p className={styles.emptyText}>{L.emptyText}</p>}
              <div className={styles.emptyActions}>
                <a
                  className={styles.emptyPrimary}
                  href={L.emptyPrimaryUrl}
                  data-role="cm-empty-primary"
                >
                  {L.emptyPrimaryLabel}
                </a>
                <a
                  className={styles.emptySecondary}
                  href={L.emptySecondaryUrl}
                  data-role="cm-empty-secondary"
                >
                  {L.emptySecondaryLabel}
                </a>
              </div>
            </section>
          ) : (
            <div className={styles.layout}>
              {facets.length > 0 && (
                <aside
                  className={styles.aside}
                  aria-label={L.filterLabel}
                  data-role="cm-aside"
                >
                  <div className={styles.asideHead}>
                    <span className={styles.asideTitle}>
                      <Sliders />
                      {L.filterLabel}
                    </span>
                    {userCount > 0 && (
                      <button
                        type="button"
                        className={styles.linkBtn}
                        onClick={() => commit([])}
                      >
                        {L.clearLabel}
                      </button>
                    )}
                  </div>
                  {facets.map(f => {
                    const fechado = !!shut[f.key];
                    return (
                      <div
                        key={f.key}
                        className={`${styles.facet}${
                          f.searchable
                            ? ` ${styles.facetSearch}`
                            : f.kind === 'list'
                              ? ` ${styles.facetTight}`
                              : ''
                        }`}
                        data-role="cm-facet"
                      >
                        {f.searchable ? (
                          <button
                            type="button"
                            className={styles.facetTitleBtn}
                            aria-expanded={!fechado}
                            aria-controls={`${uid}-f-${f.key}`}
                            onClick={() =>
                              setShut(s => ({ ...s, [f.key]: !fechado }))
                            }
                          >
                            {f.label}
                            <Chevron dir={fechado ? 'down' : 'up'} size={18} />
                          </button>
                        ) : (
                          <span className={styles.facetTitle}>{f.label}</span>
                        )}
                        {!fechado && (
                          <div
                            id={`${uid}-f-${f.key}`}
                            className={styles.facetBody}
                          >
                            {body(f, `${uid}-d-${f.key}`)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </aside>
              )}

              <div className={styles.results}>
                <ul
                  className={`${styles.grid}${view === 'list' ? ` ${styles.gridList}` : ''}`}
                  data-role="cm-grid"
                >
                  {products.map(p => (
                    <li key={p.id} className={styles.gridItem}>
                      <ProductCard10 product={p} />
                    </li>
                  ))}
                </ul>

                {pages > 1 && (
                  <nav
                    className={styles.pagination}
                    aria-label="Paginação"
                    data-role="cm-pagination"
                  >
                    <a
                      className={`${styles.pageBtn} ${styles.pageArrow}`}
                      href={atual > 1 ? '#' : undefined}
                      aria-label="Página anterior"
                      aria-disabled={atual <= 1 || undefined}
                      onClick={e =>
                        atual > 1 ? goPage(e, atual - 2) : e.preventDefault()
                      }
                    >
                      <Chevron dir="left" size={18} />
                    </a>
                    {pageList(atual, pages).map((n, i) =>
                      n === null ? (
                        <span
                          key={`gap-${i}`}
                          className={styles.pageGap}
                          aria-hidden="true"
                        >
                          ...
                        </span>
                      ) : (
                        <a
                          key={n}
                          className={`${styles.pageBtn} ${styles.pageNum}${n === atual ? ` ${styles.pageOn}` : ''}`}
                          href="#"
                          aria-current={n === atual ? 'page' : undefined}
                          onClick={e => goPage(e, n - 1)}
                        >
                          {n}
                        </a>
                      )
                    )}
                    <span className={styles.pageText}>
                      {fill(L.pageLabel, { page: '\u0000', pages })
                        .split('\u0000')
                        .map((parte, i, arr) => (
                          <React.Fragment key={i}>
                            {parte}
                            {i < arr.length - 1 && <strong>{atual}</strong>}
                          </React.Fragment>
                        ))}
                    </span>
                    <a
                      className={`${styles.pageBtn} ${styles.pageArrow} ${styles.pageNext}`}
                      href={atual < pages ? '#' : undefined}
                      aria-label="Próxima página"
                      aria-disabled={atual >= pages || undefined}
                      onClick={e =>
                        atual < pages ? goPage(e, atual) : e.preventDefault()
                      }
                    >
                      <Chevron dir="right" size={18} />
                    </a>
                  </nav>
                )}
              </div>
            </div>
          )}
        </div>

        {panelOpen && (
          <section
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label={L.filterLabel}
            data-role="m-filter-panel"
          >
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>
                <Sliders size={20} />
                {L.filterLabel}
              </h2>
              <button
                ref={closeRef}
                type="button"
                className={styles.panelClose}
                aria-label="Fechar filtros"
                onClick={closePanel}
              >
                <Close size={22} w={2} />
              </button>
            </div>
            <div className={styles.panelBody}>
              {userCount > 0 && (
                <div className={styles.panelChips}>
                  {userFacets.map(f => (
                    <span
                      key={`${f.key}:${f.value}`}
                      className={styles.panelChip}
                    >
                      {selectedLabel(f, facets)}
                    </span>
                  ))}
                </div>
              )}
              {facets.map(f => {
                const on = !!acc[f.key];
                const sum = resumo(f);
                return (
                  <div
                    key={f.key}
                    className={`${styles.accItem}${on ? ` ${styles.accOpen}` : ''}`}
                  >
                    <button
                      type="button"
                      className={styles.accBtn}
                      aria-expanded={on}
                      aria-controls={`${uid}-acc-${f.key}`}
                      onClick={() => setAcc(a => ({ ...a, [f.key]: !on }))}
                    >
                      {f.label}
                      {on ? (
                        <Chevron dir="up" size={18} />
                      ) : (
                        <span className={styles.accEnd}>
                          {sum && <span className={styles.accSum}>{sum}</span>}
                          <Chevron size={18} />
                        </span>
                      )}
                    </button>
                    {on && (
                      <div
                        id={`${uid}-acc-${f.key}`}
                        className={styles.accBody}
                      >
                        {body(f, `${uid}-m-${f.key}`)}
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
                {fill(L.resultsLabel, {
                  total: totalCount.toLocaleString('pt-BR'),
                })}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

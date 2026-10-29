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
  FONTES_16,
  ProductCard16,
  produto16,
  type Produto16,
} from '@/components/templates/common/template_16/Spot';
import {
  type Facet16,
  type PriceBucket16,
  type RawFacet16,
  type Selected16,
  isScopeFacet,
  pageList,
  pickFacets,
  plural,
  priceBuckets,
  selectedLabel,
  splitAge,
} from './facets';

/**
 * Espelha `organisms/MainCategory16` do faststore.starter (família 16, Infantil; desenhos
 * `CategoryMain16`, `CategoryMain16-mobile-filtros` e `SearchEmpty16`). Mesmo markup, classes e
 * `data-role`; o CSS é derivado do SCSS de lá e as facetas passam pelo mesmo `facets.ts` (cópia).
 *
 * O que sai em relação à origem:
 *  • `usePLP`/`useSearchPage`/`useProductsQuery`/`useSearch` → os dados de exemplo do `mock.ts`
 *    de lá (9 produtos, facetas, seleção do desenho, contagem e ordenação); faceta, ordenação e
 *    página mudam num `useState` local — o mesmo que lá acontece fora de uma PLP real;
 *  • `toggleFacet`/`setFacet`/`formatSearchState` do @faststore/sdk → funções locais equivalentes;
 *  • analytics e sessão (useViewItemList, useAuth) → preview não emite evento.
 *
 * O card é o ProductCard16 sem estrelas (lá o palco passa `rating: null`). O estado vazio da
 * busca (desenho `SearchEmpty16`) mora AQUI, como lá: renderiza quando a lista sai vazia;
 * `TERMO_VAZIO` faz o papel da prop `stageEmptyTerm` do palco — vazio, o canvas mostra a grade.
 */

/** O papel do `stageEmptyTerm` do palco: com um termo, a réplica mostra o estado vazio. */
const TERMO_VAZIO: string = '';

const mainCategory16Mock = {
  pageSize: 9,
  specFacetKey: 'faixa-etaria',
  ageTitle: 'Compre por idade',
  priceSteps: '80, 150, 250',
  countLabel: 'produtos',
  filterLabel: 'Filtrar',
  filterTitle: 'Filtrar',
  sortLabel: 'Ordenar:',
  sortMobileLabel: 'Ordenar',
  clearLabel: 'Limpar',
  clearAllLabel: 'Limpar tudo',
  showMoreLabel: 'Ver todas as {faceta}',
  showLessLabel: 'Ver menos',
  priceUpToLabel: 'Até {max}',
  priceBetweenLabel: '{min} a {max}',
  priceOverLabel: 'Acima de {min}',
  resultsLabel: 'Ver {total} produtos',
  emptyCountLabel: '0 resultados',
  emptyTitle: 'Ops! Não achamos nada para',
  emptyFilterTitle: 'Ops! Não achamos nada com esses filtros',
  emptyText:
    'Confira se a palavra está certinha ou tente algo mais curto, como “dinossauro” ou “pelúcia”.',
  emptyPrimaryLabel: 'Voltar para o início',
  emptyPrimaryUrl: '/',
  emptySecondaryLabel: 'Ver mais vendidos',
  emptySecondaryUrl: '/',
};

const BASE: Array<[string, string, number, number, number]> = [
  [
    'kit-blocos-de-montar-120',
    'Kit Blocos de Montar 120 peças',
    189.9,
    6,
    31.65,
  ],
  ['pelucia-dino-verde-30', 'Pelúcia Dino Verde 30 cm', 119.9, 6, 19.98],
  [
    'quebra-cabeca-fazendinha-60',
    'Quebra-Cabeça Fazendinha 60 peças',
    69.9,
    6,
    11.65,
  ],
  ['massinha-de-modelar-12', 'Massinha de Modelar 12 cores', 49.9, 5, 9.98],
  ['cozinha-mini-chef', 'Cozinha de Brinquedo Mini Chef', 349.9, 6, 58.32],
  ['jogo-da-memoria-bichinhos', 'Jogo da Memória Bichinhos', 59.9, 5, 11.98],
  ['kit-blocos-gigantes-40', 'Kit Blocos Gigantes 40 peças', 159.9, 6, 26.65],
  ['pelucia-coelho-soneca-25', 'Pelúcia Coelho Soneca 25 cm', 99.9, 6, 16.65],
  ['trem-de-madeira-encaixe', 'Trem de Madeira com Encaixe', 139.9, 6, 23.32],
];

const mockProducts16: Produto16[] = BASE.map(([id, name, price, n, v]) =>
  produto16(id, name, price, price, n, v)
);

const lista = (pares: Array<[string, string, number?]>) =>
  pares.map(([value, label, quantity]) => ({ value, label, quantity }));

const mockFacets16: RawFacet16[] = [
  {
    __typename: 'StoreFacetBoolean',
    key: 'category-1',
    label: 'Categoria',
    values: lista([
      ['blocos-de-montar', 'Blocos de montar', 42],
      ['pelucias', 'Pelúcias', 36],
      ['quebra-cabecas', 'Quebra-cabeças', 51],
      ['jogos', 'Jogos', 47],
    ]),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'faixa-etaria',
    label: 'Faixa etária',
    values: lista([
      ['0-2-anos', '0–2 anos'],
      ['3-5-anos', '3–5 anos'],
      ['6-8-anos', '6–8 anos'],
      ['9-anos', '9+ anos'],
    ]),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'cor',
    label: 'Cor',
    values: lista([
      ['colorido', 'Colorido', 88],
      ['azul', 'Azul', 41],
      ['rosa', 'Rosa', 37],
      ['verde', 'Verde', 29],
    ]),
  },
  {
    __typename: 'StoreFacetRange',
    key: 'price',
    label: 'Preço',
    min: { absolute: 29.9 },
    max: { absolute: 489.9 },
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'brand',
    label: 'Marca',
    values: lista([
      ['sua-marca', '[SUA MARCA]', 190],
      ['marca-01', '[Marca 01]', 31],
      ['marca-02', '[Marca 02]', 27],
    ]),
  },
];

/** Seleção do desenho: Faixa etária 3–5 anos e Cor Colorido. */
const MOCK_SELECTED_16: Selected16[] = [
  { key: 'faixa-etaria', value: '3-5-anos' },
  { key: 'cor', value: 'colorido' },
];

const MOCK_COUNT_16 = 248;
const MOCK_SORT_16 = 'orders_desc';

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

/** Quantos valores a lista mostra antes do "Ver todas". */
const LIMIT_LIST = 6;

const fill = (tpl: string, vars: Record<string, number | string>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

/* ── ícones (decorativos; seguem o texto via currentColor) ── */
const Ico = ({
  size = 18,
  w = 2.6,
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
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);
const Sliders = () => (
  <Ico w={2.2}>
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
}) => (
  <Ico size={size}>
    <path
      d={
        dir === 'down'
          ? 'm6 9 6 6 6-6'
          : dir === 'up'
            ? 'm6 15 6-6 6 6'
            : dir === 'left'
              ? 'm15 6-6 6 6 6'
              : 'm9 6 6 6-6 6'
      }
    />
  </Ico>
);
const Close = ({ size = 14, w = 2.8 }: { size?: number; w?: number }) => (
  <Ico size={size} w={w}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Ico>
);
const Grid3 = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="5" height="7" rx="1.5" />
    <rect x="9.5" y="4" width="5" height="7" rx="1.5" />
    <rect x="16" y="4" width="5" height="7" rx="1.5" />
    <rect x="3" y="13" width="5" height="7" rx="1.5" />
    <rect x="9.5" y="13" width="5" height="7" rx="1.5" />
    <rect x="16" y="13" width="5" height="7" rx="1.5" />
  </svg>
);
const Grid4 = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="2" y="4" width="4" height="7" rx="1" />
    <rect x="7.3" y="4" width="4" height="7" rx="1" />
    <rect x="12.7" y="4" width="4" height="7" rx="1" />
    <rect x="18" y="4" width="4" height="7" rx="1" />
    <rect x="2" y="13" width="4" height="7" rx="1" />
    <rect x="7.3" y="13" width="4" height="7" rx="1" />
    <rect x="12.7" y="13" width="4" height="7" rx="1" />
    <rect x="18" y="13" width="4" height="7" rx="1" />
  </svg>
);

/** Opções de uma faceta: as mesmas na coluna do desktop e no acordeão da tela do mobile. */
function FacetBody16({
  facet,
  idBase,
  buckets,
  isOn,
  onToggle,
  onPrice,
  labels,
}: {
  facet: Facet16;
  idBase: string;
  buckets: PriceBucket16[];
  isOn: (value: string) => boolean;
  onToggle: (value: string) => void;
  onPrice: (bucket: PriceBucket16) => void;
  labels: { showMoreLabel: string; showLessLabel: string };
}) {
  const [all, setAll] = useState(false);

  if (facet.kind === 'pills') {
    return (
      <div className={styles.pills} role="group" aria-label={facet.label}>
        {facet.values.map(v => {
          const on = isOn(v.value);
          return (
            <button
              key={v.value}
              type="button"
              className={`${styles.pill}${on ? ` ${styles.pillOn}` : ''}`}
              aria-pressed={on}
              onClick={() => onToggle(v.value)}
              data-role="facet-pill"
            >
              {v.label}
            </button>
          );
        })}
      </div>
    );
  }

  if (facet.kind === 'price') {
    // Rádio que também desmarca: clicar na faixa escolhida tira o filtro.
    return (
      <div className={styles.list} role="radiogroup" aria-label={facet.label}>
        {buckets.map((b, i) => {
          const id = `${idBase}-${i}`;
          return (
            <label
              key={b.value}
              className={styles.check}
              htmlFor={id}
              data-role="facet-check"
            >
              <input
                id={id}
                type="radio"
                name={idBase}
                checked={isOn(b.value)}
                onChange={() => undefined}
                onClick={() => onPrice(b)}
              />
              <span className={styles.checkName}>{b.label}</span>
            </label>
          );
        })}
      </div>
    );
  }

  const visiveis = all ? facet.values : facet.values.slice(0, LIMIT_LIST);
  const resto = facet.values.length - LIMIT_LIST;
  return (
    <div className={styles.list}>
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
      {resto > 0 && (
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
    </div>
  );
}

export default function CategoryMain16() {
  const {
    pageSize: pageSizeProp,
    specFacetKey,
    ageTitle,
    priceSteps,
    countLabel,
    filterLabel,
    filterTitle,
    sortLabel,
    sortMobileLabel,
    clearLabel,
    clearAllLabel,
    showMoreLabel,
    showLessLabel,
    priceUpToLabel,
    priceBetweenLabel,
    priceOverLabel,
    resultsLabel,
    emptyCountLabel,
    emptyTitle,
    emptyFilterTitle,
    emptyText,
    emptyPrimaryLabel,
    emptyPrimaryUrl,
    emptySecondaryLabel,
    emptySecondaryUrl,
  } = mainCategory16Mock;
  const stageEmptyTerm = TERMO_VAZIO;
  const PAGE =
    pageSizeProp && pageSizeProp > 0
      ? Math.min(Math.round(pageSizeProp), 50)
      : 12;

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const stageEmpty = !!stageEmptyTerm;
  const pageLevel = 0;
  const escopo = useCallback(
    (f: { key: string }) => isScopeFacet(f, pageLevel),
    [pageLevel]
  );

  const [mockSelected, setMockSelected] =
    useState<Selected16[]>(MOCK_SELECTED_16);
  const [mockSort, setMockSort] = useState(MOCK_SORT_16);
  const [mockPage, setMockPage] = useState(0);
  const selected: Selected16[] = stageEmpty ? [] : mockSelected;
  const userFacets = selected.filter(f => !escopo(f));
  const sort = mockSort;
  const term: string = stageEmptyTerm;
  const page: number = mockPage;

  const products: Produto16[] = stageEmpty ? [] : mockProducts16.slice(0, PAGE);
  const totalCount: number = stageEmpty ? 0 : MOCK_COUNT_16;
  const loading = false;
  const rawFacets: RawFacet16[] = mockFacets16;
  const facets = useMemo(
    () => pickFacets(rawFacets, 0, specFacetKey),
    [rawFacets, specFacetKey]
  );
  const priceFacet = facets.find(f => f.kind === 'price');
  const specFacet = facets.find(f => f.spec);
  const buckets = useMemo(
    () =>
      priceFacet
        ? priceBuckets(priceSteps, priceFacet, {
            upTo: priceUpToLabel || '',
            between: priceBetweenLabel || '',
            over: priceOverLabel || '',
          })
        : [],
    [priceFacet, priceSteps, priceUpToLabel, priceBetweenLabel, priceOverLabel]
  );
  const shownFacets = facets.filter(
    f => f.kind !== 'price' || buckets.length > 0
  );

  /* ── escrita do estado: local (o mesmo que lá acontece fora de uma PLP real) ── */
  const commit = (nextUser: Selected16[]) => {
    setMockSelected(nextUser);
    setMockPage(0);
  };
  const isSelected = (key: string, value: string) =>
    userFacets.some(f => f.key === key && f.value === value);
  const toggleValue = (key: string, value: string) =>
    commit(
      isSelected(key, value)
        ? userFacets.filter(f => !(f.key === key && f.value === value))
        : [...userFacets, { key, value }]
    );
  const setPrice = (key: string, b: PriceBucket16) =>
    isSelected(key, b.value)
      ? commit(userFacets.filter(x => x.key !== key))
      : commit([
          ...userFacets.filter(x => x.key !== key),
          { key, value: b.value },
        ]);
  const removeChip = (f: Selected16) =>
    commit(userFacets.filter(x => !(x.key === f.key && x.value === f.value)));

  const onSort = (value: string) => {
    setMockSort(value);
    setMockPage(0);
  };
  const pageHref = (p: number) => (p >= 0 ? '#' : '#');
  const goPage = (e: React.MouseEvent, p: number) => {
    e.preventDefault();
    setMockPage(p);
  };

  /* ── densidade da grade (desktop): 3 ou 4 por linha ── */
  const [cols, setCols] = useState<3 | 4>(3);

  /* ── tela de filtros (mobile): aplica na hora ── */
  const [panelOpen, setPanelOpen] = useState(false);
  const [acc, setAcc] = useState<Record<string, boolean>>({});
  const [panelOrder, setPanelOrder] = useState<string[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const openPanel = () => {
    // Como o desenho: as facetas com algo escolhido vêm primeiro e já abertas (ou a 1ª de todas).
    // A ordem é fixada na abertura, para o acordeão não pular enquanto o usuário escolhe.
    const comSel = shownFacets.filter(f =>
      userFacets.some(s => s.key === f.key)
    );
    const semSel = shownFacets.filter(f => !comSel.includes(f));
    setPanelOrder([...comSel, ...semSel].map(f => f.key));
    const abertas = comSel.length ? comSel : shownFacets.slice(0, 1);
    setAcc(Object.fromEntries(abertas.map(f => [f.key, true])));
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
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closePanel();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [panelOpen]);

  const listName = 'Listagem de produtos';

  const isEmpty = !loading && products.length === 0;
  const sortName = SORT_OPTIONS.find(([k]) => k === sort)?.[1] ?? 'Relevância';
  const userCount = userFacets.length;
  const temBarra = !isEmpty || userCount > 0;
  const total = totalCount.toLocaleString('pt-BR');
  const pages = Math.max(1, Math.ceil(totalCount / PAGE));
  const atual = Math.min(page, pages - 1) + 1;
  const labels = {
    showMoreLabel: showMoreLabel || '',
    showLessLabel: showLessLabel || '',
  };
  const chipLabel = (s: Selected16) => selectedLabel(s, facets, buckets);
  const resumo = (f: Facet16) =>
    userFacets
      .filter(s => s.key === f.key)
      .map(chipLabel)
      .join(', ');

  const sortSelect = (aria?: string) => (
    <select
      className={styles.sortSelect}
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

  const body = (f: Facet16, idBase: string) => (
    <FacetBody16
      facet={f}
      idBase={idBase}
      buckets={buckets}
      labels={labels}
      isOn={v => isSelected(f.key, v)}
      onToggle={v => toggleValue(f.key, v)}
      onPrice={b => setPrice(f.key, b)}
    />
  );

  const chipsAtivos = userFacets.map(f => {
    const label = chipLabel(f);
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
  });

  const bolhas =
    !!ageTitle && !!specFacet && !isEmpty ? (
      <nav className={styles.ages} aria-label={ageTitle} data-role="cm-ages">
        <span className={styles.agesTitle} aria-hidden="true">
          {ageTitle}
        </span>
        <ul className={styles.agesList}>
          {specFacet.values.map(v => {
            const on = isSelected(specFacet.key, v.value);
            const [numero, resto] = splitAge(v.label);
            return (
              <li key={v.value} className={styles.ageItem}>
                <button
                  type="button"
                  className={`${styles.age}${on ? ` ${styles.ageOn}` : ''}`}
                  aria-pressed={on}
                  aria-label={v.label}
                  onClick={() => toggleValue(specFacet.key, v.value)}
                  data-role="cm-age"
                >
                  {numero && (
                    <span className={styles.ageNum} aria-hidden="true">
                      {numero}
                    </span>
                  )}
                  <span aria-hidden="true">{resto}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    ) : null;

  const panelFacets = panelOrder
    .map(k => shownFacets.find(f => f.key === k))
    .filter((f): f is Facet16 => !!f)
    .concat(shownFacets.filter(f => !panelOrder.includes(f.key)));

  return (
    <div className={styles.mainCategory16Box}>
      <section
        className={styles.mainCategory16}
        aria-label={listName}
        data-role="cm-root"
      >
        <link rel="stylesheet" href={FONTES_16} />
        <div
          className={`${styles.inner}${temBarra ? '' : ` ${styles.innerEmpty}`}`}
        >
          {bolhas}

          {temBarra && (
            <>
              {/* desktop: contagem + chips ativos | ordenação + densidade */}
              <div className={styles.bar} data-role="cm-bar">
                <strong className={styles.count} data-role="cm-count">
                  {total} {countLabel}
                </strong>
                {userCount > 0 && (
                  <div className={styles.chips}>
                    {chipsAtivos}
                    <button
                      type="button"
                      className={styles.clearAll}
                      onClick={() => commit([])}
                      data-role="cm-clear-all"
                    >
                      {clearAllLabel}
                    </button>
                  </div>
                )}
                <label className={styles.sortBtn} data-role="sort-btn">
                  <span>
                    {sortLabel} {sortName}
                  </span>
                  <Chevron />
                  {sortSelect(sortLabel?.replace(/:\s*$/, ''))}
                </label>
                <div
                  className={styles.density}
                  role="group"
                  aria-label="Densidade da grade"
                >
                  {([3, 4] as const).map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.densityBtn}${cols === n ? ` ${styles.densityOn}` : ''}`}
                      aria-label={`${n} por linha`}
                      aria-pressed={cols === n}
                      onClick={() => setCols(n)}
                      data-role="cm-density"
                    >
                      {n === 3 ? <Grid3 /> : <Grid4 />}
                    </button>
                  ))}
                </div>
              </div>

              {/* mobile: Filtrar (n) | Ordenar; chips numa linha; contagem */}
              <div className={styles.mBar} data-role="cm-mbar">
                <button
                  ref={filterBtnRef}
                  type="button"
                  className={`${styles.mBtn} ${styles.mFilter}`}
                  aria-haspopup="dialog"
                  aria-expanded={panelOpen}
                  aria-controls={panelOpen ? `${uid}-panel` : undefined}
                  onClick={openPanel}
                  data-role="m-filter-btn"
                >
                  <Sliders />
                  {filterLabel}
                  {userCount > 0 && ` (${userCount})`}
                </button>
                <label className={`${styles.mBtn} ${styles.mSort}`}>
                  {sortMobileLabel || sortName}
                  <Chevron />
                  {sortSelect(sortLabel?.replace(/:\s*$/, ''))}
                </label>
              </div>
              {userCount > 0 && (
                <div className={styles.mChips} data-role="cm-mchips">
                  <div className={styles.mChipsRow}>
                    {chipsAtivos}
                    <button
                      type="button"
                      className={styles.clearAll}
                      onClick={() => commit([])}
                    >
                      {clearLabel}
                    </button>
                  </div>
                </div>
              )}
              <span className={styles.mCount} data-role="cm-mcount">
                {total} {countLabel}
              </span>
            </>
          )}

          {isEmpty ? (
            <div className={styles.empty} data-role="cm-empty">
              <div className={styles.emptyArt} aria-hidden="true">
                <svg
                  className={styles.emptySvg}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                  <path d="M9 10h.01M13 10h.01M9 13.5c1.2-.8 2.8-.8 4 0" />
                </svg>
                <span className={styles.emptyBadge}>{total}</span>
              </div>
              <div className={styles.emptyBody}>
                {emptyCountLabel && (
                  <span className={styles.emptyCount}>{emptyCountLabel}</span>
                )}
                {React.createElement(
                  term ? 'h1' : 'h2',
                  {
                    className: styles.emptyTitle,
                    'data-role': 'cm-empty-title',
                  },
                  term ? emptyTitle : emptyFilterTitle || emptyTitle,
                  term ? ` “${term}”` : null
                )}
                {emptyText && <p className={styles.emptyText}>{emptyText}</p>}
                {(emptyPrimaryLabel || emptySecondaryLabel) && (
                  <div className={styles.emptyActions}>
                    {emptyPrimaryLabel && (
                      <a
                        className={styles.emptyPrimary}
                        href={emptyPrimaryUrl || '/'}
                        data-role="cm-empty-primary"
                      >
                        {emptyPrimaryLabel}
                      </a>
                    )}
                    {emptySecondaryLabel && (
                      <a
                        className={styles.emptySecondary}
                        href={emptySecondaryUrl || '/'}
                        data-role="cm-empty-secondary"
                      >
                        {emptySecondaryLabel}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.layout}>
              {shownFacets.length > 0 && (
                <aside
                  className={styles.aside}
                  aria-label={filterTitle || filterLabel}
                  data-role="cm-aside"
                >
                  {shownFacets.map(f => (
                    <fieldset
                      key={f.key}
                      className={`${styles.facet}${f.kind === 'pills' ? ` ${styles.facetPills}` : ''}`}
                      data-role="cm-facet"
                    >
                      <legend className={styles.facetTitle}>{f.label}</legend>
                      {body(f, `${uid}-d-${f.key}`)}
                    </fieldset>
                  ))}
                </aside>
              )}

              <div className={styles.results}>
                <ul
                  className={`${styles.grid}${cols === 4 ? ` ${styles.grid4}` : ''}`}
                  aria-busy={loading || undefined}
                  data-role="cm-grid"
                >
                  {products.map((p, i) => (
                    <li key={p.id ?? i} className={styles.gridItem}>
                      <ProductCard16 product={p} showRating={false} />
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
                      className={`${styles.pageArrow}${atual > 1 ? '' : ` ${styles.pageArrowOff}`}`}
                      href={atual > 1 ? pageHref(atual - 2) : undefined}
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
                          …
                        </span>
                      ) : (
                        <a
                          key={n}
                          className={`${styles.pageNum}${n === atual ? ` ${styles.pageOn}` : ''}${
                            atual <= 2 &&
                            n === 3 &&
                            n !== pages &&
                            n !== atual + 1
                              ? ` ${styles.pageWide}`
                              : ''
                          }`}
                          href={pageHref(n - 1)}
                          aria-current={n === atual ? 'page' : undefined}
                          onClick={e => goPage(e, n - 1)}
                        >
                          {n}
                        </a>
                      )
                    )}
                    <a
                      className={`${styles.pageArrow}${atual < pages ? '' : ` ${styles.pageArrowOff}`}`}
                      href={atual < pages ? pageHref(atual) : undefined}
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
          <div
            id={`${uid}-panel`}
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${uid}-panel-title`}
            data-role="m-filter-panel"
          >
            <div className={styles.panelHead}>
              <h2 id={`${uid}-panel-title`} className={styles.panelTitle}>
                {filterTitle || filterLabel}
              </h2>
              <button
                ref={closeRef}
                type="button"
                className={styles.panelClose}
                aria-label="Fechar filtros"
                onClick={closePanel}
              >
                <Close size={20} w={2.6} />
              </button>
            </div>
            <div className={styles.panelBody}>
              {panelFacets.map(f => {
                const on = !!acc[f.key];
                const sum = resumo(f);
                return (
                  <div
                    key={f.key}
                    className={`${styles.accItem}${on ? ` ${styles.accOpen}` : ''}${f.kind === 'pills' ? ` ${styles.accPills}` : ''}`}
                  >
                    <button
                      type="button"
                      className={styles.accBtn}
                      aria-expanded={on}
                      aria-controls={`${uid}-acc-${f.key}`}
                      onClick={() => setAcc(a => ({ ...a, [f.key]: !on }))}
                      data-role="facet-head"
                    >
                      <span>
                        {f.label}
                        {sum && <span className={styles.accSum}> · {sum}</span>}
                      </span>
                      <Ico size={18}>
                        <path d={on ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                      </Ico>
                    </button>
                    {on && (
                      <div id={`${uid}-acc-${f.key}`}>
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
                {clearLabel}
              </button>
              <button
                type="button"
                className={styles.panelApply}
                onClick={closePanel}
                data-role="m-filter-results"
              >
                {fill(resultsLabel || '', { total })}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

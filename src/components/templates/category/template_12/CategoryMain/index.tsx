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
  FONTES_12,
  ProductCard12,
  produto12,
  type Produto12,
} from '@/components/templates/common/template_12/Spot';
import {
  type Facet12,
  type PriceBucket12,
  type RawFacet12,
  type Selected12,
  pickFacets,
  plural,
  priceBuckets,
  selectedLabel,
} from './facets';

/**
 * Espelha `organisms/MainCategory12` do faststore.starter (família 12, Suave; desenhos
 * `CategoryMain12`, `CategoryMain12-mobile-filtros` e `SearchEmpty12`). Mesmo markup, classes
 * e `data-role`; o CSS é derivado do SCSS de lá e as facetas passam pelo mesmo `facets.ts`
 * (cópia).
 *
 * O que sai em relação à origem:
 *  • `usePLP`/`useSearchPage`/`useProductsQuery`/`useSearch` → as constantes abaixo, que são
 *    os dados de exemplo do `mock.ts` de lá (9 produtos com as notas, facetas, seleção do
 *    desenho, contagem e ordenação); faceta e ordenação mudam num `useState` local — o mesmo
 *    que lá acontece fora de uma PLP real. "Carregar mais", como lá no palco, não carrega
 *    nada (sem `GridPage12`);
 *  • `toggleFacet`/`setFacet` do @faststore/sdk → as duas funções locais equivalentes;
 *  • analytics e sessão (useViewItemList, useAuth) → preview não emite evento.
 *
 * O estado vazio da busca (desenho `SearchEmpty12`) mora AQUI, como lá: renderiza quando a
 * lista de produtos sai vazia. Lá isso só acontece numa busca sem resultado (ou no palco,
 * pela prop `stageEmptyTerm`); aqui `TERMO_VAZIO` faz o papel da prop do palco — vazio, o
 * canvas mostra a grade.
 */

/* ── rótulos (o mock.ts de lá) ── */
const PAGE = 9;
const SPEC_FACET_KEY = 'tipo-de-pele';
const PRICE_STEPS = '50, 100, 200';
const L = {
  countLabel: 'produtos',
  filterLabel: 'Filtrar',
  filterTitle: 'Filtrar',
  sortLabel: 'Ordenar:',
  clearLabel: 'Limpar',
  clearAllLabel: 'Limpar tudo',
  searchPlaceholder: 'Buscar {faceta}',
  showMoreLabel: 'Ver todas as {faceta}',
  showLessLabel: 'Ver menos',
  priceUpToLabel: 'Até {max}',
  priceBetweenLabel: '{min} a {max}',
  priceOverLabel: 'Acima de {min}',
  selectedOneLabel: '{n} selecionado',
  selectedManyLabel: '{n} selecionados',
  resultsLabel: 'Ver {total} resultados',
  progressLabel: 'Você viu {shown} de {total} produtos',
  loadMoreLabel: 'Carregar mais',
  emptyTitle: 'Nenhum resultado para',
  emptyText:
    'Confira a grafia ou tente um termo mais geral, como o nome do produto ou da categoria.',
  emptyPrimaryLabel: 'Voltar para a página inicial',
  emptyPrimaryUrl: '#',
  emptySecondaryLabel: 'Ver novidades',
  emptySecondaryUrl: '#',
};

/** O papel do `stageEmptyTerm` do palco: com um termo, a réplica mostra o estado vazio. */
const TERMO_VAZIO = '';

/* ── dados de exemplo (o mock.ts de lá) ── */
const PRODUTOS: Produto12[] = [
  produto12(
    'serum-vitamina-c-10',
    'Sérum Vitamina C 10% 30 ml',
    129.9,
    129.9,
    3,
    43.3,
    { average: 4.9, totalCount: 1240 }
  ),
  produto12(
    'hidratante-facial-gel-creme',
    'Hidratante Facial Gel-Creme 50 g',
    89.9,
    89.9,
    3,
    29.97,
    { average: 4.8, totalCount: 860 }
  ),
  produto12(
    'protetor-solar-fps-50-toque-seco',
    'Protetor Solar FPS 50 Toque Seco 40 ml',
    79.9,
    94.9,
    2,
    39.95,
    { average: 4.7, totalCount: 2115 }
  ),
  produto12(
    'gel-de-limpeza-suave',
    'Gel de Limpeza Suave 150 ml',
    59.9,
    59.9,
    2,
    29.95,
    { average: 4.8, totalCount: 674 }
  ),
  produto12('agua-micelar-200-ml', 'Água Micelar 200 ml', 49.9, 49.9, 0, 0, {
    average: 4.7,
    totalCount: 1018,
  }),
  produto12('creme-para-olhos', 'Creme para Olhos 15 g', 99.9, 99.9, 3, 33.3, {
    average: 4.6,
    totalCount: 241,
  }),
  produto12(
    'kit-rotina-noturna',
    'Kit Rotina Noturna (3 itens)',
    249.9,
    289.7,
    3,
    83.3,
    { average: 4.9, totalCount: 97 }
  ),
  produto12(
    'mascara-facial-de-argila',
    'Máscara Facial de Argila 60 g',
    69.9,
    69.9,
    2,
    34.95,
    { average: 4.7, totalCount: 389 }
  ),
  produto12(
    'tonico-facial-calmante',
    'Tônico Facial Calmante 120 ml',
    54.9,
    54.9,
    2,
    27.45,
    { average: 4.8, totalCount: 455 }
  ),
];

const lista = (pares: Array<[string, string, number?]>) =>
  pares.map(([value, label, quantity]) => ({ value, label, quantity }));

const FACETAS: RawFacet12[] = [
  {
    __typename: 'StoreFacetBoolean',
    key: 'category-1',
    label: 'Categoria',
    values: lista([
      ['limpeza', 'Limpeza', 24],
      ['hidratantes', 'Hidratantes', 31],
      ['seruns', 'Séruns', 18],
      ['protetores', 'Protetores', 22],
      ['mascaras', 'Máscaras', 16],
    ]),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'tipo-de-pele',
    label: 'Tipo de pele',
    values: lista([
      ['oleosa', 'Oleosa'],
      ['seca', 'Seca'],
      ['mista', 'Mista'],
      ['sensivel', 'Sensível'],
      ['normal', 'Normal'],
    ]),
  },
  {
    __typename: 'StoreFacetRange',
    key: 'price',
    label: 'Faixa de preço',
    min: { absolute: 29.9 },
    max: { absolute: 389.9 },
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'brand',
    label: 'Marca',
    values: lista([
      ['marca-01', '[Marca 01]', 40],
      ['marca-02', '[Marca 02]', 27],
      ['marca-03', '[Marca 03]', 19],
      ['marca-04', '[Marca 04]', 14],
      ['marca-05', '[Marca 05]', 9],
      ['marca-06', '[Marca 06]', 6],
    ]),
  },
];

/** Seleção do desenho: Tipo de pele Mista e R$ 50 a R$ 100. */
const SELECAO: Selected12[] = [
  { key: 'tipo-de-pele', value: 'mista' },
  { key: 'price', value: '50-to-100' },
];
const TOTAL = 128;
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

/** Quantos valores a lista mostra antes do "Ver todas": a Marca (com busca) 3, as outras 6. */
const LIMIT_SEARCHABLE = 3;
const LIMIT_LIST = 6;

const fill = (tpl: string, vars: Record<string, number | string>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

/* ── toggleFacet/setFacet do @faststore/sdk, equivalentes ── */
const toggleFacet = (list: Selected12[], f: Selected12) =>
  list.some(x => x.key === f.key && x.value === f.value)
    ? list.filter(x => !(x.key === f.key && x.value === f.value))
    : [...list, f];
const setFacet = (list: Selected12[], f: Selected12) => [
  ...list.filter(x => x.key !== f.key),
  f,
];

/* ── ícones (decorativos; seguem o texto via currentColor) ── */
const Ico = ({
  size = 18,
  w = 1.8,
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
  <Ico>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </Ico>
);
const Chevron = () => (
  <Ico size={16}>
    <path d="m6 9 6 6 6-6" />
  </Ico>
);
const Close = ({ size = 14, w = 2 }: { size?: number; w?: number }) => (
  <Ico size={size} w={w}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Ico>
);
const Sign = ({ open }: { open: boolean }) => (
  <Ico>
    <path d={open ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
  </Ico>
);

/** Opções de uma faceta: as mesmas na coluna do desktop e no acordeão da folha do mobile. */
function FacetBody12({
  facet,
  idBase,
  buckets,
  isOn,
  onToggle,
  onPrice,
  labels,
}: {
  facet: Facet12;
  idBase: string;
  buckets: PriceBucket12[];
  isOn: (value: string) => boolean;
  onToggle: (value: string) => void;
  onPrice: (bucket: PriceBucket12) => void;
  labels: {
    searchPlaceholder: string;
    showMoreLabel: string;
    showLessLabel: string;
  };
}) {
  const [query, setQuery] = useState('');
  const [all, setAll] = useState(false);

  if (facet.kind === 'price' || facet.kind === 'pills') {
    const opts =
      facet.kind === 'price'
        ? buckets.map(b => ({
            value: b.value,
            label: b.label,
            on: isOn(b.value),
            act: () => onPrice(b),
          }))
        : facet.values.map(v => ({
            value: v.value,
            label: v.label,
            on: isOn(v.value),
            act: () => onToggle(v.value),
          }));
    return (
      <div className={styles.pills} role="group" aria-label={facet.label}>
        {opts.map(o => (
          <button
            key={o.value}
            type="button"
            className={`${styles.pill}${o.on ? ` ${styles.pillOn}` : ''}`}
            aria-pressed={o.on}
            onClick={o.act}
            data-role="facet-pill"
          >
            {o.label}
          </button>
        ))}
      </div>
    );
  }

  const limit = facet.searchable ? LIMIT_SEARCHABLE : LIMIT_LIST;
  const nome = facet.label.toLocaleLowerCase('pt-BR');
  const q = query.trim().toLocaleLowerCase('pt-BR');
  const filtrados = q
    ? facet.values.filter(v => v.label.toLocaleLowerCase('pt-BR').includes(q))
    : facet.values;
  const visiveis = all || q ? filtrados : filtrados.slice(0, limit);
  const resto = filtrados.length - limit;
  return (
    <div className={styles.list}>
      {facet.searchable && (
        <label className={styles.search}>
          <Ico size={16}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </Ico>
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
                {v.quantity.toLocaleString('pt-BR')}
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
    </div>
  );
}

export default function CategoryMain12() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  const term = TERMO_VAZIO;
  const stageEmpty = !!term;

  const [mockSelected, setMockSelected] = useState<Selected12[]>(SELECAO);
  const [sort, setSort] = useState(ORDEM);
  const userFacets = stageEmpty ? [] : mockSelected;

  const products: Produto12[] = stageEmpty ? [] : PRODUTOS.slice(0, PAGE);
  const totalCount = stageEmpty ? 0 : TOTAL;
  const facets = useMemo(() => pickFacets(FACETAS, 0, SPEC_FACET_KEY), []);
  const priceFacet = facets.find(f => f.kind === 'price');
  const buckets = useMemo(
    () =>
      priceFacet
        ? priceBuckets(PRICE_STEPS, priceFacet, {
            upTo: L.priceUpToLabel,
            between: L.priceBetweenLabel,
            over: L.priceOverLabel,
          })
        : [],
    [priceFacet]
  );
  // Preço sem faixas configuradas não tem o que mostrar.
  const shownFacets = facets.filter(
    f => f.kind !== 'price' || buckets.length > 0
  );

  const commit = useCallback(
    (nextUser: Selected12[]) => setMockSelected(nextUser),
    []
  );
  const isSelected = (key: string, value: string) =>
    userFacets.some(f => f.key === key && f.value === value);
  const toggleValue = (key: string, value: string) =>
    commit(toggleFacet(userFacets, { key, value }));
  const setPrice = (key: string, b: PriceBucket12) =>
    isSelected(key, b.value)
      ? commit(userFacets.filter(x => x.key !== key))
      : commit(setFacet(userFacets, { key, value: b.value }));
  const removeChip = (f: Selected12) =>
    commit(userFacets.filter(x => !(x.key === f.key && x.value === f.value)));

  /* ── folha de filtros (mobile): aplica na hora ── */
  const [panelOpen, setPanelOpen] = useState(false);
  const [acc, setAcc] = useState<Record<string, boolean>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const openPanel = () => {
    // Como o desenho: abre a 1ª faceta de opções com algo escolhido (ou a 1ª de todas).
    const alvo =
      shownFacets.find(
        f => f.kind !== 'price' && userFacets.some(s => s.key === f.key)
      ) ?? shownFacets[0];
    setAcc(alvo ? { [alvo.key]: true } : {});
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
  const labels = {
    searchPlaceholder: L.searchPlaceholder,
    showMoreLabel: L.showMoreLabel,
    showLessLabel: L.showLessLabel,
  };
  const chipLabel = (s: Selected12) => selectedLabel(s, facets, buckets);
  const resumo = (f: Facet12) => {
    const sel = userFacets.filter(s => s.key === f.key);
    if (!sel.length) return '';
    if (f.kind === 'price') return sel.map(chipLabel).join(', ');
    return fill(sel.length === 1 ? L.selectedOneLabel : L.selectedManyLabel, {
      n: sel.length,
    });
  };
  const sortAria = L.sortLabel.replace(/:\s*$/, '');

  const sortSelect = (aria?: string) => (
    <select
      className={styles.sortSelect}
      value={sort}
      aria-label={aria}
      onChange={e => setSort(e.target.value)}
      data-role="sort-select"
    >
      {SORT_OPTIONS.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );

  const body = (f: Facet12, idBase: string) => (
    <FacetBody12
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

  return (
    <div className={styles.mainCategory12Box}>
      <section
        className={styles.mainCategory12}
        aria-label={listName}
        data-role="cm-root"
      >
        <link rel="stylesheet" href={FONTES_12} />
        <div
          className={`${styles.inner}${temBarra ? '' : ` ${styles.innerEmpty}`}`}
        >
          {temBarra && (
            <>
              {/* desktop: contagem + chips ativos | ordenação */}
              <div className={styles.bar} data-role="cm-bar">
                <div className={styles.barStart}>
                  <strong className={styles.count} data-role="cm-count">
                    {total} {L.countLabel}
                  </strong>
                  {chipsAtivos}
                  {userCount > 0 && (
                    <button
                      type="button"
                      className={styles.clearAll}
                      onClick={() => commit([])}
                      data-role="cm-clear-all"
                    >
                      {L.clearAllLabel}
                    </button>
                  )}
                </div>
                <label className={styles.sortBtn} data-role="sort-btn">
                  <span className={styles.sortLabel}>{L.sortLabel}</span>
                  <strong>{sortName}</strong>
                  <Chevron />
                  {sortSelect(sortAria)}
                </label>
              </div>

              {/* mobile: Filtrar (n) | ordenação; contagem + chips numa linha */}
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
                  {L.filterLabel}
                  {userCount > 0 && ` (${userCount})`}
                </button>
                <label className={`${styles.mBtn} ${styles.mSort}`}>
                  {sortName}
                  <Chevron />
                  {sortSelect(sortAria)}
                </label>
              </div>
              <div className={styles.mChips} data-role="cm-mchips">
                <div className={styles.mChipsRow}>
                  <strong className={styles.mCount} data-role="cm-mcount">
                    {total} {L.countLabel}
                  </strong>
                  {chipsAtivos}
                </div>
              </div>
            </>
          )}

          {isEmpty ? (
            <div className={styles.empty} data-role="cm-empty">
              <div className={styles.emptyCard}>
                <span className={styles.emptyIcon} aria-hidden="true">
                  <Ico size={28}>
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </Ico>
                </span>
                {React.createElement(
                  term ? 'h1' : 'h2',
                  {
                    className: styles.emptyTitle,
                    'data-role': 'cm-empty-title',
                  },
                  L.emptyTitle,
                  term ? ` “${term}”` : null
                )}
                {L.emptyText && (
                  <p className={styles.emptyText}>{L.emptyText}</p>
                )}
                {(L.emptyPrimaryLabel || L.emptySecondaryLabel) && (
                  <div className={styles.emptyActions}>
                    {L.emptyPrimaryLabel && (
                      <a
                        className={styles.emptyPrimary}
                        href={L.emptyPrimaryUrl}
                        data-role="cm-empty-primary"
                      >
                        {L.emptyPrimaryLabel}
                      </a>
                    )}
                    {L.emptySecondaryLabel && (
                      <a
                        className={styles.emptySecondary}
                        href={L.emptySecondaryUrl}
                        data-role="cm-empty-secondary"
                      >
                        {L.emptySecondaryLabel}
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
                  aria-label={L.filterTitle || L.filterLabel}
                  data-role="cm-aside"
                >
                  {shownFacets.map(f => (
                    <fieldset
                      key={f.key}
                      className={styles.facet}
                      data-role="cm-facet"
                    >
                      <legend className={styles.facetTitle}>{f.label}</legend>
                      {body(f, `${uid}-d-${f.key}`)}
                    </fieldset>
                  ))}
                </aside>
              )}

              <div className={styles.results}>
                <ul className={styles.grid} data-role="cm-grid">
                  {products.map((p, i) => (
                    <li key={p.id ?? i} className={styles.gridItem}>
                      <ProductCard12 product={p} />
                    </li>
                  ))}
                </ul>

                {totalCount > 0 && (
                  <div className={styles.more} data-role="cm-more">
                    <span className={styles.progressText}>
                      {fill(L.progressLabel, { shown, total })}
                    </span>
                    <span className={styles.progress} aria-hidden="true">
                      <span
                        style={{
                          width: `${Math.min(100, (shown / totalCount) * 100)}%`,
                        }}
                      />
                    </span>
                    {hasMore && (
                      <button
                        type="button"
                        className={styles.moreBtn}
                        data-role="cm-load-more"
                      >
                        {L.loadMoreLabel}
                      </button>
                    )}
                  </div>
                )}
              </div>
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
                  {L.filterTitle || L.filterLabel}
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  className={styles.panelClose}
                  aria-label="Fechar filtros"
                  onClick={closePanel}
                >
                  <Close size={18} w={1.8} />
                </button>
              </div>
              <div className={styles.panelBody}>
                {shownFacets.map(f => {
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
                        data-role="facet-head"
                      >
                        {f.label}
                        <span className={styles.accEnd}>
                          {sum && <span className={styles.accSum}>{sum}</span>}
                          <Sign open={on} />
                        </span>
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
                  {fill(L.resultsLabel, { total })}
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_13, ProductCard13, produto13, type Produto13 } from '@/components/templates/common/template_13/Spot';
import {
  type Facet13,
  type PriceBucket13,
  type RawFacet13,
  type Selected13,
  pickFacets,
  plural,
  priceBuckets,
  selectedLabel,
} from './facets';

/**
 * Espelha `organisms/MainCategory13` do faststore.starter (família 13, Noturno; desenhos
 * `CategoryMain13`, `CategoryMain13-mobile-filtros` e `SearchEmpty13`). Mesmo markup, classes
 * e `data-role`; o CSS é derivado do SCSS de lá e as facetas passam pelo mesmo `facets.ts`
 * (cópia).
 *
 * O que sai em relação à origem:
 *  • `usePLP`/`useSearchPage`/`useProductsQuery`/`useSearch` → as constantes abaixo, que são
 *    os dados de exemplo do `mock.ts` de lá (9 produtos, facetas, seleção do desenho, contagem
 *    e ordenação); faceta e ordenação mudam num `useState` local — o mesmo que lá acontece fora
 *    de uma PLP real. "Ver mais", como lá no palco, não carrega nada (sem `GridPage13`);
 *  • `toggleFacet`/`setFacet` do @faststore/sdk → as duas funções locais equivalentes;
 *  • analytics e sessão (useViewItemList, useAuth) → preview não emite evento.
 *
 * O card é o ProductCard13 com o preço "de" e o "-N%" ligados (`showListPrice`), como lá.
 * O painel de filtros do mobile (desenho `-mobile-filtros`) abre pelo botão "Filtrar".
 *
 * O estado vazio da busca (desenho `SearchEmpty13`) mora AQUI, como lá: renderiza quando a
 * lista de produtos sai vazia. Lá isso só acontece numa busca sem resultado (ou no palco,
 * pela prop `stageEmptyTerm`); aqui `TERMO_VAZIO` faz o papel da prop do palco — vazio, o
 * canvas mostra a grade.
 */

/* ── rótulos (o mock.ts de lá) ── */
const PAGE = 9;
const SPEC_FACET_KEY = '';
const PRICE_STEPS = '300, 500, 800';
const L = {
  countLabel: 'produtos',
  hideFiltersLabel: 'Ocultar filtros',
  showFiltersLabel: 'Mostrar filtros',
  densityLabel: 'Ver',
  filterLabel: 'Filtrar',
  filterTitle: 'Filtrar',
  sortLabel: 'Ordenar:',
  clearLabel: 'Limpar',
  clearAllLabel: 'Limpar tudo',
  sizeChipLabel: 'Tam. {valor}',
  showMoreLabel: 'Ver mais {n} {faceta}',
  showLessLabel: 'Ver menos',
  priceUpToLabel: 'Até {max}',
  priceBetweenLabel: '{min} a {max}',
  priceOverLabel: 'Acima de {min}',
  resultsLabel: 'Ver {total} resultados',
  progressLabel: '{shown} de {total} produtos',
  loadMoreLabel: 'Ver mais',
  emptyEyebrow: '0 resultados',
  emptyTitle: 'Nenhum resultado para',
  emptyText: 'Confira a grafia ou tente um termo mais curto, como “tênis” ou “cano alto”.',
  emptyPrimaryLabel: 'Voltar para o início',
  emptyPrimaryUrl: '#',
  emptySecondaryLabel: 'Ver lançamentos',
  emptySecondaryUrl: '#',
};

/** O papel do `stageEmptyTerm` do palco: com um termo, a réplica mostra o estado vazio. */
const TERMO_VAZIO = '';

/* ── dados de exemplo (o mock.ts de lá) ── */
const BASE: Array<[string, string, number, number, number, number]> = [
  ['tenis-runner-v2-preto-lima', 'Tênis Runner V2 Preto/Lima', 699.9, 699.9, 6, 116.65],
  ['tenis-runner-v2-branco-cinza', 'Tênis Runner V2 Branco/Cinza', 699.9, 699.9, 6, 116.65],
  ['tenis-trail-night-refletivo', 'Tênis Trail Night Refletivo', 799.9, 799.9, 6, 133.32],
  ['tenis-court-low-branco', 'Tênis Court Low Branco', 499.9, 499.9, 6, 83.32],
  ['tenis-skate-pro-suede-preto', 'Tênis Skate Pro Suede Preto', 459.9, 459.9, 6, 76.65],
  ['tenis-basquete-high-lima', 'Tênis Basquete High Lima', 849.9, 849.9, 6, 141.65],
  ['tenis-runner-v1-oliva', 'Tênis Runner V1 Oliva', 399.9, 599.9, 6, 66.65],
  ['tenis-slip-on-canvas', 'Tênis Slip-On Canvas', 299.9, 299.9, 6, 49.98],
  ['tenis-chunky-noite', 'Tênis Chunky Noite', 749.9, 749.9, 6, 124.98],
];
const PRODUTOS: Produto13[] = BASE.map(([id, name, price, list, n, v]) => produto13(id, name, price, n, v, true, list));

const lista = (pares: Array<[string, string, number?]>) => pares.map(([value, label, quantity]) => ({ value, label, quantity }));

const FACETAS: RawFacet13[] = [
  {
    __typename: 'StoreFacetBoolean',
    key: 'tamanho',
    label: 'Tamanho',
    values: lista([
      ['37', '37'],
      ['38', '38'],
      ['39', '39'],
      ['40', '40'],
      ['41', '41'],
      ['42', '42'],
      ['43', '43'],
      ['44', '44'],
    ]),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'cor',
    label: 'Cor',
    values: lista([
      ['preto', 'Preto', 74],
      ['branco', 'Branco', 52],
      ['cinza', 'Cinza', 31],
      ['oliva', 'Oliva', 14],
      ['lima', 'Lima', 12],
      ['azul', 'Azul', 9],
      ['vermelho', 'Vermelho', 7],
      ['bege', 'Bege', 6],
      ['marrom', 'Marrom', 4],
    ]),
  },
  {
    __typename: 'StoreFacetRange',
    key: 'price',
    label: 'Preço',
    min: { absolute: 199.9 },
    max: { absolute: 1299.9 },
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'brand',
    label: 'Marca',
    values: lista([
      ['sua-marca', '[SUA MARCA]', 180],
      ['marca-01', '[Marca 01]', 12],
      ['marca-02', '[Marca 02]', 9],
      ['marca-03', '[Marca 03]', 11],
    ]),
  },
];

/** Seleção do desenho: Tamanho 41 e Cor Preto. */
const SELECAO: Selected13[] = [
  { key: 'tamanho', value: '41' },
  { key: 'cor', value: 'preto' },
];
const TOTAL = 212;
const ORDEM = 'release_desc';

/** Rótulos do enum `StoreSort` da busca. */
const SORT_OPTIONS: Array<[string, string]> = [
  ['score_desc', 'Relevância'],
  ['release_desc', 'Lançamentos'],
  ['orders_desc', 'Mais vendidos'],
  ['price_asc', 'Menor preço'],
  ['price_desc', 'Maior preço'],
  ['discount_desc', 'Maior desconto'],
  ['name_asc', 'Nome, A a Z'],
  ['name_desc', 'Nome, Z a A'],
];

/** Quantos valores a lista mostra antes do "Ver mais" (o desenho mostra 4 cores). */
const LIMIT_LIST = 4;
const DENSIDADES = [2, 3, 4] as const;

const fill = (tpl: string, vars: Record<string, number | string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

/* ── toggleFacet/setFacet do @faststore/sdk, equivalentes ── */
const toggleFacet = (list: Selected13[], f: Selected13) =>
  list.some(x => x.key === f.key && x.value === f.value)
    ? list.filter(x => !(x.key === f.key && x.value === f.value))
    : [...list, f];
const setFacet = (list: Selected13[], f: Selected13) => [...list.filter(x => x.key !== f.key), f];

/* ── ícones (decorativos; seguem o texto via currentColor) ── */
const Ico = ({ size = 18, w = 1.8, children }: { size?: number; w?: number; children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} aria-hidden="true">
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
  <Ico size={16} w={2}>
    <path d="m6 9 6 6 6-6" />
  </Ico>
);
const Close = ({ size = 14, w = 2.2 }: { size?: number; w?: number }) => (
  <Ico size={size} w={w}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Ico>
);
const Sign = ({ open }: { open: boolean }) => (
  <Ico w={2}>
    <path d={open ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
  </Ico>
);

/** Opções de uma faceta: as mesmas na coluna do desktop e no acordeão do painel do mobile. */
function FacetBody13({
  facet,
  idBase,
  buckets,
  isOn,
  onToggle,
  onPrice,
  labels,
}: {
  facet: Facet13;
  idBase: string;
  buckets: PriceBucket13[];
  isOn: (value: string) => boolean;
  onToggle: (value: string) => void;
  onPrice: (bucket: PriceBucket13) => void;
  labels: { showMoreLabel: string; showLessLabel: string };
}) {
  const [all, setAll] = useState(false);

  if (facet.kind === 'pills') {
    return (
      <div className={styles.sizes} role="group" aria-label={facet.label}>
        {facet.values.map(v => {
          const on = isOn(v.value);
          return (
            <button
              key={v.value}
              type="button"
              className={`${styles.size}${on ? ` ${styles.sizeOn}` : ''}`}
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
    return (
      <div className={styles.list}>
        {buckets.map((b, i) => {
          const id = `${idBase}-${i}`;
          return (
            <label key={b.value} className={styles.check} htmlFor={id} data-role="facet-radio">
              <input id={id} type="radio" name={idBase} checked={isOn(b.value)} onChange={() => onPrice(b)} />
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
          <label key={v.value} className={styles.check} htmlFor={id} data-role="facet-check">
            <input id={id} type="checkbox" checked={isOn(v.value)} onChange={() => onToggle(v.value)} />
            <span className={styles.checkName}>{v.label}</span>
            {typeof v.quantity === 'number' && <span className={styles.checkQty}>({v.quantity.toLocaleString('pt-BR')})</span>}
          </label>
        );
      })}
      {resto > 0 && (
        <button type="button" className={styles.linkBtn} aria-expanded={all} onClick={() => setAll(a => !a)}>
          {all ? labels.showLessLabel : fill(labels.showMoreLabel, { n: resto, faceta: plural(facet.label) })}
        </button>
      )}
    </div>
  );
}

export default function CategoryMain13() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  const term = TERMO_VAZIO;
  const stageEmpty = !!term;

  const [mockSelected, setMockSelected] = useState<Selected13[]>(SELECAO);
  const [sort, setSort] = useState(ORDEM);
  const userFacets = stageEmpty ? [] : mockSelected;

  /* ── coluna de filtros e densidade (desktop) ── */
  const [asideOpen, setAsideOpen] = useState(true);
  const [cols, setCols] = useState<number>(3);

  const products: Produto13[] = stageEmpty ? [] : PRODUTOS.slice(0, PAGE);
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
  const shownFacets = facets.filter(f => f.kind !== 'price' || buckets.length > 0);

  const commit = useCallback((nextUser: Selected13[]) => setMockSelected(nextUser), []);
  const isSelected = (key: string, value: string) => userFacets.some(f => f.key === key && f.value === value);
  const toggleValue = (key: string, value: string) => commit(toggleFacet(userFacets, { key, value }));
  const setPrice = (key: string, b: PriceBucket13) =>
    isSelected(key, b.value) ? commit(userFacets.filter(x => x.key !== key)) : commit(setFacet(userFacets, { key, value: b.value }));
  const removeChip = (f: Selected13) => commit(userFacets.filter(x => !(x.key === f.key && x.value === f.value)));

  /* ── painel de filtros (mobile, tela cheia): aplica na hora ── */
  const [panelOpen, setPanelOpen] = useState(false);
  const [acc, setAcc] = useState<Record<string, boolean>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const openPanel = () => {
    // Como o desenho: abre a 1ª faceta de opções com algo escolhido (ou a 1ª de todas).
    const alvo = shownFacets.find(f => f.kind !== 'price' && userFacets.some(s => s.key === f.key)) ?? shownFacets[0];
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
      if (e.key === 'Escape') closePanel();
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
  const sortAria = L.sortLabel.replace(/:\s*$/, '') || 'Ordenar';
  const userCount = userFacets.length;
  const total = totalCount.toLocaleString('pt-BR');
  const labels = { showMoreLabel: L.showMoreLabel, showLessLabel: L.showLessLabel };
  const chipLabel = (s: Selected13) => {
    const label = selectedLabel(s, facets, buckets);
    const f = facets.find(x => x.key === s.key);
    return f?.kind === 'pills' && L.sizeChipLabel ? fill(L.sizeChipLabel, { valor: label }) : label;
  };
  const resumo = (f: Facet13) =>
    userFacets
      .filter(s => s.key === f.key)
      .map(s => selectedLabel(s, facets, buckets))
      .join(', ');

  const sortSelect = (
    <select className={styles.sortSelect} value={sort} aria-label={sortAria} onChange={e => setSort(e.target.value)} data-role="sort-select">
      {SORT_OPTIONS.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );

  const body = (f: Facet13, idBase: string) => (
    <FacetBody13
      facet={f}
      idBase={idBase}
      buckets={buckets}
      labels={labels}
      isOn={v => isSelected(f.key, v)}
      onToggle={v => toggleValue(f.key, v)}
      onPrice={b => setPrice(f.key, b)}
    />
  );

  const chips = (clear: string | undefined) =>
    userCount > 0 && (
      <>
        {userFacets.map(f => {
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
        })}
        {clear && (
          <button type="button" className={styles.clearAll} onClick={() => commit([])} data-role="cm-clear-all">
            {clear}
          </button>
        )}
      </>
    );

  const emptyBlock = (
    <div className={styles.empty} data-role="cm-empty">
      {L.emptyEyebrow && <span className={styles.emptyEyebrow}>{L.emptyEyebrow}</span>}
      {React.createElement(
        term ? 'h1' : 'h2',
        { className: styles.emptyTitle, 'data-role': 'cm-empty-title' },
        L.emptyTitle,
        term ? ` “${term}”` : null
      )}
      {L.emptyText && <p className={styles.emptyText}>{L.emptyText}</p>}
      {(L.emptyPrimaryLabel || L.emptySecondaryLabel) && (
        <div className={styles.emptyActions}>
          {L.emptyPrimaryLabel && (
            <a className={styles.emptyPrimary} href={L.emptyPrimaryUrl || '#'} data-role="cm-empty-primary">
              {L.emptyPrimaryLabel}
            </a>
          )}
          {L.emptySecondaryLabel && (
            <a className={styles.emptySecondary} href={L.emptySecondaryUrl || '#'} data-role="cm-empty-secondary">
              {L.emptySecondaryLabel}
            </a>
          )}
        </div>
      )}
    </div>
  );

  // Busca sem resultado e sem filtro: só o estado vazio (desenho SearchEmpty13).
  if (isEmpty && userCount === 0) {
    return (
      <div className={styles.mainCategory13Box}>
        <section className={styles.mainCategory13} aria-label={listName} data-role="cm-root">
          <link rel="stylesheet" href={FONTES_13} />
          {emptyBlock}
        </section>
      </div>
    );
  }

  const asideId = `${uid}-aside`;
  const temAside = shownFacets.length > 0;
  const asideVisivel = temAside && asideOpen;

  return (
    <div className={styles.mainCategory13Box}>
      <section className={styles.mainCategory13} aria-label={listName} data-role="cm-root">
        <link rel="stylesheet" href={FONTES_13} />

        {/* mobile: Filtrar (n) | Ordenar */}
        <div className={styles.mBar} data-role="cm-mbar">
          <button
            ref={filterBtnRef}
            type="button"
            className={styles.mBtn}
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
          <label className={styles.mBtn}>
            {sortAria}
            <Chevron />
            {sortSelect}
          </label>
        </div>
        {userCount > 0 && (
          <div className={styles.mChips} data-role="cm-mchips">
            {chips(L.clearLabel)}
          </div>
        )}
        <p className={styles.mCount} data-role="cm-mcount">
          {total} {L.countLabel}
        </p>

        <div className={styles.inner}>
          {/* desktop: Ocultar filtros · contagem · Ordenar · Ver 2 3 4 */}
          <div className={styles.bar} data-role="cm-bar">
            {temAside && (
              <button
                type="button"
                className={styles.barBtn}
                aria-expanded={asideOpen}
                aria-controls={asideId}
                onClick={() => setAsideOpen(v => !v)}
                data-role="cm-toggle-filters"
              >
                <Sliders />
                {asideOpen ? L.hideFiltersLabel : L.showFiltersLabel}
              </button>
            )}
            <span className={styles.count} data-role="cm-count">
              {total} {L.countLabel}
            </span>
            <label className={`${styles.barBtn} ${styles.sortBtn}`} data-role="sort-btn">
              <span>
                {L.sortLabel} {sortName}
              </span>
              <Chevron />
              {sortSelect}
            </label>
            <div className={styles.density} role="group" aria-label={L.densityLabel || 'Colunas'}>
              {L.densityLabel && (
                <span className={styles.densityLabel} aria-hidden="true">
                  {L.densityLabel}
                </span>
              )}
              {DENSIDADES.map(n => (
                <button
                  key={n}
                  type="button"
                  className={`${styles.densityBtn}${cols === n ? ` ${styles.densityOn}` : ''}`}
                  aria-label={`${n} colunas`}
                  aria-pressed={cols === n}
                  onClick={() => setCols(n)}
                  data-role="cm-density"
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {userCount > 0 && (
            <div className={styles.chips} data-role="cm-chips">
              {chips(L.clearAllLabel)}
            </div>
          )}

          <div className={styles.layout}>
            {asideVisivel && (
              <aside id={asideId} className={styles.aside} aria-label={L.filterTitle || L.filterLabel} data-role="cm-aside">
                {shownFacets.map(f =>
                  // Tamanho, como no desenho, é um bloco com título (os botões já são um grupo
                  // rotulado); as listas de checkbox/rádio são fieldset + legend.
                  f.kind === 'pills' ? (
                    <div key={f.key} className={`${styles.facet} ${styles.facetPills}`} data-role="cm-facet">
                      <p className={styles.facetTitle} aria-hidden="true">
                        {f.label}
                      </p>
                      {body(f, `${uid}-d-${f.key}`)}
                    </div>
                  ) : (
                    <fieldset key={f.key} className={styles.facet} data-role="cm-facet">
                      <legend className={styles.facetTitle}>{f.label}</legend>
                      {body(f, `${uid}-d-${f.key}`)}
                    </fieldset>
                  )
                )}
              </aside>
            )}

            <div className={styles.results}>
              {isEmpty ? (
                emptyBlock
              ) : (
                <>
                  <ul className={`${styles.grid} ${styles[`cols${cols}`]}`} data-role="cm-grid">
                    {products.map((p, i) => (
                      <li key={p.id ?? i} className={styles.gridItem}>
                        <ProductCard13 product={p} showListPrice />
                      </li>
                    ))}
                  </ul>

                  {totalCount > 0 && (
                    <div className={styles.more} data-role="cm-more">
                      <span className={styles.progressText}>{fill(L.progressLabel, { shown, total })}</span>
                      <span className={styles.progress} aria-hidden="true">
                        <span style={{ width: `${Math.min(100, (shown / totalCount) * 100)}%` }} />
                      </span>
                      {hasMore && (
                        <button type="button" className={styles.moreBtn} data-role="cm-load-more">
                          {L.loadMoreLabel}
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {panelOpen && (
          <div id={`${uid}-panel`} className={styles.panel} role="dialog" aria-modal="true" aria-labelledby={`${uid}-panel-title`} data-role="m-filter-panel">
            <div className={styles.panelHead}>
              <h2 id={`${uid}-panel-title`} className={styles.panelTitle}>
                {L.filterTitle || L.filterLabel}
              </h2>
              <button ref={closeRef} type="button" className={styles.panelClose} aria-label="Fechar filtros" onClick={closePanel}>
                <Close size={22} w={1.8} />
              </button>
            </div>
            <div className={styles.panelBody}>
              {shownFacets.map(f => {
                const on = !!acc[f.key];
                const sum = resumo(f);
                return (
                  <div key={f.key} className={`${styles.accItem}${on ? ` ${styles.accOpen}` : ''}`}>
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
                      <Sign open={on} />
                    </button>
                    {on && (
                      <div id={`${uid}-acc-${f.key}`} className={styles.accBody}>
                        {body(f, `${uid}-m-${f.key}`)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className={styles.panelFoot}>
              <button type="button" className={styles.panelClear} onClick={() => commit([])}>
                {L.clearLabel}
              </button>
              <button type="button" className={styles.panelApply} onClick={closePanel} data-role="m-filter-results">
                {fill(L.resultsLabel, { total })}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

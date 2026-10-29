'use client';

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_14, ProductCard14, produto14, type Produto14 } from '@/components/templates/common/template_14/Spot';
import {
  type Facet14,
  type PriceBucket14,
  type RawFacet14,
  type Selected14,
  pageList,
  pickFacets,
  plural,
  priceBuckets,
  selectedLabel,
} from './facets';

/**
 * Espelha `organisms/MainCategory14` do faststore.starter (família 14, Esportiva; desenhos
 * `CategoryMain14`, `CategoryMain14-mobile-filtros` e `SearchEmpty14`). Mesmo markup, classes
 * e `data-role`; o CSS é derivado do SCSS de lá e as facetas passam pelo mesmo `facets.ts`
 * (cópia).
 *
 * O que sai em relação à origem:
 *  • `usePLP`/`useSearchPage`/`useProductsQuery`/`useSearch` → as constantes abaixo, que são
 *    os dados de exemplo do `mock.ts` de lá (9 produtos com as notas do desenho, facetas,
 *    seleção Modalidade "Asfalto" + Tamanho 41, contagem 186 e ordenação "Mais vendidos");
 *    faceta, ordenação e página mudam num `useState` local — o mesmo que lá acontece fora de
 *    uma PLP real;
 *  • `toggleFacet`/`setFacet` do @faststore/sdk → as duas funções locais equivalentes;
 *  • analytics e sessão (useViewItemList, useAuth) → preview não emite evento.
 *
 * O card é o ProductCard14 (as regras de selo e "-N%" são as de lá). O painel de filtros do
 * mobile (desenho `-mobile-filtros`) abre pelo botão "Filtrar".
 *
 * O estado vazio da busca (desenho `SearchEmpty14`) mora AQUI, como lá: renderiza quando a
 * lista de produtos sai vazia. Lá isso só acontece numa busca sem resultado (ou no palco,
 * pela prop `stageEmptyTerm`); aqui `TERMO_VAZIO` faz o papel da prop do palco — vazio, o
 * canvas mostra a grade.
 */

/* ── rótulos (o mock.ts de lá) ── */
const PAGE = 9;
const SPEC_FACET_KEY = 'modalidade';
const PRICE_STEPS = '150, 300, 600';
const L = {
  specAllLabel: 'Todas',
  countLabel: 'produtos',
  filterLabel: 'Filtrar',
  sortLabel: 'Ordenar por',
  clearLabel: 'Limpar',
  clearAllLabel: 'Limpar tudo',
  sizeChipLabel: 'Tam. {valor}',
  showMoreLabel: 'Ver mais {n} {faceta}',
  showLessLabel: 'Ver menos',
  priceUpToLabel: 'Até {max}',
  priceBetweenLabel: '{min} a {max}',
  priceOverLabel: 'Acima de {min}',
  resultsLabel: 'Ver {total} resultados',
  rangeLabel: 'Mostrando {from}–{to} de {total} produtos',
  emptyArtBig: '0',
  emptyArtSmall: 'km',
  emptyEyebrow: '0 resultados',
  emptyTitle: 'Nenhum resultado para',
  emptyText: 'Confira a grafia ou tente um termo mais curto, como “tênis de pista” ou “sapatilha”.',
  emptyPrimaryLabel: 'Ver mais vendidos',
  emptyPrimaryUrl: '#',
  emptySecondaryLabel: 'Voltar para o início',
  emptySecondaryUrl: '#',
};

/** O papel do `stageEmptyTerm` do palco: com um termo, a réplica mostra o estado vazio. */
const TERMO_VAZIO = '';

/* ── dados de exemplo (o mock.ts de lá) ── */
const NOTAS: Record<string, { average: number; totalCount: number }> = {
  'tenis-velox-run-3': { average: 5, totalCount: 212 },
  'camiseta-dry-pace': { average: 5, totalCount: 87 },
  'tenis-velox-trail': { average: 5, totalCount: 41 },
  'shorts-split-5': { average: 5, totalCount: 56 },
};
const PRODUTOS: Produto14[] = [
  produto14('tenis-velox-run-3', 'Tênis Velox Run 3', 699.9, 899.9, 10, 69.99, 671.9),
  produto14('camiseta-dry-pace', 'Camiseta Dry Pace', 129.9, 129.9, 10, 12.99),
  produto14('legging-compressao-core', 'Legging Compressão Core', 219.9, 259.9, 10, 21.99),
  produto14('tenis-velox-trail', 'Tênis Velox Trail', 899.9, 899.9, 10, 89.99, 863.9),
  produto14('shorts-split-5', "Shorts Split 5''", 149.9, 149.9, 10, 14.99),
  produto14('garrafa-termica-750-ml', 'Garrafa Térmica 750 ml', 89.9, 89.9, 3, 29.97, 86.3),
  produto14('jaqueta-corta-vento-pace', 'Jaqueta Corta-Vento Pace', 399.9, 469.9, 10, 39.99),
  produto14('meia-pace-cano-medio', 'Meia Pace Cano Médio', 59.9, 59.9, 2, 29.95),
  produto14('mochila-treino-22-l', 'Mochila Treino 22 L', 199.9, 199.9, 0, 0, 0, false),
].map(p => ({ ...p, rating: NOTAS[p.id] ?? null }));

const lista = (pares: Array<[string, string, number?]>) => pares.map(([value, label, quantity]) => ({ value, label, quantity }));

const FACETAS: RawFacet14[] = [
  {
    __typename: 'StoreFacetBoolean',
    key: 'modalidade',
    label: 'Modalidade',
    values: lista([
      ['asfalto', 'Asfalto'],
      ['trail', 'Trail'],
      ['esteira', 'Esteira'],
      ['pista', 'Pista'],
      ['provas-de-rua', 'Provas de rua'],
    ]),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'category-1',
    label: 'Categoria',
    values: lista([
      ['tenis', 'Tênis', 64],
      ['camisetas', 'Camisetas', 38],
      ['shorts', 'Shorts', 27],
      ['leggings', 'Leggings', 22],
      ['acessorios', 'Acessórios', 35],
    ]),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'tamanho',
    label: 'Tamanho',
    values: lista(['PP', 'P', 'M', 'G', 'GG', '38', '39', '40', '41', '42', '43', '44'].map(t => [t.toLowerCase(), t])),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'cor',
    label: 'Cor',
    values: lista([
      ['preto', 'Preto', 54],
      ['marinho', 'Marinho', 41],
      ['vermelho', 'Vermelho', 22],
      ['branco', 'Branco', 37],
      ['verde-limao', 'Verde-limão', 9],
    ]),
  },
  {
    __typename: 'StoreFacetRange',
    key: 'price',
    label: 'Preço',
    min: { absolute: 39.9 },
    max: { absolute: 1299.9 },
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'brand',
    label: 'Marca',
    values: lista([
      ['sua-marca', '[Sua Marca]', 120],
      ['marca-01', '[Marca 01]', 31],
      ['marca-02', '[Marca 02]', 18],
      ['marca-03', '[Marca 03]', 17],
    ]),
  },
];

/** Seleção do desenho: Modalidade Asfalto e Tamanho 41. */
const SELECIONADAS: Selected14[] = [
  { key: 'modalidade', value: 'asfalto' },
  { key: 'tamanho', value: '41' },
];
const TOTAL = 186;
const SORT_INICIAL = 'orders_desc';

/** Rótulos do enum `StoreSort` da busca. */
const SORT_OPTIONS: Array<[string, string]> = [
  ['score_desc', 'Relevância'],
  ['orders_desc', 'Mais vendidos'],
  ['price_asc', 'Menor preço'],
  ['price_desc', 'Maior preço'],
  ['discount_desc', 'Maiores descontos'],
  ['release_desc', 'Lançamentos'],
  ['name_asc', 'Nome, A a Z'],
  ['name_desc', 'Nome, Z a A'],
];

/** Quantos valores a lista mostra antes do "Ver mais" (o desenho mostra até 5). */
const LIMIT_LIST = 6;

const fill = (tpl: string, vars: Record<string, number | string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

/* ── toggleFacet/setFacet do @faststore/sdk, equivalentes ── */
const toggleFacet = (list: Selected14[], f: Selected14) =>
  list.some(x => x.key === f.key && x.value === f.value)
    ? list.filter(x => !(x.key === f.key && x.value === f.value))
    : [...list, f];
const setFacet = (list: Selected14[], f: Selected14) => [...list.filter(x => x.key !== f.key), f];

/* ── ícones (decorativos; seguem o texto via currentColor) ── */
const Ico = ({ size = 18, w = 2, children }: { size?: number; w?: number; children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="square" aria-hidden="true">
    {children}
  </svg>
);
const Sliders = ({ size = 20 }: { size?: number }) => (
  <Ico size={size}>
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </Ico>
);
const Close = ({ size = 14, w = 2.2 }: { size?: number; w?: number }) => (
  <Ico size={size} w={w}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Ico>
);
const Sign = ({ open }: { open: boolean }) => (
  <Ico w={2.4}>
    <path d={open ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
  </Ico>
);
const Arrow = ({ dir }: { dir: 'left' | 'right' }) => (
  <Ico size={20} w={2.4}>
    <path d={dir === 'left' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
  </Ico>
);

/** Opções de uma faceta: as mesmas na coluna do desktop e no acordeão do painel do mobile. */
function FacetBody14({
  facet,
  idBase,
  buckets,
  isOn,
  onToggle,
  onPick,
  labels,
}: {
  facet: Facet14;
  idBase: string;
  buckets: PriceBucket14[];
  isOn: (value: string) => boolean;
  onToggle: (value: string) => void;
  onPick: (value: string) => void;
  labels: { showMoreLabel: string; showLessLabel: string; specAllLabel: string };
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

  if (facet.kind === 'price' || facet.kind === 'spec') {
    const opcoes =
      facet.kind === 'price'
        ? buckets.map(b => ({ value: b.value, label: b.label }))
        : facet.values.map(v => ({ value: v.value, label: v.label }));
    return (
      <div className={styles.list}>
        {opcoes.map((b, i) => {
          const id = `${idBase}-${i}`;
          return (
            <label key={b.value} className={styles.check} htmlFor={id} data-role="facet-radio">
              <input id={id} type="radio" name={idBase} checked={isOn(b.value)} onChange={() => onPick(b.value)} />
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
            {typeof v.quantity === 'number' && <span className={styles.checkQty}>{v.quantity.toLocaleString('pt-BR')}</span>}
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

export default function CategoryMain14() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const term = TERMO_VAZIO;
  const stageEmpty = !!term;

  const [mockSelected, setMockSelected] = useState<Selected14[]>(SELECIONADAS);
  const [mockSort, setMockSort] = useState(SORT_INICIAL);
  const [mockPage, setMockPage] = useState(0);
  const userFacets = stageEmpty ? [] : mockSelected;
  const sort = mockSort;
  const page = mockPage;

  const products: Produto14[] = stageEmpty ? [] : PRODUTOS.slice(0, PAGE);
  const totalCount = stageEmpty ? 0 : TOTAL;
  const facets = useMemo(() => pickFacets(FACETAS, 0, SPEC_FACET_KEY), []);
  const priceFacet = facets.find(f => f.kind === 'price');
  const buckets = useMemo(
    () =>
      priceFacet
        ? priceBuckets(PRICE_STEPS, priceFacet, { upTo: L.priceUpToLabel, between: L.priceBetweenLabel, over: L.priceOverLabel })
        : [],
    [priceFacet]
  );
  const shownFacets = facets.filter(f => f.kind !== 'price' || buckets.length > 0);
  const specFacet = shownFacets.find(f => f.kind === 'spec');
  const asideFacets = shownFacets.filter(f => f.kind !== 'spec');

  const commit = useCallback((nextUser: Selected14[]) => {
    setMockSelected(nextUser);
    setMockPage(0);
  }, []);
  const isSelected = (key: string, value: string) => userFacets.some(f => f.key === key && f.value === value);
  const toggleValue = (key: string, value: string) => commit(toggleFacet(userFacets, { key, value }));
  /** Escolha única: o mesmo valor de novo (ou vazio) limpa a faceta. */
  const pickValue = (key: string, value: string) =>
    !value || isSelected(key, value)
      ? commit(userFacets.filter(x => x.key !== key))
      : commit(setFacet(userFacets, { key, value }));
  const removeChip = (f: Selected14) => commit(userFacets.filter(x => !(x.key === f.key && x.value === f.value)));

  const onSort = (value: string) => {
    setMockSort(value);
    setMockPage(0);
  };
  const goPage = (e: React.MouseEvent, p: number) => {
    e.preventDefault();
    setMockPage(p);
  };

  /* ── painel de filtros (mobile, tela cheia): aplica na hora ── */
  const [panelOpen, setPanelOpen] = useState(false);
  const [acc, setAcc] = useState<Record<string, boolean>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const openPanel = () => {
    // Como o desenho: abre a 1ª faceta de opções com algo escolhido (ou a 1ª da coluna).
    const alvo =
      asideFacets.find(f => f.kind !== 'price' && userFacets.some(s => s.key === f.key)) ?? asideFacets[0] ?? specFacet;
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
    const doc = closeRef.current?.ownerDocument ?? document;
    const prev = doc.body.style.overflow;
    doc.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closePanel();
    doc.addEventListener('keydown', onKey);
    return () => {
      doc.body.style.overflow = prev;
      doc.removeEventListener('keydown', onKey);
    };
  }, [panelOpen]);

  const listName = 'Listagem de produtos';
  const isEmpty = products.length === 0;
  const userCount = userFacets.length;
  const total = totalCount.toLocaleString('pt-BR');
  const pages = Math.max(1, Math.ceil(totalCount / PAGE));
  const atual = Math.min(page, pages - 1) + 1;
  const from = totalCount ? (atual - 1) * PAGE + 1 : 0;
  const to = Math.min(totalCount, (atual - 1) * PAGE + products.length);
  const labels = { showMoreLabel: L.showMoreLabel, showLessLabel: L.showLessLabel, specAllLabel: L.specAllLabel };
  const chipLabel = (s: Selected14) => {
    const label = selectedLabel(s, facets, buckets);
    const f = facets.find(x => x.key === s.key);
    return f?.kind === 'pills' && L.sizeChipLabel ? fill(L.sizeChipLabel, { valor: label }) : label;
  };
  const resumo = (f: Facet14) =>
    userFacets
      .filter(s => s.key === f.key)
      .map(s => selectedLabel(s, facets, buckets))
      .join(', ');

  const sortSelect = (id: string, aria?: string) => (
    <select id={id} className={styles.sortSelect} value={sort} aria-label={aria} onChange={e => onSort(e.target.value)} data-role="sort-select">
      {SORT_OPTIONS.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );

  const body = (f: Facet14, idBase: string) => (
    <FacetBody14
      facet={f}
      idBase={idBase}
      buckets={buckets}
      labels={labels}
      isOn={v => isSelected(f.key, v)}
      onToggle={v => toggleValue(f.key, v)}
      onPick={v => pickValue(f.key, v)}
    />
  );

  const chips =
    userCount > 0 &&
    userFacets.map(f => {
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
  const clearAll = userCount > 0 && L.clearAllLabel && (
    <button type="button" className={styles.clearAll} onClick={() => commit([])} data-role="cm-clear-all">
      {L.clearAllLabel}
    </button>
  );

  const emptyBlock = (
    <div className={styles.empty} data-role="cm-empty">
      {(L.emptyArtBig || L.emptyArtSmall) && (
        <span className={styles.emptyArt} aria-hidden="true">
          {L.emptyArtBig}
          {L.emptyArtSmall && <span className={styles.emptyArtSmall}>{L.emptyArtSmall}</span>}
        </span>
      )}
      <div className={styles.emptyBody}>
        {L.emptyEyebrow && <span className={styles.emptyEyebrow}>{L.emptyEyebrow}</span>}
        {React.createElement(
          term ? 'h1' : 'h2',
          { className: styles.emptyTitle, 'data-role': 'cm-empty-title' },
          L.emptyTitle,
          term ? ` “${term}”` : null
        )}
        {L.emptyText && <p className={styles.emptyText}>{L.emptyText}</p>}
        <div className={styles.emptyActions}>
          <a className={styles.emptyPrimary} href={L.emptyPrimaryUrl} data-role="cm-empty-primary">
            {L.emptyPrimaryLabel}
            <Ico w={2.4}>
              <path d="M4 12h15M13 6l6 6-6 6" />
            </Ico>
          </a>
          <a className={styles.emptySecondary} href={L.emptySecondaryUrl} data-role="cm-empty-secondary">
            {L.emptySecondaryLabel}
          </a>
        </div>
      </div>
    </div>
  );

  // Busca sem resultado e sem filtro: só o estado vazio (desenho SearchEmpty14).
  if (isEmpty && userCount === 0) {
    return (
      <div className={styles.mainCategory14Box}>
        <section className={`${styles.mainCategory14} ${styles.onlyEmpty}`} aria-label={listName} data-role="cm-root">
          <link rel="stylesheet" href={FONTES_14} />
          {emptyBlock}
        </section>
      </div>
    );
  }

  const specOn = specFacet ? userFacets.find(s => s.key === specFacet.key)?.value ?? '' : '';
  const specChip = (value: string, label: string) => {
    const on = specOn === value;
    return (
      <li key={value || '_todas'} className={styles.specItem}>
        <a
          className={`${styles.specChip}${on ? ` ${styles.specOn}` : ''}`}
          href="#"
          aria-current={on ? 'true' : undefined}
          onClick={e => {
            e.preventDefault();
            pickValue(specFacet?.key ?? '', on ? '' : value);
          }}
          data-role="cm-spec-chip"
        >
          {label}
        </a>
      </li>
    );
  };

  return (
    <div className={styles.mainCategory14Box}>
      <section className={styles.mainCategory14} aria-label={listName} data-role="cm-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.inner}>
          {specFacet && (
            <nav className={styles.spec} aria-label={specFacet.label} data-role="cm-spec">
              <span className={styles.specLabel} aria-hidden="true">
                {specFacet.label}
              </span>
              <ul className={styles.specList}>
                {L.specAllLabel && specChip('', L.specAllLabel)}
                {specFacet.values.map(v => specChip(v.value, v.label))}
              </ul>
            </nav>
          )}

          {/* mobile: Filtrar (n) | ordenação */}
          <div className={styles.mBar} data-role="cm-mbar">
            <button
              ref={filterBtnRef}
              type="button"
              className={styles.mFilter}
              aria-haspopup="dialog"
              aria-expanded={panelOpen}
              aria-controls={panelOpen ? `${uid}-panel` : undefined}
              onClick={openPanel}
              data-role="m-filter-btn"
            >
              <Sliders size={18} />
              {L.filterLabel}
              {userCount > 0 && ` (${userCount})`}
            </button>
            <div className={styles.mSort}>{sortSelect(`${uid}-sort-m`, L.sortLabel)}</div>
          </div>
          {userCount > 0 && (
            <div className={styles.mChips} data-role="cm-mchips">
              {chips}
              {clearAll}
            </div>
          )}
          <p className={styles.mCount} data-role="cm-mcount">
            {total} {L.countLabel}
          </p>

          {/* desktop: contagem · chips ativos · Ordenar por */}
          <div className={styles.bar} data-role="cm-bar">
            <span className={styles.count} data-role="cm-count">
              {total} {L.countLabel}
            </span>
            {userCount > 0 && (
              <div className={styles.chips} data-role="cm-chips">
                {chips}
                {clearAll}
              </div>
            )}
            <div className={styles.sort}>
              <label className={styles.sortLabel} htmlFor={`${uid}-sort`}>
                {L.sortLabel}
              </label>
              {sortSelect(`${uid}-sort`)}
            </div>
          </div>

          <div className={styles.layout}>
            {asideFacets.length > 0 && (
              <aside className={styles.aside} aria-label={L.filterLabel} data-role="cm-aside">
                <h2 className={styles.asideTitle}>
                  <Sliders />
                  {L.filterLabel}
                </h2>
                {asideFacets.map(f => (
                  <fieldset key={f.key} className={`${styles.facet}${f.kind === 'pills' ? ` ${styles.facetPills}` : ''}`} data-role="cm-facet">
                    <legend className={styles.facetTitle}>{f.label}</legend>
                    {body(f, `${uid}-d-${f.key}`)}
                  </fieldset>
                ))}
              </aside>
            )}

            <div className={styles.results}>
              {isEmpty ? (
                emptyBlock
              ) : (
                <>
                  <ul className={styles.grid} data-role="cm-grid">
                    {products.map((p, i) => (
                      <li key={p.id ?? i} className={styles.gridItem}>
                        <ProductCard14 product={p} />
                      </li>
                    ))}
                  </ul>

                  {totalCount > 0 && (
                    <nav className={styles.pagination} aria-label="Paginação" data-role="cm-pagination">
                      {pages > 1 && (
                        <div className={styles.pages}>
                          {atual > 1 ? (
                            <a
                              className={`${styles.pageBtn} ${styles.pageArrow}`}
                              href="#"
                              aria-label="Página anterior"
                              onClick={e => goPage(e, atual - 2)}
                            >
                              <Arrow dir="left" />
                            </a>
                          ) : (
                            <span className={`${styles.pageBtn} ${styles.pageOff}`} aria-disabled="true" aria-label="Página anterior">
                              <Arrow dir="left" />
                            </span>
                          )}
                          {pageList(atual, pages).map((n, i) =>
                            n === null ? (
                              <span key={`gap-${i}`} className={styles.pageGap} aria-hidden="true">
                                …
                              </span>
                            ) : n === atual ? (
                              <span key={n} className={`${styles.pageBtn} ${styles.pageNum} ${styles.pageOn}`} aria-current="page">
                                {n}
                              </span>
                            ) : (
                              <a key={n} className={`${styles.pageBtn} ${styles.pageNum}`} href="#" onClick={e => goPage(e, n - 1)}>
                                {n}
                              </a>
                            )
                          )}
                          {atual < pages ? (
                            <a className={`${styles.pageBtn} ${styles.pageNext}`} href="#" aria-label="Próxima página" onClick={e => goPage(e, atual)}>
                              <Arrow dir="right" />
                            </a>
                          ) : (
                            <span className={`${styles.pageBtn} ${styles.pageOff}`} aria-disabled="true" aria-label="Próxima página">
                              <Arrow dir="right" />
                            </span>
                          )}
                        </div>
                      )}
                      <span className={styles.rangeText}>
                        {fill(L.rangeLabel, { from: from.toLocaleString('pt-BR'), to: to.toLocaleString('pt-BR'), total })}
                      </span>
                    </nav>
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
                <Sliders />
                {L.filterLabel}
              </h2>
              <button ref={closeRef} type="button" className={styles.panelClose} aria-label="Fechar filtros" onClick={closePanel}>
                <Close size={22} w={2.2} />
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

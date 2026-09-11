'use client';

import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/MainCategory07` do faststore.starter — a PLP inteira:
 * trilha, título, subtítulo e chips de subcategoria; sidebar de filtros com
 * blocos colapsáveis e slider de preço; barra de ordenação com contador e
 * chips ativos; grade de cards. Mobile é uma árvore própria, com bottom-sheet
 * de filtros.
 *
 * O que sai em relação à origem:
 *  • `usePLP`/`useProductsQuery`/`useSearchPage`/`useSearch` → as constantes
 *    abaixo, que são o mesmo conteúdo do `mock.ts` de lá;
 *  • `toggleFacet`/`setFacet` do SDK → `useState` local, só para o usuário ver
 *    o filtro marcar e desmarcar no preview;
 *  • `useViewItemList`/`trackSelectItem` → preview não emite evento;
 *  • os `id` `cb-*` do mock (rótulo interno de um cliente) → `p1`…`p8`.
 *
 * Dois blocos da origem NÃO são replicados, e isso é fidelidade, não omissão:
 * o guia de tamanhos só renderiza com banner do Intelligent Search cadastrado
 * (sem fallback, por decisão de lá) e a paginação só com dados reais — nenhum
 * dos dois aparece no palco da origem.
 *
 * Os produtos não têm imagem no mock da origem: o gradiente do `.cardMedia` É
 * o visual real. Pôr um placeholder aqui criaria uma imagem que o original não
 * tem.
 */
interface Produto {
  id: string;
  title: string;
  price: number;
  flag?: string;
  flagVariant?: 'gold' | 'new' | 'sale';
  parcela: string;
  /** ausente em 4 produtos: sem plano de Pix, a origem NÃO renderiza a linha */
  pix?: string;
  url: string;
}

interface ValorFacet {
  value: string;
  label: string;
  selected?: boolean;
  quantity?: number;
}

interface Facet {
  tipo: 'lista' | 'range';
  key: string;
  label: string;
  values?: ValorFacet[];
  min?: number;
  max?: number;
}

const TITULO = 'Tapetes';
const TOTAL = 248;
const SUBSTANTIVO = 'produtos';
const SUBTITULO =
  'Escolha tapetes para sala, quarto, banheiro, cozinha, corredores e entrada com curadoria de materiais, formatos e medidas.';

const TRILHA = [
  { item: '/', name: 'Página inicial' },
  { item: '/decoracao', name: 'Decoração' },
  { name: 'Tapetes' },
];

const SUBCATEGORIAS: ValorFacet[] = [
  { value: 'tapete-para-sala', label: 'Tapete para Sala' },
  { value: 'tapete-para-quarto', label: 'Tapete para Quarto' },
  { value: 'tapete-para-banheiro', label: 'Tapete para Banheiro' },
  { value: 'passadeiras', label: 'Passadeiras' },
  { value: 'capachos', label: 'Capachos' },
  { value: 'tapetes-organicos', label: 'Tapetes Orgânicos' },
];

const FACETS: Facet[] = [
  {
    tipo: 'lista',
    key: 'tamanho',
    label: 'Tamanho',
    values: [
      { value: '1,40m × 2,00m', label: '1,40m × 2,00m' },
      { value: '1,60m × 2,30m', label: '1,60m × 2,30m' },
      { value: '2,00m × 2,50m', label: '2,00m × 2,50m', selected: true },
      { value: '2,40m × 3,00m', label: '2,40m × 3,00m' },
    ],
  },
  {
    tipo: 'lista',
    key: 'superficie',
    label: 'Superfície',
    values: [
      { value: 'Aveludada', label: 'Aveludada', selected: true },
      { value: 'Algodão', label: 'Algodão' },
      { value: 'Lã', label: 'Lã' },
      { value: 'Sisal sintético', label: 'Sisal sintético' },
    ],
  },
  { tipo: 'range', key: 'price', label: 'Preço', min: 99, max: 1999 },
  { tipo: 'lista', key: 'marca', label: 'Marca', values: [] },
  { tipo: 'lista', key: 'antiderrapante', label: 'Antiderrapante', values: [] },
];

const CHIPS_ATIVOS = [
  { key: 'tamanho', value: '2,00m × 2,50m' },
  { key: 'superficie', value: 'Aveludada' },
];

const PRODUTOS: Produto[] = [
  { id: 'p1', title: 'Essence Clássico 2,00m × 2,50m', price: 779.9, flag: 'Destaque', flagVariant: 'gold', parcela: '10× R$ 77,99', pix: 'Pix R$ 740,90', url: '#' },
  { id: 'p2', title: 'Belga Vintage Rosê 2,00m × 2,50m', price: 829.9, flag: 'Lançamento', flagVariant: 'new', parcela: '10× R$ 82,99', pix: 'Pix R$ 788,40', url: '#' },
  { id: 'p3', title: 'Shaggy Alto Nude 2,00m × 2,50m', price: 549.9, parcela: '10× R$ 54,99', pix: 'Pix R$ 522,40', url: '#' },
  { id: 'p4', title: 'Sisal Natural Sala 1,60m × 2,30m', price: 399.9, flag: '−20%', flagVariant: 'sale', parcela: '10× R$ 39,99', pix: 'Pix R$ 379,90', url: '#' },
  { id: 'p5', title: 'Tapete Geométrico Ivory', price: 489.9, parcela: '10× R$ 48,99', url: '#' },
  { id: 'p6', title: 'Persa Vintage Bege Gold', price: 689.9, parcela: '10× R$ 68,99', url: '#' },
  { id: 'p7', title: 'Orgânico Natural Trançado', price: 319.9, parcela: '10× R$ 31,99', url: '#' },
  { id: 'p8', title: 'Pelo Alto Luxo Bege 2,00m', price: 599.9, parcela: '10× R$ 59,99', url: '#' },
];


const ORDENACAO: Record<string, string> = {
  orders_desc: 'Mais vendidos',
  price_asc: 'Menor preço',
  price_desc: 'Maior preço',
  release_desc: 'Lançamentos',
};

const EXPANDIDO_POR_PADRAO = new Set(['Tamanho', 'Superfície', 'Preço']);

const fmt = (n: number) => n.toFixed(2).replace('.', ',');

const flagClass = (v?: string) =>
  v === 'sale' ? styles.flagSale : v === 'new' ? styles.flagNew : styles.flagGold;

/** Espelha o PriceRange07 local da origem: dois `input[type=range]` sobre o track. */
function PriceRange({ min, max }: { min: number; max: number }) {
  const [lo, setLo] = useState(min);
  const [hi, setHi] = useState(max);
  const pctLo = ((lo - min) / (max - min)) * 100;
  const pctHi = ((hi - min) / (max - min)) * 100;
  return (
    <div className={styles.priceRange} data-role="price-range">
      <div className={styles.rangeTrack} data-role="range-track">
        <span
          className={styles.rangeFill}
          style={{ left: `${pctLo}%`, right: `${100 - pctHi}%` }}
        />
        <input
          type="range"
          className={styles.rangeInput}
          min={min}
          max={max}
          value={lo}
          aria-label="Preço mínimo"
          onChange={e => setLo(Math.min(Number(e.target.value), hi))}
        />
        <input
          type="range"
          className={styles.rangeInput}
          min={min}
          max={max}
          value={hi}
          aria-label="Preço máximo"
          onChange={e => setHi(Math.max(Number(e.target.value), lo))}
        />
      </div>
      <div className={styles.rangeLabels} data-role="range-labels">
        <span>R$ {fmt(lo)}</span>
        <span>R$ {fmt(hi)}</span>
      </div>
    </div>
  );
}

export default function CategoryMain() {
  const [colapsado, setColapsado] = useState<ReadonlySet<string>>(() => new Set());
  const [ordem, setOrdem] = useState('orders_desc');
  const [subcatAtiva, setSubcatAtiva] = useState<string | null>(null);
  const [marcados, setMarcados] = useState<ReadonlySet<string>>(
    () =>
      new Set(
        FACETS.flatMap(f =>
          (f.values ?? []).filter(v => v.selected).map(v => `${f.key}:${v.value}`)
        )
      )
  );
  const [chips, setChips] = useState(CHIPS_ATIVOS);
  const [drawerAberto, setDrawerAberto] = useState(false);

  const alternarBloco = (label: string) =>
    setColapsado(prev => {
      const n = new Set(prev);
      if (!n.delete(label)) n.add(label);
      return n;
    });

  const alternarMarcado = (key: string, value: string) =>
    setMarcados(prev => {
      const n = new Set(prev);
      const k = `${key}:${value}`;
      if (!n.delete(k)) n.add(k);
      return n;
    });

  const subcatEstaAtiva = (value: string, i: number) =>
    subcatAtiva ? subcatAtiva === value : i === 0;

  const removerChip = (value: string) =>
    setChips(prev => prev.filter(c => c.value !== value));

  const trilha = (
    prefixo: '' | 'm',
    cls: { nav: string; sep: string; link: string; atual: string }
  ) => (
    <nav className={cls.nav} aria-label="breadcrumb" data-role={prefixo ? 'm-breadcrumb' : 'breadcrumb'}>
      {TRILHA.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={cls.sep}>›</span>}
          {i < TRILHA.length - 1 ? (
            <a href={c.item || '#'} className={cls.link}>
              {c.name}
            </a>
          ) : (
            <span className={cls.atual}>{c.name}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );

  const card = (p: Produto, i: number, pfx: 'd' | 'm') => (
    <a
      key={p.id ?? i}
      href={p.url}
      data-role={pfx === 'd' ? 'card' : 'm-card'}
      className={pfx === 'd' ? styles.card : styles.mCard}
    >
      <div
        className={pfx === 'd' ? styles.cardMedia : styles.mCardMedia}
        data-role={pfx === 'd' ? 'card-media' : 'm-card-media'}
      >
        {p.flag && (
          <span
            className={`${pfx === 'd' ? styles.flag : styles.mFlag} ${flagClass(p.flagVariant)}`}
            data-role={pfx === 'd' ? 'card-flag' : 'm-card-flag'}
          >
            {p.flag}
          </span>
        )}
        <span
          className={pfx === 'd' ? styles.wish : styles.mWish}
          data-role={pfx === 'd' ? 'card-wish' : 'm-card-wish'}
          aria-hidden="true"
        >
          <svg
            width={pfx === 'd' ? 12 : 11}
            height={pfx === 'd' ? 12 : 11}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </span>
      </div>
      <div
        className={pfx === 'd' ? styles.cardBody : styles.mCardBody}
        data-role={pfx === 'd' ? 'card-body' : 'm-card-body'}
      >
        <h3
          data-role={pfx === 'd' ? 'card-title' : 'm-card-title'}
          className={pfx === 'd' ? styles.cardTitle : styles.mCardTitle}
        >
          {p.title}
        </h3>
        <p
          data-role={pfx === 'd' ? 'card-price' : 'm-card-price'}
          className={pfx === 'd' ? styles.cardPrice : styles.mCardPrice}
        >
          R$ {fmt(p.price)}
        </p>
        <p
          className={`${pfx === 'd' ? styles.cardInstallment : styles.mCardInstallment}${
            !p.pix
              ? pfx === 'd'
                ? ' ' + styles.cardInstallmentSolo
                : ' ' + styles.mCardInstallmentSolo
              : ''
          }`}
          data-role={pfx === 'd' ? 'card-installment' : 'm-card-installment'}
        >
          {p.parcela}
        </p>
        {p.pix && (
          <p
            className={pfx === 'd' ? styles.cardPix : styles.mCardPix}
            data-role={pfx === 'd' ? 'card-pix' : 'm-card-pix'}
          >
            {p.pix}
          </p>
        )}
        <span
          data-role={pfx === 'd' ? 'card-cta' : 'm-card-cta'}
          className={pfx === 'd' ? styles.cardCta : styles.mCardCta}
        >
          Comprar
        </span>
      </div>
    </a>
  );

  return (
    /* wrapper só do catálogo: carrega o container-type para as @container */
    <div className={styles.plpRootWrap}>
      <div className={styles.plpRoot}>
        {/* ═══ DESKTOP ═══ */}
        <div className={styles.desktop} data-role="root">
          <div className={styles.headerBlock} data-role="header-block">
            {trilha('', {
              nav: styles.breadcrumb,
              sep: styles.crumbSep,
              link: styles.crumbLink,
              atual: styles.crumbCurrent,
            })}
            <h1 className={styles.title} data-role="title">
              {TITULO}
            </h1>
            <p className={styles.subtitle} data-role="subtitle">
              {SUBTITULO}
            </p>
            <div className={styles.chips} data-role="chips">
              {SUBCATEGORIAS.map((s, i) => (
                <button
                  key={s.value}
                  data-role="chip"
                  className={`${styles.chip} ${subcatEstaAtiva(s.value, i) ? styles.chipActive : ''}`}
                  aria-pressed={subcatEstaAtiva(s.value, i)}
                  onClick={() => setSubcatAtiva(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.main} data-role="main">
            <aside className={styles.sidebar} data-role="sidebar">
              <div className={styles.sidebarHead} data-role="sidebar-head">
                <p className={styles.sidebarTitle} data-role="sidebar-title">
                  Filtros
                </p>
                <button
                  className={styles.clearAll}
                  data-role="clear-all"
                  onClick={() => {
                    setMarcados(new Set());
                    setChips([]);
                  }}
                >
                  Limpar tudo
                </button>
              </div>
              {FACETS.map(facet => {
                const expandido = EXPANDIDO_POR_PADRAO.has(facet.label)
                  ? !colapsado.has(facet.label)
                  : colapsado.has(facet.label);
                return (
                  <div className={styles.filterBlock} key={facet.key} data-role="filter-block">
                    <button
                      className={styles.filterHead}
                      data-role="filter-head"
                      onClick={() => alternarBloco(facet.label)}
                    >
                      <span className={styles.filterName} data-role="filter-name">
                        {facet.label}
                      </span>
                      <svg
                        aria-hidden="true"
                        className={`${styles.filterChevron} ${expandido ? styles.chevOpen : ''}`}
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {expandido && facet.tipo === 'range' && (
                      <PriceRange min={facet.min ?? 0} max={facet.max ?? 100} />
                    )}
                    {expandido && facet.tipo === 'lista' && (
                      <ul className={styles.filterList} data-role="filter-list">
                        {(facet.values ?? []).map(v => (
                          <li className={styles.filterItem} key={v.value} data-role="filter-item">
                            <label className={styles.filterLabel}>
                              <input
                                type="checkbox"
                                className={styles.filterCheck}
                                checked={marcados.has(`${facet.key}:${v.value}`)}
                                onChange={() => alternarMarcado(facet.key, v.value)}
                              />
                              <span className={styles.filterText}>{v.label}</span>
                              {typeof v.quantity === 'number' && (
                                <span className={styles.filterQty}>({v.quantity})</span>
                              )}
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </aside>

            <div className={styles.gridArea} data-role="grid-area">
              <div className={styles.sortbar} data-role="sortbar">
                <div className={styles.sortLeft}>
                  <span className={styles.resultsCount} data-role="results-count">
                    {TOTAL} {SUBSTANTIVO} encontrados
                  </span>
                  <div className={styles.activeChips} data-role="active-chips">
                    {chips.map((c, i) => (
                      <span
                        key={`${c.key}-${c.value}-${i}`}
                        className={styles.activeChip}
                        data-role="active-chip"
                      >
                        {c.value}
                        <button
                          className={styles.chipX}
                          aria-label={`Remover ${c.value}`}
                          onClick={() => removerChip(c.value)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.sortRight}>
                  <span className={styles.sortLabel}>Ordenar por</span>
                  <select
                    className={styles.sortSelect}
                    value={ordem}
                    onChange={e => setOrdem(e.target.value)}
                    data-role="sort-select"
                    aria-label="Ordenar por"
                  >
                    {Object.entries(ORDENACAO).map(([k, l]) => (
                      <option key={k} value={k}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.grid} data-role="grid">
                {PRODUTOS.map((p, i) => card(p, i, 'd'))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══ MOBILE ═══ */}
        <div className={styles.mobile} data-role="m-root">
          <div className={styles.mHeaderBlock} data-role="m-header-block">
            {trilha('m', {
              nav: styles.mBreadcrumb,
              sep: styles.mCrumbSep,
              link: styles.mCrumbLink,
              atual: styles.mCrumbCurrent,
            })}
            <p className={styles.mTitle} data-role="m-title" role="heading" aria-level={1}>
              {TITULO}
            </p>
          </div>

          <div className={styles.mSubcats} data-role="m-subcats">
            <div className={styles.mSubcatsRow}>
              {SUBCATEGORIAS.map((s, i) => (
                <button
                  key={s.value}
                  data-role="m-subcat"
                  className={`${styles.mSubcat} ${subcatEstaAtiva(s.value, i) ? styles.mSubcatActive : ''}`}
                  aria-pressed={subcatEstaAtiva(s.value, i)}
                  onClick={() => setSubcatAtiva(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.mFilterbar} data-role="m-filterbar">
            <button
              className={styles.mFilterBtn}
              data-role="m-filter-btn"
              onClick={() => setDrawerAberto(true)}
              aria-haspopup="dialog"
              aria-expanded={drawerAberto}
            >
              <svg
                aria-hidden="true"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filtrar{chips.length ? ` (${chips.length})` : ''}
            </button>
            {chips.map((c, i) => (
              <span
                key={`${c.key}-${c.value}-${i}`}
                className={styles.mActiveChip}
                data-role="m-active-chip"
              >
                {c.value}
                <button
                  className={styles.mChipX}
                  aria-label={`Remover ${c.value}`}
                  onClick={() => removerChip(c.value)}
                >
                  ×
                </button>
              </span>
            ))}
            <div className={styles.mSortWrap}>
              <select
                className={styles.mSortSelect}
                value={ordem}
                onChange={e => setOrdem(e.target.value)}
                data-role="m-sort-select"
                aria-label="Ordenar"
              >
                {Object.entries(ORDENACAO).map(([k, l]) => (
                  <option key={k} value={k}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.mGrid} data-role="m-grid">
            {PRODUTOS.map((p, i) => card(p, i, 'm'))}
          </div>

          {drawerAberto && (
            <div className={styles.mDrawerOverlay} onClick={() => setDrawerAberto(false)}>
              <div
                className={styles.mDrawer}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Filtros"
                tabIndex={-1}
              >
                <div className={styles.mDrawerHandle} />
                <div className={styles.mDrawerHead}>
                  <p className={styles.mDrawerTitle}>Filtros</p>
                  <button
                    className={styles.mClearAll}
                    onClick={() => {
                      setMarcados(new Set());
                      setChips([]);
                    }}
                  >
                    Limpar tudo
                  </button>
                </div>
                {FACETS.filter(f => f.tipo !== 'range').map(facet => (
                  <div className={styles.mDrawerBlock} key={facet.key}>
                    <p className={styles.mDrawerLabel}>{facet.label}</p>
                    <div className={styles.mChipRow}>
                      {(facet.values ?? []).map(v => (
                        <button
                          key={v.value}
                          className={`${styles.mDrawerChip} ${marcados.has(`${facet.key}:${v.value}`) ? styles.mDrawerChipActive : ''}`}
                          onClick={() => alternarMarcado(facet.key, v.value)}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {(() => {
                  const range = FACETS.find(f => f.tipo === 'range');
                  return range ? (
                    <div className={styles.mDrawerBlock}>
                      <p className={styles.mDrawerLabel}>{range.label}</p>
                      <PriceRange min={range.min ?? 0} max={range.max ?? 100} />
                    </div>
                  ) : null;
                })()}
                <button
                  className={styles.mDrawerApply}
                  onClick={() => setDrawerAberto(false)}
                >
                  Ver {TOTAL} resultados
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

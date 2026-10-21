'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

import styles from './index.module.css';
import {
  FONTES_09,
  ProductCard09,
  type Produto09,
} from '@/components/templates/common/template_9/Spot';

/**
 * Espelha `organisms/MainCategory09` do faststore.starter (família 09, Editorial;
 * desenhos `CategoryMain09`, `CategoryMain09-mobile-filtros` e `SearchEmpty09`).
 * Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * O que sai em relação à origem:
 *  • `usePLP`/`useSearchPage`/`useProductsQuery`/`useSearch` → as constantes abaixo,
 *    que são os dados de exemplo do `mock.ts` de lá (produtos, facetas, seleção do
 *    desenho, contagem e ordenação); faceta e ordenação mudam num `useState` local;
 *  • "Carregar mais" não busca página nova (lá também não, nos dados de exemplo);
 *  • analytics e sessão (useViewItemList, useAuth) → preview não emite evento.
 *
 * O estado vazio da busca (desenho `SearchEmpty09`) mora AQUI, como lá: renderiza
 * quando a lista de produtos sai vazia. Lá isso só acontece numa busca sem resultado
 * (ou no palco, pela prop `stageEmptyTerm`); aqui `TERMO_VAZIO` faz o papel da prop
 * do palco — vazio, o canvas mostra a grade.
 */

interface FacetValue {
  value: string;
  label: string;
  quantity?: number;
}

type FacetKind = 'list' | 'size' | 'color' | 'price';

interface Facet {
  key: string;
  label: string;
  kind: FacetKind;
  values: FacetValue[];
  min: number;
  max: number;
}

interface Selected {
  key: string;
  value: string;
}

/* ── rótulos (o mock.ts de lá) ── */
const COUNT_LABEL = 'produtos';
const FILTER_LABEL = 'Filtrar';
const SORT_LABEL = 'Ordenar';
const SORT_PREFIX = 'Ordenar:';
const CLEAR_LABEL = 'Limpar';
const CLEAR_ALL_LABEL = 'Limpar tudo';
const APPLY_LABEL = 'Aplicar';
const RESULTS_LABEL = 'Ver {total} resultados';
const PROGRESS_LABEL = 'Você viu {shown} de {total} produtos';
const LOAD_MORE_LABEL = 'Carregar mais';
const EMPTY_EYEBROW = 'Busca';
const EMPTY_TITLE = 'Nenhum resultado para';
const EMPTY_TEXT =
  'Confira a grafia das palavras ou tente um termo mais geral, como “vestido verde”.';
const EMPTY_PRIMARY_LABEL = 'Voltar para a página inicial';
const EMPTY_PRIMARY_URL = '/';
const EMPTY_SECONDARY_LABEL = 'Ver novidades';
const EMPTY_SECONDARY_URL = '/';

/**
 * Só no catálogo — o papel da prop `stageEmptyTerm` do palco de lá: com um termo, a
 * seção simula a busca sem resultado (lista vazia → estado vazio). Vazio = a grade.
 */
const TERMO_VAZIO = '';

/* ── dados de exemplo (o mock.ts de lá) ── */
const produto = (
  id: string,
  name: string,
  price: number,
  listPrice: number,
  installmentValue: number
): Produto09 => ({
  id,
  name,
  price,
  listPrice,
  installments: 6,
  installmentValue,
  inStock: true,
});

const PRODUTOS: Produto09[] = [
  produto('vestido-midi-linho-areia', 'Vestido Midi Linho Areia', 489, 489, 81.5),
  produto('vestido-chemise-linho-oliva', 'Vestido Chemise Linho Oliva', 459, 459, 76.5),
  produto('vestido-longo-alcas-linho-cru', 'Vestido Longo Alças Linho Cru', 529, 529, 88.17),
  produto('vestido-envelope-linho-terracota', 'Vestido Envelope Linho Terracota', 429, 499, 71.5),
  produto('vestido-midi-linho-preto', 'Vestido Midi Linho Preto', 489, 489, 81.5),
  produto('vestido-curto-linho-listrado', 'Vestido Curto Linho Listrado', 389, 389, 64.83),
  produto('vestido-tubinho-linho-areia', 'Vestido Tubinho Linho Areia', 399, 399, 66.5),
  produto('vestido-camisa-linho-branco', 'Vestido Camisa Linho Branco', 449, 449, 74.83),
  produto('vestido-midi-linho-caramelo', 'Vestido Midi Linho Caramelo', 489, 489, 81.5),
  produto('vestido-longo-linho-mescla', 'Vestido Longo Linho Mescla', 549, 549, 91.5),
  produto('vestido-midi-linho-oliva', 'Vestido Midi Linho Oliva', 489, 489, 81.5),
  produto('vestido-curto-linho-cru', 'Vestido Curto Linho Cru', 359, 359, 59.83),
];

const lista = (pares: Array<[string, number?]>): FacetValue[] =>
  pares.map(([label, quantity]) => ({ value: label.toLowerCase(), label, quantity }));

/** O que o `pickFacets` de lá devolve para as facetas de exemplo, já na ordem dele. */
const FACETS: Facet[] = [
  {
    key: 'tamanho',
    label: 'Tamanho',
    kind: 'size',
    values: lista([['PP'], ['P'], ['M'], ['G'], ['GG'], ['36'], ['38'], ['40'], ['42'], ['44']]),
    min: 0,
    max: 0,
  },
  {
    key: 'cor',
    label: 'Cor',
    kind: 'color',
    values: lista([['Areia', 18], ['Preto', 24], ['Oliva', 9]]),
    min: 0,
    max: 0,
  },
  { key: 'price', label: 'Preço', kind: 'price', values: [], min: 0, max: 2000 },
  {
    key: 'tecido',
    label: 'Tecido',
    kind: 'list',
    values: lista([['Linho', 32], ['Algodão', 41], ['Viscose', 27]]),
    min: 0,
    max: 0,
  },
];

/** Seleção do desenho: M e 38, Linho e até R$ 500. */
const SELECTED_INICIAL: Selected[] = [
  { key: 'tamanho', value: 'm' },
  { key: 'tamanho', value: '38' },
  { key: 'tecido', value: 'linho' },
  { key: 'price', value: '0-to-500' },
];

const TOTAL = 128;
const SORT_INICIAL = 'orders_desc';

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

const fill = (tpl: string, vars: Record<string, number | string>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

/* ── utilitários de faceta (o facets.ts de lá) ── */
const moeda = (n: number) => `R$ ${Math.round(n).toLocaleString('pt-BR')}`;
const rangeValue = (lo: number, hi: number) => `${lo}-to-${hi}`;

function priceLabel(value: string, f?: Facet) {
  const [a, b] = value.split('-to-').map(Number);
  if (!isFinite(a) || !isFinite(b)) return value;
  if (a <= (f?.min ?? 0)) return `Até ${moeda(b)}`;
  if (f && b >= f.max) return `Acima de ${moeda(a)}`;
  return `${moeda(a)} a ${moeda(b)}`;
}

function priceBuckets(f: Facet): FacetValue[] {
  const { min, max } = f;
  if (!(max > min)) return [];
  const r = (n: number) => Math.max(50, Math.round(n / 50) * 50);
  const cuts = [r(max / 4), r(max / 2)].filter(
    (n, i, a) => n > min && n < max && a.indexOf(n) === i
  );
  const edges = [min, ...cuts, max];
  return edges.slice(0, -1).map((lo, i) => {
    const v = rangeValue(lo, edges[i + 1]);
    return { value: v, label: priceLabel(v, f) };
  });
}

function selectedLabel(s: Selected, facets: Facet[]) {
  const f = facets.find(x => x.key === s.key);
  if (f?.kind === 'price' || s.value.includes('-to-')) return priceLabel(s.value, f);
  return f?.values.find(v => v.value === s.value)?.label ?? s.value;
}

function sizeGroups(values: FacetValue[]) {
  const num = (v: FacetValue) => /^\d+([.,]\d+)?$/.test(v.label.trim());
  return { letras: values.filter(v => !num(v)), numeros: values.filter(num) };
}

/* ── ícones (decorativos; seguem o texto via currentColor) ── */
const Chevron = ({ up = false }: { up?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d={up ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
  </svg>
);
const Close = ({ size = 12, w = 1.6 }: { size?: number; w?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
const Sliders = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" />
    <circle cx="16" cy="6" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="18" cy="18" r="2" />
  </svg>
);
const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/** Opções de uma faceta (painel desktop e acordeão mobile usam as mesmas). */
function FacetOptions09({
  facet,
  isOn,
  onToggle,
  groupLabels,
  idBase,
}: {
  facet: Facet;
  isOn: (value: string) => boolean;
  onToggle: (value: string) => void;
  groupLabels: boolean;
  idBase: string;
}) {
  if (facet.kind === 'size') {
    const { letras, numeros } = sizeGroups(facet.values);
    const grupos = [
      { nome: 'Letras', itens: letras },
      { nome: 'Números', itens: numeros },
    ].filter(g => g.itens.length);
    return (
      <div className={styles.sizeGroups}>
        {grupos.map(g => (
          <div key={g.nome} className={styles.sizeGroup} role="group" aria-label={`${facet.label}: ${g.nome}`}>
            {groupLabels && grupos.length > 1 && <span className={styles.groupLabel}>{g.nome}</span>}
            <div className={styles.sizeGrid}>
              {g.itens.map(v => (
                <button
                  key={v.value}
                  type="button"
                  className={styles.sizeBtn}
                  aria-pressed={isOn(v.value)}
                  onClick={() => onToggle(v.value)}
                  data-role="facet-size"
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
  const itens = facet.kind === 'price' ? priceBuckets(facet) : facet.values;
  return (
    <div className={styles.checkList}>
      {itens.map((v, i) => {
        const id = `${idBase}-${i}`;
        return (
          <label key={v.value} className={styles.check} htmlFor={id}>
            <input id={id} type="checkbox" checked={isOn(v.value)} onChange={() => onToggle(v.value)} />
            {v.label}
            {typeof v.quantity === 'number' && <span className={styles.checkQty}>({v.quantity})</span>}
          </label>
        );
      })}
    </div>
  );
}

export default function CategoryMain09() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const facets = FACETS;

  const term = TERMO_VAZIO;
  const stageEmpty = !!term;
  const [mockSelected, setMockSelected] = useState<Selected[]>(SELECTED_INICIAL);
  const [sort, setSort] = useState(SORT_INICIAL);
  const userFacets: Selected[] = stageEmpty ? [] : mockSelected;
  const products: Produto09[] = stageEmpty ? [] : PRODUTOS;
  const totalCount = stageEmpty ? 0 : TOTAL;

  const commit = (nextUser: Selected[]) => setMockSelected(nextUser);
  const facetOf = (key: string) => facets.find(f => f.key === key);
  /** Liga/desliga um valor; faixa de preço é única por faceta. */
  const toggleIn = (list: Selected[], key: string, value: string) => {
    const on = list.some(f => f.key === key && f.value === value);
    if (facetOf(key)?.kind === 'price') {
      const rest = list.filter(f => f.key !== key);
      return on ? rest : [...rest, { key, value }];
    }
    return on
      ? list.filter(f => !(f.key === key && f.value === value))
      : [...list, { key, value }];
  };
  const isSelected = (key: string, value: string) =>
    userFacets.some(f => f.key === key && f.value === value);
  const countOf = (key: string) => userFacets.filter(f => f.key === key).length;

  /* ── painel da faceta (desktop): rascunho até "Aplicar" ── */
  const barRef = useRef<HTMLDivElement>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [popLeft, setPopLeft] = useState(0);
  const [draft, setDraft] = useState<Selected[]>([]);
  const [sortOpen, setSortOpen] = useState(false);

  const onSort = (value: string) => {
    setSortOpen(false);
    setSort(value);
  };
  const openFacet = (key: string, btn: HTMLElement) => {
    setSortOpen(false);
    if (openKey === key) return setOpenKey(null);
    const wrap = barRef.current;
    const left = wrap ? btn.getBoundingClientRect().left - wrap.getBoundingClientRect().left : 0;
    setPopLeft(Math.max(0, Math.min(left, (wrap?.clientWidth ?? 380) - 380)));
    setDraft(userFacets.filter(f => f.key === key));
    setOpenKey(key);
  };
  const applyDraft = () => {
    if (!openKey) return;
    commit([...userFacets.filter(f => f.key !== openKey), ...draft]);
    setOpenKey(null);
  };
  const clearFacet = () => {
    if (!openKey) return;
    commit(userFacets.filter(f => f.key !== openKey));
    setOpenKey(null);
  };
  useEffect(() => {
    if (!openKey && !sortOpen) return;
    const doc = barRef.current?.ownerDocument ?? document;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenKey(null);
        setSortOpen(false);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenKey(null);
        setSortOpen(false);
      }
    };
    doc.addEventListener('keydown', onKey);
    doc.addEventListener('mousedown', onDown);
    return () => {
      doc.removeEventListener('keydown', onKey);
      doc.removeEventListener('mousedown', onDown);
    };
  }, [openKey, sortOpen]);

  /* ── painel mobile (tela cheia): aplica na hora ── */
  const [panelOpen, setPanelOpen] = useState(false);
  const [acc, setAcc] = useState<Record<string, boolean>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const openPanel = () => {
    const inicial: Record<string, boolean> = {};
    facets.slice(0, 2).forEach(f => (inicial[f.key] = true));
    setAcc(inicial);
    setSortOpen(false);
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPanelOpen(false);
        filterBtnRef.current?.focus();
      }
    };
    doc.addEventListener('keydown', onKey);
    return () => {
      doc.body.style.overflow = prev;
      doc.removeEventListener('keydown', onKey);
    };
  }, [panelOpen]);

  const shown = products.length;
  const hasMore = shown > 0 && shown < totalCount;
  const isEmpty = products.length === 0;
  const sortName = SORT_OPTIONS.find(([k]) => k === sort)?.[1] ?? 'Relevância';
  const userCount = userFacets.length;
  const openFacetObj = openKey ? facetOf(openKey) : undefined;
  const temBarra = !isEmpty || userCount > 0;

  const sortMenu = sortOpen && (
    <div className={styles.sortMenu} role="listbox" aria-label={SORT_LABEL} data-role="sort-menu">
      {SORT_OPTIONS.map(([value, label]) => (
        <button
          key={value}
          type="button"
          role="option"
          aria-selected={value === sort}
          className={styles.sortOption}
          onClick={() => onSort(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <div className={styles.mainCategory09Box}>
      <link rel="stylesheet" href={FONTES_09} />
      <div className={styles.mainCategory09} data-role="cm-root">
        <div className={`${styles.inner}${temBarra ? '' : ` ${styles.innerEmpty}`}`}>
          {temBarra && (
            <div className={styles.barWrap} ref={barRef}>
              {/* desktop: facetas + contagem + ordenação */}
              <div className={styles.bar} data-role="cm-bar">
                <div className={styles.facetBtns}>
                  {facets.map(f => {
                    const on = openKey === f.key;
                    const n = countOf(f.key);
                    return (
                      <button
                        key={f.key}
                        type="button"
                        className={`${styles.facetBtn}${on ? ` ${styles.facetBtnOpen}` : ''}`}
                        aria-expanded={on}
                        aria-controls={on ? `${uid}-pop` : undefined}
                        onClick={e => openFacet(f.key, e.currentTarget)}
                        data-role="facet-btn"
                      >
                        {f.label}
                        {n > 0 && <span className={styles.accentQty}>({n})</span>}
                        <Chevron up={on} />
                      </button>
                    );
                  })}
                </div>
                <div className={styles.barEnd}>
                  <span className={styles.count} data-role="cm-count">
                    {totalCount} {COUNT_LABEL}
                  </span>
                  <button
                    type="button"
                    className={styles.sortBtn}
                    aria-haspopup="listbox"
                    aria-expanded={sortOpen}
                    onClick={() => {
                      setOpenKey(null);
                      setSortOpen(v => !v);
                    }}
                    data-role="sort-btn"
                  >
                    <span className={styles.muted}>{SORT_PREFIX}</span> {sortName}
                    <Chevron up={sortOpen} />
                  </button>
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
                  {FILTER_LABEL}
                  {userCount > 0 && <span className={styles.accent}>({userCount})</span>}
                </button>
                <button
                  type="button"
                  className={styles.mBtn}
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                  onClick={() => setSortOpen(v => !v)}
                  data-role="m-sort-btn"
                >
                  {SORT_LABEL}
                  <Chevron up={sortOpen} />
                </button>
              </div>

              {sortMenu}

              {openFacetObj && (
                <section
                  id={`${uid}-pop`}
                  className={styles.popover}
                  style={{ left: popLeft }}
                  aria-label={`Filtro de ${openFacetObj.label.toLocaleLowerCase('pt-BR')}`}
                  data-role="facet-pop"
                >
                  <FacetOptions09
                    facet={openFacetObj}
                    idBase={`${uid}-d`}
                    groupLabels
                    isOn={v => draft.some(f => f.value === v)}
                    onToggle={v => setDraft(d => toggleIn(d, openFacetObj.key, v))}
                  />
                  <div className={styles.popFoot}>
                    <button type="button" className={styles.linkBtn} onClick={clearFacet}>
                      {CLEAR_LABEL}
                    </button>
                    <button type="button" className={styles.applyBtn} onClick={applyDraft} data-role="facet-apply">
                      {APPLY_LABEL}
                      {draft.length > 0 ? ` (${draft.length})` : ''}
                    </button>
                  </div>
                </section>
              )}
            </div>
          )}

          {userCount > 0 && (
            <div className={styles.active} data-role="cm-active">
              {userFacets.map(f => {
                const label = selectedLabel(f, facets);
                return (
                  <button
                    key={`${f.key}:${f.value}`}
                    type="button"
                    className={styles.activeChip}
                    aria-label={`Remover filtro ${label}`}
                    onClick={() => commit(userFacets.filter(x => !(x.key === f.key && x.value === f.value)))}
                    data-role="cm-active-chip"
                  >
                    {label} <Close />
                  </button>
                );
              })}
              <button type="button" className={`${styles.linkBtn} ${styles.clearAll}`} onClick={() => commit([])}>
                {CLEAR_ALL_LABEL}
              </button>
            </div>
          )}

          {temBarra && !isEmpty && (
            <span className={styles.mCount} data-role="cm-mcount">
              {totalCount} {COUNT_LABEL}
            </span>
          )}

          {isEmpty ? (
            <section className={styles.empty} aria-label="Busca sem resultado" data-role="cm-empty">
              {EMPTY_EYEBROW && <span className={styles.emptyEyebrow}>{EMPTY_EYEBROW}</span>}
              {React.createElement(
                term ? 'h1' : 'h2',
                { className: styles.emptyTitle, 'data-role': 'cm-empty-title' },
                EMPTY_TITLE,
                term && (
                  <>
                    {' '}
                    <em>“{term}”</em>
                  </>
                )
              )}
              {EMPTY_TEXT && <p className={styles.emptyText}>{EMPTY_TEXT}</p>}
              <div className={styles.emptyActions}>
                <a className={styles.emptyPrimary} href={EMPTY_PRIMARY_URL} data-role="cm-empty-primary">
                  {EMPTY_PRIMARY_LABEL}
                </a>
                <a className={styles.emptySecondary} href={EMPTY_SECONDARY_URL} data-role="cm-empty-secondary">
                  <span>{EMPTY_SECONDARY_LABEL}</span>
                  <Arrow />
                </a>
              </div>
            </section>
          ) : (
            <ul className={styles.grid} data-role="cm-grid">
              {products.map((p, i) => (
                <li key={p.id ?? i} className={styles.gridItem}>
                  <ProductCard09 product={p} />
                </li>
              ))}
            </ul>
          )}

          {!isEmpty && totalCount > 0 && (
            <div className={styles.more} data-role="cm-more">
              <span className={styles.progressText}>
                {fill(PROGRESS_LABEL, { shown, total: totalCount })}
              </span>
              <span className={styles.progress} aria-hidden="true">
                <span style={{ width: `${Math.min(100, (shown / totalCount) * 100)}%` }} />
              </span>
              {hasMore && (
                <button type="button" className={styles.moreBtn} data-role="cm-load-more">
                  {LOAD_MORE_LABEL}
                </button>
              )}
            </div>
          )}
        </div>

        {panelOpen && (
          <section
            className={styles.panel}
            role="dialog"
            aria-modal="true"
            aria-label={FILTER_LABEL}
            data-role="m-filter-panel"
          >
            <div className={styles.panelHead}>
              <h2 className={styles.panelTitle}>{FILTER_LABEL}</h2>
              <button
                ref={closeRef}
                type="button"
                className={styles.iconBtn}
                aria-label="Fechar filtros"
                onClick={closePanel}
              >
                <Close size={22} w={1.4} />
              </button>
            </div>
            <div className={styles.panelBody}>
              {facets.map(f => {
                const on = !!acc[f.key];
                const n = countOf(f.key);
                return (
                  <div key={f.key} className={styles.accItem}>
                    <button
                      type="button"
                      className={styles.accBtn}
                      aria-expanded={on}
                      aria-controls={`${uid}-acc-${f.key}`}
                      onClick={() => setAcc(a => ({ ...a, [f.key]: !on }))}
                    >
                      {f.label}
                      <span className={styles.accEnd}>
                        {n > 0 && <span className={styles.accentQty}>({n})</span>}
                        <Chevron up={on} />
                      </span>
                    </button>
                    {on && (
                      <div id={`${uid}-acc-${f.key}`} className={styles.accBody}>
                        <FacetOptions09
                          facet={f}
                          idBase={`${uid}-m-${f.key}`}
                          groupLabels={false}
                          isOn={v => isSelected(f.key, v)}
                          onToggle={v => commit(toggleIn(userFacets, f.key, v))}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className={styles.panelFoot}>
              <button type="button" className={styles.panelClear} onClick={() => commit([])}>
                {CLEAR_LABEL}
              </button>
              <button type="button" className={styles.panelApply} onClick={closePanel} data-role="m-filter-results">
                {fill(RESULTS_LABEL, { total: totalCount })}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_15, ProductCard15, produto15, type Produto15 } from '@/components/templates/common/template_15/Spot';
import {
  type Facet15,
  type FacetValue15,
  type RawFacet15,
  type Selected15,
  pickFacets,
  priceBuckets,
  priceLabel,
} from './facets';

/**
 * Espelha `organisms/MainCategory15` do faststore.starter (família 15, Luxo; desenhos
 * `CategoryMain15`, `CategoryMain15-mobile-filtros` e `SearchEmpty15`). Mesmo markup, classes
 * e `data-role`; o CSS é derivado do SCSS de lá e as facetas passam pelo mesmo `facets.ts`
 * (cópia).
 *
 * Desvio aprovado da 15, igual a lá: sem coluna lateral. A barra "Filtrar por" tem um botão
 * por faceta que abre o painel dela logo abaixo (o desenho mostra o do aro aberto), e a grade
 * larga tem 3 cards por linha.
 *
 * O que sai em relação à origem:
 *  • `usePLP`/`useSearchPage`/`useProductsQuery`/`useSearch` → as constantes abaixo, que são
 *    os dados de exemplo do `mock.ts` de lá (9 produtos, facetas, seleção do desenho, painel do
 *    aro aberto, contagem e ordenação); faceta e ordenação mudam num `useState` local — o mesmo
 *    que lá acontece fora de uma PLP real. "Carregar mais", como lá no palco, não carrega nada
 *    (sem `GridPage15`);
 *  • `toggleFacet` do @faststore/sdk → a função local equivalente;
 *  • analytics e sessão (useViewItemList, useAuth) → preview não emite evento.
 *
 * O painel de filtros do mobile (desenho `-mobile-filtros`) abre pelo botão "Filtrar".
 *
 * O estado vazio da busca (desenho `SearchEmpty15`) mora AQUI, como lá: renderiza quando a
 * lista de produtos sai vazia. Lá isso só acontece numa busca sem resultado (ou no palco, pela
 * prop `stageEmptyTerm`); aqui `TERMO_VAZIO` faz o papel da prop do palco — vazio, o canvas
 * mostra a grade.
 */

/* ── rótulos (o mock.ts de lá) ── */
const L = {
  pageSize: 9,
  specFacetKey: 'material',
  countLabel: 'peças',
  filterByLabel: 'Filtrar por',
  filterLabel: 'Filtrar',
  sortLabel: 'Ordenar',
  clearLabel: 'Limpar',
  clearAllLabel: 'Limpar tudo',
  resultsLabel: 'Ver {total} peças',
  sizeTitle: 'Tamanho do aro',
  sizeGuideLabel: 'Como medir o seu aro',
  sizeGuideUrl: '#',
  progressLabel: 'Exibindo {shown} de {total} peças',
  loadMoreLabel: 'Carregar mais',
  emptyEyebrow: '0 resultados',
  emptyTitle: 'Nenhum resultado para',
  emptyText:
    'Confira a grafia ou tente um termo mais amplo, como “bracelete” ou “esmeralda”. Nossa equipe também pode ajudar a encontrar a peça.',
  emptyPrimaryLabel: 'Voltar para o início',
  emptyPrimaryUrl: '#',
  emptySecondaryLabel: 'Ver novidades',
  emptySecondaryUrl: '#',
};

/** O papel do `stageEmptyTerm` do palco: com um termo, a réplica mostra o estado vazio. */
const TERMO_VAZIO = '';

/* ── dados de exemplo (o mock.ts de lá) ── */
const p15 = (id: string, name: string, price: number, listPrice: number) =>
  produto15(id, name, price, listPrice, 10, price / 10);

const PRODUTOS: Produto15[] = [
  p15('anel-solitario-ouro-18k', 'Anel Solitário Ouro 18k', 6890, 6890),
  p15('alianca-lisa-ouro-18k-4mm', 'Aliança Lisa Ouro 18k 4 mm', 3290, 3290),
  p15('anel-aparador-diamantes', 'Anel Aparador Diamantes', 4150, 4890),
  p15('anel-coquetel-turmalina', 'Anel Coquetel Turmalina', 9800, 9800),
  p15('anel-meia-alianca-ouro-branco', 'Anel Meia Aliança Ouro Branco', 5400, 5400),
  p15('anel-perola-barroca', 'Anel Pérola Barroca', 1890, 1890),
  p15('anel-chevalier-ouro-18k', 'Anel Chevalier Ouro 18k', 7200, 7200),
  p15('anel-trio-riviera-prata-925', 'Anel Trio Riviera Prata 925', 890, 1090),
  p15('anel-solitario-ouro-rose', 'Anel Solitário Ouro Rosé', 6490, 6490),
];

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-');

const lista = (pares: Array<[string, number?]>) => pares.map(([label, quantity]) => ({ value: slug(label), label, quantity }));

const FACETAS: RawFacet15[] = [
  {
    __typename: 'StoreFacetBoolean',
    key: 'category-1',
    label: 'Categoria',
    values: lista([
      ['Solitários', 32],
      ['Alianças', 41],
      ['Aparadores', 18],
      ['Anéis de coquetel', 27],
    ]),
  },
  { __typename: 'StoreFacetBoolean', key: 'brand', label: 'Marca', values: lista([['Sua Marca Joias', 148]]) },
  {
    __typename: 'StoreFacetBoolean',
    key: 'tamanho',
    label: 'Aro',
    values: lista([['10'], ['11'], ['12'], ['13'], ['14'], ['15'], ['16'], ['17'], ['18'], ['20']]),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'cor',
    label: 'Cor do metal',
    values: lista([
      ['Ouro amarelo', 64],
      ['Ouro branco', 30],
      ['Ouro rosé', 22],
      ['Prata', 32],
    ]),
  },
  { __typename: 'StoreFacetRange', key: 'price', label: 'Preço', min: { absolute: 0 }, max: { absolute: 12000 } },
  {
    __typename: 'StoreFacetBoolean',
    key: 'material',
    label: 'Material',
    values: lista([
      ['Ouro 18k', 96],
      ['Prata 925', 32],
      ['Platina', 20],
    ]),
  },
];

/** Seleção do desenho: aro 14 e ouro 18k. */
const SELECIONADAS: Selected15[] = [
  { key: 'tamanho', value: '14' },
  { key: 'material', value: 'ouro-18k' },
];
/** O desenho mostra o painel do aro aberto. */
const ABERTO = 'tamanho';
const TOTAL = 148;
const ORDEM = 'score_desc';

/** Rótulos do enum `StoreSort` da busca. */
const SORT_OPTIONS: Array<[string, string]> = [
  ['score_desc', 'Mais relevantes'],
  ['orders_desc', 'Mais vendidos'],
  ['release_desc', 'Lançamentos'],
  ['price_asc', 'Menor preço'],
  ['price_desc', 'Maior preço'],
  ['discount_desc', 'Maior desconto'],
  ['name_asc', 'Nome, A a Z'],
  ['name_desc', 'Nome, Z a A'],
];

const fill = (tpl: string, vars: Record<string, number | string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

/** O `toggleFacet` do @faststore/sdk: liga/desliga o par chave+valor. */
const toggleFacet = (list: Selected15[], f: Selected15) =>
  list.some(x => x.key === f.key && x.value === f.value)
    ? list.filter(x => !(x.key === f.key && x.value === f.value))
    : [...list, f];

/* ── ícones (decorativos; seguem o texto via currentColor) ── */
const Chevron = ({ up = false }: { up?: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d={up ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
  </svg>
);
const Close = ({ size = 12, w = 1.6 }: { size?: number; w?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
const Sliders = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </svg>
);
const Ruler = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M3 9h18v6H3zM7 9v3M11 9v3M15 9v3M19 9v3" />
  </svg>
);
const PlusMinus = ({ open }: { open: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d={open ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
  </svg>
);

/** Opções de uma faceta (painel do desktop e acordeão do mobile usam as mesmas). */
function FacetOptions15({
  facet,
  isOn,
  onToggle,
}: {
  facet: Facet15;
  isOn: (value: string) => boolean;
  onToggle: (value: string) => void;
}) {
  if (facet.kind === 'size') {
    return (
      <div className={styles.sizeGrid} role="group" aria-label={facet.label}>
        {facet.values.map(v => (
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
    );
  }
  const itens: FacetValue15[] = facet.kind === 'price' ? priceBuckets(facet) : facet.values;
  return (
    <div className={styles.optList} role="group" aria-label={facet.label}>
      {itens.map(v => (
        <button
          key={v.value}
          type="button"
          className={styles.optBtn}
          aria-pressed={isOn(v.value)}
          onClick={() => onToggle(v.value)}
          data-role="facet-option"
        >
          {v.label}
          {typeof v.quantity === 'number' && <span className={styles.optQty}>{v.quantity}</span>}
        </button>
      ))}
    </div>
  );
}

export default function CategoryMain15() {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const term = TERMO_VAZIO;
  const stageEmpty = !!term;

  const [mockSelected, setMockSelected] = useState<Selected15[]>(SELECIONADAS);
  const [sort, setSort] = useState(ORDEM);
  const userFacets = stageEmpty ? [] : mockSelected;

  const products: Produto15[] = stageEmpty ? [] : PRODUTOS;
  const totalCount = stageEmpty ? 0 : TOTAL;
  const facets = useMemo(() => pickFacets(FACETAS, 0, L.specFacetKey), []);

  const commit = (nextUser: Selected15[]) => setMockSelected(nextUser);
  const facetOf = (key: string) => facets.find(f => f.key === key);
  /** Liga/desliga um valor; faixa de preço é única por faceta. */
  const toggleIn = (list: Selected15[], key: string, value: string) => {
    if (facetOf(key)?.kind === 'price') {
      const on = list.some(f => f.key === key && f.value === value);
      const rest = list.filter(f => f.key !== key);
      return on ? rest : [...rest, { key, value }];
    }
    return toggleFacet(list, { key, value });
  };
  const isSelected = (key: string, value: string) => userFacets.some(f => f.key === key && f.value === value);
  const ofFacet = (key: string) => userFacets.filter(f => f.key === key);
  /** Nome de um valor escolhido (a faixa de preço vira texto). */
  const valueLabel = (s: Selected15) => {
    const f = facetOf(s.key);
    if (f?.kind === 'price' || s.value.includes('-to-')) return priceLabel(s.value, f);
    return f?.values.find(v => v.value === s.value)?.label ?? s.value;
  };
  /** O que aparece ao lado do nome da faceta: o valor (um só) ou quantos (vários). */
  const pickedText = (key: string) => {
    const sel = ofFacet(key);
    if (!sel.length) return '';
    return sel.length === 1 ? valueLabel(sel[0]) : String(sel.length);
  };
  /** Chip ativo: o tamanho leva o nome da faceta ("Aro 14"); o resto, só o valor. */
  const chipLabel = (s: Selected15) => {
    const f = facetOf(s.key);
    return f?.kind === 'size' ? `${f.label} ${valueLabel(s)}` : valueLabel(s);
  };

  /* ── ordenação ── */
  const sortRef = useRef<HTMLDivElement>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const onSort = (value: string) => {
    setSortOpen(false);
    setSort(value);
  };

  /* ── painel da faceta (desktop): aplica na hora ── */
  const [openKey, setOpenKey] = useState<string | null>(() => (stageEmpty ? null : ABERTO));
  const openFacet = (key: string) => {
    setSortOpen(false);
    setOpenKey(k => (k === key ? null : key));
  };
  const clearFacet = () => {
    if (!openKey) return;
    commit(userFacets.filter(f => f.key !== openKey));
  };
  useEffect(() => {
    if (!openKey && !sortOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenKey(null);
        setSortOpen(false);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [openKey, sortOpen]);

  /* ── painel mobile (tela cheia): aplica na hora ── */
  const [panelOpen, setPanelOpen] = useState(false);
  const [acc, setAcc] = useState<Record<string, boolean>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const openPanel = () => {
    // Abre a 1ª faceta com valor escolhido (no desenho, o Aro); sem escolha, a 1ª.
    const primeira = facets.find(f => userFacets.some(s => s.key === f.key)) ?? facets[0];
    setAcc(primeira ? { [primeira.key]: true } : {});
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
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closePanel();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [panelOpen]);

  const shown = products.length;
  const hasMore = shown > 0 && shown < totalCount;
  const isEmpty = products.length === 0;
  const sortName = SORT_OPTIONS.find(([k]) => k === sort)?.[1] ?? SORT_OPTIONS[0][1];
  const userCount = userFacets.length;
  const openFacetObj = openKey ? facetOf(openKey) : undefined;
  const temBarra = !isEmpty || userCount > 0;
  const contagem = `${totalCount.toLocaleString('pt-BR')}${L.countLabel ? ` ${L.countLabel}` : ''}`;
  const verPecas = fill(L.resultsLabel, { total: totalCount.toLocaleString('pt-BR') });

  const sortMenu = sortOpen && (
    <div className={styles.sortMenu} role="listbox" aria-label={L.sortLabel} data-role="sort-menu">
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
    <div className={styles.mainCategory15Box}>
      <div className={styles.mainCategory15} data-role="cm-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={`${styles.inner}${temBarra ? '' : ` ${styles.innerEmpty}`}`}>
          {temBarra && (
            <div className={styles.barWrap} ref={sortRef}>
              {/* desktop: Filtrar por + facetas + ordenação */}
              <div className={styles.bar} data-role="cm-bar">
                {L.filterByLabel && <span className={styles.barLabel}>{L.filterByLabel}</span>}
                {facets.map(f => {
                  const on = openKey === f.key;
                  const picked = pickedText(f.key);
                  return (
                    <button
                      key={f.key}
                      type="button"
                      className={`${styles.facetBtn}${on ? ` ${styles.facetBtnOpen}` : ''}${picked ? ` ${styles.facetBtnOn}` : ''}`}
                      aria-expanded={on}
                      aria-controls={on ? `${uid}-panel` : undefined}
                      onClick={() => openFacet(f.key)}
                      data-role="facet-btn"
                    >
                      {f.label}
                      {picked ? ` · ${picked}` : ''}
                      <Chevron up={on} />
                    </button>
                  );
                })}
                <button
                  type="button"
                  className={styles.sortBtn}
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                  onClick={() => setSortOpen(v => !v)}
                  data-role="sort-btn"
                >
                  <span className={styles.muted}>{L.sortLabel}</span>
                  {sortName}
                  <Chevron up={sortOpen} />
                </button>
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
                  {userCount > 0 ? ` (${userCount})` : ''}
                </button>
                <button
                  type="button"
                  className={styles.mBtn}
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                  onClick={() => setSortOpen(v => !v)}
                  data-role="m-sort-btn"
                >
                  {L.sortLabel}
                  <Chevron up={sortOpen} />
                </button>
              </div>

              {sortMenu}
            </div>
          )}

          {temBarra && openFacetObj && (
            <section
              id={`${uid}-panel`}
              className={styles.facetPanel}
              aria-label={`Filtro de ${openFacetObj.label.toLocaleLowerCase('pt-BR')}`}
              data-role="facet-panel"
            >
              <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>
                  {openFacetObj.kind === 'size' ? L.sizeTitle || openFacetObj.label : openFacetObj.label}
                </legend>
                <FacetOptions15
                  facet={openFacetObj}
                  isOn={v => isSelected(openFacetObj.key, v)}
                  onToggle={v => commit(toggleIn(userFacets, openFacetObj.key, v))}
                />
                {openFacetObj.kind === 'size' && L.sizeGuideLabel && (
                  <a className={styles.guide} href={L.sizeGuideUrl || '#'} data-role="size-guide">
                    <Ruler />
                    {L.sizeGuideLabel}
                  </a>
                )}
              </fieldset>
              <div className={styles.panelActions}>
                <button type="button" className={styles.ghostBtn} onClick={clearFacet} data-role="facet-clear">
                  {L.clearLabel}
                </button>
                <button type="button" className={styles.solidBtn} onClick={() => setOpenKey(null)} data-role="facet-done">
                  {verPecas}
                </button>
              </div>
            </section>
          )}

          {temBarra && (
            <div className={`${styles.active}${userCount ? '' : ` ${styles.activeNone}`}`} data-role="cm-active">
              {!isEmpty && (
                <span className={styles.activeCount} data-role="cm-count">
                  {contagem}
                </span>
              )}
              {userFacets.map(f => {
                const label = chipLabel(f);
                return (
                  <button
                    key={`${f.key}:${f.value}`}
                    type="button"
                    className={styles.activeChip}
                    aria-label={`Remover filtro ${label}`}
                    onClick={() => commit(userFacets.filter(x => !(x.key === f.key && x.value === f.value)))}
                    data-role="cm-active-chip"
                  >
                    {label}
                    <Close />
                  </button>
                );
              })}
              {userCount > 0 && (
                <button type="button" className={styles.clearAll} onClick={() => commit([])} data-role="cm-clear-all">
                  <span className={styles.dsk}>{L.clearAllLabel}</span>
                  <span className={styles.mob}>{L.clearLabel}</span>
                </button>
              )}
            </div>
          )}

          {temBarra && !isEmpty && (
            <span className={styles.mCount} data-role="cm-mcount">
              {contagem}
            </span>
          )}

          {isEmpty ? (
            <section className={styles.empty} aria-label="Busca sem resultado" data-role="cm-empty">
              {L.emptyEyebrow && (
                <span className={styles.emptyEyebrow}>
                  <span className={styles.emptyRule} aria-hidden="true" />
                  <span>{L.emptyEyebrow}</span>
                  <span className={styles.emptyRule} aria-hidden="true" />
                </span>
              )}
              {React.createElement(
                term ? 'h1' : 'h2',
                { className: styles.emptyTitle, 'data-role': 'cm-empty-title' },
                L.emptyTitle,
                term && (
                  <>
                    {' '}
                    <em>“{term}”</em>
                  </>
                )
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
            </section>
          ) : (
            <ul className={styles.grid} data-role="cm-grid">
              {products.map((p, i) => (
                <li key={p.id ?? i} className={styles.gridItem}>
                  <ProductCard15 product={p} />
                </li>
              ))}
            </ul>
          )}

          {!isEmpty && totalCount > 0 && (
            <div className={styles.more} data-role="cm-more">
              <span className={styles.progressText}>{fill(L.progressLabel, { shown, total: totalCount })}</span>
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
        </div>

        {panelOpen && (
          <section className={styles.panel} role="dialog" aria-modal="true" aria-labelledby={`${uid}-ptitle`} data-role="m-filter-panel">
            <div className={styles.panelHead}>
              <h2 id={`${uid}-ptitle`} className={styles.panelTitle}>
                {L.filterLabel}
              </h2>
              <button ref={closeRef} type="button" className={styles.iconBtn} aria-label="Fechar filtros" onClick={closePanel}>
                <Close size={20} w={1.4} />
              </button>
            </div>
            <div className={styles.panelBody}>
              {facets.map(f => {
                const on = !!acc[f.key];
                const picked = pickedText(f.key);
                return (
                  <div key={f.key} className={`${styles.accItem}${on ? ` ${styles.accItemOpen}` : ''}`}>
                    <button
                      type="button"
                      className={styles.accBtn}
                      aria-expanded={on}
                      aria-controls={`${uid}-acc-${f.key}`}
                      onClick={() => setAcc(a => ({ ...a, [f.key]: !on }))}
                    >
                      <span>
                        {f.label}
                        {picked && <span className={styles.accent}> · {picked}</span>}
                      </span>
                      <PlusMinus open={on} />
                    </button>
                    {on && (
                      <div id={`${uid}-acc-${f.key}`} className={styles.accBody}>
                        <FacetOptions15
                          facet={f}
                          isOn={v => isSelected(f.key, v)}
                          onToggle={v => commit(toggleIn(userFacets, f.key, v))}
                        />
                        {f.kind === 'size' && L.sizeGuideLabel && (
                          <a className={styles.guide} href={L.sizeGuideUrl || '#'}>
                            {L.sizeGuideLabel}
                          </a>
                        )}
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
                {verPecas}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

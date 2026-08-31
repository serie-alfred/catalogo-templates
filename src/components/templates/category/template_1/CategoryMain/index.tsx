import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { useLayout } from '@/context/LayoutContext';
import { LAYOUTS } from '@/data/layoutData';
import { TemplateRegistry } from '@/utils/templateRegistry';
import Spot from '@/components/templates/common/template_1/Spot';

// Preview do CategoryMain01 — dados fixos, sem VTEX/GraphQL/hooks.
//
// Origem: faststore.starter/src/components/organisms/MainCategory01 e as
// molecules que ele compõe:
//   • FilterSidebar01      → o filtro da coluna desktop (acordeão + checkbox)
//   • FilterSliderUsage01  → o filtro mobile, que no tema real é o <FilterSlider>
//                            do @faststore/ui estilizado por MainCategory01/filter.scss
//   • MobileSortPanel01    → o painel "Ordenar por" que sobe de baixo no mobile
//
// Aqui não existe @faststore/ui, então o modal mobile é uma recriação do DOM que
// o FilterSlider gera (header + acordeão + rodapé com Limpar/Aplicar), com os
// estilos de filter.scss convertidos para o CSS Module.
//
// O filtro NÃO filtra: marcar um facet só mostra o input selecionado — o preview
// serve para o usuário ver a interação, não para paginar produtos.

const SORT_OPTIONS: Record<string, string> = {
  score_desc: 'Relevância',
  release_desc: 'Lançamentos',
  price_asc: 'Preço, crescente',
  price_desc: 'Preço, decrescente',
  orders_desc: 'Mais vendidos',
  name_asc: 'Nome, A-Z',
  name_desc: 'Nome, Z-A',
  discount_desc: 'Melhor desconto',
};

type FacetValue = { value: string; label: string; quantity: number };
type Facet = { key: string; label: string; values: FacetValue[] };

// Equivalente aos `facets` que o usePLP devolve. Só booleanos: o FilterSidebar01
// da origem ignora o que não for StoreFacetBoolean, e o facet de range (o slider
// de preço) não tem contrapartida nos dados fixos do catálogo.
const FACETS: Facet[] = [
  {
    key: 'category-1',
    label: 'Categorias',
    values: [
      { value: 'camisetas', label: 'Camisetas', quantity: 10 },
      { value: 'moletons', label: 'Moletons', quantity: 6 },
      { value: 'calcas', label: 'Calças', quantity: 4 },
    ],
  },
  {
    key: 'price',
    label: 'Preço',
    values: [
      { value: '0-50', label: 'Até R$ 50', quantity: 5 },
      { value: '50-100', label: 'De R$ 50 à R$ 100', quantity: 12 },
      { value: '100-200', label: 'De R$ 100 à R$ 200', quantity: 8 },
      { value: '200', label: 'Acima de R$ 200', quantity: 3 },
    ],
  },
  {
    key: 'brand',
    label: 'Marcas',
    values: [
      { value: 'marca-a', label: 'Marca A', quantity: 12 },
      { value: 'marca-b', label: 'Marca B', quantity: 8 },
    ],
  },
  {
    key: 'tamanho',
    label: 'Tamanho',
    values: [
      { value: 'p', label: 'P', quantity: 10 },
      { value: 'm', label: 'M', quantity: 15 },
      { value: 'g', label: 'G', quantity: 9 },
    ],
  },
  {
    key: 'cor',
    label: 'Cor',
    values: [
      { value: 'azul', label: 'Azul', quantity: 7 },
      { value: 'vermelho', label: 'Vermelho', quantity: 12 },
      { value: 'preto', label: 'Preto', quantity: 18 },
    ],
  },
];

const facetId = (key: string, value: string) => `${key}::${value}`;

const ChevronDown = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M8 10L12 14L16 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// O acordeão do FilterSlider usa a seta para a DIREITA, girada -90° quando
// expandido (o [data-fs-button-icon] de filter.scss). A seta para baixo é a da
// sidebar desktop.
const ChevronRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M5.833 4.083 8.75 7l-2.917 2.917"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseGlyph = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12.5 3.5L3.5 12.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
    <path
      d="M12.5 12.5L3.5 3.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

const CategoryMain = () => {
  const { selections } = useLayout();

  // Filtra os spots selecionados
  const selectedSpots = selections.filter(item => item.layoutKey === 'spot');

  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState('release_desc');

  // Sidebar desktop: blocos recolhidos (clique no .filterTitleActive) e facets
  // marcados. Aplicam na hora, como no FilterSidebar01.
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Modal mobile: como no FilterSlider, o que se marca é rascunho — só vira
  // seleção no "Aplicar Filtros"; fechar no X/overlay descarta.
  const [draft, setDraft] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set([FACETS[0].key])
  );

  // Trava o scroll enquanto um dos painéis mobile está aberto.
  useEffect(() => {
    const lock = filterOpen || sortOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [filterOpen, sortOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setFilterOpen(false);
      setSortOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleCollapsed = (key: string) =>
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleExpanded = (key: string) =>
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleIn = (
    setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    id: string
  ) =>
    setter(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const openFilter = () => {
    setDraft(new Set(selected));
    setFilterOpen(true);
  };

  const applyFilters = () => {
    setSelected(new Set(draft));
    setFilterOpen(false);
  };

  // Componente de paginação
  const Pagination = () => (
    <div className={styles.pagination}>
      <div className={styles.paginateLinks}>
        <a href="#" className={`${styles.pageLink} ${styles.pageCurrent}`}>
          1
        </a>
        <a href="#" className={styles.pageLink}>
          2
        </a>
        <a href="#" className={`${styles.pageLink} ${styles.pageNext}`}>
          {'>'}
        </a>
      </div>
    </div>
  );

  return (
    <div className={styles.categoryMain}>
      {/* Casca: é ela que carrega o container-type. As camadas em position:fixed
          (modal de filtro e painel de ordenação) ficam FORA dela — containment
          torna o elemento bloco container de descendentes fixed, e os painéis
          ficariam presos à caixa da vitrine em vez de cobrirem a viewport. */}
      <div className={styles.categoryShell}>
        <div className={`component__container`}>
          {/* Botões de filtro e ordenação (mobile) */}
          <div className={styles.categoryButtons}>
            <div className={styles.buttonsContainer}>
              <div className={styles.buttonsRow}>
                <div className={styles.buttonsWrapper}>
                  <span className={styles.buttonsFilter} onClick={openFilter}>
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 4H21"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M13 19H21"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M3 19H7"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M3 11.5H13"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M3 4H5"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M19 11.5H21"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M9.5 2C9.0341 2 8.8011 2 8.6173 2.07612C8.3723 2.17761 8.1776 2.37229 8.0761 2.61732C8 2.80109 8 3.03406 8 3.5V4.5C8 4.96594 8 5.19891 8.0761 5.38268C8.1776 5.62771 8.3723 5.82239 8.6173 5.92388C8.8011 6 9.0341 6 9.5 6C9.9659 6 10.1989 6 10.3827 5.92388C10.6277 5.82239 10.8224 5.62771 10.9239 5.38268C11 5.19891 11 4.96594 11 4.5V3.5C11 3.03406 11 2.80109 10.9239 2.61732C10.8224 2.37229 10.6277 2.17761 10.3827 2.07612C10.1989 2 9.9659 2 9.5 2Z"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M11.5 17C11.0341 17 10.8011 17 10.6173 17.0761C10.3723 17.1776 10.1776 17.3723 10.0761 17.6173C10 17.8011 10 18.0341 10 18.5V19.5C10 19.9659 10 20.1989 10.0761 20.3827C10.1776 20.6277 10.3723 20.8224 10.6173 20.9239C10.8011 21 11.0341 21 11.5 21C11.9659 21 12.1989 21 12.3827 20.9239C12.6277 20.8224 12.8224 20.6277 12.9239 20.3827C13 20.1989 13 19.9659 13 19.5V18.5C13 18.0341 13 17.8011 12.9239 17.6173C12.8224 17.3723 12.6277 17.1776 12.3827 17.0761C12.1989 17 11.9659 17 11.5 17Z"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M14.5 9.5C14.0341 9.5 13.8011 9.5 13.6173 9.57612C13.3723 9.67761 13.1776 9.87229 13.0761 10.1173C13 10.3011 13 10.5341 13 11V12C13 12.4659 13 12.6989 13.0761 12.8827C13.1776 13.1277 13.3723 13.3224 13.6173 13.4239C13.8011 13.5 14.0341 13.5 14.5 13.5C14.9659 13.5 15.1989 13.5 15.3827 13.4239C15.6277 13.3224 15.8224 13.1277 15.9239 12.8827C16 12.6989 16 12.4659 16 12V11C16 10.5341 16 10.3011 15.9239 10.1173C15.8224 9.87229 15.6277 9.67761 15.3827 9.57612C15.1989 9.5 14.9659 9.5 14.5 9.5Z"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Filtrar
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 16L14 12L10 8"
                        stroke="#F5F5F5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>

                  <span
                    className={styles.buttonsOrder}
                    onClick={() => setSortOpen(true)}
                  >
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 25 24"
                      width="25"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.5 10H18.5"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M11.5 14H16.5"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M11.5 18H14.5"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M11.5 6H21.5"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M7.5 18.8125C7.10678 19.255 6.06018 21 5.5 21M5.5 21C4.93982 21 3.89322 19.255 3.5 18.8125M5.5 21V15"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M3.5 5.1875C3.89322 4.74501 4.93982 3 5.5 3M5.5 3C6.06018 3 7.10678 4.74501 7.5 5.1875M5.5 3V9"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Ordenar Por
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 16L14 12L10 8"
                        stroke="#F5F5F5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de produtos */}
          <div className={styles.categoryList}>
            <div className={styles.listContainer}>
              <div className={styles.listRow}>
                {/* Sidebar desktop — FilterSidebar01 */}
                <aside className={styles.listFilter}>
                  <div className={styles.filter}>
                    <span className={styles.filterTitleForm}>Filtrar</span>

                    <div className={styles.filterTotal}>
                      <span>
                        Mostrando <b>6</b> de 28
                      </span>
                    </div>

                    <div className={styles.filterForm}>
                      {FACETS.map(facet => {
                        const isExpanded = !collapsed.has(facet.key);

                        return (
                          <div key={facet.key} className={styles.filterBlock}>
                            <span
                              className={styles.filterTitleActive}
                              onClick={() => toggleCollapsed(facet.key)}
                              role="button"
                              tabIndex={0}
                              aria-expanded={isExpanded}
                              onKeyDown={e => {
                                if (e.key !== 'Enter' && e.key !== ' ') return;
                                e.preventDefault();
                                toggleCollapsed(facet.key);
                              }}
                            >
                              {facet.label}
                              <span
                                className={`${styles.filterArrow} ${
                                  isExpanded ? styles.filterArrowExpanded : ''
                                }`}
                              >
                                <ChevronDown />
                              </span>
                            </span>

                            {isExpanded && (
                              <ul className={styles.filterList}>
                                {facet.values.map(item => {
                                  const id = facetId(facet.key, item.value);
                                  const inputId = `cm1-sb-${facet.key}-${item.value}`;

                                  return (
                                    <li
                                      key={item.value}
                                      className={styles.filterItem}
                                    >
                                      <input
                                        type="checkbox"
                                        id={inputId}
                                        className={styles.filterInput}
                                        checked={selected.has(id)}
                                        onChange={() =>
                                          toggleIn(setSelected, id)
                                        }
                                      />
                                      <label
                                        className={styles.filterLabel}
                                        htmlFor={inputId}
                                      >
                                        <span
                                          className={`${styles.filterBox} ${styles.filterBoxCheck}`}
                                          aria-hidden="true"
                                        />
                                        <span className={styles.filterName}>
                                          {item.label}
                                        </span>
                                        <span className={styles.filterCount}>
                                          ({item.quantity})
                                        </span>
                                      </label>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </aside>

                <div className={styles.listShowcase}>
                  <div className={styles.listWrapper}>
                    <div className={styles.listOrder}>
                      <div className={styles.listTotalMobile}>
                        <span>
                          Mostrando <b>6</b> de 28
                        </span>
                      </div>

                      <div className={styles.listFields}>
                        <strong>Ordenar por:</strong>
                        <div className={styles.brandFilter}>
                          <select
                            className={styles.brandSelect}
                            value={sort}
                            onChange={e => setSort(e.target.value)}
                          >
                            {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                              <option key={key} value={key}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className={styles.listSpots}>
                      <div className={styles.showcaseCatalog}>
                        <div className={styles.showcaseList}>
                          {[1, 2, 3, 4, 5, 6].map(slot => (
                            <div key={slot} className={styles.listSpot}>
                              {selectedSpots.length > 0
                                ? selectedSpots.map(
                                    (spot: {
                                      id: string;
                                      uid: string;
                                      variables?: Record<string, string>;
                                    }) => {
                                      const layoutItem = LAYOUTS.spot.items.find(
                                        it => it.id === spot.id
                                      );
                                      if (!layoutItem) return null;

                                      const SpotComponent =
                                        TemplateRegistry[layoutItem.component];

                                      return SpotComponent ? (
                                        [1, 2, 3, 4].map((_, index) => (
                                          <div
                                            key={`${spot?.uid}-${index}`}
                                            style={
                                              spot.variables as React.CSSProperties
                                            }
                                          >
                                            <SpotComponent />
                                          </div>
                                        ))
                                      ) : (
                                        <></>
                                      );
                                    }
                                  )
                                : [1, 2, 3, 4].map((_, index) => (
                                    <div key={index}>
                                      <Spot />
                                    </div>
                                  ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={styles.listPagination}>
                      <Pagination />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modal de filtro mobile ──────────────────────────────────────────
          Recriação do <FilterSlider> do @faststore/ui como o filter.scss do
          MainCategory01 o estiliza: painel de 420px (100% até 768px) entrando
          pela direita, header "Filtros", acordeão de facets e rodapé com
          "Limpar filtros"/"Aplicar Filtros".

          Montado só quando aberto: assim não sobra camada fixa no DOM do
          /gerador, onde o card é inerte e o modal nunca chega a abrir. */}
      {filterOpen && (
        <>
          <div
            className={styles.filterOverlay}
            onClick={() => setFilterOpen(false)}
          />
          <aside
            className={styles.filterSlider}
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
          >
            <div className={styles.filterSliderHeader}>
              <span className={styles.filterSliderTitle}>Filtros</span>
              <button
                type="button"
                className={styles.filterSliderClose}
                onClick={() => setFilterOpen(false)}
                aria-label="Fechar"
              >
                <CloseGlyph />
              </button>
            </div>

            <div className={styles.filterSliderContent}>
              <div className={styles.accordion}>
                {FACETS.map(facet => {
                  const isExpanded = expanded.has(facet.key);

                  return (
                    <div key={facet.key} className={styles.accordionItem}>
                      <button
                        type="button"
                        className={`${styles.accordionButton} ${
                          isExpanded ? styles.accordionButtonExpanded : ''
                        }`}
                        onClick={() => toggleExpanded(facet.key)}
                        aria-expanded={isExpanded}
                      >
                        <span className={styles.accordionLabel}>
                          {facet.label}
                        </span>
                        <span className={styles.accordionIcon}>
                          <ChevronRight />
                        </span>
                      </button>

                      {isExpanded && (
                        <div className={styles.accordionPanel}>
                          <ul className={styles.accordionList}>
                            {facet.values.map(item => {
                              const id = facetId(facet.key, item.value);
                              const inputId = `cm1-dw-${facet.key}-${item.value}`;

                              return (
                                <li
                                  key={item.value}
                                  className={styles.filterItem}
                                >
                                  <input
                                    type="checkbox"
                                    id={inputId}
                                    className={styles.filterInput}
                                    checked={draft.has(id)}
                                    onChange={() => toggleIn(setDraft, id)}
                                  />
                                  <label
                                    className={`${styles.filterLabel} ${styles.filterLabelSlider}`}
                                    htmlFor={inputId}
                                  >
                                    <span
                                      className={`${styles.filterBox} ${styles.filterBoxInner}`}
                                      aria-hidden="true"
                                    />
                                    <span className={styles.filterName}>
                                      {item.label}
                                    </span>
                                    <span className={styles.filterCount}>
                                      ({item.quantity})
                                    </span>
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.filterSliderFooter}>
              <button
                type="button"
                className={styles.filterSliderClear}
                onClick={() => setDraft(new Set())}
              >
                {draft.size > 0
                  ? `Limpar filtros (${draft.size})`
                  : 'Limpar filtros'}
              </button>
              <button
                type="button"
                className={styles.filterSliderApply}
                onClick={applyFilters}
              >
                Aplicar Filtros
              </button>
            </div>
          </aside>
        </>
      )}

      {/* ── Painel "Ordenar por" mobile — MobileSortPanel01 ─────────────── */}
      {sortOpen && (
        <>
          <div
            className={styles.sortOverlay}
            onClick={() => setSortOpen(false)}
          />
          <div
            className={styles.sortPanel}
            role="dialog"
            aria-modal="true"
            aria-label="Ordenar por"
          >
            <div className={styles.sortWrapper}>
              <div className={styles.sortHeader}>
                <span className={styles.sortTitle}>Ordenar por</span>
                <button
                  type="button"
                  className={styles.sortClose}
                  onClick={() => setSortOpen(false)}
                  aria-label="Fechar"
                >
                  <CloseGlyph />
                </button>
              </div>

              <div className={styles.sortOptions}>
                {Object.entries(SORT_OPTIONS).map(([key, label]) => (
                  <span
                    key={key}
                    className={`${styles.sortOption} ${
                      sort === key ? styles.sortOptionActive : ''
                    }`}
                    onClick={() => {
                      setSort(key);
                      setSortOpen(false);
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryMain;

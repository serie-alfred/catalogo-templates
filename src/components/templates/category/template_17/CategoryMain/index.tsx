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
  FONTES_17,
  ProductCard17,
  produto17,
  type Produto17,
} from '@/components/templates/common/template_17/Spot';
import {
  type Facet17,
  type PriceBucket17,
  type RawFacet17,
  type Selected17,
  type Species17,
  SPECIES_KEY,
  isScopeFacet,
  pickFacets,
  plural,
  priceBuckets,
  selectedLabel,
  speciesIcon,
} from './facets';

/**
 * Espelha `organisms/MainCategory17` do faststore.starter (família 17, Pet; desenhos
 * `CategoryMain17`, `CategoryMain17-mobile-filtros` e `SearchEmpty17`). Mesmo markup, classes e
 * `data-role`; o CSS é derivado do SCSS de lá e as facetas passam pelo mesmo `facets.ts` (cópia).
 *
 * O que sai em relação à origem:
 *  • `usePLP`/`useSearchPage`/`useProductsQuery`/`useSearch` → os dados de exemplo do `mock.ts`
 *    de lá (12 produtos com nota, facetas, escopo "Cães", seleção do desenho, contagem e
 *    ordenação); faceta e ordenação mudam num `useState` local — o mesmo que lá acontece fora de
 *    uma PLP real. "Carregar mais" não busca nada, como no palco de lá;
 *  • `toggleFacet`/`setFacet`/`formatSearchState` do @faststore/sdk → funções locais equivalentes;
 *    os atalhos por espécie são `#` (lá, fora de uma PLP, também);
 *  • analytics e sessão (useViewItemList, useAuth, GridPage17) → preview não emite evento.
 *
 * O card é o ProductCard17 com as notas do desenho (lá o palco injeta `mockRatings17`). O estado
 * vazio da busca (desenho `SearchEmpty17`) mora AQUI, como lá: renderiza quando a lista sai vazia;
 * `TERMO_VAZIO` faz o papel da prop `stageEmptyTerm` do palco — vazio, o canvas mostra a grade.
 */

/** O papel do `stageEmptyTerm` do palco: com um termo, a réplica mostra o estado vazio. */
const TERMO_VAZIO: string = '';

const mainCategory17Mock = {
  pageSize: 12,
  speciesLabel: 'Compre por pet',
  specFacetKey: 'porte',
  priceSteps: '50, 150, 300',
  countLabel: 'produtos',
  filterLabel: 'Filtrar',
  sortLabel: 'Ordenar por',
  clearLabel: 'Limpar',
  clearAllLabel: 'Limpar tudo',
  showMoreLabel: 'Ver mais {n} {faceta}',
  showLessLabel: 'Ver menos',
  priceUpToLabel: 'Até {max}',
  priceBetweenLabel: '{min} a {max}',
  priceOverLabel: 'Acima de {min}',
  resultsLabel: 'Ver {total} produtos',
  progressLabel: 'Você viu {shown} de {total} produtos',
  loadMoreLabel: 'Carregar mais',
  soldOutText: 'Indisponível no momento',
  emptyCountLabel: '0 resultados',
  emptyTitle: 'Não encontramos nada para',
  emptyFilterTitle: 'Não encontramos nada com esses filtros',
  emptyText:
    'Confira a grafia ou tente um termo mais curto, como “ração coelho” ou “feno”.',
  emptyPrimaryLabel: 'Voltar para o início',
  emptyPrimaryUrl: '/',
  emptySecondaryLabel: 'Ver ofertas da semana',
  emptySecondaryUrl: '/',
};

// [id, nome, marca, por, de, parcelas, valor da parcela, Pix, nota, avaliações, esgotado?]
const BASE: Array<
  [
    string,
    string,
    string,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    boolean?,
  ]
> = [
  [
    'racao-premium-caes-adultos-15kg',
    'Ração Premium Cães Adultos Frango e Arroz 15 kg',
    'Nobre Pet',
    329.9,
    389.9,
    6,
    54.98,
    316.7,
    4.9,
    214,
  ],
  [
    'racao-gatos-castrados-salmao-10kg',
    'Ração Gatos Castrados Salmão 10,1 kg',
    'Felis',
    279.9,
    279.9,
    6,
    46.65,
    268.7,
    4.8,
    186,
  ],
  [
    'racao-premium-filhotes-racas-pequenas-3kg',
    'Ração Premium Filhotes Raças Pequenas 3 kg',
    'Nobre Pet',
    119.9,
    119.9,
    6,
    19.98,
    114.9,
    4.8,
    88,
  ],
  [
    'racao-natural-caes-senior-cordeiro-10kg',
    'Ração Natural Cães Sênior Cordeiro 10,1 kg',
    'Vitta Pet',
    259.9,
    299.9,
    6,
    43.32,
    249.5,
    4.7,
    64,
  ],
  [
    'racao-umida-gatos-adultos-frango-12un',
    'Ração Úmida Gatos Adultos Frango Caixa 12 un.',
    'Felis',
    54.9,
    54.9,
    2,
    27.45,
    52.7,
    4.8,
    121,
  ],
  [
    'racao-caes-adultos-racas-grandes-carne-20kg',
    'Ração Cães Adultos Raças Grandes Carne 20 kg',
    'Nobre Pet',
    389.9,
    389.9,
    6,
    64.98,
    374.3,
    4.7,
    152,
  ],
  [
    'racao-gatos-filhotes-frango-leite-3kg',
    'Ração Gatos Filhotes Frango e Leite 3 kg',
    'Felis',
    89.9,
    89.9,
    0,
    0,
    0,
    4.7,
    73,
    true,
  ],
  [
    'mistura-sementes-calopsita-1kg',
    'Mistura de Sementes para Calopsita 1 kg',
    'Vitta Pet',
    29.9,
    29.9,
    2,
    14.95,
    28.7,
    4.8,
    39,
  ],
  [
    'racao-peixes-ornamentais-flocos-100g',
    'Ração para Peixes Ornamentais em Flocos 100 g',
    'Vitta Pet',
    24.9,
    29.9,
    0,
    0,
    23.9,
    4.6,
    27,
  ],
  [
    'racao-coelhos-roedores-feno-1-5kg',
    'Ração para Coelhos e Roedores com Feno 1,5 kg',
    'Vitta Pet',
    44.9,
    44.9,
    2,
    22.45,
    43.1,
    4.7,
    45,
  ],
  [
    'racao-light-caes-adultos-frango-10kg',
    'Ração Light Cães Adultos Frango 10,1 kg',
    'Nobre Pet',
    239.9,
    239.9,
    6,
    39.98,
    230.3,
    4.8,
    97,
  ],
  [
    'petisco-bifinho-natural-500g',
    'Petisco Bifinho Natural 500 g',
    'Vitta Pet',
    39.9,
    39.9,
    2,
    19.95,
    38.3,
    4.7,
    97,
  ],
];

const mockProducts17: Produto17[] = BASE.map(
  ([id, name, brand, price, list, n, v, pix, nota, qtd, out]) =>
    produto17(id, name, brand, price, list, n, v, pix, !out, nota, qtd)
);

const lista = (pares: Array<[string, string, number?]>) =>
  pares.map(([value, label, quantity]) => ({ value, label, quantity }));

const mockFacets17: RawFacet17[] = [
  {
    __typename: 'StoreFacetBoolean',
    key: 'category-1',
    label: 'Departamento',
    values: lista([
      ['caes', 'Cães', 486],
      ['gatos', 'Gatos', 352],
      ['passaros', 'Pássaros', 74],
      ['peixes', 'Peixes', 61],
      ['roedores', 'Roedores', 48],
      ['repteis', 'Répteis', 19],
    ]),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'category-2',
    label: 'Categoria',
    values: lista([
      ['racao-seca', 'Ração seca', 312],
      ['racao-umida', 'Ração úmida', 96],
      ['racao-natural', 'Ração natural', 41],
      ['petiscos', 'Petiscos', 37],
    ]),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'brand',
    label: 'Marca',
    values: lista([
      ['nobre-pet', 'Nobre Pet', 128],
      ['felis', 'Felis', 94],
      ['vitta-pet', 'Vitta Pet', 76],
      ['casa-do-bicho', 'Casa do Bicho', 18],
      ['mia-gatos', 'Mia Gatos', 16],
      ['pet-feliz', 'Pet Feliz', 14],
      ['aqua-vida', 'Aqua Vida', 11],
      ['bico-doce', 'Bico Doce', 9],
      ['toca-verde', 'Toca Verde', 7],
      ['roedor-e-cia', 'Roedor & Cia', 5],
    ]),
  },
  {
    __typename: 'StoreFacetBoolean',
    key: 'porte',
    label: 'Porte',
    values: lista([
      ['mini', 'Mini'],
      ['pequeno', 'Pequeno'],
      ['medio', 'Médio'],
      ['grande', 'Grande'],
      ['gigante', 'Gigante'],
    ]),
  },
  {
    __typename: 'StoreFacetRange',
    key: 'price',
    label: 'Preço',
    min: { absolute: 24.9 },
    max: { absolute: 389.9 },
  },
];

/** Página de exemplo: o departamento Cães (escopo da página, `category-1`). */
const MOCK_PAGE_LEVEL_17 = 1;
const MOCK_SCOPE_17: Selected17[] = [{ key: 'category-1', value: 'caes' }];
/** Seleção do desenho: Ração seca, Nobre Pet e Porte Médio. */
const MOCK_SELECTED_17: Selected17[] = [
  { key: 'category-2', value: 'racao-seca' },
  { key: 'brand', value: 'nobre-pet' },
  { key: 'porte', value: 'medio' },
];
/** Acordeões abertos na tela de filtros do desenho `-mobile-filtros` (Marca e Porte). */
const MOCK_OPEN_17 = ['brand', 'porte'];
const MOCK_COUNT_17 = 486;
const MOCK_SORT_17 = 'orders_desc';

/** Rótulos do enum `StoreSort` da busca. */
const SORT_OPTIONS: Array<[string, string]> = [
  ['orders_desc', 'Mais vendidos'],
  ['price_asc', 'Menor preço'],
  ['price_desc', 'Maior preço'],
  ['discount_desc', 'Maiores descontos'],
  ['release_desc', 'Lançamentos'],
  ['score_desc', 'Relevância'],
  ['name_asc', 'Nome, A a Z'],
  ['name_desc', 'Nome, Z a A'],
];

/** Quantos valores a lista mostra antes do "Ver mais". */
const LIMIT_LIST = 4;

const fill = (tpl: string, vars: Record<string, number | string>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

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
const Close = ({ size = 14, w = 2 }: { size?: number; w?: number }) => (
  <Ico size={size} w={w}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Ico>
);

/** Desenhos dos atalhos por espécie (traço do desenho `CategoryMain17`); `paw` = genérico. */
const SPECIES_PATHS: Record<Species17, React.ReactNode> = {
  dog: (
    <>
      <path d="M7 7 4.5 4.5 4 11l2.5 1" />
      <path d="M17 7l2.5-2.5L20 11l-2.5 1" />
      <path d="M7 7.5c1.4-1 3-1.5 5-1.5s3.6.5 5 1.5V14a5 5 0 0 1-10 0z" />
      <path d="M10.5 15.5h3l-1.5 1.5z" />
      <path d="M9.5 11.5h.01M14.5 11.5h.01" />
    </>
  ),
  cat: (
    <>
      <path d="M5 4l3.5 4h7L19 4v9a7 7 0 0 1-14 0z" />
      <path d="M9.5 12.5h.01M14.5 12.5h.01" />
      <path d="M11 15.5h2l-1 1z" />
      <path d="M2.5 14.5h4M17.5 14.5h4" />
    </>
  ),
  bird: (
    <>
      <path d="M4 15c0-5 3-9 7.5-9a4.5 4.5 0 0 1 4.5 4l4 1.5-4 1.5c0 4-3 6.5-7 6.5L5 21l1-3.2C4.8 17 4 16.2 4 15z" />
      <path d="M12.5 9.5h.01" />
    </>
  ),
  fish: (
    <>
      <path d="M5 12c3-4 6.5-5.5 10-5.5 2.5 0 4.5 2 5.5 5.5-1 3.5-3 5.5-5.5 5.5-3.5 0-7-1.5-10-5.5z" />
      <path d="M5 12 2 8.5v7z" />
      <path d="M16 11h.01" />
    </>
  ),
  rodent: (
    <>
      <circle cx="7" cy="8" r="2.5" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M6 13a6 6 0 0 1 12 0c0 4-3 7-6 7s-6-3-6-7z" />
      <path d="M10 13h.01M14 13h.01M11 16.5h2" />
    </>
  ),
  reptile: (
    <>
      <path d="M5 15a7 6 0 0 1 14 0z" />
      <path d="M9 11l3 4 3-4" />
      <path d="M19 13.5h1.5a1.8 1.8 0 0 0 0-3.6H19" />
      <path d="M7.5 15v3M16.5 15v3M3 15h18" />
    </>
  ),
  paw: (
    <>
      <ellipse cx="5.5" cy="10" rx="2" ry="2.6" />
      <ellipse cx="9.5" cy="5.5" rx="2" ry="2.6" />
      <ellipse cx="14.5" cy="5.5" rx="2" ry="2.6" />
      <ellipse cx="18.5" cy="10" rx="2" ry="2.6" />
      <path d="M12 11.5c-3 0-6 3.6-6 6.2 0 1.9 1.6 2.8 3.2 2.3.9-.3 1.8-.6 2.8-.6s1.9.3 2.8.6c1.6.5 3.2-.4 3.2-2.3 0-2.6-3-6.2-6-6.2z" />
    </>
  ),
};

/** Opções de uma faceta: as mesmas na coluna do desktop e no acordeão da tela do mobile. */
function FacetBody17({
  facet,
  idBase,
  buckets,
  isOn,
  onToggle,
  onPrice,
  labels,
}: {
  facet: Facet17;
  idBase: string;
  buckets: PriceBucket17[];
  isOn: (value: string) => boolean;
  onToggle: (value: string) => void;
  onPrice: (bucket: PriceBucket17) => void;
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
              {b.label}
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
            {v.label}
            {typeof v.quantity === 'number' && (
              <span className={styles.checkQty}>
                {v.quantity.toLocaleString('pt-BR')}
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

export default function CategoryMain17() {
  const {
    pageSize: pageSizeProp,
    speciesLabel,
    specFacetKey,
    priceSteps,
    countLabel,
    filterLabel,
    sortLabel,
    clearLabel,
    clearAllLabel,
    showMoreLabel,
    showLessLabel,
    priceUpToLabel,
    priceBetweenLabel,
    priceOverLabel,
    resultsLabel,
    progressLabel,
    loadMoreLabel,
    soldOutText,
    emptyCountLabel,
    emptyTitle,
    emptyFilterTitle,
    emptyText,
    emptyPrimaryLabel,
    emptyPrimaryUrl,
    emptySecondaryLabel,
    emptySecondaryUrl,
  } = mainCategory17Mock;
  const stageEmptyTerm = TERMO_VAZIO;
  const PAGE =
    pageSizeProp && pageSizeProp > 0
      ? Math.min(Math.round(pageSizeProp), 50)
      : 12;

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const stageEmpty = !!stageEmptyTerm;

  const pageScope: Selected17[] = MOCK_SCOPE_17;
  const pageLevel = MOCK_PAGE_LEVEL_17;
  const escopo = useCallback(
    (f: { key: string }) => isScopeFacet(f, pageLevel),
    [pageLevel]
  );
  const speciesOn = !!speciesLabel;
  // A lista "Categoria" é o nível de baixo da página; com os atalhos, nunca o departamento.
  const catLevel = (speciesOn ? Math.max(pageLevel, 1) : pageLevel) + 1;

  const [mockSelected, setMockSelected] =
    useState<Selected17[]>(MOCK_SELECTED_17);
  const [mockSort, setMockSort] = useState(MOCK_SORT_17);
  const selected: Selected17[] = stageEmpty
    ? []
    : [...MOCK_SCOPE_17, ...mockSelected];
  const userFacets = selected.filter(f => !escopo(f));
  const sort = mockSort;
  const term: string = stageEmptyTerm;

  const products: Produto17[] = stageEmpty ? [] : mockProducts17.slice(0, PAGE);
  const totalCount: number = stageEmpty ? 0 : MOCK_COUNT_17;
  const loading = false;
  const rawFacets: RawFacet17[] = mockFacets17;
  const facets = useMemo(
    () => pickFacets(rawFacets, pageLevel, catLevel, specFacetKey),
    [rawFacets, pageLevel, catLevel, specFacetKey]
  );
  const speciesFacet = speciesOn
    ? rawFacets.find(f => f?.key === SPECIES_KEY)
    : undefined;
  const speciesValues = speciesFacet?.values ?? [];
  const priceFacet = facets.find(f => f.kind === 'price');
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
  // Preço sem faixas configuradas não tem o que mostrar.
  const shownFacets = facets.filter(
    f => f.kind !== 'price' || buckets.length > 0
  );

  /* ── escrita do estado: local (o mesmo que lá acontece fora de uma PLP real) ── */
  const commit = (nextUser: Selected17[]) => setMockSelected(nextUser);
  const isSelected = (key: string, value: string) =>
    userFacets.some(f => f.key === key && f.value === value);
  // = toggleFacet do @faststore/sdk: tira se já está, senão acrescenta.
  const toggleValue = (key: string, value: string) =>
    commit(
      isSelected(key, value)
        ? userFacets.filter(f => !(f.key === key && f.value === value))
        : [...userFacets, { key, value }]
    );
  // = setFacet(…, unique = true): a faixa substitui a anterior da mesma faceta.
  const setPrice = (key: string, b: PriceBucket17) =>
    isSelected(key, b.value)
      ? commit(userFacets.filter(x => x.key !== key))
      : commit([
          ...userFacets.filter(x => x.key !== key),
          { key, value: b.value },
        ]);
  const removeChip = (f: Selected17) =>
    commit(userFacets.filter(x => !(x.key === f.key && x.value === f.value)));

  const onSort = (value: string) => setMockSort(value);

  /* ── atalhos por espécie ── */
  const speciesIsScope = pageLevel >= 1;
  const speciesActive = speciesIsScope
    ? (pageScope.find(f => f.key === SPECIES_KEY)?.value ?? '')
    : (userFacets.find(f => f.key === SPECIES_KEY)?.value ?? '');
  // Fora de uma PLP real, lá o atalho não navega: href "#" e o clique é engolido.
  const onSpecies = (e: React.MouseEvent) => e.preventDefault();

  /* ── tela de filtros (mobile): aplica na hora ── */
  const [panelOpen, setPanelOpen] = useState(false);
  const [acc, setAcc] = useState<Record<string, boolean>>({});
  const closeRef = useRef<HTMLButtonElement>(null);
  const filterBtnRef = useRef<HTMLButtonElement>(null);
  const openPanel = () => {
    // Lá, no palco, abrem as facetas do desenho (Marca e Porte).
    setAcc(Object.fromEntries(MOCK_OPEN_17.map(k => [k, true])));
    setPanelOpen(true);
  };
  const closePanel = () => {
    setPanelOpen(false);
    filterBtnRef.current?.focus();
  };
  useEffect(() => {
    if (!panelOpen) return;
    closeRef.current?.focus();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closePanel();
    document.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [panelOpen]);

  const listName = 'Listagem de produtos';

  const isEmpty = !loading && products.length === 0;
  const userCount = userFacets.length;
  const temBarra = !isEmpty || userCount > 0;
  const total = totalCount.toLocaleString('pt-BR');
  const shown = products.length;
  const hasMore = shown > 0 && shown < totalCount;
  const labels = {
    showMoreLabel: showMoreLabel || '',
    showLessLabel: showLessLabel || '',
  };
  const valueLabel = (s: Selected17) =>
    selectedLabel(s, facets, buckets, speciesFacet);
  const resumo = (f: Facet17) =>
    userFacets
      .filter(s => s.key === f.key)
      .map(valueLabel)
      .join(', ');

  const sortSelect = (id: string, className: string) => (
    <select
      id={id}
      className={className}
      value={sort}
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

  const body = (f: Facet17, idBase: string) => (
    <FacetBody17
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
    const label = valueLabel(f);
    const spec = facets.find(x => x.key === f.key && x.spec);
    return (
      <button
        key={`${f.key}:${f.value}`}
        type="button"
        className={styles.activeChip}
        aria-label={`Remover filtro ${spec ? `${spec.label} ` : ''}${label}`}
        onClick={() => removeChip(f)}
        data-role="cm-active-chip"
      >
        <span>
          {/* A especificação leva o nome dela no desktop ("Porte: Médio"); no mobile, só o valor. */}
          {spec && <span className={styles.dsk}>{spec.label}: </span>}
          {label}
        </span>
        <Close />
      </button>
    );
  });

  const atalhos =
    speciesOn && speciesValues.length > 1 && !isEmpty ? (
      <nav
        className={styles.species}
        aria-label={speciesLabel}
        data-role="cm-species"
      >
        <ul className={styles.speciesList}>
          {speciesValues.map(v => {
            const on = speciesActive === v.value;
            return (
              <li key={v.value} className={styles.speciesItem}>
                <a
                  className={`${styles.speciesLink}${on ? ` ${styles.speciesOn}` : ''}`}
                  href="#"
                  aria-current={on ? 'true' : undefined}
                  onClick={onSpecies}
                  data-role="cm-species-item"
                >
                  <span className={styles.speciesIcon}>
                    <Ico size={26}>{SPECIES_PATHS[speciesIcon(v.label)]}</Ico>
                  </span>
                  <span className={styles.speciesName}>{v.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    ) : null;

  return (
    <div className={styles.mainCategory17Box}>
      <section
        className={styles.mainCategory17}
        aria-label={listName}
        data-role="cm-root"
      >
        <link rel="stylesheet" href={FONTES_17} />
        <div
          className={`${styles.inner}${temBarra ? '' : ` ${styles.innerEmpty}`}`}
        >
          {atalhos}

          {temBarra && (
            <>
              {/* desktop: contagem + chips ativos + "Limpar tudo" | ordenação */}
              <div className={styles.bar} data-role="cm-bar">
                <strong className={styles.count} data-role="cm-count">
                  {total} {countLabel}
                </strong>
                {chipsAtivos}
                {userCount > 0 && (
                  <button
                    type="button"
                    className={styles.clearAll}
                    onClick={() => commit([])}
                    data-role="cm-clear-all"
                  >
                    {clearAllLabel}
                  </button>
                )}
                <div className={styles.sort}>
                  <label className={styles.sortLabel} htmlFor={`${uid}-sort`}>
                    {sortLabel}
                  </label>
                  {sortSelect(`${uid}-sort`, styles.sortSelect)}
                </div>
              </div>

              {/* mobile: Filtrar (n) | ordenação na caixa clara; chips numa linha; contagem */}
              <div className={styles.mTools} data-role="cm-mtools">
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
                  <Sliders />
                  {filterLabel}
                  {userCount > 0 && ` (${userCount})`}
                </button>
                <label className={styles.mSort} htmlFor={`${uid}-msort`}>
                  <span className={styles.srOnly}>{sortLabel}</span>
                  {sortSelect(`${uid}-msort`, styles.mSortSelect)}
                </label>
              </div>
              {userCount > 0 && (
                <div className={styles.mChips} data-role="cm-mchips">
                  <div className={styles.mChipsRow}>{chipsAtivos}</div>
                </div>
              )}
              <span className={styles.mCount} data-role="cm-mcount">
                {total} {countLabel}
              </span>
            </>
          )}

          {isEmpty ? (
            <div className={styles.empty} data-role="cm-empty">
              <span className={styles.emptyArt} aria-hidden="true">
                <svg
                  className={styles.emptySvg}
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
              {emptyCountLabel && (
                <span className={styles.emptyCount}>{emptyCountLabel}</span>
              )}
              {React.createElement(
                term ? 'h1' : 'h2',
                { className: styles.emptyTitle, 'data-role': 'cm-empty-title' },
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
          ) : (
            <div className={styles.layout}>
              {shownFacets.length > 0 && (
                <aside
                  className={styles.aside}
                  aria-label={filterLabel}
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
                <ul
                  className={styles.grid}
                  aria-busy={loading || undefined}
                  data-role="cm-grid"
                >
                  {products.map((p, i) => (
                    <li key={p.id ?? i} className={styles.gridItem}>
                      <ProductCard17 product={p} soldOutText={soldOutText} />
                    </li>
                  ))}
                </ul>

                {totalCount > 0 && (
                  <div className={styles.more} data-role="cm-more">
                    <span className={styles.progressText}>
                      {fill(progressLabel || '', { shown, total })}
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
                        {loadMoreLabel}
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
              className={styles.veil}
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
                  {filterLabel}
                  {userCount > 0 && (
                    <span
                      className={styles.panelBadge}
                      data-role="m-filter-count"
                    >
                      <span className={styles.srOnly}>, filtros ativos: </span>
                      {userCount}
                    </span>
                  )}
                </h2>
                <button
                  ref={closeRef}
                  type="button"
                  className={styles.panelClose}
                  aria-label="Fechar filtros"
                  onClick={closePanel}
                >
                  <Close size={20} w={1.8} />
                </button>
              </div>
              <div className={styles.panelBody}>
                {shownFacets.map(f => {
                  const on = !!acc[f.key];
                  const sum = resumo(f);
                  return (
                    <div
                      key={f.key}
                      className={`${styles.accItem}${f.kind === 'pills' ? ` ${styles.accPills}` : ''}`}
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
                          {sum && (
                            <span className={styles.accSum}> · {sum}</span>
                          )}
                        </span>
                        <Ico size={18} w={2}>
                          <path d={on ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                        </Ico>
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
          </>
        )}
      </section>
    </div>
  );
}

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/MainCategory06` do faststore.starter — a PLP 06 inteira,
 * com o grafo que ela compõe inline: o skin do override (`productGallery06`,
 * o mesmo da rota de categoria real), o título+contagem do `CategoryTitle06` e
 * o `ProductCard06`.
 *
 * O que sai: `usePLP`, `useProductsQuery`, `useSearch`/`useSearchPage`,
 * `useAuth`, a wishlist e o tracking. O conteúdo é o mesmo `mock.ts` da origem
 * (12 sneakers, contagem 204, trilha Home › Calçados › Sneakers), com as fotos
 * trocadas por `placehold.co` nas mesmas medidas: o catálogo é público e nenhum
 * template daqui aponta para o CDN de uma loja. Quem dimensiona a foto é o CSS,
 * então a geometria não muda — o portão confirma nó a nó.
 *
 * O botão Filtros abre o drawer da origem (`molecules/FilterDrawer06`): mesma
 * marcação, mesmo CSS e o mesmo comportamento — ordenação por caixas de seleção
 * única, faixa de preço de duas pontas, Tamanho em chips, Cor em chips com
 * amostra, os demais grupos em lista com checkbox e contagem, acordeão aberto
 * por padrão, "Limpar (N)" no cabeçalho e aplicação na hora (sem rodapé). Os
 * facets são os do `mock.ts` da origem; marcar muda o estado do drawer e a
 * contagem do botão, e a grade de demonstração fica como está.
 *
 * Fica de fora a folha de tamanho do card e o bloco "Compre por tamanho" da
 * toolbar, que sem conteúdo de CMS não renderiza.
 */
const foto = (i: number) =>
  `https://placehold.co/500x500/${['efefef', 'e7e7e7', 'dfdfdf', 'd7d7d7', 'cfcfcf'][i % 5]}/999999?text=Sneaker+${i + 1}`;

type Produto = {
  id: string;
  nome: string;
  preco: number;
  parcelaN: number;
  parcelaValor: number;
  imagens: string[];
  flag?: string;
  precoDe?: number;
};

const PRODUTOS: Produto[] = [
  { id: 'p1', nome: 'Sneaker Masculino Preto Flip', preco: 409.9, parcelaN: 10, parcelaValor: 40.99, imagens: [foto(0), foto(2), foto(3)], flag: 'Novidade' },
  { id: 'p2', nome: 'Sneaker Masculino Chocolate Mid', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(1), foto(2), foto(3)] },
  { id: 'p3', nome: 'Sneaker Masculino Flip Classic', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(2), foto(3), foto(4)] },
  { id: 'p4', nome: 'Sneaker Masculino Café Flip Classic', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(3), foto(2), foto(4)] },
  { id: 'p5', nome: 'Sneaker Masculino Flip Classic', preco: 419.9, parcelaN: 10, parcelaValor: 41.99, imagens: [foto(4), foto(2), foto(3)] },
  { id: 'p6', nome: 'Sneaker Masculino Preto Flip Classic', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(0), foto(2), foto(3)] },
  { id: 'p7', nome: 'Sneaker Masculino Knit Energy Preto', preco: 469.9, parcelaN: 10, parcelaValor: 46.99, imagens: [foto(1), foto(2), foto(3)], precoDe: 519.9 },
  { id: 'p8', nome: 'Sneaker Masculino Preto Flip', preco: 409.9, parcelaN: 10, parcelaValor: 40.99, imagens: [foto(2), foto(3), foto(4)] },
  { id: 'p9', nome: 'Sneaker Masculino Chocolate Mid', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(3), foto(2), foto(4)] },
  { id: 'p10', nome: 'Sneaker Masculino Café Flip Classic', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(4), foto(2), foto(3)] },
  { id: 'p11', nome: 'Sneaker Masculino Knit Energy', preco: 469.9, parcelaN: 10, parcelaValor: 46.99, imagens: [foto(0), foto(2), foto(3)] },
  { id: 'p12', nome: 'Sneaker Masculino Preto Flip Classic', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(1), foto(2), foto(3)] },
];

const TRILHA = [
  { item: '/calcados', name: 'Calçados' },
  { item: '/calcados/sneakers', name: 'Sneakers' },
];
const TITULO = 'Sneakers';
const TOTAL = 204;
const TAMANHOS = ['38', '39', '40', '41', '42'];
const ROTULO_FILTRO = 'Filtros';
const ROTULO_ORDENAR = 'Ordenar por';
const ROTULO_FILTRAR = 'Filtrar por';
const ROTULO_LIMPAR = 'Limpar';

/* ── drawer de filtros (molecules/FilterDrawer06 + o estado do MainCategory06) ── */
type Faceta = {
  key: string;
  label: string;
  values?: { value: string; label: string; quantity?: number }[];
  min?: { selected: number; absolute: number };
  max?: { selected: number; absolute: number };
};

/* `SORT_OPTIONS` do MainCategory06 */
const ORDENACOES = [
  { value: 'orders_desc', label: 'Mais vendidos' },
  { value: 'release_desc', label: 'Lançamentos' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'discount_desc', label: 'Maior desconto' },
];

/* `mockFacets` do mock.ts da origem */
const FACETAS: Faceta[] = [
  {
    key: 'price',
    label: 'Faixas de preço',
    min: { selected: 189, absolute: 189 },
    max: { selected: 590, absolute: 590 },
  },
  {
    key: 'tamanho',
    label: 'Tamanho',
    values: [
      { value: '38', label: '38', quantity: 42 },
      { value: '39', label: '39', quantity: 78 },
      { value: '40', label: '40', quantity: 91 },
      { value: '41', label: '41', quantity: 88 },
      { value: '42', label: '42', quantity: 60 },
      { value: '43', label: '43', quantity: 24 },
    ],
  },
  {
    key: 'cor',
    label: 'Cor',
    values: [
      { value: 'preto', label: 'Preto', quantity: 96 },
      { value: 'marrom', label: 'Marrom', quantity: 41 },
      { value: 'branco', label: 'Branco', quantity: 22 },
      { value: 'cafe', label: 'Café', quantity: 18 },
    ],
  },
  {
    key: 'linha',
    label: 'Linha',
    values: [
      { value: 'flip', label: 'Flip (Calce Rápido)', quantity: 34 },
      { value: 'speed', label: 'Speed', quantity: 20 },
      { value: 'knit', label: 'Knit', quantity: 12 },
    ],
  },
];

/* `utils/colorSwatches` da origem: o default e a resolução (direta, composta, por palavra) */
const AMOSTRAS: [string, string][] = [
  ['Marinho', '#293C71'],
  ['Bege', '#C1B9B0'],
  ['Vermelho', '#ff0000'],
  ['Mostarda', '#CEA436'],
  ['Rose', '#fbc398'],
  ['Marrom', '#964b00'],
  ['Verde', '#008000'],
  ['Chumbo', '#595D60'],
  ['Gelo', '#C6C3C9'],
  ['Caqui', '#483B34'],
  ['Preto', '#000'],
  ['Bordô', '#5C1A2E'],
  ['Branco', '#FFFFFF'],
  ['Cinza', '#808080'],
];
const normalizarCor = (raw: string) =>
  raw
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const MAPA_AMOSTRAS = new Map(AMOSTRAS.map(([n, h]) => [normalizarCor(n), h]));
function amostraDe(label: string, value: string): string | null {
  const direta =
    MAPA_AMOSTRAS.get(normalizarCor(label)) ??
    MAPA_AMOSTRAS.get(normalizarCor(value));
  if (direta) return direta;
  const partes = label
    .split(/\s*[/|+]\s*|\s+e\s+/i)
    .map(p => MAPA_AMOSTRAS.get(normalizarCor(p)))
    .filter(Boolean) as string[];
  if (partes.length > 1) {
    const passo = 100 / partes.length;
    return `linear-gradient(135deg, ${partes.map((c, i) => `${c} ${i === 0 ? '0' : `${(passo * i).toFixed(2)}%`} ${i === partes.length - 1 ? '100%' : `${(passo * (i + 1)).toFixed(2)}%`}`).join(', ')})`;
  }
  if (partes.length === 1) return partes[0];
  for (const palavra of normalizarCor(label).split(' ')) {
    const achou = MAPA_AMOSTRAS.get(palavra);
    if (achou) return achou;
  }
  return null;
}

const ehFaixa = (f: Faceta) => !!f.min && !!f.max;
const ehTamanho = (f: Faceta) =>
  /tamanho|size|numera/i.test(`${f.key} ${f.label}`);
const ehCor = (f: Faceta) => /\bcor\b|color/i.test(`${f.key} ${f.label}`);
const brl = (v: number) =>
  v.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });


const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

const HeartIcon = () => (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5802 1.25524C13.787 2.42178 13.8332 4.29889 12.6852 5.5196L6.93292 11.6357L1.18142 5.51958C0.033424 4.29887 0.0796571 2.42174 1.28642 1.25519C2.63385 -0.0473233 4.85296 0.0716979 6.04335 1.51009L6.93332 2.58508L7.82253 1.50997C9.01291 0.0715756 11.2328 -0.0472817 12.5802 1.25524Z" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * `molecules/ColumnToggle06` — os dois botões de densidade.
 *
 * Divergência de IMPLEMENTAÇÃO em relação à origem, com o mesmo resultado no DOM:
 * lá o toggle é uma molécula que o MainCategory06 e o override ProductGallery06
 * renderizam, sem acesso ao estado da listagem, então escreve `data-cols-06`
 * imperativamente via `closest('[data-fs-product-listing]')`.
 * Aqui o CategoryMain é dono da árvore inteira, então o estado sobe para ele e o
 * atributo sai no JSX — o CSS que reage é exatamente o mesmo
 * (`[data-fs-product-listing][data-cols-06='less'] [data-fs-product-grid]`).
 */
function ColumnToggle({ menos, onChange }: { menos: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className={styles.colToggle} data-fs-column-toggle data-role="col-toggle">
      <button
        type="button"
        aria-pressed={menos}
        aria-label="Menos colunas"
        className={`${styles.colBtn}${menos ? ` ${styles.colBtnActive}` : ''}`}
        onClick={() => onChange(true)}
      >
        <span className={styles.icoBars} aria-hidden="true"><i /><i /><i /></span>
        <span className={styles.icoDots3} aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => <i key={i} />)}
        </span>
      </button>
      <button
        type="button"
        aria-pressed={!menos}
        aria-label="Mais colunas"
        className={`${styles.colBtn}${!menos ? ` ${styles.colBtnActive}` : ''}`}
        onClick={() => onChange(false)}
      >
        <span className={styles.icoDots2} aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => <i key={i} />)}
        </span>
        <span className={styles.icoDots4} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => <i key={i} />)}
        </span>
      </button>
    </div>
  );
}

/** `molecules/ProductCard06` — o card da grade, com carrossel de fotos e dots. */
function Card({ p, index }: { p: Produto; index: number }) {
  /* a camada de hover abre na SEGUNDA foto, como na origem (hoverIdx = 1) */
  const [hoverIdx, setHoverIdx] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [fav, setFav] = useState(false);

  const temDesconto = !!p.precoDe && p.precoDe > p.preco;
  const flags = [p.flag || (temDesconto ? `OFF ${Math.round(((p.precoDe! - p.preco) / p.precoDe!) * 100)}%` : '')].filter(Boolean);

  return (
    <section className={styles.card} data-role="card" itemScope itemType="https://schema.org/Product">
      <div className={styles.cardInner}>
        <div className={`${styles.imgZone} ${styles.imgZoneDots}`}>
          <a href="#" className={styles.imgLink}>
            <div className={styles.imgWrap}>
              <img
                className={styles.cardImg}
                data-role="card-img"
                src={p.imagens[imgIdx] ?? p.imagens[0]}
                alt={p.nome}
                width={500}
                height={500}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
              <div
                className={styles.hoverTrack}
                style={{ transform: `translateX(-${hoverIdx * 100}%)` }}
                aria-hidden="true"
              >
                {p.imagens.map((url, i) => (
                  <span key={i} className={styles.hoverSlide}>
                    {i === hoverIdx && (
                      <img src={url} alt="" width={500} height={500} loading="lazy" decoding="async" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </a>
          <button
            type="button"
            className={`${styles.imgNav} ${styles.imgNavPrev}`}
            onClick={() => setHoverIdx(i => Math.max(1, i - 1))}
            disabled={hoverIdx <= 1}
            aria-label="Imagem anterior"
          />
          <button
            type="button"
            className={`${styles.imgNav} ${styles.imgNavNext}`}
            onClick={() => setHoverIdx(i => Math.min(p.imagens.length - 1, i + 1))}
            disabled={hoverIdx >= p.imagens.length - 1}
            aria-label="Próxima imagem"
          />
          <div className={styles.imgDots} role="group" aria-label="Fotos do produto">
            {p.imagens.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.imgDot}${i === imgIdx ? ` ${styles.imgDotActive}` : ''}`}
                onClick={() => setImgIdx(i)}
                aria-label={`Ver foto ${i + 1} de ${p.imagens.length}`}
                aria-current={i === imgIdx ? 'true' : undefined}
              >
                <span className={styles.imgDotBar} aria-hidden="true" />
              </button>
            ))}
          </div>
          {flags.length > 0 && (
            <div className={styles.flagRow}>
              {flags.map(text => (
                <p key={text} className={styles.flag} data-role="card-flag">{text}</p>
              ))}
            </div>
          )}
          <button
            type="button"
            className={styles.addCart}
            aria-haspopup="dialog"
            aria-label="Escolher tamanho e adicionar ao carrinho"
          />
        </div>

        <div className={styles.infoCol}>
          <div className={styles.nameSkuBox}>
            <a href="#" className={styles.infoLink}>
              <div className={styles.nameRow}>
                <h3 className={styles.name} data-role="card-name" itemProp="name">{p.nome}</h3>
              </div>
            </a>
            <div className={styles.skuRow}>
              {TAMANHOS.map(t => (
                <button
                  key={t}
                  type="button"
                  className={styles.skuChip}
                  aria-label={`Adicionar tamanho ${t} ao carrinho`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <a href="#" className={styles.infoLink}>
            <div className={styles.priceWrap}>
              <div className={styles.price} data-has-list-price={temDesconto || undefined}>
                {temDesconto && (
                  <span className={styles.listPrice} data-role="list-price">{money(p.precoDe!)}</span>
                )}
                <span className={styles.priceLine} data-role="card-price">
                  {money(p.preco)}
                  <span className={styles.priceOu}>{' ou'}</span>
                </span>
              </div>
              <div className={styles.instRow}>
                <span className={styles.installments} data-role="card-inst">
                  {`${p.parcelaN}X de ${money(p.parcelaValor)}`}
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <button
        className={styles.wishlist}
        data-role="card-wish"
        onClick={() => setFav(f => !f)}
        aria-label={fav ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
        aria-pressed={fav}
      >
        <HeartIcon />
      </button>
    </section>
  );
}

/** `RangeField` do FilterDrawer06: dois <input type="range"> reais e o trilho preenchido por %. */
function FaixaDePreco({
  faceta,
  onCommit,
}: {
  faceta: Faceta;
  onCommit: (key: string, min: number, max: number) => void;
}) {
  const absMin = Math.floor(faceta.min?.absolute ?? 0);
  const absMax = Math.ceil(faceta.max?.absolute ?? 0);
  const [de, setDe] = useState(Math.floor(faceta.min?.selected ?? absMin));
  const [ate, setAte] = useState(Math.ceil(faceta.max?.selected ?? absMax));

  useEffect(() => {
    setDe(Math.floor(faceta.min?.selected ?? absMin));
    setAte(Math.ceil(faceta.max?.selected ?? absMax));
  }, [faceta.min?.selected, faceta.max?.selected, absMin, absMax]);

  const span = Math.max(absMax - absMin, 1);
  const commit = () => onCommit(faceta.key, de, ate);

  return (
    <div className={styles.range}>
      <div className={styles.rangeTrack}>
        <span
          className={styles.rangeFill}
          style={{
            left: `${((de - absMin) / span) * 100}%`,
            right: `${((absMax - ate) / span) * 100}%`,
          }}
          aria-hidden="true"
        />
        <input
          className={`${styles.rangeInput} ${styles.rangeInputFrom}`}
          type="range"
          min={absMin}
          max={absMax}
          value={de}
          aria-label={`Preço mínimo (${brl(de)})`}
          onChange={e => setDe(Math.min(Number(e.target.value), ate))}
          onMouseUp={commit}
          onTouchEnd={commit}
          onKeyUp={commit}
        />
        <input
          className={`${styles.rangeInput} ${styles.rangeInputTo}`}
          type="range"
          min={absMin}
          max={absMax}
          value={ate}
          aria-label={`Preço máximo (${brl(ate)})`}
          onChange={e => setAte(Math.max(Number(e.target.value), de))}
          onMouseUp={commit}
          onTouchEnd={commit}
          onKeyUp={commit}
        />
      </div>
      <div className={styles.rangeLabels}>
        <span>De: {brl(de)}</span>
        <span>Até: {brl(ate)}</span>
      </div>
    </div>
  );
}

/**
 * `molecules/FilterDrawer06` — o drawer direito de 400px (tela cheia até 960px):
 * cabeçalho "Filtros" + "Limpar (N)" + X, ORDENAR POR em caixas de seleção única,
 * FILTRAR POR com os grupos em acordeão (abertos por padrão), sem rodapé — cada
 * escolha vale na hora, como na origem. ESC, clique no fundo, foco de entrada e
 * saída e o ciclo de Tab também são os da origem; a trava de rolagem vai no
 * <html>, como nos outros drawers do catálogo.
 */
function FilterDrawer({
  open,
  onClose,
  sort,
  onSort,
  isSelected,
  onToggleFacet,
  onSetRange,
  activeCount,
  onClearAll,
  precoSel,
}: {
  open: boolean;
  onClose: () => void;
  sort: string;
  onSort: (v: string) => void;
  isSelected: (key: string, value: string) => boolean;
  onToggleFacet: (key: string, value: string) => void;
  onSetRange: (key: string, min: number, max: number) => void;
  activeCount: number;
  onClearAll: () => void;
  precoSel: { min: number; max: number } | null;
}) {
  const [fechados, setFechados] = useState<Record<string, boolean>>({});
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const ultimoFoco = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /* o range mostra a faixa aplicada; "Limpar" volta aos limites */
  const facetas = useMemo(
    () =>
      FACETAS.map(f =>
        ehFaixa(f)
          ? {
              ...f,
              min: {
                absolute: f.min!.absolute,
                selected: precoSel?.min ?? f.min!.absolute,
              },
              max: {
                absolute: f.max!.absolute,
                selected: precoSel?.max ?? f.max!.absolute,
              },
            }
          : f
      ),
    [precoSel]
  );

  useEffect(() => {
    if (!open) return;
    ultimoFoco.current = document.activeElement as HTMLElement;
    const quadro = requestAnimationFrame(() => closeRef.current?.focus());
    const antes = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const focaveis = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focaveis?.length) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      } else if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(quadro);
      document.removeEventListener('keydown', onKeyDown);
      document.documentElement.style.overflow = antes;
      ultimoFoco.current?.focus?.();
    };
  }, [open]);

  return (
    <>
      <div
        className={`${styles.overlay}${open ? ` ${styles.open}` : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        className={`${styles.drawer}${open ? ` ${styles.open}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={ROTULO_FILTRO}
        data-role="filter-drawer"
      >
        <div className={styles.head}>
          <span className={styles.headTitle}>{ROTULO_FILTRO}</span>
          {activeCount > 0 && (
            <button
              type="button"
              className={styles.clear}
              onClick={onClearAll}
              data-role="filter-clear"
            >
              {ROTULO_LIMPAR} ({activeCount})
            </button>
          )}
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Fechar filtros"
            data-role="filter-close"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <fieldset className={styles.sortBlock}>
            <legend className={styles.blockLabel}>{ROTULO_ORDENAR}:</legend>
            <div className={styles.sortOptions}>
              {ORDENACOES.map(opt => (
                <label key={opt.value} className={styles.sortOption}>
                  <input
                    type="radio"
                    name="filter-sort"
                    className={styles.srOnly}
                    checked={sort === opt.value}
                    onChange={() => onSort(opt.value)}
                  />
                  <span className={styles.box} aria-hidden="true" />
                  <span className={styles.optionText}>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <span className={styles.blockLabel}>{ROTULO_FILTRAR}:</span>

          {facetas.map(faceta => {
            const aberto = !fechados[faceta.key];
            const painel = `filter-${faceta.key}`;
            const variante = ehTamanho(faceta)
              ? 'chips'
              : ehCor(faceta)
                ? 'color'
                : 'list';
            return (
              <div key={faceta.key} className={styles.group}>
                <button
                  type="button"
                  className={`${styles.groupHead}${aberto ? ` ${styles.groupOpen}` : ''}`}
                  aria-expanded={aberto}
                  aria-controls={painel}
                  onClick={() =>
                    setFechados(prev => ({ ...prev, [faceta.key]: aberto }))
                  }
                >
                  <span>{faceta.label}</span>
                  <svg
                    className={styles.chevron}
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1L6 7L11 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {aberto && (
                  <div
                    id={painel}
                    className={styles.panel}
                    data-facet-style={variante}
                  >
                    {ehFaixa(faceta) ? (
                      <FaixaDePreco faceta={faceta} onCommit={onSetRange} />
                    ) : (
                      <ul className={styles.values}>
                        {(faceta.values ?? []).map(v => {
                          const cor =
                            variante === 'color'
                              ? amostraDe(v.label, v.value)
                              : null;
                          return (
                            <li key={v.value} className={styles.valueItem}>
                              <label className={styles.value}>
                                <input
                                  type="checkbox"
                                  className={styles.srOnly}
                                  checked={isSelected(faceta.key, v.value)}
                                  onChange={() =>
                                    onToggleFacet(faceta.key, v.value)
                                  }
                                />
                                {variante === 'list' && (
                                  <span
                                    className={styles.checkbox}
                                    aria-hidden="true"
                                  />
                                )}
                                {variante === 'color' && (
                                  <span
                                    className={styles.swatch}
                                    data-swatch={cor ? undefined : 'unknown'}
                                    style={
                                      cor ? { background: cor } : undefined
                                    }
                                    aria-hidden="true"
                                  />
                                )}
                                <span className={styles.valueText}>
                                  {v.label}
                                </span>
                                {variante === 'list' &&
                                  typeof v.quantity === 'number' && (
                                    <span className={styles.qty}>
                                      ({v.quantity})
                                    </span>
                                  )}
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function CategoryMain() {
  // densidade do grid: `false` = 4 col no desktop / 2 no mobile (padrão da origem);
  // `true` = 3 / 1. Ver ColumnToggle acima.
  const [menosColunas, setMenosColunas] = useState(false);

  /* estado de busca do MainCategory06 (lá é o useSearch; aqui, local): ordenação,
     facets marcados ({key, value}) e a faixa de preço, que conta como um facet */
  const [filtroAberto, setFiltroAberto] = useState(false);
  const [ordem, setOrdem] = useState('orders_desc');
  const [marcados, setMarcados] = useState<{ key: string; value: string }[]>(
    []
  );
  const [preco, setPreco] = useState<{ min: number; max: number } | null>(null);
  const ativos = marcados.length + (preco ? 1 : 0);
  const marcado = (key: string, value: string) =>
    marcados.some(f => f.key === key && f.value === value);
  const alternar = (key: string, value: string) =>
    setMarcados(prev =>
      prev.some(f => f.key === key && f.value === value)
        ? prev.filter(f => !(f.key === key && f.value === value))
        : [...prev, { key, value }]
    );
  const limpar = () => {
    setMarcados([]);
    setPreco(null);
  };


  /* a contagem mora na trilha (countInBreadcrumb), como na origem */
  const contagem = (extra?: string) => (
    <span className={`${styles.count}${extra ? ` ${extra}` : ''}`} data-role="plp-count">
      {TOTAL} Produtos encontrados
    </span>
  );

  return (
    <>
    {/* wrapper só do catálogo: carrega o container-type das @container */}
    <div className={styles.plp06Wrap}>
      <div className={`${styles.productGallery06} ${styles.plp06Root}`}>
        <nav className={styles.breadcrumb06} aria-label="Trilha de navegação" data-role="breadcrumb">
          <div className={styles.breadcrumb06Inner}>
            <a className={styles.crumbHome} href="/">Home</a>
            {TRILHA.map((c, i) => {
              const ultimo = i === TRILHA.length - 1;
              return (
                <span key={i} className={styles.crumbSeg}>
                  <span className={styles.crumbSep} aria-hidden="true">
                    <svg width="8" height="8" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {ultimo ? (
                    <span className={`${styles.crumbLink} ${styles.crumbTerm}`} aria-current="page">{c.name}</span>
                  ) : (
                    <a className={styles.crumbLink} href={c.item}>{c.name}</a>
                  )}
                </span>
              );
            })}
          </div>
          {contagem(styles.countInTrail)}
        </nav>

        <section className={styles.categoryTitle06} data-fs-category-title>
          <h1 className={styles.title} data-role="plp-title">{TITULO}</h1>
          {contagem(styles.countInTitle)}
        </section>

        <section
          data-fs-product-listing
          data-testid="product-gallery"
          data-cols-06={menosColunas ? 'less' : 'default'}
        >
          <div data-fs-product-listing-content-grid data-fs-content="product-gallery">
            <div data-fs-product-listing-sort data-role="toolbar">
              <ColumnToggle menos={menosColunas} onChange={setMenosColunas} />
              <button
                type="button"
                data-fs-button
                data-testid="open-filter-button"
                data-role="filter-btn"
                onClick={() => setFiltroAberto(true)}
                aria-haspopup="dialog"
              >
                <span data-fs-button-wrapper>
                  {ROTULO_FILTRO}{ativos > 0 ? ` (${ativos})` : ''}
                </span>
              </button>
            </div>

            <div data-fs-product-listing-results>
              <ul data-fs-product-grid data-role="grid">
                {PRODUTOS.map((p, i) => (
                  <li key={p.id} data-fs-product-grid-item data-role="grid-item">
                    <Card p={p} index={i} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>

    {/* Fora da .plp06Wrap: o container-type dela é containment de layout, e um
        `position: fixed` lá dentro mediria pela seção, não pela janela. */}
    <FilterDrawer
      open={filtroAberto}
      onClose={() => setFiltroAberto(false)}
      sort={ordem}
      onSort={setOrdem}
      isSelected={marcado}
      onToggleFacet={alternar}
      onSetRange={(_key, min, max) => setPreco({ min, max })}
      activeCount={ativos}
      onClearAll={limpar}
      precoSel={preco}
    />
    </>
  );
}

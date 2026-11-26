'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

import styles from './index.module.css';
import {
  FONTES_11,
  referencia11,
} from '@/components/templates/common/template_11/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';
import type { ProdutoNormal } from '@/utils/produtos';

/**
 * Espelha `organisms/ProductDetails11` do faststore.starter (família 11, Grade; desenho
 * `ProductInfo11` / `-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o `mock.ts` de lá,
 * já resolvido como o starter resolve: 6 fotos de uma cor só (os blocos cinza em data URI
 * do mock) com "01 / 06" e a régua de miniaturas, "Ref. N°024", "N°024 · Iluminação",
 * 10x sem juros e o Pix da entrada Pix do plano, o resumo (descrição de SEO), o
 * Acabamento por nome (Preto fosco ativo), as 4 especificações do CMS, o frete por CEP
 * (as opções de exemplo depois do "Calcular") e os 3 selos de confiança.
 *
 * O ramo esgotado é o de lá: acabamento sem estoque sai riscado, o 2º eixo (tamanho,
 * voltagem…; o mock de lá não tem, então `AXIS` nasce vazio) risca a opção sem estoque
 * (`pdp-axis-out`) com a nota "<opções> esgotado. Avise-me quando chegar", e com o SKU da
 * página sem estoque as parcelas, o Pix e a quantidade somem, o botão de compra vira
 * "Avise-me" e o formulário (`pdp-notify`) abre. `PALCO_ESGOTADO` faz o papel do
 * `stageSoldOut` do palco (`ProductDetails11Esgotado`): ligado, o canvas mostra esse estado.
 *
 * Sai: `usePDP`, `useBuyButton`, `useWishList` (o coração só alterna no estado local), a
 * simulação de frete, a mutation do "Avise-me" (o envio dá sucesso local, como no palco
 * de lá) e o analytics. Ficam de fora, porque com o mock do starter nunca renderizam: o
 * guia de medidas (sem a especificação) e o diálogo dele.
 *
 * Os rótulos, as opções (`highlightSpecs`, `showSummary`, `hideQuantity`) e os selos de
 * confiança são do CMS e vêm do `useConteudoDaSecao`; produto, preço, fotos e variações são
 * os de exemplo até o produto em destaque da loja existir (fase de produtos). O tipo não
 * traz `sizeGuideLabel`: com o produto de exemplo não há especificação de guia de medidas,
 * então o link e o diálogo dele não renderizam (o 1-conteudo o lista como não desenhado).
 */

const BRL = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const money = (n: number) => `R$ ${BRL.format(n)}`;

/** O mesmo `formatShippingPrice` do `utils/shipping` do starter (centavos). */
const shipPrice = (cents: number) =>
  cents > 0
    ? (cents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : 'Grátis';
/** O mesmo `formatShippingEstimate` do `utils/shipping` do starter ("5bd" → "Até 5 dias úteis"). */
const shipEta = (estimate: string) => {
  const m = /^(\d+)\s*(bd|d|h|m)$/i.exec(estimate.trim());
  if (!m) return '';
  const UN: Record<string, [string, string]> = {
    bd: ['dia útil', 'dias úteis'],
    d: ['dia', 'dias'],
    h: ['hora', 'horas'],
    m: ['minuto', 'minutos'],
  };
  const n = Number(m[1]);
  const [s, p] = UN[m[2].toLowerCase()];
  return n === 0 ? 'Hoje' : `Até ${n} ${n === 1 ? s : p}`;
};
/** O mesmo `formatPostalCode` do starter: "01310100" → "01310-100". */
const formatPostalCode = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

const block = (hex: string, size: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${hex}"/></svg>`
  )}`;

type TrustIcon = 'truck' | 'exchange' | 'shield' | 'card' | 'invoice';

/** O conteúdo da seção: os campos do `section.schema` do ProductInfo11. */
interface ProductInfo11Conteudo {
  refLabel?: string;
  /** Especificações da coluna de compra, pelo nome e na ordem ("Dimensões, Material"). */
  highlightSpecs?: string;
  showSummary?: boolean;
  soldOutText?: string;
  notifyLabel?: string;
  notifyNamePlaceholder?: string;
  notifyEmailPlaceholder?: string;
  notifySubmitLabel?: string;
  notifySuccess?: string;
  buyLabel?: string;
  mobileBuyLabel?: string;
  soldOutButtonLabel?: string;
  favoriteLabel?: string;
  mobileFavoriteLabel?: string;
  hideQuantity?: boolean;
  shippingLabel?: string;
  cepPlaceholder?: string;
  cepButtonLabel?: string;
  cepHelpLabel?: string;
  cepHelpUrl?: string;
  trustItems: { icon?: TrustIcon; title?: string; text?: string }[];
}

/* ── rótulos (o mock.ts de lá; o CS muda pelo useConteudoDaSecao) ── */
const MOCK: ProductInfo11Conteudo = {
  refLabel: 'Ref.',
  highlightSpecs: 'Dimensões, Material, Potência, Garantia',
  showSummary: true,
  soldOutText: 'esgotado.',
  notifyLabel: 'Avise-me quando chegar',
  notifyNamePlaceholder: 'Seu nome',
  notifyEmailPlaceholder: 'Seu e-mail',
  notifySubmitLabel: 'Avisar',
  notifySuccess: 'Pronto. Avisamos por e-mail quando o produto voltar.',
  buyLabel: 'Adicionar ao carrinho',
  mobileBuyLabel: 'Adicionar',
  soldOutButtonLabel: 'Avise-me quando chegar',
  favoriteLabel: 'Adicionar aos favoritos',
  mobileFavoriteLabel: 'Favoritar',
  shippingLabel: 'Calcular frete',
  cepPlaceholder: '00000-000',
  cepButtonLabel: 'Calcular',
  cepHelpLabel: 'Não sei meu CEP',
  cepHelpUrl: 'https://buscacepinter.correios.com.br/app/endereco/index.php',
  trustItems: [
    {
      icon: 'truck',
      title: 'Entrega em 48h nas capitais',
      text: 'Frete grátis acima de R$ 500',
    },
    { icon: 'exchange', title: 'Troca em 30 dias', text: 'Coleta no endereço' },
    { icon: 'shield', title: 'Pagamento seguro', text: 'Cartão, Pix ou boleto' },
  ],
};

/** Como o starter compara nomes: sem acento, sem caixa, sem espaço nas pontas. */
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

/* ── produto de exemplo (o mock.ts de lá, já resolvido) ── */
const PRODUCT_NAME = 'Luminária de Mesa Arco';
const SKU = '024';
const PRICE = 890;
const BEST = {
  installmentNumber: 10,
  installmentValue: 89,
  installmentInterest: 0,
};
const PIX = 845.5;
const SUMMARY =
  'Base em aço com braço articulado e cúpula em alumínio repuxado. Luz direcionável para leitura e trabalho.';
const CRUMBS = [
  { item: '#', name: 'Iluminação' },
  { item: '#', name: 'Mesa' },
];
const IMAGES = [
  '#EDEDED',
  '#E2E2E2',
  '#D9D9D9',
  '#F0F0F0',
  '#E6E6E6',
  '#DCDCDC',
].map((hex, i) => ({
  url: block(hex, 800) + `#${i}`,
  alternateName: `Luminária de Mesa Arco — foto ${i + 1}`,
}));
/** O papel do `stageSoldOut` do palco: ligado, o canvas mostra o estado esgotado. */
const PALCO_ESGOTADO = false;
const COLOR_NAME = 'Acabamento';
const FINISHES = ['Preto fosco', 'Branco', 'Latão'];
/** Acabamentos sem estoque (o `produto(esgotados)` do mock de lá; o palco esgota o da página e o Latão). */
const ESGOTADOS: string[] = PALCO_ESGOTADO ? ['Preto fosco', 'Latão'] : [];
const COLORS = FINISHES.map((value, i) => ({
  value,
  available: !ESGOTADOS.includes(value),
  active: i === 0,
}));
/** O 2º eixo de variação (tamanho, voltagem…), na cor da página: o mock de lá não tem. */
const AXIS_NAME: string = '';
/** As especificações do produto de exemplo; `highlightSpecs` escolhe e ordena. */
const HIGHLIGHTS = [
  { name: 'Dimensões', value: '45 × 18 × 52 cm' },
  { name: 'Material', value: 'Aço e alumínio' },
  { name: 'Potência', value: 'LED 8 W · 2700 K' },
  { name: 'Garantia', value: '2 anos' },
];
const SHIPPING = [
  { id: 'normal', friendlyName: 'Normal', price: 2490, estimate: '5bd' },
  { id: 'expressa', friendlyName: 'Expressa', price: 4290, estimate: '2bd' },
];

/* ── o que a PDP desenha: o produto de exemplo ou o 1º da loja ── */
type OpcaoDaPdp = { label: string; available: boolean; sku?: string };
type VariacaoDaPdp = {
  /** '' = o rótulo do desenho. */
  name: string;
  tipo: 'texto' | 'cor' | 'imagem';
  options: OpcaoDaPdp[];
  /** A opção que nasce escolhida (a 1ª com estoque). */
  inicial: number;
};
type VistaDaPdp = {
  doLoja: boolean;
  name: string;
  sku: string;
  price: number;
  best: { installmentNumber: number; installmentValue: number; installmentInterest: number } | null;
  pix: number | null;
  summary: string;
  crumbs: { item: string; name: string }[];
  images: { url: string; alternateName: string }[];
  specs: { name: string; value: string }[];
  inStock: boolean;
  variacoes: VariacaoDaPdp[];
};

const EXEMPLO: VistaDaPdp = {
  doLoja: false,
  name: PRODUCT_NAME,
  sku: SKU,
  price: PRICE,
  best: BEST,
  pix: PIX,
  summary: SUMMARY,
  crumbs: CRUMBS,
  images: IMAGES,
  specs: HIGHLIGHTS,
  inStock: true,
  variacoes: [
    {
      name: COLOR_NAME,
      tipo: 'cor',
      options: COLORS.map(c => ({ label: c.value, available: c.available })),
      inicial: Math.max(0, COLORS.findIndex(c => c.active)),
    },
  ],
};

function daLoja(p: ProdutoNormal): VistaDaPdp {
  const fotos = p.images.length ? p.images : [block('#EDEDED', 800)];
  return {
    doLoja: true,
    name: p.name,
    sku: p.id.replace(/\D/g, ''),
    price: p.price,
    best: p.installments
      ? { installmentNumber: p.installments, installmentValue: p.installmentValue, installmentInterest: 0 }
      : null,
    pix: null,
    summary: p.description.split(/\n+/)[0]?.trim() ?? '',
    crumbs: [],
    images: fotos.map((url, i) => ({ url, alternateName: `${p.name} — foto ${i + 1}` })),
    specs: p.specs,
    inStock: p.inStock,
    variacoes: p.variants.map(v => ({
      name: v.name,
      tipo: v.tipo,
      options: v.options.map((o, i) => ({
        label: o.label || `Opção ${i + 1}`,
        available: o.available,
      })),
      inicial: Math.max(0, v.options.findIndex(o => o.available)),
    })),
  };
}

const two = (n: number) => String(n).padStart(2, '0');

const svg = (
  size: number,
  body: React.ReactNode,
  extra: Record<string, unknown> = {}
) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
    {...extra}
  >
    {body}
  </svg>
);
const HEART =
  'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';
const ARROW_NEXT = <path d="M5 12h14M13 6l6 6-6 6" />;
const ARROW_PREV = <path d="M19 12H5M11 6l-6 6 6 6" />;
const TRUST_ICONS: Record<TrustIcon, React.ReactNode> = {
  truck: (
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 9h12a4 4 0 0 1 0 8H8" />
      <path d="m8 5-4 4 4 4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  card: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="M3 10h18" />
    </>
  ),
  invoice: (
    <>
      <path d="M6 3h12v18H6z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
};

export default function ProductInfo11() {
  // `L`, o nome de antes, para o markup abaixo continuar igual ao de lá.
  const { highlightSpecs, showSummary, hideQuantity, trustItems, ...L } =
    useConteudoDaSecao(MOCK);
  const uid = useId();
  /** A opção escolhida de cada variação (índice), quando o cliente clicou. */
  const [escolhas, setEscolhas] = useState<Record<number, number>>({});
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyTarget, setNotifyTarget] = useState<string | null>(null);
  const [notifyName, setNotifyName] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyOk, setNotifyOk] = useState(false);
  const notifyRef = useRef<HTMLFormElement>(null);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [cep, setCep] = useState('');
  const [cepSent, setCepSent] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  const daLojaLista = useProdutosDaLoja();
  const vista = useMemo(
    () => (daLojaLista ? daLoja(daLojaLista[0]) : EXEMPLO),
    [daLojaLista]
  );
  // Outro produto: as escolhas e o slide do anterior não valem mais.
  useEffect(() => {
    setEscolhas({});
    setSlide(0);
    setNotifyTarget(null);
  }, [vista]);

  /* ── variações: cada uma é um bloco; a 1ª de texto é o eixo (estoque, avise-me) ── */
  const selIdx = (vi: number) =>
    escolhas[vi] ?? vista.variacoes[vi]?.inicial ?? 0;
  const escolher = (vi: number, oi: number) =>
    setEscolhas(e => ({ ...e, [vi]: oi }));
  const eixoVi = vista.variacoes.findIndex(v => v.tipo === 'texto');
  const eixo = eixoVi >= 0 ? vista.variacoes[eixoVi] : null;
  const AXIS_NAME_V = eixo?.name || AXIS_NAME;
  const AXIS_V = (eixo?.options ?? []).map(o => ({
    value: o.label,
    available: o.available,
  }));
  const selected = eixo ? AXIS_V[selIdx(eixoVi)] : undefined;
  const activeAxis = selected?.value ?? null;
  const soldOutOptions = AXIS_V.filter(o => !o.available);
  // As demais variações: a opção escolhida de cada uma precisa ter estoque.
  const outrasOk = vista.variacoes.every(
    (v, vi) => vi === eixoVi || v.options[selIdx(vi)]?.available !== false
  );
  const inStock =
    vista.inStock && (eixo ? !!selected?.available : true) && outrasOk;
  const best = inStock ? vista.best : null;
  const pixValue = inStock ? vista.pix : null;
  const sku = vista.sku;

  /* ── avise-me: o envio dá sucesso local, como no palco de lá ── */
  const notifyFor =
    notifyTarget ?? (inStock ? soldOutOptions[0]?.value : activeAxis) ?? null;
  const openNotify = (value?: string | null, focus = false) => {
    setNotifyTarget(value ?? null);
    setNotifyOpen(true);
    setNotifyOk(false);
    if (focus) {
      window.setTimeout(() => {
        const el = notifyRef.current;
        el?.scrollIntoView({ block: 'center' });
        el?.querySelector('input')?.focus();
      }, 0);
    }
  };
  const onNotify = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifyOk(true);
  };
  const showNotify = notifyOpen || !inStock;

  const ref = referencia11(sku);
  const parent = vista.crumbs[vista.crumbs.length - 1];
  const crumbLabel = vista.crumbs.slice(-2)
    .map(c => c.name)
    .join(' / ');
  const colsClass = (n: number) => styles[`cols${Math.min(Math.max(n, 1), 3)}`];
  const shippingRows = cepSent ? SHIPPING : [];
  // No produto da loja, as quatro primeiras especificações do cadastro.
  const destaques = vista.doLoja
    ? vista.specs.slice(0, 4)
    : String(highlightSpecs ?? '')
    .split(',')
    .map(n => n.trim())
    .filter(Boolean)
    .map(n => vista.specs.find(h => norm(h.name) === norm(n)))
    .filter((h): h is VistaDaPdp['specs'][number] => !!h);

  const onRailScroll = () => {
    const el = railRef.current;
    if (el && el.clientWidth)
      setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i: number) => {
    const el = railRef.current;
    setSlide(i);
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'auto' });
  };
  const onCep = (e: React.FormEvent) => {
    e.preventDefault();
    setCepSent(true);
  };

  const buyButton = (extra: string, label?: string, mobile = false) =>
    inStock ? (
      <button
        type="button"
        className={`${styles.buy} ${extra}`}
        data-role="pdp-buy"
      >
        <span>{label || L.buyLabel}</span>
        {svg(18, ARROW_NEXT)}
      </button>
    ) : (
      <button
        type="button"
        className={`${styles.buy} ${extra}`}
        onClick={() => openNotify(activeAxis, mobile)}
        aria-expanded={showNotify}
        aria-controls={`${uid}-notify`}
        data-role="pdp-buy"
      >
        <span>{L.soldOutButtonLabel || L.notifyLabel}</span>
        {svg(18, ARROW_NEXT)}
      </button>
    );

  return (
    <div className={styles.productDetails11Box}>
      <link rel="stylesheet" href={FONTES_11} />
      <section
        className={styles.productDetails11}
        aria-label={vista.name}
        data-role="pdp-root"
      >
        <div className={styles.box}>
          {/* ── linha de cima: volta à categoria + referência ── */}
          <div className={styles.topRow} data-role="pdp-top">
            {parent && (
              <a
                className={styles.back}
                href={parent.item}
                data-role="pdp-category"
              >
                {svg(14, ARROW_PREV)}
                {crumbLabel}
              </a>
            )}
            <span className={styles.spacer} />
            <span className={styles.ref} data-role="pdp-code">
              {L.refLabel} {ref}
            </span>
          </div>

          <div className={styles.main}>
            {/* ── galeria (sem zoom, sem vídeo) ── */}
            <div className={styles.gallery} data-role="pdp-gallery">
              <div className={styles.stage}>
                <div
                  ref={railRef}
                  className={styles.rail}
                  onScroll={onRailScroll}
                >
                  {vista.images.map((img, i) => (
                    <div key={i} className={styles.photo}>
                      <img
                        src={img.url}
                        alt={img.alternateName}
                        width={800}
                        height={800}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </div>
                  ))}
                </div>
                <span
                  className={styles.counter}
                  aria-hidden="true"
                  data-role="pdp-counter"
                >
                  {two(slide + 1)} / {two(vista.images.length)}
                </span>
              </div>
              <div
                className={styles.thumbs}
                role="group"
                aria-label="Imagens do produto"
              >
                {vista.images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.thumb}${i === slide ? ` ${styles.thumbOn}` : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Imagem ${i + 1}`}
                    aria-current={i === slide ? 'true' : undefined}
                    data-role="pdp-thumb"
                  >
                    <img
                      src={img.url}
                      alt=""
                      width={120}
                      height={120}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className={styles.thumbNum}>{two(i + 1)}</span>
                  </button>
                ))}
              </div>
              <div className={styles.segments} aria-hidden="true">
                {vista.images.map((img, i) => (
                  <span
                    key={i}
                    className={i === slide ? styles.segmentOn : undefined}
                  />
                ))}
              </div>
            </div>

            {/* ── coluna de compra ── */}
            <div className={styles.info}>
              <div className={styles.head}>
                <span className={styles.meta} data-role="pdp-meta">
                  {[ref, vista.crumbs[0]?.name].filter(Boolean).join(' · ')}
                </span>
                <h1 className={styles.title} data-role="pdp-title">
                  {vista.name}
                </h1>
                <div className={styles.priceRow} data-role="pdp-prices">
                  <span className={styles.price} data-role="pdp-price">
                    {money(vista.price)}
                  </span>
                  {best && best.installmentNumber > 1 && (
                    <span
                      className={styles.installment}
                      data-role="pdp-installment"
                    >
                      ou {best.installmentNumber}x de{' '}
                      {money(best.installmentValue)}{' '}
                      {best.installmentInterest === 0
                        ? 'sem juros'
                        : 'com juros'}
                    </span>
                  )}
                </div>
                {pixValue !== null && (
                  <span className={styles.pix} data-role="pdp-pix">
                    {money(pixValue)} no Pix
                  </span>
                )}
                {showSummary && vista.summary && (
                  <p className={styles.summary} data-role="pdp-summary">
                    {vista.summary}
                  </p>
                )}
              </div>

              {vista.variacoes.map((v, vi) => {
                const atual = v.options[selIdx(vi)];
                if (v.tipo !== 'texto')
                  return (
                    <div
                      key={vi}
                      className={styles.group}
                      role="group"
                      aria-labelledby={`${uid}-var${vi}`}
                      data-role="pdp-colors"
                      data-variacao={v.tipo}
                    >
                      <span className={styles.legend}>
                        <span id={`${uid}-var${vi}`}>{v.name || COLOR_NAME}</span>
                        <span className={styles.legendValue}>{atual?.label}</span>
                      </span>
                      <div
                        className={`${styles.options} ${colsClass(v.options.length)}`}
                      >
                        {v.options.map((c, oi) => (
                          <a
                            key={oi}
                            className={`${styles.option}${c === atual ? ` ${styles.optionOn}` : ''}${
                              c.available ? '' : ` ${styles.optionOut}`
                            }`}
                            href={c === atual ? undefined : '#'}
                            aria-current={c === atual ? 'true' : undefined}
                            aria-label={
                              c.available ? undefined : `${c.label}, esgotado`
                            }
                            onClick={e => {
                              e.preventDefault();
                              escolher(vi, oi);
                            }}
                            data-role="pdp-swatch"
                          >
                            {c.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                const principal = vi === eixoVi;
                return (
                <div key={vi} className={styles.group} data-role="pdp-axis" data-variacao="texto">
                  <span className={styles.legend}>
                    <span id={`${uid}-axis${vi}`}>{v.name || AXIS_NAME}</span>
                    <span className={styles.legendValue}>{atual?.label}</span>
                  </span>
                  <div
                    className={`${styles.options} ${colsClass(v.options.length)}`}
                    role="group"
                    aria-labelledby={`${uid}-axis${vi}`}
                  >
                    {v.options.map((o, oi) =>
                      o.available ? (
                        <button
                          key={oi}
                          type="button"
                          className={`${styles.option}${o === atual ? ` ${styles.optionOn}` : ''}`}
                          aria-pressed={o === atual}
                          onClick={() => {
                            escolher(vi, oi);
                            setNotifyOpen(false);
                          }}
                          data-role="pdp-axis-option"
                        >
                          {o.label}
                        </button>
                      ) : (
                        <button
                          key={oi}
                          type="button"
                          className={`${styles.option} ${styles.optionOut}`}
                          aria-label={`${o.label}, esgotado`}
                          disabled
                          data-role="pdp-axis-out"
                        >
                          {o.label}
                        </button>
                      )
                    )}
                  </div>
                  {/* Bloco comum (não flex): o espaço entre o texto e o link não some. */}
                  {principal && soldOutOptions.length > 0 && inStock && (
                    <p
                      className={styles.soldNote}
                      data-role="pdp-sold-out-note"
                    >
                      {soldOutOptions.map(o => o.value).join(', ')}{' '}
                      {L.soldOutText}{' '}
                      <button
                        type="button"
                        className={styles.inlineLink}
                        onClick={() =>
                          openNotify(
                            soldOutOptions.length === 1
                              ? soldOutOptions[0].value
                              : null
                          )
                        }
                        aria-expanded={notifyOpen}
                        aria-controls={`${uid}-notify`}
                        data-role="pdp-notify-link"
                      >
                        {L.notifyLabel}
                      </button>
                    </p>
                  )}
                </div>
                );
              })}
              {/* ── quantidade + compra (desktop) e favoritar ── */}
              <div className={styles.buyBlock} data-role="pdp-buy-row">
                {!hideQuantity && inStock && (
                  <div
                    className={styles.qty}
                    role="group"
                    aria-label="Quantidade"
                  >
                    <button
                      type="button"
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      aria-label="Diminuir quantidade"
                      disabled={qty <= 1}
                    >
                      {svg(16, <path d="M5 12h14" />)}
                    </button>
                    <span className={styles.qtyValue} aria-live="polite">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(q => Math.min(99, q + 1))}
                      aria-label="Aumentar quantidade"
                    >
                      {svg(16, <path d="M12 5v14M5 12h14" />)}
                    </button>
                  </div>
                )}
                {buyButton(styles.onlyDesktop)}
                <button
                  type="button"
                  className={`${styles.fav}${isFav ? ` ${styles.favOn}` : ''}`}
                  onClick={() => setIsFav(v => !v)}
                  aria-pressed={isFav}
                  data-role="pdp-favorite"
                >
                  {svg(
                    16,
                    <path d={HEART} />,
                    isFav ? { fill: 'currentColor' } : {}
                  )}
                  <span className={styles.onlyDesktop}>{L.favoriteLabel}</span>
                  <span className={styles.onlyMobile}>
                    {L.mobileFavoriteLabel}
                  </span>
                </button>
                {showNotify && (
                  <form
                    id={`${uid}-notify`}
                    ref={notifyRef}
                    className={styles.notify}
                    onSubmit={onNotify}
                    data-role="pdp-notify"
                  >
                    {notifyOk ? (
                      <p className={styles.notifyOk} role="status">
                        {L.notifySuccess}
                      </p>
                    ) : (
                      <>
                        <p className={styles.notifyTitle}>
                          {L.notifyLabel}
                          {notifyFor ? ` · ${notifyFor}` : ''}
                        </p>
                        {inStock && soldOutOptions.length > 1 && (
                          <div
                            className={`${styles.options} ${colsClass(soldOutOptions.length)}`}
                            role="group"
                            aria-label={AXIS_NAME_V}
                          >
                            {soldOutOptions.map(o => (
                              <button
                                key={o.value}
                                type="button"
                                className={`${styles.option}${o.value === notifyFor ? ` ${styles.optionOn}` : ''}`}
                                aria-pressed={o.value === notifyFor}
                                onClick={() => setNotifyTarget(o.value)}
                              >
                                {o.value}
                              </button>
                            ))}
                          </div>
                        )}
                        <div className={styles.notifyFields}>
                          <label className={styles.field}>
                            <span className={styles.srOnly}>
                              {L.notifyNamePlaceholder}
                            </span>
                            <input
                              type="text"
                              autoComplete="name"
                              required
                              placeholder={L.notifyNamePlaceholder}
                              value={notifyName}
                              onChange={e => setNotifyName(e.target.value)}
                            />
                          </label>
                          <label className={styles.field}>
                            <span className={styles.srOnly}>
                              {L.notifyEmailPlaceholder}
                            </span>
                            <input
                              type="email"
                              autoComplete="email"
                              required
                              placeholder={L.notifyEmailPlaceholder}
                              value={notifyEmail}
                              onChange={e => setNotifyEmail(e.target.value)}
                            />
                          </label>
                          <button type="submit" className={styles.notifySubmit}>
                            {L.notifySubmitLabel}
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                )}
              </div>

              {destaques.length > 0 && (
                <dl className={styles.specs} data-role="pdp-highlights">
                  {destaques.map(h => (
                    <div key={h.name} className={styles.specRow}>
                      <dt>{h.name}</dt>
                      <dd>{h.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <form
                className={styles.shipping}
                onSubmit={onCep}
                data-role="pdp-shipping"
              >
                <label className={styles.shippingLabel} htmlFor={`${uid}-cep`}>
                  {L.shippingLabel}
                </label>
                <div className={styles.cepRow}>
                  <input
                    id={`${uid}-cep`}
                    className={styles.cepInput}
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={9}
                    placeholder={L.cepPlaceholder}
                    value={cep}
                    onChange={e => setCep(formatPostalCode(e.target.value))}
                  />
                  <button type="submit" className={styles.cepButton}>
                    {L.cepButtonLabel}
                  </button>
                </div>
                <a
                  className={`${styles.cepHelp} ${styles.onlyDesktop}`}
                  href={L.cepHelpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {L.cepHelpLabel}
                </a>
                {shippingRows.length > 0 && (
                  <ul
                    className={styles.shipList}
                    aria-live="polite"
                    data-role="pdp-shipping-options"
                  >
                    {shippingRows.map(o => (
                      <li key={o.id} className={styles.shipRow}>
                        <span className={styles.shipName}>
                          {o.friendlyName}
                        </span>
                        <span className={styles.shipEta}>
                          {shipEta(o.estimate).toLowerCase()}
                        </span>
                        <span className={styles.shipPrice}>
                          {shipPrice(o.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </form>
            </div>
          </div>

          {trustItems.length > 0 && (
            <ul className={styles.trust} data-role="pdp-trust">
              {trustItems.map((t, i) =>
                t.title || t.text ? (
                  <li key={`${t.title}-${i}`} className={styles.trustItem}>
                    {svg(22, TRUST_ICONS[t.icon ?? 'shield'] ?? TRUST_ICONS.shield, {
                      className: styles.trustIcon,
                    })}
                    <span className={styles.trustCopy}>
                      {t.title && (
                        <span className={styles.trustTitle}>{t.title}</span>
                      )}
                      {t.text && (
                        <span className={styles.trustText}>{t.text}</span>
                      )}
                    </span>
                  </li>
                ) : null
              )}
            </ul>
          )}
        </div>

        {/* ── barra de compra do mobile: o botão de compra do mobile (gruda no rodapé) ── */}
        <div className={styles.mobileBar} data-role="pdp-mobile-bar">
          <span className={styles.mobilePrice}>
            <span className={styles.mobilePriceValue}>{money(vista.price)}</span>
            {best && best.installmentNumber > 1 && (
              <span className={styles.mobileInstallment}>
                {best.installmentNumber}x {money(best.installmentValue)}
              </span>
            )}
          </span>
          {buyButton(styles.buyMobile, L.mobileBuyLabel, true)}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductInfo11.conteudoPadrao = MOCK;

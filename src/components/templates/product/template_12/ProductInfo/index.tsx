'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_12 } from '@/components/templates/common/template_12/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';
import type { ProdutoNormal } from '@/utils/produtos';

/**
 * Espelha `organisms/ProductDetails12` do faststore.starter (família 12, Suave; desenho
 * `ProductInfo12` / `-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars
 * de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o `mock.ts` de lá, já resolvido como o
 * starter resolve: as 4 fotos de uma cor só (os blocos em data URI do mock) com miniaturas e
 * pontos, a marca, "Cód. [0000000]" (o SKU do 30 ml), a nota 4,9 com 1.240 avaliações, 3x sem
 * juros (sem Pix: o plano do mock não tem a entrada Pix), o Tamanho em pílulas (30 ml ativo), as
 * 2 vantagens, o frete por CEP (as opções de exemplo depois do "Calcular") e os 3 acordeões (o 1º
 * aberto; Ingredientes e Benefícios vêm das especificações do produto).
 *
 * Sem trilha: a da página de produto é a da breadcrumb comum (Breadcrumb12), que as três
 * plataformas já põem na PDP. Decisão do usuário em 04/11/2026, para não duplicar.
 *
 * O ramo esgotado é o de lá: o tamanho sem estoque sai riscado (`pdp-axis-out`), a nota
 * "<opções> esgotado. Avise-me quando chegar" abre o formulário (`pdp-notify`), e sem
 * tamanho em estoque as parcelas, a quantidade e o preço da barra do mobile somem, o
 * botão de compra (coluna e barra) vira "Avise-me" e o formulário abre. `PALCO_ESGOTADO`
 * faz o papel do `stageSoldOut` do palco (`ProductDetails12Esgotado`): ligado, o canvas
 * mostra esse estado.
 *
 * Sai: `usePDP`, `useBuyButton`, `useWishList` (o coração só alterna no estado local), a
 * nota do Reviews and Ratings, a simulação de frete, a mutation do "Avise-me" (o envio dá
 * sucesso local, como no palco de lá) e o analytics. Ficam de fora, porque com o mock do
 * starter nunca renderizam: a variação de cor (o produto só tem Tamanho), o guia de
 * medidas e o diálogo dele (sem a especificação), o "Não sei meu CEP" (sem rótulo no mock)
 * e a linha do Pix. O "Não sei meu CEP" (`cepHelpLabel` + `cepHelpUrl`) passou a ser
 * desenhado quando o CS preenche os dois, como lá; o guia de medidas continua de fora (sua
 * imagem é uma especificação do produto de exemplo, que não a tem).
 *
 * Os rótulos, as vantagens e os acordeões são do CMS e vêm do `useConteudoDaSecao`. O
 * `specName` do acordeão (texto vindo de uma especificação do produto) fica fora do tipo: o
 * produto é o de exemplo, então o texto é o do `text`.
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

/* ── rótulos (o mock.ts de lá; o CS muda pelo useConteudoDaSecao) ── */
type PerkIcon = 'truck' | 'gift' | 'exchange' | 'shield' | 'card';

interface ProductInfo12Conteudo {
  codeLabel?: string;
  ratingCountLabel?: string;
  soldOutText?: string;
  notifyLabel?: string;
  notifyNamePlaceholder?: string;
  notifyEmailPlaceholder?: string;
  notifySubmitLabel?: string;
  notifySuccess?: string;
  buyLabel?: string;
  /** Vazio = o mesmo de `buyLabel`. */
  mobileBuyLabel?: string;
  soldOutButtonLabel?: string;
  favoriteLabel?: string;
  hideQuantity?: boolean;
  perks: { icon?: PerkIcon; text?: string }[];
  shippingLabel?: string;
  cepPlaceholder?: string;
  cepButtonLabel?: string;
  cepHelpLabel?: string;
  cepHelpUrl?: string;
  accordions: { title?: string; text?: string }[];
}

const MOCK: ProductInfo12Conteudo = {
  codeLabel: 'Cód.',
  ratingCountLabel: 'avaliações',
  soldOutText: 'esgotado.',
  notifyLabel: 'Avise-me quando chegar',
  notifyNamePlaceholder: 'Seu nome',
  notifyEmailPlaceholder: 'Seu e-mail',
  notifySubmitLabel: 'Avisar',
  notifySuccess: 'Pronto! Avisamos por e-mail quando o produto voltar.',
  buyLabel: 'Adicionar à sacola',
  mobileBuyLabel: 'Adicionar à sacola',
  soldOutButtonLabel: 'Avise-me quando chegar',
  favoriteLabel: 'Favoritar',
  shippingLabel: 'Calcular frete',
  cepPlaceholder: '00000-000',
  cepButtonLabel: 'Calcular',
  perks: [
    { icon: 'truck', text: 'Frete grátis acima de R$ 150' },
    { icon: 'gift', text: 'Amostra grátis no pedido' },
  ],
  accordions: [
    {
      title: 'Como usar',
      text: 'Aplique de 4 a 5 gotas no rosto limpo, pela manhã, antes do hidratante. Finalize com protetor solar.',
    },
    { title: 'Ingredientes', text: '[Lista INCI completa do produto]' },
    {
      title: 'Benefícios',
      text: '[Benefícios do produto, da especificação cadastrada]',
    },
  ],
};

/* ── produto de exemplo (o mock.ts de lá, já resolvido) ── */
const PRODUCT_NAME = 'Sérum Vitamina C 10%';
const BRAND = '[Sua Marca]';
const PRICE = 129.9;
const LIST_PRICE = 129.9;
const BEST = {
  installmentNumber: 3,
  installmentValue: 43.3,
  installmentInterest: 0,
};
const RATING = { average: 4.9, totalCount: 1240 };
const IMAGES = ['#F3DDD6', '#E6DFF0', '#F1E6D8', '#DCE6DA'].map((hex, i) => ({
  url: block(hex, 800) + `#${i}`,
  alternateName: `Sérum Vitamina C 10% — foto ${i + 1}`,
}));
/** O papel do `stageSoldOut` do palco: ligado, o canvas mostra o estado esgotado. */
const PALCO_ESGOTADO = false;
const AXIS_NAME = 'Tamanho';
const SIZES = ['30 ml', '50 ml'];
/** Tamanhos sem estoque (o `produto(esgotados)` do mock de lá; o palco esgota todos). */
const ESGOTADOS: string[] = PALCO_ESGOTADO ? SIZES : [];
const AXIS = SIZES.map((value, i) => ({
  value,
  available: !ESGOTADOS.includes(value),
  sku: `[000000${i}]`,
}));
const SHIPPING = [
  { id: 'normal', friendlyName: 'Normal', price: 1490, estimate: '5bd' },
  { id: 'expressa', friendlyName: 'Expressa', price: 2990, estimate: '2bd' },
];

/* ── o que a PDP desenha: o produto de exemplo ou o 1º da loja ── */
type OpcaoDaPdp = { label: string; available: boolean; sku?: string };
type VariacaoDaPdp = {
  /** '' = o rótulo do desenho ("Tamanho"). */
  name: string;
  tipo: 'texto' | 'cor' | 'imagem';
  options: OpcaoDaPdp[];
  /** A opção que nasce escolhida (a 1ª com estoque). */
  inicial: number;
};
type VistaDaPdp = {
  name: string;
  brand: string;
  sku: string;
  price: number;
  listPrice: number;
  best: { installmentNumber: number; installmentValue: number; installmentInterest: number } | null;
  rating: { average: number; totalCount: number } | null;
  inStock: boolean;
  images: { url: string; alternateName: string }[];
  variacoes: VariacaoDaPdp[];
};

const EXEMPLO: VistaDaPdp = {
  name: PRODUCT_NAME,
  brand: BRAND,
  sku: AXIS[0].sku,
  price: PRICE,
  listPrice: LIST_PRICE,
  best: BEST,
  rating: RATING,
  inStock: true,
  images: IMAGES,
  variacoes: [
    {
      name: AXIS_NAME,
      tipo: 'texto',
      options: AXIS.map(o => ({ label: o.value, available: o.available, sku: o.sku })),
      inicial: Math.max(0, AXIS.findIndex(o => o.available)),
    },
  ],
};

function daLoja(p: ProdutoNormal): VistaDaPdp {
  const fotos = p.images.length ? p.images : [block('#F3DDD6', 800)];
  return {
    name: p.name,
    brand: p.brand,
    sku: '',
    price: p.price,
    listPrice: p.listPrice,
    best: p.installments
      ? { installmentNumber: p.installments, installmentValue: p.installmentValue, installmentInterest: 0 }
      : null,
    rating: null,
    inStock: p.inStock,
    images: fotos.map((url, i) => ({ url, alternateName: `${p.name} — foto ${i + 1}` })),
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
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...extra}
  >
    {body}
  </svg>
);
const HEART =
  'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';
const STAR =
  'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';
const BAG = (
  <>
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </>
);
const MINUS = <path d="M5 12h14" />;
const PLUS = <path d="M12 5v14M5 12h14" />;
const PERK_ICONS: Record<PerkIcon, React.ReactNode> = {
  truck: (
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="5" rx="1" />
      <path d="M5 13v8h14v-8M12 8v13" />
      <path d="M12 8c-2-4-6-3-5 0M12 8c2-4 6-3 5 0" />
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
};

/** Cinco estrelas numa régua (viewBox do desenho): as que passam da nota ficam apagadas. */
const Stars = ({ avg, className }: { avg: number; className: string }) => (
  <svg
    className={className}
    viewBox="0 0 124 24"
    fill="currentColor"
    aria-hidden="true"
  >
    {[0, 1, 2, 3, 4].map(i => (
      <path
        key={i}
        d={STAR}
        transform={i ? `translate(${i * 25} 0)` : undefined}
        opacity={avg >= i + 0.5 ? 1 : 0.28}
      />
    ))}
  </svg>
);

export default function ProductInfo12() {
  const { perks, accordions, hideQuantity, cepHelpLabel, cepHelpUrl, ...L } =
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
  const [openAcc, setOpenAcc] = useState<number[]>([0]);
  const [isFav, setIsFav] = useState(false);
  const [cep, setCep] = useState('');
  const [cepSent, setCepSent] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  // Acordeão sem título ou sem texto não aparece, como no starter.
  const accItems = accordions
    .map(a => ({
      title: String(a.title ?? '').trim(),
      text: String(a.text ?? '').trim(),
    }))
    .filter(a => a.title && a.text);
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
  const images = vista.images;
  const price = vista.price;
  const listPrice = vista.listPrice;
  /* ── variações: cada uma é um bloco; a 1ª de texto é o eixo (estoque, SKU, avise-me) ── */
  const selIdx = (vi: number) =>
    escolhas[vi] ?? vista.variacoes[vi]?.inicial ?? 0;
  const escolher = (vi: number, oi: number) =>
    setEscolhas(e => ({ ...e, [vi]: oi }));
  const eixoVi = vista.variacoes.findIndex(v => v.tipo === 'texto');
  const eixo = eixoVi >= 0 ? vista.variacoes[eixoVi] : null;
  const AXIS_V = (eixo?.options ?? []).map(o => ({
    value: o.label,
    available: o.available,
    sku: o.sku,
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
  const sku = selected?.sku || vista.sku;
  const rating = vista.rating;
  const ratingAvg = rating?.average ?? 0;
  const ratingCount = rating?.totalCount ?? 0;
  const shippingRows = cepSent ? SHIPPING : [];

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
  const toggleAcc = (i: number) =>
    setOpenAcc(o => (o.includes(i) ? o.filter(x => x !== i) : [...o, i]));
  const avgText = ratingAvg.toFixed(1).replace('.', ',');
  const onCep = (e: React.FormEvent) => {
    e.preventDefault();
    setCepSent(true);
  };

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

  const buyButton = (extra: string, label?: string, mobile = false) =>
    inStock ? (
      <button
        type="button"
        className={`${styles.buy} ${extra}`}
        data-role="pdp-buy"
      >
        {svg(mobile ? 18 : 20, BAG)}
        <span>{label || L.buyLabel}</span>
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
      </button>
    );

  return (
    <div className={styles.productDetails12Box}>
      <section
        className={styles.productDetails12}
        aria-label={vista.name}
        data-role="pdp-root"
      >
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.inner}>
          <div className={styles.main}>
            {/* ── galeria (sem zoom, sem vídeo) ── */}
            <div className={styles.gallery} data-role="pdp-gallery">
              <div className={styles.stage}>
                <div
                  ref={railRef}
                  className={styles.rail}
                  onScroll={onRailScroll}
                >
                  {images.map((img, i) => (
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
                <button
                  type="button"
                  className={`${styles.fav}${isFav ? ` ${styles.favOn}` : ''}`}
                  onClick={() => setIsFav(v => !v)}
                  aria-pressed={isFav}
                  aria-label={L.favoriteLabel}
                  data-role="pdp-favorite"
                >
                  {svg(
                    20,
                    <path d={HEART} />,
                    isFav ? { fill: 'currentColor' } : {}
                  )}
                </button>
              </div>
              <div
                className={styles.thumbs}
                role="group"
                aria-label="Fotos do produto"
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.thumb}${i === slide ? ` ${styles.thumbOn}` : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Foto ${i + 1}`}
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
                  </button>
                ))}
              </div>
              <div
                className={styles.dots}
                role="group"
                aria-label="Fotos do produto"
              >
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`${styles.dot}${i === slide ? ` ${styles.dotOn}` : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Foto ${i + 1}`}
                    aria-current={i === slide ? 'true' : undefined}
                  >
                    <span />
                  </button>
                ))}
              </div>
            </div>

            {/* ── coluna de compra ── */}
            <div className={styles.info}>
              <div className={styles.head}>
                {vista.brand && (
                  <a className={styles.brand} href="#" data-role="pdp-brand">
                    {vista.brand}
                  </a>
                )}
                <h1 className={styles.title} data-role="pdp-title">
                  {vista.name}
                </h1>
                {sku && (
                  <span className={styles.code} data-role="pdp-code">
                    {L.codeLabel} {sku}
                  </span>
                )}
                {rating && (
                <a className={styles.rating} href="#" data-role="pdp-rating">
                  <Stars avg={ratingAvg} className={styles.stars} />
                  <span className={styles.srOnly}>Nota {avgText} de 5, </span>
                  <strong aria-hidden="true">{avgText}</strong>
                  <span className={styles.ratingCount}>
                    {ratingCount.toLocaleString('pt-BR')} {L.ratingCountLabel}
                  </span>
                </a>
                )}
              </div>

              <div className={styles.prices} data-role="pdp-prices">
                {listPrice > price && (
                  <span className={styles.listPrice} data-role="pdp-list-price">
                    <span className={styles.srOnly}>De </span>
                    {money(listPrice)}
                  </span>
                )}
                <span className={styles.price} data-role="pdp-price">
                  {money(price)}
                </span>
                {best && best.installmentNumber > 1 && (
                  <span
                    className={styles.installment}
                    data-role="pdp-installment"
                  >
                    ou {best.installmentNumber}x de{' '}
                    {money(best.installmentValue)}{' '}
                    {best.installmentInterest === 0 ? 'sem juros' : 'com juros'}
                  </span>
                )}
              </div>

              {vista.variacoes.map((v, vi) => {
                const atual = v.options[selIdx(vi)];
                const principal = vi === eixoVi;
                return (
              <div key={vi} className={styles.group} data-role="pdp-axis" data-variacao={v.tipo}>
                <p className={styles.legend}>
                  <span>
                    <strong id={`${uid}-axis${vi}`}>{v.name || AXIS_NAME}:</strong>{' '}
                    {atual?.label}
                  </span>
                </p>
                <div
                  className={styles.options}
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
                        className={`${styles.option} ${styles.optionOut}${o === atual ? ` ${styles.optionOn}` : ''}`}
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
                  <p className={styles.soldNote} data-role="pdp-sold-out-note">
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

              {/* ── quantidade + compra (desktop) ── */}
              <div className={styles.buyRow} data-role="pdp-buy-row">
                {inStock && !hideQuantity && (
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
                      {svg(16, MINUS, { strokeWidth: 2 })}
                    </button>
                    <span className={styles.qtyValue} aria-live="polite">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(q => Math.min(99, q + 1))}
                      aria-label="Aumentar quantidade"
                    >
                      {svg(16, PLUS, { strokeWidth: 2 })}
                    </button>
                  </div>
                )}
                {buyButton(styles.buyDesktop)}
              </div>

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
                          className={styles.options}
                          role="group"
                          aria-label={eixo?.name || AXIS_NAME}
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
                            className={styles.input}
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
                            className={styles.input}
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

              {perks.some(p => p.text) && (
                <ul className={styles.perks} data-role="pdp-perks">
                  {perks.map((p, i) =>
                    p.text ? (
                      <li key={`${p.text}-${i}`} className={styles.perk}>
                        {p.icon &&
                          PERK_ICONS[p.icon] &&
                          svg(18, PERK_ICONS[p.icon])}
                        {p.text}
                      </li>
                    ) : null
                  )}
                </ul>
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
                    className={`${styles.input} ${styles.cepInput}`}
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
                {cepHelpLabel && cepHelpUrl && (
                  <a
                    className={styles.cepHelp}
                    href={cepHelpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {cepHelpLabel}
                  </a>
                )}
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

              {accItems.length > 0 && (
                <div className={styles.accordions} data-role="pdp-accordions">
                  {accItems.map((a, i) => {
                    const open = openAcc.includes(i);
                    return (
                      <div key={`${a.title}-${i}`} className={styles.acc}>
                        <button
                          type="button"
                          className={styles.accBtn}
                          aria-expanded={open}
                          aria-controls={`${uid}-acc-${i}`}
                          id={`${uid}-accb-${i}`}
                          onClick={() => toggleAcc(i)}
                          data-role="pdp-accordion"
                        >
                          {a.title}
                          {svg(18, open ? MINUS : PLUS)}
                        </button>
                        <div
                          id={`${uid}-acc-${i}`}
                          role="region"
                          aria-labelledby={`${uid}-accb-${i}`}
                          className={styles.accPanel}
                          hidden={!open}
                        >
                          <p>{a.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── barra de compra do mobile: o botão de compra do mobile (gruda no rodapé) ── */}
        <div className={styles.mobileBar} data-role="pdp-mobile-bar">
          {inStock && (
            <span className={styles.mobilePrice}>
              <strong className={styles.mobilePriceValue}>
                {money(price)}
              </strong>
              {best && best.installmentNumber > 1 && (
                <span className={styles.mobileInstallment}>
                  {best.installmentNumber}x de {money(best.installmentValue)}
                </span>
              )}
            </span>
          )}
          {buyButton(styles.buyMobile, L.mobileBuyLabel, true)}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductInfo12.conteudoPadrao = MOCK;

'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';
import type { ProdutoNormal } from '@/utils/produtos';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductDetails10` do faststore.starter (família 10, Varejo;
 * desenho `ProductInfo10` / `-mobile`). Mesmo markup, mesmas classes, mesmos
 * `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá.
 * Conteúdo = o `mock.ts` de lá (produto de exemplo, nota, plano de parcelas, CEP e
 * opções de frete), já resolvido como o starter resolve: 7 fotos de uma cor só (4
 * miniaturas + "+3"), -22% derivado do "de", 10x sem juros e a tabela de
 * parcelamento do mesmo meio, Pix da entrada Pix do plano, destaques = as 4
 * especificações do CMS, cor por miniatura e Armazenamento com as duas opções em
 * estoque.
 *
 * O ramo esgotado é o de lá: a opção sem estoque sai riscada (`pdp-axis-out`), a nota
 * "<opções> esgotado. Avise-me quando chegar" abre o formulário (`pdp-notify`), e com
 * a opção da página sem estoque o "de", o %, as parcelas, o Pix e a quantidade somem e
 * o botão de compra vira "Avise-me". O mock de lá tem tudo em estoque; para ver o
 * esgotado no canvas, ponha valores em `ESGOTADOS`.
 *
 * Sai: `usePDP`, `useBuyButton`, `useWishList`, a nota do Reviews and Ratings, a
 * simulação de frete, a mutation do "Avise-me" (o envio dá sucesso local, como no
 * palco de lá) e o analytics. Fica de fora, porque com o mock do starter nunca
 * renderiza: o guia de medidas (o produto não tem a especificação), e por isso
 * `sizeGuideLabel` do schema também fica fora do conteúdo.
 *
 * Os rótulos, os destaques (`highlightSpecs`), o seletor de quantidade, o link do CEP
 * e os selos de confiança são do CMS e vêm do `useConteudoDaSecao`; produto, preço,
 * variações e frete são o exemplo de lá.
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

const block = (hex: string, size: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${hex}"/></svg>`
  )}`;

const PRODUCT_NAME = 'Smartphone X5 128 GB 5G Tela 6,7" Preto';
const BRAND = '[Marca 01]';
const SKU = '0000000';
const PRICE = 1799;
const LIST = 2299;
const RATING = { average: 4.8, totalCount: 1284 };
const PIX = 1709.05;
const BEST = {
  installmentNumber: 10,
  installmentValue: 179.9,
  installmentInterest: 0,
};
const PLANS = [
  { installmentNumber: 1, installmentValue: 1799, installmentInterest: 0 },
  { installmentNumber: 2, installmentValue: 899.5, installmentInterest: 0 },
  { installmentNumber: 5, installmentValue: 359.8, installmentInterest: 0 },
  { installmentNumber: 10, installmentValue: 179.9, installmentInterest: 0 },
];

const IMAGES = [
  '#EEF1F5',
  '#E7ECF3',
  '#F3F4F6',
  '#E9EEF6',
  '#EDEFF2',
  '#EEF1F5',
  '#E7ECF3',
].map((hex, i) => ({
  url: block(hex, 800) + `#${i}`,
  alternateName: `Smartphone X5 Preto — foto ${i + 1}`,
}));

const COLORS = [
  { value: 'Preto', label: 'Preto', active: true, src: block('#E4E7EC', 80) },
  { value: 'Azul', label: 'Azul', active: false, src: block('#E7ECF3', 80) },
  {
    value: 'Grafite',
    label: 'Grafite',
    active: false,
    src: block('#F3F4F6', 80),
  },
];
const AXIS_NAME = 'Armazenamento';
const AXIS_OPTIONS = ['128 GB', '256 GB'];
/** Armazenamentos sem estoque (o `offer(false)` do mock de lá, que não tem nenhum). */
const ESGOTADOS: string[] = [];
const AXIS = AXIS_OPTIONS.map((value, i) => ({
  value,
  available: !ESGOTADOS.includes(value),
  sku: i === 0 ? SKU : `000000${i}`,
}));

/** Especificações do produto de exemplo; os destaques escolhem daqui pelo nome. */
const PROPERTIES = [
  { name: 'Tela', value: '6,7"' },
  { name: 'Armazenamento', value: '128 GB' },
  { name: 'Conexão', value: '5G' },
  { name: 'Bateria', value: '5.000 mAh' },
];

/** Como o starter compara nomes: sem acento, sem caixa, sem espaço nas pontas. */
const norm = (s: string | undefined) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

const SHIPPING = [
  {
    id: 'normal',
    friendlyName: 'Normal',
    price: 1990,
    eta: 'até 5 dias úteis',
  },
  {
    id: 'expressa',
    friendlyName: 'Expressa',
    price: 3490,
    eta: 'até 2 dias úteis',
  },
  {
    id: 'retirada',
    friendlyName: 'Retirar na loja',
    price: 0,
    eta: 'até 2 horas',
  },
];

/* ── o que a PDP desenha: o produto de exemplo ou o 1º da loja ── */
type OpcaoDaPdp = { label: string; src: string; available: boolean; sku: string };
type VariacaoDaPdp = {
  /** '' = o rótulo do desenho ("Cor"). */
  name: string;
  tipo: 'texto' | 'cor' | 'imagem';
  options: OpcaoDaPdp[];
  /** A opção que nasce escolhida (a 1ª com estoque). */
  inicial: number;
};
type VistaDaPdp = {
  doLoja: boolean;
  name: string;
  brand: string;
  price: number;
  listPrice: number;
  pix: number | null;
  best: { installmentNumber: number; installmentValue: number; installmentInterest: number } | null;
  plans: typeof PLANS;
  rating: { average: number; totalCount: number } | null;
  inStock: boolean;
  images: { url: string; alternateName: string }[];
  specs: { name: string; value: string }[];
  variacoes: VariacaoDaPdp[];
};

const EXEMPLO: VistaDaPdp = {
  doLoja: false,
  name: PRODUCT_NAME,
  brand: BRAND,
  price: PRICE,
  listPrice: LIST,
  pix: PIX,
  best: BEST,
  plans: PLANS,
  rating: RATING,
  inStock: true,
  images: IMAGES,
  specs: PROPERTIES,
  variacoes: [
    {
      name: '',
      tipo: 'cor',
      options: COLORS.map(c => ({ label: c.label, src: c.src, available: true, sku: '' })),
      inicial: Math.max(0, COLORS.findIndex(c => c.active)),
    },
    {
      name: AXIS_NAME,
      tipo: 'texto',
      options: AXIS.map(o => ({ label: o.value, src: '', available: o.available, sku: o.sku })),
      inicial: Math.max(0, AXIS.findIndex(o => o.available)),
    },
  ],
};

/** Hex aceito no quadro da cor (vai para dentro de um SVG); fora disso, cinza. */
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function daLoja(p: ProdutoNormal): VistaDaPdp {
  const fotos = p.images.length ? p.images : [block('#EEF1F5', 800)];
  return {
    doLoja: true,
    name: p.name,
    brand: p.brand,
    price: p.price,
    listPrice: p.listPrice,
    pix: null,
    best: p.installments
      ? { installmentNumber: p.installments, installmentValue: p.installmentValue, installmentInterest: 0 }
      : null,
    plans:
      p.installments > 1
        ? [
            { installmentNumber: 1, installmentValue: p.price, installmentInterest: 0 },
            { installmentNumber: p.installments, installmentValue: p.installmentValue, installmentInterest: 0 },
          ]
        : [],
    rating: null,
    inStock: p.inStock,
    images: fotos.map((url, i) => ({ url, alternateName: `${p.name} — foto ${i + 1}` })),
    specs: p.specs,
    variacoes: p.variants.map(v => ({
      name: v.name,
      tipo: v.tipo,
      options: v.options.map((o, i) => ({
        label: o.label || `Opção ${i + 1}`,
        src:
          v.tipo === 'imagem'
            ? o.swatchImage || block('#E4E7EC', 80)
            : v.tipo === 'cor'
              ? block(HEX.test(o.color) ? o.color : '#E4E7EC', 80)
              : '',
        available: o.available,
        sku: '',
      })),
      inicial: Math.max(0, v.options.findIndex(o => o.available)),
    })),
  };
}

type TrustIcon = 'shield' | 'exchange' | 'invoice' | 'truck' | 'card';

/** O conteúdo da seção: os campos do `section.schema` do ProductDetails10. */
interface ProductInfo10Conteudo {
  codeLabel?: string;
  ratingCountLabel?: string;
  /** Nomes das especificações em destaque, separados por vírgula, na ordem. */
  highlightSpecs?: string;
  installmentsLinkLabel?: string;
  pixText?: string;
  soldOutText?: string;
  notifyLabel?: string;
  notifyNamePlaceholder?: string;
  notifyEmailPlaceholder?: string;
  notifySubmitLabel?: string;
  notifySuccess?: string;
  buyLabel?: string;
  mobileBuyLabel?: string;
  soldOutButtonLabel?: string;
  hideQuantity?: boolean;
  shippingLabel?: string;
  cepPlaceholder?: string;
  cepButtonLabel?: string;
  cepHelpLabel?: string;
  cepHelpUrl?: string;
  trustItems: { icon?: TrustIcon; text?: string }[];
}

const MOCK: ProductInfo10Conteudo = {
  codeLabel: 'Cód.',
  ratingCountLabel: 'avaliações',
  highlightSpecs: 'Tela, Armazenamento, Conexão, Bateria',
  installmentsLinkLabel: 'ver parcelamento',
  pixText: 'à vista, com aprovação na hora',
  soldOutText: 'esgotado.',
  notifyLabel: 'Avise-me quando chegar',
  notifyNamePlaceholder: 'Seu nome',
  notifyEmailPlaceholder: 'Seu e-mail',
  notifySubmitLabel: 'Avisar',
  notifySuccess: 'Pronto. Avisamos por e-mail quando o produto voltar.',
  buyLabel: 'Adicionar ao carrinho',
  mobileBuyLabel: 'Adicionar',
  soldOutButtonLabel: 'Avise-me quando chegar',
  hideQuantity: false,
  shippingLabel: 'Calcular frete e prazo',
  cepPlaceholder: '00000-000',
  cepButtonLabel: 'Calcular',
  cepHelpLabel: 'Não sei meu CEP',
  cepHelpUrl: 'https://buscacepinter.correios.com.br/app/endereco/index.php',
  trustItems: [
    { icon: 'shield', text: 'Compra segura' },
    { icon: 'exchange', text: 'Troca em até 7 dias' },
    { icon: 'invoice', text: 'Nota fiscal' },
  ],
};

/** CEP de exemplo do campo de frete (o do palco de lá; não é campo do CMS). */
const CEP_EXEMPLO = '01310-100';

const THUMBS = 4;

const svg = (
  size: number,
  body: React.ReactNode,
  extra: React.SVGProps<SVGSVGElement> = {}
) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
    {...extra}
  >
    {body}
  </svg>
);
const STAR =
  'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';
const HEART =
  'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';
const CART = (
  <>
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M2 3h3l2.5 12h12l2-8H6.2" />
  </>
);
const TRUST_ICONS: Record<TrustIcon, React.ReactNode> = {
  shield: <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3z" />,
  exchange: (
    <>
      <path d="M4 9h12a4 4 0 0 1 0 8H8" />
      <path d="m8 5-4 4 4 4" />
    </>
  ),
  invoice: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.5" />
      <circle cx="17" cy="18" r="1.5" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
};

export default function ProductInfo10() {
  const {
    codeLabel,
    ratingCountLabel,
    highlightSpecs,
    installmentsLinkLabel,
    pixText,
    soldOutText,
    notifyLabel,
    notifyNamePlaceholder,
    notifyEmailPlaceholder,
    notifySubmitLabel,
    notifySuccess,
    buyLabel,
    mobileBuyLabel,
    soldOutButtonLabel,
    hideQuantity,
    shippingLabel,
    cepPlaceholder,
    cepButtonLabel,
    cepHelpLabel,
    cepHelpUrl,
    trustItems,
  } = useConteudoDaSecao(MOCK);
  const uid = useId();
  /** A opção escolhida de cada variação (índice), quando o cliente clicou. */
  const [escolhas, setEscolhas] = useState<Record<number, number>>({});
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyTarget, setNotifyTarget] = useState<string | null>(null);
  const [notifyName, setNotifyName] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyOk, setNotifyOk] = useState(false);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [allThumbs, setAllThumbs] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [cep, setCep] = useState(CEP_EXEMPLO);
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

  /* ── variações: cada uma é um bloco; a 1ª de texto é o eixo (estoque, SKU, avise-me) ── */
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
  const sku = selected?.sku || (vista.doLoja ? '' : SKU);
  const discount =
    inStock && vista.listPrice > vista.price
      ? Math.round((1 - vista.price / vista.listPrice) * 100)
      : 0;
  const best = inStock ? vista.best : null;
  const pixValue = inStock ? vista.pix : null;

  /* ── avise-me: o envio dá sucesso local, como no palco de lá ── */
  const notifyFor =
    notifyTarget ?? (inStock ? soldOutOptions[0]?.value : activeAxis) ?? null;
  const openNotify = (value?: string | null) => {
    setNotifyTarget(value ?? null);
    setNotifyOpen(true);
    setNotifyOk(false);
  };
  const onNotify = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifyOk(true);
  };

  const IMAGES_V = vista.images;
  const showPlus = IMAGES_V.length > THUMBS + 1 && !allThumbs;
  const thumbs = showPlus ? IMAGES_V.slice(0, THUMBS) : IMAGES_V;
  const code10 = sku ? `${codeLabel ? `${codeLabel} ` : ''}${sku}` : '';
  const rating = vista.rating;
  const avgText = rating ? rating.average.toFixed(1).replace('.', ',') : '';

  // Destaques: as especificações do produto, na ordem do CMS (só as que ele tem).
  // No produto da loja, as quatro primeiras especificações do cadastro.
  const highlights = vista.doLoja
    ? vista.specs.slice(0, 4)
    : highlightSpecs
      ? highlightSpecs
          .split(',')
          .map(n => n.trim())
          .filter(Boolean)
          .map(n => vista.specs.find(x => norm(x.name) === norm(n)))
          .filter((x): x is { name: string; value: string } => !!x)
      : [];

  const buyButton = (extra: string, label?: string) =>
    inStock ? (
      <button
        type="button"
        className={`${styles.buy} ${extra}`}
        data-role="pdp-buy"
      >
        {svg(20, CART, { strokeWidth: 2 })}
        {label || buyLabel}
      </button>
    ) : (
      <button
        type="button"
        className={`${styles.buy} ${extra}`}
        onClick={() => openNotify(activeAxis)}
        aria-expanded={notifyOpen}
        aria-controls={`${uid}-notify`}
        data-role="pdp-buy"
      >
        {soldOutButtonLabel || notifyLabel}
      </button>
    );

  const highlightList = (extra: string) =>
    highlights.length > 0 && (
      <ul
        className={`${styles.highlights} ${extra}`}
        data-role="pdp-highlights"
      >
        {highlights.map(h => (
          <li key={h.name} className={styles.highlight}>
            <span className={styles.highlightName}>{h.name}</span>
            <strong className={styles.highlightValue}>{h.value}</strong>
          </li>
        ))}
      </ul>
    );

  return (
    <div className={styles.productDetails10Box}>
      <section
        className={styles.productDetails10}
        aria-label={vista.name}
        data-role="pdp-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          {/* ── coluna da galeria (sem zoom, sem vídeo) + destaques no desktop ── */}
          <div className={styles.left}>
            <div className={styles.galleryCard} data-role="pdp-gallery">
              <div
                className={styles.thumbs}
                role="group"
                aria-label="Imagens do produto"
              >
                {thumbs.map((img, i) => (
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
                      width={76}
                      height={76}
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
                {showPlus && (
                  <button
                    type="button"
                    className={`${styles.thumb} ${styles.thumbMore}`}
                    onClick={() => setAllThumbs(true)}
                    aria-label={`Ver mais ${IMAGES_V.length - THUMBS} imagens`}
                    data-role="pdp-thumb-more"
                  >
                    +{IMAGES_V.length - THUMBS}
                  </button>
                )}
              </div>
              <div className={styles.stage}>
                <div
                  ref={railRef}
                  className={styles.rail}
                  onScroll={onRailScroll}
                >
                  {IMAGES_V.map((img, i) => (
                    <div key={i} className={styles.photo}>
                      <img
                        src={img.url}
                        alt={img.alternateName}
                        width={800}
                        height={800}
                        loading={i === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        fetchPriority={i === 0 ? 'high' : undefined}
                      />
                    </div>
                  ))}
                </div>
                {discount > 0 && (
                  <span className={styles.photoTag} data-role="pdp-discount">
                    -{discount}%
                  </span>
                )}
                <button
                  type="button"
                  className={`${styles.fav}${isFav ? ` ${styles.favOn}` : ''}`}
                  onClick={() => setIsFav(f => !f)}
                  aria-pressed={isFav}
                  aria-label={
                    isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
                  }
                  data-role="pdp-favorite"
                >
                  {svg(
                    20,
                    <path d={HEART} />,
                    isFav ? { fill: 'currentColor' } : {}
                  )}
                </button>
                <div className={styles.dots} aria-hidden="true">
                  {IMAGES_V.map((img, i) => (
                    <span
                      key={i}
                      className={i === slide ? styles.dotOn : undefined}
                    />
                  ))}
                </div>
              </div>
            </div>
            {highlightList(styles.onlyDesktop)}
          </div>

          {/* ── coluna de compra ── */}
          <div className={styles.info}>
            <div className={styles.meta}>
              {vista.brand && (
                <a className={styles.brand} href="#" data-role="pdp-brand">
                  {vista.brand}
                </a>
              )}
              <span className={styles.code} data-role="pdp-code">
                {code10}
              </span>
            </div>
            <h1 className={styles.title} data-role="pdp-title">
              {vista.name}
            </h1>
            {rating && (
            <div className={styles.rating} data-role="pdp-rating">
              <span className={styles.stars} aria-hidden="true">
                {[1, 2, 3, 4, 5].map(n => (
                  <svg
                    key={n}
                    className={n > 1 ? styles.onlyDesktop : undefined}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={
                      n <= Math.round(rating.average) ? 'currentColor' : 'none'
                    }
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d={STAR} />
                  </svg>
                ))}
              </span>
              <span className={styles.srOnly}>Nota {avgText} de 5.</span>
              <strong className={styles.ratingValue} aria-hidden="true">
                {avgText}
              </strong>
              <a className={styles.ratingLink} href="#avaliacoes">
                {rating.totalCount.toLocaleString('pt-BR')} {ratingCountLabel}
              </a>
            </div>
            )}

            <div className={styles.prices} data-role="pdp-prices">
              {vista.listPrice > vista.price && inStock && (
                <div className={styles.listRow}>
                  <s className={styles.listPrice} data-role="pdp-list-price">
                    de {money(vista.listPrice)}
                  </s>
                  {discount > 0 && (
                    <span className={styles.tag}>-{discount}%</span>
                  )}
                </div>
              )}
              <span className={styles.price} data-role="pdp-price">
                {money(vista.price)}
              </span>
              {best && best.installmentNumber > 1 && (
                <p className={styles.installment} data-role="pdp-installment">
                  ou{' '}
                  <strong>
                    {best.installmentNumber}x de {money(best.installmentValue)}
                  </strong>{' '}
                  {best.installmentInterest === 0 ? 'sem juros' : 'com juros'}
                  <span className={styles.onlyDesktop}>
                    {' · '}
                    <button
                      type="button"
                      className={styles.inlineLink}
                      onClick={() => setPlansOpen(o => !o)}
                      aria-expanded={plansOpen}
                      aria-controls={`${uid}-plans`}
                      data-role="pdp-installments-link"
                    >
                      {installmentsLinkLabel}
                    </button>
                  </span>
                </p>
              )}
              {plansOpen && best && (
                <ul
                  id={`${uid}-plans`}
                  className={styles.plans}
                  data-role="pdp-installments"
                >
                  {vista.plans.map(p => (
                    <li key={p.installmentNumber}>
                      <span>
                        {p.installmentNumber}x de {money(p.installmentValue)}
                      </span>
                      <span className={styles.plansMeta}>
                        {p.installmentInterest === 0
                          ? 'sem juros'
                          : 'com juros'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {pixValue !== null && (
                <div className={styles.pix} data-role="pdp-pix">
                  {svg(
                    26,
                    <>
                      <path d="M12 3 21 12 12 21 3 12z" />
                      <path d="m8.5 12 3.5-3.5 3.5 3.5-3.5 3.5z" />
                    </>
                  )}
                  <span className={styles.pixCopy}>
                    <strong className={styles.pixValue}>
                      {money(pixValue)} no Pix
                    </strong>
                    <span className={styles.pixText}>{pixText}</span>
                  </span>
                </div>
              )}
            </div>

            {vista.variacoes.map((v, vi) => {
              const atual = v.options[selIdx(vi)];
              if (v.tipo !== 'texto')
                return (
            <div key={vi} className={styles.group} data-role="pdp-colors" data-variacao={v.tipo}>
              <span className={styles.groupLabel}>
                <strong>{v.name || 'Cor'}:</strong> {atual?.label}
              </span>
              <div className={styles.colorRow}>
                {v.options.map((c, oi) => (
                  <a
                    key={oi}
                    className={`${styles.colorChip}${c === atual ? ` ${styles.chipOn}` : ''}`}
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      escolher(vi, oi);
                    }}
                    aria-current={c === atual ? 'true' : undefined}
                    data-role="pdp-swatch"
                  >
                    <span className={styles.swatch}>
                      <img
                        src={c.src}
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    {c.label}
                  </a>
                ))}
              </div>
            </div>
                );
              const principal = vi === eixoVi;
              return (
            <div key={vi} className={styles.group} data-role="pdp-axis" data-variacao="texto">
              <div className={styles.groupHead}>
                <strong className={styles.groupLabel} id={`${uid}-axis${vi}`}>
                  {v.name || AXIS_NAME}
                </strong>
              </div>
              <div
                className={styles.axisRow}
                role="group"
                aria-labelledby={`${uid}-axis${vi}`}
              >
                {v.options.map((opt, oi) =>
                  opt.available ? (
                    <button
                      key={oi}
                      type="button"
                      className={`${styles.axisChip}${opt === atual ? ` ${styles.chipOn}` : ''}`}
                      aria-pressed={opt === atual}
                      onClick={() => {
                        escolher(vi, oi);
                        setNotifyOpen(false);
                      }}
                      data-role="pdp-axis-option"
                    >
                      {opt.label}
                    </button>
                  ) : (
                    <button
                      key={oi}
                      type="button"
                      className={`${styles.axisChip} ${styles.axisOut}`}
                      aria-label={`${opt.label}, esgotado`}
                      disabled
                      data-role="pdp-axis-out"
                    >
                      {opt.label}
                    </button>
                  )
                )}
              </div>
              {/* Bloco comum (não flex): o espaço entre o texto e o link não some. */}
              {principal && soldOutOptions.length > 0 && inStock && (
                <p className={styles.soldNote} data-role="pdp-sold-out-note">
                  {soldOutOptions.map(o => o.value).join(', ')} {soldOutText}{' '}
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
                    {notifyLabel}
                  </button>
                </p>
              )}
            </div>
              );
            })}

            {(notifyOpen || !inStock) && (
              <form
                id={`${uid}-notify`}
                className={styles.notify}
                onSubmit={onNotify}
                data-role="pdp-notify"
              >
                {notifyOk ? (
                  <p className={styles.notifyOk} role="status">
                    {notifySuccess}
                  </p>
                ) : (
                  <>
                    <p className={styles.notifyTitle}>
                      {notifyLabel}
                      {notifyFor ? ` · ${notifyFor}` : ''}
                    </p>
                    {inStock && soldOutOptions.length > 1 && (
                      <div
                        className={styles.axisRow}
                        role="group"
                        aria-label={AXIS_NAME_V}
                      >
                        {soldOutOptions.map(o => (
                          <button
                            key={o.value}
                            type="button"
                            className={`${styles.axisChip} ${styles.axisChipSmall}${o.value === notifyFor ? ` ${styles.chipOn}` : ''}`}
                            aria-pressed={o.value === notifyFor}
                            onClick={() => setNotifyTarget(o.value)}
                          >
                            {o.value}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className={styles.fieldRow}>
                      <label className={styles.field}>
                        <span className={styles.srOnly}>
                          {notifyNamePlaceholder}
                        </span>
                        <input
                          type="text"
                          autoComplete="name"
                          required
                          placeholder={notifyNamePlaceholder}
                          value={notifyName}
                          onChange={e => setNotifyName(e.target.value)}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.srOnly}>
                          {notifyEmailPlaceholder}
                        </span>
                        <input
                          type="email"
                          autoComplete="email"
                          required
                          placeholder={notifyEmailPlaceholder}
                          value={notifyEmail}
                          onChange={e => setNotifyEmail(e.target.value)}
                        />
                      </label>
                      <button type="submit" className={styles.darkBtn}>
                        {notifySubmitLabel}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            {highlightList(styles.onlyMobile)}

            <div
              className={`${styles.buyRow} ${styles.onlyDesktop}`}
              data-role="pdp-buy-row"
            >
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
                    {svg(18, <path d="M5 12h14" />, { strokeWidth: 2 })}
                  </button>
                  <span aria-live="polite">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(q => Math.min(99, q + 1))}
                    aria-label="Aumentar quantidade"
                  >
                    {svg(18, <path d="M12 5v14M5 12h14" />, { strokeWidth: 2 })}
                  </button>
                </div>
              )}
              {buyButton('')}
            </div>

            <div className={styles.shipping} data-role="pdp-shipping">
              <label className={styles.groupLabel} htmlFor={`${uid}-cep`}>
                {shippingLabel}
              </label>
              <form
                className={styles.fieldRow}
                onSubmit={e => e.preventDefault()}
              >
                <input
                  id={`${uid}-cep`}
                  className={styles.input}
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={9}
                  placeholder={cepPlaceholder}
                  value={cep}
                  onChange={e => setCep(e.target.value)}
                />
                <button type="submit" className={styles.darkBtn}>
                  {cepButtonLabel}
                </button>
              </form>
              {cepHelpLabel && cepHelpUrl && (
                <a
                  className={`${styles.cepHelp} ${styles.onlyDesktop}`}
                  href={cepHelpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cepHelpLabel}
                </a>
              )}
              <table
                className={styles.shipTable}
                aria-live="polite"
                data-role="pdp-shipping-options"
              >
                <tbody>
                  {SHIPPING.map(o => (
                    <tr key={o.id}>
                      <td className={styles.shipName}>{o.friendlyName}</td>
                      <td className={styles.shipEta}>{o.eta}</td>
                      <td
                        className={`${styles.shipPrice}${o.price > 0 ? '' : ` ${styles.shipFree}`}`}
                      >
                        {shipPrice(o.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {trustItems.length > 0 && (
              <ul className={styles.trust} data-role="pdp-trust">
                {trustItems.map((t, i) =>
                  t?.text ? (
                    <li key={`${t.text}-${i}`}>
                      {svg(
                        20,
                        TRUST_ICONS[t.icon ?? 'shield'] ?? TRUST_ICONS.shield,
                        { className: styles.trustIcon }
                      )}
                      {t.text}
                    </li>
                  ) : null
                )}
              </ul>
            )}
          </div>
        </div>

        {/* ── barra de compra do mobile: o botão de compra do mobile (gruda no rodapé) ── */}
        <div className={styles.mobileBar} data-role="pdp-mobile-bar">
          <span className={styles.mobilePrice}>
            <strong className={styles.mobilePriceValue}>{money(vista.price)}</strong>
            {pixValue !== null && (
              <span className={styles.mobilePix}>{money(pixValue)} no Pix</span>
            )}
          </span>
          {buyButton(styles.buyMobile, mobileBuyLabel)}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductInfo10.conteudoPadrao = MOCK;

'use client';

import React, { useId, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

/**
 * Espelha `organisms/ProductDetails14` do faststore.starter (família 14, Esportiva; desenho
 * `ProductInfo14` / `-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas
 * vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o `mock.ts` de lá, já resolvido
 * como o starter resolve: a trilha Início / Corrida / Tênis Velox Run 3, as 4 fotos de uma cor
 * só (os blocos em data URI do mock) em grade 2 × 2 com o "-22%" (no mobile, o trilho com o
 * contador e a régua), "Sua Marca · Corrida", a nota 4,8 com 212 avaliações, "Cód.
 * [SKU-0003]" (o SKU do 41), o "de" riscado com o "-22%", 10x sem juros e o Pix, as 3 cores por
 * miniatura (Marinho/Vermelho ativa), o Tamanho (BR) com o 38 e o 44 riscados e o 41 escolhido,
 * a tabela de medidas aberta (a especificação do produto), "Seu número esgotou? Avise-me" (abre o
 * formulário), quantidade + "Favoritar", o botão de compra, o frete por CEP com as opções de
 * exemplo, os 3 destaques e os acordeões Detalhes (aberto, da especificação) · Entrega · Trocas.
 *
 * Sai: `usePDP`, `useBuyButton` (o botão não faz nada), `useWishList` (o "Favoritar" só alterna
 * no estado local), a nota do Reviews and Ratings, a simulação de frete (o "Calcular" não
 * consulta nada), a mutation do "Avise-me" (o envio dá sucesso local, como no palco de lá) e o
 * analytics. As cores, que lá levam ao slug do SKU, aqui não navegam.
 */

const BRL = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n: number) => `R$ ${BRL.format(n)}`;

/* ── utils/shipping de lá ── */
const formatShippingPrice = (priceInCents: number) =>
  priceInCents > 0 ? (priceInCents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Grátis';
const ESTIMATE_UNIT: Record<string, [string, string]> = {
  bd: ['dia útil', 'dias úteis'],
  d: ['dia', 'dias'],
  h: ['hora', 'horas'],
  m: ['minuto', 'minutos'],
};
const formatShippingEstimate = (estimate: string) => {
  const match = /^(\d+)\s*(bd|d|h|m)$/i.exec(estimate.trim());
  if (!match) return '';
  const amount = Number(match[1]);
  const [singular, plural] = ESTIMATE_UNIT[match[2].toLowerCase()];
  if (amount === 0) return 'Hoje';
  return `Até ${amount} ${amount === 1 ? singular : plural}`;
};
const formatPostalCode = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

/* ── o mock.ts de lá, resolvido ── */
const L = {
  homeLabel: 'Início',
  codeLabel: 'Cód.',
  ratingCountLabel: 'avaliações',
  sizeGuideLabel: 'Tabela de medidas',
  sizeTableCaption: 'Comprimento do pé',
  soldOutText: 'Seu número esgotou?',
  notifyLabel: 'Avise-me',
  notifyNamePlaceholder: 'Seu nome',
  notifyEmailPlaceholder: 'Seu e-mail',
  notifySubmitLabel: 'Avisar',
  notifySuccess: 'Pronto! Avisamos por e-mail quando o seu número voltar.',
  buyLabel: 'Adicionar ao carrinho',
  favoriteLabel: 'Favoritar',
  shippingLabel: 'Calcular frete',
  cepPlaceholder: '00000-000',
  cepButtonLabel: 'Calcular',
};

const block = (hex: string, w: number, h = w) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${hex}"/></svg>`
  )}`;

const PRODUCT_NAME = 'Tênis Velox Run 3';
const BRAND_LINE = 'Sua Marca · Corrida';
const TRAIL = [
  { item: '/corrida/', name: 'Corrida' },
  { item: '/tenis-velox-run-3-marinho-vermelho-1014/p', name: 'Tênis Velox Run 3' },
];
const IMAGES = ['#DCE3EC', '#D3DBE6', '#E4E9F0', '#CFD8E3'].map((hex, i) => ({
  url: block(hex, 800) + `#${i}`,
  alternateName: `Tênis Velox Run 3, foto ${i + 1} de 4`,
}));
const RATING = { average: 4.8, totalCount: 212 };
const PRICE = 699.9;
const LIST_PRICE = 899.9;
const DISCOUNT = Math.round((1 - PRICE / LIST_PRICE) * 100);
const BEST = { installmentNumber: 10, installmentValue: 69.99, installmentInterest: 0 };
const PIX = 671.9;

const COLOR_NAME = 'Cor';
const COLORS = [
  { value: 'Marinho/Vermelho', src: block('#DCE3EC', 64), active: true },
  { value: 'Preto/Branco', src: block('#CBD3DE', 64), active: false },
  { value: 'Cinza/Verde-limão', src: block('#E6EBF1', 64), active: false },
];
const AXIS_NAME = 'Tamanho (BR)';
const SIZES = ['38', '39', '40', '41', '42', '43', '44'];
const SOLD = ['38', '44'];
const AXIS_OPTIONS = SIZES.map((value, i) => ({ value, available: !SOLD.includes(value), sku: `[SKU-000${i}]` }));
const SIZE_TABLE: Array<[string, string[]]> = [
  ['BR', ['38', '39', '40', '41', '42', '43', '44']],
  ['cm', ['24,5', '25,2', '25,9', '26,5', '27,2', '27,9', '28,5']],
];
const HIGHLIGHTS: Array<[string, string]> = [
  ['248 g', 'peso no tamanho 41'],
  ['8 mm', 'de drop'],
  ['35 mm', 'de altura no calcanhar'],
];
const ACCORDIONS = [
  {
    title: 'Detalhes',
    lines: [
      'Cabedal em mesh técnico respirável com reforço no calcanhar',
      'Entressola de espuma de alta resposta',
      'Solado de borracha com tração para asfalto molhado',
    ],
  },
  { title: 'Entrega', lines: ['Enviamos para todo o Brasil. O prazo e o valor aparecem no cálculo de frete.'] },
  { title: 'Trocas e devoluções', lines: ['A primeira troca é grátis em até 30 dias depois do recebimento.'] },
];
const SHIPPING = {
  postalCode: '01310-100',
  options: [
    { id: 'normal', friendlyName: 'Normal', price: 1990, estimate: '6bd' },
    { id: 'expressa', friendlyName: 'Expressa', price: 3490, estimate: '2bd' },
    { id: 'retirada', friendlyName: 'Retirar na loja · [Loja Centro]', price: 0, estimate: '' },
  ],
};

const svg = (size: number, body: React.ReactNode, extra: Record<string, unknown> = {}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="square"
    aria-hidden="true"
    {...extra}
  >
    {body}
  </svg>
);
const HEART = 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';
const STAR = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';
const BAG = (
  <>
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </>
);
const RULER = (
  <>
    <path d="M3 15 15 3l6 6L9 21z" />
    <path d="m7 11 2 2M10 8l2 2M13 5l2 2" />
  </>
);
const BELL = (
  <>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </>
);
const MINUS = <path d="M5 12h14" />;
const PLUS = <path d="M12 5v14M5 12h14" />;

/** Cinco estrelas (as que passam da nota ficam apagadas). */
const Stars = ({ avg }: { avg: number }) => (
  <span className={styles.stars} aria-hidden="true">
    {[0, 1, 2, 3, 4].map(i => (
      <svg key={i} viewBox="0 0 24 24" fill="currentColor" opacity={avg >= i + 0.5 ? 1 : 0.28}>
        <path d={STAR} />
      </svg>
    ))}
  </span>
);

export default function ProductInfo14() {
  const uid = useId();
  const [selAxis, setSelAxis] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [openAcc, setOpenAcc] = useState(0);
  const [tableOpen, setTableOpen] = useState(true);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyTarget, setNotifyTarget] = useState<string | null>(null);
  const [notifySent, setNotifySent] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [cep, setCep] = useState(SHIPPING.postalCode);
  const railRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLFormElement>(null);

  const activeAxis = selAxis ?? '41';
  const selected = AXIS_OPTIONS.find(o => o.value === activeAxis);
  const soldOutOptions = AXIS_OPTIONS.filter(o => !o.available);
  const inStock = !!selected?.available;
  const sku = selected?.sku ?? '';
  const ratingAvg = RATING.average;
  const ratingCount = RATING.totalCount;
  const notifyFor = notifyTarget ?? (inStock ? soldOutOptions[0]?.value : activeAxis) ?? null;

  const openNotify = (value?: string | null) => {
    setNotifyTarget(value ?? null);
    setNotifyOpen(true);
    setNotifySent(false);
    window.setTimeout(() => notifyRef.current?.querySelector('input')?.focus(), 0);
  };
  const onNotify = (e: React.FormEvent) => {
    e.preventDefault();
    setNotifySent(true);
  };
  const onCep = (e: React.FormEvent) => e.preventDefault();
  const onRailScroll = () => {
    const el = railRef.current;
    if (el && el.clientWidth) setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };
  const toggleAcc = (i: number) => setOpenAcc(o => (o === i ? -1 : i));
  const activeColorLabel = COLORS.find(c => c.active)?.value ?? '';
  const showNotify = notifyOpen || !inStock;
  const tableId = `${uid}-sizes`;
  const shippingRows = cep ? SHIPPING.options : [];

  return (
    <div className={styles.productDetails14Box}>
      <section className={styles.productDetails14} aria-label={PRODUCT_NAME} data-role="pdp-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.inner}>
          {/* ── trilha nativa (Início / categorias / produto) ── */}
          <nav className={styles.crumbs} aria-label="Trilha de navegação" data-role="pdp-breadcrumb">
            <ol>
              <li>
                <a href="#">{L.homeLabel}</a>
              </li>
              {TRAIL.map((c, i) => {
                const last = i === TRAIL.length - 1;
                return (
                  <React.Fragment key={`${c.item}-${i}`}>
                    <li className={styles.crumbSep} aria-hidden="true" />
                    <li>
                      <a href="#" aria-current={last ? 'page' : undefined}>
                        {c.name}
                      </a>
                    </li>
                  </React.Fragment>
                );
              })}
            </ol>
          </nav>

          <div className={styles.main}>
            {/* ── galeria (sem zoom, sem vídeo): grade 2 × 2 no desktop, trilho no mobile ── */}
            <div className={styles.gallery} data-role="pdp-gallery">
              <div ref={railRef} className={styles.rail} onScroll={onRailScroll}>
                {IMAGES.map((img, i) => (
                  <div key={img.url} className={styles.photo}>
                    <img src={img.url} alt={img.alternateName} width={800} height={800} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                    {i === 0 && DISCOUNT > 0 && (
                      <span className={styles.photoDiscount} data-role="pdp-photo-discount">
                        -{DISCOUNT}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <span className={styles.counter} aria-hidden="true" data-role="pdp-counter">
                {slide + 1}
                <span> / {IMAGES.length}</span>
              </span>
              <div className={styles.segments} aria-hidden="true">
                {IMAGES.map((img, i) => (
                  <span key={img.url} className={i === slide ? styles.segmentOn : undefined} />
                ))}
              </div>
            </div>

            {/* ── coluna de compra ── */}
            <div className={styles.info}>
              <div className={styles.head}>
                <span className={styles.brandLine} data-role="pdp-brand">
                  {BRAND_LINE}
                </span>
                <h1 className={styles.title} data-role="pdp-title">
                  {PRODUCT_NAME}
                </h1>
                <div className={styles.meta}>
                  <a className={styles.rating} href="#avaliacoes" data-role="pdp-rating">
                    <span className={styles.srOnly}>Nota {ratingAvg.toFixed(1).replace('.', ',')} de 5, </span>
                    <Stars avg={ratingAvg} />
                    <span className={styles.ratingAvg} aria-hidden="true">
                      {ratingAvg.toFixed(1).replace('.', ',')}
                    </span>
                    <span className={styles.ratingCount}>
                      {ratingCount.toLocaleString('pt-BR')} {L.ratingCountLabel}
                    </span>
                  </a>
                  <span className={styles.code} data-role="pdp-code">
                    {L.codeLabel} {sku}
                  </span>
                </div>
              </div>

              <div className={styles.prices} data-role="pdp-prices">
                <div className={styles.listRow}>
                  <span className={styles.listPrice} data-role="pdp-list-price">
                    <span className={styles.srOnly}>De </span>
                    {money(LIST_PRICE)}
                  </span>
                  <span className={styles.discount} data-role="pdp-discount">
                    -{DISCOUNT}%
                  </span>
                </div>
                <span className={styles.price} data-role="pdp-price">
                  <span className={styles.srOnly}>Por </span>
                  {money(PRICE)}
                </span>
                {inStock && (
                  <span className={styles.installment} data-role="pdp-installment">
                    {BEST.installmentNumber}x de {money(BEST.installmentValue)} sem juros
                  </span>
                )}
                {inStock && (
                  <span className={styles.pix} data-role="pdp-pix">
                    {money(PIX)} no Pix
                  </span>
                )}
              </div>

              <div className={styles.group} data-role="pdp-colors">
                <p className={styles.legend}>
                  <span id={`${uid}-color`}>{COLOR_NAME}: </span>
                  <span className={styles.legendValue}>{activeColorLabel}</span>
                </p>
                <div className={styles.swatches} role="group" aria-labelledby={`${uid}-color`}>
                  {COLORS.map(c => (
                    <a
                      key={c.value}
                      className={`${styles.swatch}${c.active ? ` ${styles.swatchOn}` : ''}`}
                      aria-current={c.active ? 'true' : undefined}
                      aria-label={`${c.value}${c.active ? ', selecionada' : ''}`}
                      title={c.value}
                      data-role="pdp-swatch"
                    >
                      <img src={c.src} alt="" width={64} height={64} loading="lazy" decoding="async" />
                    </a>
                  ))}
                </div>
              </div>

              <div className={styles.group} data-role="pdp-axis">
                <div className={styles.legendRow}>
                  <p className={styles.legend} id={`${uid}-axis`}>
                    {AXIS_NAME}
                  </p>
                  <button
                    type="button"
                    className={styles.guide}
                    onClick={() => setTableOpen(o => !o)}
                    aria-expanded={tableOpen}
                    aria-controls={tableId}
                    data-role="pdp-size-guide"
                  >
                    {svg(18, RULER)}
                    <span>{L.sizeGuideLabel}</span>
                  </button>
                </div>
                <div className={styles.sizes} role="group" aria-labelledby={`${uid}-axis`}>
                  {AXIS_OPTIONS.map(o =>
                    o.available ? (
                      <button
                        key={o.value}
                        type="button"
                        className={`${styles.size}${o.value === activeAxis ? ` ${styles.sizeOn}` : ''}`}
                        aria-pressed={o.value === activeAxis}
                        onClick={() => {
                          setSelAxis(o.value);
                          setNotifyOpen(false);
                        }}
                        data-role="pdp-axis-option"
                      >
                        {o.value}
                      </button>
                    ) : (
                      <button
                        key={o.value}
                        type="button"
                        className={`${styles.size} ${styles.sizeOut}`}
                        aria-label={`${o.value}, esgotado`}
                        disabled
                        data-role="pdp-axis-out"
                      >
                        {o.value}
                      </button>
                    )
                  )}
                </div>
                <div id={tableId} className={styles.table} hidden={!tableOpen} data-role="pdp-size-table">
                  <table>
                    <caption>{L.sizeTableCaption}</caption>
                    <tbody>
                      {SIZE_TABLE.map(([head, cells], r) => (
                        <tr key={`${head}-${r}`}>
                          <th scope="row">{head}</th>
                          {cells.map((c, k) => (
                            <td key={k}>{c}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {soldOutOptions.length > 0 && inStock && (
                  <p className={styles.soldNote} data-role="pdp-sold-out-note">
                    {svg(18, BELL)}
                    {/* Texto num <span> comum (não flex): o espaço antes do link não some. */}
                    <span>
                      {L.soldOutText}{' '}
                      <button
                        type="button"
                        className={styles.notifyLink}
                        onClick={() => openNotify(soldOutOptions.length === 1 ? soldOutOptions[0].value : null)}
                        aria-expanded={notifyOpen}
                        aria-controls={`${uid}-notify`}
                        data-role="pdp-notify-link"
                      >
                        {L.notifyLabel}
                      </button>
                    </span>
                  </p>
                )}
              </div>

              {showNotify && (
                <form id={`${uid}-notify`} ref={notifyRef} className={styles.notify} onSubmit={onNotify} data-role="pdp-notify">
                  {notifySent ? (
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
                        <div className={styles.notifyOptions} role="group" aria-label={AXIS_NAME}>
                          {soldOutOptions.map(s => (
                            <button
                              key={s.value}
                              type="button"
                              className={`${styles.size}${s.value === notifyFor ? ` ${styles.sizeOn}` : ''}`}
                              aria-pressed={s.value === notifyFor}
                              onClick={() => setNotifyTarget(s.value)}
                            >
                              {s.value}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className={styles.notifyFields}>
                        <label className={styles.field}>
                          <span className={styles.srOnly}>{L.notifyNamePlaceholder}</span>
                          <input className={styles.input} type="text" autoComplete="name" required placeholder={L.notifyNamePlaceholder} />
                        </label>
                        <label className={styles.field}>
                          <span className={styles.srOnly}>{L.notifyEmailPlaceholder}</span>
                          <input className={styles.input} type="email" autoComplete="email" required placeholder={L.notifyEmailPlaceholder} />
                        </label>
                        <button type="submit" className={styles.notifySubmit}>
                          {L.notifySubmitLabel}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}

              {/* ── quantidade + favoritar, e o botão de compra em largura total ── */}
              <div className={styles.buyBox} data-role="pdp-buy-row">
                <div className={styles.buyTools}>
                  {inStock && (
                    <div className={styles.qty} role="group" aria-label="Quantidade">
                      <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Diminuir quantidade" disabled={qty <= 1}>
                        {svg(18, MINUS, { strokeWidth: 2.4 })}
                      </button>
                      <span className={styles.qtyValue} aria-live="polite">
                        {qty}
                      </span>
                      <button type="button" onClick={() => setQty(q => Math.min(99, q + 1))} aria-label="Aumentar quantidade">
                        {svg(18, PLUS, { strokeWidth: 2.4 })}
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    className={`${styles.fav}${isFav ? ` ${styles.favOn}` : ''}`}
                    onClick={() => setIsFav(v => !v)}
                    aria-pressed={isFav}
                    data-role="pdp-favorite"
                  >
                    {svg(20, <path d={HEART} />, isFav ? { fill: 'currentColor' } : {})}
                    <span>{L.favoriteLabel}</span>
                  </button>
                </div>
                <button type="button" className={styles.buy} data-role="pdp-buy">
                  {svg(22, BAG, { strokeWidth: 2.2 })}
                  <span>{L.buyLabel}</span>
                </button>
              </div>

              <form className={styles.shipping} onSubmit={onCep} data-role="pdp-shipping">
                <label className={styles.legend} htmlFor={`${uid}-cep`}>
                  {L.shippingLabel}
                </label>
                <div className={styles.cepRow}>
                  <input
                    id={`${uid}-cep`}
                    className={styles.input}
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
                {shippingRows.length > 0 && (
                  <ul className={styles.shipList} aria-live="polite" data-role="pdp-shipping-options">
                    {shippingRows.map(o => {
                      const eta = formatShippingEstimate(o.estimate).toLowerCase();
                      return (
                        <li key={o.id} className={styles.shipRow}>
                          <span>
                            {o.friendlyName}
                            {eta ? ` · ${eta}` : ''}
                          </span>
                          <span className={styles.shipPrice}>{formatShippingPrice(o.price)}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </form>
            </div>

            {/* ── destaques + acordeões (sob a galeria no desktop; no fim no mobile) ── */}
            <div className={styles.extras}>
              <ul className={styles.highlights} data-role="pdp-highlights">
                {HIGHLIGHTS.map(([value, caption], i) => (
                  <li key={`${value}-${i}`} className={styles.highlight}>
                    <span className={styles.highlightValue}>{value}</span>
                    {caption && <span className={styles.highlightCaption}>{caption}</span>}
                  </li>
                ))}
              </ul>
              <div className={styles.accordions} data-role="pdp-accordions">
                {ACCORDIONS.map((a, i) => {
                  const open = openAcc === i;
                  return (
                    <div key={`${a.title}-${i}`} className={styles.acc}>
                      <h2 className={styles.accHeading}>
                        <button
                          type="button"
                          className={styles.accBtn}
                          aria-expanded={open}
                          aria-controls={`${uid}-acc-${i}`}
                          id={`${uid}-accb-${i}`}
                          onClick={() => toggleAcc(i)}
                          data-role="pdp-accordion"
                        >
                          <span>{a.title}</span>
                          {svg(18, open ? MINUS : PLUS, { strokeWidth: 2.4 })}
                        </button>
                      </h2>
                      <div id={`${uid}-acc-${i}`} role="region" aria-labelledby={`${uid}-accb-${i}`} className={styles.accPanel} hidden={!open}>
                        {a.lines.length > 1 ? (
                          <ul>
                            {a.lines.map((l, k) => (
                              <li key={k}>{l}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{a.lines[0]}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

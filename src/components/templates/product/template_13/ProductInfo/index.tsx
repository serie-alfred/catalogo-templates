'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

/**
 * Espelha `organisms/ProductDetails13` do faststore.starter (família 13, Noturno; desenho
 * `ProductInfo13` / `-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas
 * vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o `mock.ts` de lá, já resolvido
 * como o starter resolve: a trilha Início / Tênis / Corrida, as 6 fotos de uma cor só (os
 * blocos em data URI do mock) com contador, setas e miniaturas, o rótulo "Drop 07", a nota 4,8
 * com 312 avaliações, "Cód. [0000004]" (o SKU do 41), 6x sem juros (sem Pix: o plano do mock
 * não tem a entrada Pix), as 3 cores por miniatura (Preto/Lima ativa), o Tamanho (BR) em grade
 * com o 38 e o 44 riscados e o 41 escolhido, a "Tabela de medidas" (a especificação do
 * produto, com o diálogo), "Seu número esgotou? Me avise quando chegar" (abre o formulário),
 * "Adicionar à bag" + o coração, o frete por CEP (as opções de exemplo depois do "Calcular") e
 * as abas Detalhes · Entrega · Trocas (Detalhes vem da especificação do produto). Mobile: a
 * barra de compra presa ao rodapé.
 *
 * Sai: `usePDP`, `useBuyButton` ("Adicionar à bag" não faz nada), `useWishList` (o coração só
 * alterna no estado local), a nota do Reviews and Ratings, a simulação de frete, a mutation do
 * "Avise-me" (o envio dá sucesso local, como no palco de lá) e o analytics. As cores, que lá
 * levam ao slug do SKU, aqui apontam para `#`.
 */

const BRL = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n: number) => `R$ ${BRL.format(n)}`;
const two = (n: number) => String(n).padStart(2, '0');

/** O mesmo `formatShippingPrice` do `utils/shipping` do starter (centavos). */
const shipPrice = (cents: number) =>
  cents > 0 ? (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Grátis';
/** O mesmo `formatShippingEstimate` do `utils/shipping` do starter ("7bd" → "Até 7 dias úteis"). */
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

const block = (hex: string, w: number, h = w) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${hex}"/></svg>`
  )}`;

/* ── rótulos (o mock.ts de lá) ── */
const L = {
  homeLabel: 'Início',
  badge: 'Drop 07',
  codeLabel: 'Cód.',
  ratingCountLabel: 'avaliações',
  sizeGuideLabel: 'Tabela de medidas',
  soldOutText: 'Seu número esgotou?',
  notifyLabel: 'Me avise quando chegar',
  notifyNamePlaceholder: 'Seu nome',
  notifyEmailPlaceholder: 'Seu e-mail',
  notifySubmitLabel: 'Avisar',
  notifySuccess: 'Pronto! Avisamos por e-mail quando o seu número voltar.',
  buyLabel: 'Adicionar à bag',
  mobileBuyLabel: 'Adicionar à bag',
  mobileSelectedLabel: 'Tam.',
  soldOutButtonLabel: 'Me avise quando chegar',
  favoriteLabel: 'Salvar nos favoritos',
  shippingLabel: 'Calcular frete',
  cepPlaceholder: '00000-000',
  cepButtonLabel: 'Calcular',
};

/* ── produto de exemplo (o mock.ts de lá, já resolvido) ── */
const PRODUCT_NAME = 'Tênis Runner V2 Preto/Lima';
const PRICE = 699.9;
const LIST_PRICE = 699.9;
const BEST = { installmentNumber: 6, installmentValue: 116.65, installmentInterest: 0 };
const RATING = { average: 4.8, totalCount: 312 };
const CRUMBS = [
  { item: '#', name: 'Tênis' },
  { item: '#', name: 'Corrida' },
];
const IMAGES = ['#1E1E1E', '#262626', '#2B2B2B', '#222222', '#303030', '#1A1A1A'].map((hex, i) => ({
  url: block(hex, 800) + `#${i}`,
  alternateName: `Tênis Runner V2 Preto/Lima — foto ${i + 1}`,
}));
const COLOR_NAME = 'Cor';
const COLORS = [
  { value: 'Preto/Lima', src: block('#1E1E1E', 56, 70), active: true },
  { value: 'Branco/Cinza', src: block('#3A3A36', 56, 70), active: false },
  { value: 'Oliva', src: block('#2E3020', 56, 70), active: false },
];
const AXIS_NAME = 'Tamanho (BR)';
const SIZES = ['37', '38', '39', '40', '41', '42', '43', '44'];
/** Tamanhos sem estoque no mock de lá (o palco "Esgotado" de lá liga todos). */
const ESGOTADOS = ['38', '44'];
const AXIS = SIZES.map((value, i) => ({ value, available: !ESGOTADOS.includes(value), sku: `[000000${i}]` }));
const AXIS_FROM_URL = '41';
const GUIDE_URL = block('#F4F4F0', 1200, 800);
const ACCORDIONS = [
  {
    title: 'Detalhes',
    lines: [
      'Cabedal em mesh técnico com detalhes refletivos',
      'Entressola de espuma de alta resposta',
      'Solado de borracha com tração em piso molhado',
    ],
  },
  { title: 'Entrega', lines: ['Enviamos para todo o Brasil. O prazo e o valor aparecem no cálculo de frete acima.'] },
  { title: 'Trocas', lines: ['A primeira troca é grátis em até 30 dias depois do recebimento.'] },
];
const SHIPPING = [
  { id: 'normal', friendlyName: 'Normal', price: 1990, estimate: '7bd' },
  { id: 'expressa', friendlyName: 'Expressa', price: 3490, estimate: '2bd' },
  { id: 'retirada', friendlyName: 'Retirar na loja · [Loja Centro]', price: 0, estimate: '' },
];

const svg = (size: number, body: React.ReactNode, extra: Record<string, unknown> = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...extra}>
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

export default function ProductInfo13() {
  const uid = useId();

  const [selAxis, setSelAxis] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const [openAcc, setOpenAcc] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyTarget, setNotifyTarget] = useState<string | null>(null);
  const [notifyName, setNotifyName] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyOk, setNotifyOk] = useState(false);
  const [cep, setCep] = useState('');
  const [cepSent, setCepSent] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLFormElement>(null);
  const guideCloseRef = useRef<HTMLButtonElement>(null);
  const guideTriggerRef = useRef<HTMLButtonElement>(null);

  const defaultAxis =
    (AXIS.find(o => o.value === AXIS_FROM_URL)?.available ? AXIS_FROM_URL : undefined) ??
    AXIS.find(o => o.available)?.value ??
    AXIS_FROM_URL;
  const activeAxis = selAxis ?? defaultAxis;
  const selected = AXIS.find(o => o.value === activeAxis);
  const soldOutOptions = AXIS.filter(o => !o.available);
  const inStock = !!selected?.available;
  const best = inStock ? BEST : null;
  const sku = selected?.sku ?? '';
  const price = PRICE;
  const listPrice = LIST_PRICE;

  const notifyFor = notifyTarget ?? (inStock ? soldOutOptions[0]?.value : activeAxis) ?? null;
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
  const onCep = (e: React.FormEvent) => {
    e.preventDefault();
    setCepSent(true);
  };

  /* ── guia de medidas: Esc fecha, foco volta ao gatilho, trava a rolagem ── */
  useEffect(() => {
    if (!guideOpen) return;
    guideCloseRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGuideOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const trigger = guideTriggerRef.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      trigger?.focus();
    };
  }, [guideOpen]);

  const onRailScroll = () => {
    const el = railRef.current;
    if (el && el.clientWidth) setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i: number) => {
    const el = railRef.current;
    const n = Math.max(0, Math.min(IMAGES.length - 1, i));
    setSlide(n);
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: 'auto' });
  };
  // Desktop: abas (uma sempre aberta). Mobile: acordeões (abre e fecha). Lá a régua é a janela;
  // aqui é a largura da própria seção (o canvas é um iframe com a largura do aparelho).
  const toggleAcc = (i: number) => {
    const mobile = (railRef.current?.closest(`.${styles.productDetails13Box}`)?.clientWidth ?? window.innerWidth) <= 960;
    setOpenAcc(o => (mobile && o === i ? -1 : i));
  };
  const activeColorLabel = COLORS.find(c => c.active)?.value ?? '';
  const showNotify = notifyOpen || !inStock;

  const buyButton = (extra: string, label?: string, mobile = false) =>
    inStock ? (
      <button type="button" className={`${styles.buy}${extra ? ` ${extra}` : ''}`} data-role="pdp-buy">
        {!mobile && svg(20, BAG, { strokeWidth: 2 })}
        <span>{label || L.buyLabel}</span>
      </button>
    ) : (
      <button
        type="button"
        className={`${styles.buy}${extra ? ` ${extra}` : ''}`}
        onClick={() => openNotify(activeAxis, mobile)}
        aria-expanded={showNotify}
        aria-controls={`${uid}-notify`}
        data-role="pdp-buy"
      >
        {!mobile && svg(20, BELL, { strokeWidth: 2 })}
        <span>{L.soldOutButtonLabel || L.notifyLabel}</span>
      </button>
    );

  const favButton = (extra: string) => (
    <button
      type="button"
      className={`${styles.fav} ${extra}${isFav ? ` ${styles.favOn}` : ''}`}
      onClick={() => setIsFav(v => !v)}
      aria-pressed={isFav}
      aria-label={L.favoriteLabel}
      data-role="pdp-favorite"
    >
      {svg(22, <path d={HEART} />, isFav ? { fill: 'currentColor' } : {})}
    </button>
  );

  return (
    <div className={styles.productDetails13Box}>
      <section className={styles.productDetails13} aria-label={PRODUCT_NAME} data-role="pdp-root">
        <link rel="stylesheet" href={FONTES_13} />
        <div className={styles.inner}>
          {/* ── trilha nativa (Início / categorias) ── */}
          <nav className={styles.crumbs} aria-label="Trilha de navegação" data-role="pdp-breadcrumb">
            <ol>
              <li>
                <a href="#">{L.homeLabel}</a>
              </li>
              {CRUMBS.map((c, i) => (
                <React.Fragment key={`${c.name}-${i}`}>
                  <li className={styles.crumbSep} aria-hidden="true">
                    /
                  </li>
                  <li>
                    <a href={c.item}>{c.name}</a>
                  </li>
                </React.Fragment>
              ))}
            </ol>
          </nav>

          <div className={styles.main}>
            {/* ── galeria (sem zoom, sem vídeo) ── */}
            <div className={styles.gallery} data-role="pdp-gallery">
              <div className={styles.stage}>
                <div ref={railRef} className={styles.rail} onScroll={onRailScroll}>
                  {IMAGES.map((img, i) => (
                    <div key={img.url} className={styles.photo}>
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
                <span className={styles.counter} aria-hidden="true" data-role="pdp-counter">
                  {two(slide + 1)}
                  <span>/{two(IMAGES.length)}</span>
                </span>
                {favButton(styles.favPhoto)}
                <div className={styles.arrows}>
                  <button type="button" className={styles.arrowPrev} onClick={() => goTo(slide - 1)} disabled={slide <= 0} aria-label="Imagem anterior">
                    {svg(20, <path d="m15 6-6 6 6 6" />)}
                  </button>
                  <button
                    type="button"
                    className={styles.arrowNext}
                    onClick={() => goTo(slide + 1)}
                    disabled={slide >= IMAGES.length - 1}
                    aria-label="Próxima imagem"
                  >
                    {svg(20, <path d="m9 6 6 6-6 6" />, { strokeWidth: 2 })}
                  </button>
                </div>
                <div className={styles.segments} aria-hidden="true">
                  {IMAGES.map((img, i) => (
                    <span key={img.url} className={i === slide ? styles.segmentOn : undefined} />
                  ))}
                </div>
              </div>
              <div className={styles.thumbs} role="group" aria-label="Imagens do produto">
                {IMAGES.map((img, i) => (
                  <button
                    key={img.url}
                    type="button"
                    className={`${styles.thumb}${i === slide ? ` ${styles.thumbOn}` : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Imagem ${i + 1}`}
                    aria-current={i === slide ? 'true' : undefined}
                    data-role="pdp-thumb"
                  >
                    <img src={img.url} alt="" width={120} height={120} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            </div>

            {/* ── coluna de compra ── */}
            <div className={styles.info}>
              <div className={styles.head}>
                <span className={styles.badge} data-role="pdp-badge">
                  {L.badge}
                </span>
                <h1 className={styles.title} data-role="pdp-title">
                  {PRODUCT_NAME}
                </h1>
                <div className={styles.meta}>
                  <a className={styles.rating} href="#avaliacoes" data-role="pdp-rating">
                    <Stars avg={RATING.average} />
                    <span className={styles.srOnly}>Nota {RATING.average.toFixed(1).replace('.', ',')} de 5, </span>
                    <span className={styles.ratingCount}>
                      {RATING.totalCount.toLocaleString('pt-BR')} {L.ratingCountLabel}
                    </span>
                  </a>
                  {sku && (
                    <span className={styles.code} data-role="pdp-code">
                      {L.codeLabel ? `${L.codeLabel} ` : ''}
                      {sku}
                    </span>
                  )}
                </div>
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
                  <span className={styles.installment} data-role="pdp-installment">
                    {best.installmentNumber}x de {money(best.installmentValue)}{' '}
                    {best.installmentInterest === 0 ? 'sem juros' : 'com juros'}
                  </span>
                )}
              </div>

              <div className={styles.group} data-role="pdp-colors">
                <p className={styles.legend}>
                  <span>
                    <span id={`${uid}-color`}>{COLOR_NAME}: </span>
                    <span className={styles.legendValue}>{activeColorLabel}</span>
                  </span>
                </p>
                <div className={styles.swatches} role="group" aria-labelledby={`${uid}-color`}>
                  {COLORS.map(c => (
                    <a
                      key={c.value}
                      className={`${styles.swatch}${c.active ? ` ${styles.swatchOn}` : ''}`}
                      href={c.active ? undefined : '#'}
                      aria-current={c.active ? 'true' : undefined}
                      aria-label={c.value}
                      title={c.value}
                      data-role="pdp-swatch"
                    >
                      <img src={c.src} alt="" width={56} height={70} loading="lazy" decoding="async" />
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
                    ref={guideTriggerRef}
                    type="button"
                    className={styles.guide}
                    onClick={() => setGuideOpen(true)}
                    aria-haspopup="dialog"
                    data-role="pdp-size-guide"
                  >
                    {svg(18, RULER)}
                    <span>{L.sizeGuideLabel}</span>
                  </button>
                </div>
                <div className={styles.sizes} role="group" aria-labelledby={`${uid}-axis`}>
                  {AXIS.map(o =>
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
                        className={`${styles.size} ${styles.sizeOut}${o.value === activeAxis ? ` ${styles.sizeOn}` : ''}`}
                        aria-label={`${o.value}, esgotado`}
                        disabled
                        data-role="pdp-axis-out"
                      >
                        {o.value}
                      </button>
                    )
                  )}
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

              {/* ── compra + coração (desktop) ── */}
              <div className={styles.buyRow} data-role="pdp-buy-row">
                {buyButton('')}
                {favButton(styles.favSide)}
              </div>

              {showNotify && (
                <form id={`${uid}-notify`} ref={notifyRef} className={styles.notify} onSubmit={onNotify} data-role="pdp-notify">
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
                          <span className={styles.srOnly}>{L.notifyEmailPlaceholder}</span>
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
                {cepSent && (
                  <ul className={styles.shipList} aria-live="polite" data-role="pdp-shipping-options">
                    {SHIPPING.map(o => {
                      const eta = shipEta(o.estimate).toLowerCase();
                      return (
                        <li key={o.id} className={styles.shipRow}>
                          <span>
                            {o.friendlyName}
                            {eta ? ` · ${eta}` : ''}
                          </span>
                          <span className={o.price <= 0 ? styles.shipFree : undefined}>{shipPrice(o.price)}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </form>

              <div className={styles.accordions} data-role="pdp-accordions">
                {ACCORDIONS.map((a, i) => {
                  const open = openAcc === i;
                  return (
                    <React.Fragment key={`${a.title}-${i}`}>
                      <button
                        type="button"
                        className={`${styles.accBtn}${open ? ` ${styles.accOn}` : ''}`}
                        aria-expanded={open}
                        aria-controls={`${uid}-acc-${i}`}
                        id={`${uid}-accb-${i}`}
                        onClick={() => toggleAcc(i)}
                        data-role="pdp-accordion"
                      >
                        <span>{a.title}</span>
                        {svg(18, open ? MINUS : PLUS, { strokeWidth: 2 })}
                      </button>
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
                    </React.Fragment>
                  );
                })}
                <span className={styles.accRule} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* ── barra de compra do mobile: o botão de compra do mobile (gruda no rodapé) ── */}
        <div className={styles.mobileBar} data-role="pdp-mobile-bar">
          {inStock && (
            <span className={styles.mobilePrice}>
              <strong className={styles.mobilePriceValue}>{money(price)}</strong>
              {L.mobileSelectedLabel && activeAxis && (
                <span className={styles.mobileSelected}>
                  {L.mobileSelectedLabel} {activeAxis}
                </span>
              )}
            </span>
          )}
          {buyButton(styles.buyMobile, L.mobileBuyLabel, true)}
        </div>

        {guideOpen && (
          <div className={styles.overlay} onClick={() => setGuideOpen(false)}>
            <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={L.sizeGuideLabel} onClick={e => e.stopPropagation()}>
              <div className={styles.dialogHead}>
                <strong>{L.sizeGuideLabel}</strong>
                <button ref={guideCloseRef} type="button" className={styles.close} onClick={() => setGuideOpen(false)} aria-label="Fechar">
                  {svg(20, <path d="M6 6l12 12M18 6 6 18" />)}
                </button>
              </div>
              <img className={styles.guideImg} src={GUIDE_URL} alt={`${L.sizeGuideLabel} — ${PRODUCT_NAME}`} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

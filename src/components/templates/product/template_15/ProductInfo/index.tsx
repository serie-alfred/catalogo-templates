'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

/**
 * Espelha `organisms/ProductDetails15` do faststore.starter (família 15, Luxo; desenho
 * `ProductInfo15` / `-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas
 * vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o `mock.ts` de lá, já resolvido
 * como o starter resolve: a trilha Início — Joias — Anéis, as 5 fotos em tons de areia (os
 * blocos em data URI do mock) com miniaturas, contador "1 / 5" e setas, a marca, a nota 4,9
 * com 128 avaliações, "Ref. [0000004]" (o SKU do aro 14), o preço com 10x sem juros e o Pix,
 * a Cor do ouro por miniatura (Amarelo ativa), o Aro em grade com o 12 e o 18 riscados e o 14
 * escolhido, o "Guia de medidas" (a especificação do produto, com o diálogo), "O aro 12 ou 18
 * esgotou? Avise-me" (abre o formulário), quantidade + coração, "Adicionar à sacola", o frete
 * por CEP (as opções de exemplo depois do "Calcular") e os acordeões (o primeiro aberto;
 * "Detalhes da peça" vem da especificação do produto).
 *
 * Sai: `usePDP`, `useBuyButton` ("Adicionar à sacola" não faz nada), `useWishList` (o coração
 * só alterna no estado local), a nota do Reviews and Ratings, a simulação de frete, a mutation
 * do "Avise-me" (o envio dá sucesso local, como no palco de lá) e o analytics. As cores, que lá
 * levam ao slug do SKU, aqui apontam para `#`.
 */

const block = (hex: string, w: number, h: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${hex}"/></svg>`
  )}`;

const HOME_LABEL = 'Início';
const CODE_LABEL = 'Ref.';
const RATING_COUNT_LABEL = 'avaliações';
const SIZE_GUIDE_LABEL = 'Guia de medidas';
const SOLD_OUT_TEXT = 'O aro {tamanhos} esgotou?';
const SOLD_OUT_TEXT_MOBILE = 'Seu aro esgotou?';
const NOTIFY = {
  label: 'Avise-me',
  name: 'Seu nome',
  email: 'Seu e-mail',
  submit: 'Avisar',
  success: 'Pronto. Avisaremos por e-mail assim que o seu aro voltar ao ateliê.',
};
const BUY_LABEL = 'Adicionar à sacola';
const FAVORITE_LABEL = 'Salvar nos favoritos';
const SHIPPING = {
  label: 'Calcular frete',
  placeholder: '00000-000',
  button: 'Calcular',
  note: 'Entrega segura com seguro total · até 5 dias úteis',
};
const ACCORDIONS = [
  {
    title: 'Descrição',
    lines: [
      'Solitário clássico de seis garras em ouro amarelo 18k, com diamante de lapidação brilhante. Um desenho que valoriza a pedra e acompanha a vida inteira.',
    ],
  },
  { title: 'Detalhes da peça', lines: ['Ouro amarelo 18k (liga 750)', 'Diamante de lapidação brilhante', 'Seis garras'] },
  {
    title: 'Entrega e embalagem',
    lines: ['Enviamos com seguro total para todo o Brasil, no estojo da maison. O prazo e o valor aparecem no cálculo de frete acima.'],
  },
  {
    title: 'Garantia e cuidados',
    lines: ['Garantia contra defeitos de fabricação. Guarde a peça no estojo e evite contato com perfume e cloro.'],
  },
];
const SHIP_OPTIONS = [
  { id: 'segura', name: 'Entrega segura', eta: 'até 5 dias úteis', price: 'Grátis' },
  { id: 'expressa', name: 'Expressa com seguro', eta: 'até 2 dias úteis', price: 'R$ 49,00' },
];

const BRAND = 'Sua Marca Joias';
const PRODUCT_NAME = 'Anel Solitário Ouro 18k';
const CRUMBS = [
  { item: '/joias/', name: 'Joias' },
  { item: '/joias/aneis/', name: 'Anéis' },
];
const IMAGES = ['#E6DFD2', '#DCD3C4', '#E9E3D8', '#D9CFBF', '#E3DACB'].map((hex, i) => ({
  url: block(hex, 800, 1000) + `#${i}`,
  alternateName: `${PRODUCT_NAME} — foto ${i + 1}`,
}));
const PRICE = 6890;
const BEST = { installmentNumber: 10, installmentValue: 689, installmentInterest: 0 };
const PIX = 6545.5;
const RATING = { average: 4.9, totalCount: 128 };
const COLOR_NAME = 'Cor do ouro';
const COLORS = [
  { value: 'Amarelo', src: block('#E6DFD2', 64, 80), active: true },
  { value: 'Branco', src: block('#E4E2DE', 64, 80), active: false },
  { value: 'Rosé', src: block('#E8D9CF', 64, 80), active: false },
];
const AXIS_NAME = 'Aro';
const SIZES = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '22'];
const SOLD = ['12', '18'];
const AXIS = SIZES.map((value, i) => ({ value, available: !SOLD.includes(value), sku: `[000000${i}]` }));
const GUIDE_URL = block('#FAF8F4', 1200, 800);

const BRL = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n: number) => `R$ ${BRL.format(n)}`;

/** "12 ou 18", "10, 12 ou 18". */
const joinOr = (list: string[]) =>
  list.length <= 1 ? list.join('') : `${list.slice(0, -1).join(', ')} ou ${list[list.length - 1]}`;

const svg = (size: number, body: React.ReactNode, extra: Record<string, unknown> = {}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" {...extra}>
    {body}
  </svg>
);
const HEART = 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';
const STAR = 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z';
const BAG = (
  <>
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </>
);
const RULER = <path d="M3 9h18v6H3zM7 9v3M11 9v3M15 9v3M19 9v3" />;
const BELL = (
  <>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </>
);
const MINUS = <path d="M5 12h14" />;
const PLUS = <path d="M12 5v14M5 12h14" />;

/** Cinco estrelas douradas (as que passam da nota ficam apagadas). */
const Stars = ({ avg }: { avg: number }) => (
  <span className={styles.stars} aria-hidden="true">
    {[0, 1, 2, 3, 4].map(i => (
      <svg key={i} viewBox="0 0 24 24" fill="currentColor" opacity={avg >= i + 0.5 ? 1 : 0.28}>
        <path d={STAR} />
      </svg>
    ))}
  </span>
);

export default function ProductInfo15() {
  const uid = useId();
  const [selAxis, setSelAxis] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [openAcc, setOpenAcc] = useState<number[]>([0]);
  const [guideOpen, setGuideOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyTarget, setNotifyTarget] = useState<string | null>(null);
  const [notifyName, setNotifyName] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySent, setNotifySent] = useState(false);
  const [cep, setCep] = useState('');
  const [cepSent, setCepSent] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLFormElement>(null);
  const guideCloseRef = useRef<HTMLButtonElement>(null);
  const guideTriggerRef = useRef<HTMLButtonElement>(null);

  const activeAxis = selAxis ?? '14';
  const selected = AXIS.find(o => o.value === activeAxis);
  const soldOutOptions = AXIS.filter(o => !o.available);
  const inStock = !!selected?.available;
  const sku = selected?.sku ?? '';
  const best = inStock ? BEST : null;
  const pixValue = inStock ? PIX : null;

  /* ── guia de medidas: Esc fecha, foco volta ao gatilho ── */
  useEffect(() => {
    if (!guideOpen) return;
    guideCloseRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGuideOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const trigger = guideTriggerRef.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      trigger?.focus();
    };
  }, [guideOpen]);

  const notifyFor = notifyTarget ?? (inStock ? soldOutOptions[0]?.value : activeAxis) ?? null;
  const openNotify = (value?: string | null, focus = false) => {
    setNotifyTarget(value ?? null);
    setNotifyOpen(true);
    setNotifySent(false);
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
    setNotifySent(true);
  };
  const onCep = (e: React.FormEvent) => {
    e.preventDefault();
    setCepSent(true);
  };
  const formatCep = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  };

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
  const toggleAcc = (i: number) => setOpenAcc(o => (o.includes(i) ? o.filter(x => x !== i) : [...o, i]));
  const activeColorLabel = COLORS.find(c => c.active)?.value ?? '';
  const showNotify = notifyOpen || !inStock;
  const soldList = joinOr(soldOutOptions.map(o => o.value));
  const soldQuestion = SOLD_OUT_TEXT.replace('{tamanhos}', soldList);
  const soldQuestionMobile = SOLD_OUT_TEXT_MOBILE.replace('{tamanhos}', soldList);

  const favButton = (extra: string) => (
    <button
      type="button"
      className={`${styles.fav} ${extra}`}
      onClick={() => setIsFav(v => !v)}
      aria-pressed={isFav}
      aria-label={FAVORITE_LABEL}
      data-role="pdp-favorite"
    >
      {svg(20, <path d={HEART} />, isFav ? { fill: 'currentColor' } : {})}
    </button>
  );

  return (
    <div className={styles.productDetails15Box}>
      <section className={styles.productDetails15} aria-label={PRODUCT_NAME} data-role="pdp-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          {/* ── trilha nativa (Início — categorias), fios dourados entre os itens ── */}
          <nav className={styles.crumbs} aria-label="Trilha de navegação" data-role="pdp-breadcrumb">
            <ol>
              <li>
                <a href="#">{HOME_LABEL}</a>
              </li>
              {CRUMBS.map((c, i) => (
                <React.Fragment key={`${c.item}-${i}`}>
                  <li className={styles.crumbSep} aria-hidden="true" />
                  <li>
                    <a href="#">{c.name}</a>
                  </li>
                </React.Fragment>
              ))}
            </ol>
          </nav>

          <div className={styles.main}>
            {/* ── galeria (sem zoom, sem vídeo): miniaturas à esquerda da foto 4:5 ── */}
            <div className={styles.gallery} data-role="pdp-gallery">
              <div className={styles.thumbs} role="group" aria-label="Imagens do produto">
                {IMAGES.map((img, i) => (
                  <button
                    key={img.url}
                    type="button"
                    className={`${styles.thumb}${i === slide ? ` ${styles.thumbOn}` : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={i === slide ? `Imagem ${i + 1}, atual` : `Imagem ${i + 1}`}
                    aria-current={i === slide ? 'true' : undefined}
                    data-role="pdp-thumb"
                  >
                    <img src={img.url} alt="" width={88} height={110} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
              <div className={styles.stage}>
                <div ref={railRef} className={styles.rail} onScroll={onRailScroll}>
                  {IMAGES.map((img, i) => (
                    <div key={img.url} className={styles.photo}>
                      <img src={img.url} alt={img.alternateName} width={800} height={1000} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                    </div>
                  ))}
                </div>
                {favButton(styles.favPhoto)}
                <span className={styles.counter} aria-hidden="true" data-role="pdp-counter">
                  {slide + 1} <span>/ {IMAGES.length}</span>
                </span>
                <div className={styles.arrows}>
                  <button type="button" className={styles.arrow} onClick={() => goTo(slide - 1)} disabled={slide <= 0} aria-label="Imagem anterior">
                    {svg(18, <path d="m15 6-6 6 6 6" />)}
                  </button>
                  <button
                    type="button"
                    className={styles.arrow}
                    onClick={() => goTo(slide + 1)}
                    disabled={slide >= IMAGES.length - 1}
                    aria-label="Próxima imagem"
                  >
                    {svg(18, <path d="m9 6 6 6-6 6" />)}
                  </button>
                </div>
                <div className={styles.dashes} aria-label={`Imagem ${slide + 1} de ${IMAGES.length}`} role="img">
                  {IMAGES.map((img, i) => (
                    <span key={img.url} className={i === slide ? styles.dashOn : undefined} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── coluna de compra ── */}
            <div className={styles.info}>
              <div className={styles.head}>
                <span className={styles.brand} data-role="pdp-brand">
                  {BRAND}
                </span>
                <h1 className={styles.title} data-role="pdp-title">
                  {PRODUCT_NAME}
                </h1>
                <div className={styles.meta}>
                  <a className={styles.rating} href="#avaliacoes" data-role="pdp-rating">
                    <Stars avg={RATING.average} />
                    <span className={styles.srOnly}>Nota {RATING.average.toFixed(1).replace('.', ',')} de 5, </span>
                    <span className={styles.ratingCount}>
                      {RATING.totalCount.toLocaleString('pt-BR')} {RATING_COUNT_LABEL}
                    </span>
                  </a>
                  <span data-role="pdp-code">
                    {CODE_LABEL} {sku}
                  </span>
                </div>
              </div>

              <div className={styles.prices} data-role="pdp-prices">
                <span className={styles.priceRow}>
                  <span className={styles.price} data-role="pdp-price">
                    {money(PRICE)}
                  </span>
                </span>
                {best || pixValue !== null ? (
                  <span className={styles.payLine}>
                    {best && (
                      <span data-role="pdp-installment">
                        {best.installmentNumber}x de {money(best.installmentValue)} {best.installmentInterest === 0 ? 'sem juros' : 'com juros'}
                      </span>
                    )}
                    {best && pixValue !== null && (
                      <span className={styles.paySep} aria-hidden="true">
                        {' · '}
                      </span>
                    )}
                    {pixValue !== null && <span data-role="pdp-pix">ou {money(pixValue)} no Pix</span>}
                  </span>
                ) : null}
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
                      href={c.active ? undefined : '#'}
                      aria-current={c.active ? 'true' : undefined}
                      aria-label={`${c.value}${c.active ? ', selecionada' : ''}`}
                      title={c.value}
                      data-role="pdp-swatch"
                    >
                      <img src={c.src} alt="" width={64} height={80} loading="lazy" decoding="async" />
                    </a>
                  ))}
                </div>
              </div>

              <div className={styles.group} data-role="pdp-axis">
                <div className={styles.legendRow}>
                  <p className={styles.legend}>
                    <span id={`${uid}-axis`}>{AXIS_NAME}: </span>
                    <span className={styles.legendValue}>{activeAxis}</span>
                  </p>
                  <button
                    ref={guideTriggerRef}
                    type="button"
                    className={styles.guide}
                    onClick={() => setGuideOpen(true)}
                    aria-haspopup="dialog"
                    data-role="pdp-size-guide"
                  >
                    <span className={styles.guideIcon}>{svg(16, RULER)}</span>
                    {SIZE_GUIDE_LABEL}
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
                {soldOutOptions.length > 0 && inStock && (
                  <button
                    type="button"
                    className={styles.soldNote}
                    onClick={() => openNotify(soldOutOptions.length === 1 ? soldOutOptions[0].value : null)}
                    aria-expanded={notifyOpen}
                    aria-controls={`${uid}-notify`}
                    data-role="pdp-sold-out-note"
                  >
                    <span className={styles.bell}>{svg(16, BELL)}</span>
                    {/* Texto num <span> comum (não flex): o espaço entre as palavras não some. */}
                    <span className={styles.soldText}>
                      <span className={styles.dsk}>{soldQuestion}</span>
                      <span className={styles.mob}>{soldQuestionMobile}</span>
                    </span>
                    <span className={styles.notifyLink}>{NOTIFY.label}</span>
                  </button>
                )}
              </div>

              {showNotify && (
                <form id={`${uid}-notify`} ref={notifyRef} className={styles.notify} onSubmit={onNotify} data-role="pdp-notify">
                  {notifySent ? (
                    <p className={styles.notifyOk} role="status">
                      {NOTIFY.success}
                    </p>
                  ) : (
                    <>
                      <p className={styles.legend}>
                        {NOTIFY.label}
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
                      <label className={styles.field}>
                        <span className={styles.srOnly}>{NOTIFY.name}</span>
                        <input
                          className={styles.input}
                          type="text"
                          autoComplete="name"
                          required
                          placeholder={NOTIFY.name}
                          value={notifyName}
                          onChange={e => setNotifyName(e.target.value)}
                        />
                      </label>
                      <div className={styles.lineRow}>
                        <label className={styles.field}>
                          <span className={styles.srOnly}>{NOTIFY.email}</span>
                          <input
                            className={styles.input}
                            type="email"
                            autoComplete="email"
                            required
                            placeholder={NOTIFY.email}
                            value={notifyEmail}
                            onChange={e => setNotifyEmail(e.target.value)}
                          />
                        </label>
                        <button type="submit" className={styles.lineButton}>
                          {NOTIFY.submit}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}

              {/* ── quantidade + coração (desktop) e o botão de compra ── */}
              <div className={styles.buyBlock} data-role="pdp-buy-row">
                <div className={styles.buyTop}>
                  {inStock && (
                    <div className={styles.qty} role="group" aria-label="Quantidade">
                      <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Diminuir quantidade" disabled={qty <= 1}>
                        {svg(14, MINUS, { strokeWidth: 1.5 })}
                      </button>
                      <span className={styles.qtyValue} aria-live="polite">
                        {qty}
                      </span>
                      <button type="button" onClick={() => setQty(q => Math.min(99, q + 1))} aria-label="Aumentar quantidade">
                        {svg(14, PLUS, { strokeWidth: 1.5 })}
                      </button>
                    </div>
                  )}
                  {favButton(styles.favSide)}
                </div>
                <button type="button" className={styles.buy} data-role="pdp-buy">
                  <span className={styles.buyIcon}>{svg(17, BAG)}</span>
                  <span>{BUY_LABEL}</span>
                </button>
              </div>

              <form className={styles.shipping} onSubmit={onCep} data-role="pdp-shipping">
                <label className={styles.legend} htmlFor={`${uid}-cep`}>
                  {SHIPPING.label}
                </label>
                <div className={styles.lineRow}>
                  <input
                    id={`${uid}-cep`}
                    className={styles.input}
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={9}
                    placeholder={SHIPPING.placeholder}
                    value={cep}
                    onChange={e => setCep(formatCep(e.target.value))}
                  />
                  <button type="submit" className={styles.lineButton}>
                    {SHIPPING.button}
                  </button>
                </div>
                {cepSent && (
                  <ul className={styles.shipList} aria-live="polite" data-role="pdp-shipping-options">
                    {SHIP_OPTIONS.map(o => (
                      <li key={o.id} className={styles.shipRow}>
                        <span>
                          {o.name} · {o.eta}
                        </span>
                        <span>{o.price}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <span className={styles.shippingNote} data-role="pdp-shipping-note">
                  {SHIPPING.note}
                </span>
              </form>

              <div className={styles.accordions} data-role="pdp-accordions">
                {ACCORDIONS.map((a, i) => {
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
                        <span>{a.title}</span>
                        {svg(14, open ? MINUS : PLUS)}
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
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {guideOpen && (
          <div className={styles.overlay} onClick={() => setGuideOpen(false)}>
            <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={SIZE_GUIDE_LABEL} onClick={e => e.stopPropagation()}>
              <div className={styles.dialogHead}>
                <span className={styles.legend}>{SIZE_GUIDE_LABEL}</span>
                <button ref={guideCloseRef} type="button" className={styles.close} onClick={() => setGuideOpen(false)} aria-label="Fechar">
                  {svg(20, <path d="M6 6l12 12M18 6 6 18" />)}
                </button>
              </div>
              <img className={styles.guideImg} src={GUIDE_URL} alt={`${SIZE_GUIDE_LABEL} — ${PRODUCT_NAME}`} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

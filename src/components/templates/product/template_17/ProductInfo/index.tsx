'use client';

import React, { useId, useRef, useState } from 'react';

import { FONTES_17 } from '@/components/templates/common/template_17/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductDetails17` do faststore.starter (família 17, Pet; desenho
 * `ProductInfo17`): à esquerda a foto 1:1 no primário a 9% com o quadro branco por dentro, o -N%
 * em pílula tangerina e as setas brancas redondas, com 5 miniaturas embaixo (no mobile, os
 * pontos); à direita a marca, o nome em Bricolage, a nota + o código, o "de" riscado com o -N%,
 * o preço, a parcela e a pílula do Pix; o PESO em pílulas com o esgotado tracejado e riscado +
 * "O pacote de 1 kg esgotou? Avise-me quando chegar" (o Avise-me abre EM LINHA, não é modal); a
 * quantidade + "Favoritar"; "Adicionar à sacola" de largura total; o frete por CEP num cartão e os
 * acordeões. Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Sem trilha própria: a da página de produto é a da breadcrumb comum (Breadcrumb17).
 *
 * Lá tudo vem do produto da PDP (usePDP), do Reviews and Ratings e do orderForm; aqui é o exemplo
 * do mock.ts de lá, já resolvido (as fotos são o recorte bege da embalagem, SVG inline sem rede).
 * Como no palco de lá, trocar o peso é local e mostra o preço do SKU escolhido; a parcela e o Pix
 * são só do SKU do produto de exemplo (o plano de pagamento é do SKU da página). Compra, favorito,
 * Avise-me e CEP não chamam nada: só alternam estado local.
 */
const embalagem = (hex: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect x="200" y="80" width="400" height="680" rx="17" fill="${hex}"/></svg>`
  )}`;
const BRL = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n: number) => `R$ ${BRL.format(n)}`;

const L = {
  codeLabel: 'Cód.',
  ratingCountLabel: 'avaliações',
  soldOutText: 'O pacote de {valor} esgotou?',
  notifyLabel: 'Avise-me quando chegar',
  notifyNamePlaceholder: 'Seu nome',
  notifyEmailPlaceholder: 'Seu e-mail',
  notifySubmitLabel: 'Avisar',
  notifySuccess: 'Pronto! Avisamos por e-mail quando o pacote voltar.',
  buyLabel: 'Adicionar à sacola',
  favoriteLabel: 'Favoritar',
  shippingLabel: 'Calcular frete e prazo',
  cepPlaceholder: '00000-000',
  cepButtonLabel: 'Calcular',
  freeShippingLabel: 'Sem custo',
};
const PRODUCT_NAME = 'Ração Premium Cães Adultos Frango e Arroz 15 kg';
const BRAND = 'Nobre Pet';
const IMAGES = ['#D8CFC0', '#CFC4B2', '#D9D3C6', '#C9D2CE', '#DDD5C5'].map((hex, i) => ({
  url: embalagem(hex) + `#${i}`,
  alternateName: `Ração Premium Cães Adultos Frango e Arroz — foto ${i + 1}`,
}));
const RATING = { average: 4.9, totalCount: 214 };
const AXIS = 'Peso';
// O peso da embalagem: valor, código do SKU, preço, preço "de" e estoque (o de 1 kg esgotou).
const PESOS = [
  { value: '1 kg', sku: 'NP-CA-FA01', price: 39.9, listPrice: 46.9, available: false },
  { value: '3 kg', sku: 'NP-CA-FA03', price: 109.9, listPrice: 129.9, available: true },
  { value: '10,1 kg', sku: 'NP-CA-FA10', price: 249.9, listPrice: 289.9, available: true },
  { value: '15 kg', sku: 'NP-CA-FA15', price: 329.9, listPrice: 389.9, available: true },
];
const ATUAL = '15 kg';
const SOLD = PESOS.filter(p => !p.available);
// O plano do SKU de 15 kg (availableInstallments de lá, já resolvido): 6x sem juros e o Pix.
const BEST = { installmentNumber: 6, installmentValue: 54.98 };
const PIX = 316.7;
const SHIPPING = [
  { id: 'normal', label: 'Entrega padrão · até 5 dias úteis', price: 'R$ 18,90', free: false },
  { id: 'expressa', label: 'Entrega expressa · até 1 dia útil', price: 'R$ 29,90', free: false },
  { id: 'retirada', label: 'Retirar na loja · [Loja Centro] em 2 h', price: L.freeShippingLabel, free: true },
];
const ACCORDIONS = [
  {
    title: 'Indicação',
    lines: [
      'Para cães adultos de porte médio e grande, a partir de 12 meses. Ajuda a manter o peso ideal, a pelagem brilhante e as fezes firmes.',
    ],
  },
  {
    title: 'Composição',
    lines: [
      'Farinha de vísceras de frango, arroz quebrado, milho integral moído, gordura de frango, polpa de beterraba, óleo de peixe, cloreto de sódio, vitaminas e minerais.',
    ],
  },
  {
    title: 'Níveis de garantia',
    lines: ['Umidade (máx.) 10%', 'Proteína bruta (mín.) 26%', 'Extrato etéreo (mín.) 14%', 'Matéria fibrosa (máx.) 3,5%'],
  },
  {
    title: 'Modo de usar',
    lines: [
      'Faça a transição em 7 dias, misturando a ração nova à antiga.',
      'Ofereça a quantidade da tabela da embalagem, dividida em duas refeições.',
      'Deixe água fresca sempre à vontade.',
    ],
  },
];

const svg = (size: number, body: React.ReactNode, extra: Record<string, unknown> = {}) => (
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
const HEART = 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';
const STAR = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';
const BAG = (
  <>
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </>
);
const BELL = (
  <>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </>
);
const PIX_ICON = (
  <>
    <path d="M12 3l9 9-9 9-9-9z" />
    <path d="M9 12h6" />
  </>
);
const TRUCK = (
  <>
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </>
);
const MINUS = <path d="M5 12h14" />;
const PLUS = <path d="M12 5v14M5 12h14" />;

/** Cinco estrelas (as que passam da nota ficam apagadas). */
const Stars = ({ avg }: { avg: number }) => (
  <span className={styles.stars} aria-hidden="true">
    {[0, 1, 2, 3, 4].map(i => (
      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" opacity={avg >= i + 0.5 ? 1 : 0.28}>
        <path d={STAR} />
      </svg>
    ))}
  </span>
);

/** "1 kg" / "1 kg e 3 kg" / "1 kg, 3 kg e 10,1 kg". */
const joinValues = (values: string[]) =>
  values.length <= 1 ? values.join('') : `${values.slice(0, -1).join(', ')} e ${values[values.length - 1]}`;

export default function ProductInfo17() {
  const uid = useId();
  const [selAxis, setSelAxis] = useState(ATUAL);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [openAcc, setOpenAcc] = useState(0);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyOk, setNotifyOk] = useState(false);
  const [cep, setCep] = useState('');
  const [isFav, setIsFav] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const notifyRef = useRef<HTMLFormElement>(null);

  const current = PESOS.find(p => p.value === selAxis) ?? PESOS[PESOS.length - 1];
  const { sku, price, listPrice } = current;
  const discount = listPrice > price && price > 0 ? Math.round(((listPrice - price) / listPrice) * 100) : 0;
  // O plano de pagamento é só do SKU do produto de exemplo (como no palco de lá).
  const ownPlan = current.value === ATUAL;
  const best = ownPlan ? BEST : null;
  const pixValue = ownPlan && PIX < price ? PIX : null;
  const notifyFor = SOLD[0]?.value ?? null;
  const soldQuestion = L.soldOutText.replace(/\{valor\}/g, joinValues(SOLD.map(o => o.value)));
  const axisId = `${uid}-peso`;

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
  const openNotify = () => {
    setNotifyOpen(true);
    setNotifyOk(false);
    window.setTimeout(() => {
      const el = notifyRef.current;
      el?.scrollIntoView({ block: 'center' });
      el?.querySelector('input')?.focus();
    }, 0);
  };

  return (
    <div className={styles.productDetails17Box}>
      <section className={styles.productDetails17} aria-label={PRODUCT_NAME} data-role="pdp-root">
        <link rel="stylesheet" href={FONTES_17} />
        <div className={styles.inner}>
          <div className={styles.main}>
            {/* ── galeria (sem zoom, sem vídeo) ── */}
            <div className={styles.gallery} data-role="pdp-gallery">
              <div className={styles.stage}>
                <div ref={railRef} className={styles.rail} onScroll={onRailScroll}>
                  {IMAGES.map((img, i) => (
                    <div key={img.url} className={styles.photo}>
                      <span className={styles.frame}>
                        <img
                          src={img.url}
                          alt={img.alternateName}
                          width={800}
                          height={800}
                          loading={i === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </span>
                    </div>
                  ))}
                </div>
                {discount > 0 && (
                  <span className={styles.photoTag} data-role="pdp-photo-discount">
                    -{discount}%
                  </span>
                )}
                <button
                  type="button"
                  className={`${styles.arrow} ${styles.arrowPrev}`}
                  onClick={() => goTo(slide - 1)}
                  disabled={slide <= 0}
                  aria-label="Imagem anterior"
                >
                  {svg(20, <path d="m15 6-6 6 6 6" />, { strokeWidth: 2 })}
                </button>
                <button
                  type="button"
                  className={`${styles.arrow} ${styles.arrowNext}`}
                  onClick={() => goTo(slide + 1)}
                  disabled={slide >= IMAGES.length - 1}
                  aria-label="Próxima imagem"
                >
                  {svg(20, <path d="m9 6 6 6-6 6" />, { strokeWidth: 2 })}
                </button>
              </div>
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
                    <img src={img.url} alt="" width={120} height={120} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
              <div className={styles.dots} aria-hidden="true">
                {IMAGES.map((img, i) => (
                  <span key={img.url} className={`${styles.dot}${i === slide ? ` ${styles.dotOn}` : ''}`} />
                ))}
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
                    <span className={styles.srOnly}>Nota </span>
                    <span className={styles.ratingAvg}>{RATING.average.toFixed(1).replace('.', ',')}</span>
                    <span className={styles.srOnly}> de 5, </span>
                    <span className={styles.ratingCount}>
                      {RATING.totalCount.toLocaleString('pt-BR')} {L.ratingCountLabel}
                    </span>
                  </a>
                  <span data-role="pdp-code">
                    {L.codeLabel} {sku}
                  </span>
                </div>
              </div>

              <div className={styles.prices} data-role="pdp-prices">
                {discount > 0 && (
                  <span className={styles.listRow}>
                    <s className={styles.listPrice} data-role="pdp-list-price">
                      <span className={styles.srOnly}>De </span>
                      {money(listPrice)}
                    </s>
                    <span className={styles.discount} data-role="pdp-discount">
                      -{discount}%
                    </span>
                  </span>
                )}
                <span className={styles.price} data-role="pdp-price">
                  {discount > 0 && <span className={styles.srOnly}>Por </span>}
                  {money(price)}
                </span>
                {best && (
                  <span className={styles.installment} data-role="pdp-installment">
                    ou {best.installmentNumber}x de {money(best.installmentValue)} sem juros
                  </span>
                )}
                {pixValue !== null && (
                  <span className={styles.pix} data-role="pdp-pix">
                    <span className={styles.pixIcon}>{svg(16, PIX_ICON)}</span>
                    <strong>{money(pixValue)}</strong>
                    <span>no Pix</span>
                  </span>
                )}
              </div>

              <div className={styles.group} data-role="pdp-axis">
                <p className={styles.legend} id={axisId}>
                  {AXIS}: <strong>{current.value}</strong>
                </p>
                <div className={styles.pills} role="group" aria-labelledby={axisId}>
                  {PESOS.map(o => {
                    if (!o.available) {
                      return (
                        <span
                          key={o.value}
                          className={`${styles.pill} ${styles.pillOut}`}
                          aria-label={`${o.value}, esgotado`}
                          data-role="pdp-axis-out"
                        >
                          {o.value}
                        </span>
                      );
                    }
                    if (o.value === selAxis) {
                      return (
                        <span
                          key={o.value}
                          className={`${styles.pill} ${styles.pillOn}`}
                          aria-current="true"
                          data-role="pdp-axis-option"
                        >
                          {o.value}
                        </span>
                      );
                    }
                    return (
                      <a
                        key={o.value}
                        className={styles.pill}
                        role="button"
                        tabIndex={0}
                        onClick={e => {
                          e.preventDefault();
                          setSelAxis(o.value);
                          setNotifyOpen(false);
                        }}
                        data-role="pdp-axis-option"
                      >
                        {o.value}
                      </a>
                    );
                  })}
                </div>
                {SOLD.length > 0 && (
                  <p className={styles.soldNote} data-role="pdp-sold-out-note">
                    {svg(18, BELL)}
                    <span>
                      {`${soldQuestion} `}
                      <a
                        href={`#${uid}-notify`}
                        role="button"
                        className={styles.notifyLink}
                        onClick={e => {
                          e.preventDefault();
                          openNotify();
                        }}
                        aria-expanded={notifyOpen}
                        aria-controls={`${uid}-notify`}
                        data-role="pdp-notify-link"
                      >
                        {L.notifyLabel}
                      </a>
                    </span>
                  </p>
                )}
              </div>

              {/* ── quantidade + favoritar; embaixo, a compra de largura total ── */}
              <div className={styles.buyArea} data-role="pdp-buy-area">
                <div className={styles.buyRow}>
                  <div className={styles.qty} role="group" aria-label="Quantidade">
                    <button
                      type="button"
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      aria-label="Diminuir quantidade"
                      disabled={qty <= 1}
                    >
                      {svg(18, MINUS, { strokeWidth: 2 })}
                    </button>
                    <span className={styles.qtyValue} aria-live="polite">
                      {qty}
                    </span>
                    <button type="button" onClick={() => setQty(q => Math.min(99, q + 1))} aria-label="Aumentar quantidade">
                      {svg(18, PLUS, { strokeWidth: 2 })}
                    </button>
                  </div>
                  <button
                    type="button"
                    className={`${styles.fav}${isFav ? ` ${styles.favOn}` : ''}`}
                    onClick={() => setIsFav(f => !f)}
                    aria-pressed={isFav}
                    data-role="pdp-favorite"
                  >
                    {svg(18, <path d={HEART} />, isFav ? { fill: 'currentColor' } : {})}
                    <span>{L.favoriteLabel}</span>
                  </button>
                </div>
                <button type="button" className={styles.buy} data-role="pdp-buy">
                  {svg(20, BAG)}
                  <span>{L.buyLabel}</span>
                </button>
              </div>

              {notifyOpen && (
                <form
                  id={`${uid}-notify`}
                  ref={notifyRef}
                  className={styles.notify}
                  onSubmit={e => {
                    e.preventDefault();
                    setNotifyOk(true);
                  }}
                  data-role="pdp-notify"
                >
                  {notifyOk ? (
                    <p className={styles.notifyOk} role="status">
                      {L.notifySuccess}
                    </p>
                  ) : (
                    <>
                      <p className={styles.notifyTitle}>
                        {svg(20, BELL)}
                        <span>
                          {L.notifyLabel}
                          {notifyFor ? ` · ${notifyFor}` : ''}
                        </span>
                      </p>
                      <label className={styles.srOnly} htmlFor={`${uid}-nname`}>
                        {L.notifyNamePlaceholder}
                      </label>
                      <input
                        id={`${uid}-nname`}
                        className={styles.input}
                        type="text"
                        autoComplete="name"
                        required
                        placeholder={L.notifyNamePlaceholder}
                      />
                      <div className={styles.fieldRow}>
                        <label className={styles.srOnly} htmlFor={`${uid}-nmail`}>
                          {L.notifyEmailPlaceholder}
                        </label>
                        <input
                          id={`${uid}-nmail`}
                          className={styles.input}
                          type="email"
                          autoComplete="email"
                          required
                          placeholder={L.notifyEmailPlaceholder}
                        />
                        <button type="submit" className={styles.notifySubmit}>
                          {L.notifySubmitLabel}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}

              <form className={styles.shipping} onSubmit={e => e.preventDefault()} data-role="pdp-shipping">
                <label className={styles.shipLabel} htmlFor={`${uid}-cep`}>
                  {svg(20, TRUCK)}
                  {L.shippingLabel}
                </label>
                <div className={styles.fieldRow}>
                  <input
                    id={`${uid}-cep`}
                    className={styles.input}
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={9}
                    placeholder={L.cepPlaceholder}
                    value={cep}
                    onChange={e => {
                      const d = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setCep(d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d);
                    }}
                  />
                  <button type="submit" className={styles.cepButton}>
                    {L.cepButtonLabel}
                  </button>
                </div>
                <ul className={styles.shipList} aria-live="polite" data-role="pdp-shipping-options">
                  {SHIPPING.map(o => (
                    <li key={o.id} className={styles.shipRow}>
                      <span>{o.label}</span>
                      <span className={o.free ? styles.shipFree : styles.shipPrice}>{o.price}</span>
                    </li>
                  ))}
                </ul>
              </form>

              <div className={styles.accordions} data-role="pdp-accordions">
                {ACCORDIONS.map((a, i) => {
                  const open = openAcc === i;
                  return (
                    <div key={a.title} className={styles.acc}>
                      <button
                        type="button"
                        className={styles.accBtn}
                        aria-expanded={open}
                        aria-controls={`${uid}-acc-${i}`}
                        id={`${uid}-accb-${i}`}
                        onClick={() => setOpenAcc(o => (o === i ? -1 : i))}
                        data-role="pdp-accordion"
                      >
                        <span>{a.title}</span>
                        {svg(18, open ? MINUS : PLUS, { strokeWidth: 2 })}
                      </button>
                      <div
                        id={`${uid}-acc-${i}`}
                        role="region"
                        aria-labelledby={`${uid}-accb-${i}`}
                        className={styles.accPanel}
                        hidden={!open}
                      >
                        {a.lines.length > 1 ? (
                          <ul>
                            {a.lines.map(l => (
                              <li key={l}>{l}</li>
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

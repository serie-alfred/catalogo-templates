'use client';

import React, { useId, useRef, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

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
 * Sai: `usePDP`, `useBuyButton`, `useWishList`, a nota do Reviews and Ratings, a
 * simulação de frete e o analytics. Ficam de fora, porque com o mock do starter
 * nunca renderizam: o guia de medidas (o produto não tem a especificação), a nota
 * de esgotado e o formulário "Avise-me" (as duas opções estão em estoque).
 */

const BRL = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n: number) => `R$ ${BRL.format(n)}`;

/** O mesmo `formatShippingPrice` do `utils/shipping` do starter (centavos). */
const shipPrice = (cents: number) =>
  cents > 0 ? (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'Grátis';

const block = (hex: string, size: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="${hex}"/></svg>`
  )}`;

const PRODUCT_NAME = 'Smartphone X5 128 GB 5G Tela 6,7" Preto';
const BRAND = '[Marca 01]';
const SKU = '0000000';
const PRICE = 1799;
const LIST = 2299;
const DISCOUNT = Math.round((1 - PRICE / LIST) * 100);
const RATING = { average: 4.8, totalCount: 1284 };
const PIX = 1709.05;
const BEST = { installmentNumber: 10, installmentValue: 179.9, installmentInterest: 0 };
const PLANS = [
  { installmentNumber: 1, installmentValue: 1799, installmentInterest: 0 },
  { installmentNumber: 2, installmentValue: 899.5, installmentInterest: 0 },
  { installmentNumber: 5, installmentValue: 359.8, installmentInterest: 0 },
  { installmentNumber: 10, installmentValue: 179.9, installmentInterest: 0 },
];

const IMAGES = ['#EEF1F5', '#E7ECF3', '#F3F4F6', '#E9EEF6', '#EDEFF2', '#EEF1F5', '#E7ECF3'].map((hex, i) => ({
  url: block(hex, 800) + `#${i}`,
  alternateName: `Smartphone X5 Preto — foto ${i + 1}`,
}));

const COLORS = [
  { value: 'Preto', label: 'Preto', active: true, src: block('#E4E7EC', 80) },
  { value: 'Azul', label: 'Azul', active: false, src: block('#E7ECF3', 80) },
  { value: 'Grafite', label: 'Grafite', active: false, src: block('#F3F4F6', 80) },
];
const AXIS_NAME = 'Armazenamento';
const AXIS_OPTIONS = ['128 GB', '256 GB'];

const HIGHLIGHTS = [
  { name: 'Tela', value: '6,7"' },
  { name: 'Armazenamento', value: '128 GB' },
  { name: 'Conexão', value: '5G' },
  { name: 'Bateria', value: '5.000 mAh' },
];

const SHIPPING = [
  { id: 'normal', friendlyName: 'Normal', price: 1990, eta: 'até 5 dias úteis' },
  { id: 'expressa', friendlyName: 'Expressa', price: 3490, eta: 'até 2 dias úteis' },
  { id: 'retirada', friendlyName: 'Retirar na loja', price: 0, eta: 'até 2 horas' },
];

const MOCK = {
  codeLabel: 'Cód.',
  ratingCountLabel: 'avaliações',
  installmentsLinkLabel: 'ver parcelamento',
  pixText: 'à vista, com aprovação na hora',
  buyLabel: 'Adicionar ao carrinho',
  mobileBuyLabel: 'Adicionar',
  shippingLabel: 'Calcular frete e prazo',
  cepPlaceholder: '00000-000',
  cepButtonLabel: 'Calcular',
  cepHelpLabel: 'Não sei meu CEP',
  postalCode: '01310-100',
};

const THUMBS = 4;

const svg = (size: number, body: React.ReactNode, extra: React.SVGProps<SVGSVGElement> = {}) => (
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
const STAR = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';
const HEART = 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';
const CART = (
  <>
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
    <path d="M2 3h3l2.5 12h12l2-8H6.2" />
  </>
);
const TRUST: Array<{ text: string; icon: React.ReactNode }> = [
  { text: 'Compra segura', icon: <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3z" /> },
  {
    text: 'Troca em até 7 dias',
    icon: (
      <>
        <path d="M4 9h12a4 4 0 0 1 0 8H8" />
        <path d="m8 5-4 4 4 4" />
      </>
    ),
  },
  {
    text: 'Nota fiscal',
    icon: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
  },
];

export default function ProductInfo10() {
  const uid = useId();
  const [selAxis, setSelAxis] = useState(AXIS_OPTIONS[0]);
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [allThumbs, setAllThumbs] = useState(false);
  const [plansOpen, setPlansOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [cep, setCep] = useState(MOCK.postalCode);
  const railRef = useRef<HTMLDivElement>(null);

  const onRailScroll = () => {
    const el = railRef.current;
    if (el && el.clientWidth) setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i: number) => {
    const el = railRef.current;
    setSlide(i);
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'auto' });
  };

  const showPlus = IMAGES.length > THUMBS + 1 && !allThumbs;
  const thumbs = showPlus ? IMAGES.slice(0, THUMBS) : IMAGES;
  const code10 = `${MOCK.codeLabel} ${SKU}`;
  const avgText = RATING.average.toFixed(1).replace('.', ',');
  const activeColorLabel = COLORS.find(c => c.active)?.label ?? '';

  const buyButton = (extra: string, label?: string) => (
    <button type="button" className={`${styles.buy} ${extra}`} data-role="pdp-buy">
      {svg(20, CART, { strokeWidth: 2 })}
      {label || MOCK.buyLabel}
    </button>
  );

  const highlightList = (extra: string) => (
    <ul className={`${styles.highlights} ${extra}`} data-role="pdp-highlights">
      {HIGHLIGHTS.map(h => (
        <li key={h.name} className={styles.highlight}>
          <span className={styles.highlightName}>{h.name}</span>
          <strong className={styles.highlightValue}>{h.value}</strong>
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles.productDetails10Box}>
      <section className={styles.productDetails10} aria-label={PRODUCT_NAME} data-role="pdp-root">
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          {/* ── coluna da galeria (sem zoom, sem vídeo) + destaques no desktop ── */}
          <div className={styles.left}>
            <div className={styles.galleryCard} data-role="pdp-gallery">
              <div className={styles.thumbs} role="group" aria-label="Imagens do produto">
                {thumbs.map((img, i) => (
                  <button
                    key={img.url}
                    type="button"
                    className={`${styles.thumb}${i === slide ? ` ${styles.thumbOn}` : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Imagem ${i + 1}`}
                    aria-current={i === slide ? 'true' : undefined}
                    data-role="pdp-thumb"
                  >
                    <img src={img.url} alt="" width={76} height={76} loading="lazy" decoding="async" />
                  </button>
                ))}
                {showPlus && (
                  <button
                    type="button"
                    className={`${styles.thumb} ${styles.thumbMore}`}
                    onClick={() => setAllThumbs(true)}
                    aria-label={`Ver mais ${IMAGES.length - THUMBS} imagens`}
                    data-role="pdp-thumb-more"
                  >
                    +{IMAGES.length - THUMBS}
                  </button>
                )}
              </div>
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
                        fetchPriority={i === 0 ? 'high' : undefined}
                      />
                    </div>
                  ))}
                </div>
                <span className={styles.photoTag} data-role="pdp-discount">
                  -{DISCOUNT}%
                </span>
                <button
                  type="button"
                  className={`${styles.fav}${isFav ? ` ${styles.favOn}` : ''}`}
                  onClick={() => setIsFav(f => !f)}
                  aria-pressed={isFav}
                  aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  data-role="pdp-favorite"
                >
                  {svg(20, <path d={HEART} />, isFav ? { fill: 'currentColor' } : {})}
                </button>
                <div className={styles.dots} aria-hidden="true">
                  {IMAGES.map((img, i) => (
                    <span key={img.url} className={i === slide ? styles.dotOn : undefined} />
                  ))}
                </div>
              </div>
            </div>
            {highlightList(styles.onlyDesktop)}
          </div>

          {/* ── coluna de compra ── */}
          <div className={styles.info}>
            <div className={styles.meta}>
              <a className={styles.brand} href="#" data-role="pdp-brand">
                {BRAND}
              </a>
              <span className={styles.code} data-role="pdp-code">
                {code10}
              </span>
            </div>
            <h1 className={styles.title} data-role="pdp-title">
              {PRODUCT_NAME}
            </h1>
            <div className={styles.rating} data-role="pdp-rating">
              <span className={styles.stars} aria-hidden="true">
                {[1, 2, 3, 4, 5].map(n => (
                  <svg
                    key={n}
                    className={n > 1 ? styles.onlyDesktop : undefined}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={n <= Math.round(RATING.average) ? 'currentColor' : 'none'}
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
                {RATING.totalCount.toLocaleString('pt-BR')} {MOCK.ratingCountLabel}
              </a>
            </div>

            <div className={styles.prices} data-role="pdp-prices">
              <div className={styles.listRow}>
                <s className={styles.listPrice} data-role="pdp-list-price">
                  de {money(LIST)}
                </s>
                <span className={styles.tag}>-{DISCOUNT}%</span>
              </div>
              <span className={styles.price} data-role="pdp-price">
                {money(PRICE)}
              </span>
              <p className={styles.installment} data-role="pdp-installment">
                ou{' '}
                <strong>
                  {BEST.installmentNumber}x de {money(BEST.installmentValue)}
                </strong>{' '}
                {BEST.installmentInterest === 0 ? 'sem juros' : 'com juros'}
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
                    {MOCK.installmentsLinkLabel}
                  </button>
                </span>
              </p>
              {plansOpen && (
                <ul id={`${uid}-plans`} className={styles.plans} data-role="pdp-installments">
                  {PLANS.map(p => (
                    <li key={p.installmentNumber}>
                      <span>
                        {p.installmentNumber}x de {money(p.installmentValue)}
                      </span>
                      <span className={styles.plansMeta}>
                        {p.installmentInterest === 0 ? 'sem juros' : 'com juros'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className={styles.pix} data-role="pdp-pix">
                {svg(
                  26,
                  <>
                    <path d="M12 3 21 12 12 21 3 12z" />
                    <path d="m8.5 12 3.5-3.5 3.5 3.5-3.5 3.5z" />
                  </>
                )}
                <span className={styles.pixCopy}>
                  <strong className={styles.pixValue}>{money(PIX)} no Pix</strong>
                  <span className={styles.pixText}>{MOCK.pixText}</span>
                </span>
              </div>
            </div>

            <div className={styles.group} data-role="pdp-colors">
              <span className={styles.groupLabel}>
                <strong>Cor:</strong> {activeColorLabel}
              </span>
              <div className={styles.colorRow}>
                {COLORS.map(c => (
                  <a
                    key={c.value}
                    className={`${styles.colorChip}${c.active ? ` ${styles.chipOn}` : ''}`}
                    href="#"
                    aria-current={c.active ? 'true' : undefined}
                    data-role="pdp-swatch"
                  >
                    <span className={styles.swatch}>
                      <img src={c.src} alt="" width={40} height={40} loading="lazy" decoding="async" />
                    </span>
                    {c.label}
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.group} data-role="pdp-axis">
              <div className={styles.groupHead}>
                <strong className={styles.groupLabel} id={`${uid}-axis`}>
                  {AXIS_NAME}
                </strong>
              </div>
              <div className={styles.axisRow} role="group" aria-labelledby={`${uid}-axis`}>
                {AXIS_OPTIONS.map(v => (
                  <button
                    key={v}
                    type="button"
                    className={`${styles.axisChip}${v === selAxis ? ` ${styles.chipOn}` : ''}`}
                    aria-pressed={v === selAxis}
                    onClick={() => setSelAxis(v)}
                    data-role="pdp-axis-option"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {highlightList(styles.onlyMobile)}

            <div className={`${styles.buyRow} ${styles.onlyDesktop}`} data-role="pdp-buy-row">
              <div className={styles.qty} role="group" aria-label="Quantidade">
                <button
                  type="button"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  aria-label="Diminuir quantidade"
                  disabled={qty <= 1}
                >
                  {svg(18, <path d="M5 12h14" />, { strokeWidth: 2 })}
                </button>
                <span aria-live="polite">{qty}</span>
                <button type="button" onClick={() => setQty(q => Math.min(99, q + 1))} aria-label="Aumentar quantidade">
                  {svg(18, <path d="M12 5v14M5 12h14" />, { strokeWidth: 2 })}
                </button>
              </div>
              {buyButton('')}
            </div>

            <div className={styles.shipping} data-role="pdp-shipping">
              <label className={styles.groupLabel} htmlFor={`${uid}-cep`}>
                {MOCK.shippingLabel}
              </label>
              <form className={styles.fieldRow} onSubmit={e => e.preventDefault()}>
                <input
                  id={`${uid}-cep`}
                  className={styles.input}
                  type="text"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={9}
                  placeholder={MOCK.cepPlaceholder}
                  value={cep}
                  onChange={e => setCep(e.target.value)}
                />
                <button type="submit" className={styles.darkBtn}>
                  {MOCK.cepButtonLabel}
                </button>
              </form>
              <a className={`${styles.cepHelp} ${styles.onlyDesktop}`} href="#">
                {MOCK.cepHelpLabel}
              </a>
              <table className={styles.shipTable} aria-live="polite" data-role="pdp-shipping-options">
                <tbody>
                  {SHIPPING.map(o => (
                    <tr key={o.id}>
                      <td className={styles.shipName}>{o.friendlyName}</td>
                      <td className={styles.shipEta}>{o.eta}</td>
                      <td className={`${styles.shipPrice}${o.price > 0 ? '' : ` ${styles.shipFree}`}`}>
                        {shipPrice(o.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className={styles.trust} data-role="pdp-trust">
              {TRUST.map(t => (
                <li key={t.text}>
                  {svg(20, t.icon, { className: styles.trustIcon })}
                  {t.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── barra de compra do mobile: o botão de compra do mobile (gruda no rodapé) ── */}
        <div className={styles.mobileBar} data-role="pdp-mobile-bar">
          <span className={styles.mobilePrice}>
            <strong className={styles.mobilePriceValue}>{money(PRICE)}</strong>
            <span className={styles.mobilePix}>{money(PIX)} no Pix</span>
          </span>
          {buyButton(styles.buyMobile, MOCK.mobileBuyLabel)}
        </div>
      </section>
    </div>
  );
}

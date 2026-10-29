'use client';

import React, { useId, useRef, useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductDetails16` do faststore.starter (família 16, Infantil; desenho
 * `ProductInfo16`): a trilha; a foto 1:1 arredondada com o contador, o coração, as setas redondas e
 * as miniaturas; à direita a marca, o nome em Fredoka, a nota e o código, o selo amarelo da faixa
 * etária, o preço "de" com o -N%, o preço, a parcela e o Pix, a cor em bolinhas, o tamanho em
 * pílulas com o esgotado riscado e o Avise-me, quantidade + "Adicionar à sacola" + coração, o
 * frete por CEP e os acordeões. Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Lá tudo vem do produto da PDP (usePDP), do Reviews and Ratings e do orderForm; aqui é o exemplo
 * do mock.ts de lá, já resolvido (as fotos são os blocos pastel do mock, SVG inline sem rede).
 * Compra, favorito, Avise-me e CEP não chamam nada: só alternam estado local. O guia de medidas
 * abre o mesmo diálogo com a imagem branca de exemplo.
 */
const FONTES =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap';

const block = (hex: string, w: number, h = w) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${hex}"/></svg>`
  )}`;
const BRL = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n: number) => `R$ ${BRL.format(n)}`;

const L = {
  homeLabel: 'Início',
  counterOfLabel: 'de',
  codeLabel: 'Cód.',
  ratingCountLabel: 'avaliações',
  sizeGuideLabel: 'Guia de medidas',
  soldOutText: 'Acabou o tamanho?',
  notifyLabel: 'Avise-me quando chegar',
  notifyShortLabel: 'Avise-me',
  notifyNamePlaceholder: 'Seu nome',
  notifyEmailPlaceholder: 'Seu e-mail',
  notifySubmitLabel: 'Avisar',
  notifySuccess: 'Prontinho! Avisamos por e-mail quando o tamanho voltar.',
  buyLabel: 'Adicionar à sacola',
  favoriteLabel: 'Salvar nos favoritos',
  shippingLabel: 'Calcular frete',
  cepPlaceholder: '00000-000',
  cepButtonLabel: 'Calcular',
};
const PRODUCT_NAME = 'Pijama Algodão Estrelinhas';
const BRAND = 'Sua Marca';
const CRUMBS = [
  { item: '/roupas/', name: 'Roupas' },
  { item: '/roupas/pijamas/', name: 'Pijamas' },
];
const IMAGES = ['#E8E3F3', '#DEDAEE', '#EFE7D8', '#E2EDE9', '#F4E4DC'].map((hex, i) => ({
  url: block(hex, 800) + `#${i}`,
  alternateName: `${PRODUCT_NAME} — foto ${i + 1}`,
}));
const RATING = { average: 4.8, totalCount: 128 };
const AGE = 'Faixa etária: 2 a 10 anos';
const PRICE = 89.9;
const LIST = 109.9;
const DISCOUNT = Math.round(((LIST - PRICE) / LIST) * 100);
const BEST = { installmentNumber: 6, installmentValue: 14.98 };
const PIX = 85.4;
const COLOR_NAME = 'Cor';
const COLORS = [
  { value: 'Azul-céu', src: block('#CFE3F6', 56), active: true },
  { value: 'Rosa-chiclete', src: block('#F8D3DC', 56), active: false },
  { value: 'Amarelo-sol', src: block('#FBE7A8', 56), active: false },
];
const AXIS = 'Tamanho';
const SIZES = ['2', '4', '6', '8', '10'].map((s, i) => ({ value: s, sku: `[000000${i}]`, available: s !== '8' }));
const SOLD = SIZES.filter(s => !s.available);
const SHIPPING = [
  { id: 'normal', label: 'Normal · até 7 dias úteis', price: 'R$ 14,90', free: false },
  { id: 'expressa', label: 'Expressa · até 2 dias úteis', price: 'R$ 27,90', free: false },
  { id: 'retirada', label: 'Retirar na loja · [Loja Centro]', price: 'Grátis', free: true },
];
const ACCORDIONS = [
  {
    title: 'Detalhes',
    lines: [
      '100% algodão, macio e respirável',
      'Estampa de estrelinhas que não desbota na lavagem',
      'Punhos e barra com elástico suave',
    ],
  },
  {
    title: 'Entrega e trocas',
    lines: ['Enviamos para todo o Brasil; o prazo aparece no cálculo de frete.', 'A primeira troca é grátis em até 30 dias.'],
  },
];
const GUIDE_URL = block('#FFFFFF', 1200, 800);

const svg = (size: number, body: React.ReactNode, extra: Record<string, unknown> = {}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
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
const KID = (
  <>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M6 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5" />
  </>
);
const MINUS = <path d="M5 12h14" />;
const PLUS = <path d="M12 5v14M5 12h14" />;

const Stars = ({ avg }: { avg: number }) => (
  <span className={styles.stars} aria-hidden="true">
    {[0, 1, 2, 3, 4].map(i => (
      <svg key={i} viewBox="0 0 24 24" fill="currentColor" opacity={avg >= i + 0.5 ? 1 : 0.28}>
        <path d={STAR} />
      </svg>
    ))}
  </span>
);

export default function ProductInfo16() {
  const uid = useId();
  const [selAxis, setSelAxis] = useState('4');
  const [qty, setQty] = useState(1);
  const [slide, setSlide] = useState(0);
  const [openAcc, setOpenAcc] = useState(0);
  const [guideOpen, setGuideOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyOk, setNotifyOk] = useState(false);
  const [cep, setCep] = useState('');
  const [isFav, setIsFav] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  const selected = SIZES.find(s => s.value === selAxis);
  const sku = selected?.sku ?? '[SKU-0000]';
  const notifyFor = SOLD[0]?.value ?? null;

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

  const favButton = (extra: string) => (
    <button
      type="button"
      className={`${styles.fav} ${extra}${isFav ? ` ${styles.favOn}` : ''}`}
      onClick={() => setIsFav(f => !f)}
      aria-pressed={isFav}
      aria-label={L.favoriteLabel}
      data-role="pdp-favorite"
    >
      {svg(22, <path d={HEART} />, isFav ? { fill: 'currentColor', strokeWidth: 2.2 } : { strokeWidth: 2.2 })}
    </button>
  );

  return (
    <div className={styles.productDetails16Box}>
      <section className={styles.productDetails16} aria-label={PRODUCT_NAME} data-role="pdp-root">
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.inner}>
          <nav className={styles.crumbs} aria-label="Trilha de navegação" data-role="pdp-breadcrumb">
            <ol>
              <li>
                <a href="#">{L.homeLabel}</a>
              </li>
              {CRUMBS.map((c, i) => (
                <React.Fragment key={c.item}>
                  <li className={styles.crumbSep} aria-hidden="true">
                    ›
                  </li>
                  <li>
                    <a href="#" aria-current={i === CRUMBS.length - 1 ? 'page' : undefined}>
                      {c.name}
                    </a>
                  </li>
                </React.Fragment>
              ))}
            </ol>
          </nav>

          <div className={styles.main}>
            <div className={styles.gallery} data-role="pdp-gallery">
              <div className={styles.stage}>
                <div ref={railRef} className={styles.rail} onScroll={onRailScroll}>
                  {IMAGES.map((img, i) => (
                    <div key={img.url} className={styles.photo}>
                      <img src={img.url} alt={img.alternateName} width={800} height={800} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                    </div>
                  ))}
                </div>
                <span className={styles.counter} data-role="pdp-counter">
                  {slide + 1} {L.counterOfLabel} {IMAGES.length}
                </span>
                {favButton(styles.favPhoto)}
                <div className={styles.arrows}>
                  <button type="button" className={styles.arrow} onClick={() => goTo(slide - 1)} disabled={slide <= 0} aria-label="Imagem anterior">
                    {svg(20, <path d="m15 6-6 6 6 6" />, { strokeWidth: 2.6 })}
                  </button>
                  <button
                    type="button"
                    className={styles.arrow}
                    onClick={() => goTo(slide + 1)}
                    disabled={slide >= IMAGES.length - 1}
                    aria-label="Próxima imagem"
                  >
                    {svg(20, <path d="m9 6 6 6-6 6" />, { strokeWidth: 2.6 })}
                  </button>
                </div>
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
            </div>

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
                      {RATING.totalCount.toLocaleString('pt-BR')} {L.ratingCountLabel}
                    </span>
                  </a>
                  <span className={styles.code} data-role="pdp-code">
                    {L.codeLabel} {sku}
                  </span>
                </div>
                <span className={styles.age} data-role="pdp-age">
                  <span className={styles.ageIcon}>{svg(16, KID, { strokeWidth: 2.4 })}</span>
                  {AGE}
                </span>
              </div>

              <div className={styles.prices} data-role="pdp-prices">
                <span className={styles.listRow}>
                  <s className={styles.listPrice} data-role="pdp-list-price">
                    <span className={styles.srOnly}>De </span>
                    {money(LIST)}
                  </s>
                  <span className={styles.discount} data-role="pdp-discount">
                    -{DISCOUNT}%
                  </span>
                </span>
                <span className={styles.price} data-role="pdp-price">
                  <span className={styles.srOnly}>Por </span>
                  {money(PRICE)}
                </span>
                <span className={styles.installment} data-role="pdp-installment">
                  {BEST.installmentNumber}x de {money(BEST.installmentValue)} sem juros
                </span>
                <span className={styles.pix} data-role="pdp-pix">
                  {money(PIX)} no Pix
                </span>
              </div>

              <div className={styles.group} data-role="pdp-colors">
                <p className={styles.legend}>
                  <span id={`${uid}-color`}>{COLOR_NAME}: </span>
                  <span className={styles.legendValue}>{COLORS.find(c => c.active)?.value}</span>
                </p>
                <div className={styles.swatches} role="group" aria-labelledby={`${uid}-color`}>
                  {COLORS.map(c => (
                    <a
                      key={c.value}
                      className={`${styles.swatch}${c.active ? ` ${styles.swatchOn}` : ''}`}
                      href={c.active ? undefined : '#'}
                      aria-current={c.active ? 'true' : undefined}
                      aria-label={c.active ? `${c.value}, selecionada` : c.value}
                      title={c.value}
                      data-role="pdp-swatch"
                    >
                      <img src={c.src} alt="" width={56} height={56} loading="lazy" decoding="async" />
                    </a>
                  ))}
                </div>
              </div>

              <div className={styles.group} data-role="pdp-axis">
                <div className={styles.legendRow}>
                  <p className={styles.legend} id={`${uid}-axis`}>
                    {AXIS}
                  </p>
                  <button type="button" className={styles.guide} onClick={() => setGuideOpen(true)} aria-haspopup="dialog" data-role="pdp-size-guide">
                    <span className={styles.guideIcon}>{svg(18, RULER)}</span>
                    <span>{L.sizeGuideLabel}</span>
                  </button>
                </div>
                <div className={styles.sizes} role="group" aria-labelledby={`${uid}-axis`}>
                  {SIZES.map(o =>
                    o.available ? (
                      <button
                        key={o.value}
                        type="button"
                        className={`${styles.size}${o.value === selAxis ? ` ${styles.sizeOn}` : ''}`}
                        aria-pressed={o.value === selAxis}
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
                <p className={styles.soldNote} data-role="pdp-sold-out-note">
                  {svg(18, BELL)}
                  <span>
                    {L.soldOutText}{' '}
                    <button
                      type="button"
                      className={styles.notifyLink}
                      onClick={() => setNotifyOpen(true)}
                      aria-expanded={notifyOpen}
                      aria-controls={`${uid}-notify`}
                      data-role="pdp-notify-link"
                    >
                      <span className={styles.dsk}>{L.notifyLabel}</span>
                      <span className={styles.mob}>{L.notifyShortLabel}</span>
                    </button>
                  </span>
                </p>
              </div>

              <div className={styles.buyRow} data-role="pdp-buy-row">
                <div className={styles.qty} role="group" aria-label="Quantidade">
                  <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Diminuir quantidade" disabled={qty <= 1}>
                    {svg(16, MINUS, { strokeWidth: 2.6 })}
                  </button>
                  <span className={styles.qtyValue} aria-live="polite">
                    {qty}
                  </span>
                  <button type="button" onClick={() => setQty(q => Math.min(99, q + 1))} aria-label="Aumentar quantidade">
                    {svg(16, PLUS, { strokeWidth: 2.6 })}
                  </button>
                </div>
                <button type="button" className={styles.buy} data-role="pdp-buy">
                  <span className={styles.buyIcon}>{svg(20, BAG, { strokeWidth: 2.2 })}</span>
                  <span>{L.buyLabel}</span>
                </button>
                {favButton(styles.favSide)}
              </div>

              {notifyOpen && (
                <form
                  id={`${uid}-notify`}
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
                        {L.notifyLabel}
                        {notifyFor ? ` · ${notifyFor}` : ''}
                      </p>
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

              <form className={styles.shipping} onSubmit={e => e.preventDefault()} data-role="pdp-shipping">
                <label className={styles.shipLabel} htmlFor={`${uid}-cep`}>
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
                    onChange={e => setCep(e.target.value)}
                  />
                  <button type="submit" className={styles.cepButton}>
                    {L.cepButtonLabel}
                  </button>
                </div>
                <ul className={styles.shipList} aria-live="polite" data-role="pdp-shipping-options">
                  {SHIPPING.map(o => (
                    <li key={o.id} className={styles.shipRow}>
                      <span>{o.label}</span>
                      <span className={o.free ? styles.shipFree : undefined}>{o.price}</span>
                    </li>
                  ))}
                </ul>
              </form>

              <div className={styles.accordions} data-role="pdp-accordions">
                {ACCORDIONS.map((a, i) => {
                  const open = openAcc === i;
                  return (
                    <div key={a.title} className={`${styles.acc}${open ? ` ${styles.accOn}` : ''}`}>
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
                        {svg(18, open ? MINUS : PLUS, { strokeWidth: 2.6 })}
                      </button>
                      <div id={`${uid}-acc-${i}`} role="region" aria-labelledby={`${uid}-accb-${i}`} className={styles.accPanel} hidden={!open}>
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

        {guideOpen && (
          <div className={styles.overlay} onClick={() => setGuideOpen(false)}>
            <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={L.sizeGuideLabel} onClick={e => e.stopPropagation()}>
              <div className={styles.dialogHead}>
                <strong>{L.sizeGuideLabel}</strong>
                <button type="button" className={styles.close} onClick={() => setGuideOpen(false)} aria-label="Fechar">
                  {svg(20, <path d="M6 6l12 12M18 6 6 18" />, { strokeWidth: 2.6 })}
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

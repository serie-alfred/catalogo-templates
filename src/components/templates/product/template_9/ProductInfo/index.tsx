import React, { useId, useRef, useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductDetails09` do faststore.starter (família 09, Editorial;
 * desenho `ProductInfo09` / `ProductInfo09-mobile`). Mesmo markup, mesmas classes,
 * mesmos `data-role`; o CSS é derivado do SCSS de lá.
 *
 * O que sai: `usePDP`, `useBuyButton`, `useWishList`, a nota (Reviews and Ratings),
 * o avise-me real (entidade AS), o frete do orderForm e o analytics. O conteúdo é o
 * `mock.ts` de lá (rótulos do CMS + produto de exemplo, com as fotos e miniaturas de
 * uma cor só). Como no palco do starter: sem nota, sem Pix (o plano de exemplo não
 * tem entrada Pix) e o CEP não calcula. `useState` fica para tamanho, slide,
 * acordeões, avise-me e guia de medidas.
 */

const BRL = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = (n: number) => `R$ ${BRL.format(n)}`;

const svg = (w: number, h: number, hex: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${hex}"/></svg>`
  )}`;

const GUIDE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#F7F4EF"/><g font-family="sans-serif" font-size="16" fill="#1D1B18"><text x="32" y="56">Tamanho</text><text x="200" y="56">Busto</text><text x="340" y="56">Cintura</text><text x="480" y="56">Quadril</text><text x="32" y="112">PP</text><text x="200" y="112">80</text><text x="340" y="112">62</text><text x="480" y="112">88</text><text x="32" y="168">P</text><text x="200" y="168">84</text><text x="340" y="168">66</text><text x="480" y="168">92</text><text x="32" y="224">M</text><text x="200" y="224">88</text><text x="340" y="224">70</text><text x="480" y="224">96</text><text x="32" y="280">G</text><text x="200" y="280">94</text><text x="340" y="280">76</text><text x="480" y="280">102</text><text x="32" y="336">GG</text><text x="200" y="336">100</text><text x="340" y="336">82</text><text x="480" y="336">108</text></g></svg>'
)}`;

const MOCK = {
  newLabel: 'Novidade',
  refLabel: 'Ref.',
  colorLabel: 'Cor',
  sizeLabel: 'Tamanho',
  sizeGuideLabel: 'Guia de medidas',
  soldOutText: 'esgotado.',
  notifyLabel: 'Avise-me quando chegar',
  notifyNamePlaceholder: 'Seu nome',
  notifyEmailPlaceholder: 'Seu e-mail',
  notifySubmitLabel: 'Avisar',
  notifySuccess: 'Pronto. Avisamos por e-mail quando o tamanho voltar.',
  buyLabel: 'Adicionar à sacola',
  shippingLabel: 'Calcular frete',
  cepPlaceholder: '00000-000',
  cepButtonLabel: 'Calcular',
  cepHelpLabel: 'Não sei meu CEP',
  cepHelpUrl: 'https://buscacepinter.correios.com.br/app/endereco/index.php',
  accordions: [
    {
      title: 'Descrição',
      text: 'Vestido midi em linho puro, decote canoa, alças largas e fenda lateral discreta. Caimento solto, com forro em algodão até a altura do joelho.',
    },
    {
      title: 'Composição e cuidados',
      text: '100% linho, forro 100% algodão. Lavar à mão em água fria e secar à sombra.',
    },
    {
      title: 'Entrega e trocas',
      text: 'Enviamos em até 2 dias úteis. A primeira troca é gratuita em até 30 dias.',
    },
  ],
};

const PRODUCT_NAME = 'Vestido Midi Linho Areia';
const TITLE_PARTS = ['Vestido Midi Linho', 'Areia'];
const PRICE = 489;
const BEST = { n: 6, v: 81.5 };
const IMAGES = ['#E6DED2', '#D8CCBC', '#DED3C4', '#CDBFAC'].map((hex, i) => ({
  url: svg(600, 800, hex),
  alt: `${PRODUCT_NAME} — foto ${i + 1}`,
}));
const COLORS = [
  { label: 'Areia', hex: '#E6DED2', active: true },
  { label: 'Preto', hex: '#3A3631', active: false },
  { label: 'Oliva', hex: '#8B8A6E', active: false },
  { label: 'Terracota', hex: '#B57A63', active: false },
].map(c => ({ ...c, src: svg(44, 58, c.hex) }));
const SIZES = ['PP', 'P', 'M', 'G', 'GG'].map((value, i) => ({
  value,
  sku: `90010${i}`,
  available: value !== 'GG',
}));
const SOLD_OUT = SIZES.filter(s => !s.available);

const Heart = ({ filled }: { filled: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </svg>
);
const Ruler = () => (
  <svg
    className={styles.guideIcon}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <path d="M3 15 15 3l6 6L9 21z" />
    <path d="m7 11 2 2M10 8l2 2M13 5l2 2" />
  </svg>
);
const PlusMinus = ({ open }: { open: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    {open ? <path d="M5 12h14" /> : <path d="M12 5v14M5 12h14" />}
  </svg>
);

export default function ProductInfo09() {
  const m = MOCK;
  const uid = useId();
  const [activeSize, setActiveSize] = useState('M');
  const [openAcc, setOpenAcc] = useState<number[]>([0]);
  const [slide, setSlide] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyOk, setNotifyOk] = useState(false);
  const [cep, setCep] = useState('');
  const galleryRef = useRef<HTMLDivElement>(null);

  const selected = SIZES.find(s => s.value === activeSize);
  const ref = `${m.refLabel} ${selected?.sku ?? ''}`;
  const activeColorLabel = COLORS.find(c => c.active)?.label ?? '';

  const onGalleryScroll = () => {
    const el = galleryRef.current;
    if (el && el.clientWidth) setSlide(Math.round(el.scrollLeft / el.clientWidth));
  };
  const toggleAcc = (i: number) =>
    setOpenAcc(o => (o.includes(i) ? o.filter(x => x !== i) : [...o, i]));

  const favButton = (extra: string) => (
    <button
      type="button"
      className={`${styles.fav} ${extra}`}
      onClick={() => setIsFav(v => !v)}
      aria-pressed={isFav}
      aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      data-role="pdp-favorite"
    >
      <Heart filled={isFav} />
    </button>
  );

  const buyButton = (extra: string) => (
    <button type="button" className={`${styles.buy} ${extra}`} data-role="pdp-buy">
      {m.buyLabel}
    </button>
  );

  return (
    <div className={styles.productDetails09Box}>
      <link rel="stylesheet" href={FONTES_09} />
      <section className={styles.productDetails09} aria-label={PRODUCT_NAME} data-role="pdp-root">
        <div className={styles.inner}>
          <div className={styles.galleryWrap} data-role="pdp-gallery">
            <div ref={galleryRef} className={styles.gallery} onScroll={onGalleryScroll}>
              {IMAGES.map((img, i) => (
                <div key={img.url} className={styles.photo}>
                  <img
                    src={img.url}
                    alt={img.alt}
                    width={600}
                    height={800}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </div>
              ))}
            </div>
            {favButton(styles.favOnPhoto)}
            <div className={styles.dashes} aria-hidden="true">
              {IMAGES.map((img, i) => (
                <span key={img.url} className={i === slide ? styles.dashOn : undefined} />
              ))}
            </div>
          </div>

          <div className={styles.info}>
            <div className={styles.head}>
              <span className={styles.eyebrow} data-role="pdp-eyebrow">
                {m.newLabel}
              </span>
              <h1 className={styles.title} data-role="pdp-title">
                {TITLE_PARTS[0]} <em>{TITLE_PARTS[1]}</em>
              </h1>
              <span className={styles.muted12} data-role="pdp-ref">
                {ref}
              </span>
              <div className={styles.prices} data-role="pdp-prices">
                <span className={styles.priceRow}>
                  <span className={styles.price} data-role="pdp-price">
                    {money(PRICE)}
                  </span>
                </span>
                <span className={styles.installment} data-role="pdp-installment">
                  ou {BEST.n}x de {money(BEST.v)} sem juros
                </span>
              </div>
            </div>

            <div className={styles.colors} data-role="pdp-colors">
              <span className={styles.label}>
                {m.colorLabel}: <span className={styles.labelValue}>{activeColorLabel}</span>
              </span>
              <div className={styles.swatches}>
                {COLORS.map(c => (
                  <a
                    key={c.label}
                    className={`${styles.swatch}${c.active ? ` ${styles.swatchOn}` : ''}`}
                    href="#"
                    aria-current={c.active ? 'true' : undefined}
                    aria-label={c.active ? `${c.label}, selecionada` : c.label}
                    data-role="pdp-swatch"
                  >
                    <img src={c.src} alt="" width={44} height={58} loading="lazy" decoding="async" />
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.sizes} data-role="pdp-sizes">
              <div className={styles.sizesHead}>
                <span className={styles.label} id={`${uid}-size`}>
                  {m.sizeLabel}
                </span>
                <button
                  type="button"
                  className={styles.guide}
                  onClick={() => setGuideOpen(true)}
                  aria-haspopup="dialog"
                  data-role="pdp-size-guide"
                >
                  <Ruler />
                  {m.sizeGuideLabel}
                </button>
              </div>
              <div className={styles.sizeGrid} role="group" aria-labelledby={`${uid}-size`}>
                {SIZES.map(s =>
                  s.available ? (
                    <button
                      key={s.value}
                      type="button"
                      className={`${styles.size}${s.value === activeSize ? ` ${styles.sizeOn}` : ''}`}
                      aria-pressed={s.value === activeSize}
                      onClick={() => {
                        setActiveSize(s.value);
                        setNotifyOpen(false);
                      }}
                      data-role="pdp-size"
                    >
                      {s.value}
                    </button>
                  ) : (
                    <button
                      key={s.value}
                      type="button"
                      className={`${styles.size} ${styles.sizeOut}`}
                      aria-label={`${s.value}, esgotado`}
                      disabled
                      data-role="pdp-size-out"
                    >
                      {s.value}
                    </button>
                  )
                )}
              </div>
              <span className={styles.muted12} data-role="pdp-sold-out-note">
                {SOLD_OUT.map(s => s.value).join(', ')} {m.soldOutText}{' '}
                <button
                  type="button"
                  className={styles.inlineLink}
                  onClick={() => {
                    setNotifyOpen(true);
                    setNotifyOk(false);
                  }}
                  aria-expanded={notifyOpen}
                  aria-controls={`${uid}-notify`}
                  data-role="pdp-notify-link"
                >
                  {m.notifyLabel}
                </button>
              </span>
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
                    {m.notifySuccess}
                  </p>
                ) : (
                  <>
                    <label className={styles.line}>
                      <span className={styles.srOnly}>{m.notifyNamePlaceholder}</span>
                      <input type="text" autoComplete="name" required placeholder={m.notifyNamePlaceholder} />
                    </label>
                    <label className={styles.line}>
                      <span className={styles.srOnly}>{m.notifyEmailPlaceholder}</span>
                      <input type="email" autoComplete="email" required placeholder={m.notifyEmailPlaceholder} />
                      <button type="submit" className={styles.lineBtn}>
                        {m.notifySubmitLabel}
                      </button>
                    </label>
                  </>
                )}
              </form>
            )}

            <div className={styles.buyRow} data-role="pdp-buy-row">
              {buyButton('')}
              {favButton(styles.favInRow)}
            </div>

            <div className={styles.shipping} data-role="pdp-shipping">
              <span className={styles.label} id={`${uid}-cep`}>
                {m.shippingLabel}
              </span>
              <form className={styles.line} onSubmit={e => e.preventDefault()} aria-labelledby={`${uid}-cep`}>
                <label className={styles.lineField}>
                  <span className={styles.srOnly}>CEP</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={9}
                    placeholder={m.cepPlaceholder}
                    value={cep}
                    onChange={e => {
                      const d = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setCep(d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d);
                    }}
                  />
                </label>
                <button type="submit" className={styles.lineBtn}>
                  {m.cepButtonLabel}
                </button>
              </form>
              <a className={styles.cepHelp} href={m.cepHelpUrl} target="_blank" rel="noopener noreferrer">
                {m.cepHelpLabel}
              </a>
            </div>

            <div className={styles.accordions} data-role="pdp-accordions">
              {m.accordions.map((a, i) => (
                <div key={a.title} className={styles.acc}>
                  <button
                    type="button"
                    className={styles.accBtn}
                    aria-expanded={openAcc.includes(i)}
                    aria-controls={`${uid}-acc-${i}`}
                    id={`${uid}-accb-${i}`}
                    onClick={() => toggleAcc(i)}
                  >
                    {a.title}
                    <PlusMinus open={openAcc.includes(i)} />
                  </button>
                  <div
                    id={`${uid}-acc-${i}`}
                    role="region"
                    aria-labelledby={`${uid}-accb-${i}`}
                    className={styles.accPanel}
                    hidden={!openAcc.includes(i)}
                  >
                    <p>{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.mobileBar} data-role="pdp-mobile-bar">
          <span className={styles.mobilePrice}>
            <span className={styles.mobilePriceValue}>{money(PRICE)}</span>
            <span className={styles.mobileInstallment}>
              {BEST.n}x de {money(BEST.v)}
            </span>
          </span>
          {buyButton(styles.buyMobile)}
        </div>

        {guideOpen && (
          <div className={styles.overlay} onClick={() => setGuideOpen(false)}>
            <div
              className={styles.dialog}
              role="dialog"
              aria-modal="true"
              aria-label={m.sizeGuideLabel}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.dialogHead}>
                <span className={styles.label}>{m.sizeGuideLabel}</span>
                <button type="button" className={styles.close} onClick={() => setGuideOpen(false)} aria-label="Fechar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>
              <img className={styles.guideImg} src={GUIDE} alt={`${m.sizeGuideLabel} — ${PRODUCT_NAME}`} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';
import type { ProdutoNormal } from '@/utils/produtos';

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
 *
 * Os rótulos e os acordeões são do CMS e vêm do `useConteudoDaSecao`. O produto é o 1º
 * da loja (`useProdutosDaLoja`) quando o CS cadastrou; senão o de exemplo. Cada
 * variação dele vira um seletor no estilo do TIPO: texto → os botões de tamanho, cor
 * e imagem → as miniaturas (cor = um quadro da cor; imagem = a miniatura enviada).
 * Produto sem variação não mostra seletor nenhum.
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

/** Os campos do `section.schema` do ProductDetails09 que a réplica desenha. */
interface ProductInfo09Conteudo {
  newLabel?: string;
  refLabel?: string;
  colorLabel?: string;
  sizeLabel?: string;
  sizeGuideLabel?: string;
  soldOutText?: string;
  notifyLabel?: string;
  notifyNamePlaceholder?: string;
  notifyEmailPlaceholder?: string;
  notifySubmitLabel?: string;
  notifySuccess?: string;
  buyLabel?: string;
  shippingLabel?: string;
  cepPlaceholder?: string;
  cepButtonLabel?: string;
  cepHelpLabel?: string;
  cepHelpUrl?: string;
  accordions: { title?: string; text?: string }[];
}

const MOCK: ProductInfo09Conteudo = {
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

/* ── o que a PDP desenha: o produto de exemplo ou o 1º da loja ── */
type OpcaoDaPdp = { label: string; src: string; available: boolean; sku: string };
type VariacaoDaPdp = {
  /** '' = o rótulo do CMS (`colorLabel` / `sizeLabel`). */
  name: string;
  tipo: 'texto' | 'cor' | 'imagem';
  options: OpcaoDaPdp[];
  /** A opção que nasce escolhida. */
  inicial: number;
};
type VistaDaPdp = {
  name: string;
  /** A 2ª parte vai em itálico (o desenho do exemplo); o da loja é uma parte só. */
  titleParts: [string, string?];
  price: number;
  listPrice: number;
  best: { n: number; v: number } | null;
  images: { url: string; alt: string }[];
  variacoes: VariacaoDaPdp[];
};

const EXEMPLO: VistaDaPdp = {
  name: PRODUCT_NAME,
  titleParts: [TITLE_PARTS[0], TITLE_PARTS[1]],
  price: PRICE,
  listPrice: PRICE,
  best: BEST,
  images: IMAGES,
  variacoes: [
    {
      name: '',
      tipo: 'cor',
      options: COLORS.map(c => ({ label: c.label, src: c.src, available: true, sku: '' })),
      inicial: Math.max(0, COLORS.findIndex(c => c.active)),
    },
    {
      name: '',
      tipo: 'texto',
      options: SIZES.map(z => ({ label: z.value, src: '', available: z.available, sku: z.sku })),
      inicial: SIZES.findIndex(z => z.value === 'M'),
    },
  ],
};

/** Hex aceito no quadro da cor (vai para dentro de um SVG); fora disso, cinza. */
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function daLoja(p: ProdutoNormal): VistaDaPdp {
  const fotos = p.images.length ? p.images : [svg(600, 800, '#E6DED2')];
  return {
    name: p.name,
    titleParts: [p.name],
    price: p.price,
    listPrice: p.listPrice,
    best: p.installments ? { n: p.installments, v: p.installmentValue } : null,
    images: fotos.map((url, i) => ({ url, alt: `${p.name} — foto ${i + 1}` })),
    variacoes: p.variants.map(v => ({
      name: v.name,
      tipo: v.tipo,
      options: v.options.map((o, i) => ({
        label: o.label || `Opção ${i + 1}`,
        src:
          v.tipo === 'imagem'
            ? o.swatchImage || svg(44, 58, '#D8CCBC')
            : v.tipo === 'cor'
              ? svg(44, 58, HEX.test(o.color) ? o.color : '#D8CCBC')
              : '',
        available: o.available,
        sku: '',
      })),
      inicial: Math.max(0, v.options.findIndex(o => o.available)),
    })),
  };
}

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
  const m = useConteudoDaSecao(MOCK);
  const uid = useId();
  /** A opção escolhida de cada variação (índice), quando o cliente clicou. */
  const [escolhas, setEscolhas] = useState<Record<number, number>>({});
  const [openAcc, setOpenAcc] = useState<number[]>([0]);
  const [slide, setSlide] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyOk, setNotifyOk] = useState(false);
  const [cep, setCep] = useState('');
  const galleryRef = useRef<HTMLDivElement>(null);

  const daLojaLista = useProdutosDaLoja();
  const vista = useMemo(
    () => (daLojaLista ? daLoja(daLojaLista[0]) : EXEMPLO),
    [daLojaLista]
  );
  // Outro produto: as escolhas e o slide do anterior não valem mais.
  useEffect(() => {
    setEscolhas({});
    setSlide(0);
  }, [vista]);

  const escolhida = (vi: number) =>
    vista.variacoes[vi]?.options[escolhas[vi] ?? vista.variacoes[vi].inicial];
  const escolher = (vi: number, oi: number) => setEscolhas(e => ({ ...e, [vi]: oi }));
  const primeiraDeTexto = vista.variacoes.findIndex(v => v.tipo === 'texto');
  const sku = primeiraDeTexto >= 0 ? (escolhida(primeiraDeTexto)?.sku ?? '') : '';
  const ref = sku ? `${m.refLabel} ${sku}` : '';

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
      <section className={styles.productDetails09} aria-label={vista.name} data-role="pdp-root">
        <div className={styles.inner}>
          <div className={styles.galleryWrap} data-role="pdp-gallery">
            <div ref={galleryRef} className={styles.gallery} onScroll={onGalleryScroll}>
              {vista.images.map((img, i) => (
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
              {vista.images.map((img, i) => (
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
                {vista.titleParts[0]} {vista.titleParts[1] && <em>{vista.titleParts[1]}</em>}
              </h1>
              {ref && (
                <span className={styles.muted12} data-role="pdp-ref">
                  {ref}
                </span>
              )}
              <div className={styles.prices} data-role="pdp-prices">
                <span className={styles.priceRow}>
                  {vista.listPrice > vista.price && (
                    <s className={styles.listPrice} data-role="pdp-list-price">
                      {money(vista.listPrice)}
                    </s>
                  )}
                  <span className={styles.price} data-role="pdp-price">
                    {money(vista.price)}
                  </span>
                </span>
                {vista.best && (
                  <span className={styles.installment} data-role="pdp-installment">
                    ou {vista.best.n}x de {money(vista.best.v)} sem juros
                  </span>
                )}
              </div>
            </div>

            {vista.variacoes.map((v, vi) => {
              const atual = escolhida(vi);
              if (v.tipo !== 'texto')
                return (
                  <div key={vi} className={styles.colors} data-role="pdp-colors" data-variacao={v.tipo}>
                    <span className={styles.label}>
                      {v.name || m.colorLabel}: <span className={styles.labelValue}>{atual?.label}</span>
                    </span>
                    <div className={styles.swatches}>
                      {v.options.map((o, oi) => {
                        const on = o === atual;
                        return (
                          <a
                            key={oi}
                            className={`${styles.swatch}${on ? ` ${styles.swatchOn}` : ''}`}
                            href="#"
                            onClick={e => {
                              e.preventDefault();
                              escolher(vi, oi);
                            }}
                            aria-current={on ? 'true' : undefined}
                            aria-label={`${o.label}${on ? ', selecionada' : ''}${o.available ? '' : ', esgotada'}`}
                            data-role="pdp-swatch"
                          >
                            <img src={o.src} alt="" width={44} height={58} loading="lazy" decoding="async" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              const esgotadas = v.options.filter(o => !o.available);
              return (
                <div key={vi} className={styles.sizes} data-role="pdp-sizes" data-variacao="texto">
                  <div className={styles.sizesHead}>
                    <span className={styles.label} id={`${uid}-var${vi}`}>
                      {v.name || m.sizeLabel}
                    </span>
                    {vi === primeiraDeTexto && (
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
                    )}
                  </div>
                  <div className={styles.sizeGrid} role="group" aria-labelledby={`${uid}-var${vi}`}>
                    {v.options.map((o, oi) =>
                      o.available ? (
                        <button
                          key={oi}
                          type="button"
                          className={`${styles.size}${o === atual ? ` ${styles.sizeOn}` : ''}`}
                          aria-pressed={o === atual}
                          onClick={() => {
                            escolher(vi, oi);
                            setNotifyOpen(false);
                          }}
                          data-role="pdp-size"
                        >
                          {o.label}
                        </button>
                      ) : (
                        <button
                          key={oi}
                          type="button"
                          className={`${styles.size} ${styles.sizeOut}`}
                          aria-label={`${o.label}, esgotado`}
                          disabled
                          data-role="pdp-size-out"
                        >
                          {o.label}
                        </button>
                      )
                    )}
                  </div>
                  {esgotadas.length > 0 && (
                    <span className={styles.muted12} data-role="pdp-sold-out-note">
                      {esgotadas.map(o => o.label).join(', ')} {m.soldOutText}{' '}
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
                  )}
                </div>
              );
            })}

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
            <span className={styles.mobilePriceValue}>{money(vista.price)}</span>
            {vista.best && (
              <span className={styles.mobileInstallment}>
                {vista.best.n}x de {money(vista.best.v)}
              </span>
            )}
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
              <img className={styles.guideImg} src={GUIDE} alt={`${m.sizeGuideLabel} — ${vista.name}`} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductInfo09.conteudoPadrao = MOCK;

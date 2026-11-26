'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_15 } from '@/components/templates/common/template_15/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';
import type { ProdutoNormal } from '@/utils/produtos';

/**
 * Espelha `organisms/ProductDetails15` do faststore.starter (família 15, Luxo; desenho
 * `ProductInfo15` / `-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars
 * de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o `mock.ts` de lá, já resolvido como o
 * starter resolve: as 5 fotos em tons de areia (os blocos em data URI do mock) com miniaturas,
 * contador "1 / 5" e setas, a marca, a nota 4,9 com 128 avaliações, "Ref. [0000004]" (o SKU do
 * aro 14), o preço com 10x sem juros e o Pix, a Cor do ouro por miniatura (Amarelo ativa), o Aro
 * em grade com o 12 e o 18 riscados e o 14 escolhido, o "Guia de medidas" (a especificação do
 * produto, com o diálogo), "O aro 12 ou 18 esgotou? Avise-me" (abre o formulário), quantidade +
 * coração, "Adicionar à sacola", o frete por CEP (as opções de exemplo depois do "Calcular") e os
 * acordeões (o primeiro aberto; "Detalhes da peça" vem da especificação do produto).
 *
 * Sem trilha: a da página de produto é a da breadcrumb comum (Breadcrumb15), que as três
 * plataformas já põem na PDP. Decisão do usuário em 04/11/2026, para não duplicar.
 *
 * Sai: `usePDP`, `useBuyButton` ("Adicionar à sacola" não faz nada), `useWishList` (o coração
 * só alterna no estado local), a nota do Reviews and Ratings, a simulação de frete, a mutation
 * do "Avise-me" (o envio dá sucesso local, como no palco de lá) e o analytics. As cores, que lá
 * levam ao slug do SKU, aqui apontam para `#`.
 *
 * Rótulos, opções e acordeões vêm do `useConteudoDaSecao`; o produto (nome, marca, preço, fotos,
 * cores e aros) segue o de exemplo. `soldOutButtonLabel` fica fora do tipo: o exemplo sempre
 * tem o aro escolhido em estoque, então o botão de compra nunca vira "Avise-me quando chegar".
 */

const block = (hex: string, w: number, h: number) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${hex}"/></svg>`
  )}`;

interface ProductInfo15Conteudo {
  codeLabel?: string;
  ratingCountLabel?: string;
  sizeGuideLabel?: string;
  /** `{tamanhos}` vira a lista dos esgotados. */
  soldOutText?: string;
  /** Vazio = o texto do desktop. */
  soldOutTextMobile?: string;
  notifyLabel?: string;
  notifyNamePlaceholder?: string;
  notifyEmailPlaceholder?: string;
  notifySubmitLabel?: string;
  notifySuccess?: string;
  buyLabel?: string;
  favoriteLabel?: string;
  hideQuantity?: boolean;
  shippingLabel?: string;
  cepPlaceholder?: string;
  cepButtonLabel?: string;
  shippingNote?: string;
  /** `specName` aponta uma especificação do produto; quando o produto a tem, ela vence o `text`. */
  accordions: { title?: string; text?: string; specName?: string }[];
}

const MOCK: ProductInfo15Conteudo = {
  codeLabel: 'Ref.',
  ratingCountLabel: 'avaliações',
  sizeGuideLabel: 'Guia de medidas',
  soldOutText: 'O aro {tamanhos} esgotou?',
  soldOutTextMobile: 'Seu aro esgotou?',
  notifyLabel: 'Avise-me',
  notifyNamePlaceholder: 'Seu nome',
  notifyEmailPlaceholder: 'Seu e-mail',
  notifySubmitLabel: 'Avisar',
  notifySuccess: 'Pronto. Avisaremos por e-mail assim que o seu aro voltar ao ateliê.',
  buyLabel: 'Adicionar à sacola',
  favoriteLabel: 'Salvar nos favoritos',
  shippingLabel: 'Calcular frete',
  cepPlaceholder: '00000-000',
  cepButtonLabel: 'Calcular',
  shippingNote: 'Entrega segura com seguro total · até 5 dias úteis',
  accordions: [
    {
      title: 'Descrição',
      text: 'Solitário clássico de seis garras em ouro amarelo 18k, com diamante de lapidação brilhante. Um desenho que valoriza a pedra e acompanha a vida inteira.',
    },
    { title: 'Detalhes da peça', specName: 'Detalhes da peça' },
    {
      title: 'Entrega e embalagem',
      text: 'Enviamos com seguro total para todo o Brasil, no estojo da maison. O prazo e o valor aparecem no cálculo de frete acima.',
    },
    {
      title: 'Garantia e cuidados',
      text: 'Garantia contra defeitos de fabricação. Guarde a peça no estojo e evite contato com perfume e cloro.',
    },
  ],
};

/** As especificações do produto de exemplo (o que `specName` do acordeão procura). */
const ESPECIFICACOES: Record<string, string[]> = {
  'Detalhes da peça': ['Ouro amarelo 18k (liga 750)', 'Diamante de lapidação brilhante', 'Seis garras'],
};

/** Como o starter compara nomes: sem acento, sem caixa, sem espaço nas pontas. */
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

const SHIP_OPTIONS = [
  { id: 'segura', name: 'Entrega segura', eta: 'até 5 dias úteis', price: 'Grátis' },
  { id: 'expressa', name: 'Expressa com seguro', eta: 'até 2 dias úteis', price: 'R$ 49,00' },
];

const BRAND = 'Sua Marca Joias';
const PRODUCT_NAME = 'Anel Solitário Ouro 18k';
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
// Guia de medidas de exemplo: a mesma tabela desenhada do mock.ts de lá.
const GUIDE_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="#FAF8F4"/><rect width="1200" height="62" fill="#EFE8D8"/><rect y="61" width="1200" height="2" fill="#E2DACB"/><rect y="122" width="1200" height="2" fill="#E2DACB"/><rect y="184" width="1200" height="2" fill="#E2DACB"/><rect y="245" width="1200" height="2" fill="#E2DACB"/><rect y="307" width="1200" height="2" fill="#E2DACB"/><rect y="368" width="1200" height="2" fill="#E2DACB"/><rect y="430" width="1200" height="2" fill="#E2DACB"/><rect y="491" width="1200" height="2" fill="#E2DACB"/><rect y="553" width="1200" height="2" fill="#E2DACB"/><rect y="614" width="1200" height="2" fill="#E2DACB"/><rect y="676" width="1200" height="2" fill="#E2DACB"/><rect y="737" width="1200" height="2" fill="#E2DACB"/><g font-family="sans-serif" font-size="25" fill="#1A1714" text-anchor="middle"><text x="200" y="40" font-weight="700">Aro</text><text x="600" y="40" font-weight="700">Circunferência (mm)</text><text x="1000" y="40" font-weight="700">Diâmetro (mm)</text><text x="200" y="101">10</text><text x="600" y="101">50</text><text x="1000" y="101">15,9</text><text x="200" y="163">11</text><text x="600" y="163">51</text><text x="1000" y="163">16,2</text><text x="200" y="224">12</text><text x="600" y="224">52</text><text x="1000" y="224">16,6</text><text x="200" y="286">13</text><text x="600" y="286">53</text><text x="1000" y="286">16,9</text><text x="200" y="347">14</text><text x="600" y="347">54</text><text x="1000" y="347">17,2</text><text x="200" y="409">15</text><text x="600" y="409">55</text><text x="1000" y="409">17,5</text><text x="200" y="470">16</text><text x="600" y="470">56</text><text x="1000" y="470">17,8</text><text x="200" y="532">17</text><text x="600" y="532">57</text><text x="1000" y="532">18,1</text><text x="200" y="593">18</text><text x="600" y="593">58</text><text x="1000" y="593">18,5</text><text x="200" y="655">19</text><text x="600" y="655">59</text><text x="1000" y="655">18,8</text><text x="200" y="716">20</text><text x="600" y="716">60</text><text x="1000" y="716">19,1</text><text x="200" y="778">22</text><text x="600" y="778">62</text><text x="1000" y="778">19,7</text></g></svg>'
)}`;

/** Uma opção de uma variação, no formato que a PDP desenha. */
type OpcaoDaPdp = { value: string; src: string; available: boolean; sku: string };
type VariacaoDaPdp = {
  /** '' = o rótulo padrão da família (`COLOR_NAME` / `AXIS_NAME`). */
  name: string;
  tipo: 'texto' | 'cor' | 'imagem';
  options: OpcaoDaPdp[];
  /** A opção que nasce escolhida. */
  inicial: number;
};
type VistaDaPdp = {
  name: string;
  brand: string;
  images: { url: string; alternateName: string }[];
  price: number;
  best: { installmentNumber: number; installmentValue: number; installmentInterest: number } | null;
  pix: number;
  rating: { average: number; totalCount: number } | null;
  inStock: boolean;
  variacoes: VariacaoDaPdp[];
  /** As especificações que o `specName` do acordeão procura. */
  especificacoes: Record<string, string[]>;
  /** Produto de exemplo: só ele tem o guia de medidas. */
  exemplo: boolean;
};

/** O produto de exemplo (o `mock.ts` de lá). */
const EXEMPLO: VistaDaPdp = {
  name: PRODUCT_NAME,
  brand: BRAND,
  images: IMAGES,
  price: PRICE,
  best: BEST,
  pix: PIX,
  rating: RATING,
  inStock: true,
  variacoes: [
    { name: '', tipo: 'cor', options: COLORS.map(c => ({ value: c.value, src: c.src, available: true, sku: '' })), inicial: 0 },
    { name: '', tipo: 'texto', options: AXIS.map(o => ({ ...o, src: '' })), inicial: SIZES.indexOf('14') },
  ],
  especificacoes: ESPECIFICACOES,
  exemplo: true,
};

/** Hex aceito no quadro da cor; fora disso, cinza. */
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Um produto da LOJA (`useProdutosDaLoja`) no formato da PDP. Sem nota nem Pix: o cadastro não os tem. */
function daLoja(p: ProdutoNormal): VistaDaPdp {
  const fotos = p.images.length ? p.images : [block('#E6DFD2', 800, 1000)];
  return {
    name: p.name,
    brand: p.brand,
    images: fotos.map((url, i) => ({ url, alternateName: `${p.name} — foto ${i + 1}` })),
    price: p.price,
    best: p.installments
      ? { installmentNumber: p.installments, installmentValue: p.installmentValue, installmentInterest: 0 }
      : null,
    pix: 0,
    rating: null,
    inStock: p.inStock,
    variacoes: p.variants.map(v => ({
      name: v.name,
      tipo: v.tipo,
      options: v.options.map((o, i) => ({
        value: o.label || `Opção ${i + 1}`,
        src:
          v.tipo === 'imagem'
            ? o.swatchImage || block('#E4E2DE', 64, 80)
            : v.tipo === 'cor'
              ? block(HEX.test(o.color) ? o.color : '#E4E2DE', 64, 80)
              : '',
        available: o.available,
        sku: '',
      })),
      inicial: Math.max(0, v.options.findIndex(o => o.available)),
    })),
    especificacoes: Object.fromEntries(p.specs.map(s => [s.name, [s.value]])),
    exemplo: false,
  };
}

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
  const {
    codeLabel,
    ratingCountLabel,
    sizeGuideLabel,
    soldOutText,
    soldOutTextMobile,
    notifyLabel,
    notifyNamePlaceholder,
    notifyEmailPlaceholder,
    notifySubmitLabel,
    notifySuccess,
    buyLabel,
    favoriteLabel,
    hideQuantity,
    shippingLabel,
    cepPlaceholder,
    cepButtonLabel,
    shippingNote,
    accordions,
  } = useConteudoDaSecao(MOCK);
  const uid = useId();
  /** A opção escolhida de cada variação (índice), quando o cliente clicou. */
  const [escolhas, setEscolhas] = useState<Record<number, number>>({});
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

  const daLojaLista = useProdutosDaLoja();
  const vista = useMemo(() => (daLojaLista ? daLoja(daLojaLista[0]) : EXEMPLO), [daLojaLista]);
  // Outro produto: as escolhas e o slide do anterior não valem mais.
  useEffect(() => {
    setEscolhas({});
    setSlide(0);
  }, [vista]);
  const escolhida = (vi: number) => vista.variacoes[vi]?.options[escolhas[vi] ?? vista.variacoes[vi].inicial];
  const escolher = (vi: number, oi: number) => setEscolhas(e => ({ ...e, [vi]: oi }));
  // O eixo com guia de medidas e "Avise-me" é a primeira variação de texto.
  const iEixo = vista.variacoes.findIndex(v => v.tipo === 'texto');
  const axisOptions = iEixo >= 0 ? vista.variacoes[iEixo].options : [];
  const axisName = (iEixo >= 0 && vista.variacoes[iEixo].name) || AXIS_NAME;
  const selected = iEixo >= 0 ? escolhida(iEixo) : undefined;
  const activeAxis = selected?.value ?? '';
  const soldOutOptions = axisOptions.filter(o => !o.available);
  const inStock = vista.inStock && (iEixo < 0 || !!selected?.available);
  const sku = selected?.sku ?? '';
  const best = inStock ? vista.best : null;
  const pixValue = inStock && vista.pix > 0 ? vista.pix : null;

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
    const n = Math.max(0, Math.min(vista.images.length - 1, i));
    setSlide(n);
    if (el) el.scrollTo({ left: n * el.clientWidth, behavior: 'auto' });
  };
  const toggleAcc = (i: number) => setOpenAcc(o => (o.includes(i) ? o.filter(x => x !== i) : [...o, i]));
  const showNotify = notifyOpen || !inStock;
  const soldList = joinOr(soldOutOptions.map(o => o.value));
  const soldQuestion = String(soldOutText ?? '').replace('{tamanhos}', soldList);
  const soldQuestionMobile = soldOutTextMobile ? String(soldOutTextMobile).replace('{tamanhos}', soldList) : '';
  // Acordeões: o texto do CS, ou o da especificação do produto de exemplo que o CS nomeia.
  const accItems = accordions
    .map(a => {
      const doProduto = a?.specName ? (vista.especificacoes[Object.keys(vista.especificacoes).find(k => norm(k) === norm(a.specName as string)) ?? ''] ?? []) : [];
      const text = doProduto.join('\n').trim() || String(a?.text ?? '').trim();
      return {
        title: String(a?.title ?? '').trim(),
        lines: text
          .split(/\r?\n/)
          .map(l => l.replace(/^\s*[-•]\s*/, '').trim())
          .filter(Boolean),
      };
    })
    .filter(a => a.title && a.lines.length);

  const favButton = (extra: string) => (
    <button
      type="button"
      className={`${styles.fav} ${extra}`}
      onClick={() => setIsFav(v => !v)}
      aria-pressed={isFav}
      aria-label={favoriteLabel}
      data-role="pdp-favorite"
    >
      {svg(20, <path d={HEART} />, isFav ? { fill: 'currentColor' } : {})}
    </button>
  );

  return (
    <div className={styles.productDetails15Box}>
      <section className={styles.productDetails15} aria-label={vista.name} data-role="pdp-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          <div className={styles.main}>
            {/* ── galeria (sem zoom, sem vídeo): miniaturas à esquerda da foto 4:5 ── */}
            <div className={styles.gallery} data-role="pdp-gallery">
              <div className={styles.thumbs} role="group" aria-label="Imagens do produto">
                {vista.images.map((img, i) => (
                  <button
                    key={`${i}-${img.url}`}
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
                  {vista.images.map((img, i) => (
                    <div key={`${i}-${img.url}`} className={styles.photo}>
                      <img src={img.url} alt={img.alternateName} width={800} height={1000} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                    </div>
                  ))}
                </div>
                {favButton(styles.favPhoto)}
                <span className={styles.counter} aria-hidden="true" data-role="pdp-counter">
                  {slide + 1} <span>/ {vista.images.length}</span>
                </span>
                <div className={styles.arrows}>
                  <button type="button" className={styles.arrow} onClick={() => goTo(slide - 1)} disabled={slide <= 0} aria-label="Imagem anterior">
                    {svg(18, <path d="m15 6-6 6 6 6" />)}
                  </button>
                  <button
                    type="button"
                    className={styles.arrow}
                    onClick={() => goTo(slide + 1)}
                    disabled={slide >= vista.images.length - 1}
                    aria-label="Próxima imagem"
                  >
                    {svg(18, <path d="m9 6 6 6-6 6" />)}
                  </button>
                </div>
                <div className={styles.dashes} aria-label={`Imagem ${slide + 1} de ${vista.images.length}`} role="img">
                  {vista.images.map((img, i) => (
                    <span key={`${i}-${img.url}`} className={i === slide ? styles.dashOn : undefined} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── coluna de compra ── */}
            <div className={styles.info}>
              <div className={styles.head}>
                {vista.brand && (
                  <span className={styles.brand} data-role="pdp-brand">
                    {vista.brand}
                  </span>
                )}
                <h1 className={styles.title} data-role="pdp-title">
                  {vista.name}
                </h1>
                <div className={styles.meta}>
                  {vista.rating && (
                    <a className={styles.rating} href="#avaliacoes" data-role="pdp-rating">
                      <Stars avg={vista.rating.average} />
                      <span className={styles.srOnly}>Nota {vista.rating.average.toFixed(1).replace('.', ',')} de 5, </span>
                      <span className={styles.ratingCount}>
                        {vista.rating.totalCount.toLocaleString('pt-BR')} {ratingCountLabel}
                      </span>
                    </a>
                  )}
                  {sku && (
                    <span data-role="pdp-code">
                      {codeLabel ? `${codeLabel} ` : ''}
                      {sku}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.prices} data-role="pdp-prices">
                <span className={styles.priceRow}>
                  <span className={styles.price} data-role="pdp-price">
                    {money(vista.price)}
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

              {vista.variacoes.map((v, vi) => {
                if (v.tipo === 'texto') return null;
                const atual = escolhida(vi);
                return (
                  <div key={vi} className={styles.group} data-role="pdp-colors" data-variacao={v.tipo}>
                    <p className={styles.legend}>
                      <span id={`${uid}-color${vi}`}>{v.name || COLOR_NAME}: </span>
                      <span className={styles.legendValue}>{atual?.value}</span>
                    </p>
                    <div className={styles.swatches} role="group" aria-labelledby={`${uid}-color${vi}`}>
                      {v.options.map((c, oi) => {
                        const on = c === atual;
                        return (
                          <a
                            key={oi}
                            className={`${styles.swatch}${on ? ` ${styles.swatchOn}` : ''}`}
                            href={on ? undefined : '#'}
                            onClick={e => {
                              e.preventDefault();
                              escolher(vi, oi);
                            }}
                            aria-current={on ? 'true' : undefined}
                            aria-label={`${c.value}${on ? ', selecionada' : ''}${c.available ? '' : ', esgotada'}`}
                            title={c.value}
                            data-role="pdp-swatch"
                          >
                            <img src={c.src} alt="" width={64} height={80} loading="lazy" decoding="async" />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {vista.variacoes.map((v, vi) => {
                if (v.tipo !== 'texto' || vi === iEixo) return null;
                const atual = escolhida(vi);
                return (
                  <div key={vi} className={styles.group} data-role="pdp-axis" data-variacao="texto">
                    <div className={styles.legendRow}>
                      <p className={styles.legend}>
                        <span id={`${uid}-axis${vi}`}>{v.name || AXIS_NAME}: </span>
                        <span className={styles.legendValue}>{atual?.value}</span>
                      </p>
                    </div>
                    <div className={styles.sizes} role="group" aria-labelledby={`${uid}-axis${vi}`}>
                      {v.options.map((o, oi) =>
                        o.available ? (
                          <button
                            key={oi}
                            type="button"
                            className={`${styles.size}${o === atual ? ` ${styles.sizeOn}` : ''}`}
                            aria-pressed={o === atual}
                            onClick={() => escolher(vi, oi)}
                          >
                            {o.value}
                          </button>
                        ) : (
                          <button
                            key={oi}
                            type="button"
                            className={`${styles.size} ${styles.sizeOut}`}
                            aria-label={`${o.value}, esgotado`}
                            disabled
                          >
                            {o.value}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}

              {iEixo >= 0 && (
              <div className={styles.group} data-role="pdp-axis" data-variacao="texto">
                <div className={styles.legendRow}>
                  <p className={styles.legend}>
                    <span id={`${uid}-axis`}>{axisName}: </span>
                    <span className={styles.legendValue}>{activeAxis}</span>
                  </p>
                  {sizeGuideLabel && vista.exemplo && (
                    <button
                      ref={guideTriggerRef}
                      type="button"
                      className={styles.guide}
                      onClick={() => setGuideOpen(true)}
                      aria-haspopup="dialog"
                      data-role="pdp-size-guide"
                    >
                      <span className={styles.guideIcon}>{svg(16, RULER)}</span>
                      {sizeGuideLabel}
                    </button>
                  )}
                </div>
                <div className={styles.sizes} role="group" aria-labelledby={`${uid}-axis`}>
                  {axisOptions.map((o, oi) =>
                    o.available ? (
                      <button
                        key={o.value}
                        type="button"
                        className={`${styles.size}${o.value === activeAxis ? ` ${styles.sizeOn}` : ''}`}
                        aria-pressed={o.value === activeAxis}
                        onClick={() => {
                          escolher(iEixo, oi);
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
                {soldOutOptions.length > 0 && inStock && notifyLabel && (
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
                      <span className={soldQuestionMobile ? styles.dsk : undefined}>{soldQuestion}</span>
                      {soldQuestionMobile && <span className={styles.mob}>{soldQuestionMobile}</span>}
                    </span>
                    <span className={styles.notifyLink}>{notifyLabel}</span>
                  </button>
                )}
              </div>
              )}

              {showNotify && (
                <form id={`${uid}-notify`} ref={notifyRef} className={styles.notify} onSubmit={onNotify} data-role="pdp-notify">
                  {notifySent ? (
                    <p className={styles.notifyOk} role="status">
                      {notifySuccess}
                    </p>
                  ) : (
                    <>
                      <p className={styles.legend}>
                        {notifyLabel}
                        {notifyFor ? ` · ${notifyFor}` : ''}
                      </p>
                      {inStock && soldOutOptions.length > 1 && (
                        <div className={styles.notifyOptions} role="group" aria-label={axisName}>
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
                        <span className={styles.srOnly}>{notifyNamePlaceholder}</span>
                        <input
                          className={styles.input}
                          type="text"
                          autoComplete="name"
                          required
                          placeholder={notifyNamePlaceholder}
                          value={notifyName}
                          onChange={e => setNotifyName(e.target.value)}
                        />
                      </label>
                      <div className={styles.lineRow}>
                        <label className={styles.field}>
                          <span className={styles.srOnly}>{notifyEmailPlaceholder}</span>
                          <input
                            className={styles.input}
                            type="email"
                            autoComplete="email"
                            required
                            placeholder={notifyEmailPlaceholder}
                            value={notifyEmail}
                            onChange={e => setNotifyEmail(e.target.value)}
                          />
                        </label>
                        <button type="submit" className={styles.lineButton}>
                          {notifySubmitLabel}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}

              {/* ── quantidade + coração (desktop) e o botão de compra ── */}
              <div className={styles.buyBlock} data-role="pdp-buy-row">
                <div className={styles.buyTop}>
                  {!hideQuantity && inStock && (
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
                  <span>{buyLabel}</span>
                </button>
              </div>

              <form className={styles.shipping} onSubmit={onCep} data-role="pdp-shipping">
                <label className={styles.legend} htmlFor={`${uid}-cep`}>
                  {shippingLabel}
                </label>
                <div className={styles.lineRow}>
                  <input
                    id={`${uid}-cep`}
                    className={styles.input}
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={9}
                    placeholder={cepPlaceholder}
                    value={cep}
                    onChange={e => setCep(formatCep(e.target.value))}
                  />
                  <button type="submit" className={styles.lineButton}>
                    {cepButtonLabel}
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
                {shippingNote && (
                  <span className={styles.shippingNote} data-role="pdp-shipping-note">
                    {shippingNote}
                  </span>
                )}
              </form>

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

        {guideOpen && vista.exemplo && (
          <div className={styles.overlay} onClick={() => setGuideOpen(false)}>
            <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={sizeGuideLabel} onClick={e => e.stopPropagation()}>
              <div className={styles.dialogHead}>
                <span className={styles.legend}>{sizeGuideLabel}</span>
                <button ref={guideCloseRef} type="button" className={styles.close} onClick={() => setGuideOpen(false)} aria-label="Fechar">
                  {svg(20, <path d="M6 6l12 12M18 6 6 18" />)}
                </button>
              </div>
              <img className={styles.guideImg} src={daLojaLista?.[0]?.sizeGuide || GUIDE_URL} alt={`${sizeGuideLabel} — ${vista.name}`} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductInfo15.conteudoPadrao = MOCK;

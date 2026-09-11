'use client';

import React, { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductDetails06` do faststore.starter — a PDP inteira, com
 * as duas moléculas que o bloco compõe inline (`SizeFitAlert06`, o aviso de forma,
 * e `ShippingSimulator06`, o cálculo de frete no seu estado vazio, que é o que a
 * página mostra antes de alguém digitar o CEP).
 *
 * O que sai: `usePDP`, `useBuyButton`, `useWishList`, `useSession`, `useAuth`, o
 * rating e os similars por GraphQL, o avise-me e o tracking. O conteúdo é o mesmo
 * `mock.ts` da origem, com uma troca obrigatória: as imagens vinham do CDN de um
 * cliente e aqui são `placehold.co` nas mesmas medidas — o catálogo é público e
 * nenhum template daqui aponta para o CDN de uma loja. Geometria não muda: quem
 * dimensiona as fotos é o CSS.
 *
 * Fica o `useState` do slide ativo, do tamanho escolhido, do popover de
 * compartilhar e do modal do guia — é o que faz o preview responder ao clique.
 */
const IMAGENS = [
  { url: 'https://placehold.co/800x800/efefef/999999?text=Foto+1', alternateName: 'Sapato — vista lateral' },
  { url: 'https://placehold.co/800x800/ececec/999999?text=Foto+2', alternateName: 'Par — vista em ângulo' },
  { url: 'https://placehold.co/800x800/e9e9e9/999999?text=Foto+3', alternateName: 'Vista superior' },
  { url: 'https://placehold.co/800x800/e6e6e6/999999?text=Foto+4', alternateName: 'Detalhe do couro' },
];

const CORES = [
  { name: 'Sneaker Impulse 7614-570D', href: '#', image: 'https://placehold.co/425x425/e8e8e8/999999?text=Cor+1' },
  { name: 'Sneaker Impulse 7614-570C', href: '#', image: 'https://placehold.co/425x425/dedede/999999?text=Cor+2', active: true },
  { name: 'Sneaker Impulse 7614-570B', href: '#', image: 'https://placehold.co/425x425/d4d4d4/999999?text=Cor+3' },
];

const TAMANHOS = [
  { label: '37', value: '37', available: false },
  { label: '38', value: '38' },
  { label: '39', value: '39' },
  { label: '40', value: '40' },
  { label: '41', value: '41' },
  { label: '42', value: '42' },
  { label: '43', value: '43' },
  { label: '44', value: '44', available: false },
];

const TRILHA = [
  { item: '/calcados', name: 'Calçados' },
  { item: '/calcados/outlet', name: 'Outlet' },
];

const PRODUTO = {
  nome: 'Sapato Masculino Preto Liverpool',
  refId: '4077-281G',
  preco: 287.92,
  precoDe: 359.9,
  parcelaN: 7,
  parcelaValor: 41.13,
  avaliacao: { media: 4.5, total: 32 },
  forma: 'Grande',
};

/* Mesmo HTML de descrição da origem: a altura dele é o que empurra o bloco de
   características, então o texto é copiado sem cortes. */
const DESCRICAO_HTML =
  'A bota abotinada masculina Toronto preta da une sofisticação, conforto e tecnologia em um único modelo. Produzida em couro legítimo, apresenta visual moderno com toque urbano, ideal para homens que valorizam estilo em todas as ocasiões.<br><br>O modelo conta com uma calcanheira de alta frequência revestida em microfibra, proporcionando conforto superior e melhor adaptação aos pés. O solado em TR com <strong>tecnologia FLOAT</strong> garante leveza, amortecimento e mais conforto durante o uso.<br><br>Com <strong>tecnologia DRY</strong>, a bota auxilia na absorção da umidade, mantendo os pés secos por mais tempo, mesmo em rotinas intensas.<br><br>Perfeita para compor looks casuais ou sociais modernos, a bota Toronto preta é a escolha certa para quem busca praticidade, conforto e elegância.<br><br><strong>Destaques do Produto:</strong> <br>• Estilo: Abotinado e Moderno. <br>• Materiais: Couro. <br>• Solado: TR. <br>• Cadarço: Convencional (De Amarrar). <br>• Altura do Solado parte traseira: 2,5 cm<br>• Altura do Solado parte dianteira: 1 cm <br><br><strong>Dúvidas frequentes:</strong> <br><em>Qual é a altura do cano do calçado?</em> <br>O modelo possui cano de altura média, com aproximadamente 12 cm, cobrindo o tornozelo e proporcionando mais estabilidade, conforto e estilo. <br><br><em>O modelo é confortável para uso diário?</em> <br>Sim! O modelo conta com tecnologia FLOAT<strong> </strong>no solado, que proporciona amortecimento e mais conforto durante o dia. <br><br><em>O que são as </em><strong><em>tecnologias DRY e FLOAT?</em></strong> <br>A tecnologia DRY auxilia na absorção da umidade, mantendo os pés secos. Já a FLOAT atua no solado, oferecendo maior amortecimento e conforto ao caminhar. <br><br><em>Combina mais com looks casuais ou sociais?</em> <br>Com ambos! A proposta é versátil, indo do casual ao social moderno.';

const ESPECIFICACOES = [
  { name: 'Peso do Produto', value: '1,040', icon: 'https://placehold.co/28x28/f4f4f4/999999?text=%20' },
];

const CONTEUDO = {
  barText: '🔥 Envio no mesmo dia, para pedidos feitos até 12h! ⏰',
  consulteLabel: 'Consulte prazo e valores',
  fretePillBold: 'Frete grátis',
  fretePillText: 'acima R$349,90',
  cepPlaceholder: 'Calcule seu frete',
  cepButtonLabel: 'Calcular',
  envioIconUrl: 'https://placehold.co/24x24/f4f4f4/999999?text=%20',
  envioBold: 'Envio imediato',
  envioText: 'para todo o Brasil!',
  trocaIconUrl: 'https://placehold.co/24x24/f4f4f4/999999?text=%20',
  trocaBold: 'Troca fácil',
  trocaText: 'em até 7 dias úteis.',
  sizeGuideLabel: 'Guia de medidas',
  aviseMeLabel: 'AVISE-ME',
  sizeGuideImage: 'https://placehold.co/600x461/f0f0f0/999999?text=Guia+de+medidas',
  buyLabel: 'COMPRAR AGORA',
  shareWhatsappIconUrl: 'https://placehold.co/20x20/25d366/ffffff?text=%20',
  shareInstagramIconUrl: 'https://placehold.co/20x20/c13584/ffffff?text=%20',
  shareFacebookIconUrl: 'https://placehold.co/20x20/1877f2/ffffff?text=%20',
  shareCopyIconUrl: 'https://placehold.co/20x20/f4f4f4/999999?text=%20',
  shareInstagramUrl: '#',
};

const fmt = (n: number) => n.toFixed(2).replace('.', ',');
const intPart = (n: number) => String(Math.trunc(n));
const fracPart = (n: number) => n.toFixed(2).split('.')[1];

const StarIcon = ({ frac }: { frac: number }) => (
  <svg width="15" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <defs>
      <linearGradient id={`star-${Math.round(frac * 100)}`}>
        <stop offset={`${frac * 100}%`} stopColor="currentColor" />
        <stop offset={`${frac * 100}%`} stopColor="#d8d8d8" />
      </linearGradient>
    </defs>
    <path
      fill={`url(#star-${Math.round(frac * 100)})`}
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
);

const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
  </svg>
);

const ColorsArrow = () => (
  <svg width="7" height="12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M1 0.849121L6 5.84912L1 10.8491" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GuiaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M3 7h18v10H3z" />
    <path d="M7 7v4M11 7v6M15 7v4M19 7v6" />
  </svg>
);

/* SVG verbatim da origem (15×16; o clipPath deslocado é o que o faz renderizar 14×16).
   O #AC5552 é cor semântica de alerta — não é token de tema. */
const AlertIcon = () => (
  <svg width="15" height="16" viewBox="0 0 15 16" fill="none" aria-hidden="true" focusable="false">
    <g clipPath="url(#pdp06-forma-clip)">
      <path d="M1.76685 7.0469C1.97123 6.8269 1.8731 6.30252 1.90935 6.03252C2.03935 5.05627 2.37373 4.11065 2.91998 3.29315C3.0781 3.0569 3.7056 2.4069 3.75498 2.25315C3.91123 1.76752 3.5056 1.47002 3.07185 1.69565C2.73185 1.87252 2.01373 2.94502 1.81248 3.31127C1.3131 4.22252 0.785604 5.8644 0.984979 6.8944C1.04873 7.22377 1.56498 7.26377 1.76685 7.04627V7.0469Z" fill="white" />
      <path d="M14.8895 7.04438C14.982 6.93 14.9638 6.7925 14.9732 6.65875C15.0788 5.15625 14.2795 3.155 13.2526 2.06188C13.0082 1.80125 12.757 1.4875 12.3601 1.67188C11.692 1.98188 12.7995 2.96188 13.0207 3.29375C13.8413 4.52125 13.8663 5.25438 14.0382 6.65125C14.0945 7.10813 14.5951 7.40875 14.8888 7.045L14.8895 7.04438Z" fill="white" />
      <path d="M8.28314 0C9.27564 0.320625 9.47064 1.16563 9.41439 2.11875C10.6244 2.4275 11.7994 3.48438 12.3381 4.60125C13.2113 6.41125 12.5538 8.45312 13.1263 10.3756C13.4063 11.3156 13.94 12.1956 14.535 12.9669C14.79 13.2975 15.1725 13.4469 14.8919 13.9844L14.5606 14.1213L10.3231 14.1337L10.2513 14.1869C10.0163 15.1638 9.29314 15.7638 8.34626 16.0006H7.59626C6.65626 15.7556 5.92189 15.1663 5.69126 14.1869L5.61939 14.1337L1.38189 14.1213L1.05064 13.9844C0.770014 13.4469 1.15251 13.2981 1.40751 12.9669C2.00251 12.1956 2.53626 11.3156 2.81626 10.3756C3.38876 8.45312 2.73189 6.41125 3.60439 4.60125C4.15001 3.47 5.30564 2.435 6.52814 2.11875C6.46876 1.15563 6.67001 0.338125 7.65939 0H8.28439L8.28314 0ZM7.47064 1.875H8.47064C8.41314 1.52562 8.50439 0.955 8.00126 0.930625C7.43626 0.90375 7.54564 1.4925 7.47064 1.875ZM13.4706 13.1875L12.6044 11.6475C11.0456 8.875 13.1513 4.89937 9.72314 3.21625C7.43814 2.09437 4.38689 3.53 4.10189 6.10063C3.89814 7.93937 4.29939 9.89313 3.33626 11.6475L2.47001 13.1875H13.4706ZM9.28314 14.125H6.65814C7.02376 15.3506 8.91814 15.3506 9.28314 14.125Z" fill="#AC5552" />
      <path d="M1.76697 7.0469C1.56509 7.2644 1.04947 7.2244 0.985094 6.89502C0.785094 5.8644 1.31259 4.22315 1.81259 3.31127C2.01322 2.94502 2.73197 1.87252 3.07197 1.69565C3.50572 1.47002 3.91134 1.76752 3.75509 2.25315C3.70572 2.4069 3.07759 3.0569 2.92009 3.29315C2.37322 4.11065 2.03884 5.05627 1.90947 6.03252C1.87384 6.30252 1.97134 6.8269 1.76697 7.0469Z" fill="#AC5552" />
      <path d="M14.8894 7.04439C14.595 7.40814 14.0944 7.10751 14.0388 6.65064C13.8669 5.25376 13.8425 4.52064 13.0213 3.29314C12.7994 2.96189 11.6925 1.98126 12.3606 1.67126C12.7575 1.48689 13.0081 1.80126 13.2531 2.06126C14.28 3.15439 15.0794 5.15626 14.9738 6.65814C14.9644 6.79251 14.9819 6.93001 14.89 7.04376L14.8894 7.04439Z" fill="#AC5552" />
    </g>
    <defs>
      <clipPath id="pdp06-forma-clip">
        <rect width="14.0481" height="16" fill="white" transform="translate(0.941895)" />
      </clipPath>
    </defs>
  </svg>
);

/** Aviso de forma — `molecules/SizeFitAlert06`, só o ramo "Grande" do mock. */
function AvisoDeForma() {
  return (
    <div className={styles.fitAlert} data-role="fit-alert" data-fit="grande" role="note">
      <AlertIcon />
      <p className={styles.fitText}>
        <span>Atenção!</span>
        <strong> Forma Grande</strong>
        {'. Sugerimos'}
        <span> um tamanho menor do que está habituado a usar.</span>
      </p>
    </div>
  );
}

/** `molecules/ShippingSimulator06` no estado vazio: sem CEP, é só o formulário. */
function SimuladorDeFrete() {
  const [cep, setCep] = useState('');
  return (
    <div className={styles.container} data-role="shipping-simulator" data-variant="pdp">
      <form className={styles.form} onSubmit={e => e.preventDefault()}>
        <label htmlFor="postalCodeInput" className={styles.shipSrOnly}>
          Digite seu CEP para calcular o frete
        </label>
        <input
          id="postalCodeInput"
          className={styles.input}
          data-role="cep-input"
          type="tel"
          inputMode="numeric"
          maxLength={9}
          placeholder={CONTEUDO.cepPlaceholder}
          value={cep}
          onChange={e => setCep(e.target.value)}
        />
        <button className={styles.button} data-role="calc-btn" type="submit">
          {CONTEUDO.cepButtonLabel}
        </button>
      </form>
    </div>
  );
}

export default function ProductInfo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selSize, setSelSize] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [fav, setFav] = useState(false);
  const mainSwiperRef = React.useRef<SwiperType | null>(null);
  const colorsSwiperRef = React.useRef<SwiperType | null>(null);

  /* tamanho de entrada = o primeiro COM estoque, como na origem */
  const tamanhoPadrao = TAMANHOS.find(t => t.available !== false)?.value ?? null;
  const activeSize = selSize ?? tamanhoPadrao;
  const estrelas = [0, 1, 2, 3, 4].map(i =>
    Math.max(0, Math.min(1, PRODUTO.avaliacao.media - i))
  );

  return (
    /* wrapper só do catálogo: carrega o container-type das @container */
    <div className={styles.pdp06RootWrap}>
      <div className={styles.pdp06Root}>
        <div className={styles.bar} data-role="bar">
          <p className={styles.barText} data-role="bar-text">
            {CONTEUDO.barText}
          </p>
        </div>

        <div className={styles.main} data-role="pdp-main">
          {/* ── GALERIA ── */}
          <div className={styles.galleryCol}>
            <div className={styles.gallery} data-role="gallery">
              <div className={styles.thumbsCol}>
                <div className={styles.thumbsViewport}>
                  <div className={styles.thumbsTrack} style={{ transform: 'translateY(-0px)' }}>
                    {IMAGENS.map((img, i) => (
                      <div
                        key={i}
                        className={`${styles.thumbSlide}${i === activeIdx ? ` ${styles.thumbSlideActive}` : ''}`}
                      >
                        <button
                          type="button"
                          className={styles.thumb}
                          onClick={() => mainSwiperRef.current?.slideTo(i)}
                          aria-label={`Ver imagem ${i + 1} de ${IMAGENS.length}`}
                          aria-pressed={i === activeIdx}
                        >
                          <img src={img.url} alt={img.alternateName} loading="lazy" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.thumbCaret}
                  disabled
                  aria-label="Mais imagens"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </div>

              <div className={styles.stage}>
                <Swiper
                  className={styles.mainSwiper}
                  spaceBetween={4}
                  onSwiper={s => {
                    mainSwiperRef.current = s;
                  }}
                  onSlideChange={s => setActiveIdx(s.activeIndex)}
                >
                  {IMAGENS.map((img, i) => (
                    <SwiperSlide key={i} className={styles.mainSlide}>
                      <img
                        className={styles.stageImg}
                        src={img.url}
                        alt={img.alternateName || PRODUTO.nome}
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button
                  type="button"
                  className={`${styles.caret} ${styles.caretPrev}`}
                  onClick={() => mainSwiperRef.current?.slidePrev()}
                  disabled={activeIdx === 0}
                  aria-label="Imagem anterior"
                >
                  <svg width="7" height="12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 0.849121L6 5.84912L1 10.8491" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button
                  type="button"
                  className={`${styles.caret} ${styles.caretNext}`}
                  onClick={() => mainSwiperRef.current?.slideNext()}
                  disabled={activeIdx >= IMAGENS.length - 1}
                  aria-label="Próxima imagem"
                >
                  <svg width="7" height="12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 0.849121L6 5.84912L1 10.8491" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div className={styles.dashes} role="tablist" aria-label="Imagens do produto">
                  {IMAGENS.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`${styles.dash}${i === activeIdx ? ` ${styles.dashActive}` : ''}`}
                      onClick={() => mainSwiperRef.current?.slideTo(i)}
                      aria-label={`Imagem ${i + 1}`}
                      aria-current={i === activeIdx}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── INFO ── */}
          <div className={styles.info}>
            <div className={styles.gapRow}>
              <nav className={styles.breadcrumb06} aria-label="Trilha de navegação" data-role="breadcrumb06">
                <div className={styles.breadcrumb06Inner}>
                  <a className={styles.crumbHome} href="/">Home</a>
                  {TRILHA.map((c, i) => {
                    const ultimo = i === TRILHA.length - 1;
                    return (
                      <span key={i} className={styles.crumbSeg}>
                        <span className={styles.crumbSep} aria-hidden="true">
                          <svg width="8" height="8" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <a className={ultimo ? `${styles.crumbLink} ${styles.crumbTerm}` : styles.crumbLink} href={c.item}>
                          {c.name}
                        </a>
                      </span>
                    );
                  })}
                </div>
              </nav>
            </div>

            <div className={styles.gapRow}>
              <div className={styles.wishRow} data-role="wish-row">
                <div className={styles.wishRowInner}>
                  <span className={styles.ratingBox}>
                    <span className={styles.starsBox} aria-label={`Avaliação ${PRODUTO.avaliacao.media} de 5`}>
                      {estrelas.map((fr, i) => <StarIcon key={i} frac={fr} />)}
                    </span>
                  </span>
                  <span className={styles.wishActions}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={() => setFav(f => !f)}
                      aria-label={fav ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
                      aria-pressed={fav}
                    >
                      <span className={styles.heartSvg} aria-hidden="true" />
                    </button>
                    <span className={styles.shareWrap} data-role="share-wrap">
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => setShareOpen(o => !o)}
                        aria-label="Compartilhar"
                        aria-expanded={shareOpen}
                      >
                        <ShareIcon />
                      </button>
                      {shareOpen && (
                        <span className={styles.sharePopover} data-role="share-popover">
                          <a className={`${styles.shareTile} ${styles.shareWpp}`} href="#" aria-label="Compartilhar no WhatsApp" data-role="share-tile">
                            <img src={CONTEUDO.shareWhatsappIconUrl} alt="" width={20} height={20} />
                          </a>
                          <a className={`${styles.shareTile} ${styles.shareInsta}`} href={CONTEUDO.shareInstagramUrl} aria-label="Abrir o Instagram da marca" data-role="share-tile">
                            <img src={CONTEUDO.shareInstagramIconUrl} alt="" width={20} height={20} />
                          </a>
                          <a className={`${styles.shareTile} ${styles.shareFb}`} href="#" aria-label="Compartilhar no Facebook" data-role="share-tile">
                            <img src={CONTEUDO.shareFacebookIconUrl} alt="" width={20} height={20} />
                          </a>
                          <button type="button" className={`${styles.shareTile} ${styles.shareCopy}`} aria-label="Copiar o link do produto" data-role="share-tile">
                            <img src={CONTEUDO.shareCopyIconUrl} alt="" width={20} height={20} />
                          </button>
                          <span className={styles.srOnly} role="status" aria-live="polite" />
                        </span>
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.gapRow}>
              <h1 className={styles.name} data-role="name">{PRODUTO.nome}</h1>
            </div>

            <div className={styles.gapRowSm}>
              <p className={styles.cod} data-role="cod">
                <span className={styles.codLabel}>Cod</span>
                {' : '}
                <span className={styles.codValue}>{PRODUTO.refId}</span>
              </p>
            </div>

            <div className={styles.gapRowXs}>
              <p className={styles.listPriceWrap}>
                <span className={styles.listPrice} data-role="list-price">R$ {fmt(PRODUTO.precoDe)}</span>
              </p>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.sellingWrap}>
                <span className={styles.selling} data-role="selling">
                  <span className={styles.sellingBox}>
                    <span className={styles.sellingCode}>R$</span>
                    <span className={styles.sellingLit}> </span>
                    <span className={styles.sellingInt}>{intPart(PRODUTO.preco)}</span>
                    <span className={styles.sellingComma}>,</span>
                    <span className={styles.sellingFrac}>{fracPart(PRODUTO.preco)}</span>
                  </span>
                </span>
              </span>
              <span className={styles.installments} data-role="installments">
                {'ou '}
                <strong className={styles.instNum}>{PRODUTO.parcelaN}</strong>
                {'x de '}
                <strong className={styles.instVal}>R$ {fmt(PRODUTO.parcelaValor)}</strong>
              </span>
            </div>

            <div className={styles.colorsBlock} data-role="colors-block">
              <p className={styles.colorsTitle} data-role="colors-title">Cores</p>
              <div className={styles.colorsCarousel}>
                <button
                  type="button"
                  className={`${styles.colorsArrow} ${styles.colorsArrowPrev}`}
                  onClick={() => colorsSwiperRef.current?.slidePrev()}
                  aria-label="Cores anteriores"
                >
                  <ColorsArrow />
                </button>
                <Swiper
                  className={styles.colorsSwiper}
                  onSwiper={s => {
                    colorsSwiperRef.current = s;
                  }}
                  slidesPerView={2.3}
                  spaceBetween={3}
                  breakpoints={{ 961: { slidesPerView: 3, spaceBetween: 3 } }}
                  watchOverflow
                >
                  {CORES.map(v => (
                    <SwiperSlide key={v.name} className={styles.colorSlide}>
                      <a
                        className={styles.colorTile}
                        href={v.href}
                        aria-current={v.active ? 'page' : undefined}
                        data-role="color-tile"
                      >
                        <img src={v.image} alt={v.name} loading="lazy" />
                      </a>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <button
                  type="button"
                  className={`${styles.colorsArrow} ${styles.colorsArrowNext}`}
                  onClick={() => colorsSwiperRef.current?.slideNext()}
                  aria-label="Próximas cores"
                >
                  <ColorsArrow />
                </button>
              </div>
            </div>

            <div className={styles.sizeBlock}>
              <span className={styles.sizeLabel} data-role="size-label">
                Tamanho{activeSize ? ` ${activeSize}` : ''}
              </span>
              <div className={styles.sizes}>
                {TAMANHOS.map(s => {
                  const indisponivel = s.available === false;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      className={`${styles.sizeChip}${activeSize === s.value ? ` ${styles.sizeActive}` : ''}${indisponivel ? ` ${styles.sizeUnavailable}` : ''}`}
                      onClick={() => (indisponivel ? undefined : setSelSize(s.value))}
                      aria-pressed={activeSize === s.value}
                      aria-disabled={indisponivel}
                      aria-label={indisponivel ? `Tamanho ${s.label} indisponível — avise-me` : `Tamanho ${s.label}`}
                    >
                      <span className={styles.sizeText}>{s.label}</span>
                      {indisponivel && <span className={styles.sizeBell} aria-hidden="true" />}
                      {indisponivel && <span className={styles.aviseBalloon} role="tooltip">{CONTEUDO.aviseMeLabel}</span>}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className={styles.sizeGuide}
                data-role="guia-btn"
                onClick={() => setGuideOpen(true)}
                aria-haspopup="dialog"
              >
                <GuiaIcon />
                {CONTEUDO.sizeGuideLabel}
              </button>
              <AvisoDeForma />
            </div>

            <div className={styles.buyWrap}>
              <button type="button" className={styles.buy} data-role="buy">
                {CONTEUDO.buyLabel}
              </button>
            </div>

            <div className={styles.shipRow}>
              <p className={styles.consulte} data-role="consulte">{CONTEUDO.consulteLabel}</p>
              <p className={styles.fretePill} data-role="frete-pill">
                <strong>{CONTEUDO.fretePillBold}</strong> {CONTEUDO.fretePillText}
              </p>
            </div>

            <div className={styles.cepWrap}>
              <SimuladorDeFrete />
            </div>

            <div className={styles.envioWrap}>
              <div className={`${styles.infoLine} ${styles.envioLine}`} data-role="envio-row">
                <img className={styles.infoIcon} src={CONTEUDO.envioIconUrl} alt="" />
                <p className={styles.infoText}>
                  <strong>{CONTEUDO.envioBold}</strong> {CONTEUDO.envioText}
                </p>
              </div>
            </div>
            <div className={styles.trocaWrap}>
              <div className={`${styles.infoLine} ${styles.trocaLine}`} data-role="troca-row">
                <img className={styles.infoIcon} src={CONTEUDO.trocaIconUrl} alt="" />
                <p className={styles.infoText}>
                  <strong>{CONTEUDO.trocaBold}</strong> {CONTEUDO.trocaText}
                </p>
              </div>
            </div>

            <section className={styles.descBlock}>
              <h2 className={styles.descTitle} data-role="desc-title">Descrição</h2>
              <div
                className={styles.descContent}
                dangerouslySetInnerHTML={{ __html: DESCRICAO_HTML }}
              />
            </section>

            <section className={styles.specs}>
              <h3 className={styles.specTitle} data-role="spec-title">Características</h3>
              <div className={styles.specRow} data-role="spec-row">
                {ESPECIFICACOES.map((p, i) => (
                  <div key={i} className={styles.specContent} data-role="spec-content">
                    <img className={styles.specIcon} src={p.icon} alt={p.name} />
                    <span className={styles.specName} data-role="spec-name">{p.name}</span>
                    <span className={styles.specValue} data-role="spec-value">{p.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {guideOpen && (
          <div
            className={styles.guideOverlay}
            role="presentation"
            onClick={e => {
              if (e.target === e.currentTarget) setGuideOpen(false);
            }}
          >
            <div className={styles.guideModal} role="dialog" aria-modal="true" aria-label={CONTEUDO.sizeGuideLabel}>
              <button
                type="button"
                className={styles.guideClose}
                onClick={() => setGuideOpen(false)}
                aria-label="Fechar guia de medidas"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
              </button>
              <img className={styles.guideImg} src={CONTEUDO.sizeGuideImage} alt={`${CONTEUDO.sizeGuideLabel} — ${PRODUTO.nome}`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

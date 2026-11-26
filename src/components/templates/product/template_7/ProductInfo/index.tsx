'use client';

import React, { useState } from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';
import type { OpcaoNormal } from '@/utils/produtos';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductDetails07` do faststore.starter — a compra da PDP
 * editorial, em duas árvores trocadas por CSS aos 960px. Desktop: galeria com 5
 * thumbs e a coluna de compra sticky (rótulo, título, avaliação, preço/parcela/Pix,
 * tamanho, estampa, quantidade, CTAs, selo de confiança e benefícios). Mobile:
 * galeria com dots, info e a barra fixa de compra.
 *
 * A trilha, a descrição (+ especificações, cuidados e FAQ) e os relacionados eram
 * blocos deste componente e viraram peças próprias, como na família 01: Breadcrumb07,
 * ProductDescription07 e ProductRelated07.
 *
 * O que sai: `usePDP`, `useBuyButton`, `useLazyQuery` do rating e o tracking — o
 * conteúdo abaixo é o mesmo do `mock.ts` da origem. `useState` fica para a
 * quantidade e o thumb ativo, que é o que faz o preview parecer vivo.
 *
 * As imagens têm `url` vazia na origem de propósito ("o SCSS aplica o
 * gradiente-placeholder, mesmo look da origem"), então aqui elas não existem:
 * pôr um placeholder criaria uma imagem que o original não tem.
 *
 * Conteúdo: só os rótulos e os textos do CMS (`useConteudoDaSecao`, campos do schema
 * do ProductDetails07) vêm do hook; produto, preço, tamanhos e estampas continuam os
 * de exemplo. `consultoraWhatsapp`/`consultoraMessage` ficam fora: o link do WhatsApp
 * é só `#` no preview.
 */
interface ProductInfo07Conteudo {
  eyebrow?: string;
  trustMessage?: string;
  benefits: string[];
  consultoraLabel?: string;
  addToCartLabel?: string;
  otherPaymentLabel?: string;
}

const COR_HEX: Record<string, string> = {
  citrino: '#D4C090',
  grafite: '#2C2420',
  bege: '#C8B8A8',
  vinho: '#7A3535',
  azul: '#354A7A',
};

const TAMANHOS = ['1,40m × 2,00m', '1,60m × 2,30m', '2,00m × 2,50m', '2,40m × 3,00m'];
const ESTAMPAS = ['citrino', 'grafite', 'bege', 'vinho', 'azul'];
const TAMANHO_ATIVO = '2,00m × 2,50m';
const ESTAMPA_ATIVA = 'citrino';

const EXEMPLO = {
  nome: 'Tapete para Sala Belga Essence Clássico 2,00m × 2,50m',
  preco: 779.9,
  parcelaN: 10,
  parcelaValor: 77.99,
  pixValor: 740.9,
  pixPct: 5,
  avaliacao: { media: 4.9, total: 312 },
  imagens: [
    'Tapete Belga Essence Clássico — vista principal',
    'Detalhe da trama',
    'Franjas',
    'Ambientado na sala',
    'Textura em close',
  ],
};

const MOCK: ProductInfo07Conteudo = {
  eyebrow: 'Tapete Belga · Coleção Essence',
  trustMessage:
    'Compra segura, parcelamento sem juros e atendimento especializado',
  benefits: [
    'Combina com vários ambientes',
    'Estampa clássica e atemporal',
    'Conforto e durabilidade',
    'Acabamento com franjas',
  ],
  consultoraLabel: 'Comprar com uma consultora',
  addToCartLabel: 'Adicionar à Sacola',
  otherPaymentLabel: 'Outras formas de pagamento →',
};

const fmt = (n: number) => n.toFixed(2).replace('.', ',');

/** O fundo da miniatura de uma opção da loja: a cor (hex) ou a foto enviada. */
const fundoDaOpcao = (
  tipo: 'texto' | 'cor' | 'imagem',
  o: OpcaoNormal
): React.CSSProperties | undefined =>
  tipo === 'imagem' && o.swatchImage
    ? {
        backgroundImage: `url(${o.swatchImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : o.color
      ? { background: o.color }
      : undefined;

const ESTRELA = (
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
);

/** 5 estrelas com preenchimento PARCIAL pela média — camada base + camada cheia recortada. */
function Stars({ average, size }: { average: number; size: number }) {
  const pct = Math.max(0, Math.min(100, (average / 5) * 100));
  const fila = () =>
    [0, 1, 2, 3, 4].map(i => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        {ESTRELA}
      </svg>
    ));
  return (
    <div className={styles.stars} aria-hidden="true">
      <div className={styles.starsBase}>{fila()}</div>
      <div className={styles.starsFill} style={{ width: `${pct}%` }}>
        {fila()}
      </div>
    </div>
  );
}

export default function ProductInfo() {
  const {
    eyebrow,
    trustMessage: CONFIANCA,
    benefits: BENEFICIOS,
    consultoraLabel: CONSULTORA,
    addToCartLabel,
    otherPaymentLabel,
  } = useConteudoDaSecao(MOCK);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  // O produto é o 1º da loja quando o CS cadastrou; senão o de exemplo. Cada variação dele
  // vira um bloco no estilo do tipo (texto = botões de tamanho; cor e imagem = miniaturas).
  // O cadastro não tem avaliação nem Pix: esses blocos não se desenham para o produto da loja.
  const pLoja = useProdutosDaLoja()?.[0];
  const [escolhas, setEscolhas] = useState<Record<number, number>>({});
  const PRODUTO = pLoja
    ? {
        ...EXEMPLO,
        nome: pLoja.name,
        preco: pLoja.price,
        parcelaN: pLoja.installments,
        parcelaValor: pLoja.installmentValue,
        imagens: pLoja.images.map((_, i) => `${pLoja.name} — foto ${i + 1}`),
      }
    : EXEMPLO;
  const fotoAtiva = pLoja?.images[activeImg];
  const comFoto = (url?: string): React.CSSProperties | undefined =>
    url
      ? {
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : undefined;

  const blocoDeVariacao = (
    v: NonNullable<typeof pLoja>['variants'][number],
    vi: number,
    mobile: boolean
  ) => {
    const atual =
      escolhas[vi] ?? Math.max(0, v.options.findIndex(o => o.available));
    const escolher = (e: React.MouseEvent, oi: number) => {
      e.preventDefault();
      setEscolhas(prev => ({ ...prev, [vi]: oi }));
    };
    const m = mobile ? 'm' : '';
    if (v.tipo === 'texto')
      return (
        <div
          key={vi}
          className={mobile ? styles.mSize : styles.size}
          data-role={`${m ? 'm-' : ''}size`}
          data-variacao={v.tipo}
        >
          <p className={mobile ? styles.mOptLabel : styles.optLabel}>
            {v.name || 'Tamanho'}
          </p>
          <div className={mobile ? styles.mSizeRow : styles.sizeRow}>
            {v.options.map((o, oi) => {
              const ativo = atual === oi;
              const cls = mobile
                ? `${styles.mSizeBtn} ${ativo ? styles.mSizeBtnActive : ''}`
                : `${styles.sizeBtn} ${ativo ? styles.sizeBtnActive : ''}`;
              return (
                <a
                  key={oi}
                  href="#"
                  className={cls}
                  data-role={mobile ? 'm-size-btn' : 'size-btn'}
                  onClick={e => escolher(e, oi)}
                >
                  {o.label}
                </a>
              );
            })}
          </div>
        </div>
      );
    return (
      <div
        key={vi}
        className={mobile ? styles.mEstampa : styles.color}
        data-role={mobile ? 'm-estampa' : 'color'}
        data-variacao={v.tipo}
      >
        <p className={mobile ? styles.mOptLabel : styles.optLabel}>
          {v.name || 'Estampa'} —{' '}
          {mobile ? (
            v.options[atual]?.label
          ) : (
            <span className={styles.colorName}>{v.options[atual]?.label}</span>
          )}
        </p>
        <div className={mobile ? styles.mSwatchRow : styles.swatchRow}>
          {v.options.map((o, oi) => {
            const ativo = atual === oi;
            const cls = mobile
              ? `${styles.mSwatch} ${ativo ? styles.mSwatchActive : ''}`
              : `${styles.swatch} ${ativo ? styles.swatchActive : ''}`;
            return (
              <a
                key={oi}
                href="#"
                className={cls}
                data-role={mobile ? 'm-swatch' : 'swatch'}
                style={fundoDaOpcao(v.tipo, o)}
                aria-label={o.label}
                onClick={e => escolher(e, oi)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const porTecla = (e: React.KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };

  return (
    /* wrapper só do catálogo: carrega o container-type das @container */
    <div className={styles.pdpRootWrap}>
      <div className={styles.pdpRoot}>
        {/* ═══════════════ DESKTOP ═══════════════ */}
        <div className={styles.desktop} data-role="root">
          <div className={styles.main} data-role="main">
            <div className={styles.gallery} data-role="gallery">
              <div
                className={styles.galleryMain}
                data-role="gallery-main"
                style={comFoto(fotoAtiva)}
              >
                <div className={styles.galleryZoom}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <span>Ampliar</span>
                </div>
                <span className={styles.galleryHeart} aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </span>
              </div>
              <div className={styles.galleryThumbs} data-role="gallery-thumbs">
                {PRODUTO.imagens.map((alt, i) => (
                  <div
                    key={i}
                    className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                    data-role="thumb"
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver imagem ${i + 1}`}
                    aria-current={i === activeImg}
                    onClick={() => setActiveImg(i)}
                    onKeyDown={e => porTecla(e, () => setActiveImg(i))}
                    style={comFoto(pLoja?.images[i])}
                  />
                ))}
              </div>
            </div>

            <div className={styles.purchase} data-role="purchase">
              {eyebrow && (
                <p className={styles.eyebrow} data-role="eyebrow">
                  {eyebrow}
                </p>
              )}
              <h1 className={styles.title} data-role="title">
                {PRODUTO.nome}
              </h1>

              {!pLoja && (
                <div className={styles.rating} data-role="rating">
                  <Stars average={PRODUTO.avaliacao.media} size={13} />
                  <span className={styles.ratingText}>
                    {PRODUTO.avaliacao.media.toFixed(1).replace('.', ',')} ·{' '}
                    {PRODUTO.avaliacao.total} avaliações
                  </span>
                </div>
              )}

              <div className={styles.priceBlock} data-role="price-block">
                <p className={styles.price} data-role="price">
                  R$ {fmt(PRODUTO.preco)}
                </p>
                {PRODUTO.parcelaN > 0 && (
                  <p className={styles.installment} data-role="installment">
                    ou {PRODUTO.parcelaN}× de{' '}
                    <strong className={styles.installmentValue}>
                      R$ {fmt(PRODUTO.parcelaValor)}
                    </strong>
                    {!pLoja && ' sem juros'}
                  </p>
                )}
                {!pLoja && (
                  <div className={styles.pix} data-role="pix">
                    <span className={styles.pixBadge}>PIX</span>
                    <p className={styles.pixText}>
                      R$ {fmt(PRODUTO.pixValor)}{' '}
                      <span className={styles.pixMeta}>
                        à vista · {PRODUTO.pixPct}% off
                      </span>
                    </p>
                  </div>
                )}
                {otherPaymentLabel && (
                  <a className={styles.otherPay} href="#pagamento">
                    {otherPaymentLabel}
                  </a>
                )}
              </div>

              {pLoja && pLoja.variants.map((v, vi) => blocoDeVariacao(v, vi, false))}

              {!pLoja && (
              <div className={styles.size} data-role="size" data-variacao="texto">
                <p className={styles.optLabel}>Tamanho</p>
                <div className={styles.sizeRow}>
                  {TAMANHOS.map(t => (
                    <a
                      key={t}
                      href="#"
                      className={`${styles.sizeBtn} ${t === TAMANHO_ATIVO ? styles.sizeBtnActive : ''}`}
                      data-role="size-btn"
                    >
                      {t}
                    </a>
                  ))}
                </div>
              </div>

              )}

              {!pLoja && (
              <div className={styles.color} data-role="color" data-variacao="cor">
                <p className={styles.optLabel}>
                  Estampa —{' '}
                  <span className={styles.colorName}>
                    {ESTAMPA_ATIVA.charAt(0).toUpperCase() + ESTAMPA_ATIVA.slice(1)}
                  </span>
                </p>
                <div className={styles.swatchRow}>
                  {ESTAMPAS.map(e => (
                    <a
                      key={e}
                      href="#"
                      className={`${styles.swatch} ${e === ESTAMPA_ATIVA ? styles.swatchActive : ''}`}
                      data-role="swatch"
                      style={{ background: COR_HEX[e] }}
                      aria-label={e}
                    />
                  ))}
                </div>
              </div>

              )}

              <div className={styles.qtyRow} data-role="qty-row">
                <div className={styles.qty} data-role="qty">
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    aria-label="Diminuir quantidade"
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{qty}</span>
                  <button
                    type="button"
                    className={styles.qtyBtn}
                    aria-label="Aumentar quantidade"
                    onClick={() => setQty(q => q + 1)}
                  >
                    +
                  </button>
                </div>
                <button type="button" className={styles.ctaBuy} data-role="cta-buy">
                  {addToCartLabel}
                </button>
              </div>

              {CONSULTORA && (
                <button
                  type="button"
                  className={styles.ctaConsultora}
                  data-role="cta-consultora"
                >
                  {CONSULTORA}
                </button>
              )}

              <div className={styles.trust} data-role="trust">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <p>{CONFIANCA}</p>
              </div>

              <div className={styles.benefits} data-role="benefits">
                {BENEFICIOS.map((b, i) => (
                  <div key={i} className={styles.benefit} data-role="benefit">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <p>{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ MOBILE ═══════════════ */}
        <div className={styles.mobile} data-role="m-root">
          <div className={styles.mGallery} data-role="m-gallery">
            <div className={styles.mGalleryMain} style={comFoto(fotoAtiva)}>
              <span className={styles.mHeart} aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </span>
            </div>
            <div className={styles.mDots} data-role="m-dots">
              {PRODUTO.imagens.map((_, i) => (
                <span
                  key={i}
                  className={i === activeImg ? styles.mDotActive : styles.mDot}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver imagem ${i + 1}`}
                  onClick={() => setActiveImg(i)}
                  onKeyDown={e => porTecla(e, () => setActiveImg(i))}
                />
              ))}
            </div>
          </div>

          <div className={styles.mInfo} data-role="m-info">
            {eyebrow && (
              <p className={styles.mEyebrow} data-role="m-eyebrow">
                {eyebrow}
              </p>
            )}
            <p className={styles.mTitle} data-role="m-title" role="heading" aria-level={1}>
              {PRODUTO.nome}
            </p>

            {!pLoja && (
              <div className={styles.mRating} data-role="m-rating">
                <Stars average={PRODUTO.avaliacao.media} size={12} />
                <span className={styles.ratingText}>
                  {fmt(PRODUTO.avaliacao.media)} · {PRODUTO.avaliacao.total} avaliações
                </span>
              </div>
            )}

            <div className={styles.mPriceBlock} data-role="m-price-block">
              <p className={styles.mPrice} data-role="m-price">
                R$ {fmt(PRODUTO.preco)}
              </p>
              {PRODUTO.parcelaN > 0 && (
                <p className={styles.mInstallment} data-role="m-installment">
                  ou {PRODUTO.parcelaN}× de R$ {fmt(PRODUTO.parcelaValor)}
                  {!pLoja && ' sem juros'}
                </p>
              )}
              {!pLoja && (
                <div className={styles.mPix} data-role="m-pix">
                  <span className={styles.mPixBadge}>PIX</span>
                  <p className={styles.mPixText}>
                    R$ {fmt(PRODUTO.pixValor)}{' '}
                    <span className={styles.mPixMeta}>· {PRODUTO.pixPct}% off</span>
                  </p>
                </div>
              )}
            </div>

            {pLoja && pLoja.variants.map((v, vi) => blocoDeVariacao(v, vi, true))}

            {!pLoja && (
            <div className={styles.mEstampa} data-role="m-estampa" data-variacao="cor">
              <p className={styles.mOptLabel}>
                Estampa — {ESTAMPA_ATIVA.charAt(0).toUpperCase() + ESTAMPA_ATIVA.slice(1)}
              </p>
              <div className={styles.mSwatchRow}>
                {ESTAMPAS.map(e => (
                  <a
                    key={e}
                    href="#"
                    className={`${styles.mSwatch} ${e === ESTAMPA_ATIVA ? styles.mSwatchActive : ''}`}
                    data-role="m-swatch"
                    style={{ background: COR_HEX[e] }}
                    aria-label={e}
                  />
                ))}
              </div>
            </div>

            )}

            {!pLoja && (
            <div className={styles.mSize} data-role="m-size" data-variacao="texto">
              <p className={styles.mOptLabel}>Tamanho</p>
              <div className={styles.mSizeRow}>
                {TAMANHOS.map(t => (
                  <a
                    key={t}
                    href="#"
                    className={`${styles.mSizeBtn} ${t === TAMANHO_ATIVO ? styles.mSizeBtnActive : ''}`}
                    data-role="m-size-btn"
                  >
                    {t}
                  </a>
                ))}
              </div>
            </div>

            )}

            <div className={styles.mTrust} data-role="m-trust">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <p>{CONFIANCA}</p>
            </div>

            <div className={styles.mBenefits} data-role="m-benefits">
              {BENEFICIOS.map((b, i) => (
                <div key={i} className={styles.mBenefit} data-role="m-benefit">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <p>{b}</p>
                </div>
              ))}
            </div>

          </div>

          <div className={styles.mStickyCta} data-role="m-sticky-cta">
            <button type="button" className={styles.mCtaBuy}>
              {addToCartLabel}
            </button>
            <a
              className={styles.mWaBtn}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={CONSULTORA}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductInfo.conteudoPadrao = MOCK;

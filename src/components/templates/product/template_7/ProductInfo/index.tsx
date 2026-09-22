'use client';

import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductDetails07` do faststore.starter — a PDP editorial
 * inteira, em duas árvores trocadas por CSS aos 960px. Desktop: trilha,
 * galeria com 5 thumbs, coluna de compra sticky (rótulo, título, avaliação,
 * preço/parcela/Pix, tamanho, estampa, quantidade, CTAs, selo de confiança e
 * benefícios), bloco de descrição + especificações + cuidados + FAQ, e a
 * prateleira de relacionados. Mobile: galeria com dots, info, acordeão de 3
 * blocos, relacionados e a barra fixa de compra.
 *
 * O que sai: `usePDP`, `useProductsQuery`, `useBuyButton`, `useLazyQuery` do
 * rating, `useViewItemList` e o tracking — o conteúdo abaixo é o mesmo do
 * `mock.ts` da origem. `useState` fica para a quantidade, o thumb ativo e os
 * acordeões, que é o que faz o preview parecer vivo.
 *
 * As imagens têm `url` vazia na origem de propósito ("o SCSS aplica o
 * gradiente-placeholder, mesmo look da origem"), então aqui elas não existem:
 * pôr um placeholder criaria uma imagem que o original não tem.
 */
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

const PRODUTO = {
  nome: 'Tapete para Sala Belga Essence Clássico 2,00m × 2,50m',
  eyebrow: 'Tapete Belga · Coleção Essence',
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

const TRILHA = [
  { item: '/', name: 'Início' },
  { item: '/decoracao', name: 'Decoração' },
  { item: '/decoracao/tapetes', name: 'Tapetes' },
  { item: '/decoracao/tapetes/tapete-para-sala', name: 'Tapete para Sala' },
  { name: 'Tapete Belga Essence Clássico' },
];

const DESCRICAO = {
  eyebrow: 'Sobre o produto',
  titulo: 'Elegância clássica para sala ou quarto',
  paragrafos: [
    'Com superfície levemente aveludada e toque surpreendentemente suave, o Tapete Belga Essence Clássico é confeccionado com 70% de poliéster e 30% de algodão — uma composição pensada para durabilidade sem abrir mão do conforto.',
    'Seus arabescos florais, bordas contrastantes e acabamento com franjas elegantes criam um ponto de destaque em qualquer composição, sem perder a sofisticação que um ambiente bem decorado exige.',
    'Ideal para posicionar embaixo de mesa de centro, com sofá neutro ou em quarto com composição clássica — em ambientes com madeira, tons claros e decoração atemporal.',
  ],
};

const ESPECIFICACOES = {
  eyebrow: 'Especificações',
  cards: [
    { label: 'Composição', value: '70% Poliéster · 30% Algodão' },
    { label: 'Dimensões', value: '2,00m × 2,50m' },
    { label: 'Perfil', value: 'Baixo perfil · 6mm' },
    { label: 'Embalagem', value: '1 tapete enrolado' },
  ],
  cuidadosTitulo: 'Cuidados e lavagem',
  cuidadosTexto:
    'Lavar à mão ou em máquina com programa delicado. Não usar alvejante. Secar à sombra. Não usar secadora.',
};

const FAQ = {
  titulo: 'Dúvidas frequentes',
  itens: [
    {
      q: 'Como escolher o tamanho certo?',
      a: 'Meça o espaço e deixe o tapete ultrapassar o sofá em pelo menos 20 cm de cada lado. Para salas de 20m² ou mais, o 2,00m × 2,50m é o padrão.',
    },
    {
      q: 'O tapete tem antiderrapante?',
      a: 'A base tem acabamento de baixo perfil. Para pisos muito lisos, recomendamos usar uma manta antiderrapante por baixo (vendida separadamente).',
    },
    {
      q: 'Qual o prazo de entrega?',
      a: 'Enviamos para todo o Brasil. O prazo estimado aparece no carrinho após informar seu CEP, variando conforme a região.',
    },
  ],
};

const ENTREGA =
  'Enviamos para todo o Brasil com rastreio. O prazo e o valor do frete aparecem no carrinho após você informar o CEP. Trocas em até 7 dias corridos após o recebimento.';

const BENEFICIOS = [
  'Combina com vários ambientes',
  'Estampa clássica e atemporal',
  'Conforto e durabilidade',
  'Acabamento com franjas',
];

const CONFIANCA =
  'Compra segura, parcelamento sem juros e atendimento especializado';
const CONSULTORA = 'Comprar com uma consultora';

const RELACIONADOS = [
  { id: 'r1', tag: 'Mesmo modelo', title: 'Essence Clássico 1,40m × 2,00m', price: 549.9, parcela: '10× R$ 54,99' },
  { id: 'r2', tag: 'Similar', title: 'Tapete Persa Damask Bege', price: 689.9, parcela: '10× R$ 68,99' },
  { id: 'r3', tag: 'Combina com', title: 'Almofada Veludo Gold 45×45', price: 129.9, parcela: '3× R$ 43,30' },
  { id: 'r4', tag: 'Combina com', title: 'Manta Tricô Areia Premium', price: 189.9, parcela: '5× R$ 37,98' },
];

const RELACIONADOS_TITULO = 'Produtos relacionados';
const RELACIONADOS_TITULO_MOBILE = 'Você também pode gostar';

const fmt = (n: number) => n.toFixed(2).replace('.', ',');

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
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openAcc, setOpenAcc] = useState<number | null>(null);

  const acordeaoMobile = [
    { title: 'Descrição do produto', body: DESCRICAO.paragrafos.join('\n\n') },
    {
      title: 'Composição e especificações',
      body: [
        ...ESPECIFICACOES.cards.map(s => `${s.label}: ${s.value}`),
        `${ESPECIFICACOES.cuidadosTitulo}: ${ESPECIFICACOES.cuidadosTexto}`,
      ].join('\n'),
    },
    { title: 'Entrega e prazo', body: ENTREGA },
  ];

  const alternar = (
    set: React.Dispatch<React.SetStateAction<number | null>>,
    i: number
  ) => set(prev => (prev === i ? null : i));

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
          <nav className={styles.breadcrumb} aria-label="breadcrumb" data-role="breadcrumb">
            {TRILHA.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className={styles.crumbSep}>›</span>}
                {i < TRILHA.length - 1 ? (
                  <a href={c.item || '#'} className={styles.crumbLink}>
                    {c.name}
                  </a>
                ) : (
                  <span className={styles.crumbCurrent}>{c.name}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className={styles.main} data-role="main">
            <div className={styles.gallery} data-role="gallery">
              <div className={styles.galleryMain} data-role="gallery-main">
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
                  />
                ))}
              </div>
            </div>

            <div className={styles.purchase} data-role="purchase">
              <p className={styles.eyebrow} data-role="eyebrow">
                {PRODUTO.eyebrow}
              </p>
              <h1 className={styles.title} data-role="title">
                {PRODUTO.nome}
              </h1>

              <div className={styles.rating} data-role="rating">
                <Stars average={PRODUTO.avaliacao.media} size={13} />
                <span className={styles.ratingText}>
                  {PRODUTO.avaliacao.media.toFixed(1).replace('.', ',')} ·{' '}
                  {PRODUTO.avaliacao.total} avaliações
                </span>
              </div>

              <div className={styles.priceBlock} data-role="price-block">
                <p className={styles.price} data-role="price">
                  R$ {fmt(PRODUTO.preco)}
                </p>
                <p className={styles.installment} data-role="installment">
                  ou {PRODUTO.parcelaN}× de{' '}
                  <strong className={styles.installmentValue}>
                    R$ {fmt(PRODUTO.parcelaValor)}
                  </strong>{' '}
                  sem juros
                </p>
                <div className={styles.pix} data-role="pix">
                  <span className={styles.pixBadge}>PIX</span>
                  <p className={styles.pixText}>
                    R$ {fmt(PRODUTO.pixValor)}{' '}
                    <span className={styles.pixMeta}>
                      à vista · {PRODUTO.pixPct}% off
                    </span>
                  </p>
                </div>
                <a className={styles.otherPay} href="#pagamento">
                  Outras formas de pagamento →
                </a>
              </div>

              <div className={styles.size} data-role="size">
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

              <div className={styles.color} data-role="color">
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
                  Adicionar à Sacola
                </button>
              </div>

              <button
                type="button"
                className={styles.ctaConsultora}
                data-role="cta-consultora"
              >
                {CONSULTORA}
              </button>

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

          <div className={styles.description} data-role="description">
            <div className={styles.descCol} data-role="desc-col">
              <p className={styles.sectionEyebrow}>{DESCRICAO.eyebrow}</p>
              <h2 className={styles.descTitle} data-role="desc-title">
                {DESCRICAO.titulo}
              </h2>
              {DESCRICAO.paragrafos.map((p, i) => (
                <p key={i} className={styles.descP} data-role="desc-p">
                  {p}
                </p>
              ))}
            </div>
            <div className={styles.specsCol} data-role="specs-col">
              <p className={styles.sectionEyebrow}>{ESPECIFICACOES.eyebrow}</p>
              <div className={styles.specsGrid} data-role="specs-grid">
                {ESPECIFICACOES.cards.map((s, i) => (
                  <div key={i} className={styles.specCard} data-role="spec-card">
                    <p className={styles.specLabel}>{s.label}</p>
                    <p className={styles.specValue}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className={styles.care} data-role="care">
                <p className={styles.specLabel}>{ESPECIFICACOES.cuidadosTitulo}</p>
                <p className={styles.careText}>{ESPECIFICACOES.cuidadosTexto}</p>
              </div>
              <div className={styles.faq} data-role="faq">
                <p className={styles.sectionEyebrow}>{FAQ.titulo}</p>
                {FAQ.itens.map((f, i) => (
                  <div
                    key={i}
                    className={`${styles.faqItem} ${i === FAQ.itens.length - 1 ? styles.faqItemLast : ''}`}
                    data-role="faq-item"
                  >
                    <div
                      className={styles.faqHead}
                      role="button"
                      tabIndex={0}
                      onClick={() => alternar(setOpenFaq, i)}
                      onKeyDown={e => porTecla(e, () => alternar(setOpenFaq, i))}
                      aria-expanded={openFaq === i}
                      aria-controls={`pdp07-faq-panel-${i}`}
                    >
                      <p className={styles.faqQ}>{f.q}</p>
                      <span className={styles.faqToggle}>{openFaq === i ? '−' : '+'}</span>
                    </div>
                    {openFaq === i && (
                      <p id={`pdp07-faq-panel-${i}`} className={styles.faqA} role="region">
                        {f.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.related} data-role="related">
            <div className={styles.relatedHead}>
              <h2 className={styles.relatedTitle} data-role="related-title">
                {RELACIONADOS_TITULO}
              </h2>
              <a className={styles.relatedMore} href="#relacionados">
                Ver mais →
              </a>
            </div>
            <div className={styles.relatedGrid} data-role="related-grid">
              {RELACIONADOS.map(p => (
                <a key={p.id} href="#" className={styles.relatedCard} data-role="related-card">
                  <div className={styles.relatedImg} />
                  <div className={styles.relatedBody}>
                    <p className={styles.relatedTag}>{p.tag}</p>
                    <h3 className={styles.relatedName}>{p.title}</h3>
                    <p className={styles.relatedPrice}>R$ {fmt(p.price)}</p>
                    <p className={styles.relatedInst}>{p.parcela}</p>
                    <span className={styles.relatedBuy}>Comprar</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════ MOBILE ═══════════════ */}
        <div className={styles.mobile} data-role="m-root">
          <div className={styles.mGallery} data-role="m-gallery">
            <div className={styles.mGalleryMain}>
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
            <p className={styles.mEyebrow} data-role="m-eyebrow">
              {PRODUTO.eyebrow}
            </p>
            <p className={styles.mTitle} data-role="m-title" role="heading" aria-level={1}>
              {PRODUTO.nome}
            </p>

            <div className={styles.mRating} data-role="m-rating">
              <Stars average={PRODUTO.avaliacao.media} size={12} />
              <span className={styles.ratingText}>
                {fmt(PRODUTO.avaliacao.media)} · {PRODUTO.avaliacao.total} avaliações
              </span>
            </div>

            <div className={styles.mPriceBlock} data-role="m-price-block">
              <p className={styles.mPrice} data-role="m-price">
                R$ {fmt(PRODUTO.preco)}
              </p>
              <p className={styles.mInstallment} data-role="m-installment">
                ou {PRODUTO.parcelaN}× de R$ {fmt(PRODUTO.parcelaValor)} sem juros
              </p>
              <div className={styles.mPix} data-role="m-pix">
                <span className={styles.mPixBadge}>PIX</span>
                <p className={styles.mPixText}>
                  R$ {fmt(PRODUTO.pixValor)}{' '}
                  <span className={styles.mPixMeta}>· {PRODUTO.pixPct}% off</span>
                </p>
              </div>
            </div>

            <div className={styles.mEstampa} data-role="m-estampa">
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

            <div className={styles.mSize} data-role="m-size">
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

            <div className={styles.mAccordion} data-role="m-accordion">
              {acordeaoMobile.map((a, i) => (
                <div
                  key={i}
                  className={`${styles.mAccItem} ${i === acordeaoMobile.length - 1 ? styles.mAccItemLast : ''}`}
                  data-role="m-acc-item"
                >
                  <div
                    className={styles.mAccHead}
                    role="button"
                    tabIndex={0}
                    onClick={() => alternar(setOpenAcc, i)}
                    onKeyDown={e => porTecla(e, () => alternar(setOpenAcc, i))}
                    aria-expanded={openAcc === i}
                    aria-controls={`pdp07-acc-panel-${i}`}
                  >
                    <p className={styles.mAccQ}>{a.title}</p>
                    <span className={styles.mAccToggle}>{openAcc === i ? '−' : '+'}</span>
                  </div>
                  {openAcc === i && a.body && (
                    <p id={`pdp07-acc-panel-${i}`} className={styles.mAccBody} role="region">
                      {a.body}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.mRelated} data-role="m-related">
              <h2 className={styles.mRelatedTitle} data-role="m-related-title">
                {RELACIONADOS_TITULO_MOBILE}
              </h2>
              <div className={styles.mRelatedRow}>
                {RELACIONADOS.slice(0, 3).map(p => (
                  <a key={p.id} href="#" className={styles.mRelCard} data-role="m-rel-card">
                    <div className={styles.mRelImg} />
                    <div className={styles.mRelBody}>
                      <p className={styles.mRelName}>{p.title}</p>
                      <p className={styles.mRelPrice}>R$ {fmt(p.price)}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.mStickyCta} data-role="m-sticky-cta">
            <button type="button" className={styles.mCtaBuy}>
              Adicionar à Sacola
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

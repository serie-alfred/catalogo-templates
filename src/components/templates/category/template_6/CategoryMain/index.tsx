'use client';

import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/MainCategory06` do faststore.starter — a PLP 06 inteira,
 * com o grafo que ela compõe inline: o skin do override (`productGallery06`,
 * o mesmo da rota de categoria real), o título+contagem do `CategoryTitle06` e
 * o `ProductCard06`.
 *
 * O que sai: `usePLP`, `useProductsQuery`, `useSearch`/`useSearchPage`,
 * `useAuth`, a wishlist e o tracking. O conteúdo é o mesmo `mock.ts` da origem
 * (12 sneakers, contagem 204, trilha Home › Calçados › Sneakers), com as fotos
 * trocadas por `placehold.co` nas mesmas medidas: o catálogo é público e nenhum
 * template daqui aponta para o CDN de uma loja. Quem dimensiona a foto é o CSS,
 * então a geometria não muda — o portão confirma nó a nó.
 *
 * Fica de fora o que a origem também não desenha aqui: o drawer de filtros
 * (existe no DOM com `visibility: hidden` até abrir), a folha de tamanho do
 * card e o bloco "Compre por tamanho" da toolbar, que sem conteúdo de CMS não
 * renderiza. O botão Filtros continua na barra, como na origem.
 */
const foto = (i: number) =>
  `https://placehold.co/500x500/${['efefef', 'e7e7e7', 'dfdfdf', 'd7d7d7', 'cfcfcf'][i % 5]}/999999?text=Sneaker+${i + 1}`;

type Produto = {
  id: string;
  nome: string;
  preco: number;
  parcelaN: number;
  parcelaValor: number;
  imagens: string[];
  flag?: string;
  precoDe?: number;
};

const PRODUTOS: Produto[] = [
  { id: 'p1', nome: 'Sneaker Masculino Preto Flip', preco: 409.9, parcelaN: 10, parcelaValor: 40.99, imagens: [foto(0), foto(2), foto(3)], flag: 'Novidade' },
  { id: 'p2', nome: 'Sneaker Masculino Chocolate Mid', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(1), foto(2), foto(3)] },
  { id: 'p3', nome: 'Sneaker Masculino Flip Classic', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(2), foto(3), foto(4)] },
  { id: 'p4', nome: 'Sneaker Masculino Café Flip Classic', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(3), foto(2), foto(4)] },
  { id: 'p5', nome: 'Sneaker Masculino Flip Classic', preco: 419.9, parcelaN: 10, parcelaValor: 41.99, imagens: [foto(4), foto(2), foto(3)] },
  { id: 'p6', nome: 'Sneaker Masculino Preto Flip Classic', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(0), foto(2), foto(3)] },
  { id: 'p7', nome: 'Sneaker Masculino Knit Energy Preto', preco: 469.9, parcelaN: 10, parcelaValor: 46.99, imagens: [foto(1), foto(2), foto(3)], precoDe: 519.9 },
  { id: 'p8', nome: 'Sneaker Masculino Preto Flip', preco: 409.9, parcelaN: 10, parcelaValor: 40.99, imagens: [foto(2), foto(3), foto(4)] },
  { id: 'p9', nome: 'Sneaker Masculino Chocolate Mid', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(3), foto(2), foto(4)] },
  { id: 'p10', nome: 'Sneaker Masculino Café Flip Classic', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(4), foto(2), foto(3)] },
  { id: 'p11', nome: 'Sneaker Masculino Knit Energy', preco: 469.9, parcelaN: 10, parcelaValor: 46.99, imagens: [foto(0), foto(2), foto(3)] },
  { id: 'p12', nome: 'Sneaker Masculino Preto Flip Classic', preco: 399.9, parcelaN: 9, parcelaValor: 44.43, imagens: [foto(1), foto(2), foto(3)] },
];

const TRILHA = [
  { item: '/calcados', name: 'Calçados' },
  { item: '/calcados/sneakers', name: 'Sneakers' },
];
const TITULO = 'Sneakers';
const TOTAL = 204;
const TAMANHOS = ['38', '39', '40', '41', '42'];
const ROTULO_FILTRO = 'Filtros';

const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

const HeartIcon = () => (
  <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5802 1.25524C13.787 2.42178 13.8332 4.29889 12.6852 5.5196L6.93292 11.6357L1.18142 5.51958C0.033424 4.29887 0.0796571 2.42174 1.28642 1.25519C2.63385 -0.0473233 4.85296 0.0716979 6.04335 1.51009L6.93332 2.58508L7.82253 1.50997C9.01291 0.0715756 11.2328 -0.0472817 12.5802 1.25524Z" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** `overrides/ProductGallery06/ColumnToggle06` — os dois botões de densidade. */
function ColumnToggle() {
  const [menos, setMenos] = useState(false);
  return (
    <div className={styles.colToggle} data-fs-column-toggle data-role="col-toggle">
      <button
        type="button"
        aria-pressed={menos}
        aria-label="Menos colunas"
        className={`${styles.colBtn}${menos ? ` ${styles.colBtnActive}` : ''}`}
        onClick={() => setMenos(true)}
      >
        <span className={styles.icoBars} aria-hidden="true"><i /><i /><i /></span>
        <span className={styles.icoDots3} aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => <i key={i} />)}
        </span>
      </button>
      <button
        type="button"
        aria-pressed={!menos}
        aria-label="Mais colunas"
        className={`${styles.colBtn}${!menos ? ` ${styles.colBtnActive}` : ''}`}
        onClick={() => setMenos(false)}
      >
        <span className={styles.icoDots2} aria-hidden="true">
          {Array.from({ length: 4 }).map((_, i) => <i key={i} />)}
        </span>
        <span className={styles.icoDots4} aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => <i key={i} />)}
        </span>
      </button>
    </div>
  );
}

/** `molecules/ProductCard06` — o card da grade, com carrossel de fotos e dots. */
function Card({ p, index }: { p: Produto; index: number }) {
  /* a camada de hover abre na SEGUNDA foto, como na origem (hoverIdx = 1) */
  const [hoverIdx, setHoverIdx] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);
  const [fav, setFav] = useState(false);

  const temDesconto = !!p.precoDe && p.precoDe > p.preco;
  const flags = [p.flag || (temDesconto ? `OFF ${Math.round(((p.precoDe! - p.preco) / p.precoDe!) * 100)}%` : '')].filter(Boolean);

  return (
    <section className={styles.card} data-role="card" itemScope itemType="https://schema.org/Product">
      <div className={styles.cardInner}>
        <div className={`${styles.imgZone} ${styles.imgZoneDots}`}>
          <a href="#" className={styles.imgLink}>
            <div className={styles.imgWrap}>
              <img
                className={styles.cardImg}
                data-role="card-img"
                src={p.imagens[imgIdx] ?? p.imagens[0]}
                alt={p.nome}
                width={500}
                height={500}
                loading={index < 4 ? 'eager' : 'lazy'}
              />
              <div
                className={styles.hoverTrack}
                style={{ transform: `translateX(-${hoverIdx * 100}%)` }}
                aria-hidden="true"
              >
                {p.imagens.map((url, i) => (
                  <span key={i} className={styles.hoverSlide}>
                    {i === hoverIdx && (
                      <img src={url} alt="" width={500} height={500} loading="lazy" decoding="async" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          </a>
          <button
            type="button"
            className={`${styles.imgNav} ${styles.imgNavPrev}`}
            onClick={() => setHoverIdx(i => Math.max(1, i - 1))}
            disabled={hoverIdx <= 1}
            aria-label="Imagem anterior"
          />
          <button
            type="button"
            className={`${styles.imgNav} ${styles.imgNavNext}`}
            onClick={() => setHoverIdx(i => Math.min(p.imagens.length - 1, i + 1))}
            disabled={hoverIdx >= p.imagens.length - 1}
            aria-label="Próxima imagem"
          />
          <div className={styles.imgDots} role="group" aria-label="Fotos do produto">
            {p.imagens.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.imgDot}${i === imgIdx ? ` ${styles.imgDotActive}` : ''}`}
                onClick={() => setImgIdx(i)}
                aria-label={`Ver foto ${i + 1} de ${p.imagens.length}`}
                aria-current={i === imgIdx ? 'true' : undefined}
              >
                <span className={styles.imgDotBar} aria-hidden="true" />
              </button>
            ))}
          </div>
          {flags.length > 0 && (
            <div className={styles.flagRow}>
              {flags.map(text => (
                <p key={text} className={styles.flag} data-role="card-flag">{text}</p>
              ))}
            </div>
          )}
          <button
            type="button"
            className={styles.addCart}
            aria-haspopup="dialog"
            aria-label="Escolher tamanho e adicionar ao carrinho"
          />
        </div>

        <div className={styles.infoCol}>
          <div className={styles.nameSkuBox}>
            <a href="#" className={styles.infoLink}>
              <div className={styles.nameRow}>
                <h3 className={styles.name} data-role="card-name" itemProp="name">{p.nome}</h3>
              </div>
            </a>
            <div className={styles.skuRow}>
              {TAMANHOS.map(t => (
                <button
                  key={t}
                  type="button"
                  className={styles.skuChip}
                  aria-label={`Adicionar tamanho ${t} ao carrinho`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <a href="#" className={styles.infoLink}>
            <div className={styles.priceWrap}>
              <div className={styles.price} data-has-list-price={temDesconto || undefined}>
                {temDesconto && (
                  <span className={styles.listPrice} data-role="list-price">{money(p.precoDe!)}</span>
                )}
                <span className={styles.priceLine} data-role="card-price">
                  {money(p.preco)}
                  <span className={styles.priceOu}>{' ou'}</span>
                </span>
              </div>
              <div className={styles.instRow}>
                <span className={styles.installments} data-role="card-inst">
                  {`${p.parcelaN}X de ${money(p.parcelaValor)}`}
                </span>
              </div>
            </div>
          </a>
        </div>
      </div>

      <button
        className={styles.wishlist}
        data-role="card-wish"
        onClick={() => setFav(f => !f)}
        aria-label={fav ? 'Remover da lista de desejos' : 'Adicionar à lista de desejos'}
        aria-pressed={fav}
      >
        <HeartIcon />
      </button>
    </section>
  );
}

export default function CategoryMain() {
  /* a contagem mora na trilha (countInBreadcrumb), como na origem */
  const contagem = (extra?: string) => (
    <span className={`${styles.count}${extra ? ` ${extra}` : ''}`} data-role="plp-count">
      {TOTAL} Produtos encontrados
    </span>
  );

  return (
    /* wrapper só do catálogo: carrega o container-type das @container */
    <div className={styles.plp06Wrap}>
      <div className={`${styles.productGallery06} ${styles.plp06Root}`}>
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
                  {ultimo ? (
                    <span className={`${styles.crumbLink} ${styles.crumbTerm}`} aria-current="page">{c.name}</span>
                  ) : (
                    <a className={styles.crumbLink} href={c.item}>{c.name}</a>
                  )}
                </span>
              );
            })}
          </div>
          {contagem(styles.countInTrail)}
        </nav>

        <section className={styles.categoryTitle06} data-fs-category-title>
          <h1 className={styles.title} data-role="plp-title">{TITULO}</h1>
          {contagem(styles.countInTitle)}
        </section>

        <section data-fs-product-listing data-testid="product-gallery">
          <div data-fs-product-listing-content-grid data-fs-content="product-gallery">
            <div data-fs-product-listing-sort data-role="toolbar">
              <ColumnToggle />
              <button type="button" data-fs-button data-testid="open-filter-button" data-role="filter-btn" aria-haspopup="dialog">
                <span data-fs-button-wrapper>{ROTULO_FILTRO}</span>
              </button>
            </div>

            <div data-fs-product-listing-results>
              <ul data-fs-product-grid data-role="grid">
                {PRODUTOS.map((p, i) => (
                  <li key={p.id} data-fs-product-grid-item data-role="grid-item">
                    <Card p={p} index={i} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

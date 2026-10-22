import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductCard12` do faststore.starter (família 12, Suave; desenho
 * `Spot12`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1;
 * o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá (os quatro produtos com
 * desconto e parcela, o esgotado e as notas do desenho), sem foto: o desenho também não
 * tem — vale o fundo de placeholder da caixa 1:1.
 *
 * `ProductCard12` é exportado para as vitrines, a PLP e os relacionados da 12. O card não
 * baixa fonte (quem baixa é a seção de lista), igual a lá.
 *
 * Divergências deliberadas: sem commerce (o "+" não faz nada; o coração só alterna no
 * estado local), sem analytics, e a nota chega por prop (lá, sem prop, o card consulta o
 * resolver `review`).
 */

export const FONTES_12 =
  'https://fonts.googleapis.com/css2?family=Young+Serif&family=Nunito+Sans:wght@400;600;700&display=swap';

export type Nota12 = { average?: number; totalCount?: number };

export type Produto12 = {
  id: string;
  name: string;
  price: number;
  listPrice: number;
  /** Melhor parcelamento; 0 some a linha (sem plano). */
  installments: number;
  installmentValue: number;
  inStock: boolean;
  image?: string;
  hoverImage?: string;
  rating?: Nota12 | null;
};

export const produto12 = (
  id: string,
  name: string,
  price: number,
  listPrice: number,
  installments: number,
  installmentValue: number,
  rating: Nota12 | null = null,
  inStock = true
): Produto12 => ({
  id,
  name,
  price,
  listPrice,
  installments,
  installmentValue,
  inStock,
  rating,
});

/** O mock.ts do ProductCard12 (com as notas do `productCard12MockRatings`). */
export const PRODUTOS_12: Produto12[] = [
  produto12('protetor-solar-fps-50-toque-seco', 'Protetor Solar FPS 50 Toque Seco 40 ml', 79.9, 94.9, 2, 39.95, { average: 4.7, totalCount: 2115 }),
  produto12('serum-vitamina-c-10', 'Sérum Vitamina C 10% 30 ml', 129.9, 129.9, 3, 43.3, { average: 4.9, totalCount: 1240 }),
  produto12('agua-micelar-200-ml', 'Água Micelar 200 ml', 49.9, 49.9, 2, 24.95, { average: 4.8, totalCount: 932 }),
  produto12('mascara-capilar-nutricao', 'Máscara Capilar Nutrição 250 g', 89.9, 109.9, 3, 29.97, { average: 4.6, totalCount: 418 }),
];

/** O esgotado do desenho `Spot12` (coluna Esgotado). */
export const ESGOTADO_12: Produto12 = produto12(
  'hidratante-facial-gel-creme',
  'Hidratante Facial Gel-Creme 50 g',
  89.9,
  89.9,
  0,
  0,
  { average: 4.8, totalCount: 860 },
  false
);

export const money12 = (n: number) =>
  `R$ ${n
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const HEART = 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';
const STAR = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';

const Heart = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={HEART} />
  </svg>
);

const Plus = () => (
  <svg className={styles.plus} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const Bell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

/** As 5 estrelas do desenho num SVG só (viewBox 124 × 24); as que passam da nota ficam apagadas. */
const Stars = ({ media }: { media: number }) => (
  <svg width="72" height="14" viewBox="0 0 124 24" fill="currentColor" aria-hidden="true">
    {[0, 1, 2, 3, 4].map(i => (
      <path key={i} d={STAR} transform={i ? `translate(${i * 25} 0)` : undefined} opacity={media >= i + 0.5 ? 1 : 0.28} />
    ))}
  </svg>
);

export type ProductCard12Props = {
  product: Produto12;
  /** Rótulo fixo do CMS da vitrine (igual em todos os cards). Vazio esconde. */
  badge?: string;
  showWishlist?: boolean;
  showRating?: boolean;
  buyLabel?: string;
  soldOutLabel?: string;
  soldOutText?: string;
  notifyLabel?: string;
};

export function ProductCard12({
  product,
  badge,
  showWishlist = true,
  showRating = true,
  buyLabel,
  soldOutLabel,
  soldOutText,
  notifyLabel,
}: ProductCard12Props) {
  const [naLista, setNaLista] = useState(false);

  const href = '#';
  const name = product.name;
  const price = product.price;
  const listPrice = product.listPrice;
  const inStock = product.inStock;
  const discount = inStock && listPrice > price ? Math.round((1 - price / listPrice) * 100) : 0;
  const installment =
    inStock && product.installments
      ? { installmentNumber: product.installments, installmentValue: product.installmentValue }
      : null;

  const media = Number(product.rating?.average) || 0;
  const total = Number(product.rating?.totalCount) || 0;
  const temNota = showRating && media > 0;
  const notaTexto = media.toFixed(1).replace('.', ',');

  const listPriceEl = (extra: string) =>
    inStock && listPrice > price ? (
      <s className={`${styles.listPrice} ${extra}`} data-role="spot-list-price">
        {money12(listPrice)}
      </s>
    ) : null;

  return (
    <article className={`${styles.productCard12}${inStock ? '' : ` ${styles.soldOut}`}`} data-role="spot">
      <div className={styles.media}>
        <a className={styles.mediaLink} href={href} tabIndex={-1} aria-hidden="true" data-role="spot-image">
          {product.image && <img className={styles.img} src={product.image} alt={name} width={400} height={400} />}
          {product.hoverImage && <img className={styles.imgHover} src={product.hoverImage} alt="" width={400} height={400} />}
        </a>

        {inStock ? (
          (badge || discount > 0) && (
            <div className={styles.tags}>
              {discount > 0 && (
                <span className={styles.tag} data-role="spot-discount">
                  -{discount}%
                </span>
              )}
              {badge && (
                <span className={styles.tag} data-role="spot-tag">
                  {badge}
                </span>
              )}
            </div>
          )
        ) : (
          <span className={styles.outTag} data-role="spot-out-of-stock">
            {soldOutLabel || 'Esgotado'}
          </span>
        )}

        {showWishlist && (
          <button
            type="button"
            className={styles.favorite}
            onClick={() => setNaLista(v => !v)}
            aria-pressed={naLista}
            aria-label={naLista ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            data-role="spot-favorite"
          >
            <span className={styles.favoriteIcon}>
              <Heart filled={naLista} />
            </span>
          </button>
        )}
      </div>

      <div className={styles.info}>
        {temNota && (
          <div className={styles.rating} data-role="spot-rating">
            <span className={styles.srOnly}>Nota {notaTexto} de 5</span>
            {/* Desktop: as 5 estrelas; mobile: uma estrela só, como no desenho. */}
            <span className={`${styles.stars} ${styles.dsk}`}>
              <Stars media={media} />
            </span>
            <span className={`${styles.stars} ${styles.mob}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={STAR} />
              </svg>
            </span>
            <span aria-hidden="true">
              {notaTexto}
              {total > 0 && <span data-role="spot-rating-count">{` (${total.toLocaleString('pt-BR')})`}</span>}
            </span>
          </div>
        )}

        <h3 className={styles.name}>
          <a href={href} data-role="spot-name">
            {name}
          </a>
        </h3>

        {listPriceEl(styles.mob)}

        <div className={styles.row}>
          <div className={styles.prices}>
            {listPriceEl(styles.dsk)}
            <span className={`${styles.price}${inStock ? '' : ` ${styles.priceOut}`}`} data-role="spot-price">
              {money12(price)}
            </span>
            {installment && (
              <span className={styles.installment} data-role="spot-installments">
                {installment.installmentNumber}x de {money12(installment.installmentValue)}
              </span>
            )}
            {!inStock && (
              <span className={`${styles.installment} ${styles.dsk}`} data-role="spot-unavailable">
                {soldOutText || 'Indisponível no momento'}
              </span>
            )}
          </div>

          {inStock ? (
            <button type="button" className={styles.buy} aria-label={`${buyLabel || 'Adicionar'} à sacola: ${name}`} data-role="spot-buy">
              <Plus />
              <span className={styles.buyLabel}>{buyLabel || 'Adicionar'}</span>
            </button>
          ) : (
            <a className={styles.notify} href={href} data-role="spot-notify">
              <Bell />
              <span>{notifyLabel || 'Avise-me'}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * O item "Spot" mostra o quadro do desenho `Spot12`, como o palco do starter
 * (`DevFidelityStage/Comum12Stage`): Padrão, Hover e Esgotado lado a lado; no mobile, 2
 * colunas sem a do hover. A coluna Hover pinta o estado de hover por CSS (fim da folha).
 */
export default function Spot12() {
  const [padrao, hover] = PRODUTOS_12;
  const colunas = [
    { rotulo: 'Padrão', produto: padrao, hover: false },
    { rotulo: 'Hover', produto: hover, hover: true },
    { rotulo: 'Esgotado', produto: ESGOTADO_12, hover: false },
  ];
  return (
    <div className={styles.productCard12Box}>
      <link rel="stylesheet" href={FONTES_12} />
      <div className={styles.spotStage}>
        <div className={styles.spotGrid}>
          {colunas.map((c, i) => (
            <div key={i} className={`${styles.spotCol}${c.hover ? ` ${styles.spotHoverCol}` : ''}`}>
              <span className={styles.spotLabel}>{c.rotulo}</span>
              <ProductCard12 product={c.produto} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

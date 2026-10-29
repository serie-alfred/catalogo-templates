import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductCard16` do faststore.starter (família 16, Infantil; desenho
 * `Spot16`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1;
 * o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá (os quatro produtos com parcela
 * e Pix, as notas, o esgotado e o rótulo fixo "Mais amado"), sem foto: o desenho também não
 * tem — vale o fundo de placeholder da caixa 1:1.
 *
 * `ProductCard16` é exportado para as vitrines, a PLP e os relacionados da 16. O card não
 * baixa fonte (quem baixa é a seção de lista), igual a lá. Regras do selo e do desconto, como
 * lá: o único selo da foto é o `badge` fixo da vitrine (na bolha amarela); o "de" riscado e a
 * pílula "-N%" ficam na linha do preço sempre que o produto em estoque tem `listPrice > price`.
 *
 * Divergências deliberadas: sem commerce ("Comprar" não faz nada; o coração só alterna no
 * estado local), sem analytics e com a nota vinda do produto (lá, do `getProductRating`).
 */

export const FONTES_16 =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap';

export type Produto16 = {
  id: string;
  name: string;
  brand: string;
  price: number;
  listPrice: number;
  /** Melhor parcelamento; 0 some a linha (sem plano). */
  installments: number;
  installmentValue: number;
  /** Valor no Pix; 0 some a linha. */
  pix: number;
  inStock: boolean;
  /** Nota e contagem (lá, `getProductRating`); 0 some as estrelas. */
  rating: number;
  ratingCount: number;
  image?: string;
  hoverImage?: string;
};

export const MARCA_16 = 'Sua Marca';

export const produto16 = (
  id: string,
  name: string,
  price: number,
  listPrice: number,
  installments: number,
  installmentValue: number,
  pix = 0,
  inStock = true,
  rating = 0,
  ratingCount = 0,
  brand = MARCA_16
): Produto16 => ({
  id,
  name,
  brand,
  price,
  listPrice,
  installments,
  installmentValue,
  pix,
  inStock,
  rating,
  ratingCount,
});

/** O mock.ts do ProductCard16 (com as notas do palco). */
export const PRODUTOS_16: Produto16[] = [
  produto16(
    'kit-blocos-de-montar-120-pecas',
    'Kit Blocos de Montar 120 peças',
    189.9,
    229.9,
    6,
    31.65,
    180.4,
    true,
    4.8,
    38
  ),
  produto16(
    'pijama-algodao-estrelinhas',
    'Pijama Algodão Estrelinhas',
    89.9,
    89.9,
    3,
    29.97,
    85.4,
    true,
    4.9,
    52
  ),
  produto16(
    'livro-de-banho-bichinhos',
    'Livro de Banho Bichinhos do Mar',
    49.9,
    59.9,
    2,
    24.95,
    47.4,
    true,
    4.7,
    21
  ),
  produto16(
    'mochila-infantil-dinossauro',
    'Mochila Infantil Dinossauro',
    149.9,
    149.9,
    5,
    29.98,
    142.4,
    true,
    4.6,
    17
  ),
];

/** O esgotado do desenho `Spot16` (coluna Esgotado). */
export const ESGOTADO_16: Produto16 = produto16(
  'pelucia-dino-verde-30-cm',
  'Pelúcia Dino Verde 30 cm',
  119.9,
  119.9,
  0,
  0,
  0,
  false,
  4.9,
  64
);

/** Rótulo fixo da vitrine no desenho (a bolha amarela da foto). */
export const ROTULO_16 = 'Mais amado';

export const money16 = (n: number) =>
  `R$ ${n
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const HEART =
  'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';
const STAR =
  'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';

const Heart = ({ filled }: { filled: boolean }) => (
  <svg
    className={styles.heart}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={HEART} />
  </svg>
);

const Bag = () => (
  <svg
    className={styles.dsk}
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

const Bell = () => (
  <svg
    className={styles.bell}
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

const Stars = ({ media }: { media: number }) => (
  <span className={styles.stars} aria-hidden="true">
    {[0, 1, 2, 3, 4].map(i => (
      <svg
        key={i}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        opacity={media >= i + 0.5 ? 1 : 0.28}
      >
        <path d={STAR} />
      </svg>
    ))}
  </span>
);

export type ProductCard16Props = {
  product: Produto16;
  /** Rótulo fixo do CMS da vitrine (igual em todos os cards), na bolha amarela. Vazio esconde. */
  badge?: string;
  showWishlist?: boolean;
  showRating?: boolean;
  buyLabel?: string;
  soldOutLabel?: string;
  soldOutText?: string;
  notifyLabel?: string;
};

export function ProductCard16({
  product,
  badge,
  showWishlist = true,
  showRating = true,
  buyLabel,
  soldOutLabel,
  soldOutText,
  notifyLabel,
}: ProductCard16Props) {
  const [naLista, setNaLista] = useState(false);

  const href = '#';
  const name = product.name;
  const brand = product.brand;
  const price = product.price;
  const listPrice = product.listPrice ?? price;
  const inStock = product.inStock;
  const discount =
    inStock && listPrice > price
      ? Math.round((1 - price / listPrice) * 100)
      : 0;
  const installment = inStock && product.installments ? product : null;
  const pix = inStock && product.pix ? product.pix : 0;
  const comprar = buyLabel || 'Comprar';
  const media = product.rating || 0;
  const total = product.ratingCount || 0;
  const temNota = inStock && showRating && media > 0;

  return (
    <article
      className={`${styles.productCard16}${inStock ? '' : ` ${styles.soldOut}`}`}
      data-role="spot"
    >
      <div className={styles.media}>
        <a
          className={styles.mediaLink}
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          data-role="spot-image"
        >
          {product.image && (
            <img
              className={styles.img}
              src={product.image}
              alt={name}
              width={400}
              height={400}
            />
          )}
          {product.hoverImage && (
            <img
              className={styles.imgHover}
              src={product.hoverImage}
              alt=""
              width={400}
              height={400}
            />
          )}
        </a>

        {inStock ? (
          badge && (
            <span className={styles.tag} data-role="spot-tag">
              {badge}
            </span>
          )
        ) : (
          <span className={styles.outTag} data-role="spot-out-of-stock">
            {soldOutLabel || 'Esgotado'}
          </span>
        )}

        {/* Esgotado: o desenho tira o coração da foto. */}
        {showWishlist && inStock && (
          <button
            type="button"
            className={styles.favorite}
            onClick={() => setNaLista(v => !v)}
            aria-pressed={naLista}
            aria-label={
              naLista ? 'Remover dos favoritos' : 'Salvar nos favoritos'
            }
            data-role="spot-favorite"
          >
            <span className={styles.favoriteIcon}>
              <Heart filled={naLista} />
            </span>
          </button>
        )}
      </div>

      <div className={styles.info}>
        {brand && (
          <span
            className={`${styles.brand} ${styles.dsk}`}
            data-role="spot-brand"
          >
            {brand}
          </span>
        )}
        <h3 className={styles.name}>
          <a href={href} data-role="spot-name">
            {name}
          </a>
        </h3>

        {temNota && (
          <div
            className={`${styles.rating} ${styles.dsk}`}
            data-role="spot-rating"
          >
            <span className={styles.srOnly}>
              Nota {media.toFixed(1).replace('.', ',')} de 5
            </span>
            <Stars media={media} />
            {total > 0 && (
              <span
                className={styles.ratingCount}
                aria-hidden="true"
                data-role="spot-rating-count"
              >
                ({total.toLocaleString('pt-BR')})
              </span>
            )}
          </div>
        )}

        {discount > 0 && (
          <span className={styles.priceRow}>
            <s className={styles.listPrice} data-role="spot-list-price">
              <span className={styles.srOnly}>De </span>
              {money16(listPrice)}
            </s>
            <span className={styles.discount} data-role="spot-discount">
              -{discount}%
            </span>
          </span>
        )}
        <span className={styles.price} data-role="spot-price">
          {discount > 0 && <span className={styles.srOnly}>por </span>}
          {money16(price)}
        </span>
        {installment && (
          <span className={styles.installment} data-role="spot-installments">
            {installment.installments}x de{' '}
            {money16(installment.installmentValue)}
            <span className={styles.dsk}> sem juros</span>
          </span>
        )}
        {pix > 0 && (
          <span className={`${styles.pix} ${styles.dsk}`} data-role="spot-pix">
            {money16(pix)} no Pix
          </span>
        )}
        {!inStock && (
          <span className={styles.outText} data-role="spot-unavailable">
            {soldOutText || 'Avisamos assim que voltar'}
          </span>
        )}
      </div>

      {inStock ? (
        <button
          type="button"
          className={styles.buy}
          aria-label={`${comprar}: ${name}`}
          data-role="spot-buy"
        >
          <Bag />
          {comprar}
        </button>
      ) : (
        <a className={styles.notify} href={href} data-role="spot-notify">
          <Bell />
          <span>{notifyLabel || 'Avise-me'}</span>
        </a>
      )}
    </article>
  );
}

/**
 * O item "Spot" mostra o quadro do desenho `Spot16`, como o palco do starter
 * (`DevFidelityStage/Comum16Stage`): Padrão, Hover · 2ª foto e Esgotado lado a lado, com o
 * rótulo "Mais amado"; no mobile, 2 colunas sem a do hover. A coluna Hover pinta o estado de
 * hover por CSS (fim da folha); lá, o comparador passa o mouse.
 */
export default function Spot16() {
  const [padrao] = PRODUTOS_16;
  const colunas = [
    { rotulo: 'Padrão', produto: padrao, hover: false },
    { rotulo: 'Hover · 2ª foto', produto: padrao, hover: true },
    { rotulo: 'Esgotado', produto: ESGOTADO_16, hover: false },
  ];
  return (
    <div className={styles.productCard16Box}>
      <link rel="stylesheet" href={FONTES_16} />
      <div className={styles.spotStage}>
        <div className={styles.spotGrid}>
          {colunas.map((c, i) => (
            <div
              key={i}
              className={`${styles.spotCol}${c.hover ? ` ${styles.spotHoverCol}` : ''}`}
            >
              <span className={styles.spotLabel}>{c.rotulo}</span>
              <ProductCard16 product={c.produto} badge={ROTULO_16} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

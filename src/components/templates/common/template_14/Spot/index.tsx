import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductCard14` do faststore.starter (família 14, Esportiva; desenho
 * `Spot14`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1;
 * o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá (os quatro produtos com
 * parcela, Pix e nota, o esgotado e o rótulo fixo "Alta performance"), sem foto: o desenho
 * também não tem — vale a caixa de placeholder 1:1.
 *
 * `ProductCard14` é exportado para as vitrines, a PLP e os relacionados da 14. As regras do
 * selo e do "-N%" são as de lá: o rótulo fixo da vitrine em cima, o "-N%" embaixo, os dois
 * empilhados no canto; o "-N%" sai sempre que o "de" é maior que o "por" (em estoque), e o
 * "de" riscado também — não há chave de lista para ligá-los. O card não baixa fonte (quem
 * baixa é a seção de lista), igual a lá.
 *
 * Divergências deliberadas: sem commerce ("Comprar" não faz nada; o coração só alterna no
 * estado local), sem analytics, e a nota vem no produto (lá, do resolver `getProductRating`
 * ou da prop `rating` da lista).
 */

export const FONTES_14 =
  'https://fonts.googleapis.com/css2?family=Saira:ital,wght@0,500;0,700;0,800;1,700;1,800;1,900&family=Inter:wght@400;500;600&display=swap';

export type Nota14 = { average: number; totalCount: number };

export type Produto14 = {
  id: string;
  name: string;
  brand: string;
  price: number;
  listPrice: number;
  /** Melhor parcelamento; 0 some a linha (sem plano). */
  installments: number;
  installmentValue: number;
  /** `installmentInterest === 0` lá: "sem juros"; senão "com juros". */
  interestFree: boolean;
  /** Valor da entrada Pix do plano; 0 some a linha. */
  pix: number;
  inStock: boolean;
  /** Nota do `getProductRating`; null some as estrelas. */
  rating: Nota14 | null;
  image?: string;
  hoverImage?: string;
};

export const produto14 = (
  id: string,
  name: string,
  price: number,
  listPrice: number,
  installments: number,
  installmentValue: number,
  pix = 0,
  inStock = true,
  rating: Nota14 | null = null
): Produto14 => ({
  id,
  name,
  brand: 'Sua Marca',
  price,
  listPrice,
  installments,
  installmentValue,
  interestFree: true,
  pix,
  inStock,
  rating,
});

/** Notas do desenho, por id do mock (lá, só o palco as injeta). */
export const NOTAS_14: Record<string, Nota14> = {
  'tenis-velox-run-3': { average: 5, totalCount: 212 },
  'garrafa-termica-750ml': { average: 4.8, totalCount: 96 },
  'camiseta-dry-fit-pro': { average: 4.7, totalCount: 58 },
  'whey-protein-900g': { average: 4.9, totalCount: 431 },
};

/** O mock.ts do ProductCard14 (os quatro do desenho), com as notas. */
export const PRODUTOS_14: Produto14[] = [
  produto14('tenis-velox-run-3', 'Tênis Velox Run 3', 699.9, 899.9, 10, 69.99, 671.9),
  produto14('garrafa-termica-750ml', 'Garrafa Térmica 750 ml', 89.9, 89.9, 3, 29.97, 85.4),
  produto14('camiseta-dry-fit-pro', 'Camiseta Dry Fit Pro', 149.9, 179.9, 5, 29.98, 142.4),
  produto14('whey-protein-900g', 'Whey Protein Isolado 900 g', 219.9, 259.9, 6, 36.65, 208.9),
].map(p => ({ ...p, rating: NOTAS_14[p.id] ?? null }));

/** O esgotado do desenho `Spot14` (coluna Esgotado). */
export const ESGOTADO_14: Produto14 = produto14('mochila-treino-22l', 'Mochila Treino 22 L', 249.9, 249.9, 0, 0, 0, false);

/** Rótulo fixo da vitrine no desenho (o "Alta performance" sobre a foto). */
export const ROTULO_14 = 'Alta performance';

export const money14 = (n: number) =>
  `R$ ${n
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const svg = (w: number, children: React.ReactNode, sw = '2', className?: string, fill = 'none') => (
  <svg
    className={className}
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={fill === 'none' ? 'currentColor' : 'none'}
    strokeWidth={sw}
    strokeLinecap="square"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const HEART = 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';
const STAR = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';

const Bag = ({ className }: { className?: string }) =>
  svg(
    18,
    <>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>,
    '2.2',
    className
  );

const Bell = () =>
  svg(
    16,
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  );

export type ProductCard14Props = {
  product: Produto14;
  /** Rótulo fixo do CMS da vitrine (igual em todos os cards). Vazio esconde. */
  badge?: string;
  /** `false` some o coração. */
  showWishlist?: boolean;
  /** `false` some as estrelas. */
  showRating?: boolean;
  buyLabel?: string;
  soldOutLabel?: string;
  notifyLabel?: string;
};

export function ProductCard14({
  product,
  badge,
  showWishlist = true,
  showRating = true,
  buyLabel,
  soldOutLabel,
  notifyLabel,
}: ProductCard14Props) {
  const [naLista, setNaLista] = useState(false);

  const href = '#';
  const name = product.name;
  const brand = product.brand;
  const price = product.price;
  const listPrice = product.listPrice ?? price;
  const inStock = product.inStock;
  const discount = inStock && listPrice > price ? Math.round((1 - price / listPrice) * 100) : 0;
  const installment =
    inStock && product.installments
      ? {
          installmentNumber: product.installments,
          installmentValue: product.installmentValue,
          installmentInterest: product.interestFree ? 0 : 1,
        }
      : null;
  const pix = inStock && product.pix ? { installmentValue: product.pix } : null;
  const comprar = buyLabel || 'Comprar';

  const media = Number(product.rating?.average) || 0;
  const total = Number(product.rating?.totalCount) || 0;
  const temNota = showRating && inStock && media > 0;

  return (
    <article className={`${styles.productCard14}${inStock ? '' : ` ${styles.soldOut}`}`} data-role="spot">
      <div className={styles.media}>
        <a className={styles.mediaLink} href={href} tabIndex={-1} aria-hidden="true" data-role="spot-image">
          {product.image && <img className={styles.img} src={product.image} alt={name} width={400} height={400} />}
          {product.hoverImage && <img className={styles.imgHover} src={product.hoverImage} alt="" width={400} height={400} />}
        </a>

        {/* Selo e desconto empilhados no canto (o rótulo em cima, o -N% embaixo): nenhum cobre o outro. */}
        {(badge || discount > 0) && (
          <div className={styles.tags} data-role="spot-tags">
            {badge && (
              <span className={styles.tag} data-role="spot-tag">
                {badge}
              </span>
            )}
            {discount > 0 && (
              <span className={styles.discount} data-role="spot-discount">
                -{discount}%
              </span>
            )}
          </div>
        )}

        {showWishlist && (
          <button
            type="button"
            className={styles.favorite}
            onClick={() => setNaLista(v => !v)}
            aria-pressed={naLista}
            aria-label={naLista ? `Remover ${name} dos favoritos` : `Salvar ${name} nos favoritos`}
            data-role="spot-favorite"
          >
            {svg(20, <path d={HEART} />, '2', styles.heart, naLista ? 'currentColor' : 'none')}
          </button>
        )}

        {!inStock && (
          <span className={styles.outTag} data-role="spot-out-of-stock">
            {soldOutLabel || 'Esgotado'}
          </span>
        )}

        {inStock && (
          <button type="button" className={`${styles.buy} ${styles.dsk}`} aria-label={`${comprar}: ${name}`} data-role="spot-buy">
            <Bag />
            {comprar}
          </button>
        )}
      </div>

      <div className={styles.info}>
        {brand && (
          <span className={styles.brand} data-role="spot-brand">
            {brand}
          </span>
        )}
        <a className={styles.name} href={href} data-role="spot-name">
          {name}
        </a>

        {temNota && (
          <span className={styles.rating} data-role="spot-rating">
            <span className={styles.stars} role="img" aria-label={`Nota ${media.toFixed(1).replace('.', ',')} de 5`}>
              {[1, 2, 3, 4, 5].map(i => (
                <React.Fragment key={i}>
                  {media >= i - 0.25
                    ? svg(13, <path d={STAR} />, '0', styles.star, 'currentColor')
                    : svg(13, <path d={STAR} />, '1.6', styles.star)}
                </React.Fragment>
              ))}
            </span>
            {total > 0 && <span data-role="spot-rating-count">&nbsp;({total.toLocaleString('pt-BR')})</span>}
          </span>
        )}

        {inStock && (
          <div className={styles.prices}>
            {listPrice > price && (
              <s className={styles.listPrice} data-role="spot-list-price">
                <span className={styles.srOnly}>De </span>
                {money14(listPrice)}
              </s>
            )}
            <span className={styles.price} data-role="spot-price">
              {listPrice > price && <span className={styles.srOnly}>por </span>}
              {money14(price)}
            </span>
            {installment && (
              <span className={styles.installment} data-role="spot-installments">
                {installment.installmentNumber}x de {money14(installment.installmentValue)}
                {installment.installmentInterest === 0 ? ' sem juros' : ' com juros'}
              </span>
            )}
            {pix && (
              <span className={`${styles.pix} ${styles.dsk}`} data-role="spot-pix">
                {money14(pix.installmentValue)} no Pix
              </span>
            )}
          </div>
        )}

        {inStock ? (
          <button type="button" className={`${styles.buyWide} ${styles.mob}`} aria-label={`${comprar}: ${name}`} data-role="spot-buy">
            <Bag className={styles.buyWideIcon} />
            {comprar}
          </button>
        ) : (
          <a className={styles.notify} href={href} data-role="spot-notify">
            <Bell />
            {notifyLabel || 'Avise-me'}
          </a>
        )}
      </div>
    </article>
  );
}

/**
 * O item "Spot" mostra o quadro do desenho `Spot14`, como o palco do starter
 * (`DevFidelityStage/Comum14Stage`): Padrão, Hover e Esgotado lado a lado, com o rótulo
 * "Alta performance" e as notas do desenho; no mobile, 2 colunas sem a do hover. A coluna
 * Hover pinta o estado de hover por CSS (fim da folha), como o palco de lá.
 */
export default function Spot14() {
  const [padrao] = PRODUTOS_14;
  const colunas = [
    { rotulo: 'Padrão', produto: padrao, hover: false },
    { rotulo: 'Hover · o botão sobe', produto: padrao, hover: true },
    { rotulo: 'Esgotado', produto: ESGOTADO_14, hover: false },
  ];
  return (
    <div className={styles.productCard14Box}>
      <link rel="stylesheet" href={FONTES_14} />
      <div className={styles.spotStage}>
        <div className={styles.spotGrid}>
          {colunas.map((c, i) => (
            <div key={i} className={`${styles.spotCol}${c.hover ? ` ${styles.spotHoverCol}` : ''}`}>
              <span className={styles.spotLabel}>{c.rotulo}</span>
              <ProductCard14 product={c.produto} badge={ROTULO_14} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductCard09` do faststore.starter (família 09, Editorial;
 * desenho `Spot09`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas
 * vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (padrão, com desconto e esgotado), sem foto: o desenho também não tem — vale o
 * fundo de placeholder da caixa 3:4.
 *
 * `ProductCard09` é exportado para as vitrines, a PLP e os relacionados da 09, que
 * no starter entregam o node VTEX ao mesmo card.
 */

export const FONTES_09 =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&family=Figtree:wght@400;500;600&display=swap';

export type Produto09 = {
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
};

const produto = (
  id: string,
  name: string,
  price: number,
  listPrice: number,
  installments: number,
  installmentValue: number,
  inStock = true
): Produto09 => ({
  id,
  name,
  price,
  listPrice,
  installments,
  installmentValue,
  inStock,
});

/** O mock.ts do ProductCard09: padrão, com desconto e esgotado. */
export const PRODUTOS_09: Produto09[] = [
  produto('vestido-midi-linho-areia', 'Vestido Midi Linho Areia', 489, 489, 6, 81.5),
  produto('blazer-estruturado-cru', 'Blazer Estruturado Cru', 689, 790, 6, 114.83),
  produto('trico-gola-alta-mescla', 'Tricô Gola Alta Mescla', 399, 399, 0, 0, false),
];

const money = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`;

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

export type ProductCard09Props = {
  product: Produto09;
  /** Rótulo fixo do CMS da vitrine (igual em todos os cards). Vazio esconde. */
  badge?: string;
  /** `false` some o coração (vitrines da Tray não têm favoritos). */
  showWishlist?: boolean;
  buyLabel?: string;
  soldOutLabel?: string;
  notifyLabel?: string;
};

export function ProductCard09({
  product,
  badge,
  showWishlist = true,
  buyLabel,
  soldOutLabel,
  notifyLabel,
}: ProductCard09Props) {
  const [naLista, setNaLista] = React.useState(false);
  const href = '#';
  const { name, price, listPrice, inStock } = product;
  const discount =
    inStock && listPrice > price ? Math.round((1 - price / listPrice) * 100) : 0;
  const installment =
    inStock && product.installments > 0
      ? { n: product.installments, v: product.installmentValue }
      : null;

  return (
    <article
      className={`${styles.productCard09}${inStock ? '' : ` ${styles.soldOut}`}`}
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
              height={533}
              loading="lazy"
              decoding="async"
            />
          )}
          {product.hoverImage && (
            <img
              className={styles.imgHover}
              src={product.hoverImage}
              alt=""
              width={400}
              height={533}
              loading="lazy"
              decoding="async"
            />
          )}
        </a>

        {(badge || discount > 0) && (
          <div className={styles.tags}>
            {badge && (
              <span className={styles.tag} data-role="spot-tag">
                {badge}
              </span>
            )}
            {discount > 0 && (
              <span className={styles.tag} data-role="spot-discount">
                -{discount}%
              </span>
            )}
          </div>
        )}

        {showWishlist && inStock && (
          <button
            type="button"
            className={styles.favorite}
            onClick={() => setNaLista(v => !v)}
            aria-pressed={naLista}
            aria-label={naLista ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            data-role="spot-favorite"
          >
            <Heart filled={naLista} />
          </button>
        )}

        {inStock ? (
          <button type="button" className={styles.buy} data-role="spot-buy">
            {buyLabel || 'Adicionar à sacola'}
          </button>
        ) : (
          <div className={styles.veil} data-role="spot-out-of-stock">
            <span className={styles.veilTag}>{soldOutLabel || 'Esgotado'}</span>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <a className={styles.name} href={href} data-role="spot-name">
          {name}
        </a>

        {inStock ? (
          <>
            <span className={styles.prices}>
              {listPrice > price && (
                <s className={styles.listPrice} data-role="spot-list-price">
                  {money(listPrice)}
                </s>
              )}
              <span className={styles.price} data-role="spot-price">
                {money(price)}
              </span>
            </span>
            {installment && (
              <span className={styles.installment} data-role="spot-installments">
                {installment.n}x de {money(installment.v)}
                <span className={styles.dsk}> sem juros</span>
              </span>
            )}
          </>
        ) : (
          <>
            {price > 0 && (
              <span className={styles.priceOff} data-role="spot-price">
                {money(price)}
              </span>
            )}
            <a className={styles.notify} href={href} data-role="spot-notify">
              {notifyLabel || (
                <>
                  Avise-me<span className={styles.dsk}> quando chegar</span>
                </>
              )}
            </a>
          </>
        )}
      </div>
    </article>
  );
}

/** O item do catálogo: os três estados do desenho lado a lado (3 colunas; 2 no mobile). */
export default function Spot09() {
  return (
    <div className={styles.productCard09Box}>
      <link rel="stylesheet" href={FONTES_09} />
      <div className={styles.spotStage}>
        {PRODUTOS_09.map(p => (
          <ProductCard09 key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

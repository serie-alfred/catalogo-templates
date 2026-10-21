import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductCard10` do faststore.starter (família 10, Varejo;
 * desenho `Spot10`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas
 * vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (com desconto, Pix e parcela; esgotado) e as notas do desenho, sem foto: o desenho
 * também não tem — vale o fundo de placeholder da caixa 1:1.
 *
 * `ProductCard10` é exportado para as vitrines, a PLP e os relacionados da 10, que no
 * starter entregam o node VTEX ao mesmo card. Divergência deliberada: o `ratingCount`
 * do starter não tem regra no SCSS, então aqui fica só o `data-role`.
 */

export const FONTES_10 =
  'https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap';

export type Produto10 = {
  id: string;
  name: string;
  price: number;
  listPrice: number;
  /** Melhor parcelamento; 0 some a linha (sem plano). */
  installments: number;
  installmentValue: number;
  /** Valor no Pix; 0 some a linha (sem plano Pix). */
  pix: number;
  inStock: boolean;
  /** Nota do `getProductRating`; sem ela a linha de estrelas some. */
  rating?: { average: number; totalCount: number };
  image?: string;
  hoverImage?: string;
};

export const produto10 = (
  id: string,
  name: string,
  price: number,
  listPrice: number,
  installments: number,
  installmentValue: number,
  pix = 0,
  inStock = true,
  rating?: { average: number; totalCount: number }
): Produto10 => ({
  id,
  name,
  price,
  listPrice,
  installments,
  installmentValue,
  pix,
  inStock,
  rating,
});

/** O mock.ts do ProductCard10, com as notas do desenho. */
export const PRODUTOS_10: Produto10[] = [
  produto10(
    'smartphone-x5-128gb-preto',
    'Smartphone X5 128 GB 5G Tela 6,7" Preto',
    1799,
    2299,
    10,
    179.9,
    1709.05,
    true,
    { average: 4.8, totalCount: 1284 }
  ),
  produto10(
    'fone-bluetooth-cancelamento-ruido',
    'Fone Bluetooth com Cancelamento de Ruído',
    299.9,
    349.9,
    10,
    29.99,
    284.9,
    true,
    { average: 4.8, totalCount: 1284 }
  ),
  produto10(
    'cafeteira-expresso-20-bar',
    'Cafeteira Expresso 20 Bar com Vaporizador',
    899,
    899,
    0,
    0,
    0,
    false,
    { average: 4.5, totalCount: 233 }
  ),
];

export const money10 = (n: number) =>
  `R$ ${n
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const svg = (
  w: number,
  children: React.ReactNode,
  extra: Record<string, string> = {}
) => (
  <svg
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
    {...extra}
  >
    {children}
  </svg>
);

const HEART =
  'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';
const STAR =
  'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';

const Star = ({ filled }: { filled: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? 'none' : 'currentColor'}
    strokeWidth="1.6"
    aria-hidden="true"
  >
    <path d={STAR} />
  </svg>
);

const CartIcon = () =>
  svg(
    20,
    <>
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.5 12h12l2-8H6.2" />
    </>,
    { strokeWidth: '2' }
  );

const BellIcon = () =>
  svg(
    18,
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>,
    { strokeWidth: '2' }
  );

export type ProductCard10Props = {
  product: Produto10;
  /** Rótulo fixo do CMS da vitrine (igual em todos os cards). Vazio esconde. */
  badge?: string;
  /** `false` some o coração (vitrines da Tray não têm favoritos). */
  showWishlist?: boolean;
  /** `false` some as estrelas (loja sem app de avaliação). */
  showRating?: boolean;
  buyLabel?: string;
  buyHoverLabel?: string;
  soldOutLabel?: string;
  soldOutTitle?: string;
  soldOutText?: string;
  notifyLabel?: string;
};

export function ProductCard10({
  product,
  badge,
  showWishlist = true,
  showRating = true,
  buyLabel,
  buyHoverLabel,
  soldOutLabel,
  soldOutTitle,
  soldOutText,
  notifyLabel,
}: ProductCard10Props) {
  const [naLista, setNaLista] = React.useState(false);
  const href = '#';
  const { name, price, listPrice, inStock } = product;
  const discount =
    inStock && listPrice > price
      ? Math.round((1 - price / listPrice) * 100)
      : 0;
  const installment =
    inStock && product.installments > 0
      ? { n: product.installments, v: product.installmentValue }
      : null;
  const pix = inStock && product.pix > 0 ? product.pix : 0;
  const media = product.rating?.average ?? 0;
  const total = product.rating?.totalCount ?? 0;
  const temNota = showRating && media > 0;

  return (
    <article
      className={`${styles.productCard10}${inStock ? '' : ` ${styles.soldOut}`}`}
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
              height={400}
              loading="lazy"
              decoding="async"
            />
          )}
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
          <div className={styles.tags}>
            <span
              className={`${styles.tag} ${styles.tagOut}`}
              data-role="spot-out-of-stock"
            >
              {soldOutLabel || 'Esgotado'}
            </span>
          </div>
        )}

        {showWishlist && (
          <button
            type="button"
            className={`${styles.favorite}${naLista ? ` ${styles.favoriteOn}` : ''}`}
            onClick={() => setNaLista(v => !v)}
            aria-pressed={naLista}
            aria-label={
              naLista ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
            }
            data-role="spot-favorite"
          >
            {svg(
              22,
              <path d={HEART} />,
              naLista ? { fill: 'currentColor' } : {}
            )}
          </button>
        )}

        {product.hoverImage && (
          <span className={styles.dots} aria-hidden="true">
            <span className={styles.dot} />
            <span className={`${styles.dot} ${styles.dotOn}`} />
          </span>
        )}
      </div>

      {temNota && (
        <div className={styles.rating} data-role="spot-rating">
          <span className={styles.srOnly}>
            Nota {media.toFixed(1).replace('.', ',')} de 5
          </span>
          <span className={styles.stars} aria-hidden="true">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} className={i > 1 ? styles.dsk : undefined}>
                <Star filled={media >= i - 0.25 || i === 1} />
              </span>
            ))}
          </span>
          <span className={styles.ratingText} aria-hidden="true">
            <strong
              className={styles.ratingValue}
              data-role="spot-rating-value"
            >
              {media.toFixed(1).replace('.', ',')}
            </strong>
            {total > 0 && (
              <span data-role="spot-rating-count">
                ({total.toLocaleString('pt-BR')})
              </span>
            )}
          </span>
        </div>
      )}

      <a className={styles.name} href={href} data-role="spot-name">
        {name}
      </a>

      {inStock ? (
        <>
          <div className={styles.prices}>
            {listPrice > price && (
              <s className={styles.listPrice} data-role="spot-list-price">
                de {money10(listPrice)}
              </s>
            )}
            <span className={styles.price} data-role="spot-price">
              {money10(price)}
            </span>
            {pix > 0 && (
              <span className={styles.pix} data-role="spot-pix">
                {money10(pix)} no Pix
              </span>
            )}
            {installment && (
              <span
                className={styles.installment}
                data-role="spot-installments"
              >
                ou {installment.n}x de {money10(installment.v)}
                <span className={styles.dsk}> sem juros</span>
              </span>
            )}
          </div>
          <button type="button" className={styles.buy} data-role="spot-buy">
            <span className={styles.buyRest}>{buyLabel || 'Comprar'}</span>
            <span className={styles.buyHover}>
              <CartIcon />
              {buyHoverLabel || 'Adicionar ao carrinho'}
            </span>
          </button>
        </>
      ) : (
        <>
          <div className={styles.outInfo}>
            <span className={styles.outTitle}>
              {soldOutTitle || 'Produto esgotado'}
            </span>
            <span className={styles.outText}>
              {soldOutText || 'Peça o aviso na página do produto.'}
            </span>
          </div>
          <a className={styles.notify} href={href} data-role="spot-notify">
            <BellIcon />
            {notifyLabel || 'Avise-me'}
          </a>
        </>
      )}
    </article>
  );
}

/**
 * O item do catálogo: o quadro do desenho `Spot10`, como o palco do starter —
 * Padrão, Hover (só desktop) e Esgotado lado a lado, com os rótulos do canvas.
 */
export default function Spot10() {
  const [padrao, , esgotado] = PRODUTOS_10;
  const colunas = [
    { rotulo: 'Padrão', produto: padrao, hover: false },
    { rotulo: 'Hover', produto: padrao, hover: true },
    { rotulo: 'Esgotado', produto: esgotado, hover: false },
  ];
  return (
    <div className={styles.productCard10Box}>
      <link rel="stylesheet" href={FONTES_10} />
      <div className={styles.spotStage}>
        <div className={styles.spotGrid}>
          {colunas.map((c, i) => (
            <div
              key={i}
              className={`${styles.spotCol}${c.hover ? ` ${styles.spotHoverCol}` : ''}`}
            >
              <span className={styles.spotLabel}>{c.rotulo}</span>
              <ProductCard10 product={c.produto} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

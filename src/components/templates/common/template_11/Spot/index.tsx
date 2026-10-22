import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductCard11` do faststore.starter (família 11, Grade; desenho
 * `Spot11`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1;
 * o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá (referência "N°", preço e
 * parcela; o esgotado), sem foto: o desenho também não tem — vale o fundo de placeholder
 * da caixa 1:1.
 *
 * `ProductCard11` é exportado para as vitrines, a PLP e os relacionados da 11, com as
 * mesmas props `variant` (box | grid) e `layout` (spot | shelf | quick) do starter, que
 * cada seção passa igual a lá.
 *
 * Divergências deliberadas: sem commerce (o "Adicionar" e o "+" não fazem nada; o coração
 * só alterna no estado local) e sem analytics.
 */

export const FONTES_11 =
  'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap';

export type Produto11 = {
  id: string;
  /** A referência "N°" do card é o id do SKU. */
  sku: string;
  name: string;
  price: number;
  /** Melhor parcelamento; 0 some a linha (sem plano). */
  installments: number;
  installmentValue: number;
  inStock: boolean;
  image?: string;
  hoverImage?: string;
};

export const produto11 = (
  sku: string,
  id: string,
  name: string,
  price: number,
  installments: number,
  installmentValue: number,
  inStock = true
): Produto11 => ({
  id,
  sku,
  name,
  price,
  installments,
  installmentValue,
  inStock,
});

/** O mock.ts do ProductCard11 (os mesmos produtos das listas da 11). */
export const PRODUTOS_11: Produto11[] = [
  produto11(
    '024',
    'luminaria-de-mesa-arco',
    'Luminária de Mesa Arco',
    890,
    10,
    89
  ),
  produto11(
    '042',
    'pendente-globo-vidro',
    'Pendente Globo Vidro',
    1120,
    10,
    112
  ),
  produto11(
    '017',
    'vaso-ceramica-cilindro',
    'Vaso Cerâmica Cilindro',
    240,
    10,
    24
  ),
  produto11('031', 'cadeira-tubular-aco', 'Cadeira Tubular Aço', 1490, 10, 149),
];

/** O esgotado do desenho `Spot11` (coluna C). */
export const ESGOTADO_11: Produto11 = produto11(
  '031',
  'cadeira-tubular-aco',
  'Cadeira Tubular Aço',
  1490,
  0,
  0,
  false
);

export const money11 = (n: number) =>
  `R$ ${n
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

/** "N°024": a referência do desenho é o id do SKU, com zeros à esquerda até 3 dígitos. */
export function referencia11(sku?: string | null) {
  const s = String(sku ?? '').trim();
  return s ? `N°${s.length < 3 ? s.padStart(3, '0') : s}` : '';
}

const svg = (children: React.ReactNode, extra: Record<string, string> = {}) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
    {...extra}
  >
    {children}
  </svg>
);

const HEART =
  'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';
const Plus = () => svg(<path d="M12 5v14M5 12h14" />);
const Arrow = () => svg(<path d="M5 12h14M13 6l6 6-6 6" />);

export type ProductCard11Props = {
  product: Produto11;
  badge?: string;
  showWishlist?: boolean;
  variant?: 'box' | 'grid';
  layout?: 'spot' | 'shelf' | 'quick';
  buyLabel?: string;
  soldOutLabel?: string;
  soldOutPriceLabel?: string;
  notifyLabel?: string;
};

export function ProductCard11({
  product,
  badge,
  showWishlist = true,
  variant = 'box',
  layout = 'spot',
  buyLabel,
  soldOutLabel,
  soldOutPriceLabel,
  notifyLabel,
}: ProductCard11Props) {
  const [naLista, setNaLista] = useState(false);

  const href = '#';
  const name = product.name;
  const inStock = product.inStock;
  const installment =
    inStock && product.installments
      ? {
          installmentNumber: product.installments,
          installmentValue: product.installmentValue,
        }
      : null;
  const ref = referencia11(product.sku);

  const buy = (className: string) => (
    <button
      type="button"
      className={className}
      aria-label={`${buyLabel || 'Adicionar'}: ${name}`}
      data-role="spot-buy"
    >
      <span className={styles.buyMain}>
        <Plus />
        {buyLabel || 'Adicionar'}
      </span>
      <span className={styles.buyArrow}>
        <Arrow />
      </span>
    </button>
  );

  const notify = (className: string) => (
    <a className={className} href={href} data-role="spot-notify">
      {notifyLabel || 'Avise-me'}
      <Arrow />
    </a>
  );

  return (
    <article
      className={`${styles.productCard11}${variant === 'grid' ? ` ${styles.inGrid}` : ''}${
        layout === 'spot'
          ? ''
          : ` ${layout === 'quick' ? styles.layoutQuick : styles.layoutShelf}`
      }${inStock ? '' : ` ${styles.soldOut}`}`}
      data-role="spot"
    >
      <div className={styles.top}>
        <span className={styles.ref} data-role="spot-ref">
          {ref}
        </span>
        {layout === 'quick'
          ? inStock && (
              <button
                type="button"
                className={styles.favorite}
                aria-label={`${buyLabel || 'Adicionar ao carrinho'}: ${name}`}
                data-role="spot-buy"
              >
                <Plus />
              </button>
            )
          : showWishlist && (
              <button
                type="button"
                className={styles.favorite}
                onClick={() => setNaLista(v => !v)}
                aria-pressed={naLista}
                aria-label={
                  naLista ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
                }
                data-role="spot-favorite"
              >
                {svg(
                  <path d={HEART} />,
                  naLista ? { fill: 'currentColor' } : {}
                )}
              </button>
            )}
      </div>

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
          <span className={styles.tag} data-role="spot-out-of-stock">
            {soldOutLabel || 'Esgotado'}
          </span>
        )}
        {inStock &&
          layout !== 'quick' &&
          buy(`${styles.buy} ${styles.buyOverlay}`)}
      </div>

      <div className={styles.info}>
        <div className={styles.row}>
          <a className={styles.name} href={href} data-role="spot-name">
            {name}
          </a>
          {inStock ? (
            <span className={styles.price} data-role="spot-price">
              {money11(product.price)}
            </span>
          ) : (
            <span
              className={`${styles.price} ${styles.priceOut}`}
              data-role="spot-unavailable"
            >
              {soldOutPriceLabel || 'Indisponível'}
            </span>
          )}
        </div>
        {installment && (
          <span className={styles.installment} data-role="spot-installments">
            ou {installment.installmentNumber}x de{' '}
            {money11(installment.installmentValue)}
          </span>
        )}
        {/* Mobile esgotado: a linha da parcela fica reservada, como no desenho (alinha os cards da grade). */}
        {!inStock && (
          <span
            className={`${styles.installment} ${styles.reserve}`}
            aria-hidden="true"
          >
            {' '}
          </span>
        )}
        {!inStock && notify(`${styles.notify} ${styles.notifyBox}`)}
      </div>

      {inStock
        ? layout === 'spot' && buy(`${styles.buy} ${styles.buyBar}`)
        : notify(`${styles.notify} ${styles.notifyBar}`)}
    </article>
  );
}

/**
 * O item "Spot" mostra o quadro do desenho `Spot11`, como o palco do starter
 * (`DevFidelityStage/Comum11Stage`): [A] Padrão, [B] Hover e [C] Esgotado lado a lado; no
 * mobile, 2 colunas sem a do hover (o esgotado vira [B]).
 */
export default function Spot11() {
  const [padrao] = PRODUTOS_11;
  const colunas = [
    { rotulo: '[A] Padrão', produto: padrao, hover: false },
    { rotulo: '[B] Hover', produto: padrao, hover: true },
    {
      rotulo: '[C] Esgotado',
      rotuloMob: '[B] Esgotado',
      produto: ESGOTADO_11,
      hover: false,
    },
  ];
  return (
    <div className={styles.productCard11Box}>
      <link rel="stylesheet" href={FONTES_11} />
      <div className={styles.spotStage}>
        <div className={styles.spotGrid}>
          {colunas.map((c, i) => (
            <div
              key={i}
              className={`${styles.spotCol}${c.hover ? ` ${styles.spotHoverCol}` : ''}`}
            >
              <span className={styles.spotLabel}>
                <span className={c.rotuloMob ? styles.spotDsk : undefined}>
                  {c.rotulo}
                </span>
                {c.rotuloMob && (
                  <span className={styles.spotMob}>{c.rotuloMob}</span>
                )}
              </span>
              <ProductCard11 product={c.produto} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

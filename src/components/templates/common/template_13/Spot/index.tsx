import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductCard13` do faststore.starter (família 13, Noturno; desenho
 * `Spot13`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1;
 * o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá (os quatro produtos com
 * parcela, o esgotado e o rótulo fixo "Drop 07"), sem foto: o desenho também não tem — vale
 * o grafite de placeholder da caixa 4:5.
 *
 * `ProductCard13` é exportado para as vitrines, a PLP e os relacionados da 13. O card não
 * baixa fonte (quem baixa é a seção de lista), igual a lá. `showListPrice` (preço "de" e
 * "-N%") só a PLP liga, como lá.
 *
 * Divergências deliberadas: sem commerce ("Comprar" não faz nada; o coração só alterna no
 * estado local) e sem analytics.
 */

export const FONTES_13 =
  'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&display=swap';

export type Produto13 = {
  id: string;
  name: string;
  price: number;
  listPrice: number;
  /** Melhor parcelamento; 0 some a linha (sem plano). */
  installments: number;
  installmentValue: number;
  /** `installmentInterest === 0` lá: acende o "sem juros" (só no desktop). */
  interestFree: boolean;
  inStock: boolean;
  image?: string;
  hoverImage?: string;
};

export const produto13 = (
  id: string,
  name: string,
  price: number,
  installments: number,
  installmentValue: number,
  inStock = true,
  listPrice = price,
  interestFree = true
): Produto13 => ({
  id,
  name,
  price,
  listPrice,
  installments,
  installmentValue,
  interestFree,
  inStock,
});

/** O mock.ts do ProductCard13. */
export const PRODUTOS_13: Produto13[] = [
  produto13('tenis-runner-v2-preto-lima', 'Tênis Runner V2 Preto/Lima', 699.9, 6, 116.65),
  produto13('camiseta-oversized-drop-07', 'Camiseta Oversized Drop 07', 189.9, 3, 63.3),
  produto13('bone-five-panel-nylon', 'Boné Five Panel Nylon', 149.9, 2, 74.95),
  produto13('moletom-capuz-refletivo', 'Moletom Capuz Refletivo', 399.9, 6, 66.65),
];

/** O esgotado do desenho `Spot13` (coluna Esgotado). */
export const ESGOTADO_13: Produto13 = produto13('jaqueta-corta-vento-refletiva', 'Jaqueta Corta-Vento Refletiva', 599.9, 0, 0, false);

/** Rótulo fixo da vitrine no desenho (o "Drop 07" sobre a foto). */
export const ROTULO_13 = 'Drop 07';

export const money13 = (n: number) =>
  `R$ ${n
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const HEART = 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z';

const Heart = ({ filled }: { filled: boolean }) => (
  <svg className={styles.heart} width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d={HEART} />
  </svg>
);

const Bag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

const Bell = () => (
  <svg className={styles.bell} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

export type ProductCard13Props = {
  product: Produto13;
  /** Rótulo fixo do CMS da vitrine (igual em todos os cards). Vazio esconde. */
  badge?: string;
  showWishlist?: boolean;
  /** Preço "de" riscado + "-N%" sobre a foto quando há desconto. Só a PLP liga. */
  showListPrice?: boolean;
  buyLabel?: string;
  soldOutLabel?: string;
  soldOutText?: string;
  notifyLabel?: string;
};

export function ProductCard13({
  product,
  badge,
  showWishlist = true,
  showListPrice = false,
  buyLabel,
  soldOutLabel,
  soldOutText,
  notifyLabel,
}: ProductCard13Props) {
  const [naLista, setNaLista] = useState(false);

  const href = '#';
  const name = product.name;
  const price = product.price;
  const listPrice = product.listPrice ?? price;
  const discount = showListPrice && listPrice > price ? Math.round((1 - price / listPrice) * 100) : 0;
  const inStock = product.inStock;
  const installment =
    inStock && product.installments
      ? {
          installmentNumber: product.installments,
          installmentValue: product.installmentValue,
          installmentInterest: product.interestFree ? 0 : 1,
        }
      : null;
  const comprar = buyLabel || 'Comprar';

  return (
    <article className={`${styles.productCard13}${inStock ? '' : ` ${styles.soldOut}`}`} data-role="spot">
      <div className={styles.media}>
        <a className={styles.mediaLink} href={href} tabIndex={-1} aria-hidden="true" data-role="spot-image">
          {product.image && <img className={styles.img} src={product.image} alt={name} width={400} height={500} />}
          {product.hoverImage && <img className={styles.imgHover} src={product.hoverImage} alt="" width={400} height={500} />}
        </a>

        {inStock ? (
          badge ? (
            <span className={styles.tag} data-role="spot-tag">
              {badge}
            </span>
          ) : (
            discount > 0 && (
              <span className={styles.tag} data-role="spot-discount">
                -{discount}%
              </span>
            )
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
            aria-label={naLista ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            data-role="spot-favorite"
          >
            <Heart filled={naLista} />
          </button>
        )}

        {inStock && (
          <button type="button" className={`${styles.buy} ${styles.dsk}`} aria-label={`${comprar}: ${name}`} data-role="spot-buy">
            <Bag />
            {comprar}
          </button>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>
          <a href={href} data-role="spot-name">
            {name}
          </a>
        </h3>
        {discount > 0 ? (
          <span className={styles.priceRow}>
            <s className={styles.listPrice} data-role="spot-list-price">
              <span className={styles.srOnly}>De </span>
              {money13(listPrice)}
            </s>
            <span className={styles.price} data-role="spot-price">
              <span className={styles.srOnly}>por </span>
              {money13(price)}
            </span>
          </span>
        ) : (
          <span className={styles.price} data-role="spot-price">
            {money13(price)}
          </span>
        )}
        {installment && (
          <span className={styles.installment} data-role="spot-installments">
            {installment.installmentNumber}x de {money13(installment.installmentValue)}
            {installment.installmentInterest === 0 && <span className={styles.dsk}> sem juros</span>}
          </span>
        )}
        {!inStock && (
          <span className={`${styles.installment} ${styles.mob}`} data-role="spot-unavailable">
            {soldOutText || 'Indisponível'}
          </span>
        )}
      </div>

      {inStock ? (
        <button type="button" className={`${styles.buyWide} ${styles.mob}`} aria-label={`${comprar}: ${name}`} data-role="spot-buy">
          {comprar}
        </button>
      ) : (
        <a className={styles.notify} href={href} data-role="spot-notify">
          <Bell />
          <span>{notifyLabel || 'Me avise'}</span>
        </a>
      )}
    </article>
  );
}

/**
 * O item "Spot" mostra o quadro do desenho `Spot13`, como o palco do starter
 * (`DevFidelityStage/Comum13Stage`): Padrão, Hover e Esgotado lado a lado, com o rótulo
 * "Drop 07"; no mobile, 2 colunas sem a do hover. A coluna Hover pinta o estado de hover por
 * CSS (fim da folha); lá, o comparador passa o mouse.
 */
export default function Spot13() {
  const [padrao] = PRODUTOS_13;
  const colunas = [
    { rotulo: 'Padrão', produto: padrao, hover: false },
    { rotulo: 'Hover', produto: padrao, hover: true },
    { rotulo: 'Esgotado', produto: ESGOTADO_13, hover: false },
  ];
  return (
    <div className={styles.productCard13Box}>
      <link rel="stylesheet" href={FONTES_13} />
      <div className={styles.spotStage}>
        <div className={styles.spotGrid}>
          {colunas.map((c, i) => (
            <div key={i} className={`${styles.spotCol}${c.hover ? ` ${styles.spotHoverCol}` : ''}`}>
              <span className={styles.spotLabel}>{c.rotulo}</span>
              <ProductCard13 product={c.produto} badge={ROTULO_13} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

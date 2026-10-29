import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductCard15` do faststore.starter (família 15, Luxo; desenho
 * `Spot15`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1;
 * o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá (os quatro produtos, o
 * esgotado, a marca e o rótulo fixo "Atelier"), sem foto: o desenho também não tem — vale a
 * areia de placeholder da caixa 4:5.
 *
 * `ProductCard15` é exportado para as vitrines, a PLP e os relacionados da 15. O card não
 * baixa fonte (quem baixa é a seção de lista), igual a lá. Regras do selo e do desconto
 * iguais às de lá: o único selo sobre a foto é o rótulo fixo da vitrine (`badge`); o preço
 * "de" riscado e o "-N%" ficam na linha do preço, sempre que o produto em estoque tem
 * `listPrice` maior que o preço (em qualquer lista, não só na PLP).
 *
 * Divergências deliberadas: sem commerce ("Comprar" não faz nada; o coração só alterna no
 * estado local) e sem analytics.
 */

export const FONTES_15 =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600&display=swap';

export type Produto15 = {
  id: string;
  name: string;
  /** `brand.name` lá; vazio some a linha. */
  brand: string;
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

export const MARCA_15 = 'Sua Marca Joias';

export const produto15 = (
  id: string,
  name: string,
  price: number,
  listPrice: number,
  installments: number,
  installmentValue: number,
  inStock = true,
  brand = MARCA_15,
  interestFree = true
): Produto15 => ({
  id,
  name,
  brand,
  price,
  listPrice,
  installments,
  installmentValue,
  interestFree,
  inStock,
});

/** O mock.ts do ProductCard15 (`productCard15Mock`). */
export const PRODUTOS_15: Produto15[] = [
  produto15('anel-solitario-ouro-18k', 'Anel Solitário Ouro 18k', 6890, 6890, 10, 689),
  produto15('brincos-perola-barroca', 'Brincos Pérola Barroca', 1290, 1590, 10, 129),
  produto15('eau-de-parfum-ambre-nuit', 'Eau de Parfum Ambre Nuit 100 ml', 789, 789, 6, 131.5),
  produto15('relogio-classico-aco-safira', 'Relógio Clássico Aço e Safira', 4290, 4290, 10, 429),
];

/** O esgotado do desenho `Spot15` (coluna Esgotado; `productCard15SoldOutMock`). */
export const ESGOTADO_15: Produto15 = produto15('colar-riviera-prata-925', 'Colar Riviera Prata 925', 2450, 2450, 0, 0, false);

/** Rótulo fixo da vitrine no desenho (`productCard15MockBadge`). */
export const ROTULO_15 = 'Atelier';

export const money15 = (n: number) =>
  `R$ ${n
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const Heart = ({ filled }: { filled: boolean }) => (
  <svg className={styles.heart} width="19" height="19" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  </svg>
);

const Bag = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M5 8h14l-1 12H6L5 8z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);

const Bell = () => (
  <svg className={styles.bell} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

export type ProductCard15Props = {
  product: Produto15;
  /** Rótulo fixo do CMS da vitrine (igual em todos os cards). Vazio esconde. */
  badge?: string;
  /** `false` some o coração. */
  showWishlist?: boolean;
  /** `false` some a linha da marca. */
  showBrand?: boolean;
  buyLabel?: string;
  soldOutLabel?: string;
  soldOutText?: string;
  notifyLabel?: string;
};

export function ProductCard15({
  product,
  badge,
  showWishlist = true,
  showBrand = true,
  buyLabel,
  soldOutLabel,
  soldOutText,
  notifyLabel,
}: ProductCard15Props) {
  const [naLista, setNaLista] = useState(false);

  const href = '#';
  const name = product.name;
  const brand = showBrand ? product.brand : '';
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
  const comprar = buyLabel || 'Comprar';

  return (
    <article className={`${styles.productCard15}${inStock ? '' : ` ${styles.soldOut}`}`} data-role="spot">
      <div className={styles.media}>
        <a className={styles.mediaLink} href={href} tabIndex={-1} aria-hidden="true" data-role="spot-image">
          {product.image && <img className={styles.img} src={product.image} alt={name} width={400} height={500} />}
          {product.hoverImage && <img className={styles.imgHover} src={product.hoverImage} alt="" width={400} height={500} />}
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
        {brand && (
          <span className={styles.brand} data-role="spot-brand">
            {brand}
          </span>
        )}
        <h3 className={styles.name}>
          <a href={href} data-role="spot-name">
            {name}
          </a>
        </h3>
        {discount > 0 ? (
          <span className={styles.priceRow}>
            <s className={styles.listPrice} data-role="spot-list-price">
              <span className={styles.srOnly}>De </span>
              {money15(listPrice)}
            </s>
            <span className={styles.price} data-role="spot-price">
              <span className={styles.srOnly}>por </span>
              {money15(price)}
            </span>
            <span className={styles.discount} data-role="spot-discount">
              -{discount}%
            </span>
          </span>
        ) : (
          <span className={styles.price} data-role="spot-price">
            {money15(price)}
          </span>
        )}
        {installment && (
          <span className={styles.installment} data-role="spot-installments">
            {installment.installmentNumber}x de {money15(installment.installmentValue)}
            {installment.installmentInterest === 0 && <span className={styles.dsk}> sem juros</span>}
          </span>
        )}
        {!inStock && (
          <span className={`${styles.installment} ${styles.mob}`} data-role="spot-unavailable">
            {soldOutText || 'Indisponível'}
          </span>
        )}
        {!inStock && (
          <a className={styles.notify} href={href} data-role="spot-notify">
            <Bell />
            <span>{notifyLabel || 'Avise-me'}</span>
          </a>
        )}
      </div>

      {inStock && (
        <button type="button" className={`${styles.buyWide} ${styles.mob}`} aria-label={`${comprar}: ${name}`} data-role="spot-buy">
          {comprar}
        </button>
      )}
    </article>
  );
}

/**
 * O item "Spot" mostra o quadro do desenho `Spot15`, como o palco do starter
 * (`DevFidelityStage/Comum15Stage`): Padrão, Hover (o produto com desconto) e Esgotado lado
 * a lado, com o rótulo "Atelier"; no mobile, 2 colunas sem a do hover. A coluna Hover pinta o
 * estado de hover por CSS (fim da folha); lá, o comparador passa o mouse.
 */
export default function Spot15() {
  const [padrao, desconto] = PRODUTOS_15;
  const colunas = [
    { rotulo: 'Padrão', produto: padrao, hover: false },
    { rotulo: 'Hover', produto: desconto, hover: true },
    { rotulo: 'Esgotado', produto: ESGOTADO_15, hover: false },
  ];
  return (
    <div className={styles.productCard15Box}>
      <link rel="stylesheet" href={FONTES_15} />
      <div className={styles.spotStage}>
        <div className={styles.spotGrid}>
          {colunas.map((c, i) => (
            <div key={i} className={`${styles.spotCol}${c.hover ? ` ${styles.spotHoverCol}` : ''}`}>
              <span className={styles.spotLabel}>{c.rotulo}</span>
              <ProductCard15 product={c.produto} badge={ROTULO_15} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductCard17` do faststore.starter (família 17, Pet; desenho `Spot17`).
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS é
 * derivado do SCSS de lá. Conteúdo = o mock.ts de lá (os quatro produtos com parcela e Pix,
 * as notas do palco e o esgotado), sem foto: vale o recorte neutro que o card desenha no
 * quadro branco.
 *
 * `ProductCard17` é exportado para as vitrines, a PLP e os relacionados da 17. O card não
 * baixa fonte (quem baixa é a seção de lista), igual a lá. Regras do selo e do desconto, como
 * lá: o "-N%" é uma pílula tangerina no canto da foto sempre que o produto em estoque tem
 * `listPrice > price`, e o rótulo fixo da vitrine (`badge`) empilha logo abaixo dele (um nunca
 * cobre o outro); o "de" riscado vai na coluna de preço. Esgotado: a pílula escura no centro
 * da foto, sem desconto, parcela, Pix nem estrelas, e "Avise-me" no lugar do botão; o coração
 * fica só no desktop. Parcela: o maior plano em mais de 1x (lá, `bestInstallment`, que ignora
 * o 1x); "sem juros" só no desktop.
 *
 * Divergências deliberadas: sem commerce ("Adicionar" não faz nada; o coração só alterna no
 * estado local), sem analytics e com a nota vinda do produto (lá, do `getProductRating`).
 */

export const FONTES_17 =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap';

export type Produto17 = {
  id: string;
  name: string;
  brand: string;
  price: number;
  listPrice: number;
  /** Melhor parcelamento sem juros; 1 ou 0 some a linha (lá, o `bestInstallment` ignora o 1x). */
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

export const produto17 = (
  id: string,
  name: string,
  brand: string,
  price: number,
  listPrice: number,
  installments: number,
  installmentValue: number,
  pix = 0,
  inStock = true,
  rating = 0,
  ratingCount = 0
): Produto17 => ({
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

/** O mock.ts do ProductCard17 (com as notas do palco). */
export const PRODUTOS_17: Produto17[] = [
  produto17(
    'racao-premium-caes-adultos-15kg',
    'Ração Premium Cães Adultos Frango e Arroz 15 kg',
    'Nobre Pet',
    329.9,
    389.9,
    6,
    54.98,
    316.7,
    true,
    4.9,
    214
  ),
  produto17(
    'petisco-bifinho-natural-500g',
    'Petisco Bifinho Natural 500 g',
    'Vitta Pet',
    39.9,
    39.9,
    1,
    39.9,
    38.3,
    true,
    4.8,
    96
  ),
  produto17(
    'cama-redonda-pelucia-m',
    'Cama Redonda Pelúcia Tamanho M',
    'Casa do Bicho',
    149.9,
    179.9,
    5,
    29.98,
    143.9,
    true,
    4.7,
    58
  ),
  produto17(
    'areia-higienica-gatos-12kg',
    'Areia Higiênica para Gatos 12 kg',
    'Mia Gatos',
    59.9,
    59.9,
    2,
    29.95,
    57.5,
    true,
    4.6,
    131
  ),
];

/** O esgotado do desenho `Spot17` (coluna Esgotado). */
export const ESGOTADO_17: Produto17 = produto17(
  'arranhador-torre-sisal-90cm',
  'Arranhador Torre Sisal 90 cm',
  'Casa do Bicho',
  199.9,
  199.9,
  0,
  0,
  0,
  false,
  4.8,
  42
);

export const money17 = (n: number) =>
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
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={HEART} />
  </svg>
);

const Bag = () => (
  <svg
    className={styles.btnIcon}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
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
    className={styles.btnIcon}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

/** As 5 estrelas do desenho (14 px, 2 de vão); as que passam da nota ficam apagadas. */
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

export type ProductCard17Props = {
  product: Produto17;
  /** Rótulo fixo do CMS da vitrine (igual em todos os cards), empilhado sob o -N%. Vazio esconde. */
  badge?: string;
  /** `false` some o coração (vitrines da Tray não têm favoritos). */
  showWishlist?: boolean;
  /** `false` some as estrelas (loja sem app de avaliação). */
  showRating?: boolean;
  /** Rótulos vindos do CMS da lista; vazios caem no texto do desenho. */
  buyLabel?: string;
  soldOutLabel?: string;
  soldOutText?: string;
  notifyLabel?: string;
};

export function ProductCard17({
  product,
  badge,
  showWishlist = true,
  showRating = true,
  buyLabel,
  soldOutLabel,
  soldOutText,
  notifyLabel,
}: ProductCard17Props) {
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
  const installment =
    inStock && product.installments > 1 ? product : null;
  const pix = inStock && product.pix ? product.pix : 0;
  const comprar = buyLabel || 'Adicionar';
  const media = product.rating || 0;
  const total = product.ratingCount || 0;
  const temNota = inStock && showRating && media > 0;

  return (
    <article
      className={`${styles.productCard17}${inStock ? '' : ` ${styles.soldOut}`}`}
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
          {product.image ? (
            <img
              className={styles.img}
              src={product.image}
              alt={name}
              width={400}
              height={400}
            />
          ) : (
            // Produto sem foto: o recorte neutro do desenho no quadro branco.
            <span className={styles.placeholder} />
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
          // O -N% no canto e o rótulo da vitrine logo abaixo: empilham, nenhum cobre o outro.
          (discount > 0 || badge) && (
            <div className={styles.tags} data-role="spot-tags">
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
            className={`${styles.favorite}${inStock ? '' : ` ${styles.dsk}`}`}
            onClick={() => setNaLista(v => !v)}
            aria-pressed={naLista}
            aria-label={
              naLista ? 'Remover dos favoritos' : 'Salvar nos favoritos'
            }
            data-role="spot-favorite"
          >
            <Heart filled={naLista} />
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
          <s className={styles.listPrice} data-role="spot-list-price">
            <span className={styles.srOnly}>De </span>
            {money17(listPrice)}
          </s>
        )}
        <span className={styles.price} data-role="spot-price">
          {discount > 0 && <span className={styles.srOnly}>por </span>}
          {money17(price)}
        </span>
        {installment && (
          <span className={styles.installment} data-role="spot-installments">
            {installment.installments}x de{' '}
            {money17(installment.installmentValue)}
            <span className={styles.dsk}> sem juros</span>
          </span>
        )}
        {pix > 0 && (
          <span className={styles.pix} data-role="spot-pix">
            {money17(pix)} no Pix
          </span>
        )}
        {!inStock && (
          <span className={styles.outText} data-role="spot-unavailable">
            {soldOutText || 'Avisamos por e-mail quando voltar'}
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
 * O item "Spot" mostra o quadro do desenho `Spot17`, como o palco do starter
 * (`DevFidelityStage/Comum17Stage`): Padrão, Hover · 2ª foto e Esgotado lado a lado, com as
 * notas do desenho e sem rótulo de vitrine (o desenho do card só tem o -N%); no mobile, 2
 * colunas sem a do hover. A coluna Hover pinta o estado de hover por CSS (fim da folha); lá, o
 * comparador passa o mouse.
 */
export default function Spot17() {
  const [padrao] = PRODUTOS_17;
  const colunas = [
    { rotulo: 'Padrão', produto: padrao, hover: false },
    { rotulo: 'Hover · 2ª foto', produto: padrao, hover: true },
    { rotulo: 'Esgotado', produto: ESGOTADO_17, hover: false },
  ];
  return (
    <div className={styles.productCard17Box}>
      <link rel="stylesheet" href={FONTES_17} />
      <div className={styles.spotStage}>
        <div className={styles.spotGrid}>
          {colunas.map((c, i) => (
            <div
              key={i}
              className={`${styles.spotCol}${c.hover ? ` ${styles.spotHoverCol}` : ''}`}
            >
              <span className={styles.spotLabel}>{c.rotulo}</span>
              <ProductCard17 product={c.produto} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

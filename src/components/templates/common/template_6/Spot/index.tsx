'use client';

import React from 'react';

import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';
import type { ProdutoNormal } from '@/utils/produtos';

import styles from './index.module.css';

export { deProduto06 } from './ProductCard06';

export default function Spot({
  soCard = false,
  produto,
}: {
  soCard?: boolean;
  /** O produto da loja do slot (a lista passa um por slot). */
  produto?: ProdutoNormal;
}) {
  const daLoja = useProdutosDaLoja();
  // Item do catálogo (fora de lista): o 1º produto da loja; numa lista sem produto, o mock.
  const daLojaDoSlot = produto ?? (soCard ? undefined : daLoja?.[0]);
  const mock = {
    id: 1,
    name: 'Tênis Esportivo Confortável',
    link: '/produto/tenis-esportivo',
    images: [
      { full: 'https://placehold.co/348' },
      { full: 'https://placehold.co/348' },
    ],
    featured: true,
    isNew: true,
    price: 299.9,
    priceOffer: 199.9,
    stock: 10,
    brand: 'Nike',
    description: 'Tênis leve e confortável para corridas e caminhadas.',
  };
  // O "de" é `price`, o preço vigente `priceOffer` (0 = sem desconto): a regra do card.
  const product = daLojaDoSlot
    ? {
        id: 1,
        name: daLojaDoSlot.name,
        link: '#',
        images: daLojaDoSlot.images.length
          ? daLojaDoSlot.images.map(full => ({ full }))
          : [{ full: 'https://placehold.co/348' }],
        featured: !!daLojaDoSlot.badge,
        isNew: false,
        price:
          daLojaDoSlot.listPrice > daLojaDoSlot.price
            ? daLojaDoSlot.listPrice
            : daLojaDoSlot.price,
        priceOffer:
          daLojaDoSlot.listPrice > daLojaDoSlot.price ? daLojaDoSlot.price : 0,
        stock: daLojaDoSlot.inStock ? 10 : 0,
        brand: daLojaDoSlot.brand,
        description: daLojaDoSlot.description,
      }
    : mock;
  const rotulo = daLojaDoSlot?.badge || 'Oferta';
  const fmt = (n: number) =>
    daLojaDoSlot
      ? n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : n.toFixed(2);

  const discountPercentage = Math.round(
    100 - (product.priceOffer / product.price) * 100
  );

  const unitPrice = product.priceOffer > 0 ? product.priceOffer : product.price;
  const installments =
    !daLojaDoSlot || daLojaDoSlot.installments > 0 ? (
      <div className={styles['product-payment']} data-role="card-inst">
        <span>
          {daLojaDoSlot
            ? `${daLojaDoSlot.installments}X de R$ ${fmt(daLojaDoSlot.installmentValue)}`
            : `3X de R$ ${(unitPrice / 3).toFixed(2)}`}
        </span>
      </div>
    ) : null;

  return (
    <div className={`${styles.product} ${styles.spot}`} data-spot="Spot06">
      <div className={styles.productWrapper}>
        {/* Imagem */}
        <div className={styles.productImage}>
          <a href={product.link}>
            <img
              src={product.images[0].full}
              alt={`Imagem do produto ${product.name}`}
              width="348"
              height="348"
            />
            {product.images[1] && (
              <img
                className={styles.imageOverlay}
                src={product.images[1].full}
                alt={`Imagem do produto ${product.name}`}
                width="348"
                height="348"
              />
            )}
          </a>

          {/* Tags */}
          <div className={styles.productTag}>
            {product.featured && (
              <div className={styles.tagFeatured}>
                <span>{rotulo}</span>
              </div>
            )}
            {product.isNew && (
              <div className={styles.tagNew}>
                <span>Novo</span>
              </div>
            )}
            {discountPercentage > 0 && discountPercentage < 100 && (
              <div className={styles.tagDiscount}>
                <span>-{discountPercentage}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className={styles.productContent}>
          <div className={styles.productTitle}>
            <h3>
              <a href={product.link}>{product.name}</a>
            </h3>
          </div>

          {/* Preços */}
          <div className={styles.productPriceWrapper}>
            <div className={styles.productPrice}>
              {product.priceOffer > 0 ? (
                <div className={styles.prices}>
                  <div className={styles.priceBefore}>
                    <span title="BRL">R$</span>
                    <span>{fmt(product.price)}</span>
                  </div>
                  <div className={styles.pricePromotion}>
                    <div className={styles.priceOff}>
                      <span title="BRL">R$</span>
                      <span>{fmt(product.priceOffer)}</span>
                    </div>
                  </div>
                  {installments}
                </div>
              ) : (
                <div className={styles.prices}>
                  {/* "de" reservado (invisível): o preço não sobe em relação ao vizinho com desconto. */}
                  <div className={`${styles.priceBefore} ${styles.vazio}`} aria-hidden="true">
                    <span>&nbsp;</span>
                  </div>
                  <div className={styles.priceNormal}>
                    <span title="BRL">R$</span>
                    <span>{fmt(product.price)}</span>
                  </div>
                  {installments}
                </div>
              )}
            </div>
          </div>

          {/* Botão de compra */}
          <div className={styles.productBuy}>
            {product.stock > 0 ? (
              <a href={product.link}>Comprar</a>
            ) : (
              <a href={product.link} className={styles.buyWithoutStock}>
                Avise-me
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

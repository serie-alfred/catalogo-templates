'use client';

import React from 'react';
import styles from './index.module.css';

export default function Spot() {
  const product = {
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

  const discountPercentage = Math.round(
    100 - (product.priceOffer / product.price) * 100
  );

  return (
    <div className={`${styles.product} ${styles.spot}`}>
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
                <span>Oferta</span>
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
                    <span>{product.price.toFixed(2)}</span>
                  </div>
                  <div className={styles.pricePromotion}>
                    <div className={styles.priceOff}>
                      <span title="BRL">R$</span>
                      <span>{product.priceOffer.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.priceNormal}>
                  <span title="BRL">R$</span>
                  <span>{product.price.toFixed(2)}</span>
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

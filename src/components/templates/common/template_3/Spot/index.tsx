'use client';

import React from 'react';
import styles from './index.module.css';

export default function Spot() {
  const product = {
    id: 123,
    name: 'Exemplo de Produto',
    link: '#',
    images: [
      { full: 'https://placehold.co/391' },
      { full: 'https://placehold.co/391' },
    ],
    featured: true,
    isNew: true,
    price: 300,
    price_offer: 199.9,
    ranking: { rating: 4, count: 27 },
    stock: 12,
  };

  const discount = Math.round(
    100 - (product.price_offer / product.price) * 100
  );

  return (
    <div className={`${styles.product} ${styles.spot}`}>
      <div className={styles.productWrapper}>
        {/* Imagem do produto */}
        <div className={styles.productImage}>
          <a href={product.link}>
            {product.images.length > 1 ? (
              <>
                <img
                  className={styles.lazy}
                  src={product.images[0].full}
                  alt={`Imagem do produto ${product.name}`}
                  width="348"
                  height="348"
                />
                <img
                  className={`${styles.lazy} ${styles.imageOverlay}`}
                  src={product.images[1].full}
                  alt={`Imagem do produto ${product.name}`}
                  width="348"
                  height="348"
                />
              </>
            ) : (
              <img
                className={styles.lazy}
                src={product.images[0].full}
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
          </div>
        </div>

        {/* Conteúdo */}
        <div className={styles.productContent}>
          {/* Nome */}
          <div className={styles.productTitle}>
            <h3>
              <a href={product.link}>{product.name}</a>
            </h3>

            <div className={styles.productStars}>
              {[1, 2, 3, 4, 5].map(rating => (
                <svg
                  key={rating}
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.8638 0.722089L6.7437 2.49644C6.8637 2.74343 7.18365 2.98035 7.45365 3.02571L9.04845 3.29287C10.0683 3.46426 10.3083 4.2103 9.5734 4.94625L8.33355 6.19635C8.12355 6.40805 8.0086 6.81635 8.07355 7.10875L8.42855 8.65625C8.7085 9.88115 8.06355 10.355 6.9887 9.7148L5.49385 8.8226C5.2239 8.6613 4.77895 8.6613 4.50395 8.8226L3.00913 9.7148C1.93925 10.355 1.28932 9.8761 1.56929 8.65625L1.92425 7.10875C1.98924 6.81635 1.87426 6.40805 1.66428 6.19635L0.42442 4.94625C-0.3055 4.2103 -0.0705252 3.46426 0.94936 3.29287L2.54418 3.02571C2.80915 2.98035 3.12912 2.74343 3.2491 2.49644L4.129 0.722089C4.60895 -0.240696 5.38885 -0.240696 5.8638 0.722089Z"
                    fill={
                      product.ranking.rating >= rating ? '#FFCD29' : '#B8B8B8'
                    }
                  ></path>
                </svg>
              ))}
              <span>({product.ranking.count})</span>
            </div>
          </div>

          {/* Preço (simulação do snippets/product-payment) */}
          <div className={styles.productPriceWrapper}>
            {product.price_offer < product.price ? (
              <>
                <div className={styles.priceWrapper}>
                  <span className={styles.oldPrice}>
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                  {discount > 0 && discount < 100 && (
                    <div className={styles.tagDiscount}>
                      <span>-{discount}%</span>
                    </div>
                  )}
                </div>
                <span className={styles.price}>
                  R$ {product.price_offer.toFixed(2).replace('.', ',')}
                </span>
              </>
            ) : (
              <span className={styles.price}>
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

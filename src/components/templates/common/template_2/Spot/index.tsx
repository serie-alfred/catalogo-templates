import React from 'react';
import styles from './index.module.css';

export default function Spot() {
  return (
    <div className={`${styles.product} ${styles.spot}`}>
      <div className={styles.productWrapper}>
        {/* Imagem do Produto */}
        <div className={styles.productImage}>
          <a
            href="https://parceiroseriedesign.commercesuite.com.br/exclusivos/categoria-lorem/ipsum-dotsit/teste-5"
            data-tray-tst="vitrine_produto_link_imagem"
          >
            <img
              src="https://placehold.co/428"
              alt="Imagem do produto Lorem ipsum dolor sit amet..."
              itemProp="image"
              width="428"
              height="428"
            />
            <img
              className={styles.imageOverlay}
              src="https://placehold.co/428"
              alt="Imagem do produto Lorem ipsum dolor sit amet..."
              itemProp="image"
              width="428"
              height="428"
            />
          </a>

          {/* Tag de Novo */}
          <div className={styles.productTag}>
            <div className={styles.tagNew}>
              <span>Novo</span>
            </div>
          </div>

          {/* Botão Favorito */}
          <div className={styles.favoriteCard} data-id="111" data-type="card">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </span>
          </div>
        </div>

        {/* Conteúdo do Produto */}
        <div className={styles.productContent}>
          {/* Estrelas */}
          <div className={styles.pContentTop}>
            <div className={styles.productStars}>
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  fill="none"
                  height="12"
                  width="12"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.00777 1.01041L8.03432 3.08048C8.17432 3.36864 
                    8.54759 3.64504 8.86259 3.69797L10.7232 4.00965C11.9131 
                    4.20961 12.1931 5.07998 11.3356 5.93859L9.88914 
                    7.39704C9.64414 7.64403 9.51003 8.12038 9.58581 
                    8.46151L9.99998 10.2669C10.3266 11.696 9.57414 12.2488 
                    8.32015 11.5019L6.57616 10.461C6.26122 10.2728 5.74211 
                    10.2728 5.42128 10.461L3.67732 11.5019C2.42913 12.2488 
                    1.67088 11.6901 1.99751 10.2669L2.41163 8.46151C2.48745 
                    8.12038 2.3533 7.64403 2.10833 7.39704L0.661824 
                    5.93859C-0.189749 5.07998 0.0843885 4.20961 1.27425 
                    4.00965L3.14288 3.69797C3.44402 3.64504 3.81731 
                    3.36864 3.95729 3.08048L4.98383 1.01041C5.54378 
                    -0.112844 6.45366 -0.112844 7.00777 1.01041Z"
                    fill="#FFCD29"
                  />
                </svg>
              ))}
              <span>(2)</span>
            </div>
          </div>

          {/* Título */}
          <div className={styles.productTitle}>
            <h3 itemProp="name">
              <a href="https://parceiroseriedesign.commercesuite.com.br/exclusivos/categoria-lorem/ipsum-dotsit/teste-5">
                Lorem ipsum dolor sit amet, elit consectetur adipiscing.
                Fermentum, odio massa fermentum sociis. Varius vitae et
                tristique quisque nunc.
              </a>
            </h3>
          </div>

          {/* Preço */}
          <div className={styles.productPriceWrapper}>
            <div className={styles.productPrice}>
              <div className={styles.prices}>
                <div className={styles.priceNormal}>
                  <span className={styles.currency} title="BRL">
                    R$
                  </span>
                  <span>700,00</span>
                </div>
                <div className={styles.productPayment}>
                  <span>
                    ou <strong>10x</strong>
                  </span>
                  <span className={styles.precoDe}> de </span>
                  <strong>R$ 89,01</strong>
                  <span className={styles.operadora}> com juros </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Comprar */}
          <div className={styles.productBuy}>
            <a href="https://parceiroseriedesign.commercesuite.com.br/exclusivos/categoria-lorem/ipsum-dotsit/teste-5">
              Comprar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

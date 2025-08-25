import React from 'react';
import './index.css';

export default function Spot() {
  return (
    <div itemID="117" className="product spot" data-infavorite="true">
      <div className="product-wrapper">
        {/* Imagem */}
        <div className="product-image">
          <a
            href="https://parceiroseriedesign.commercesuite.com.br/exclusivos/carrinho-de-bebe"
            data-tray-tst="vitrine_produto_link_imagem"
          >
            <img
              src="https://images.tcdn.com.br/img/img_prod/426932/lorem_ipsum_dolor_sit_amet_elit_consectetur_adipiscing_fermentum_odio_massa_fermentum_sociis_varius__117_1_cc9d7dd39bca0efccf3a8b7322e2fe9a.jpg"
              alt="Imagem do produto Lorem ipsum dolor sit amet"
              width="348"
              height="348"
            />
            <img
              className="image__overlay"
              src="https://images.tcdn.com.br/img/img_prod/426932/lorem_ipsum_dolor_sit_amet_elit_consectetur_adipiscing_fermentum_odio_massa_fermentum_sociis_varius__117_2_cc9d7dd39bca0efccf3a8b7322e2fe9a.jpg"
              alt="Imagem do produto Lorem ipsum dolor sit amet"
              width="348"
              height="348"
            />
          </a>

          {/* Tag Novo */}
          <div className="product-tag">
            <div className="tag-new">
              <span>Novo</span>
            </div>
          </div>

          {/* Botão Favorito */}
          <div className="MF_card_product" data-id="117" data-type="card">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 
                5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 
                2-1.5-1.5-2.74-2-4.5-2A5.5 
                5.5 0 0 0 2 8.5c0 2.3 1.5 
                4.05 3 5.5l7 7Z"
                ></path>
              </svg>
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="product-content">
          {/* Topo */}
          <div className="p-content-top">
            <div className="product-brand">Electrolux</div>
            <div className="product-stars">
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
                    d="M7.00777 1.01041L8.03432 3.08048C8.17432 
                    3.36864 8.54759 3.64504 8.86259 3.69797L10.7232 
                    4.00965C11.9131 4.20961 12.1931 5.07998 11.3356 
                    5.93859L9.88914 7.39704C9.64414 7.64403 9.51003 
                    8.12038 9.58581 8.46151L9.99998 10.2669C10.3266 
                    11.696 9.57414 12.2488 8.32015 11.5019L6.57616 
                    10.461C6.26122 10.2728 5.74211 10.2728 5.42128 
                    10.461L3.67732 11.5019C2.42913 12.2488 1.67088 
                    11.6901 1.99751 10.2669L2.41163 8.46151C2.48745 
                    8.12038 2.3533 7.64403 2.10833 7.39704L0.661824 
                    5.93859C-0.189749 5.07998 0.0843885 4.20961 
                    1.27425 4.00965L3.13488 3.69797C3.44402 3.64504 
                    3.81731 3.36864 3.95729 3.08048L4.98383 
                    1.01041C5.54378 -0.112844 6.45366 -0.112844 
                    7.00777 1.01041Z"
                    fill="#FFCD29"
                  />
                </svg>
              ))}
              <span>(1)</span>
            </div>
          </div>

          {/* Título */}
          <div className="product-title">
            <h3>
              <a href="https://parceiroseriedesign.commercesuite.com.br/exclusivos/carrinho-de-bebe">
                Lorem ipsum dolor sit amet, elit consectetur adipiscing.
                Fermentum, odio massa fermentum sociis. Varius vitae et
                tristique quisque nunc.
              </a>
            </h3>
          </div>

          {/* Preço */}
          <div className="product-price-wrapper">
            <div className="product-price">
              <div className="prices">
                <span className="price-various">A partir de</span>
                <div className="price-normal">
                  <abbr className="currency" title="BRL">
                    R$
                  </abbr>
                  <span>600,00</span>
                </div>
                <div className="product-payment">
                  <span>
                    {' '}
                    ou <strong>10x</strong>
                  </span>
                  <span className="preco-de"> de </span>
                  <strong>R$ 66,76</strong>
                  <span className="operadora"> com juros </span>
                  <span className="txt-forma-pagamento">
                    MasterCard - Vindi
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botão */}
          <div className="product-buy">
            <a href="https://parceiroseriedesign.commercesuite.com.br/exclusivos/carrinho-de-bebe">
              Comprar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

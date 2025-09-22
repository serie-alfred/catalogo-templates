import React, { useState } from 'react';
import styles from './index.module.css';

const ProductInfo = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('G');
  const [cep, setCep] = useState('');

  const product = {
    sku: '205',
    name: 'Produto 2',
    price: '600,00',
    installment: '10x de R$ 66,76',
    description: 'Data de lançamento: 25/03/2022\nDisponibilidade: Imediata',
    images: [
      'https://images.tcdn.com.br/img/img_prod/426932/produto_2_205_1_cc9d7dd39bca0efccf3a8b7322e2fe9a.jpg',
      'https://images.tcdn.com.br/img/img_prod/426932/produto_2_205_2_cc9d7dd39bca0efccf3a8b7322e2fe9a.jpg',
      'https://images.tcdn.com.br/img/img_prod/426932/produto_2_205_3_cc9d7dd39bca0efccf3a8b7322e2fe9a.jpg',
      'https://images.tcdn.com.br/img/img_prod/426932/produto_2_205_4_cc9d7dd39bca0efccf3a8b7322e2fe9a.jpg',
      'https://images.tcdn.com.br/img/img_prod/426932/produto_2_205_5_cc9d7dd39bca0efccf3a8b7322e2fe9a.jpg',
      'https://images.tcdn.com.br/img/img_prod/426932/produto_2_205_6_cc9d7dd39bca0efccf3a8b7322e2fe9a.jpg',
      'https://images.tcdn.com.br/img/img_prod/426932/produto_2_205_7_cc9d7dd39bca0efccf3a8b7322e2fe9a.jpg',
    ],
    sizes: ['G', 'GG', 'M'],
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
      setCep(value);
    }
  };

  const formatCep = (value: string) => {
    if (value.length > 5) {
      return value.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  return (
    <div className={styles.product__info}>
      <div className={styles.info__container}>
        <div className={styles.info__row}>
          {/* Seção Esquerda - Galeria de Imagens */}
          <div className={styles.info__left}>
            <div className={styles.info__position}>
              <div className={styles.info__image}>
                <div className={styles.productGallery}>
                  <div className={styles.conteudo}>
                    <div className={styles.produtoImagem}>
                      <div className={styles.wrap}>
                        <a
                          href={product.images[0]}
                          className={styles.containerThumb}
                          title="Produto 2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={product.images[0]}
                            title="Produto 2"
                            alt="Produto 2"
                            className={styles.photo}
                          />
                        </a>
                      </div>
                    </div>

                    <div className={styles.produtoImagemMiniaturas}>
                      <div className={styles.miniaturasWrapper}>
                        <ul className={styles.miniaturasList}>
                          {product.images.map((image, index) => (
                            <li key={index} className={styles.miniaturaItem}>
                              <span className={styles.produtoImagemMiniatura}>
                                <a
                                  href={image}
                                  className={styles.cloudZoomGallery}
                                >
                                  <img
                                    src={image}
                                    title="Produto 2"
                                    alt="Produto 2"
                                  />
                                </a>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Direita - Informações do Produto */}
          <div className={styles.info__right}>
            <div className={styles.info__content}>
              <div className={styles.content__positon}>
                <div className={styles.content__inner}>
                  <span className={styles.content__sku}>
                    SKU: {product.sku}
                  </span>
                  <h1 className={styles.productName}>{product.name}</h1>

                  <div className={styles.content__stars}>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} height="12" viewBox="0 0 12 12" width="12">
                        <path
                          d="M7.00776 1.01041L8.03431 3.08048C8.17431 3.36864 8.54759 3.64504 8.86259 3.69797L10.7232 4.00965C11.9131 4.20961 12.1931 5.07998 11.3356 5.93859L9.88914 7.39704C9.64414 7.64403 9.51003 8.12038 9.58581 8.46151L9.99997 10.2669C10.3266 11.696 9.57414 12.2488 8.32015 11.5019L6.57616 10.461C6.26121 10.2728 5.74211 10.2728 5.42127 10.461L3.67732 11.5019C2.42912 12.2488 1.67088 11.6901 1.99751 10.2669L2.41163 8.46151C2.48745 8.12038 2.3533 7.64403 2.10832 7.39704L0.66182 5.93859C-0.189753 5.07998 0.0843847 4.20961 1.27425 4.00965L3.13488 3.69797C3.44401 3.64504 3.8173 3.36864 3.95729 3.08048L4.98383 1.01041C5.54377 -0.112844 6.45366 -0.112844 7.00776 1.01041Z"
                          fill="#B8B8B8"
                        />
                      </svg>
                    ))}
                    <span>(0) avaliações</span>
                  </div>

                  <div className={styles.content__productTag}>
                    <div className={styles.tagNew}>
                      <span>Novo</span>
                    </div>
                  </div>

                  <div className={styles.content__excerpt}>
                    <ul>
                      <li>Data de lançamento: 25/03/2022</li>
                      <li>Disponibilidade: Imediata</li>
                    </ul>
                  </div>

                  <div className={styles.content__price}>
                    <div className={styles.produtoPreco}>
                      <div className={styles.preco}>
                        <span className={styles.precoPrincipal}>
                          R$ <span>{product.price}</span>
                        </span>
                        <div className={styles.infoPreco}>
                          <span className={styles.precoParc}>Em 10x</span>
                          <span className={styles.precoParc}> de </span>
                          <span className={styles.precoParc}>
                            {product.installment}
                          </span>
                          <span className={styles.precoParc}> com juros </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.produtoFormasPagamento}>
                      <a className={styles.showPaymentMethods}>
                        Ver todas as formas de pagamentos
                      </a>
                    </div>
                  </div>

                  <div className={styles.corVariacao}>
                    <div className={styles.menuVars}>
                      <div className={styles.textoVariacao}>
                        <h2>Escolha Tamanho</h2>
                      </div>
                      <ul className={styles.listaCorVariacao}>
                        {product.sizes.map(size => (
                          <li
                            key={size}
                            className={`${selectedSize === size ? styles.selected : ''}`}
                            onClick={() => handleSizeSelect(size)}
                          >
                            <div className={styles.sizeOption}>{size}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={styles.favoriteButton}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                    </svg>
                    Adicionar aos Favoritos
                  </div>

                  <div className={styles.productFormBox}>
                    <div className={styles.quantidade}>
                      <label>
                        <span
                          className={styles.qtyMinus}
                          onClick={() => handleQuantityChange(-1)}
                        >
                          <svg width="40" height="40" viewBox="0 0 40 40">
                            <path
                              d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
                              fill="#EFEFF0"
                            />
                            <path
                              d="M13 20H27"
                              stroke="#E60F73"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </span>
                        <span
                          className={styles.qtyPlus}
                          onClick={() => handleQuantityChange(1)}
                        >
                          <svg width="40" height="40" viewBox="0 0 40 40">
                            <path
                              d="M0 20C0 8.95431 8.95431 0 20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20Z"
                              fill="#EFEFF0"
                            />
                            <path
                              d="M20 13V27"
                              stroke="#E60F73"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                            <path
                              d="M13 20H27"
                              stroke="#E60F73"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </span>
                        <input
                          id="quant"
                          name="quant"
                          className={styles.quantityInput}
                          type="text"
                          value={quantity}
                          readOnly
                        />
                      </label>
                    </div>

                    <div className={styles.buyButton}>
                      <button className={styles.botaoComprar} type="button">
                        <span className={styles.botaoCommerceImg}>
                          <svg width="24" height="24" viewBox="0 0 24 24">
                            <path
                              d="M9 15L15.7078 14.4186C17.8066 14.2368 18.2778 13.76 18.5104 11.5831L19 7"
                              stroke="white"
                              strokeLinecap="round"
                            />
                            <path
                              d="M7 7H20"
                              stroke="white"
                              strokeLinecap="round"
                            />
                            <path
                              d="M7.5 20C8.32843 20 9 19.3284 9 18.5C9 17.6716 8.32843 17 7.5 17C6.67157 17 6 17.6716 6 18.5C6 19.3284 6.67157 20 7.5 20Z"
                              stroke="white"
                            />
                            <path
                              d="M15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"
                              stroke="white"
                            />
                            <path
                              d="M9 18H14"
                              stroke="white"
                              strokeLinecap="round"
                            />
                            <path
                              d="M4 4H4.805C5.59223 4 6.27845 4.50748 6.46938 5.23088L8.94877 14.6247C9.07406 15.0994 8.96683 15.6023 8.65687 15.9938L7.86011 17"
                              stroke="white"
                              strokeLinecap="round"
                            />
                          </svg>
                          Adicionar ao carrinho
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.content__message}>
                    <svg width="56" height="56" viewBox="0 0 56 56">
                      <path
                        d="M0.5 28C0.5 12.8122 12.8122 0.5 28 0.5C43.1878 0.5 55.5 12.8122 55.5 28C55.5 43.1878 43.1878 55.5 28 55.5C12.8122 55.5 0.5 43.1878 0.5 28Z"
                        stroke="#E60F73"
                      />
                      <path
                        d="M37 23V28M19 23C19 26.0645 19 32.7742 19 33.1613C19 34.5438 20.9456 35.3657 24.8369 37.0095C26.4002 37.6698 27.1818 38 28 38V27.3548"
                        stroke="#E60F73"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M31 35C31 35 31.875 35 32.75 37C32.75 37 35.5294 32 38 31"
                        stroke="#E60F73"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M24.3259 25.6914L21.4047 24.2779C19.8016 23.5021 19 23.1142 19 22.5C19 21.8858 19.8016 21.4979 21.4047 20.7221L24.3259 19.3086C26.1288 18.4362 27.0303 18 28 18C28.9697 18 29.8712 18.4362 31.6741 19.3086L34.5953 20.7221C36.1984 21.4979 37 21.8858 37 22.5C37 23.1142 36.1984 23.5021 34.5953 24.2779L31.6741 25.6914C29.8712 26.5638 28.9697 27 28 27C27.0303 27 26.1288 26.5638 24.3259 25.6914Z"
                        stroke="#E60F73"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M22 28L24 29"
                        stroke="#E60F73"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M33 20L23 25"
                        stroke="#E60F73"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span>
                      * Aqui sua compra é 100% segura, compre com tranquilidade.
                    </span>
                  </div>

                  <div className={styles.content__shipping}>
                    <div className={styles.produtoCalcularFrete}>
                      <div className={styles.cepbox}>
                        <h6>Simulador de Frete</h6>
                        <label htmlFor="cepInput">CEP:</label>
                        <input
                          type="text"
                          className={styles.cepInput}
                          id="cepInput"
                          value={formatCep(cep)}
                          onChange={handleCepChange}
                          placeholder="00000-000"
                          maxLength={9}
                        />
                        <button className={styles.botaoSimularFrete}>
                          Calcular frete
                        </button>
                      </div>
                    </div>

                    <span className={styles.shippingTitle}>
                      Frete e Entrega
                    </span>

                    <form className={styles.shippingForm}>
                      <label>
                        <input
                          type="text"
                          className={styles.cepMask}
                          value={formatCep(cep)}
                          onChange={handleCepChange}
                          placeholder="00000-000"
                        />
                      </label>
                      <button className={styles.shippingSend} type="button">
                        Enviar
                        <svg width="24" height="24" viewBox="0 0 24 24">
                          <path
                            d="M19 12H5"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M14 17L19 12"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M14 7L19 12"
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                          />
                        </svg>
                      </button>
                    </form>

                    <a
                      href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.noCep}
                    >
                      Não sei meu CEP
                    </a>

                    <div className={styles.shippingResults}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;

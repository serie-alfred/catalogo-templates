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
    installment: 'R$ 66,76',
    description: 'Data de lançamento: 25/03/2022\nDisponibilidade: Imediata',
    images: [
      'https://placehold.co/482x482',
      'https://placehold.co/482x482',
      'https://placehold.co/482x482',
    ],
    sizes: ['M', 'G', 'GG'],
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
      <div className={`${styles.info__container} component__container`}>
        <div className={styles.info__row}>
          {/* Seção Esquerda - Galeria de Imagens */}
          <div className={styles.info__left}>
            <div className={styles.info__position}>
              <div className={styles.info__image}>
                <div className={styles.productGallery}>
                  <div className={styles.conteudo}>
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
                                    className={`${index === 0 ? styles.selected : ""}`}
                                  />
                                </a>
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
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
                    <div className={`${styles.swiperPagination}`}>
                      <span
                        className={`${styles.swiperPaginationBullet} ${styles.swiperPaginationBulletActive}`}
                      ></span>
                      <span
                        className={`${styles.swiperPaginationBullet}`}
                      ></span>
                      <span
                        className={`${styles.swiperPaginationBullet}`}
                      ></span>
                      <span
                        className={`${styles.swiperPaginationBullet}`}
                        role="button"
                        aria-label="Go to slide 4"
                      ></span>
                      <span
                        className={`${styles.swiperPaginationBullet}`}
                        role="button"
                        aria-label="Go to slide 5"
                      ></span>
                      <span
                        className={`${styles.swiperPaginationBullet}`}
                        role="button"
                        aria-label="Go to slide 6"
                      ></span>
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
  
                  <h1 className={styles.productName}>{product.name}</h1>
                  <div className={styles.info__container_inf}>
                    <span className={styles.content__sku}>
                      SKU: <b>{product.sku}</b>
                    </span>
                    <div className={styles.content__stars}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} height="12" viewBox="0 0 12 12" width="12">
                          <path
                            d="M7.00776 1.01041L8.03431 3.08048C8.17431 3.36864 8.54759 3.64504 8.86259 3.69797L10.7232 4.00965C11.9131 4.20961 12.1931 5.07998 11.3356 5.93859L9.88914 7.39704C9.64414 7.64403 9.51003 8.12038 9.58581 8.46151L9.99997 10.2669C10.3266 11.696 9.57414 12.2488 8.32015 11.5019L6.57616 10.461C6.26121 10.2728 5.74211 10.2728 5.42127 10.461L3.67732 11.5019C2.42912 12.2488 1.67088 11.6901 1.99751 10.2669L2.41163 8.46151C2.48745 8.12038 2.3533 7.64403 2.10832 7.39704L0.66182 5.93859C-0.189753 5.07998 0.0843847 4.20961 1.27425 4.00965L3.13488 3.69797C3.44401 3.64504 3.8173 3.36864 3.95729 3.08048L4.98383 1.01041C5.54377 -0.112844 6.45366 -0.112844 7.00776 1.01041Z"
                            fill="#B8B8B8"
                          />
                        </svg>
                      ))}
                    </div>
                  </div>
              
                 

                  <div className={styles.content__productTag}>
                    <div className={styles.tagFeatured}>
                      <span>OFERTA</span>
                    </div>
                    <div className={styles.tagNew}>
                      <span>Novo</span>
                    </div>
                  </div>

                  <div className={styles.content__price}>
                    <div className={styles.produtoPreco}>
                      <div className={styles.preco}>
                        <div className={styles.precoBefore}>
                          <span className={styles.precoDe}>
                            R$<span>{product.price}</span>
                          </span>
                          <span className={styles.precoDiscountFlag}>
                            <span>-13%</span>
                          </span>
                        </div>

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
                        <h2>Cores disponíveis</h2>
                      </div>
                      <ul className={styles.listaCorVariacao}>
                        <li className={`${styles.listaItem} ${styles.selected}`}>
                          <div className={styles.color}></div>
                        </li>
                        <li className={`${styles.listaItem}`}>
                          <div className={`${styles.color} ${styles.red}`}></div>
                        </li>
                      </ul>
                    </div>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                    Adicionar aos Favoritos
                  </div>

                  <div className={styles.productFormBox}>
                    <div className={styles.quantidade}>
                      <label>
                        <span
                          className={styles.qtyMinus}
                          onClick={() => handleQuantityChange(-1)}
                        >
                          <svg
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1.66659 1.33325L4.99992 4.66659L8.33325 1.33325"
                              stroke="#B8B8B8"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span
                          className={styles.qtyPlus}
                          onClick={() => handleQuantityChange(1)}
                        >
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M8.33341 4.66675L5.00008 1.33341L1.66675 4.66675"
                              stroke="#141414"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <input
                          id="quant"
                          name="quant"
                          className={styles.quantityInput}
                          type="text"
                          value={1}
                          readOnly
                        />
                      </label>
                    </div>

                    <div className={styles.buyButton}>
                      <button className={styles.botaoComprar} type="button">
                        <span className={styles.botaoCommerceImg}>
                        <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 15L15.7078 14.4186C17.8066 14.2368 18.2778 13.76 18.5104 11.5831L19 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"></path>
                          <path d="M7 7H20" stroke="white" strokeWidth="1.5" strokeLinecap="round"></path>
                          <path d="M7.5 20C8.32843 20 9 19.3284 9 18.5C9 17.6716 8.32843 17 7.5 17C6.67157 17 6 17.6716 6 18.5C6 19.3284 6.67157 20 7.5 20Z" stroke="white" strokeWidth="1.5"></path>
                          <path d="M15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z" stroke="white" strokeWidth="1.5"></path>
                          <path d="M9 18H14" stroke="white" strokeWidth="1.5" strokeLinecap="round"></path>
                          <path d="M4 4H4.805C5.59223 4 6.27845 4.50748 6.46938 5.23088L8.94877 14.6247C9.07406 15.0994 8.96683 15.6023 8.65687 15.9938L7.86011 17" stroke="white" strokeWidth="1.5" strokeLinecap="round"></path>
                        </svg>
                          Adicionar ao carrinho
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className={styles.content__shipping}>
                    <span className={styles.shipping__title}>
                    Calcule seu frete
                    </span>

                    <form className={styles.shipping__form}>
                      <label>
                        <input
                          type="text"
                          className={styles.cepMask}
                          value={formatCep(cep)}
                          onChange={handleCepChange}
                          placeholder="00000-000"
                        />
                      </label>
                      <button className={styles.shipping__send} type="button">
                        Calcular
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

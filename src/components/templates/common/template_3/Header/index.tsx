import styles from './index.module.css';

const Header = () => {
  // Dados fixos para substituir as variáveis Twig
  const storeInfo = {
    name: 'Paulibrás',
    logo: '/logo.png', // Substitua pelo caminho real do logo
    whatsapp: '5511999999999', // Número formatado sem caracteres especiais
    social: {
      youtube: 'https://youtube.com/paulibras',
      instagram: 'https://instagram.com/paulibras',
      twitter: 'https://twitter.com/paulibras',
      linkedin: 'https://linkedin.com/company/paulibras',
      facebook: 'https://facebook.com/paulibras',
    },
  };

  // Dados do carrinho (fixos)
  const cartInfo = {
    amount: 0,
    price: '0,00',
  };

  return (
    <header className={styles.header}>
      {/* Header Middle */}
      <div className={styles.headerMiddle}>
        <div className={`${styles.middleContainer} component__container`}>
          <div className={styles.middleRow}>
            <div className={styles.middleTabs}>
              <div className={styles.tabsInner}>
                <svg
                  fill="none"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 5H16"
                    stroke="#0F0F0F"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4 12H20"
                    stroke="#0F0F0F"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4 19H12"
                    stroke="#0F0F0F"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>

            <div className={styles.middleLogo}>
              <h1>
                <a href="/" data-tray-tst="logotipo_loja">
                  <img
                    src={storeInfo.logo}
                    alt={`Logo`}
                    width="184"
                    height="56"
                    fetchPriority="high"
                  />
                </a>
              </h1>
            </div>

            <div className={styles.middleSearch}>
              <div className={styles.search}>
                <form action="/busca" method="get">
                  <input type="hidden" name="loja" value="1" />
                  <div>
                    <input
                      className={styles.searchKey}
                      type="text"
                      placeholder="Buscar seu produto"
                      name="palavra_busca"
                      data-tray-tst="busca_palavra"
                      required
                    />
                  </div>
                  <button
                    className={styles.searchButton}
                    type="submit"
                    data-tray-tst="botao_buscar"
                    aria-label="Botão de buscar"
                  >
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.5 16C7.4631 16 5 13.5369 5 10.5C5 7.4631 7.4631 5 10.5 5C13.5384 5 16 7.4631 16 10.5C16 13.5369 13.5384 16 10.5 16"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M19 19L15 15"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            <div className={styles.middleConfig}>
              <div className={styles.configWhatsapp}>
                <a
                  href={`https://api.whatsapp.com/send?phone=55${storeInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Link do número de whatsapp da loja"
                >
                  <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.8337 2.20734C10.5596 2.1813 10.2816 2.16797 10.0003 2.16797C5.39848 2.16797 1.66699 5.73761 1.66699 10.1402C1.66699 12.2556 2.5281 14.1776 3.93273 15.6039C4.24199 15.918 4.44848 16.347 4.36514 16.7886C4.22762 17.5106 3.91594 18.1841 3.45958 18.7455C4.66028 18.9688 5.90878 18.7677 6.97948 18.1983C7.35798 17.9971 7.54722 17.8964 7.68077 17.876C7.81431 17.8556 8.0056 17.8915 8.38816 17.9634C8.91966 18.0631 9.45924 18.1132 10.0003 18.1125C14.0253 18.1125 17.5547 15.3817 18.3337 11.7513"
                      stroke="#141414"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.99658 10.5H10.0041M6.66699 10.5H6.67447"
                      stroke="#141414"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.8199 3.66029C16.8199 4.48449 16.1659 5.15262 15.3592 5.15262C14.5524 5.15262 13.8984 4.48449 13.8984 3.66029C13.8984 2.8361 14.5524 2.16797 15.3592 2.16797C16.1659 2.16797 16.8199 2.8361 16.8199 3.66029Z"
                      stroke="#141414"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12.4698 8.33064C13.2428 7.11485 14.4703 6.65922 15.3585 6.66016C16.2467 6.6611 17.4382 7.11485 18.2112 8.33064C18.2612 8.40925 18.2749 8.50604 18.2298 8.58775C18.049 8.9152 17.4878 9.56512 17.0823 9.6092C16.6166 9.65978 15.3981 9.66687 15.3594 9.66712C15.3208 9.66695 14.0646 9.65978 13.5986 9.6092C13.1933 9.56512 12.6319 8.9152 12.4512 8.58775C12.4061 8.50604 12.4198 8.40925 12.4698 8.33064Z"
                      stroke="#141414"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                    />
                  </svg>
                  Contato
                </a>
              </div>

              <div className={styles.configLogin}>
                <div className={styles.notLogged}>
                  <a href="/central">
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.90002 20C7.50002 18.5 9.60002 17.5 12 17.5C14.3 17.5 16.5 18.4 18.1 20"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M14.1 9.39806C15.3 10.5981 15.3 12.4981 14.1 13.5981C12.9 14.6981 11 14.7981 9.90002 13.5981C8.80002 12.3981 8.70002 10.4981 9.90002 9.39806C11.1 8.29806 12.9 8.19806 14.1 9.39806"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M4 17C3.4 15.8 3 14.4 3 13C3 8 7 4 12 4C17 4 21 8 21 13C21 14.4 20.6 15.8 20 17"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Login
                  </a>
                </div>
              </div>

              <div className={styles.configCart}>
                <div className={styles.cartWrapper}>
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.47296 14.9531L4.78053 13.2388C5.14405 11.2126 5.32581 10.1996 6.04559 9.5998C6.76538 9 7.79933 9 9.86723 9H14.1328C16.2007 9 17.2346 9 17.9544 9.5998C18.6742 10.1996 18.8559 11.2126 19.2194 13.2388L19.5271 14.9531C20.0301 17.7568 20.2816 19.1586 19.5071 20.0793C18.7326 21 17.3018 21 14.4403 21H9.55966C6.69815 21 5.26740 21 4.49291 20.0793C3.71842 19.1586 3.96994 17.7568 4.47296 14.9531Z"
                      stroke="#000"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 9L8.14917 7.32182C8.31607 5.44422 9.99028 4 12 4C14.0097 4 15.6839 5.44422 15.8508 7.32182L16 9"
                      stroke="#000"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M15 11C14.87 12.1305 13.5657 13 12 13C10.4343 13 9.13002 12.1305 9 11"
                      stroke="#000"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={styles.cartTitle}>Carrinho</span>
                  <span className={styles.cartNumber} data-cart="amount">
                    {cartInfo.amount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Bottom */}
      <div className={styles.header__bottom}>
        <div className={`${styles.bottom__container} component__container`}>
          <div className={`${styles.bottom__row} component__row`}>
            <div className={styles.bottom__login}>
              <a href="#">Entre ou Cadastre-se</a>
            </div>

            <div className={styles.bottom__whatsapp}>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Precisa de ajuda
              </a>
            </div>

            <div className={styles.bottom__menu}>
              <nav>
                <ul>
                  <li
                    className={`${styles.t} ${styles.l1Item} ${styles.hasChild}`}
                  >
                    <a href="#" className={styles.l1ItemLink}>
                      Categoria 1
                      <svg
                        fill="none"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 16L14 12L10 8"
                          stroke="#000"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        ></path>
                      </svg>
                    </a>
                    <div className={styles.submenuWrapper}>
                      <div
                        className={`${styles.submenu__container} component__container`}
                      >
                        <div className={styles.submenu__inner}>
                          <ul
                            className={`${styles.submenuL1} ${styles.sub1} ${styles.categoriesL2}`}
                          >
                            <li
                              className={`${styles.subItem} ${styles.hasChild}`}
                            >
                              <a href="#" className={styles.l2ItemLink}>
                                Submenu 1
                                <svg
                                  fill="none"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  width="24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M10 16L14 12L10 8"
                                    stroke="#0F0F0F"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1.5"
                                  />
                                </svg>
                              </a>

                              <ul
                                className={`${styles.subMenu} ${styles.sub2} ${styles.categoriesL3}`}
                              >
                                <li data-category-id="411">
                                  <a
                                    href="https://parceiroseriedesign.commercesuite.com.br/filtros-e-purificadores-de-agua/purificador-de-agua/purificador-de-agua-natural"
                                    className="l3-item-link"
                                  >
                                    Submenu 1.1
                                  </a>
                                </li>
                                <li data-category-id="413">
                                  <a
                                    href="https://parceiroseriedesign.commercesuite.com.br/filtros-e-purificadores-de-agua/purificador-de-agua/purificador-de-agua-gelada"
                                    className="l3-item-link"
                                  >
                                    Submenu 1.2
                                  </a>
                                </li>
                                <li data-category-id="415">
                                  <a
                                    href="https://parceiroseriedesign.commercesuite.com.br/filtros-e-purificadores-de-agua/purificador-de-agua/purificador-de-agua-quente"
                                    className="l3-item-link"
                                  >
                                    Submenu 1.3
                                  </a>
                                </li>
                                <li data-category-id="417">
                                  <a
                                    href="https://parceiroseriedesign.commercesuite.com.br/filtros-e-purificadores-de-agua/purificador-de-agua/purificador-bacteriologico"
                                    className="l3-item-link"
                                  >
                                    Submenu 1.4
                                  </a>
                                </li>
                                <li data-category-id="419">
                                  <a
                                    href="https://parceiroseriedesign.commercesuite.com.br/filtros-e-purificadores-de-agua/purificador-de-agua/purificador-alcalino-ionziado"
                                    className="l3-item-link"
                                  >
                                    Submenu 1.5
                                  </a>
                                </li>
                                <li data-category-id="421">
                                  <a
                                    href="https://parceiroseriedesign.commercesuite.com.br/filtros-e-purificadores-de-agua/purificador-de-agua/purificador-com-ozonio"
                                    className="l3-item-link"
                                  >
                                    Submenu 1.6
                                  </a>
                                </li>
                                <li data-category-id="423">
                                  <a
                                    href="https://parceiroseriedesign.commercesuite.com.br/filtros-e-purificadores-de-agua/purificador-de-agua/com-ultravioleta"
                                    className="l3-item-link"
                                  >
                                    Submenu 1.7
                                  </a>
                                </li>
                              </ul>
                            </li>

                            {/* Filtros de Água */}
                            <li
                              className="sub-item has-child"
                              data-category-id="373"
                            >
                              <a
                                href="https://parceiroseriedesign.commercesuite.com.br/filtros-de-agua"
                                className="l2-item-link"
                              >
                                Submenu 2
                              </a>
                            </li>

                            {/* Osmose e Reversa */}
                            <li
                              className="sub-item has-child"
                              data-category-id="377"
                            >
                              <a
                                href="https://parceiroseriedesign.commercesuite.com.br/osmose-e-reversa"
                                className="l2-item-link"
                              >
                                Submenu 3
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <a href="#">Categoria 2</a>
                  </li>
                  <li>
                    <a href="#">Categoria 3</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

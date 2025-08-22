// Header.jsx
import React from 'react';
import styles from './index.module.css';

export default function Header() {
  const isHome = true; // simula {% if pages.current == 'home' %}
  const isLogged = false; // simula usuário logado
  const cartAmount = 2; // simula {{ cart.amount }}

  return (
    <header className={styles.header}>
      {/* Header Top */}
      <div className={styles.header__top}>
        <div className={`${styles.top__container} component__container`}>
          <div className={`${styles.top__row} component__row`}>
            <div className={styles.top__login}>
              {isLogged ? (
                <a href="#">
                  <span>Olá, João!</span>
                </a>
              ) : (
                <a href="#">
                  <span>Olá, seja bem-vindo(a)!</span>
                </a>
              )}
            </div>

            <div className={styles.top__whatsapp}>
              <a href="#" target="_blank" rel="noopener noreferrer">
                Atendimento ao cliente: (11) 99999-9999
              </a>
            </div>

            <div className={styles.top__social}>
              <ul>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19.9944 8.00381C19.8995 7.65164 19.714 7.33048 19.4564 7.07228C19.1988 6.81408 18.8781 6.62786 18.5261 6.53214C17.2211 6.17381 12.0003 6.16798 12.0003 6.16798C12.0003 6.16798 6.78027 6.16214 5.47444 6.50464C5.12271 6.60476 4.80263 6.79362 4.54491 7.05309C4.2872 7.31255 4.10051 7.63391 4.00277 7.98631C3.65861 9.29131 3.65527 11.998 3.65527 11.998C3.65527 11.998 3.65194 14.718 3.99361 16.0096C4.18527 16.7238 4.74777 17.288 5.46277 17.4805C6.78111 17.8388 11.9878 17.8446 11.9878 17.8446C11.9878 17.8446 17.2086 17.8505 18.5136 17.5088C18.8657 17.4133 19.1867 17.2275 19.445 16.9698C19.7032 16.7121 19.8898 16.3915 19.9861 16.0396C20.3311 14.7355 20.3336 12.0296 20.3336 12.0296C20.3336 12.0296 20.3503 9.30881 19.9944 8.00381ZM10.3303 14.5055L10.3344 9.50548L14.6736 12.0096L10.3303 14.5055Z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clipRule="evenodd"
                        d="M15.3333 4.70312H8.66667C6.36548 4.70312 4.5 6.56861 4.5 8.86979V15.5365C4.5 17.8376 6.36548 19.7031 8.66667 19.7031H15.3333C17.6345 19.7031 19.5 17.8376 19.5 15.5365V8.86979C19.5 6.56861 17.6345 4.70312 15.3333 4.70312ZM18.0417 15.5365C18.0371 17.0303 16.8272 18.2402 15.3333 18.2448H8.66667C7.17279 18.2402 5.96291 17.0303 5.95833 15.5365V8.86979C5.96291 7.37592 7.17279 6.16603 8.66667 6.16146H15.3333C16.8272 6.16603 18.0371 7.37592 18.0417 8.86979V15.5365ZM15.9583 9.07812C16.4186 9.07812 16.7917 8.70502 16.7917 8.24479C16.7917 7.78456 16.4186 7.41146 15.9583 7.41146C15.4981 7.41146 15.125 7.78456 15.125 8.24479C15.125 8.70502 15.4981 9.07812 15.9583 9.07812ZM12 8.45312C9.92893 8.45312 8.25 10.1321 8.25 12.2031C8.25 14.2742 9.92893 15.9531 12 15.9531C14.0711 15.9531 15.75 14.2742 15.75 12.2031C15.7522 11.2079 15.3578 10.2528 14.6541 9.54902C13.9503 8.84528 12.9952 8.45091 12 8.45312ZM9.70833 12.2031C9.70833 13.4688 10.7343 14.4948 12 14.4948C13.2657 14.4948 14.2917 13.4688 14.2917 12.2031C14.2917 10.9375 13.2657 9.91146 12 9.91146C10.7343 9.91146 9.70833 10.9375 9.70833 12.2031Z"
                        fill="white"
                        fillRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.3134 5.53516H18.6135L13.5884 11.183L19.5 18.8685H14.8713L11.2459 14.2073L7.09769 18.8685H4.7962L10.171 12.8275L4.5 5.53516H9.24621L12.5232 9.79567L16.3134 5.53516ZM15.5061 17.5147H16.7807L8.55367 6.81789H7.186L15.5061 17.5147Z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clipRule="evenodd"
                        d="M5.75 4.70312C5.05964 4.70312 4.5 5.26277 4.5 5.95312V18.4531C4.5 19.1435 5.05964 19.7031 5.75 19.7031H18.25C18.9403 19.7031 19.5 19.1435 19.5 18.4531V5.95312C19.5 5.26277 18.9403 4.70312 18.25 4.70312H5.75ZM9.10063 8.03872C9.10532 8.8356 8.50884 9.32662 7.80102 9.3231C7.13422 9.31958 6.55297 8.78872 6.55649 8.0399C6.56001 7.3356 7.11665 6.76958 7.8397 6.78599C8.57329 6.8024 9.10532 7.34029 9.10063 8.03872ZM12.2331 10.3379H10.1331H10.1319V17.4711H12.3514V17.3047C12.3514 16.9881 12.3512 16.6715 12.3509 16.3547C12.3502 15.5099 12.3495 14.6641 12.3538 13.8195C12.355 13.6145 12.3643 13.4012 12.4171 13.2055C12.6151 12.4742 13.2726 12.002 14.0062 12.118C14.4773 12.1918 14.7889 12.4649 14.9202 12.909C15.0011 13.1867 15.0374 13.4855 15.0409 13.775C15.0504 14.648 15.0491 15.521 15.0477 16.3941C15.0472 16.7023 15.0468 17.0106 15.0468 17.3188V17.47H17.2733V17.2989C17.2733 16.9222 17.2732 16.5456 17.2729 16.169C17.2725 15.2278 17.272 14.2865 17.2745 13.345C17.2757 12.9195 17.23 12.5 17.1257 12.0887C16.9698 11.477 16.6476 10.9707 16.1237 10.6051C15.7522 10.345 15.3444 10.1774 14.8886 10.1586C14.8367 10.1565 14.7843 10.1536 14.7317 10.1508C14.4987 10.1382 14.2618 10.1254 14.0389 10.1703C13.4014 10.2981 12.8413 10.5899 12.4182 11.1043C12.3691 11.1633 12.321 11.2232 12.2492 11.3126L12.2331 11.3329V10.3379ZM6.7347 17.4735H8.94368V10.3426H6.7347V17.4735Z"
                        fill="white"
                        fillRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.3333 12.2514C20.3333 7.62095 16.6024 3.86719 12 3.86719C7.39758 3.86719 3.66663 7.62095 3.66663 12.2514C3.66663 16.4362 6.71399 19.9049 10.6979 20.5339V14.675H8.58199V12.2514H10.6979V10.4043C10.6979 8.30299 11.942 7.14229 13.8455 7.14229C14.7573 7.14229 15.7109 7.30605 15.7109 7.30605V9.36936H14.6601C13.625 9.36936 13.302 10.0157 13.302 10.6788V12.2514H15.6132L15.2438 14.675H13.302V20.5339C17.286 19.9049 20.3333 16.4364 20.3333 12.2514Z"
                        fill="white"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Header Middle */}
      <div className={styles.header__middle}>
        <div className={`${styles.middle__container} component__container`}>
          <div className={`${styles.middle__row} component__row`}>
            <div className={styles.middle__tabs}>
              <div className={styles.tabs__inner}>
                <svg
                  fill="none"
                  height="24"
                  width="24"
                  viewBox="0 0 24 24"
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

            <div className={styles.middle__logo}>
              {isHome ? (
                <h1>
                  <a href="#">
                    <img
                      src="https://via.placeholder.com/184x56"
                      alt="Logo"
                      width="184"
                      height="56"
                    />
                  </a>
                </h1>
              ) : (
                <a href="#">
                  <img
                    src="https://via.placeholder.com/184x56"
                    alt="Logo"
                    width="184"
                    height="56"
                  />
                </a>
              )}
            </div>

            <div className={styles.middle__search}>
              <div className={styles.search}>
                <form action="#" method="get" data-search="suggestion">
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
                        stroke="#122161"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M19 19L15 15"
                        stroke="#122161"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>

                  <div>
                    <input
                      className={styles.searchKey}
                      type="text"
                      data-input="suggestion"
                      placeholder="Digite aqui..."
                      name="palavra_busca"
                      data-tray-tst="busca_palavra"
                      required
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className={styles.middle__config}>
              <div className={styles.config__whatsapp}>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Link do número de whatsapp da loja"
                >
                  <svg
                    fill="none"
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.4221 11.9539C4.66368 10.6314 4.29748 9.55158 4.07667 8.45696C3.7501 6.83806 4.49745 5.25665 5.7355 4.24758C6.25876 3.82111 6.85858 3.96682 7.168 4.52192L7.86654 5.77513C8.42023 6.76845 8.69707 7.26511 8.64216 7.79167C8.58726 8.31823 8.2139 8.74708 7.46718 9.6048L5.4221 11.9539ZM5.4221 11.9539C6.95721 14.6306 9.36627 17.041 12.0461 18.5779M12.0461 18.5779C13.3686 19.3363 14.4484 19.7025 15.543 19.9233C17.1619 20.2499 18.7434 19.5025 19.7524 18.2645C20.1789 17.7413 20.0332 17.1414 19.4781 16.832L18.2249 16.1334C17.2315 15.5797 16.7349 15.3029 16.2083 15.3578C15.6818 15.4127 15.2529 15.7861 14.3952 16.5328L12.0461 18.5779Z"
                      stroke="#122161"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 7.62389C15.0674 8.07718 15.9228 8.93258 16.3761 10M14.4905 4C17.1434 4.76557 19.2343 6.85639 20 9.50922"
                      stroke="#122161"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Precisa de ajuda
                  <svg
                    fill="none"
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 10L12 14L16 10"
                      stroke="#0F0F0F"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </a>
              </div>

              <div className={styles.config__login}>
                {isLogged ? (
                  <a href="#" aria-label="Link para a central / minha conta">
                    <svg
                      fill="none"
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.90002 20C7.50002 18.5 9.60002 17.5 12 17.5C14.3 17.5 16.5 18.4 18.1 20"
                        stroke="#122161"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M14.1 9.39806C15.3 10.5981 15.3 12.4981 14.1 13.5981C12.9 14.6981 11 14.7981 9.90002 13.5981C8.80002 12.3981 8.70002 10.4981 9.90002 9.39806C11.1 8.29806 12.9 8.19806 14.1 9.39806"
                        stroke="#122161"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M4 17C3.4 15.8 3 14.4 3 13C3 8 7 4 12 4C17 4 21 8 21 13C21 14.4 20.6 15.8 20 17"
                        stroke="#122161"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Minha Conta
                    <svg
                      fill="none"
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
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
                ) : (
                  <a href="/minha-conta" aria-label="Entre ou Cadastre-se">
                    <svg
                      fill="none"
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.90002 20C7.50002 18.5 9.60002 17.5 12 17.5C14.3 17.5 16.5 18.4 18.1 20"
                        stroke="#122161"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M14.1 9.39806C15.3 10.5981 15.3 12.4981 14.1 13.5981C12.9 14.6981 11 14.7981 9.90002 13.5981C8.80002 12.3981 8.70002 10.4981 9.90002 9.39806C11.1 8.29806 12.9 8.19806 14.1 9.39806"
                        stroke="#122161"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M4 17C3.4 15.8 3 14.4 3 13C3 8 7 4 12 4C17 4 21 8 21 13C21 14.4 20.6 15.8 20 17"
                        stroke="#122161"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Entre ou Cadastre-se
                    <svg
                      fill="none"
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
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
                )}
              </div>

              <div className={styles.config__cart}>
                <div className={styles.cart__wrapper}>
                  <svg
                    fill="none"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.47296 14.9531L4.78053 13.2388C5.14405 11.2126 5.32581 10.1996 6.04559 9.5998C6.76538 9 7.79933 9 9.86723 9H14.1328C16.2007 9 17.2346 9 17.9544 9.5998C18.6742 10.1996 18.8559 11.2126 19.2194 13.2388L19.5271 14.9531C20.0301 17.7568 20.2816 19.1586 19.5071 20.0793C18.7326 21 17.3018 21 14.4403 21H9.55966C6.69815 21 5.2674 21 4.49291 20.0793C3.71842 19.1586 3.96994 17.7568 4.47296 14.9531Z"
                      stroke="#122161"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 9L8.14917 7.32182C8.31607 5.44422 9.99028 4 12 4C14.0097 4 15.6839 5.44422 15.8508 7.32182L16 9"
                      stroke="#122161"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M15 11C14.87 12.1305 13.5657 13 12 13C10.4343 13 9.13002 12.1305 9 11"
                      stroke="#122161"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={styles.cart__title}>Carrinho</span>
                  <span className={styles.cart__number}>{cartAmount}</span>
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
              {isLogged ? (
                <a href="#">Minha Conta</a>
              ) : (
                <a href="#">Entre ou Cadastre-se</a>
              )}
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
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        ></path>
                      </svg>
                    </a>
                    <div className={styles.submenu__wrapper}>
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
}

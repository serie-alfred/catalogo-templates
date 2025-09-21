import React from 'react';
import styles from './index.module.css';

const Header = () => {
  const cartAmount = 0;
  const cartPrice = '0,00';
  const isLoggedIn = false;

  return (
    <header className={styles.header}>
      {/* Topbar Section */}
      <div className={styles.topbar}>
        <div className={`${styles.navbar__content} component__container`}>
          <div className={styles.content__links}>
            <a href="#">Showrooms</a>
            <a href="#">Custom Work</a>
            <a href="#">Gift Cards</a>
          </div>
          <ul className={styles.content__social}>
            <li>
              <a href="#" target="_blank" aria-label="Facebook">
                <svg
                  width="20px"
                  height="20px"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M20,10.1c0-5.5-4.5-10-10-10S0,4.5,0,10.1c0,5,3.7,9.1,8.4,9.9v-7H5.9v-2.9h2.5V7.9C8.4,5.4,9.9,4,12.2,4c1.1,0,2.2,0.2,2.2,0.2v2.5h-1.3c-1.2,0-1.6,0.8-1.6,1.6v1.9h2.8L13.9,13h-2.3v7C16.3,19.2,20,15.1,20,10.1z"></path>
                </svg>
              </a>
            </li>
            <li>
              <a href="#" target="_blank" aria-label="Instagram">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <circle cx="10" cy="10" r="3.3"></circle>
                  <path d="M14.2,0H5.8C2.6,0,0,2.6,0,5.8v8.3C0,17.4,2.6,20,5.8,20h8.3c3.2,0,5.8-2.6,5.8-5.8V5.8C20,2.6,17.4,0,14.2,0zM10,15c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S12.8,15,10,15z M15.8,5C15.4,5,15,4.6,15,4.2s0.4-0.8,0.8-0.8s0.8,0.4,0.8,0.8S16.3,5,15.8,5z"></path>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Middle Section */}
      <div className={styles.header__middle}>
        <div className={styles.middle__container}>
          <div className={styles.middle__row}>
            <div className={styles.middle__tabs}>
              <div className={styles.tabs__inner}>
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

            <div className={styles.middle__logo}>
              <a href="/">
                <img
                  src="/logo.png"
                  alt="Logo da Loja"
                  width="184"
                  height="56"
                  fetchPriority="high"
                />
              </a>
            </div>

            <div className={styles.middle__search}>
              {/* Search Component Placeholder */}
              <input
                type="text"
                placeholder="Buscar..."
                className={styles.search__input}
              />
            </div>

            <div className={styles.middle__config}>
              <div className={styles.nav}>
                <a href="/">Home</a>
                <a href="/">Shop</a>
                <a href="/">About</a>
                <a href="/">News</a>
                <a href="/">Contact Us</a>
              </div>

              <div className={styles.config__login}>
                {isLoggedIn ? (
                  <a href="/account">
                    <svg
                      className={styles.ct_icon}
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 15 15"
                    >
                      <path d="M7.5,0C3.4,0,0,3.4,0,7.5c0,1.7,0.5,3.2,1.5,4.5c1.4,1.9,3.6,3,6,3s4.6-1.1,6-3c1-1.3,1.5-2.9,1.5-4.5C15,3.4,11.6,0,7.5,0zM7.5,13.5c-1.4,0-2.8-0.5-3.8-1.4c1.1-0.9,2.4-1.4,3.8-1.4s2.8,0.5,3.8,1.4C10.3,13,8.9,13.5,7.5,13.5z M12.3,11c-1.3-1.1-3-1.8-4.8-1.8S4,9.9,2.7,11c-0.8-1-1.2-2.2-1.2-3.5c0-3.3,2.7-6,6-6s6,2.7,6,6C13.5,8.8,13.1,10,12.3,11zM7.5,3C6.1,3,5,4.1,5,5.5S6.1,8,7.5,8S10,6.9,10,5.5S8.9,3,7.5,3zM7.5,6.5c-0.5,0-1-0.5-1-1s0.5-1,1-1s1,0.5,1,1S8,6.5,7.5,6.5z"></path>
                    </svg>
                  </a>
                ) : (
                  <a href="/login">
                    <svg
                      className={styles.ct_icon}
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 15 15"
                    >
                      <path d="M7.5,0C3.4,0,0,3.4,0,7.5c0,1.7,0.5,3.2,1.5,4.5c1.4,1.9,3.6,3,6,3s4.6-1.1,6-3c1-1.3,1.5-2.9,1.5-4.5C15,3.4,11.6,0,7.5,0zM7.5,13.5c-1.4,0-2.8-0.5-3.8-1.4c1.1-0.9,2.4-1.4,3.8-1.4s2.8,0.5,3.8,1.4C10.3,13,8.9,13.5,7.5,13.5z M12.3,11c-1.3-1.1-3-1.8-4.8-1.8S4,9.9,2.7,11c-0.8-1-1.2-2.2-1.2-3.5c0-3.3,2.7-6,6-6s6,2.7,6,6C13.5,8.8,13.1,10,12.3,11zM7.5,3C6.1,3,5,4.1,5,5.5S6.1,8,7.5,8S10,6.9,10,5.5S8.9,3,7.5,3zM7.5,6.5c-0.5,0-1-0.5-1-1s0.5-1,1-1s1,0.5,1,1S8,6.5,7.5,6.5z"></path>
                    </svg>
                  </a>
                )}
              </div>

              <div className={styles.config__cart}>
                <div className={styles.cart__wrapper}>
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 15 15"
                  >
                    <path d="M14.1,1.6C14,0.7,13.3,0,12.4,0H2.7C1.7,0,1,0.7,0.9,1.6L0.1,13.1c0,0.5,0.1,1,0.5,1.3C0.9,14.8,1.3,15,1.8,15h11.4c0.5,0,0.9-0.2,1.3-0.6c0.3-0.4,0.5-0.8,0.5-1.3L14.1,1.6zM13.4,13.4c0,0-0.1,0.1-0.2,0.1H1.8c-0.1,0-0.2-0.1-0.2-0.1c0,0-0.1-0.1-0.1-0.2L2.4,1.7c0-0.1,0.1-0.2,0.2-0.2h9.7c0.1,0,0.2,0.1,0.2,0.2l0.8,11.5C13.4,13.3,13.4,13.4,13.4,13.4z M10,3.2C9.6,3.2,9.2,3.6,9.2,4v1.5c0,1-0.8,1.8-1.8,1.8S5.8,6.5,5.8,5.5V4c0-0.4-0.3-0.8-0.8-0.8S4.2,3.6,4.2,4v1.5c0,1.8,1.5,3.2,3.2,3.2s3.2-1.5,3.2-3.2V4C10.8,3.6,10.4,3.2,10,3.2z"></path>
                  </svg>
                  <span className={styles.cart__number}>{cartAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className={styles.header__bottom}>
        <div className={styles.bottom__container}>
          <div className={styles.bottom__row}>
            <div className={styles.bottom__top}>
              <div className={styles.menu__close}>
                <svg
                  fill="none"
                  height="16"
                  viewBox="0 0 16 16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_358_5868)">
                    <path
                      d="M12.5 3.5L3.5 12.5"
                      stroke="black"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12.5 12.5L3.5 3.5"
                      stroke="black"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_358_5868">
                      <rect fill="white" height="16" width="16" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>

            <div className={styles.bottom__login}>
              <div className={styles.login__button}>
                {isLoggedIn ? (
                  <a href="/account">
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
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
                  </a>
                ) : (
                  <a href="/login">
                    <svg
                      fill="none"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
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
                  </a>
                )}
              </div>
            </div>

            <div className={styles.bottom__menu}>
              <nav>
                {/* Menu items aqui */}
                <a href="/">Categorias</a>
                <a href="/">Ofertas</a>
                <a href="/">Lançamentos</a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Preview */}
      <div className={styles.header__cart}>
        <div className={styles.cart__preview__mask}></div>
        <div className={styles.cart__preview}>
          <div className={styles.preview__title}>
            Carrinho
            <div className={styles.preview__close}>
              <svg
                fill="none"
                height="16"
                viewBox="0 0 16 16"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_358_5868)">
                  <path
                    d="M12.5 3.5L3.5 12.5"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12.5 12.5L3.5 3.5"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_358_5868">
                    <rect fill="white" height="16" width="16" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>

          <p className={styles.empty}>Carrinho vazio!</p>

          <div className={styles.preview_items}></div>

          <div className={styles.preview__total}>
            <div className={styles.total}>
              <span>
                Total{' '}
                <strong>
                  R$ <span>{cartPrice}</span>
                </strong>
              </span>
            </div>

            <div className={styles.finish}>
              <a href="/cart" className={styles.btn_checkout}>
                Comprar
              </a>
            </div>

            <div className={styles.keep__buy}>
              <span>Continuar as compras</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

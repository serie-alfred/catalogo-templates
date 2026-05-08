import styles from './index.module.css';

const Header = () => {
  // Dados fixos para substituir as variáveis Twig
  const storeInfo = {
    name: 'logo',
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
      {/* Header Top */}
      <div className={styles.headerTop}>
        <div className={`${styles.topContainer} component__container`}>
          <div className={styles.topRow}>
            <div className={styles.topLogin}>
              <div className={styles.notLogged}>
                <a href="/central">
                  <svg
                    fill="none"
                    height="18"
                    viewBox="0 0 20 18"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.9 17C5.5 15.5 7.6 14.5 10 14.5C12.3 14.5 14.5 15.4 16.1 17"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12.1 6.39806C13.3 7.59806 13.3 9.49806 12.1 10.5981C10.9 11.6981 9 11.7981 7.9 10.5981C6.8 9.39806 6.7 7.49806 7.9 6.39806C9.1 5.29806 10.9 5.19806 12.1 6.39806"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M2 14C1.4 12.8 1 11.4 1 10C1 5 5 1 10 1C15 1 19 5 19 10C19 11.4 18.6 12.8 18 14"
                      stroke="white"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                  Olá, seja bem-vindo(a)!
                </a>
              </div>
            </div>

            <div className={styles.topWhatsapp}>
              <a
                href={`https://api.whatsapp.com/send?phone=55${storeInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Link do número de whatsapp da loja"
              >
                Atendimento ao cliente:{' '}
                {storeInfo.whatsapp.replace(
                  /(\d{2})(\d{2})(\d{5})(\d{4})/,
                  '($1) $2 $3-$4'
                )}
              </a>
            </div>

            <div className={styles.topSocial}>
              <ul>
                <li>
                  <a
                    href={storeInfo.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Link para a página do youtube da loja"
                  >
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
                  <a
                    href={storeInfo.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Link para a página do instagram da loja"
                  >
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
                  <a
                    href={storeInfo.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Link para a página do twitter da loja"
                  >
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
                  <a
                    href={storeInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Link para a página do linkedin da loja"
                  >
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
                  <a
                    href={storeInfo.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Link para a página do facebook da loja"
                  >
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

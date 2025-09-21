import styles from './index.module.css';

const Footer = () => {
  // Dados fixos para substituir as variáveis Twig
  const storeInfo = {
    name: 'Paulibrás',
    logo: '/logo.png', // Substitua pelo caminho real do logo
    textFooter: '© 2023 Paulibrás. Todos os direitos reservados.',
    social: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
      youtube: '#',
    },
  };

  // Páginas institucionais fixas
  const institutionalPages = [
    { name: 'Sobre Nós', url: '#' },
    { name: 'Contato', url: '#' },
    { name: 'Trocas e Devoluções', url: '#' },
    { name: 'Cookie Policy', url: '#' },
    { name: 'Privacy Policy', url: '#' },
    { name: 'Site Map', url: '#' },
    { name: 'Terms & Conditions', url: '#' },
  ];

  // Métodos de pagamento (imagens)
  const paymentMethods = [
    {
      name: 'Visa',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/visa.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
    },
    {
      name: 'Mastercard',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/mastercard.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
    },
    {
      name: 'Diners Club',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/dinersclub.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
    },
    {
      name: 'American Express',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/americanexpress.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
    },
    {
      name: 'Elo',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/hipercard.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
    },
    {
      name: 'Hipercard',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/elo.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
    },
    {
      name: 'Aura',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/aura.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
    },
    {
      name: 'Boleto',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/boleto.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
    },
    {
      name: 'Pix',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/pix.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
    },
  ];

  // Selos de segurança
  const securitySeals = [
    {
      name: 'Yourviews',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/Yourviews.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
      link: '#',
    },
    {
      name: 'Google Reviews',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/Google Reviews.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
      link: '#',
    },
    {
      name: 'Clear Sale',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/Clear Sale.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
      link: '#',
    },
    {
      name: "Let's Encrypt",
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/Let`s Encrypt.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
      link: '#',
    },
  ];

  return (
    <>
      <footer className={styles.footer}>
        {/* Footer Top */}
        <div className={styles.footerTop}>
          <div className={`component__container ${styles.topContainer}`}>
            <div className={styles.topRow}>
              <div className={styles.footerLeft}>
                <div className={styles.middleLogo}>
                  <a href="/" data-tray-tst="logotipo_loja">
                    <img
                      src={storeInfo.logo}
                      alt="Logo"
                      width="200"
                      height="40"
                      loading="lazy"
                    />
                  </a>
                </div>

                {/* Newsletter */}
                <div className={styles.footerNewsletter}>
                  <div className={styles.newsletterContainer}>
                    <div className={styles.newsletterRow}>
                      <div className={styles.newsletter}>
                        <div className={styles.newsletterTitle}>
                          <span>
                            Lorem ipsum dolor sit amet consectetur. Quisque
                            massa vel quis.
                          </span>
                        </div>

                        <div className={styles.newsletterForm}>
                          <form
                            action="https://paulibrasexpress.us22.list-manage.com/subscribe/post?u=e3420099959e896421f6775cd&id=602a..."
                            method="post"
                            target="_blank"
                          >
                            <input
                              className={styles.formItem}
                              type="email"
                              name="EMAIL"
                              required
                              placeholder="empresa@email.com.br"
                            />

                            <div className={styles.optionalParent}>
                              <div className={styles.mcEmbeddedSubscribe}>
                                <input
                                  className={styles.inputButton}
                                  type="submit"
                                  name="subscribe"
                                  value="Enviar"
                                />
                                <svg
                                  width="12"
                                  height="10"
                                  viewBox="0 0 12 10"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M10.6666 5.00008H1.33325"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                  <path
                                    d="M7.33325 8.33333L10.6666 5"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                  <path
                                    d="M7.33325 1.66675L10.6666 5.00008"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.footerRight}>
                <div className={styles.topMenu}>
                  <span className={styles.menuTitle}>Institucional</span>
                  <ul className={styles.institucionalMenu}>
                    {institutionalPages.map((page, index) => (
                      <li key={index}>
                        <a href={page.url}>{page.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.topMenu}>
                  <span className={styles.menuTitle}>Redes Sociais</span>
                  <ul className={styles.menuSocial}>
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
                          viewBox="0 0 25 24"
                          width="25"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.8334 12.2514C20.8334 7.62095 17.1024 3.86719 12.5 3.86719C7.89765 3.86719 4.16669 7.62095 4.16669 12.2514C4.16669 16.4362 7.21405 19.9049 11.1979 20.5339V14.675H9.08205V12.2514H11.1979V10.4043C11.1979 8.30299 12.4421 7.14229 14.3455 7.14229C15.2574 7.14229 16.2109 7.30605 16.2109 7.30605V9.36936H15.1602C14.125 9.36936 13.8021 10.0157 13.8021 10.6788V12.2514H16.1133L15.7439 14.675H13.8021V20.5339C17.786 19.9049 20.8334 16.4364 20.8334 12.2514Z"
                            fill="#fff"
                          />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href={storeInfo.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Link para a página do X da loja"
                      >
                        <svg
                          fill="none"
                          height="24"
                          viewBox="0 0 25 24"
                          width="25"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.8134 5.53516H19.1135L14.0884 11.183L20 18.8685H15.3713L11.7459 14.2073L7.59769 18.8685H5.2962L10.671 12.8275L5 5.53516H9.74621L13.0232 9.79567L16.8134 5.53516ZM16.0061 17.5147H17.2807L9.05367 6.81789H7.686L16.0061 17.5147Z"
                            fill="#fff"
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
                          viewBox="0 0 25 24"
                          width="25"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            clipRule="evenodd"
                            d="M15.8333 4.70312H9.16667C6.86548 4.70312 5 6.56861 5 8.86979V15.5365C5 17.8376 6.86548 19.7031 9.16667 19.7031H15.8333C18.1345 19.7031 20 17.8376 20 15.5365V8.86979C20 6.56861 18.1345 4.70312 15.8333 4.70312ZM18.5417 15.5365C18.5371 17.0303 17.3272 18.2402 15.8333 18.2448H9.16667C7.67279 18.2402 6.46291 17.0303 6.45833 15.5365V8.86979C6.46291 7.37592 7.67279 6.16603 9.16667 6.16146H15.8333C17.3272 6.16603 18.5371 7.37592 18.5417 8.86979V15.5365ZM16.4583 9.07812C16.9186 9.07812 17.2917 8.70502 17.2917 8.24479C17.2917 7.78456 16.9186 7.41146 16.4583 7.41146C15.9981 7.41146 15.625 7.78456 15.625 8.24479C15.625 8.70502 15.9981 9.07812 16.4583 9.07812ZM12.5 8.45312C10.4289 8.45312 8.75 10.1321 8.75 12.2031C8.75 14.2742 10.4289 15.9531 12.5 15.9531C14.5711 15.9531 16.25 14.2742 16.25 12.2031C16.2522 11.2079 15.8578 10.2528 15.1541 9.54902C14.4503 8.84528 13.4952 8.45091 12.5 8.45312ZM10.2083 12.2031C10.2083 13.4688 11.2343 14.4948 12.5 14.4948C13.7657 14.4948 14.7917 13.4688 14.7917 12.2031C14.7917 10.9375 13.7657 9.91146 12.5 9.91146C11.2343 9.91146 10.2083 10.9375 10.2083 12.2031Z"
                            fill="#fff"
                            fillRule="evenodd"
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
                          viewBox="0 0 25 24"
                          width="25"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            clipRule="evenodd"
                            d="M6.25 4.70312C5.55964 4.70312 5 5.26277 5 5.95312V18.4531C5 19.1435 5.55964 19.7031 6.25 19.7031H18.75C19.4403 19.7031 20 19.1435 20 18.4531V5.95312C20 5.26277 19.4403 4.70312 18.75 4.70312H6.25ZM9.60063 8.03872C9.60532 8.8356 9.00884 9.32662 8.30102 9.3231C7.63422 9.31958 7.05297 8.78872 7.05649 8.0399C7.06001 7.3356 7.61665 6.76958 8.3397 6.78599C9.07329 6.8024 9.60532 7.34029 9.60063 8.03872ZM12.7331 10.3379H10.6331H10.6319V17.4711H12.8514V17.3047C12.8514 16.9881 12.8512 16.6715 12.8509 16.3547C12.8502 15.5099 12.8495 14.6641 12.8538 13.8195C12.855 13.6145 12.8643 13.4012 12.9171 13.2055C13.1151 12.4742 13.7726 12.002 14.5062 12.118C14.9773 12.1918 15.2889 12.4649 15.4202 12.909C15.5011 13.1867 15.5374 13.4855 15.5409 13.775C15.5504 14.648 15.5491 15.521 15.5477 16.3941C15.5472 16.7023 15.5468 17.0106 15.5468 17.3188V17.47H17.7733V17.2989C17.7733 16.9222 17.7732 16.5456 17.7729 16.169C17.7725 15.2278 17.772 14.2865 17.7745 13.345C17.7757 12.9195 17.73 12.5 17.6257 12.0887C17.4698 11.477 17.1476 10.9707 16.6237 10.6051C16.2522 10.345 15.8444 10.1774 15.3886 10.1586C15.3367 10.1565 15.2843 10.1536 15.2317 10.1508C14.9987 10.1382 14.7618 10.1254 14.5389 10.1703C13.9014 10.2981 13.3413 10.5899 12.9182 11.1043C12.8691 11.1633 12.821 11.2232 12.7492 11.3126L12.7331 11.3329V10.3379ZM7.2347 17.4735H9.44368V10.3426H7.2347V17.4735Z"
                            fill="#fff"
                            fillRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
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
                          viewBox="0 0 25 24"
                          width="25"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.4944 8.00381C20.3995 7.65164 20.214 7.33048 19.9564 7.07228C19.6988 6.81408 19.3781 6.62786 19.0261 6.53214C17.7211 6.17381 12.5003 6.16798 12.5003 6.16798C12.5003 6.16798 7.28027 6.16214 5.97444 6.50464C5.62271 6.60476 5.30263 6.79362 5.04491 7.05309C4.7872 7.31255 4.60051 7.63391 4.50277 7.98631C4.15861 9.29131 4.15527 11.998 4.15527 11.998C4.15527 11.998 4.15194 14.718 4.49361 16.0096C4.68527 16.7238 5.24777 17.288 5.96277 17.4805C7.28111 17.8388 12.4878 17.8446 12.4878 17.8446C12.4878 17.8446 17.7086 17.8505 19.0136 17.5088C19.3657 17.4133 19.6867 17.2275 19.945 16.9698C20.2032 16.7121 20.3898 16.3915 20.4861 16.0396C20.8311 14.7355 20.8336 12.0296 20.8336 12.0296C20.8336 12.0296 20.8503 9.30881 20.4944 8.00381ZM10.8303 14.5055L10.8344 9.50548L15.1736 12.0096L10.8303 14.5055Z"
                            fill="#fff"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Middle */}
        <div className={styles.footerMiddle}>
          <div className={` component__container ${styles.middleContainer}`}>
            <div className={styles.topMenu}>
              <span className={styles.menuTitle}>Pagamento</span>
              <ul className={styles.menuPayment}>
                {paymentMethods.map((method, index) => (
                  <li key={index}>
                    <img
                      src={method.image}
                      alt={`Bandeira de pagamento ${method.name}`}
                      loading="lazy"
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.topMenu}>
              <span className={styles.menuTitle}>Segurança</span>
              <ul className={styles.menuSeals}>
                {securitySeals.map((seal, index) => (
                  <li key={index}>
                    <a
                      href={seal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={seal.image}
                        alt={`Selo de segurança ${seal.name}`}
                        loading="lazy"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.topMenu}>
              <span className={styles.menuTitle}>Desenvolvido por:</span>
              <div className={styles.footerDev}>
                <a
                  href="https://seriedesign.com.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Link para a página da agência Seri.e Design"
                >
                  <svg
                    width="49"
                    height="18"
                    viewBox="0 0 49 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 8.56516H3.1352C3.16548 9.18632 3.396 9.65181 3.82681 9.96168C4.28784 10.2723 4.90236 10.4272 5.67105 10.4272C6.22435 10.4272 6.7005 10.3188 7.10032 10.1013C7.46915 9.88456 7.65361 9.58928 7.65361 9.21684C7.65361 8.65821 7.00811 8.23927 5.71716 7.95997C5.16386 7.86687 4.74893 7.77378 4.47231 7.68068C2.84275 7.27772 1.75209 6.7962 1.1988 6.23761C0.583574 5.67897 0.276673 4.93419 0.276673 4.00316C0.276673 2.82413 0.721885 1.84655 1.61373 1.07043C2.53585 0.356887 3.7346 -0.000244141 5.20997 -0.000244141C6.80782 -0.000244141 8.08366 0.356887 9.03677 1.07043C9.92791 1.8465 10.4041 2.85537 10.466 4.09626H8.48348C7.89925 4.09626 7.45332 3.83295 7.14642 3.30488C7.02323 3.18121 6.90008 3.05682 6.77759 2.93249C6.40876 2.6532 5.90157 2.51355 5.25612 2.51355C4.6409 2.51355 4.17986 2.60665 3.87296 2.79284C3.59634 2.97904 3.45803 3.25833 3.45803 3.63077C3.45803 4.12755 4.25696 4.54649 5.85552 4.88764C6.03993 4.95017 6.20137 4.99672 6.33958 5.02729C6.47799 5.05858 6.60834 5.07384 6.73154 5.07384C8.29912 5.47752 9.38983 5.94301 10.0051 6.47036C10.5886 7.02899 10.8811 7.77378 10.8811 8.70481C10.8811 10.0708 10.389 11.1254 9.4057 11.8703C8.48358 12.5533 7.10042 12.8944 5.25617 12.8944C3.50413 12.8944 2.19735 12.538 1.33716 11.8237C0.445212 11.1102 0 10.0708 0 8.70481V8.56516Z"
                      fill="white"
                    />
                    <path
                      d="M20.1526 8.84445H22.4579C22.1193 10.1479 21.4739 11.1414 20.5215 11.8237C19.5684 12.538 18.3696 12.8944 16.9252 12.8944C15.1732 12.8944 13.8052 12.3205 12.8218 11.172C11.8378 10.0548 11.3464 8.45675 11.3464 6.37726C11.3464 4.39153 11.8226 2.83939 12.7757 1.72217C13.759 0.574371 15.1271 -0.000244141 16.8791 -0.000244141C18.7234 -0.000244141 20.1526 0.558394 21.167 1.67562C22.1503 2.82413 22.6423 4.4221 22.6423 6.47036C22.6423 6.59474 22.6423 6.7031 22.6423 6.7962C22.6423 6.8893 22.6423 6.95182 22.6423 6.98239C22.6423 7.13802 22.6265 7.24643 22.5962 7.30824H14.6199C14.6502 8.27055 14.8807 8.9841 15.3116 9.44959C15.7107 9.94636 16.3101 10.1944 17.1097 10.1944C17.632 10.1944 18.0779 10.0861 18.4468 9.86858C18.539 9.83801 18.6232 9.78352 18.7003 9.70568C18.7767 9.62856 18.8617 9.54274 18.9539 9.44959C18.9842 9.35649 19.0994 9.23282 19.2998 9.0772C19.4992 8.92229 19.7838 8.84445 20.1526 8.84445ZM14.6199 5.21349H19.3227C19.2608 4.37556 19.0461 3.75511 18.6772 3.35143C18.2774 2.91718 17.709 2.69969 16.9713 2.69969C16.2948 2.69969 15.7416 2.91718 15.3115 3.35143C14.8807 3.78635 14.6502 4.40679 14.6199 5.21349Z"
                      fill="white"
                    />
                    <path
                      d="M23.3887 12.6616V6.65656C23.3887 5.44624 23.5651 4.43015 23.9188 3.60743C24.2718 2.78557 24.756 2.12585 25.3712 1.62902C25.9548 1.16353 26.6392 0.822379 27.4229 0.604895C28.2068 0.388128 29.0138 0.279053 29.8435 0.279053C29.9047 0.279053 29.9817 0.279053 30.0741 0.279053C30.1662 0.279053 30.2426 0.279053 30.3047 0.279053V3.58418H29.244C28.3522 3.58418 27.6917 3.80166 27.2616 4.23591C26.8308 4.67088 26.6161 5.35314 26.6161 6.28417V12.6617H23.3887V12.6616Z"
                      fill="white"
                    />
                    <path
                      d="M31.4561 0.279053H33.1159C33.5459 0.279053 33.9148 0.434676 34.2224 0.744541C34.5293 1.05512 34.6835 1.42751 34.6835 1.86177V12.6616H31.4561V0.279053Z"
                      fill="white"
                    />
                    <path
                      d="M37.2614 12.7329C38.2765 12.7329 39.0995 11.902 39.0995 10.8771C39.0995 9.85211 38.2765 9.02124 37.2614 9.02124C36.2463 9.02124 35.4233 9.85211 35.4233 10.8771C35.4233 11.902 36.2463 12.7329 37.2614 12.7329Z"
                      fill="#EE8A1E"
                    />
                    <path
                      d="M46.0394 1.67557C45.0252 0.558343 43.5959 -0.000244141 41.7517 -0.000244141C39.9996 -0.000244141 38.6317 0.574371 37.6484 1.72217C36.6952 2.83939 36.219 4.39158 36.219 6.37726C36.219 7.20602 36.2984 7.95695 36.4545 8.63281C36.7489 8.49961 37.0742 8.42387 37.4176 8.42387C38.7205 8.42387 39.7768 9.4903 39.7768 10.8059C39.7768 11.3963 39.5628 11.9355 39.2105 12.3516C39.9519 12.7135 40.8143 12.8945 41.7977 12.8945C43.2422 12.8945 44.441 12.538 45.3941 11.8238C46.3464 11.1415 46.9918 10.1479 47.3304 8.8445H45.0253C44.6565 8.8445 44.3719 8.92234 44.1723 9.07725C43.972 9.23287 43.8567 9.35654 43.8264 9.44964C43.7343 9.54274 43.6493 9.62862 43.5729 9.70574C43.4958 9.78357 43.4115 9.83806 43.3193 9.86863C42.9505 10.0861 42.5046 10.1945 41.9822 10.1945C41.1825 10.1945 40.5832 9.94642 40.1841 9.44964C39.7533 8.98415 39.5227 8.27061 39.4926 7.30829H47.4688C47.4991 7.24648 47.5148 7.13807 47.5148 6.98245C47.5148 6.95187 47.5148 6.88935 47.5148 6.79625C47.5148 6.70315 47.5148 6.59474 47.5148 6.47041C47.5148 4.4221 47.0229 2.82408 46.0394 1.67557ZM39.4926 5.21349C39.5227 4.40684 39.7533 3.7864 40.1841 3.35143C40.6141 2.91718 41.1673 2.69969 41.8439 2.69969C42.5816 2.69969 43.15 2.91718 43.5499 3.35143C43.9187 3.75511 44.1333 4.37556 44.1952 5.21349H39.4926Z"
                      fill="white"
                    />
                    <path
                      d="M37.9155 14.2447V15.9735C37.9155 16.6894 37.5454 17.0449 36.8097 17.0405C36.0784 17.027 35.7129 16.6263 35.7129 15.834C35.7129 15.0236 36.025 14.6094 36.6537 14.5869C36.948 14.5869 37.1753 14.7084 37.327 14.9561V13.9431H37.6212C37.7818 13.9432 37.9155 14.0828 37.9155 14.2447ZM36.3238 15.8069C36.3192 16.2886 36.4798 16.5318 36.8187 16.5318C37.1576 16.5318 37.327 16.2887 37.327 15.8069C37.3136 15.3478 37.1487 15.1227 36.8276 15.1227C36.5066 15.1227 36.3416 15.3478 36.3238 15.8069Z"
                      fill="white"
                    />
                    <path
                      d="M39.2774 17.059C38.5639 17.0365 38.2073 16.6178 38.2073 15.8074C38.2073 14.9971 38.5685 14.5919 39.2864 14.5874C40.0354 14.5874 40.3877 15.0511 40.3431 15.983H38.8181C38.8404 16.3477 38.9965 16.5323 39.2864 16.5323C39.4246 16.5323 39.554 16.4737 39.6698 16.3612C39.7232 16.3026 39.7902 16.2757 39.8705 16.2757H40.3074C40.178 16.7798 39.8571 17.059 39.2774 17.059ZM38.827 15.5553H39.7143C39.6787 15.2402 39.5316 15.078 39.2774 15.078C39.0232 15.0781 38.8716 15.2402 38.827 15.5553Z"
                      fill="white"
                    />
                    <path
                      d="M41.6948 16.5728C41.9445 16.5728 42.0693 16.5008 42.0693 16.3477C42.0693 16.2261 41.8643 16.1271 41.4585 16.055C40.9369 15.9605 40.6693 15.7264 40.6647 15.3528C40.6647 14.8395 41.066 14.5964 41.6056 14.5874C41.9089 14.5874 42.1496 14.6549 42.328 14.79C42.5018 14.9296 42.5956 15.1231 42.6088 15.3707H42.2343C42.0961 15.3662 42.0069 15.3167 41.9713 15.2222C41.931 15.1187 41.8107 15.0602 41.6144 15.0602C41.3826 15.0602 41.2666 15.1231 41.2666 15.2447C41.2666 15.3663 41.4183 15.4608 41.726 15.5193C42.1273 15.6004 42.3904 15.7039 42.5197 15.8255C42.6311 15.9425 42.6846 16.0866 42.6846 16.2487C42.6846 16.8339 42.2298 17.05 41.6055 17.05C41.2756 17.05 41.0259 16.978 40.8653 16.8384C40.687 16.7034 40.5979 16.4962 40.5979 16.2216H41.2042C41.2177 16.4827 41.4049 16.5728 41.6948 16.5728Z"
                      fill="white"
                    />
                    <path
                      d="M43.2962 13.9431C43.4925 13.9431 43.5861 14.0421 43.5816 14.2357V14.4113H42.9885V13.9431H43.2962ZM43.2962 14.6229C43.4879 14.6229 43.5816 14.7174 43.5816 14.911V17.0045H42.9885V14.6229H43.2962V14.6229Z"
                      fill="white"
                    />
                    <path
                      d="M43.9285 15.8164C43.9285 15.024 44.2941 14.6278 45.0253 14.6143C45.761 14.6098 46.1311 14.9609 46.1311 15.6768V17.0859C46.1311 17.6847 45.7566 17.9862 45.003 17.9998C44.468 17.9998 44.1291 17.7477 43.9909 17.2434H44.6463C44.6864 17.4145 44.8246 17.4956 45.0699 17.4956C45.382 17.4956 45.5425 17.311 45.5425 16.9418C45.5425 16.9418 45.5425 16.9463 45.5425 16.6987C45.3908 16.9328 45.1635 17.0499 44.8693 17.0499C44.2405 17.0499 43.9285 16.6357 43.9285 15.8164ZM45.5426 15.8343C45.547 15.3527 45.382 15.114 45.0432 15.114C44.7043 15.114 44.5394 15.3527 44.5394 15.8343C44.5528 16.2935 44.7132 16.5232 45.0343 16.5232C45.3554 16.5232 45.5248 16.2935 45.5426 15.8343Z"
                      fill="white"
                    />
                    <path
                      d="M48.1603 17.005C47.964 16.9915 47.866 16.8969 47.866 16.7079V15.4833C47.8525 15.2358 47.7187 15.1141 47.4556 15.1141C47.1925 15.1141 47.0588 15.2358 47.0543 15.4833V17.005H46.4524V15.6048C46.4524 14.9251 46.7913 14.5874 47.4645 14.5874C48.1379 14.5874 48.468 14.9251 48.4634 15.6048V17.005H48.1603Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={`${styles.bottomContainer} component__container`}>
            <div className={styles.bottomRow}>
              <div className={styles.footerCopyright}>
                <span>
                  TRAY TECNOLOGIA EM ECOMMERCE LTDA - CNPJ: 08.844.842/0001-31
                  © Todos os direitos reservados. Os preços exibidos nessa loja
                  são fictícios e servem apenas para demonstração Tecnologia
                  TrayCommerce
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;

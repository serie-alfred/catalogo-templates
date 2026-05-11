import styles from './index.module.css';
import { useLayout } from '@/context/LayoutContext';

const Footer = () => {
  const { logo } = useLayout();
  // Dados fixos para substituir as variáveis Twig
  const storeInfo = {
    name: 'Paulibrás',
    logo: logo || '/logo.png', // Substitua pelo caminho real do logo
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
                    width="auto"
                    height="25"
                    viewBox="0 0 1888 566"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M661.36 164.71H781.21C799.3 164.71 814.98 166.59 828.25 170.36C841.52 174.13 852.52 179.58 861.27 186.72C870.01 193.86 876.52 202.55 880.79 212.81C885.06 223.06 887.2 234.67 887.2 247.64C887.2 256.39 886.14 264.7 884.03 272.59C881.92 280.48 878.68 287.74 874.31 294.38C869.94 301.01 864.43 306.92 857.8 312.1C851.17 317.28 843.38 321.58 834.43 324.99L885.69 400.38H827.2L782.88 333.43H781.52L709.16 333.28V400.38H661.37V164.71H661.36ZM782.42 291.97C791.47 291.97 799.38 290.91 806.17 288.8C812.95 286.69 818.63 283.73 823.21 279.9C827.78 276.08 831.2 271.43 833.46 265.95C835.72 260.47 836.85 254.37 836.85 247.63C836.85 234.46 832.33 224.28 823.28 217.1C814.23 209.91 800.61 206.32 782.42 206.32H709.15V291.96H782.42V291.97Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M911.24 164.83H959.33V400.43H911.24V164.83Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M433.36 164.55H637.32V206.5H481.18V253.57H616.65V292.95H481.18V358.58H637.32V400.37H433.36V164.54V164.55Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M983.37 164.81H1187.33V206.71H1031.19V253.73H1166.66V293.07H1031.19V358.63H1187.33V400.38H983.37V164.82V164.81Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M490.72 126.32L573.08 103.93L581.38 134.24L498.07 152.96L490.72 126.32Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M490.72 126.32L573.08 103.93L581.38 134.24L498.07 152.96L490.72 126.32Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M409.31 334.27C409.31 357.3 398.61 375.41 377.52 388.13C357.4 400.27 328.86 406.39 292.68 406.39C214.16 406.39 171.39 380.26 165.62 328.61L164.92 322.21H217.3L218.31 326.71C221.1 339.16 228.12 348.11 239.75 354.16C251.96 360.52 269.88 363.74 293.03 363.74C314.16 363.74 330.45 360.91 341.42 355.25C351.42 350.13 356.08 343.46 356.08 334.27C356.08 326.71 353.09 321.2 346.62 316.9C339.37 312.05 327.27 308.53 310.6 306.32L268.18 300.35C234.14 295.77 210.33 288.21 195.4 277.28C179.89 265.92 172.02 249.44 172.02 228.27C172.02 207.1 182.88 188.84 204.24 176.58C224.6 164.91 252.98 158.98 288.65 158.98C321.1 158.98 346.74 164.02 364.8 174.02C383.37 184.26 396.21 200.77 402.95 223.15L403.96 227.37C404.41 229.27 404.77 231.19 405.03 233.12L405.62 237.46L354.95 236.8L353.21 232.81C348.29 221.61 341.19 213.85 331.5 209.08C321.54 204.12 307 201.64 288.31 201.64C267.06 201.64 250.58 204.24 239.3 209.32C229.37 213.78 224.57 219.67 224.57 227.35C224.57 235.03 227.4 240.38 233.53 244.14C240.63 248.52 253.85 252.2 272.89 255L320.62 261.59C350.24 265.7 372.5 273.57 386.81 284.97C401.74 296.87 409.34 313.47 409.34 334.29L409.31 334.27Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M1557.65 164.83H1608.31L1722.31 400.32H1672.1L1653.25 360.7H1515.59L1497.34 400.32H1446.98L1557.65 164.83ZM1634.4 321.37L1583.44 214.4L1533.83 321.37H1634.4Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M1557.65 164.83H1608.31L1722.31 400.32H1672.1L1653.25 360.7H1515.59L1497.34 400.32H1446.98L1557.65 164.83ZM1634.4 321.37L1583.44 214.4L1533.83 321.37H1634.4Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M1496.92 164.83L1386.23 400.38H1332L1442.41 164.83H1496.92Z"
                      fill="#97D700"
                    ></path>
                    <path
                      d="M1496.92 164.83L1386.23 400.38H1332L1442.41 164.83H1496.92Z"
                      fill="#97D700"
                    ></path>
                    <path
                      d="M1382.29 164.83L1271.6 400.4H1217.37L1327.78 164.83H1382.29Z"
                      fill="#E63888"
                    ></path>
                    <path
                      d="M1382.29 164.83L1271.6 400.4H1217.37L1327.78 164.83H1382.29Z"
                      fill="#E63888"
                    ></path>
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

import styles from './index.module.css';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useLogoDoRodape } from '@/hooks/useLogoDoRodape';

/** Crédito padrão da agência (bloco "Desenvolvido por: SÉRIE//A"). Conteúdo fixo, fora do CMS. */
const Credit = () => (
  <a
    className={styles.credit}
    href="https://seriea.com.br/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Desenvolvido por SÉRIE//A (abre em nova aba)"
  >
    <span>Desenvolvido por:</span>
    <svg
      className={styles.creditLogo}
      viewBox="6.5 3.9 67 13.9"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
    <path fill="currentColor" d="M28.0374 6.99414H33.1182C33.8851 6.99414 34.5498 7.07397 35.1124 7.23407C35.675 7.39416 36.1413 7.6256 36.5122 7.9288C36.8828 8.232 37.1587 8.60102 37.3398 9.03671C37.5208 9.47198 37.6115 9.965 37.6115 10.5158C37.6115 10.8873 37.5666 11.2402 37.4771 11.5753C37.3877 11.9103 37.2503 12.2186 37.0651 12.5006C36.8798 12.7821 36.6462 13.0331 36.3651 13.2531C36.0841 13.473 35.7538 13.6556 35.3744 13.8004L37.5475 17.0019H35.0679L33.189 14.1589H33.1314L30.0638 14.1525V17.0019H28.0378V6.99414H28.0374ZM33.1695 12.3982C33.5532 12.3982 33.8885 12.3532 34.1764 12.2636C34.4638 12.174 34.7046 12.0483 34.8987 11.8857C35.0925 11.7235 35.2375 11.526 35.3333 11.2933C35.4291 11.0606 35.477 10.8016 35.477 10.5153C35.477 9.95608 35.2854 9.52379 34.9017 9.21889C34.5181 8.91356 33.9407 8.76111 33.1695 8.76111H30.0633V12.3978H33.1695V12.3982Z" />
    <path fill="currentColor" d="M38.6307 7H40.6694V17.0048H38.6307V7Z" />
    <path fill="currentColor" d="M18.3717 6.98773H27.0183V8.76914H20.399V10.768H26.142V12.4402H20.399V15.2272H27.0183V17.0018H18.3717V6.9873V6.98773Z" />
    <path fill="currentColor" d="M41.6885 6.99902H50.3351V8.77831H43.7157V10.775H49.4588V12.4456H43.7157V15.2296H50.3351V17.0025H41.6885V6.99945V6.99902Z" />
    <path fill="currentColor" d="M20.8033 5.36388L24.2949 4.41309L24.6467 5.7002L21.1149 6.49515L20.8033 5.36388Z" />
    <path fill="currentColor" d="M17.3521 14.1947C17.3521 15.1727 16.8985 15.9417 16.0044 16.4819C15.1515 16.9974 13.9416 17.2573 12.4078 17.2573C9.07903 17.2573 7.26586 16.1477 7.02125 13.9543L6.99158 13.6826H9.21215L9.25497 13.8736C9.37325 14.4023 9.67085 14.7824 10.1639 15.0393C10.6815 15.3094 11.4412 15.4461 12.4226 15.4461C13.3184 15.4461 14.009 15.326 14.474 15.0856C14.898 14.8682 15.0955 14.5849 15.0955 14.1947C15.0955 13.8736 14.9688 13.6397 14.6945 13.4571C14.3871 13.2511 13.8742 13.1016 13.1675 13.0078L11.3691 12.7543C9.92606 12.5598 8.91667 12.2387 8.28373 11.7746C7.62621 11.2922 7.29257 10.5924 7.29257 9.69338C7.29257 8.7944 7.75297 8.01898 8.65849 7.49836C9.52162 7.00279 10.7248 6.75098 12.2369 6.75098C13.6126 6.75098 14.6996 6.965 15.4652 7.38965C16.2524 7.82449 16.7968 8.52559 17.0825 9.47596L17.1253 9.65516C17.1444 9.73585 17.1597 9.81738 17.1707 9.89934L17.1957 10.0836L15.0476 10.0556L14.9739 9.88618C14.7653 9.41057 14.4643 9.08104 14.0535 8.87848C13.6313 8.66785 13.0149 8.56254 12.2225 8.56254C11.3217 8.56254 10.623 8.67295 10.1448 8.88867C9.72384 9.07806 9.52035 9.32818 9.52035 9.65432C9.52035 9.98045 9.64033 10.2076 9.9002 10.3673C10.2012 10.5533 10.7616 10.7096 11.5688 10.8285L13.5923 11.1083C14.8479 11.2829 15.7916 11.6171 16.3983 12.1012C17.0312 12.6065 17.3534 13.3114 17.3534 14.1955L17.3521 14.1947Z" />
    <path fill="currentColor" d="M66.0343 7H68.182L73.0149 17.0001H70.8863L70.0872 15.3176H64.2513L63.4776 17.0001H61.3427L66.0343 7ZM69.2881 13.6475L67.1277 9.10499L65.0245 13.6475H69.2881Z" />
    <path fill="#97D700" d="M63.4597 7L58.7671 17.0027H56.4681L61.1488 7H63.4597Z" />
    <path fill="#E63888" d="M58.6002 7L53.9076 17.0035H51.6086L56.2893 7H58.6002Z" />
    </svg>
  </a>
)

/** Ícone de cada rede do schema (`socials[].network`); `x` é o antigo Twitter. */
const ICONE_REDE: Record<string, React.ReactNode> = {
  facebook: (
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
  ),
  x: (
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
  ),
  instagram: (
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
  ),
  linkedin: (
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
  ),
  youtube: (
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
  ),
};

const ROTULO_REDE: Record<string, string> = {
  facebook: 'facebook',
  x: 'X',
  instagram: 'instagram',
  linkedin: 'linkedin',
  youtube: 'youtube',
};

/** O conteúdo da seção: os campos do `section.schema` do Footer02 que a réplica desenha. */
interface Footer02Conteudo {
  logo?: string;
  logoAlt?: string;
  brandName?: string;
  newsletterTitle?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
  institutionalTitle?: string;
  institutionalLinks: { label?: string; url?: string }[];
  socialTitle?: string;
  socials: { network?: string; url?: string }[];
  paymentTitle?: string;
  payments: { name?: string; image?: string }[];
  sealsTitle?: string;
  seals: { name?: string; image?: string; url?: string }[];
  copyright?: string;
}

const MOCK: Footer02Conteudo = {
  logoAlt: 'Logo',
  newsletterTitle:
    'Lorem ipsum dolor sit amet consectetur. Quisque massa vel quis.',
  emailPlaceholder: 'empresa@email.com.br',
  buttonLabel: 'Enviar',
  institutionalTitle: 'Institucional',
  institutionalLinks: [
    { label: 'Sobre Nós', url: '#' },
    { label: 'Contato', url: '#' },
    { label: 'Trocas e Devoluções', url: '#' },
    { label: 'Cookie Policy', url: '#' },
    { label: 'Privacy Policy', url: '#' },
    { label: 'Site Map', url: '#' },
    { label: 'Terms & Conditions', url: '#' },
  ],
  socialTitle: 'Redes Sociais',
  socials: [
    { network: 'facebook', url: '#' },
    { network: 'x', url: '#' },
    { network: 'instagram', url: '#' },
    { network: 'linkedin', url: '#' },
    { network: 'youtube', url: '#' },
  ],
  paymentTitle: 'Pagamento',
  payments: [
    {
      name: 'Visa',
      image:
        'https://images.tcdn.com.br/files/426932/themes/253/img/payment-visa.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
    },
    {
      name: 'Mastercard',
      image:
        'https://images.tcdn.com.br/files/426932/themes/253/img/payment-mastercard.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
    },
    {
      name: 'Diners Club',
      image:
        'https://images.tcdn.com.br/files/426932/themes/253/img/payment-diners.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
    },
    {
      name: 'American Express',
      image:
        'https://images.tcdn.com.br/files/426932/themes/253/img/payment-american-express.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
    },
    {
      name: 'Elo',
      image:
        'https://images.tcdn.com.br/files/426932/themes/253/img/payment-elo.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
    },
    {
      name: 'Hiper',
      image:
        'https://images.tcdn.com.br/files/426932/themes/253/img/payment-hiper.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
    },
    {
      name: 'Boleto',
      image:
        'https://images.tcdn.com.br/files/426932/themes/253/img/payment-boleto.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
    },
    {
      name: 'Itaú',
      image:
        'https://images.tcdn.com.br/files/426932/themes/253/img/payment-itau.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
    },
    {
      name: 'Bradesco',
      image:
        'https://images.tcdn.com.br/files/426932/themes/253/img/payment-bradesco.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
    },
    {
      name: 'Banco do Brasil',
      image:
        'https://images.tcdn.com.br/files/426932/themes/253/img/payment-banco-do-brasil.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
    },
    {
      name: 'Caixa',
      image:
        'https://images.tcdn.com.br/files/426932/themes/253/img/payment-caixa.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
    },
  ],
  sealsTitle: 'Segurança',
  seals: [
    {
      name: 'Yourviews',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/Yourviews.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
      url: '#',
    },
    {
      name: 'Google Reviews',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/Google Reviews.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
      url: '#',
    },
    {
      name: 'Clear Sale',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/Clear Sale.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
      url: '#',
    },
    {
      name: 'Let\'s Encrypt',
      image:
        'https://images.tcdn.com.br/files/426932/themes/273/img/Let`s Encrypt.png?12972c5ad93a8bec3b7d26c01525438b1756996464',
      url: '#',
    },
  ],
  copyright:
    '© 2026 [RAZÃO SOCIAL] · CNPJ [00.000.000/0001-00] · [Endereço completo]',
};

const Footer = () => {
  const logoDoRodape = useLogoDoRodape();
  const {
    logo,
    logoAlt,
    brandName,
    newsletterTitle,
    emailPlaceholder,
    buttonLabel,
    institutionalTitle,
    institutionalLinks,
    socialTitle,
    socials,
    paymentTitle,
    payments,
    sealsTitle,
    seals,
    copyright,
  } = useConteudoDaSecao(MOCK);
  // O logo do CS vale mais; sem ele, o que o usuário enviou no /gerador.
  const logoFinal = logo || logoDoRodape;

  return (
    <>
      <footer className={styles.footer} data-role="ft-root">
        {/* Footer Top */}
        <div className={styles.footerTop}>
          <div className={`component__container ${styles.topContainer}`}>
            <div className={styles.topRow}>
              <div className={styles.footerLeft}>
                <div className={styles.middleLogo}>
                  <a href="/" data-tray-tst="logotipo_loja" data-role="ft-logo">
                    {logoFinal ? (
                      <img
                        src={logoFinal}
                        alt={logoAlt || 'Logo'}
                        width="200"
                        height="40"
                        loading="lazy"
                      />
                    ) : (
                      <span className={styles.logoFallback}>{brandName || 'SERIE//A'}</span>
                    )}
                  </a>
                </div>

                {/* Newsletter */}
                <div className={styles.footerNewsletter}>
                  <div className={styles.newsletterContainer}>
                    <div className={styles.newsletterRow}>
                      <div className={styles.newsletter}>
                        {newsletterTitle && (
                          <div className={styles.newsletterTitle} data-role="ft-nl-title">
                            <span>{newsletterTitle}</span>
                          </div>
                        )}

                        <div className={styles.newsletterForm}>
                          <form
                            action="https://paulibrasexpress.us22.list-manage.com/subscribe/post?u=e3420099959e896421f6775cd&id=602a..."
                            method="post"
                            target="_blank"
                          >
                            <input
                              className={styles.formItem}
                              data-role="ft-nl-input"
                              type="email"
                              name="EMAIL"
                              required
                              placeholder={emailPlaceholder}
                            />

                            <div className={styles.optionalParent}>
                              <div className={styles.mcEmbeddedSubscribe}>
                                <input
                                  className={styles.inputButton}
                                  data-role="ft-nl-button"
                                  type="submit"
                                  name="subscribe"
                                  value={buttonLabel}
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
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                  <path
                                    d="M7.33325 8.33333L10.6666 5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>
                                  <path
                                    d="M7.33325 1.66675L10.6666 5.00008"
                                    stroke="currentColor"
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
                  {institutionalTitle && (
                    <span className={styles.menuTitle} data-role="ft-heading">{institutionalTitle}</span>
                  )}
                  <ul className={styles.institucionalMenu}>
                    {institutionalLinks.map((page, index) => (
                      <li key={index}>
                        <a href={page.url || '#'} data-role="ft-link">{page.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.topMenu}>
                  {socialTitle && (
                    <span className={styles.menuTitle} data-role="ft-heading">{socialTitle}</span>
                  )}
                  <ul className={styles.menuSocial}>
                    {socials
                      .filter(s => s.network && ICONE_REDE[s.network])
                      .map((s, index) => (
                        <li key={index}>
                          <a
                            href={s.url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-role="ft-social"
                            aria-label={`Link para a página do ${ROTULO_REDE[s.network ?? '']} da loja`}
                          >
                            {ICONE_REDE[s.network ?? '']}
                          </a>
                        </li>
                      ))}
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
              {paymentTitle && (
                <span className={styles.menuTitle} data-role="ft-heading">{paymentTitle}</span>
              )}
              <ul className={styles.menuPayment}>
                {payments.map((method, index) => (
                  <li key={index} data-role="ft-payment">
                    <img
                      src={method.image}
                      alt={`Bandeira de pagamento ${method.name ?? ''}`}
                      loading="lazy"
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.topMenu}>
              {sealsTitle && (
                <span className={styles.menuTitle} data-role="ft-heading">{sealsTitle}</span>
              )}
              <ul className={styles.menuSeals}>
                {seals.map((seal, index) => (
                  <li key={index} data-role="ft-seal">
                    <a
                      href={seal.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={seal.image}
                        alt={`Selo de segurança ${seal.name ?? ''}`}
                        loading="lazy"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={`${styles.bottomContainer} component__container`}>
            <div className={styles.bottomRow}>
              {copyright && (
                <div className={styles.footerCopyright}>
                  <span data-role="ft-legal">{copyright}</span>
                </div>
              )}
              <div className={styles.footerCredit}>
                <Credit />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Footer.conteudoPadrao = MOCK;

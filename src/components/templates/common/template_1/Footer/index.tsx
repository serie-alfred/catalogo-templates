import React from 'react';
import styles from './index.module.css';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import Newsletter from '../Newsletter';

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

/** O conteúdo da seção: os campos do `section.schema` do Footer01 que a réplica desenha. */
interface Footer01Conteudo {
  institucionalTitle?: string;
  institucionalMenu: { name?: string; url?: string }[];
  atendimentoTitle?: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  redesSociaisTitle?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  pagamentoTitle?: string;
  paymentMethods: { src?: string; alt?: string }[];
  segurancaTitle?: string;
  securitySeals: { src?: string; alt?: string; link?: string }[];
  copyright?: string;
}

const MOCK: Footer01Conteudo = {
  institucionalTitle: 'Institucional',
  institucionalMenu: [
    { url: '/sobre', name: 'Sobre nós' },
    { url: '/politica', name: 'Política de Privacidade' },
    { url: '/termos', name: 'Termos de Uso' },
  ],
  atendimentoTitle: 'Atendimento',
  whatsapp: '[(00) 00000-0000]',
  phone: '[(00) 0000-0000]',
  email: '[e-mail de atendimento]',
  redesSociaisTitle: 'Redes Sociais',
  socialFacebook: 'https://facebook.com/loja',
  socialTwitter: 'https://twitter.com/loja',
  pagamentoTitle: 'Pagamento',
  paymentMethods: [
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/payment-visa.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
      alt: 'Bandeira de pagamento Visa',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/payment-mastercard.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
      alt: 'Bandeira de pagamento Mastercard',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/payment-diners.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
      alt: 'Bandeira de pagamento Diners Club',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/payment-american-express.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
      alt: 'Bandeira de pagamento American Express',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/payment-elo.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
      alt: 'Bandeira de pagamento Elo',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/payment-hipercard.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
      alt: 'Bandeira de pagamento Hipercard',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/payment-hiper.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
      alt: 'Bandeira de pagamento Hiper',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/payment-boleto.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
      alt: 'Bandeira de pagamento Boleto',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/payment-itau.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
      alt: 'Bandeira de pagamento Itaú',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/payment-bradesco.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
      alt: 'Bandeira de pagamento Bradesco',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/payment-banco-do-brasil.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
      alt: 'Bandeira de pagamento Banco do Brasil',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/payment-caixa.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260',
      alt: 'Bandeira de pagamento Caixa',
    },
  ],
  segurancaTitle: 'Segurança',
  securitySeals: [
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/Yourviews.png?12972c5ad93a8bec3b7d26c01525438b1756923221',
      alt: 'Selo de segurança do google safe',
      link: '#',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/Let`s Encrypt.png?12972c5ad93a8bec3b7d26c01525438b1756923221',
      alt: 'Selo de segurança do google safe',
      link: '#',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/Clear Sale.png?12972c5ad93a8bec3b7d26c01525438b1756923221',
      alt: 'Selo de segurança do google safe',
      link: '#',
    },
    {
      src: 'https://images.tcdn.com.br/files/426932/themes/253/img/Google%20Reviews.png?12972c5ad93a8bec3b7d26c01525438b1756923221',
      alt: 'Selo de segurança do google safe',
      link: '#',
    },
  ],
  copyright:
    '[RAZÃO SOCIAL] - CNPJ: [00.000.000/0001-00] © Todos os direitos reservados. Os preços exibidos nesta prévia são fictícios e servem apenas para demonstração.',
};

/** Só dígitos de um contato; sem eles (marcador de exemplo) o link fica vazio. */
const digitos = (v?: string) => (v ?? '').replace(/D/g, '');

export default function Footer() {
  const {
    institucionalTitle,
    institucionalMenu,
    atendimentoTitle,
    whatsapp,
    phone,
    email,
    redesSociaisTitle,
    socialFacebook,
    socialTwitter,
    pagamentoTitle,
    paymentMethods,
    segurancaTitle,
    securitySeals,
    copyright,
  } = useConteudoDaSecao(MOCK);

  return (
    <div className={styles.footer__main}>
      <Newsletter />
      <footer className={styles.footer}>
        <div className={styles.footer__top}>
          <div className={`${styles.top__component} component__container`}>
            <div className={`${styles.top__row} component__row`}>
              {/* Institucional */}
              <div className={styles.top__menu}>
                {institucionalTitle && (
                  <span className={styles.menu__title}>{institucionalTitle}</span>
                )}
                <ul className={styles.institucionalMenu}>
                  {institucionalMenu.map((custom, i) => (
                    <li key={i}>
                      <a href={custom.url || '#'}>{custom.name}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Atendimento */}
              <div className={`${styles.top__menu} ${styles.menu__contact}`}>
                <div className={styles.menu__contatoSelos}>
                  {atendimentoTitle && (
                    <span className={styles.menu__title}>{atendimentoTitle}</span>
                  )}
                  <ul className={styles.menu__contactList}>
                    {whatsapp && (
                      <li>
                        <a
                          href={
                            digitos(whatsapp)
                              ? `https://api.whatsapp.com/send?phone=55${digitos(whatsapp)}`
                              : '#'
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {whatsapp}
                        </a>
                      </li>
                    )}
                    {phone && (
                      <li>
                        <a
                          href={digitos(phone) ? `tel:55${digitos(phone)}` : '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {phone}
                        </a>
                      </li>
                    )}
                    {email && (
                      <li>
                        <a
                          href={`mailto:${email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {email}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Redes sociais */}
              <div className={`${styles.top__menu} ${styles.menu__contact}`}>
                {redesSociaisTitle && (
                  <span className={styles.menu__title}>{redesSociaisTitle}</span>
                )}
                <ul className={styles.menu__social}>
                  {socialFacebook && (
                    <li>
                      <a
                        href={socialFacebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* Facebook SVG */}
                        <svg
                          fill="none"
                          height="24"
                          viewBox="0 0 25 24"
                          width="25"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.8334 12.2514C20.8334 7.62095 17.1024 3.86719 12.5 3.86719C7.89765 3.86719 4.16669 7.62095 4.16669 12.2514C4.16669 16.4362 7.21405 19.9049 11.1979 20.5339V14.675H9.08205V12.2514H11.1979V10.4043C11.1979 8.30299 12.4421 7.14229 14.3455 7.14229C15.2574 7.14229 16.2109 7.30605 16.2109 7.30605V9.36936H15.1602C14.125 9.36936 13.8021 10.0157 13.8021 10.6788V12.2514H16.1133L15.7439 14.675H13.8021V20.5339C17.786 19.9049 20.8334 16.4364 20.8334 12.2514Z"
                            fill="currentColor"
                          />
                        </svg>
                        Facebook
                      </a>
                    </li>
                  )}

                  {socialTwitter && (
                    <li>
                      <a
                        href={socialTwitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* Twitter SVG */}
                        <svg
                          fill="none"
                          height="24"
                          viewBox="0 0 25 24"
                          width="25"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.8134 5.53516H19.1135L14.0884 11.183L20 18.8685H15.3713L11.7459 14.2073L7.59769 18.8685H5.2962L10.671 12.8275L5 5.53516H9.74621L13.0232 9.79567L16.8134 5.53516ZM16.0061 17.5147H17.2807L9.05367 6.81789H7.686L16.0061 17.5147Z"
                            fill="currentColor"
                          />
                        </svg>
                        X / Twitter
                      </a>
                    </li>
                  )}
                  {/* Aqui segue a mesma lógica pros demais: Instagram, LinkedIn, Youtube */}
                </ul>
              </div>

              {/* Pagamento */}
              <div className={styles.top__menu}>
                {pagamentoTitle && (
                  <span className={styles.menu__title}>{pagamentoTitle}</span>
                )}
                <ul className={styles.menu__payment}>
                  {paymentMethods.map((p, i) => (
                    <li key={i}>
                      <img
                        className=""
                        src={p.src}
                        data-src={p.src}
                        alt={p.alt ?? ''}
                        width="45"
                        height="36"
                        loading="lazy"
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Segurança */}
              <div className={styles.top__menu}>
                {segurancaTitle && (
                  <span className={styles.menu__title}>{segurancaTitle}</span>
                )}
                <ul className={styles.menu__seals}>
                  {securitySeals.map((s, i) => (
                    <li key={i}>
                      <a href={s.link || '#'} target="_blank" rel="noopener noreferrer">
                        <img src={s.src} alt={s.alt ?? ''} loading="lazy" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className={styles.footer__bottom}>
          <div className={`${styles.bottom__container} component__container`}>
            <div className={`${styles.bottom__row} component__row`}>
              {copyright && (
                <div className={styles.footer__copyright}>
                  <span>{copyright}</span>
                </div>
              )}

              <div className={styles.footer__dev}>
                <Credit />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Footer.conteudoPadrao = MOCK;

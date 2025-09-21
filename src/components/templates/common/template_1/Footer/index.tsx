import React from 'react';
import styles from './index.module.css';

export default function Footer() {
  // Simulação dos dados que antes vinham do backend
  const institucionalMenu = [
    { url: '/sobre', name: 'Sobre nós' },
    { url: '/politica', name: 'Política de Privacidade' },
    { url: '/termos', name: 'Termos de Uso' },
  ];

  const settings = {
    whatsapp_number: '(11) 99999-9999',
    telephone_number: '(11) 4002-8922',
    email_contact: 'contato@loja.com',
    social_facebook: 'https://facebook.com/loja',
    social_twitter: 'https://twitter.com/loja',
    social_instagram: 'https://instagram.com/loja',
    social_linkedin: 'https://linkedin.com/company/loja',
    social_youtube: 'https://youtube.com/loja',
    text_footer:
      'TRAY TECNOLOGIA EM ECOMMERCE LTDA - CNPJ: 08.844.842/0001-31 © Todos os direitos reservados. Os preços exibidos nessa loja são fictícios e servem apenas para demonstração Tecnologia TrayCommerce',
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footer__top}>
        <div className={`${styles.top__component} component__container`}>
          <div className={`${styles.top__row} component__row`}>
            {/* Institucional */}
            <div className={styles.top__menu}>
              <span className={styles.menu__title}>Institucional</span>
              <ul className={styles.institucionalMenu}>
                {institucionalMenu.map((custom, i) => (
                  <li key={i}>
                    <a href={custom.url}>{custom.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Atendimento */}
            <div className={`${styles.top__menu} ${styles.menu__contact}`}>
              <div className={styles.menu__contatoSelos}>
                <span className={styles.menu__title}>Atendimento</span>
                <ul className={styles.menu__contactList}>
                  <li>
                    <a
                      href={`https://api.whatsapp.com/send?phone=55${settings.whatsapp_number.replace(
                        /\D/g,
                        ''
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {settings.whatsapp_number}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`tel:55${settings.telephone_number.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {settings.telephone_number}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${settings.email_contact}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {settings.email_contact}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Redes sociais */}
            <div className={`${styles.top__menu} ${styles.menu__contact}`}>
              <span className={styles.menu__title}>Redes Sociais</span>
              <ul className={styles.menu__social}>
                {settings.social_facebook && (
                  <li>
                    <a
                      href={settings.social_facebook}
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
                          fill="#E60F73"
                        />
                      </svg>
                      Facebook
                    </a>
                  </li>
                )}

                {settings.social_twitter && (
                  <li>
                    <a
                      href={settings.social_twitter}
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
                          fill="#E60F73"
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
              <span className={styles.menu__title}>Pagamento</span>
              <ul className={styles.menu__payment}>
                <li>
                  <img
                    className=""
                    src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-visa.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    data-src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-visa.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    alt="Bandeira de pagamento Visa"
                    width="45"
                    height="36"
                    loading="lazy"
                  />
                </li>
                <li>
                  <img
                    className=""
                    src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-mastercard.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    data-src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-mastercard.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    alt="Bandeira de pagamento Mastercard"
                    width="45"
                    height="36"
                    loading="lazy"
                  />
                </li>
                <li>
                  <img
                    className=""
                    src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-diners.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    data-src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-diners.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    alt="Bandeira de pagamento Diners Club"
                    width="45"
                    height="36"
                    loading="lazy"
                  />
                </li>
                <li>
                  <img
                    className=""
                    src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-american-express.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    data-src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-american-express.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    alt="Bandeira de pagamento American Express"
                    width="45"
                    height="36"
                    loading="lazy"
                  />
                </li>
                <li>
                  <img
                    className=""
                    src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-elo.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    data-src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-elo.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    alt="Bandeira de pagamento Elo"
                    width="45"
                    height="36"
                    loading="lazy"
                  />
                </li>
                <li>
                  <img
                    className=""
                    src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-hipercard.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    data-src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-hipercard.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    alt="Bandeira de pagamento Hipercard"
                    width="45"
                    height="36"
                    loading="lazy"
                  />
                </li>
                <li>
                  <img
                    className=""
                    src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-hiper.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    data-src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-hiper.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    alt="Bandeira de pagamento Hiper"
                    width="45"
                    height="36"
                    loading="lazy"
                  />
                </li>
                <li>
                  <img
                    className=""
                    src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-boleto.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    data-src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-boleto.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    alt="Bandeira de pagamento Boleto"
                    width="45"
                    height="36"
                    loading="lazy"
                  />
                </li>
                <li>
                  <img
                    className=""
                    src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-itau.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    data-src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-itau.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    alt="Bandeira de pagamento Itaú"
                    width="45"
                    height="36"
                    loading="lazy"
                  />
                </li>
                <li>
                  <img
                    className=""
                    src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-bradesco.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    data-src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-bradesco.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    alt="Bandeira de pagamento Bradesco"
                    width="45"
                    height="36"
                    loading="lazy"
                  />
                </li>
                <li>
                  <img
                    className=""
                    src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-banco-do-brasil.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    data-src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-banco-do-brasil.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    alt="Bandeira de pagamento Banco do Brasil"
                    width="45"
                    height="36"
                    loading="lazy"
                  />
                </li>
                <li>
                  <img
                    className=""
                    src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-caixa.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    data-src="https://images.tcdn.com.br/files/426932/themes/253/img/payment-caixa.png?aa1b84b001bf453fcc6e2f6c5b6638fd1755872260"
                    alt="Bandeira de pagamento Caixa"
                    width="45"
                    height="36"
                    loading="lazy"
                  />
                </li>
              </ul>
            </div>

            {/* Segurança */}
            <div className={styles.top__menu}>
              <span className={styles.menu__title}>Segurança</span>
              <ul className={styles.menu__seals}>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferer">
                    <img
                      src="https://images.tcdn.com.br/files/426932/themes/253/img/Yourviews.png?12972c5ad93a8bec3b7d26c01525438b1756923221"
                      alt="Selo de segurança do google safe"
                      loading="lazy"
                    />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferer">
                    <img
                      src="https://images.tcdn.com.br/files/426932/themes/253/img/Let`s Encrypt.png?12972c5ad93a8bec3b7d26c01525438b1756923221"
                      alt="Selo de segurança do google safe"
                      loading="lazy"
                    />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferer">
                    <img
                      src="https://images.tcdn.com.br/files/426932/themes/253/img/Clear Sale.png?12972c5ad93a8bec3b7d26c01525438b1756923221"
                      alt="Selo de segurança do google safe"
                      loading="lazy"
                    />
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferer">
                    <img
                      src="https://images.tcdn.com.br/files/426932/themes/253/img/Google%20Reviews.png?12972c5ad93a8bec3b7d26c01525438b1756923221"
                      alt="Selo de segurança do google safe"
                      loading="lazy"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <div className={styles.footer__bottom}>
        <div className={`${styles.bottom__container} component__container`}>
          <div className={`${styles.bottom__row} component__row`}>
            {settings.text_footer && (
              <div className={styles.footer__copyright}>
                <span>{settings.text_footer}</span>
              </div>
            )}

            <div className={styles.footer__dev}>
              <a
                href="https://seriedesign.com.br/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Logo SVG da agência */}
                <svg
                  fill="none"
                  height="25"
                  viewBox="0 0 67 25"
                  width="67"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 11.8002H4.31922C4.36093 12.6559..."
                    fill="#231F20"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

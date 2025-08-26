// Header.jsx
import React from 'react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={`${styles.topContainer} component__container`}>
          <div className={`${styles.topRow} component__row`}>
            <div className={styles.topLogin}>
              {/* Simulando usuário logado */}
              <a href="/minha-conta">
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
                Olá, João
              </a>
            </div>

            <div className={styles.topWhatsapp}>
              <a
                href="https://api.whatsapp.com/send?phone=5511999999999"
                target="_blank"
                rel="noopener noreferrer"
              >
                Atendimento ao cliente: (11) 99999-9999
              </a>
            </div>

            <div className={styles.topSocial}>
              <ul>
                <li>
                  <a
                    href="https://youtube.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* --- MEIO --- */}
      <div className={styles.headerMiddle}>
        <div className={`${styles.middleContainer} component__container`}>
          <div className={styles.middleRow}>
            {/* MENU MOBILE */}
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

            {/* LOGO */}
            <div className={styles.middleLogo}>
              <a href="/">
                <img
                  src="/logo.png"
                  alt="Logo da Loja"
                  width="184"
                  height="56"
                />
              </a>
            </div>

            {/* BUSCA */}
            <div className={styles.middleSearch}>
              <input
                type="text"
                placeholder="Buscar produtos..."
                className={styles.searchInput}
              />
            </div>

            {/* CONFIGURAÇÕES */}
            <div className={styles.middleConfig}>
              <div className={styles.configWhatsapp}>
                <a
                  href="https://api.whatsapp.com/send?phone=5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contato
                </a>
              </div>

              <div className={styles.configLogin}>
                <a href="/minha-conta">Minha Conta</a>
              </div>

              <div className={styles.configCart}>
                <span className={styles.cartTitle}>Carrinho</span>
                <span className={styles.cartNumber}>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MENU INFERIOR --- */}
      <div className={styles.headerBottom}>
        <div className={`${styles.bottomContainer} component__container`}>
          <div className={`${styles.bottomRow} component__row`}>
            <div className={styles.bottomMenu}>
              <nav>
                <ul>
                  <li>
                    <a href="/">Home</a>
                  </li>
                  <li>
                    <a href="/categorias">Categorias</a>
                  </li>
                  <li>
                    <a href="/contato">Contato</a>
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

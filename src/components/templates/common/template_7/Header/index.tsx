import styles from './index.module.css';

const HeaderNovo = () => {
  // const storeInfo = {
  //   name: 'Paulibrás',
  //   logo: '/logo.png',
  //   whatsapp: '5511999999999',
  //   social: {
  //     youtube: 'https://youtube.com/paulibras',
  //     instagram: 'https://instagram.com/paulibras',
  //     twitter: 'https://twitter.com/paulibras',
  //     linkedin: 'https://linkedin.com/company/paulibras',
  //     facebook: 'https://facebook.com/paulibras',
  //   },
  // };

  return (
    <header className={styles.siteHeader} role="banner">
      {/* */}
      <div className={`${styles.topbar}`} aria-label="Avisos da loja">
        <div className={styles.topbarTrack}>
          <span className={styles.topbarItem}>
            Frete grátis acima de R$&nbsp;350
          </span>
          <span className={styles.topbarItem}>
            Trocas fáceis em até 30 dias
          </span>
          <span className={styles.topbarItem}>Pagamento seguro</span>
          <span className={styles.topbarItem}>Novos drops toda semana</span>
          <span className={styles.topbarItem}>
            Frete grátis acima de R$&nbsp;350
          </span>
          <span className={styles.topbarItem}>
            Trocas fáceis em até 30 dias
          </span>
          <span className={styles.topbarItem}>Pagamento seguro</span>
          <span className={styles.topbarItem}>Novos drops toda semana</span>
        </div>
      </div>

      {/* */}
      <div className={styles.headerMain}>
        <a href="#" className={styles.logo} aria-label="BRAND — página inicial">
          BRAND<span className={styles.logoDot}>.</span>
        </a>

        <form className={styles.search} role="search">
          <input
            id="search-input"
            className={styles.searchInput}
            type="search"
            placeholder="Buscar produtos, coleções, drops…"
            aria-label="Buscar produtos"
          />
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7"></circle>
            <path d="m20 20-3.5-3.5"></path>
          </svg>
        </form>

        <div className={styles.headerActions}>
          <a href="#" className={styles.action} aria-label="Minha conta">
            <svg
              className={styles.actionIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4"></circle>
              <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"></path>
            </svg>
            <span className={styles.actionLabel}>Entrar</span>
          </a>

          <a href="#" className={styles.action} aria-label="Wishlist">
            <svg
              className={styles.actionIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path
                d="M12 20.5s-7.5-4.5-9.5-9C1 8.5 2.5 5 6 5c2 0 3.5 1.2 4 2.5C10.5 6.2 12 5 14 5c3.5 0 5 3.5 3.5 6.5-2 4.5-9.5 9-9.5 9"
                transform="translate(2 0)"
              ></path>
            </svg>
          </a>

          <a href="#" className={styles.action} aria-label="Sacola (2 itens)">
            <svg
              className={styles.actionIcon}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 8h14l-1.2 11.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8L5 8Z"></path>
              <path d="M9 8V6.5a3 3 0 1 1 6 0V8"></path>
            </svg>
            <span className={styles.cartCount} aria-hidden="true">
              2
            </span>
          </a>
        </div>
      </div>

      {/* */}
      <nav className={styles.nav} aria-label="Categorias">
        <ul className={styles.navList}>
          <li>
            <a className={styles.navLink} href="#">
              Novidades
            </a>
          </li>
          <li>
            <a className={styles.navLink} aria-current="page" href="#">
              Camisetas
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="#">
              Moletons
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="#">
              Calças
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="#">
              Jaquetas
            </a>
          </li>
          <li>
            <a className={styles.navLink} href="#">
              Acessórios
            </a>
          </li>
          <li>
            <a className={`${styles.navLink} ${styles.navLinkSale}`} href="#">
              <span className={styles.navSaleDot} aria-hidden="true"></span>Sale
            </a>
          </li>
        </ul>
      </nav>

      {/* */}
      <div className={styles.headerMobile} id="mobile-header">
        <div className={styles.headerMobileLeft}>
          <button
            type="button"
            className={styles.iconBtn}
            id="open-menu"
            aria-label="Abrir menu"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 7h16"></path>
              <path d="M4 17h16"></path>
            </svg>
          </button>
        </div>

        <a href="#" className={styles.logo} aria-label="BRAND — página inicial">
          BRAND<span className={styles.logoDot}>.</span>
        </a>

        <div className={styles.headerMobileRight}>
          <button
            type="button"
            className={styles.iconBtn}
            id="open-search"
            aria-label="Buscar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7"></circle>
              <path d="m20 20-3.5-3.5"></path>
            </svg>
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Wishlist"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path
                d="M12 20.5s-7.5-4.5-9.5-9C1 8.5 2.5 5 6 5c2 0 3.5 1.2 4 2.5C10.5 6.2 12 5 14 5c3.5 0 5 3.5 3.5 6.5-2 4.5-9.5 9-9.5 9"
                transform="translate(2 0)"
              ></path>
            </svg>
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Sacola (2 itens)"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 8h14l-1.2 11.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8L5 8Z"></path>
              <path d="M9 8V6.5a3 3 0 1 1 6 0V8"></path>
            </svg>
            <span className={styles.cartCount} aria-hidden="true">
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderNovo;

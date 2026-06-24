import React from 'react';

import styles from './index.module.css';
import { useLayout } from '@/context/LayoutContext';

// Preview estático do Header04 (MANU) — dados fixos, sem VTEX/GraphQL/hooks.
// Origem: faststore.starter/src/components/organisms/Header04 (gerado via /from-faststore).
// Renderiza só o "chrome" visível (pre-header + header + benefit strip); mega menu,
// busca, drawers e mini-cart (interativos) são omitidos no card.

const data = {
  announcementMessages: [
    'Frete grátis para todo o Brasil · Pedidos acima de R$ 349',
    'Entrega em até 3 dias úteis · Embalagem exclusiva de presente',
    'Alfaiataria sob medida disponível · Agende sua consulta',
  ],
  brandName: 'MANU',
  brandTagline: 'EST. 2018',
  navItems: [
    { label: 'Coleções', url: '#', hasMega: true },
    { label: 'Ternos & Blazers', url: '#', hasMega: true },
    { label: 'Camisas', url: '#', hasMega: true },
    { label: 'Acessórios', url: '#' },
    { label: 'Editorial', url: '#' },
  ],
  benefitStripItems: [
    'Frete grátis acima de R$ 349',
    'Troca gratuita em 30 dias',
    'Pix com 5% de desconto',
    'Embalagem exclusiva de presente',
  ],
};

const SearchIcon = () => (
  <svg className={`${styles.icon} ${styles.headerIcon}`} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="5.75" />
    <path d="M15 15l4.4 4.4" />
  </svg>
);

const AccountIcon = () => (
  <svg className={`${styles.icon} ${styles.headerIcon}`} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8.2" r="3.35" />
    <path d="M5.8 20.2c.9-3.9 3.1-5.85 6.2-5.85s5.3 1.95 6.2 5.85" />
  </svg>
);

const CartIcon = () => (
  <svg className={`${styles.icon} ${styles.headerIcon}`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.6 8.25h10.8l-.72 11.25H7.32L6.6 8.25Z" />
    <path d="M9.2 8.25V7.1a2.8 2.8 0 0 1 5.6 0v1.15" />
  </svg>
);

const BenefitIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 9h8v6H2z" />
    <path d="M10 11h4l2 2v2h-6z" />
  </svg>
);

export default function Header04() {
  const { logo } = useLayout();

  return (
    <div className={styles.header04Root}>
      {/* Pre-header (estático: 1ª mensagem) */}
      <div className={styles.preHeader}>
        <div className={styles.preHeaderInner}>
          <div className={styles.preHeaderControls}>
            <span className={styles.iconBtn} aria-hidden="true">
              &lsaquo;
            </span>
            <span className={styles.iconBtn} aria-hidden="true">
              &rsaquo;
            </span>
          </div>
          <p className={styles.preHeaderMessage}>{data.announcementMessages[0]}</p>
          <span className={styles.preHeaderClose} aria-hidden="true">
            &times;
          </span>
        </div>
      </div>

      {/* Header bar */}
      <header className={styles.siteHeader}>
        <div className={styles.headerInner}>
          <button type="button" className={styles.hamburger} aria-label="Abrir menu">
            <span />
            <span />
            <span />
          </button>

          <a className={styles.logo} href="#" title="SERIE//A - Página inicial">
            {logo ? (
              <img src={logo} alt="Logo" className={styles.logoImg} />
            ) : (
              <strong>SERIE//A</strong>
            )}
          </a>

          <nav className={styles.desktopNav} aria-label="Menu principal">
            {data.navItems.map((item, i) =>
              item.hasMega ? (
                <button key={i} type="button" className={i === 0 ? styles.active : undefined}>
                  {item.label} &middot;
                </button>
              ) : (
                <a key={i} href={item.url}>
                  {item.label}
                </a>
              )
            )}
          </nav>

          <div className={styles.headerActions}>
            <button type="button" className={styles.iconBtn} aria-label="Abrir busca">
              <SearchIcon />
            </button>
            <a
              href="#"
              className={`${styles.iconBtn} ${styles.accountBtn}`}
              aria-label="Minha conta"
            >
              <AccountIcon />
            </a>
            <button type="button" className={styles.iconBtn} aria-label="Abrir sacola">
              <CartIcon />
              <span className={styles.cartBadge}>2</span>
            </button>
          </div>
        </div>
      </header>

      {/* Benefit strip */}
      <div className={styles.benefitStrip}>
        <div className={styles.container}>
          {data.benefitStripItems.map((b, i) => (
            <span key={i}>
              {i === 0 && <BenefitIcon />}
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

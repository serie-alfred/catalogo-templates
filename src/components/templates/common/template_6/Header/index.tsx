import React, { useEffect, useState } from 'react';

import styles from './index.module.css';
import { useLayout } from '@/context/LayoutContext';

// Preview estático do Header06 (Ferracini) — dados fixos, sem VTEX/GraphQL/hooks.
// Origem: faststore.starter/src/components/organisms/Header06 (gerado via /from-faststore).
// Mostra top-bar (slider) + header (logo, nav, busca, ícones), desktop e mobile via
// @container. Mega-menu, drawer mobile e overlay de busca (interativos) são omitidos no card.

const data = {
  topbarMessages: [
    'PIX Parcelado em 4x sem juros',
    'Frete Grátis Sul e Sudeste acima de R$249,90',
    'Frete Grátis Brasil acima de R$349,90*',
    'Cartão de crédito até 10x sem juros',
    'Use o cupom BEMVINDO10 na primeira compra',
  ],
  nav: [
    { label: 'Calçados', mega: true },
    { label: 'Acessórios', mega: true },
    { label: 'Explorar', mega: false },
    { label: 'SALE', mega: false, sale: true },
  ],
  searchPlaceholder: 'O que você procura?',
};

const FerraciniLogo = () => (
  <svg className={styles.logoMark} viewBox="0 0 673.45 124.02" role="img" aria-label="Ferracini">
    <polygon points="0 3.37 0 17.15 0 51.65 0 65.42 0 120.5 13.67 120.5 13.67 65.42 48.29 65.42 48.29 51.65 13.67 51.65 13.67 17.15 55.23 17.15 55.23 3.37 13.67 3.37 0 3.37" />
    <polygon points="130.87 17.21 130.87 3.37 89.43 3.37 75.75 3.37 75.75 120.5 89.43 120.5 130.87 120.5 130.87 106.83 89.43 106.83 89.43 65.5 124 65.5 124 51.65 89.43 51.65 89.43 17.21 130.87 17.21" />
    <path d="M187.32,65.5l-.21-.32c15.05-2.16,26.62-15.1,26.62-30.74,0-17.16-13.91-31.06-31.06-31.06h-31v29.19c-.04.62-.06,1.24-.06,1.88s.02,1.26.06,1.88v84.19h13.67v-55h5.98l35.08,55h14.8l-33.88-55ZM165.34,51.83V17.05h15.82c9.61,0,17.39,7.79,17.39,17.39s-7.79,17.39-17.39,17.39h-15.82Z" />
    <rect x="521.67" y="3.48" width="13.67" height="117.13" />
    <rect x="659.77" y="3.46" width="13.67" height="117.13" />
    <polygon points="625.25 3.37 625.25 86.2 563.21 3.37 556.37 3.37 556.37 3.48 556.25 3.48 556.25 120.61 569.93 120.61 569.93 37.86 625.25 111.29 625.25 111.43 632.09 120.5 632.2 120.5 638.93 120.5 638.93 104.46 638.93 3.37 625.25 3.37" />
    <path d="M501,101.46c-7.74,5.36-17.12,8.5-27.25,8.5-26.48,0-47.95-21.47-47.95-47.95s21.47-47.95,47.95-47.95c10.12,0,19.51,3.15,27.25,8.5V6.42c-8.28-4.1-17.59-6.42-27.46-6.42-34.25,0-62.01,27.76-62.01,62.01s27.76,62.01,62.01,62.01c9.86,0,19.18-2.32,27.46-6.42v-16.15Z" />
    <path d="M270.23,65.5l-.21-.32c15.05-2.16,26.62-15.1,26.62-30.74,0-17.16-13.91-31.06-31.06-31.06h-31v29.19c-.04.62-.06,1.24-.06,1.88s.02,1.25.06,1.88v84.19h13.67v-55h5.98l35.08,55h14.8l-33.88-55ZM248.25,51.83V17.05h15.83c9.6,0,17.39,7.79,17.39,17.39s-7.79,17.39-17.39,17.39h-15.83Z" />
    <polygon points="366.34 3.51 366.32 3.51 362.89 3.44 359.51 3.37 359.45 3.51 359.44 3.51 315.58 120.5 330.53 120.5 362.89 29.94 395.25 120.5 406.14 120.5 410.19 120.5 366.34 3.51" />
    <polygon fill="#c0121c" points="448.19 44.79 303.31 106.88 293.93 93 448.19 44.79" />
  </svg>
);

const TruckIcon = () => (
  <svg className={styles.topbarIcon} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 7.5h10v8H2z" />
    <path d="M12 10h4l3 3v2.5h-7z" />
    <circle cx="6.5" cy="17" r="1.6" />
    <circle cx="16.5" cy="17" r="1.6" />
  </svg>
);

const SearchIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="5.75" />
    <path d="M15 15l4.4 4.4" />
  </svg>
);

const PinIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const HeartIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const AccountIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8.2" r="3.35" />
    <path d="M5.8 20.2c.9-3.9 3.1-5.85 6.2-5.85s5.3 1.95 6.2 5.85" />
  </svg>
);

const CartIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6.6 8.25h10.8l-.72 11.25H7.32L6.6 8.25Z" />
    <path d="M9.2 8.25V7.1a2.8 2.8 0 0 1 5.6 0v1.15" />
  </svg>
);

export default function Header06() {
  const { logo } = useLayout();

  // Top-bar slider: deslize horizontal com loop contínuo (clone do 1º slide),
  // espelhando o componente FastStore. useState/useEffect são OK no preview.
  const msgs = data.topbarMessages;
  const [tbIndex, setTbIndex] = useState(0);
  const [tbNoAnim, setTbNoAnim] = useState(false);

  useEffect(() => {
    if (msgs.length <= 1) return;
    const id = setInterval(() => setTbIndex(i => i + 1), 4000);
    return () => clearInterval(id);
  }, [msgs.length]);

  useEffect(() => {
    if (tbIndex !== msgs.length) return;
    const t = setTimeout(() => {
      setTbNoAnim(true);
      setTbIndex(0);
    }, 620);
    return () => clearTimeout(t);
  }, [tbIndex, msgs.length]);

  useEffect(() => {
    if (!tbNoAnim) return;
    const r = requestAnimationFrame(() =>
      requestAnimationFrame(() => setTbNoAnim(false))
    );
    return () => cancelAnimationFrame(r);
  }, [tbNoAnim]);

  return (
    <div className={styles.header06Root}>
      {/* TOP-BAR (slider deslizante) */}
      <div className={styles.topbar} aria-label="Avisos da loja">
        <div
          className={`${styles.topbarTrack}${tbNoAnim ? ` ${styles.noAnim}` : ''}`}
          style={{ transform: `translateX(-${tbIndex * 100}%)` }}
        >
          {[...msgs, msgs[0]].map((m, i) => (
            <p key={i} className={styles.topbarSlide}>
              <TruckIcon />
              <span>{m}</span>
            </p>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <div className={styles.headerStack}>
        <header className={styles.bar}>
          <div className={styles.barInner}>
            <button type="button" className={styles.hamburger} aria-label="Abrir menu">
              <span />
              <span />
              <span />
            </button>

            <a className={styles.logo} href="/" aria-label="Ferracini - página inicial">
              {logo ? <img src={logo} alt="Ferracini" /> : <FerraciniLogo />}
            </a>

            <nav className={styles.desktopNav} aria-label="Menu principal">
              {data.nav.map((item, i) =>
                item.mega ? (
                  <button key={i} type="button">
                    {item.label}
                  </button>
                ) : (
                  <a key={i} href="#" className={item.sale ? styles.navSale : undefined}>
                    {item.label}
                  </a>
                )
              )}
            </nav>

            <form className={styles.searchPill} role="search" onSubmit={e => e.preventDefault()}>
              <input type="search" placeholder={data.searchPlaceholder} readOnly />
              <button type="submit" aria-label="Buscar">
                <SearchIcon />
              </button>
            </form>

            <div className={styles.actions}>
              <button type="button" className={`${styles.iconBtn} ${styles.mobileSearchBtn}`} aria-label="Abrir busca">
                <SearchIcon />
              </button>
              <a href="#" className={`${styles.iconBtn} ${styles.desktopOnly}`} aria-label="Nossas lojas">
                <PinIcon />
              </a>
              <a href="#" className={`${styles.iconBtn} ${styles.desktopOnly}`} aria-label="Favoritos">
                <HeartIcon />
              </a>
              <a href="#" className={`${styles.iconBtn} ${styles.desktopOnly}`} aria-label="Minha conta">
                <AccountIcon />
              </a>
              <button type="button" className={styles.iconBtn} aria-label="Abrir sacola">
                <CartIcon />
                <span className={styles.cartBadge}>2</span>
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}

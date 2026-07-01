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

            <a className={styles.logo} href="/" aria-label="SERIE//A - página inicial">
              {logo ? (
                <img src={logo} alt="Logo" />
              ) : (
                <span className={styles.logoFallback}>SERIE//A</span>
              )}
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

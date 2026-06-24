import React from 'react';

import styles from './index.module.css';
import { useLayout } from '@/context/LayoutContext';

// Preview estático do Header05 (SÉRIE//A) — dados fixos, sem VTEX/GraphQL/hooks.
// Origem: faststore.starter/src/components/organisms/Header05 (gerado via /from-faststore).
// Renderiza service bar + header (desktop e mobile) + nav de categorias; mega/simple
// menu, search layer, drawer e mini-cart (interativos) são omitidos no card.

const data = {
  servicePromo: 'FRETE GRÁTIS ACIMA DE R$ 299',
  serviceLinks: [
    { name: 'Nossas lojas', url: '#' },
    { name: 'Atendimento', url: '#' },
    { name: 'Acompanhar pedido', url: '#' },
  ],
  brandName: 'SÉRIE//A',
  searchPlaceholder: 'Buscar produtos e marcas',
  favoritesLabel: 'Favoritos',
  favoritesCount: 2,
  accountLabel: 'Minha conta',
  cartLabel: 'Sacola',
  categories: [
    { label: 'Novidades', url: '#', menuType: 'link' },
    { label: 'Ofertas', url: '#', menuType: 'link', sale: true },
    { label: 'Masculino', url: '#', menuType: 'mega' },
    { label: 'Feminino', url: '#', menuType: 'simple' },
    { label: 'Infantil', url: '#', menuType: 'link' },
    { label: 'Casa', url: '#', menuType: 'link' },
    { label: 'Eletrônicos', url: '#', menuType: 'link' },
    { label: 'Acessórios', url: '#', menuType: 'link' },
    { label: 'Marcas', url: '#', menuType: 'link' },
  ],
};

type IconName = 'search' | 'heart' | 'user' | 'bag' | 'menu';

const Icon = ({ name, className }: { name: IconName; className?: string }) => {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (name) {
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        </svg>
      );
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case 'bag':
      return (
        <svg {...common}>
          <path d="M5 8h14l-1 13H6L5 8Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case 'menu':
      return (
        <svg {...common}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    default:
      return null;
  }
};

const BrandMark = ({ name }: { name: string }) => {
  const parts = name.split('//');
  return (
    <span>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <span className={styles.wordmarkAccent}>{'//'}</span>}
        </span>
      ))}
    </span>
  );
};

export default function Header05() {
  const { logo } = useLayout();

  const brand = logo ? (
    <img src={logo} alt="Logo" className={styles.wordmarkImg} />
  ) : (
    <BrandMark name={data.brandName} />
  );

  return (
    <div className={styles.header05}>
      {/* Service bar */}
      <div className={styles.serviceBar}>
        <div className={styles.container}>
          <div className={styles.servicePromo}>
            <span className={styles.dot} aria-hidden="true" />
            <span>{data.servicePromo}</span>
          </div>
          <div className={styles.serviceLinks}>
            {data.serviceLinks.map((link, i) => (
              <a key={i} href={link.url}>
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={styles.siteHeader}>
        {/* Desktop */}
        <div className={styles.desktopHeader}>
          <div className={`${styles.container} ${styles.headerMain}`}>
            <div className={styles.headerLeft}>
              <button type="button" className={styles.searchTrigger} aria-label="Abrir busca">
                <Icon name="search" className={styles.icon} />
                <span>{data.searchPlaceholder}</span>
              </button>
            </div>

            <a className={styles.wordmark} href="/" aria-label={`${data.brandName}, página inicial`}>
              {brand}
            </a>

            <div className={styles.headerActions}>
              <a className={styles.actionBtn} href="#">
                <Icon name="heart" className={styles.icon} />
                <span className={styles.label}>{data.favoritesLabel}</span>
                <span className={styles.badge}>{data.favoritesCount}</span>
              </a>
              <a className={styles.actionBtn} href="#">
                <Icon name="user" className={styles.icon} />
                <span className={styles.label}>{data.accountLabel}</span>
              </a>
              <button type="button" className={styles.actionBtn} aria-label="Abrir sacola">
                <Icon name="bag" className={styles.icon} />
                <span className={styles.label}>{data.cartLabel}</span>
              </button>
            </div>
          </div>

          <div>
            <nav className={styles.categoryNav} aria-label="Categorias principais">
              <ul className={`${styles.container} ${styles.categoryList}`}>
                {data.categories.map((cat, i) => {
                  const isInteractive = cat.menuType === 'mega' || cat.menuType === 'simple';
                  return (
                    <li
                      key={i}
                      className={`${styles.navItem}${cat.sale ? ` ${styles.navItemSale}` : ''}`}
                    >
                      {isInteractive ? (
                        <button type="button">{cat.label}</button>
                      ) : (
                        <a href={cat.url}>{cat.label}</a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile */}
        <div className={styles.mobileHeader}>
          <div className={`${styles.mobileTop} ${styles.container}`}>
            <div className={styles.mobileLeft}>
              <button type="button" className={styles.iconBtn} aria-label="Abrir menu">
                <Icon name="menu" className={styles.icon} />
              </button>
            </div>
            <a className={styles.wordmark} href="/" aria-label={`${data.brandName}, página inicial`}>
              {brand}
            </a>
            <div className={styles.mobileRight}>
              <a className={styles.actionBtn} href="#" aria-label={data.accountLabel}>
                <Icon name="user" className={styles.icon} />
              </a>
              <button type="button" className={styles.actionBtn} aria-label="Abrir sacola">
                <Icon name="bag" className={styles.icon} />
              </button>
            </div>
          </div>
          <div className={styles.mobileSearch}>
            <button type="button" className={styles.searchTrigger}>
              <Icon name="search" className={styles.icon} />
              <span>O que você procura?</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

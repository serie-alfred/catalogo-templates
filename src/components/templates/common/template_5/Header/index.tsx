import React, { useEffect, useRef, useState } from 'react';

import styles from './index.module.css';
import { useLayout } from '@/context/LayoutContext';
import CartSidebar01 from '@/components/templates/_shared/CartSidebar01';
import { buildSearchSuggestions } from '@/components/templates/_shared/searchSuggestions';

// Preview do Header05 (SÉRIE//A) — dados fixos, sem VTEX/GraphQL/hooks.
// Origem: faststore.starter/src/components/organisms/Header05 (gerado via /from-faststore).
//
// Reproduz o comportamento do componente real: mega-menu e menu simples abertos
// por CLIQUE na categoria (é assim no .starter), search layer em camada com
// autocomplete, drawer mobile com accordions e o mini-cart CartSidebar01.
// No card do gerador o template fica inerte (pointer-events: none em
// SortableItem) — a interação acontece no link de preview /p/{id}.

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
  favoritesUrl: '#',
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
  megaColumnTitle: 'Masculino',
  megaLinks: [
    { name: 'Ver tudo', url: '#' },
    { name: 'Lançamentos', url: '#' },
    { name: 'Mais vendidos', url: '#' },
    { name: 'Promoções', url: '#' },
    { name: 'Básicos', url: '#' },
    { name: 'Premium', url: '#' },
    { name: 'Coleções especiais', url: '#' },
  ],
  megaPromos: [
    {
      title: 'Novidades da semana',
      subtitle: 'Peças essenciais, novos cortes.',
      url: '#',
    },
    { title: 'Até 50% OFF', subtitle: 'Seleção por tempo limitado.', url: '#' },
    { title: 'Coleção exclusiva', subtitle: 'SÉRIE//A Studio 06.', url: '#' },
  ],
  simpleMenuTitle: 'Feminino',
  simpleLinks: [
    { name: 'Ver tudo', url: '#' },
    { name: 'Camisetas', url: '#' },
    { name: 'Calças', url: '#' },
    { name: 'Jaquetas', url: '#' },
    { name: 'Vestidos', url: '#' },
    { name: 'Acessórios', url: '#' },
    { name: 'Outlet', url: '#' },
    { name: 'Mais vendidos', url: '#' },
  ],
  searchSuggestions: [
    'tênis masculino',
    'fone bluetooth',
    'vestido midi',
    'cama e banho',
    'ofertas do dia',
  ],
  mobileNavItems: [
    { label: 'Novidades', url: '#' },
    { label: 'Ofertas', url: '#', sale: true },
    {
      label: 'Masculino',
      url: '#',
      sublinks: [
        { name: 'Ver tudo', url: '#' },
        { name: 'Lançamentos', url: '#' },
        { name: 'Mais vendidos', url: '#' },
        { name: 'Básicos', url: '#' },
        { name: 'Premium', url: '#' },
      ],
    },
    {
      label: 'Feminino',
      url: '#',
      sublinks: [
        { name: 'Ver tudo', url: '#' },
        { name: 'Camisetas', url: '#' },
        { name: 'Calças', url: '#' },
        { name: 'Jaquetas', url: '#' },
        { name: 'Vestidos', url: '#' },
        { name: 'Outlet', url: '#' },
      ],
    },
    { label: 'Infantil', url: '#' },
    { label: 'Casa', url: '#' },
    { label: 'Eletrônicos', url: '#' },
    { label: 'Acessórios', url: '#' },
    { label: 'Marcas', url: '#' },
  ],
};

// O preview não navega: os links existem (markup igual ao do tema) mas não saem
// da página do preview.
const preventNav = (e: React.MouseEvent) => e.preventDefault();

type IconName = 'search' | 'heart' | 'user' | 'bag' | 'menu' | 'close';

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
    case 'close':
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
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
          {i < parts.length - 1 && (
            <span className={styles.wordmarkAccent}>{'//'}</span>
          )}
        </span>
      ))}
    </span>
  );
};

export default function Header05() {
  const { logo } = useLayout();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [term, setTerm] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const suggestions = buildSearchSuggestions(term, data.searchSuggestions);
  const cartCount = 1;

  // Foca o input quando a camada de busca abre (igual ao .starter).
  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => searchInputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [searchOpen]);

  // ESC fecha camadas e menus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setSearchOpen(false);
      setMobileOpen(false);
      setActiveMenu(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Clique fora fecha o mega/simple menu.
  useEffect(() => {
    if (activeMenu === null) return;
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [activeMenu]);

  const openSearch = () => {
    setMobileOpen(false);
    setActiveMenu(null);
    setSearchOpen(true);
  };

  const openMobile = () => {
    setSearchOpen(false);
    setActiveMenu(null);
    setMobileOpen(true);
  };

  const toggleMenu = (index: number) =>
    setActiveMenu(prev => (prev === index ? null : index));

  const toggleAccordion = (index: number) =>
    setOpenAccordion(prev => (prev === index ? null : index));

  const brand = logo ? (
    <img src={logo} alt="Logo" className={styles.wordmarkImg} />
  ) : (
    <BrandMark name={data.brandName} />
  );

  const renderMegaMenu = (open: boolean) => (
    <div
      className={`${styles.megaMenu}${open ? ` ${styles.menuOpen}` : ''}`}
      role="region"
    >
      <div className={`${styles.container} ${styles.megaLayout}`}>
        <div>
          <p className={styles.menuHeading}>{data.megaColumnTitle}</p>
          <div className={styles.menuLinks}>
            {data.megaLinks.map((link, i) => (
              <a key={i} href={link.url} onClick={preventNav}>
                {link.name}
                {i === 0 && <span aria-hidden="true">→</span>}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.promoGrid}>
          {data.megaPromos.map((promoItem, i) => (
            <a
              key={i}
              href={promoItem.url}
              className={styles.promoCard}
              onClick={preventNav}
            >
              <span className={styles.promoCopy}>
                <strong>{promoItem.title}</strong>
                <span>{promoItem.subtitle}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSimpleMenu = (open: boolean) => (
    <div
      className={`${styles.simpleMenu}${open ? ` ${styles.menuOpen}` : ''}`}
      role="region"
    >
      <div className={styles.container}>
        <p className={styles.menuHeading}>{data.simpleMenuTitle}</p>
        <div className={styles.simpleGrid}>
          {data.simpleLinks.map((link, i) => (
            <a key={i} href={link.url} onClick={preventNav}>
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.header05}>
      {/* .headerShell concentra o container-type: as camadas em position: fixed
          (busca, drawer, mini-cart) ficam FORA dele, senão a contenção do
          @container as prenderia à caixa do header. */}
      <div className={styles.headerShell}>
        {/* Service bar */}
        <div className={styles.serviceBar}>
          <div className={styles.container}>
            <div className={styles.servicePromo}>
              <span className={styles.dot} aria-hidden="true" />
              <span>{data.servicePromo}</span>
            </div>
            <div className={styles.serviceLinks}>
              {data.serviceLinks.map((link, i) => (
                <a key={i} href={link.url} onClick={preventNav}>
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
                <button
                  type="button"
                  className={styles.searchTrigger}
                  onClick={openSearch}
                  aria-label="Abrir busca"
                >
                  <Icon name="search" className={styles.icon} />
                  <span>{data.searchPlaceholder}</span>
                </button>
              </div>

              <a
                className={styles.wordmark}
                href="/"
                onClick={preventNav}
                aria-label={`${data.brandName}, página inicial`}
              >
                {brand}
              </a>

              <div className={styles.headerActions}>
                <a
                  className={styles.actionBtn}
                  href={data.favoritesUrl}
                  onClick={preventNav}
                >
                  <Icon name="heart" className={styles.icon} />
                  <span className={styles.label}>{data.favoritesLabel}</span>
                  <span className={styles.badge}>{data.favoritesCount}</span>
                </a>
                <a className={styles.actionBtn} href="#" onClick={preventNav}>
                  <Icon name="user" className={styles.icon} />
                  <span className={styles.label}>{data.accountLabel}</span>
                </a>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => setCartOpen(true)}
                  aria-label={`Abrir sacola com ${cartCount} itens`}
                >
                  <Icon name="bag" className={styles.icon} />
                  <span className={styles.label}>{data.cartLabel}</span>
                  <span className={styles.badge}>{cartCount}</span>
                </button>
              </div>
            </div>

            <div ref={navRef}>
              <nav className={styles.categoryNav} aria-label="Categorias principais">
                <ul className={`${styles.container} ${styles.categoryList}`}>
                  {data.categories.map((cat, i) => {
                    const isInteractive =
                      cat.menuType === 'mega' || cat.menuType === 'simple';
                    return (
                      <li
                        key={i}
                        className={`${styles.navItem}${cat.sale ? ` ${styles.navItemSale}` : ''}`}
                      >
                        {isInteractive ? (
                          <button
                            type="button"
                            onClick={() => toggleMenu(i)}
                            aria-expanded={activeMenu === i}
                          >
                            {cat.label}
                          </button>
                        ) : (
                          <a href={cat.url} onClick={preventNav}>
                            {cat.label}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {data.categories.map((cat, i) => {
                if (cat.menuType === 'mega')
                  return <div key={`mega-${i}`}>{renderMegaMenu(activeMenu === i)}</div>;
                if (cat.menuType === 'simple')
                  return (
                    <div key={`simple-${i}`}>{renderSimpleMenu(activeMenu === i)}</div>
                  );
                return null;
              })}
            </div>
          </div>

          {/* Mobile */}
          <div className={styles.mobileHeader}>
            <div className={`${styles.mobileTop} ${styles.container}`}>
              <div className={styles.mobileLeft}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={openMobile}
                  aria-label="Abrir menu"
                  aria-expanded={mobileOpen}
                >
                  <Icon name="menu" className={styles.icon} />
                </button>
              </div>
              <a
                className={styles.wordmark}
                href="/"
                onClick={preventNav}
                aria-label={`${data.brandName}, página inicial`}
              >
                {brand}
              </a>
              <div className={styles.mobileRight}>
                <a
                  className={styles.actionBtn}
                  href="#"
                  onClick={preventNav}
                  aria-label={data.accountLabel}
                >
                  <Icon name="user" className={styles.icon} />
                </a>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => setCartOpen(true)}
                  aria-label={`Abrir sacola com ${cartCount} itens`}
                >
                  <Icon name="bag" className={styles.icon} />
                  <span className={styles.badge}>{cartCount}</span>
                </button>
              </div>
            </div>
            <div className={styles.mobileSearch}>
              <button
                type="button"
                className={styles.searchTrigger}
                onClick={openSearch}
              >
                <Icon name="search" className={styles.icon} />
                <span>O que você procura?</span>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* ── SEARCH LAYER ── */}
      <div
        className={`${styles.searchLayer}${searchOpen ? ` ${styles.layerOpen}` : ''}`}
        aria-hidden={!searchOpen}
        onClick={e => {
          if (e.target === e.currentTarget) setSearchOpen(false);
        }}
      >
        <div className={styles.searchPanel}>
          <div className={styles.container}>
            <form
              className={styles.searchTop}
              onSubmit={e => e.preventDefault()}
            >
              <input
                ref={searchInputRef}
                className={styles.searchField}
                type="search"
                placeholder="Busque por produto, categoria ou marca"
                aria-label="Busca"
                value={term}
                onChange={e => setTerm(e.target.value)}
              />
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setSearchOpen(false)}
                aria-label="Fechar busca"
              >
                <Icon name="close" className={styles.icon} />
              </button>
            </form>
            {suggestions.length > 0 && (
              <div className={styles.searchSuggestions}>
                {suggestions.map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    onClick={e => {
                      e.preventDefault();
                      setTerm(s);
                    }}
                  >
                    {s}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`${styles.drawerOverlay}${mobileOpen ? ` ${styles.layerOpen}` : ''}`}
        aria-hidden={!mobileOpen}
        onClick={e => {
          if (e.target === e.currentTarget) setMobileOpen(false);
        }}
      >
        <aside className={styles.mobileDrawer} aria-label="Menu principal">
          <div className={styles.drawerHead}>
            <a className={styles.wordmark} href="/" onClick={preventNav}>
              {brand}
            </a>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
            >
              <Icon name="close" className={styles.icon} />
            </button>
          </div>
          <div className={styles.mobileMenuScroll}>
            <div className={styles.mobileDrawerSearch}>
              <form onSubmit={e => e.preventDefault()}>
                <label>
                  <Icon name="search" className={styles.icon} />
                  <input
                    type="search"
                    placeholder="Buscar produtos"
                    aria-label="Buscar produtos"
                    value={term}
                    onChange={e => setTerm(e.target.value)}
                  />
                </label>
              </form>
            </div>
            <nav aria-label="Categorias no celular">
              {data.mobileNavItems.map((item, i) => {
                const sublinks = item.sublinks ?? [];
                const isOpen = openAccordion === i;
                return (
                  <div key={i} className={styles.mobileMenuItem}>
                    {sublinks.length > 0 ? (
                      <>
                        <button
                          type="button"
                          className={styles.accordionTrigger}
                          onClick={() => toggleAccordion(i)}
                          aria-expanded={isOpen}
                        >
                          <span>{item.label}</span>
                          <span className={styles.chevron} aria-hidden="true">
                            ⌄
                          </span>
                        </button>
                        <div
                          className={`${styles.accordionPanel}${isOpen ? ` ${styles.menuOpen}` : ''}`}
                        >
                          {sublinks.map((sub, j) => (
                            <a key={j} href={sub.url} onClick={preventNav}>
                              {sub.name}
                            </a>
                          ))}
                        </div>
                      </>
                    ) : (
                      <a
                        href={item.url}
                        onClick={preventNav}
                        className={item.sale ? styles.mobileSaleLink : undefined}
                      >
                        {item.label} <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>
      </div>

      {/* ── MINI-CART (CartSidebar01, igual ao .starter) ── */}
      <CartSidebar01
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        title={data.cartLabel}
      />
    </div>
  );
}

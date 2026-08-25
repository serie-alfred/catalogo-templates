'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './index.module.css';
import { useLayout } from '@/context/LayoutContext';
import CartSidebar01 from '@/components/templates/_shared/CartSidebar01';
import { buildSearchSuggestions } from '@/components/templates/_shared/searchSuggestions';

// Preview do Header04 (MANU) — dados fixos, sem VTEX/GraphQL/hooks.
// Origem: faststore.starter/src/components/organisms/Header04 (gerado via /from-faststore).
//
// Reproduz o comportamento do componente real: pre-header rotativo, mega-menu
// aberto por CLIQUE no item de nav (é assim no .starter), overlay de busca em
// tela cheia com autocomplete, drawer mobile com accordions e o mini-cart
// CartSidebar01. No card do gerador o template fica inerte (pointer-events:
// none em SortableItem) — a interação acontece no link de preview /p/{id}.

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
  megaColumns: [
    {
      title: 'Por Ocasião',
      links: [
        { name: 'Trabalho & Executivo', url: '#' },
        { name: 'Casual Refinado', url: '#' },
        { name: 'Eventos & Cerimônias', url: '#' },
        { name: 'Fim de Semana', url: '#' },
      ],
    },
    {
      title: 'Por Peça',
      links: [
        { name: 'Ternos', url: '#' },
        { name: 'Blazers', url: '#' },
        { name: 'Camisas', url: '#' },
        { name: 'Calças', url: '#' },
        { name: 'Acessórios', url: '#' },
      ],
    },
    {
      title: 'Novidades',
      links: [
        { name: 'Lançamentos da Semana', url: '#' },
        { name: 'Pré-venda Exclusiva', url: '#' },
        { name: 'Edição Limitada', url: '#' },
        { name: 'Coleção Cápsula', url: '#' },
      ],
    },
  ],
  megaImage: {
    src: 'https://placehold.co/400x533',
    alt: 'Editorial da coleção',
    label: 'Coleção completa',
    linkLabel: 'Ver coleção completa',
    url: '#',
  },
  searchPlaceholder: 'O que você procura?',
  quickSearch: ['Blazer', 'Camisa Oxford', 'Terno Slim'],
  mobileNavItems: [
    {
      label: 'Coleções',
      url: '#',
      sublinks: [
        { name: 'Trabalho & Executivo', url: '#' },
        { name: 'Casual Refinado', url: '#' },
        { name: 'Eventos & Cerimônias', url: '#' },
      ],
    },
    {
      label: 'Ternos & Blazers',
      url: '#',
      sublinks: [
        { name: 'Ternos', url: '#' },
        { name: 'Blazers', url: '#' },
        { name: 'Alfaiataria', url: '#' },
      ],
    },
    {
      label: 'Camisas',
      url: '#',
      sublinks: [
        { name: 'Oxford', url: '#' },
        { name: 'Linho', url: '#' },
        { name: 'Algodão egípcio', url: '#' },
      ],
    },
    { label: 'Acessórios', url: '#', sublinks: [] },
  ],
  benefitStripItems: [
    'Frete grátis acima de R$ 349',
    'Troca gratuita em 30 dias',
    'Pix com 5% de desconto',
    'Embalagem exclusiva de presente',
  ],
};

// O preview não navega: os links existem (markup igual ao do tema) mas não saem
// da página do preview.
const preventNav = (e: React.MouseEvent) => e.preventDefault();

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

const ChevronIcon = () => (
  <svg className={`${styles.icon} ${styles.navChevron}`} viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 6l4 4 4-4" />
  </svg>
);

const ArrowIcon = () => <span className={styles.arrow}>&rarr;</span>;

export default function Header04() {
  const { logo } = useLayout();

  // ── Pre-header rotativo + fechável ──
  const [preIndex, setPreIndex] = useState(0);
  const [preVisibleIndex, setPreVisibleIndex] = useState(0);
  const [preFading, setPreFading] = useState(false);
  const [preheaderClosed, setPreheaderClosed] = useState(false);
  const [paused, setPaused] = useState(false);
  const preTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const messages = data.announcementMessages;

  const goToMessage = useCallback(
    (i: number) => {
      const next = ((i % messages.length) + messages.length) % messages.length;
      setPreFading(true);
      setTimeout(() => {
        setPreVisibleIndex(next);
        setPreIndex(next);
        setPreFading(false);
      }, 220);
    },
    [messages.length]
  );

  useEffect(() => {
    if (preheaderClosed || paused) return;
    preTimerRef.current = setInterval(() => {
      setPreIndex(curr => {
        const next = (curr + 1) % messages.length;
        setPreFading(true);
        setTimeout(() => {
          setPreVisibleIndex(next);
          setPreFading(false);
        }, 220);
        return next;
      });
    }, 5000);
    return () => {
      if (preTimerRef.current) clearInterval(preTimerRef.current);
    };
  }, [preheaderClosed, paused, messages.length]);

  // ── Estado sticky (benefit strip some ao rolar) ──
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Mega menu (abre por clique, igual ao .starter) ──
  const [activeMega, setActiveMega] = useState<number | null>(null);
  const closeMega = useCallback(() => setActiveMega(null), []);
  const toggleMega = useCallback(
    (i: number) => setActiveMega(curr => (curr === i ? null : i)),
    []
  );

  // ── Overlay de busca ──
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => searchInputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [searchOpen]);

  // ── Drawer mobile + accordions ──
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileItems, setOpenMobileItems] = useState<Record<number, boolean>>({});
  const toggleMobileItem = useCallback(
    (i: number) => setOpenMobileItems(curr => ({ ...curr, [i]: !curr[i] })),
    []
  );

  // ── Mini-cart ──
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = 1;

  // ── Trava o scroll do documento com overlay/drawer aberto ──
  useEffect(() => {
    const lock = searchOpen || mobileOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen, mobileOpen]);

  // ── ESC fecha tudo ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      closeMega();
      closeSearch();
      setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeMega, closeSearch]);

  const suggestions = buildSearchSuggestions(term, data.quickSearch);

  const rootClasses = [
    styles.header04Root,
    preheaderClosed ? styles.preheaderHidden : '',
  ]
    .filter(Boolean)
    .join(' ');

  const headerClasses = [
    styles.siteHeader,
    scrolled ? styles.scrolled : '',
    activeMega !== null ? styles.menuActive : '',
  ]
    .filter(Boolean)
    .join(' ');

  const Logo = ({ extraClass }: { extraClass?: string }) => (
    <a
      className={`${styles.logo}${extraClass ? ` ${extraClass}` : ''}`}
      href="#"
      onClick={preventNav}
      title="SERIE//A - Página inicial"
    >
      {logo ? (
        <img src={logo} alt="Logo" className={styles.logoImg} />
      ) : (
        <strong>SERIE//A</strong>
      )}
    </a>
  );

  return (
    <div className={rootClasses}>
      {/* .headerShell concentra o container-type: as camadas em position: fixed
          (mega, busca, drawer, mini-cart) ficam FORA dele, senão a contenção do
          @container as prenderia à caixa do header. */}
      <div className={styles.headerShell}>
        {/* ── PRE-HEADER ── */}
        <div className={`${styles.preHeader}${preheaderClosed ? ` ${styles.closed}` : ''}`}>
          <div className={styles.preHeaderInner}>
            <div className={styles.preHeaderControls}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => goToMessage(preIndex - 1)}
                aria-label="Mensagem anterior"
              >
                &lsaquo;
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => goToMessage(preIndex + 1)}
                aria-label="Próxima mensagem"
              >
                &rsaquo;
              </button>
            </div>
            <p
              className={`${styles.preHeaderMessage}${preFading ? ` ${styles.fading}` : ''}`}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              {messages[preVisibleIndex]}
            </p>
            <button
              type="button"
              className={styles.preHeaderClose}
              onClick={() => setPreheaderClosed(true)}
              aria-label="Fechar aviso"
            >
              &times;
            </button>
          </div>
        </div>

        {/* ── SITE HEADER ── */}
        <header className={headerClasses}>
          <div className={styles.headerInner}>
            <button
              type="button"
              className={`${styles.hamburger}${mobileOpen ? ` ${styles.open}` : ''}`}
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={mobileOpen}
            >
              <span />
              <span />
              <span />
            </button>

            <Logo />

            <nav className={styles.desktopNav} aria-label="Menu principal">
              {data.navItems.map((item, i) =>
                item.hasMega ? (
                  <button
                    key={i}
                    type="button"
                    className={i === 0 ? styles.active : undefined}
                    aria-expanded={activeMega === i}
                    onClick={e => {
                      e.stopPropagation();
                      toggleMega(i);
                    }}
                  >
                    {item.label} &middot;
                  </button>
                ) : (
                  <a key={i} href={item.url} onClick={preventNav}>
                    {item.label}
                  </a>
                )
              )}
            </nav>

            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={openSearch}
                aria-label="Abrir busca"
              >
                <SearchIcon />
              </button>
              <a
                href="#"
                onClick={preventNav}
                className={`${styles.iconBtn} ${styles.accountBtn}`}
                aria-label="Minha conta"
              >
                <AccountIcon />
              </a>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setCartOpen(true)}
                aria-label="Abrir sacola"
              >
                <CartIcon />
                <span className={styles.cartBadge}>{cartCount}</span>
              </button>
            </div>
          </div>
        </header>

        {/* ── BENEFIT STRIP ── */}
        <div className={`${styles.benefitStrip}${scrolled ? ` ${styles.hidden}` : ''}`}>
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

      {/* ── MEGA OVERLAY + MENU ── */}
      <div
        className={`${styles.megaOverlay}${activeMega !== null ? ` ${styles.open}` : ''}`}
        onClick={closeMega}
      />
      <div className={`${styles.megaMenu}${activeMega !== null ? ` ${styles.open}` : ''}`}>
        <div className={styles.megaGrid}>
          {data.megaColumns.map((col, i) => (
            <div key={i} className={styles.megaCol}>
              <h3>{col.title}</h3>
              {col.links.map((link, j) => (
                <a
                  key={j}
                  href={link.url}
                  onClick={e => {
                    preventNav(e);
                    closeMega();
                  }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          ))}
          <div className={`${styles.megaCol} ${styles.megaImage}`}>
            <img loading="lazy" src={data.megaImage.src} alt={data.megaImage.alt} />
            <div className={styles.label}>{data.megaImage.label}</div>
            <a
              href={data.megaImage.url}
              onClick={e => {
                preventNav(e);
                closeMega();
              }}
            >
              {data.megaImage.linkLabel} <ArrowIcon />
            </a>
          </div>
        </div>
      </div>

      {/* ── SEARCH OVERLAY ── */}
      <div
        className={`${styles.searchOverlay}${searchOpen ? ` ${styles.open}` : ''}`}
        onClick={e => {
          if (e.target === e.currentTarget) closeSearch();
        }}
      >
        <button
          type="button"
          className={styles.searchClose}
          onClick={closeSearch}
          aria-label="Fechar busca"
        >
          &times;
        </button>
        <div className={styles.searchBox}>
          <form onSubmit={e => e.preventDefault()}>
            <input
              ref={searchInputRef}
              type="search"
              placeholder={data.searchPlaceholder}
              value={term}
              onChange={e => setTerm(e.target.value)}
            />
          </form>
          {suggestions.length > 0 && (
            <div className={styles.quickSearch}>
              {suggestions.map((s, i) => (
                <button key={i} type="button" onClick={() => setTerm(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── DRAWER OVERLAY ── */}
      <div
        className={`${styles.drawerOverlay}${mobileOpen ? ` ${styles.open}` : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── MOBILE DRAWER ── */}
      <aside
        className={`${styles.sideDrawer} ${styles.mobileDrawer}${mobileOpen ? ` ${styles.open}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu mobile"
      >
        <div className={styles.drawerHead}>
          <Logo />
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
          >
            &times;
          </button>
        </div>
        <nav className={styles.mobileNav} aria-label="Menu principal mobile">
          {data.mobileNavItems.map((item, i) =>
            item.sublinks.length ? (
              <div
                key={i}
                className={`${styles.mobileNavItem}${openMobileItems[i] ? ` ${styles.open}` : ''}`}
              >
                <button
                  type="button"
                  aria-expanded={!!openMobileItems[i]}
                  onClick={() => toggleMobileItem(i)}
                >
                  {item.label}
                  <ChevronIcon />
                </button>
                <div className={styles.mobileSub}>
                  {item.sublinks.map((sub, j) => (
                    <a key={j} href={sub.url} onClick={preventNav}>
                      {sub.name}
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <a
                key={i}
                className={styles.mobileNavLink}
                href={item.url}
                onClick={preventNav}
              >
                {item.label}
              </a>
            )
          )}
        </nav>
        <div className={styles.mobileFooter}>
          <a href="#" onClick={preventNav}>
            Minha conta
          </a>{' '}
          | Pedidos | Favoritos
          <div className={styles.socialLinks}>
            <a href="#" onClick={preventNav} aria-label="Instagram">
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="4" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </a>
            <a href="#" onClick={preventNav} aria-label="Pinterest">
              <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M10 19 12 7" />
              </svg>
            </a>
          </div>
        </div>
      </aside>

      {/* ── MINI-CART (CartSidebar01, igual ao .starter) ── */}
      <CartSidebar01 open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

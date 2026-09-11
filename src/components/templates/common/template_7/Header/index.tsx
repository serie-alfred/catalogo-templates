'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import CartSidebar01 from '@/components/templates/_shared/CartSidebar01';
import { buildSearchSuggestions } from '@/components/templates/_shared/searchSuggestions';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Header07` do faststore.starter — o de VERDADE.
 *
 * O mock anterior deste slot renderizava um header de moda masculina
 * streetwear enquanto o `path` entregava este, da Brasilusa: 6% de classes e
 * 7% de palavras em comum com a origem. Ver ACHADOS-EM-ABERTO.md, 11/09.
 *
 * O que sai em relação à origem, e por quê:
 *  • `useRouter`/`formatSearchState` → os links são `href`, o preview não navega;
 *  • `useSuggestions`/`useSearchHistory`/`useTopSearch` → `buildSearchSuggestions`,
 *    o mesmo helper que os outros headers do catálogo usam;
 *  • `ProfileChallenge` → renderiza o ramo deslogado (não há sessão aqui);
 *  • `useCart`/`useCartToggleButton`/`useCartInstance` → estado local + 1 item;
 *  • o wordmark "BRASILUSA" → `useLayout().logo` com fallback "SERIE//A", como
 *    manda o /from-faststore: o catálogo é público e mostra a marca do usuário.
 *
 * ⚠️ O mini-cart usa o `_shared/CartSidebar01`, e isso é um delta CONHECIDO. A
 * gaveta da origem (`organisms/CartSidebar07`) tem a MESMA marcação — são 432
 * linhas de override em `[data-fs-*]` sobre o drawer do @faststore/ui, e a
 * única classe que ela declara é `.section`. Só que o replica do catálogo
 * resolveu os `--fs-*` para valores literais em classes próprias, então os
 * overrides do 07 não se aplicam a ele mecanicamente: portá-los é reescrever
 * classe a classe. A ESTRUTURA da gaveta está certa; a pele é a base do
 * FastStore, não a da Brasilusa. Registrado em ACHADOS-EM-ABERTO.md.
 */
const MAX_SUGGESTIONS = 5;

interface MegaLink {
  name: string;
  url?: string;
  highlight?: boolean;
}

interface MegaColumn {
  title?: string;
  url?: string;
  links?: MegaLink[];
}

interface MegaImage {
  quote?: string;
  linkLabel?: string;
  url?: string;
  alt?: string;
}

interface NavItem {
  label: string;
  url?: string;
  highlight?: boolean;
  hasMega?: boolean;
  megaColumns?: MegaColumn[];
  megaImage?: MegaImage;
}

const conteudo = {
  topbarMessages: [
    '✦ Mais de 100 mil ambientes transformados com conforto e estilo',
    '✦ Frete grátis Sul e Sudeste acima de R$699',
    '✦ Até 10× sem juros no cartão',
    '✦ 5% de desconto no Pix',
  ],
  searchPlaceholder: 'Buscar produtos...',
  accountUrl: '/account',
  wishlistUrl: '/favoritos',
  whatsappUrl: 'https://wa.me/5511999999999',
  navItems: [
    { label: 'Inverno', url: '/inverno' },
    { label: 'Saldos', url: '/saldos', highlight: true },
    {
      label: 'Tapetes',
      url: '/tapetes',
      hasMega: true,
      megaColumns: [
        {
          title: 'Por ambiente',
          url: '/tapetes/ambientes',
          links: [
            { name: 'Tapete para Sala', url: '/tapetes/sala' },
            { name: 'Tapete para Quarto', url: '/tapetes/quarto' },
            { name: 'Tapete para Banheiro', url: '/tapetes/banheiro' },
            { name: 'Tapete para Cozinha', url: '/tapetes/cozinha' },
            { name: 'Tapete de Entrada', url: '/tapetes/entrada' },
          ],
        },
        {
          title: 'Por tipo',
          url: '/tapetes/tipos',
          links: [
            { name: 'Passadeiras', url: '/tapetes/passadeiras' },
            { name: 'Capachos', url: '/tapetes/capachos' },
            { name: 'Tapetes Orgânicos', url: '/tapetes/organicos' },
            { name: 'Tapetes Belgas', url: '/tapetes/belgas' },
            { name: 'Tapetes Sisal', url: '/tapetes/sisal' },
          ],
        },
        {
          title: 'Destaques',
          url: '/tapetes/destaques',
          links: [
            { name: 'Novidades 2026 →', url: '/tapetes/novidades', highlight: true },
            { name: 'Mais vendidos →', url: '/tapetes/mais-vendidos', highlight: true },
            { name: 'Com desconto', url: '/tapetes/desconto' },
            { name: 'Coleção Inverno', url: '/tapetes/inverno' },
          ],
        },
      ],
      megaImage: {
        quote: '"O tapete certo transforma completamente o ambiente"',
        linkLabel: 'Guia de tamanhos',
        url: '/tapetes/guia-de-tamanhos',
        alt: 'Guia de tamanhos de tapetes',
      },
    },
    { label: 'Cama', url: '/cama' },
    { label: 'Mesa & Cozinha', url: '/mesa-cozinha' },
    { label: 'Banho', url: '/banho' },
    { label: 'Decoração', url: '/decoracao' },
    { label: 'Infantil', url: '/infantil' },
    { label: 'Marcas', url: '/marcas' },
  ] as NavItem[],
  drawerBenefits: [
    { text: 'Frete grátis Sul/Sudeste acima de R$699' },
    { text: 'Até 10× sem juros · 5% de desconto no Pix' },
  ],
  sugestoesPadrao: [
    'tapete sala',
    'jogo de cama',
    'toalha de banho',
    'manta sofá',
    'tapete quarto',
  ],
};

// ── Ícones (traçado do design) ───────────────────────────────────────────────
const SearchIcon = ({ s = 14 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const HeartIcon = ({ s = 20 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const AccountIcon = ({ s = 20 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const CartIcon = ({ s = 20 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ChevronRight = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronUp = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const TruckMini = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="1" y="3" width="15" height="13" />
    <path d="M16 8h4l3 5v4h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const CardMini = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
const WhatsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.5" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 9.76 19.79 19.79 0 0 1 1.64 1.1a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 6.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z" />
  </svg>
);

export default function Header() {
  const { logo } = useLayout();

  const [cartOpen, setCartOpen] = useState(false);
  const cartQtd = 1;

  // topbar rotativa (mobile)
  const [tbIndex, setTbIndex] = useState(0);
  useEffect(() => {
    const n = conteudo.topbarMessages.length;
    if (n <= 1) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const id = setInterval(() => setTbIndex(i => (i + 1) % n), 3000);
    return () => clearInterval(id);
  }, []);

  const [activeMega, setActiveMega] = useState<number | null>(null);
  const closeMega = useCallback(() => setActiveMega(null), []);

  const [term, setTerm] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const sugestoes = buildSearchSuggestions(
    term,
    conteudo.sugestoesPadrao,
    MAX_SUGGESTIONS
  );
  const showSuggest = searchOpen && sugestoes.length > 0;

  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => searchRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [searchOpen]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  const [openCols, setOpenCols] = useState<Record<string, boolean>>({});
  const toggleItem = useCallback(
    (i: number) => setOpenItems(c => ({ ...c, [i]: !c[i] })),
    []
  );
  const toggleCol = useCallback(
    (key: string) => setOpenCols(c => ({ ...c, [key]: !c[key] })),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      closeMega();
      setDrawerOpen(false);
      setSearchOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeMega]);

  const BrandLogo = ({ variant }: { variant: 'd' | 'm' | 'drawer' }) => {
    const logoRole = variant === 'd' ? 'logo' : variant === 'm' ? 'm-logo' : undefined;
    const nameRole =
      variant === 'd' ? 'brand-name' : variant === 'm' ? 'm-brand-name' : undefined;
    const tagRole =
      variant === 'd'
        ? 'brand-tagline'
        : variant === 'm'
          ? 'm-brand-tagline'
          : undefined;
    return (
      <a className={styles.logo} href="/" aria-label="Página inicial" data-role={logoRole}>
        <span className={styles.brandName} data-role={nameRole}>
          {logo ? <img src={logo} alt="Logo" className={styles.brandLogo} /> : 'SERIE//A'}
        </span>
        <span className={styles.brandTagline} data-role={tagRole}>
          casa · conforto · estilo
        </span>
      </a>
    );
  };

  return (
    <div className={styles.header07Root}>
      {/* A casca carrega o container-type; as camadas `position: fixed`
          (busca, drawer, mini-cart) ficam FORA dela. */}
      <div className={styles.headerShell}>
        {/* ══ DESKTOP ══ */}
        <div className={styles.desktop} onMouseLeave={closeMega}>
          <div className={styles.topbar} data-role="topbar" aria-label="Avisos da loja">
            {conteudo.topbarMessages.map((m, i) => (
              <span key={i} className={styles.topbarGroup}>
                {i > 0 && (
                  <span className={styles.topbarSep} aria-hidden="true">
                    |
                  </span>
                )}
                <span className={styles.topbarMsg} data-role="topbar-msg">
                  {m}
                </span>
              </span>
            ))}
          </div>

          <div className={styles.headerStack}>
            <header className={styles.bar} data-role="bar">
              <BrandLogo variant="d" />

              <nav className={styles.nav} data-role="nav" aria-label="Menu principal">
                {conteudo.navItems.map((item, i) =>
                  item.hasMega ? (
                    <button
                      key={i}
                      type="button"
                      className={`${styles.navLink} ${styles.navMega}${activeMega === i ? ` ${styles.active}` : ''}`}
                      data-role="nav-link"
                      aria-expanded={activeMega === i}
                      onMouseEnter={() => setActiveMega(i)}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a
                      key={i}
                      href={item.url ?? '#'}
                      className={`${styles.navLink}${item.highlight ? ` ${styles.navSale}` : ''}`}
                      data-role="nav-link"
                      onMouseEnter={closeMega}
                    >
                      {item.label}
                    </a>
                  )
                )}
              </nav>

              <div className={styles.actions} data-role="actions" onMouseEnter={closeMega}>
                <button
                  type="button"
                  className={styles.searchPill}
                  data-role="search-pill"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Buscar produtos"
                >
                  <SearchIcon s={14} />
                  <span className={styles.searchText} data-role="search-text">
                    {conteudo.searchPlaceholder}
                  </span>
                </button>
                <a
                  href={conteudo.wishlistUrl}
                  className={styles.iconBtn}
                  data-role="wishlist-btn"
                  aria-label="Favoritos"
                >
                  <HeartIcon />
                </a>
                {/* ProfileChallenge na origem: sem sessão aqui, fica o ramo deslogado */}
                <a
                  href="/api/io/login"
                  className={styles.iconBtn}
                  data-role="account-btn"
                  aria-label="Entre ou cadastre-se"
                >
                  <AccountIcon />
                </a>
                <button
                  type="button"
                  className={styles.iconBtn}
                  data-role="cart-btn"
                  onClick={() => setCartOpen(true)}
                  aria-label="Abrir sacola"
                >
                  <CartIcon />
                  <span className={styles.cartBadge} data-role="cart-badge">
                    {cartQtd}
                  </span>
                </button>
              </div>
            </header>

            {conteudo.navItems.map((item, i) =>
              item.hasMega ? (
                <div
                  key={i}
                  className={`${styles.mega}${activeMega === i ? ` ${styles.open}` : ''}`}
                  onMouseEnter={() => setActiveMega(i)}
                  aria-hidden={activeMega !== i}
                >
                  {(item.megaColumns ?? []).map((col, c) => (
                    <div key={c} className={styles.megaCol}>
                      {col.title &&
                        (col.url ? (
                          <a
                            className={styles.megaColTitle}
                            href={col.url}
                            onClick={closeMega}
                          >
                            {col.title}
                          </a>
                        ) : (
                          <p className={styles.megaColTitle}>{col.title}</p>
                        ))}
                      <div className={styles.megaLinks}>
                        {(col.links ?? []).map((link, l) => (
                          <a
                            key={l}
                            href={link.url ?? '#'}
                            className={link.highlight ? styles.megaLinkHi : undefined}
                            onClick={closeMega}
                          >
                            {link.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                  {item.megaImage && (
                    <a
                      className={styles.megaImage}
                      href={item.megaImage.url ?? '#'}
                      onClick={closeMega}
                    >
                      <span className={styles.megaImageCaption}>
                        {item.megaImage.quote && (
                          <span className={styles.megaQuote}>{item.megaImage.quote}</span>
                        )}
                        {item.megaImage.linkLabel && (
                          <span className={styles.megaImageLink}>
                            {item.megaImage.linkLabel} →
                          </span>
                        )}
                      </span>
                    </a>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* ══ MOBILE ══ */}
        <div className={styles.mobile}>
          <div className={styles.mTopbar} data-role="m-topbar" aria-label="Avisos da loja">
            <span className={styles.mTopbarMsg} data-role="m-topbar-msg">
              {conteudo.topbarMessages[tbIndex]}
            </span>
          </div>

          <header className={styles.mBar} data-role="m-bar">
            <button
              type="button"
              className={styles.mHamburger}
              data-role="m-hamburger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={drawerOpen}
            >
              <MenuIcon />
            </button>
            <BrandLogo variant="m" />
            <div className={styles.mActions} data-role="m-actions">
              <button
                type="button"
                className={styles.mIconBtn}
                data-role="m-search-icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Buscar"
              >
                <SearchIcon s={19} />
              </button>
              <button
                type="button"
                className={styles.mIconBtn}
                data-role="m-cart-btn"
                onClick={() => setCartOpen(true)}
                aria-label="Abrir sacola"
              >
                <CartIcon s={19} />
                <span className={styles.mCartBadge} data-role="m-cart-badge">
                  {cartQtd}
                </span>
              </button>
            </div>
          </header>
        </div>
      </div>

      {/* ══ BUSCA (compartilhada) ══ */}
      <div
        className={`${styles.searchOverlay}${searchOpen ? ` ${styles.open}` : ''}`}
        onClick={e => {
          if (e.target === e.currentTarget) setSearchOpen(false);
        }}
      >
        <div className={styles.searchOverlayInner}>
          <form
            className={styles.searchOverlayForm}
            role="search"
            onSubmit={e => {
              e.preventDefault();
              setSearchOpen(false);
            }}
          >
            <SearchIcon s={18} />
            <input
              ref={searchRef}
              type="search"
              placeholder={conteudo.searchPlaceholder}
              value={term}
              onChange={e => setTerm(e.target.value)}
            />
            <button
              type="button"
              className={styles.searchOverlayClose}
              onClick={() => setSearchOpen(false)}
              aria-label="Fechar busca"
            >
              &times;
            </button>
          </form>

          {showSuggest && (
            <div
              className={styles.searchSuggest}
              role="listbox"
              aria-label="Sugestões de busca"
            >
              <div className={styles.suggestGroup}>
                <p className={styles.suggestTitle}>
                  {term.trim() ? 'Sugestões' : 'Mais procurados'}
                </p>
                {sugestoes.map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    className={styles.suggestTerm}
                    onClick={() => {
                      setTerm(t);
                      setSearchOpen(false);
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ DRAWER MOBILE ══ */}
      <div
        className={`${styles.drawerOverlay}${drawerOpen ? ` ${styles.open}` : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <aside
        className={`${styles.drawer}${drawerOpen ? ` ${styles.open}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className={styles.drawerHead}>
          <BrandLogo variant="drawer" />
          <button
            type="button"
            className={styles.drawerClose}
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar menu"
          >
            <CloseIcon />
          </button>
        </div>

        <div className={styles.drawerSearch}>
          <button
            type="button"
            className={styles.mSearchPill}
            onClick={() => {
              setDrawerOpen(false);
              setSearchOpen(true);
            }}
            aria-label="Buscar"
          >
            <SearchIcon s={13} />
            <span className={styles.mSearchText}>{conteudo.searchPlaceholder}</span>
          </button>
        </div>

        <nav className={styles.drawerNav} aria-label="Menu mobile">
          {conteudo.navItems.map((item, i) =>
            item.hasMega ? (
              <div
                key={i}
                className={`${styles.drawerItem} ${styles.drawerAccordion}${openItems[i] ? ` ${styles.open}` : ''}`}
              >
                <button
                  type="button"
                  className={styles.drawerRow}
                  aria-expanded={!!openItems[i]}
                  onClick={() => toggleItem(i)}
                >
                  <span className={styles.drawerLabelActive}>{item.label}</span>
                  {openItems[i] ? <ChevronUp /> : <ChevronRight color="#C8BAA8" />}
                </button>
                <div className={styles.drawerSub}>
                  {(item.megaColumns ?? []).map((col, c) => {
                    const key = `${i}-${c}`;
                    const opened = !!openCols[key];
                    return col.title ? (
                      <div
                        key={c}
                        className={`${styles.drawerCol}${opened ? ` ${styles.open}` : ''}`}
                      >
                        <button
                          type="button"
                          className={styles.drawerColRow}
                          aria-expanded={opened}
                          onClick={() => toggleCol(key)}
                        >
                          <span className={styles.drawerColLabel}>{col.title}</span>
                          {opened ? <ChevronUp /> : <ChevronRight color="#C8BAA8" />}
                        </button>
                        <div className={styles.drawerColSub}>
                          {(col.links ?? []).map((link, l) => (
                            <a
                              key={l}
                              href={link.url ?? '#'}
                              className={link.highlight ? styles.drawerLinkHi : undefined}
                              onClick={() => setDrawerOpen(false)}
                            >
                              {link.name}
                            </a>
                          ))}
                          {col.url && (
                            <a
                              href={col.url}
                              className={styles.drawerSeeAll}
                              onClick={() => setDrawerOpen(false)}
                            >
                              Ver todos
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      (col.links ?? []).map((link, l) => (
                        <a
                          key={`${c}-${l}`}
                          href={link.url ?? '#'}
                          className={link.highlight ? styles.drawerLinkHi : undefined}
                          onClick={() => setDrawerOpen(false)}
                        >
                          {link.name}
                        </a>
                      ))
                    );
                  })}
                  {item.url && (
                    <a
                      href={item.url}
                      className={styles.drawerSeeAll}
                      onClick={() => setDrawerOpen(false)}
                    >
                      Ver todos
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div key={i} className={styles.drawerItem}>
                <a
                  href={item.url ?? '#'}
                  className={styles.drawerRow}
                  onClick={() => setDrawerOpen(false)}
                >
                  <span
                    className={item.highlight ? styles.drawerLabelSale : styles.drawerLabel}
                  >
                    {item.label}
                  </span>
                  <ChevronRight color={item.highlight ? '#C07A5A' : '#C8BAA8'} />
                </a>
              </div>
            )
          )}

          <div className={styles.drawerAccount}>
            <a
              href={conteudo.accountUrl}
              className={styles.drawerAccountRow}
              onClick={() => setDrawerOpen(false)}
            >
              <AccountIcon s={15} />
              <span>Minha conta</span>
            </a>
            <a
              href={conteudo.wishlistUrl}
              className={styles.drawerAccountRow}
              onClick={() => setDrawerOpen(false)}
            >
              <HeartIcon s={15} />
              <span>Favoritos</span>
            </a>
            <a
              href={conteudo.whatsappUrl}
              className={styles.drawerAccountRow}
              onClick={() => setDrawerOpen(false)}
            >
              <WhatsIcon />
              <span>Atendimento WhatsApp</span>
            </a>
          </div>

          <div className={styles.drawerBenefits}>
            {conteudo.drawerBenefits.map((b, i) => (
              <div key={i} className={styles.drawerBenefit}>
                {i === 0 ? <TruckMini /> : <CardMini />}
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </nav>
      </aside>

      <CartSidebar01
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        item={{
          name: 'Tapete Belga Sala Trama Alta 200×250',
          image: 'https://placehold.co/150x150/d4c4b0/2c2420?text=Tapete',
          variations: [
            { label: 'Cor', option: 'Areia' },
            { label: 'Tamanho', option: '200×250' },
          ],
          price: 899.9,
          listPrice: 1099.9,
        }}
      />
    </div>
  );
}

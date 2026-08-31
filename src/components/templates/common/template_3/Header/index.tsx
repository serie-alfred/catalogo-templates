import React, { useEffect, useRef, useState } from 'react';

import styles from './index.module.css';
import { useLayout } from '@/context/LayoutContext';
import CartSidebar01 from '@/components/templates/_shared/CartSidebar01';
import {
  buildSearchSuggestions,
  buildSuggestionProducts,
} from '@/components/templates/_shared/searchSuggestions';

// Preview do Header03 — dados fixos, sem VTEX/GraphQL/hooks.
// Origem: faststore.starter/src/components/organisms/Header03 + as molecules
// que ele compõe (NavBarSearch03, NavDrawer03, SearchOverlay03,
// MiniCartController03) e o mini-cart CartSidebar01.
//
// Comportamento espelhado do componente real: dropdown L2/L3 do menu desktop por
// HOVER (é CSS puro no .starter), autocomplete ao focar o campo de busca, drawer
// mobile com accordions de dois níveis e overlay de busca que desce do topo. No
// card do gerador o template fica inerte (pointer-events: none em SortableItem)
// — a interação acontece no link de preview /p/{id}.

const data = {
  topbarItems: [
    'Frete grátis acima de R$ 350',
    'Trocas fáceis em até 30 dias',
    'Pagamento seguro',
    'Novos drops toda semana',
  ],
  searchPlaceholder: 'Buscar produtos, coleções, drops…',
  trendingLinks: [
    { label: 'Oversized', link: '#' },
    { label: 'Cargo', link: '#' },
    { label: 'Corta-vento', link: '#' },
    { label: 'Drop 06', link: '#' },
  ],
  topSearches: [
    'camiseta oversized',
    'moletom com capuz',
    'calça cargo',
    'jaqueta corta-vento',
    'boné trucker',
  ],
  menu: [
    {
      label: 'Novidades',
      link: '#',
      itensLevel1: [
        { label: 'Lançamentos da semana', link: '#' },
        { label: 'Pré-venda', link: '#' },
        { label: 'Últimas unidades', link: '#' },
      ],
    },
    {
      label: 'Camisetas',
      link: '#',
      itensLevel1: [
        {
          label: 'Modelagem',
          link: '#',
          itensLevel2: [
            { label: 'Oversized', link: '#' },
            { label: 'Regular', link: '#' },
            { label: 'Cropped', link: '#' },
          ],
        },
        {
          label: 'Estampas',
          link: '#',
          itensLevel2: [
            { label: 'Lisas', link: '#' },
            { label: 'Gráficas', link: '#' },
            { label: 'Colaborações', link: '#' },
          ],
        },
        { label: 'Ver tudo', link: '#' },
      ],
    },
    {
      label: 'Moletons',
      link: '#',
      itensLevel1: [
        { label: 'Com capuz', link: '#' },
        { label: 'Careca', link: '#' },
        { label: 'Zíper', link: '#' },
      ],
    },
    {
      label: 'Calças',
      link: '#',
      itensLevel1: [
        { label: 'Cargo', link: '#' },
        { label: 'Jeans', link: '#' },
        { label: 'Moletom', link: '#' },
      ],
    },
    { label: 'Jaquetas', link: '#' },
    { label: 'Acessórios', link: '#' },
    { label: 'Sale', link: '#', isSale: true, saleLabel: 'até 50% off' },
  ],
};

// O preview não navega: os links existem (markup igual ao do tema) mas não saem
// da página do preview.
const preventNav = (e: React.MouseEvent) => e.preventDefault();

const ChevDown = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const ChevRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="m9 6 6 6-6 6" />
  </svg>
);

const SearchGlyph = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

const ClockGlyph = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const AccountGlyph = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
  </svg>
);

const HeartGlyph = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
    />
  </svg>
);

const BagGlyph = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
    <path d="M5 8h14l-1.2 11.2A2 2 0 0 1 15.8 21H8.2a2 2 0 0 1-2-1.8L5 8Z" />
    <path d="M9 8V6.5a3 3 0 1 1 6 0V8" />
  </svg>
);

const HeaderNovo = () => {
  const { logo } = useLayout();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [term, setTerm] = useState('');
  const [overlayTerm, setOverlayTerm] = useState('');
  const [openL1, setOpenL1] = useState<number | null>(null);
  const [openL2, setOpenL2] = useState<number | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const overlayInputRef = useRef<HTMLInputElement>(null);

  const cartCount = 1;

  // Trava o scroll enquanto o drawer/overlay está aberto.
  useEffect(() => {
    const lock = drawerOpen || searchOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen, searchOpen]);

  // Clique fora fecha o autocomplete; ESC fecha tudo.
  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownVisible(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setDropdownVisible(false);
      setDrawerOpen(false);
      setSearchOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // Foca o input ao abrir o overlay de busca.
  useEffect(() => {
    if (!searchOpen) return;
    const t = setTimeout(() => overlayInputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [searchOpen]);

  // Reseta os accordions ao fechar o drawer.
  useEffect(() => {
    if (drawerOpen) return;
    setOpenL1(null);
    setOpenL2(null);
  }, [drawerOpen]);

  const toggleL1 = (i: number) => {
    setOpenL1(prev => (prev === i ? null : i));
    setOpenL2(null);
  };
  const toggleL2 = (j: number) => setOpenL2(prev => (prev === j ? null : j));

  const suggestions = buildSearchSuggestions(term, data.topSearches);
  const suggestionProducts = term.trim() ? buildSuggestionProducts(term) : [];

  const overlaySuggestions = buildSearchSuggestions(overlayTerm, data.topSearches);
  const overlayProducts = overlayTerm.trim() ? buildSuggestionProducts(overlayTerm) : [];

  const brand = logo ? (
    <img src={logo} alt="Logo" className={styles.logoImg} />
  ) : (
    <>
      SERIE<span className={styles.logoDot}>{'//'}</span>A
    </>
  );

  // Marquee infinito: o track tem MARQUEE_GROUPS grupos idÃªnticos e a animaÃ§Ã£o
  // avanÃ§a exatamente um grupo (translateX(-50%) com 2 grupos), entÃ£o a emenda Ã©
  // invisÃ­vel. MARQUEE_REPEATS existe para um grupo sozinho ser mais largo que a
  // tela â com pouco conteÃºdo, sobra Ã¡rea vazia no fim do ciclo e a faixa pisca.
  const MARQUEE_GROUPS = 2;
  const MARQUEE_REPEATS = 4;

  return (
    <div className={styles.header03Root}>
      <header className={styles.siteHeader} role="banner">
        {/* ── TOPBAR ── */}
        <div className={styles.topbar} aria-label="Avisos da loja">
          <div className={styles.topbarTrack}>
            {Array.from({ length: MARQUEE_GROUPS }).map((_, group) => (
              <div key={group} className={styles.topbarGroup}>
                {Array.from({ length: MARQUEE_REPEATS }).map((_, repeat) =>
                  data.topbarItems.map((item, i) => (
                    <span
                      key={`${group}-${repeat}-${i}`}
                      className={styles.topbarItem}
                      // sÃ³ a 1Âª passada Ã© anunciada; o resto Ã© duplicata visual
                      aria-hidden={group > 0 || repeat > 0 || undefined}
                    >
                      {item}
                    </span>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── HEADER DESKTOP ── */}
        <div className={styles.headerMain}>
          <a
            href="#"
            className={styles.logo}
            onClick={preventNav}
            aria-label="SERIE//A — página inicial"
          >
            {brand}
          </a>

          <div className={styles.search} ref={searchRef}>
            <form role="search" onSubmit={e => e.preventDefault()}>
              <input
                className={styles.searchInput}
                type="search"
                placeholder={data.searchPlaceholder}
                aria-label="Buscar produtos"
                value={term}
                onChange={e => setTerm(e.target.value)}
                onFocus={() => setDropdownVisible(true)}
              />
              <SearchGlyph className={styles.searchIcon} />
            </form>

            {dropdownVisible && (
              <div className={styles.searchDropdown}>
                <p className={styles.searchSectionTitle}>
                  {term.trim() ? 'Sugestões' : 'Mais procurados'}
                </p>
                <ul className={styles.searchTermList}>
                  {suggestions.map((s, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        className={styles.searchTermItem}
                        onClick={() => setTerm(s)}
                      >
                        {term.trim() ? <SearchGlyph /> : <ClockGlyph />}
                        <span>{s}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                {!term.trim() && (
                  <div className={styles.searchTrending}>
                    <p className={styles.searchSectionTitle}>Em alta</p>
                    <div className={styles.searchTagList}>
                      {data.trendingLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.link}
                          className={styles.searchTag}
                          onClick={preventNav}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {suggestionProducts.length > 0 && (
                  <div className={styles.searchProducts}>
                    <p className={styles.searchSectionTitle}>Produtos sugeridos</p>
                    <ul className={styles.searchProductList}>
                      {suggestionProducts.map((product, i) => (
                        <li key={i}>
                          <a
                            href="#"
                            className={styles.searchProductLink}
                            onClick={preventNav}
                          >
                            <div className={styles.searchProductImage}>
                              <img src={product.image} alt={product.name} />
                            </div>
                            <div className={styles.searchProductInfo}>
                              <span className={styles.searchProductName}>
                                {product.name}
                              </span>
                              <span className={styles.searchProductPrice}>
                                {product.price}
                              </span>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.headerActions}>
            <a href="#" className={styles.action} onClick={preventNav} aria-label="Minha conta">
              <AccountGlyph className={styles.actionIcon} />
              <span className={styles.actionLabel}>Entrar</span>
            </a>

            <a href="#" className={styles.action} onClick={preventNav} aria-label="Wishlist">
              <HeartGlyph className={styles.actionIcon} />
            </a>

            <button
              type="button"
              className={styles.action}
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir carrinho, ${cartCount} item`}
            >
              <BagGlyph className={styles.actionIcon} />
              <span className={styles.cartCount} aria-hidden="true">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* ── NAV DESKTOP (dropdown L2/L3 por hover) ── */}
        <nav className={styles.nav} aria-label="Categorias">
          <ul className={styles.navList}>
            {data.menu.map((item, i) => {
              const level1 = item.itensLevel1 ?? [];
              return (
                <li key={i} className={styles.l1Item}>
                  <a
                    className={`${styles.navLink}${item.isSale ? ` ${styles.navLinkSale}` : ''}`}
                    href={item.link}
                    onClick={preventNav}
                  >
                    {item.isSale && (
                      <span className={styles.navSaleDot} aria-hidden="true" />
                    )}
                    {item.label}
                    {level1.length > 0 && <ChevDown className={styles.navChev} />}
                  </a>

                  {level1.length > 0 && (
                    <div className={styles.dropdown}>
                      <ul className={styles.dropdownList}>
                        {level1.map((l2, j) => {
                          const level2 = l2.itensLevel2 ?? [];
                          return (
                            <li key={j} className={styles.l2Item}>
                              <a className={styles.l2Link} href={l2.link} onClick={preventNav}>
                                {l2.label}
                                {level2.length > 0 && (
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    aria-hidden="true"
                                  >
                                    <path d="m9 6 6 6-6 6" />
                                  </svg>
                                )}
                              </a>
                              {level2.length > 0 && (
                                <ul className={styles.l3List}>
                                  {level2.map((l3, k) => (
                                    <li key={k}>
                                      <a
                                        className={styles.l3Link}
                                        href={l3.link}
                                        onClick={preventNav}
                                      >
                                        {l3.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── HEADER MOBILE ── */}
        <div className={styles.headerMobile}>
          <div className={styles.headerMobileLeft}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={drawerOpen}
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
                <path d="M4 7h16" />
                <path d="M4 17h16" />
              </svg>
            </button>
          </div>

          <a
            href="#"
            className={styles.logo}
            onClick={preventNav}
            aria-label="SERIE//A — página inicial"
          >
            {brand}
          </a>

          <div className={styles.headerMobileRight}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
            >
              <SearchGlyph />
            </button>
            <a href="#" className={styles.iconBtn} onClick={preventNav} aria-label="Wishlist">
              <HeartGlyph />
            </a>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => setCartOpen(true)}
              aria-label={`Abrir carrinho, ${cartCount} item`}
            >
              <BagGlyph />
              <span className={styles.cartCount} aria-hidden="true">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── DRAWER MOBILE (NavDrawer03) ── */}
      <div
        className={`${styles.ndOverlay}${drawerOpen ? ` ${styles.ndOpen}` : ''}`}
        aria-hidden={!drawerOpen}
      >
        <div className={styles.ndBackdrop} onClick={() => setDrawerOpen(false)} />

        <aside
          className={styles.ndDrawer}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          <div className={styles.ndTop}>
            <span className={styles.ndLogo}>
              {logo ? (
                <img src={logo} alt="Logo" className={styles.ndLogoImg} />
              ) : (
                <>
                  SERIE<span className={styles.logoDot}>{'//'}</span>A
                </>
              )}
            </span>
            <button
              type="button"
              className={styles.ndClose}
              onClick={() => setDrawerOpen(false)}
              aria-label="Fechar menu"
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
                <path d="M6 6l12 12" />
                <path d="M18 6 6 18" />
              </svg>
            </button>
          </div>

          <nav className={styles.ndNav}>
            {data.menu.map((item, i) => {
              const level1 = item.itensLevel1 ?? [];
              const isOpenL1 = openL1 === i;
              return (
                <div key={i} className={styles.ndL1Item}>
                  {level1.length > 0 ? (
                    <button
                      type="button"
                      className={`${styles.ndL1Row}${isOpenL1 ? ` ${styles.ndL1Open}` : ''}`}
                      onClick={() => toggleL1(i)}
                      aria-expanded={isOpenL1}
                    >
                      <span className={styles.ndL1Label}>
                        {item.isSale && (
                          <span className={styles.ndSaleDot} aria-hidden="true" />
                        )}
                        {item.label}
                      </span>
                      {item.saleLabel && (
                        <span className={styles.ndSaleTag}>{item.saleLabel}</span>
                      )}
                      <span
                        className={`${styles.ndL1Chev}${isOpenL1 ? ` ${styles.ndChevOpen}` : ''}`}
                      >
                        <ChevRight />
                      </span>
                    </button>
                  ) : (
                    <a href={item.link} className={styles.ndL1Row} onClick={preventNav}>
                      <span className={styles.ndL1Label}>
                        {item.isSale && (
                          <span className={styles.ndSaleDot} aria-hidden="true" />
                        )}
                        {item.label}
                      </span>
                      {item.saleLabel && (
                        <span className={styles.ndSaleTag}>{item.saleLabel}</span>
                      )}
                    </a>
                  )}

                  {isOpenL1 && level1.length > 0 && (
                    <div className={styles.ndL2Panel}>
                      {level1.map((l2, j) => {
                        const level2 = l2.itensLevel2 ?? [];
                        const isOpenL2 = openL2 === j;
                        return (
                          <div key={j} className={styles.ndL2Item}>
                            {level2.length > 0 ? (
                              <button
                                type="button"
                                className={`${styles.ndL2Row}${isOpenL2 ? ` ${styles.ndL2Open}` : ''}`}
                                onClick={() => toggleL2(j)}
                                aria-expanded={isOpenL2}
                              >
                                <span className={styles.ndL2Label}>{l2.label}</span>
                                <span
                                  className={`${styles.ndL2Chev}${isOpenL2 ? ` ${styles.ndChevOpen}` : ''}`}
                                >
                                  <ChevRight />
                                </span>
                              </button>
                            ) : (
                              <a
                                href={l2.link}
                                className={styles.ndL2Row}
                                onClick={preventNav}
                              >
                                <span className={styles.ndL2Label}>{l2.label}</span>
                              </a>
                            )}

                            {isOpenL2 && level2.length > 0 && (
                              <div className={styles.ndL3Panel}>
                                {level2.map((l3, k) => (
                                  <a
                                    key={k}
                                    href={l3.link}
                                    className={styles.ndL3Link}
                                    onClick={preventNav}
                                  >
                                    {l3.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <footer className={styles.ndFoot}>
            <a href="#" className={styles.ndFootLink} onClick={preventNav}>
              <AccountGlyph />
              Entrar · Minha conta
            </a>
            <a href="#" className={styles.ndFootLink} onClick={preventNav}>
              <HeartGlyph />
              Wishlist
            </a>
            <a href="#" className={styles.ndFootLink} onClick={preventNav}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 21l1.9-5.4A8.5 8.5 0 1 1 21 11.5Z" />
              </svg>
              Atendimento
            </a>
          </footer>
        </aside>
      </div>

      {/* ── OVERLAY DE BUSCA (SearchOverlay03) ── */}
      <div
        className={`${styles.soOverlay}${searchOpen ? ` ${styles.soOpen}` : ''}`}
        aria-hidden={!searchOpen}
      >
        <div className={styles.soBackdrop} onClick={() => setSearchOpen(false)} />

        <section
          className={styles.soPanel}
          role="dialog"
          aria-modal="true"
          aria-label="Buscar"
        >
          <div className={styles.soTop}>
            <div className={styles.soFieldWrap}>
              <SearchGlyph className={styles.soIcon} />
              <form className={styles.soForm} onSubmit={e => e.preventDefault()}>
                <input
                  ref={overlayInputRef}
                  type="search"
                  className={styles.soInput}
                  placeholder={data.searchPlaceholder}
                  value={overlayTerm}
                  onChange={e => setOverlayTerm(e.target.value)}
                  autoComplete="off"
                  aria-label="Buscar produtos"
                />
              </form>
            </div>
            <button
              type="button"
              className={styles.soCancel}
              onClick={() => setSearchOpen(false)}
            >
              Cancelar
            </button>
          </div>

          <div className={styles.soBody}>
            <p className={styles.soLabel}>
              {overlayTerm.trim() ? 'Sugestões' : 'Mais procurados'}
            </p>
            <ul className={styles.soList}>
              {overlaySuggestions.map((s, i) => (
                <li
                  key={i}
                  className={styles.soItem}
                  onClick={() => setOverlayTerm(s)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setOverlayTerm(s)}
                >
                  {overlayTerm.trim() ? <SearchGlyph /> : <ClockGlyph />}
                  {s}
                </li>
              ))}
            </ul>

            {overlayProducts.length > 0 && (
              <>
                <p className={styles.soLabel}>Produtos</p>
                <ul className={styles.soProductList}>
                  {overlayProducts.map((product, i) => (
                    <li key={i} className={styles.soProductItem}>
                      <a href="#" className={styles.soProductLink} onClick={preventNav}>
                        <div className={styles.soProductImage}>
                          <img src={product.image} alt={product.name} />
                        </div>
                        <div className={styles.soProductInfo}>
                          <span className={styles.soProductName}>{product.name}</span>
                          <span className={styles.soProductPrice}>{product.price}</span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {!overlayTerm.trim() && (
              <>
                <p className={styles.soLabel}>Em alta</p>
                <div className={styles.soTags}>
                  {data.trendingLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.link}
                      className={styles.soTag}
                      onClick={preventNav}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* ── MINI-CART (CartSidebar01, igual ao .starter) ── */}
      <CartSidebar01 open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default HeaderNovo;

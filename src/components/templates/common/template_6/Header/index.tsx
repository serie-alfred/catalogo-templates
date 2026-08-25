import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './index.module.css';
import { useLayout } from '@/context/LayoutContext';
import CartSidebar06 from '@/components/templates/_shared/CartSidebar06';
import {
  buildSearchSuggestions,
  buildSuggestionProducts,
} from '@/components/templates/_shared/searchSuggestions';

// Preview do Header06 — dados fixos, sem VTEX/GraphQL/hooks.
// Espelha faststore.starter/src/components/organisms/Header06 (index.tsx +
// style.module.scss) e o grafo que ele monta: mega-menu por HOVER (CSS puro),
// autocomplete com "Buscar por «termo»" + buscas escopadas por departamento +
// produtos com miniatura, drawer mobile full-screen com accordions de dois
// níveis, e o mini-cart CartSidebar06 (com barra de frete grátis, simulador de
// CEP e cupom).
//
// Divergências deliberadas (ver também o topo do index.module.css):
//  - .headerShell carrega o container-type; as camadas em position: fixed ficam
//    fora dela, senão a contenção do @container as prenderia ao header.
//  - As camadas NÃO são portaladas para o <body> como no .starter: lá o portal
//    existe para escapar do stacking context criado pelo `position: sticky` da
//    raiz, que aqui não existe (quem fixa o header no preview é o wrapper
//    .preview-sticky-header). E portalar para o body tiraria as camadas de baixo
//    do wrapper que carrega as CSS vars do tema — elas perderiam a cor toda.
//  - `<header06>` do .starter é um elemento inválido (find/replace acidental de
//    `header` → `header06`); aqui é `<header>`.
//  - Os SVGs do .starter têm stroke="#212721" fixo; aqui é currentColor.
//  - Logo dinâmico via useLayout() com fallback "SERIE//A".
//
// No card do gerador o template fica inerte (pointer-events: none em
// SortableItem) — a interação acontece no link de preview /p/{id}.

interface TopbarMessage {
  text: React.ReactNode;
  icon?: boolean;
}

const topbarMessages: TopbarMessage[] = [
  { text: 'PIX Parcelado em 4x sem juros' },
  {
    text: (
      <>
        <strong>Frete Grátis</strong> Sul e Sudeste acima de <strong>R$249,90</strong>
      </>
    ),
    icon: true,
  },
  { text: 'Frete Grátis Brasil acima de R$349,90*' },
  { text: 'Cartão de crédito até 10x sem juros' },
  {
    text: (
      <>
        Use o cupom <strong>BEMVINDO10</strong> na primeira compra
      </>
    ),
  },
];

const data = {
  searchPlaceholder: 'O que você procura?',
  quickSearch: ['Sapatênis', 'Sapatos', 'Botas', 'Sneakers', 'Mocassins'],
  /** Departamentos usados nas buscas escopadas do autocomplete ("sapato Calçados"). */
  departments: ['Calçados', 'Acessórios'],
  storesUrl: '#',
  wishlistUrl: '#',
  navItems: [
    {
      label: 'Calçados',
      url: '#',
      hasMega: true,
      megaColumns: [
        {
          title: 'Tipos de calçados',
          links: [
            { name: 'Sapatos', url: '#' },
            { name: 'Sapatênis', url: '#' },
            { name: 'Botas', url: '#' },
            { name: 'Sneakers', url: '#' },
            { name: 'Mocassins e Sandálias', url: '#' },
            { name: 'Ver todos', url: '#' },
          ],
        },
        {
          title: 'Linhas',
          links: [
            { name: 'Speed', url: '#' },
            { name: 'Impulse', url: '#' },
            { name: 'Flip Classic', url: '#' },
            { name: 'Star', url: '#' },
            { name: 'Vox', url: '#' },
            { name: 'London', url: '#' },
            { name: 'Ver todos', url: '#' },
          ],
        },
        {
          title: 'Destaques',
          links: [
            { name: 'Out/Inverno', url: '#' },
            { name: 'Namorados', url: '#' },
            { name: 'Dia dos Pais', url: '#' },
            { name: "Verão'26", url: '#' },
            { name: 'Natal', url: '#' },
            { name: 'Alto Verão', url: '#' },
            { name: 'Ver todos', url: '#' },
          ],
        },
        {
          title: 'Ocasiões',
          links: [
            { name: 'Lançamentos', url: '#' },
            { name: 'Dia A Dia', url: '#' },
            { name: 'Tênis Brancos', url: '#' },
            { name: 'Best Sellers', url: '#' },
            { name: 'Sapatos Para Trabalho', url: '#' },
            { name: 'Ver todos', url: '#' },
          ],
        },
      ],
      megaImage: {
        src: 'https://placehold.co/380x300',
        srcMobile: 'https://placehold.co/600x300',
        alt: 'Coleção de calçados',
        url: '#',
      },
    },
    {
      label: 'Acessórios',
      url: '#',
      hasMega: true,
      megaColumns: [
        {
          title: '',
          links: [
            { name: 'Carteiras', url: '#' },
            { name: 'Cintos', url: '#' },
            { name: 'Meias', url: '#' },
            { name: 'Mochilas', url: '#' },
            { name: 'Conservador de calçados', url: '#' },
            { name: 'Ver todos', url: '#' },
          ],
        },
      ],
      megaImage: {
        src: 'https://placehold.co/380x300',
        srcMobile: 'https://placehold.co/600x300',
        alt: 'Acessórios',
        url: '#',
      },
    },
    { label: 'Explorar', url: '#', hasMega: false },
    { label: 'SALE', url: '#', hasMega: false, highlight: true },
  ],
  mobileLinks: [
    { label: 'Rastrear Pedido', url: '#', icon: 'track' as const },
    { label: 'Fale Conosco', url: '#', icon: 'chat' as const },
    { label: 'Trocas e Devoluções', url: '#', icon: 'return' as const },
    { label: 'Favoritos', url: '#', icon: 'heart' as const },
    { label: 'Nossas lojas', url: '#', icon: 'pin' as const },
    { label: 'Seja um Franquiado', url: '#', icon: 'franchise' as const },
  ],
};

// O preview não navega: os links existem (markup igual ao do tema) mas não saem
// da página do preview.
const preventNav = (e: React.MouseEvent) => e.preventDefault();

// ── Ícones ──

const SearchIcon = () => (
  <svg
    className={styles.icon}
    width="20"
    height="20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.75 15C12.2018 15 15 12.2018 15 8.75 15 5.29822 12.2018 2.5 8.75 2.5 5.29822 2.5 2.5 5.29822 2.5 8.75 2.5 12.2018 5.29822 15 8.75 15zM13.1694 13.1696L17.4999 17.5" />
    </g>
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
  <svg
    className={styles.icon}
    width="20"
    height="20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 12.5C12.7614 12.5 15 10.2614 15 7.5 15 4.73858 12.7614 2.5 10 2.5 7.23858 2.5 5 4.73858 5 7.5 5 10.2614 7.23858 12.5 10 12.5zM2.5 16.875C4.01328 14.2602 6.76172 12.5 10 12.5 13.2383 12.5 15.9867 14.2602 17.5 16.875" />
    </g>
  </svg>
);

const CartIcon = () => (
  <svg
    className={styles.icon}
    width="20"
    height="20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.3805 5.625H3.61953C3.46591 5.62498 3.31758 5.68112 3.20247 5.78285C3.08736 5.88458 3.0134 6.02488 2.99453 6.17734L1.88125 15.5523C1.87096 15.6403 1.87947 15.7295 1.90624 15.8139C1.933 15.8983 1.9774 15.9761 2.0365 16.0421C2.09559 16.108 2.16804 16.1607 2.24902 16.1965C2.33001 16.2324 2.41769 16.2506 2.50625 16.25H17.4938C17.5823 16.2506 17.67 16.2324 17.751 16.1965C17.832 16.1607 17.9044 16.108 17.9635 16.0421C18.0226 15.9761 18.067 15.8983 18.0938 15.8139C18.1205 15.7295 18.1291 15.6403 18.1188 15.5523L17.0055 6.17734C16.9866 6.02488 16.9126 5.88458 16.7975 5.78285C16.6824 5.68112 16.5341 5.62498 16.3805 5.625Z" />
      <path d="M6.875 8.125V5C6.875 4.1712 7.20424 3.37634 7.79029 2.79029C8.37634 2.20424 9.1712 1.875 10 1.875C10.8288 1.875 11.6237 2.20424 12.2097 2.79029C12.7958 3.37634 13.125 4.1712 13.125 5V8.125" />
    </g>
  </svg>
);

const TopbarTruckIcon = () => (
  <svg className={styles.topbarIcon} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

// Chevron: aponta para a direita quando fechado; gira 90° (para baixo) quando aberto.
const ChevronIcon = () => (
  <svg
    className={`${styles.icon} ${styles.navChevron}`}
    viewBox="0 0 16 16"
    aria-hidden="true"
  >
    <path d="M6 4l4 4-4 4" />
  </svg>
);

// ── Ícones dos atalhos do rodapé (menu mobile) ──

const TrackIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M16.5 9.4L7.5 4.21" />
    <path d="M21 16V8C21 7.65 20.91 7.3 20.73 7C20.56 6.7 20.3 6.44 20 6.26L13 2.26C12.7 2.09 12.35 2 12 2C11.65 2 11.3 2.09 11 2.26L4 6.26C3.7 6.44 3.44 6.7 3.27 7C3.09 7.3 3 7.65 3 8V16C3 16.35 3.09 16.7 3.27 17C3.44 17.3 3.7 17.56 4 17.74L11 21.74C11.3 21.91 11.65 22 12 22C12.35 22 12.7 21.91 13 21.74L20 17.74C20.3 17.56 20.56 17.3 20.73 17C20.91 16.7 21 16.35 21 16Z" />
    <path d="M3.27 6.96L12 12.01L20.73 6.96" />
    <path d="M12 22.08V12" />
  </svg>
);

const ChatIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M21 11.5C21 12.82 20.7 14.12 20.1 15.3C19.39 16.71 18.31 17.9 16.97 18.73C15.63 19.56 14.08 20 12.5 20C11.18 20 9.88 19.7 8.7 19.1L3 21L4.9 15.3C4.3 14.12 4 12.82 4 11.5C4 9.92 4.44 8.37 5.27 7.03C6.1 5.69 7.29 4.61 8.7 3.9C9.88 3.3 11.18 3 12.5 3H13C15.08 3.12 17.05 3.99 18.53 5.47C20.01 6.95 20.89 8.92 21 11V11.5Z" />
  </svg>
);

const ReturnIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M17 1L21 5L17 9" />
    <path d="M3 11V9C3 7.94 3.42 6.92 4.17 6.17C4.92 5.42 5.94 5 7 5H21" />
    <path d="M7 23L3 19L7 15" />
    <path d="M21 13V15C21 16.06 20.58 17.08 19.83 17.83C19.08 18.58 18.06 19 17 19H3" />
  </svg>
);

const FranchiseIcon = () => (
  <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M17 21V19C17 17.94 16.58 16.92 15.83 16.17C15.08 15.42 14.06 15 13 15H5C3.94 15 2.92 15.42 2.17 16.17C1.42 16.92 1 17.94 1 19V21" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21V19C23 18.11 22.7 17.25 22.16 16.55C21.62 15.85 20.86 15.35 20 15.13" />
    <path d="M16 3.13C16.86 3.35 17.62 3.85 18.17 4.55C18.71 5.26 19.01 6.12 19.01 7C19.01 7.89 18.71 8.76 18.17 9.46C17.62 10.16 16.86 10.66 16 10.88" />
  </svg>
);

type MobileLinkIconName = 'track' | 'chat' | 'return' | 'heart' | 'pin' | 'franchise';

const MobileLinkIcon = ({ name }: { name?: MobileLinkIconName }) => {
  switch (name) {
    case 'chat':
      return <ChatIcon />;
    case 'return':
      return <ReturnIcon />;
    case 'heart':
      return <HeartIcon />;
    case 'pin':
      return <PinIcon />;
    case 'franchise':
      return <FranchiseIcon />;
    default:
      return <TrackIcon />;
  }
};

export default function Header06() {
  const { logo } = useLayout();

  // ── Top-bar slider (deslize horizontal, loop contínuo via clone) ──
  // tbIndex vai de 0..messages.length; a posição `length` é o clone do 1º slide.
  // Ao chegar no clone, dá um "snap" sem animação de volta ao 0 → loop sem emenda.
  const msgs = topbarMessages;
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

  // ── Mega-menu: 100% CSS (:hover no .navItem). Sem estado JS. ──

  // ── Busca (dropdown desktop + overlay mobile) ──
  const [term, setTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!mobileSearchOpen) return;
    const t = setTimeout(() => mobileSearchRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [mobileSearchOpen]);

  const closeSearch = useCallback(() => {
    setSearchFocused(false);
    setMobileSearchOpen(false);
  }, []);

  // ── Drawer mobile ──
  // Acordeão nível 1 (itens de topo) e nível 2 (colunas do mega, chave `${i}-${c}`).
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMobileItems, setOpenMobileItems] = useState<Record<number, boolean>>({});
  const [openMobileCols, setOpenMobileCols] = useState<Record<string, boolean>>({});
  const toggleMobileItem = useCallback(
    (i: number) => setOpenMobileItems(curr => ({ ...curr, [i]: !curr[i] })),
    []
  );
  const toggleMobileCol = useCallback(
    (key: string) => setOpenMobileCols(curr => ({ ...curr, [key]: !curr[key] })),
    []
  );

  // ── Mini-cart ──
  const [cartOpen, setCartOpen] = useState(false);
  const cartQtd = 1;

  // ── Trava de scroll do body ──
  useEffect(() => {
    const lock = mobileOpen || mobileSearchOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, mobileSearchOpen]);

  // ── ESC fecha tudo ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMobileOpen(false);
      setMobileSearchOpen(false);
      setSearchFocused(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const typed = term.trim();
  const suggestionProducts = typed ? buildSuggestionProducts(term) : [];
  const quickSuggestions = buildSearchSuggestions('', data.quickSearch);

  /**
   * Autocomplete — mesma estrutura da origem: "Buscar por «termo»", as buscas
   * escopadas por departamento ("sapato Calçados") e os produtos com miniatura.
   */
  const dropdownContent = typed ? (
    <div className={styles.searchSuggestions}>
      <button
        type="button"
        className={styles.searchSuggestionRow}
        onClick={() => setTerm(typed)}
      >
        {/* `{' '}` explícito: o espaço literal em JSX some se o formatador quebrar
            a linha, e aqui ele é o único separador visível. */}
        Buscar por <span className={styles.searchQuoted}>&quot;{typed}&quot;</span>
      </button>

      {data.departments.map(department => (
        <button
          key={department}
          type="button"
          className={styles.searchSuggestionRow}
          onClick={() => setTerm(`${typed} ${department}`)}
        >
          {typed} <span className={styles.searchScope}>{department}</span>
        </button>
      ))}

      {suggestionProducts.map((product, i) => (
        <a
          key={i}
          className={styles.searchProduct}
          href="#"
          onClick={e => {
            preventNav(e);
            closeSearch();
          }}
        >
          <span className={styles.searchProductThumb}>
            <img src={product.image} alt="" width={50} height={50} loading="lazy" />
          </span>
          <span className={styles.searchProductName}>{product.name}</span>
        </a>
      ))}
    </div>
  ) : (
    <div className={styles.searchSuggestions}>
      <span className={styles.searchSuggestionsLabel}>Mais buscados</span>
      {quickSuggestions.map((q, i) => (
        <button
          key={i}
          type="button"
          className={styles.searchSuggestionRow}
          onClick={() => setTerm(q)}
        >
          {q}
        </button>
      ))}
    </div>
  );

  const Logo = () => (
    <a
      className={styles.logo}
      href="/"
      onClick={preventNav}
      aria-label="- página inicial"
    >
      {logo ? (
        <img src={logo} alt="Logo da loja" />
      ) : (
        <span className={styles.logoMark} role="img" aria-label="Logo da loja">
          SERIE//A
        </span>
      )}
    </a>
  );

  return (
    <div className={styles.header06Root}>
      {/* .headerShell concentra o container-type: as camadas em position: fixed
          (overlay de busca, drawer, mini-cart) ficam FORA dela. */}
      <div className={styles.headerShell}>
        {/* ── TOP-BAR (slider) ── */}
        <div className={styles.topbar} aria-label="Avisos da loja">
          <div
            className={`${styles.topbarTrack}${tbNoAnim ? ` ${styles.noAnim}` : ''}`}
            style={{ transform: `translateX(-${tbIndex * 100}%)` }}
          >
            {[...msgs, msgs[0]].map((m, i) => (
              <p key={i} className={styles.topbarSlide}>
                {m.icon && <TopbarTruckIcon />}
                <span>{m.text}</span>
              </p>
            ))}
          </div>
        </div>

        {/* ── HEADER PRINCIPAL + MEGA (hover CSS) ── */}
        <div className={styles.header06Stack}>
          <header className={styles.bar}>
            <div className={styles.barInner}>
              <button
                type="button"
                className={`${styles.hamburger}${mobileOpen ? ` ${styles.open}` : ''}`}
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menu"
                aria-expanded={mobileOpen}
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <g
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3.125 10H16.875M3.125 5H16.875M3.125 15H16.875" />
                  </g>
                </svg>
              </button>

              <Logo />

              <nav className={styles.desktopNav} aria-label="Menu principal">
                {data.navItems.map((item, i) =>
                  item.hasMega ? (
                    <div key={i} className={styles.navItem}>
                      {/* No DESKTOP o item com mega NÃO navega — é só o gatilho do
                          painel, por isso é <span> e não <a>/<button>. */}
                      <span className={styles.navTrigger}>{item.label}</span>

                      {/* ── MEGA PANEL (aparece via .navItem:hover — CSS puro) ── */}
                      <div className={styles.megaMenu}>
                        <div className={styles.megaGrid}>
                          {(item.megaColumns ?? []).map((col, c) => (
                            <div key={c} className={styles.megaCol}>
                              {col.title && <h3>{col.title}</h3>}
                              {col.links.map((link, l) => (
                                <a
                                  key={l}
                                  href={link.url}
                                  onClick={preventNav}
                                  className={
                                    link.name.toUpperCase() === 'VER TODOS'
                                      ? styles.megaAll
                                      : undefined
                                  }
                                >
                                  {link.name}
                                </a>
                              ))}
                            </div>
                          ))}
                          {item.megaImage?.src && (
                            <a
                              className={styles.megaImage}
                              href={item.megaImage.url}
                              onClick={preventNav}
                            >
                              <img
                                loading="lazy"
                                src={item.megaImage.src}
                                alt={item.megaImage.alt}
                              />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <a
                      key={i}
                      href={item.url}
                      onClick={preventNav}
                      className={item.highlight ? styles.navSale : undefined}
                    >
                      {item.label}
                    </a>
                  )
                )}
              </nav>

              <form
                className={styles.searchPill}
                role="search"
                onSubmit={e => e.preventDefault()}
              >
                <input
                  type="search"
                  placeholder={data.searchPlaceholder}
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                />
                <button type="submit" aria-label="Buscar">
                  <SearchIcon />
                </button>
                {searchFocused && (
                  // `preventDefault` no mousedown: sem isso o `onBlur` do input
                  // (timeout de 150ms) podia fechar o dropdown ANTES do clique.
                  <div
                    className={styles.searchDropdown}
                    onMouseDown={e => e.preventDefault()}
                  >
                    {dropdownContent}
                  </div>
                )}
              </form>

              <div className={styles.actions}>
                <a
                  href={data.storesUrl}
                  onClick={preventNav}
                  className={`${styles.iconBtn} ${styles.desktopOnly}`}
                  aria-label="Nossas lojas"
                >
                  <PinIcon />
                </a>
                <a
                  href={data.wishlistUrl}
                  onClick={preventNav}
                  className={`${styles.iconBtn} ${styles.desktopOnly}`}
                  aria-label="Favoritos"
                >
                  <HeartIcon />
                </a>
                <a
                  href="#"
                  onClick={preventNav}
                  className={`${styles.iconBtn} ${styles.desktopOnly}`}
                  aria-label="Minha conta"
                >
                  <AccountIcon />
                </a>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.iconBtnCart}`}
                  onClick={() => setCartOpen(true)}
                  aria-label="Abrir sacola"
                >
                  <CartIcon />
                  <span className={styles.cartBadge}>
                    <span>(</span>
                    {cartQtd}
                    <span>)</span>
                  </span>
                </button>
              </div>
            </div>
          </header>

          {/* ── BUSCA MOBILE (linha full-width colada abaixo da barra) ── */}
          <form
            className={styles.mobileSearch}
            role="search"
            onSubmit={e => e.preventDefault()}
          >
            <input
              type="search"
              placeholder={data.searchPlaceholder}
              value={term}
              onChange={e => setTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              aria-label="Buscar produtos"
            />
            <button type="submit" aria-label="Buscar">
              <SearchIcon />
            </button>
            {searchFocused && (
              <div
                className={styles.searchDropdown}
                onMouseDown={e => e.preventDefault()}
              >
                {dropdownContent}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ── OVERLAY DE BUSCA (mobile) ── */}
      <div
        className={`${styles.searchOverlay}${mobileSearchOpen ? ` ${styles.open}` : ''}`}
        onClick={e => {
          if (e.target === e.currentTarget) setMobileSearchOpen(false);
        }}
      >
        <div className={styles.searchOverlayInner}>
          <form
            className={styles.searchOverlayForm}
            role="search"
            onSubmit={e => e.preventDefault()}
          >
            <SearchIcon />
            <input
              ref={mobileSearchRef}
              type="search"
              placeholder={data.searchPlaceholder}
              value={term}
              onChange={e => setTerm(e.target.value)}
            />
            <button
              type="button"
              className={styles.searchOverlayClose}
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Fechar busca"
            >
              &times;
            </button>
          </form>
          {dropdownContent}
        </div>
      </div>

      {/* ── DRAWER MOBILE ── */}
      <div
        className={`${styles.drawerOverlay}${mobileOpen ? ` ${styles.open}` : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`${styles.mobileDrawer}${mobileOpen ? ` ${styles.open}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className={styles.drawerHead}>
          <button
            type="button"
            className={styles.drawerClose}
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
          >
            &times;
          </button>
        </div>
        <nav className={styles.mobileNav} aria-label="Menu mobile">
          {data.navItems.map((item, i) =>
            item.hasMega ? (
              <div
                key={i}
                className={`${styles.mobileNavItem}${openMobileItems[i] ? ` ${styles.open}` : ''}`}
              >
                {/* O rótulo navega e o chevron expande — áreas de toque separadas. */}
                <div className={styles.mobileNavRow}>
                  <a
                    className={styles.mobileNavLabel}
                    href={item.url}
                    onClick={preventNav}
                  >
                    {item.label}
                  </a>
                  <button
                    type="button"
                    className={styles.mobileNavToggle}
                    aria-expanded={!!openMobileItems[i]}
                    aria-label={`${openMobileItems[i] ? 'Recolher' : 'Expandir'} ${item.label}`}
                    onClick={() => toggleMobileItem(i)}
                  >
                    <ChevronIcon />
                  </button>
                </div>

                <div className={styles.mobileSub}>
                  {(item.megaColumns ?? []).map((col, c) =>
                    col.title ? (
                      // Coluna com título → acordeão aninhado (nível 2)
                      <div
                        key={c}
                        className={`${styles.mobileSubItem}${
                          openMobileCols[`${i}-${c}`] ? ` ${styles.open}` : ''
                        }`}
                      >
                        <button
                          type="button"
                          aria-expanded={!!openMobileCols[`${i}-${c}`]}
                          onClick={() => toggleMobileCol(`${i}-${c}`)}
                        >
                          {col.title}
                          <ChevronIcon />
                        </button>
                        <div className={styles.mobileSubSub}>
                          {col.links.map((link, l) => (
                            <a key={l} href={link.url} onClick={preventNav}>
                              {link.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Coluna sem título → links diretos
                      col.links.map((link, l) => (
                        <a
                          key={`${c}-${l}`}
                          className={styles.mobileSubLink}
                          href={link.url}
                          onClick={preventNav}
                        >
                          {link.name}
                        </a>
                      ))
                    )
                  )}

                  {/* Banner do mega — versão MOBILE (srcMobile), no fim do item */}
                  {item.megaImage && (
                    <a
                      className={styles.mobileBanner}
                      href={item.megaImage.url}
                      onClick={preventNav}
                    >
                      <img
                        loading="lazy"
                        src={item.megaImage.srcMobile}
                        alt={item.megaImage.alt}
                      />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <a
                key={i}
                className={`${styles.mobileNavLink}${item.highlight ? ` ${styles.navSale}` : ''}`}
                href={item.url}
                onClick={preventNav}
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className={styles.mobileFooter}>
          <div className={styles.lineMobile} />

          {/* o ícone da conta vem do ::before do .mobileLoginBtn (14×14, ver o CSS) */}
          <a href="#" className={styles.mobileLoginBtn} onClick={preventNav}>
            Entrar
          </a>

          <div className={styles.mobileLinks}>
            {data.mobileLinks.map((link, i) => (
              <a key={i} href={link.url} onClick={preventNav}>
                <MobileLinkIcon name={link.icon} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* ── MINI-CART (CartSidebar06, igual ao .starter) ── */}
      <CartSidebar06 open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

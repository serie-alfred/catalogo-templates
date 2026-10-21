import React, { useEffect, useRef, useState } from 'react';

import CartSidebar10, {
  CART_10_QUANTIDADE,
} from '@/components/templates/_shared/CartSidebar10';
import { FONTES_10 } from '@/components/templates/common/template_10/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Header10` do faststore.starter (família 10, Varejo; desenho
 * `Header10` / `Header10-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e
 * as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Régua escura com a mensagem e os links de serviço; marca, busca larga com botão de
 * destaque, conta, favoritos e carrinho com contador; faixa de departamentos com
 * "Todos os departamentos" (mega-menu), selo por item e um item alinhado à direita.
 * Mobile: menu, marca, conta e carrinho, a busca embaixo; o menu abre conta,
 * departamentos, favoritos e os links de serviço.
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, o selo com a letra e a marca
 *    em texto do catálogo (mesmas classes `.logoMark` / `.logoName` do starter).
 *  - Busca sem GraphQL: as sugestões filtram uma lista fixa (os itens do menu e os
 *    produtos de exemplo da vitrine 10); enviar só fecha as sugestões.
 *  - Carrinho: contador e gaveta (`_shared/CartSidebar10`) com o item de exemplo. A
 *    gaveta fica FORA do envelope `.header10Box`: o container-type dele prenderia a
 *    camada fixa.
 *  - Sem trava de scroll do <body> com o menu aberto: no canvas ela travaria o editor.
 */

type Header10LinkIcon = 'truck' | 'store' | 'phone' | 'none';

type Header10MenuItem = {
  label?: string;
  url?: string;
  badge?: string;
  alignEnd?: boolean;
  children?: { label?: string; url?: string }[];
};

const MOCK = {
  topbarText: 'Frete grátis para todo o Brasil acima de R$ 199',
  serviceLinks: [
    { label: 'Lojas físicas', url: '/lojas', icon: 'store' },
    { label: 'Acompanhe seu pedido', url: '/account/orders', icon: 'truck' },
    { label: 'Televendas [0000-0000]', url: 'tel:00000000', icon: 'phone' },
    { label: 'Venda conosco', url: '/venda-conosco', icon: 'none' },
  ] as { label?: string; url?: string; icon?: Header10LinkIcon }[],
  brandMark: 'S',
  brandName: 'SERIE//A',
  searchPlaceholder: 'Busque por produto, marca ou categoria',
  accountLabel: 'Entrar / Cadastrar',
  wishlistLabel: 'Favoritos',
  wishlistUrl: '/wishlist',
  cartLabel: 'Carrinho',
  departmentsLabel: 'Todos os departamentos',
  menuTitle: 'Departamentos',
  menu: [
    { label: 'Ofertas do dia', url: '/ofertas', badge: 'HOJE' },
    { label: 'Celulares', url: '/celulares' },
    { label: 'Informática', url: '/informatica' },
    { label: 'TV e Vídeo', url: '/tv-e-video' },
    { label: 'Eletrodomésticos', url: '/eletrodomesticos' },
    { label: 'Casa', url: '/casa' },
    { label: 'Games', url: '/games' },
    { label: 'Cupons', url: '/cupons', alignEnd: true },
  ] as Header10MenuItem[],
};

// Produtos de exemplo da vitrine 10 (mock do `molecules/ProductShelf10`), só para as
// sugestões da busca terem o que mostrar.
const PRODUTOS_BUSCA_10 = [
  {
    slug: 'smartphone-x5-128gb-preto',
    name: 'Smartphone X5 128 GB 5G Tela 6,7" Preto',
  },
  { slug: 'smart-tv-55-4k-uhd-wifi', name: 'Smart TV 55" 4K UHD com Wi-Fi' },
  {
    slug: 'air-fryer-5-5l-digital-inox',
    name: 'Air Fryer 5,5 L Digital 1500 W Inox',
  },
  {
    slug: 'notebook-15-6-core-i5-16gb',
    name: 'Notebook 15,6" Core i5 16 GB SSD 512 GB',
  },
  {
    slug: 'fone-bluetooth-cancelamento-ruido',
    name: 'Fone Bluetooth com Cancelamento de Ruído',
  },
  {
    slug: 'cafeteira-expresso-20-bar',
    name: 'Cafeteira Expresso 20 Bar com Vaporizador',
  },
];

const svg = (w: number, sw: string, children: React.ReactNode) => (
  <svg
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    aria-hidden="true"
  >
    {children}
  </svg>
);
const Ico = {
  menu: (w = 24) => svg(w, '2', <path d="M3 6h18M3 12h18M3 18h18" />),
  close: svg(24, '2', <path d="M6 6l12 12M18 6 6 18" />),
  search: (w = 22) =>
    svg(
      w,
      '2.2',
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  user: (w = 26) =>
    svg(
      w,
      '1.8',
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </>
    ),
  heart: (w = 26) =>
    svg(
      w,
      '1.8',
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    ),
  cart: (w = 26) =>
    svg(
      w,
      '1.8',
      <>
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M2 3h3l2.5 12h12l2-8H6.2" />
      </>
    ),
  chevron: svg(18, '2', <path d="m9 6 6 6-6 6" />),
};

const ICONE_SERVICO: Record<
  Exclude<Header10LinkIcon, 'none'>,
  React.ReactNode
> = {
  truck: svg(
    20,
    '1.8',
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  store: svg(
    20,
    '1.8',
    <>
      <path d="M4 9 5 4h14l1 5" />
      <path d="M4 9h16v11H4z" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
  phone: svg(
    20,
    '1.8',
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
    </>
  ),
};

const TERMOS_10 = MOCK.menu.map(m => m.label ?? '').filter(Boolean);

export default function Header10() {
  const { logo } = useLayout();
  const {
    topbarText,
    serviceLinks,
    brandMark,
    brandName,
    searchPlaceholder,
    accountLabel,
    wishlistLabel,
    wishlistUrl,
    cartLabel,
    departmentsLabel,
    menuTitle,
    menu,
  } = MOCK;

  const [cartOpen, setCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(CART_10_QUANTIDADE);

  const [termo, setTermo] = useState('');
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false);
  const [gaveta, setGaveta] = useState(false);
  const [departamentos, setDepartamentos] = useState(false);
  const [aberto, setAberto] = useState<number | null>(null);
  const departamentosRef = useRef<HTMLDivElement>(null);

  const termoLimpo = termo.trim().toLowerCase();
  const curto = termoLimpo.length < 2;
  const termos = curto
    ? []
    : TERMOS_10.filter(t => t.toLowerCase().includes(termoLimpo));
  const produtos = curto
    ? []
    : PRODUTOS_BUSCA_10.filter(p => p.name.toLowerCase().includes(termoLimpo));
  const temSugestao =
    sugestoesAbertas && (termos.length > 0 || produtos.length > 0);

  useEffect(() => {
    if (!gaveta) return;
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && setGaveta(false);
    document.addEventListener('keydown', fechar);
    return () => document.removeEventListener('keydown', fechar);
  }, [gaveta]);

  useEffect(() => {
    if (!departamentos) return;
    const fora = (e: MouseEvent) => {
      if (!departamentosRef.current?.contains(e.target as Node))
        setDepartamentos(false);
    };
    const esc = (e: KeyboardEvent) =>
      e.key === 'Escape' && setDepartamentos(false);
    document.addEventListener('mousedown', fora);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', fora);
      document.removeEventListener('keydown', esc);
    };
  }, [departamentos]);

  const irPara = (t: string) => {
    if (!t.trim()) return;
    setTermo(t);
    setSugestoesAbertas(false);
    setGaveta(false);
  };

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    irPara(termo);
  };

  const conta = (
    conteudo: React.ReactNode,
    className: string,
    label?: string
  ) => (
    <a
      className={className}
      href="/account"
      aria-label={label}
      data-role="hd-account"
    >
      {conteudo}
    </a>
  );

  const rotuloCarrinho = `${cartLabel || 'Carrinho'}${totalItems > 0 ? `, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : ''}`;
  const selo = (badge?: string) =>
    badge ? (
      <span className={styles.badge} data-role="hd-menu-badge">
        {badge}
      </span>
    ) : null;

  return (
    <>
      <div className={styles.header10Box}>
        <header className={styles.header10} data-role="hd-root">
          <link rel="stylesheet" href={FONTES_10} />

          {(topbarText || serviceLinks.length > 0) && (
            <div className={styles.topbar} data-role="hd-topbar">
              <div className={styles.topbarInner}>
                {topbarText && (
                  <span className={styles.topbarText}>{topbarText}</span>
                )}
                {serviceLinks.length > 0 && (
                  <div className={styles.topbarLinks}>
                    {serviceLinks.map((l, i) => (
                      <a key={i} href={l.url || '#'}>
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.bar} data-role="hd-bar">
            <button
              type="button"
              className={`${styles.iconButton} ${styles.mob}`}
              aria-label={gaveta ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={gaveta}
              aria-controls="hd10-menu"
              onClick={() => setGaveta(v => !v)}
              data-role="hd-menu-button"
            >
              {gaveta ? Ico.close : Ico.menu(24)}
            </button>

            <a
              className={styles.logo}
              href="/"
              aria-label={brandName || 'Página inicial'}
              data-role="hd-logo"
            >
              {logo ? (
                <img src={logo} alt="Logo" height={38} />
              ) : (
                <>
                  {brandMark && (
                    <span className={styles.logoMark} aria-hidden="true">
                      {brandMark}
                    </span>
                  )}
                  {brandName && (
                    <span className={styles.logoName}>{brandName}</span>
                  )}
                </>
              )}
            </a>

            <form
              className={styles.search}
              role="search"
              onSubmit={buscar}
              data-role="hd-search"
            >
              <label className={styles.searchField}>
                <span className={styles.srOnly}>
                  {searchPlaceholder || 'Buscar produtos'}
                </span>
                <input
                  className={styles.searchInput}
                  type="search"
                  autoComplete="off"
                  placeholder={searchPlaceholder}
                  value={termo}
                  onChange={e => {
                    setTermo(e.target.value);
                    setSugestoesAbertas(true);
                  }}
                  onFocus={() => setSugestoesAbertas(true)}
                  onBlur={() => setSugestoesAbertas(false)}
                />
              </label>
              <button
                type="submit"
                className={styles.searchSubmit}
                aria-label="Buscar"
              >
                {Ico.search(22)}
              </button>
              {temSugestao && (
                <div className={styles.suggestions} data-role="hd-suggestions">
                  {termos.length > 0 && (
                    <ul>
                      {termos.slice(0, 5).map(t => (
                        <li key={t}>
                          <button
                            type="button"
                            className={styles.suggestTerm}
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => irPara(t)}
                          >
                            {Ico.search(16)}
                            {t}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {produtos.length > 0 && (
                    <ul className={styles.suggestProducts}>
                      {produtos.slice(0, 4).map(p => (
                        <li key={p.slug}>
                          <a
                            className={styles.suggestProduct}
                            href={`/${p.slug}/p`}
                          >
                            {p.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </form>

            <div className={styles.actions}>
              {conta(
                <>
                  {Ico.user(26)}
                  <span className={styles.accountLabel}>{accountLabel}</span>
                </>,
                `${styles.account} ${styles.dsk}`
              )}
              {conta(
                Ico.user(24),
                `${styles.iconButton} ${styles.mob}`,
                accountLabel || 'Minha conta'
              )}
              <a
                className={`${styles.iconButton} ${styles.dsk}`}
                href={wishlistUrl || '#'}
                aria-label={wishlistLabel || 'Favoritos'}
                data-role="hd-wishlist"
              >
                {Ico.heart(26)}
              </a>
              <button
                type="button"
                className={styles.cart}
                onClick={() => setCartOpen(true)}
                aria-label={rotuloCarrinho}
                data-role="hd-cart"
              >
                {Ico.cart(26)}
                {totalItems > 0 && (
                  <span
                    className={styles.cartBadge}
                    aria-hidden="true"
                    data-role="hd-badge"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {(menu.length > 0 || departmentsLabel) && (
            <nav
              className={styles.nav}
              aria-label="Departamentos"
              data-role="hd-nav"
            >
              <div className={styles.navInner}>
                {departmentsLabel && menu.length > 0 && (
                  <div className={styles.departments} ref={departamentosRef}>
                    <button
                      type="button"
                      className={styles.departmentsButton}
                      aria-expanded={departamentos}
                      aria-controls="hd10-departamentos"
                      onClick={() => setDepartamentos(v => !v)}
                      data-role="hd-departments"
                    >
                      {Ico.menu(20)}
                      {departmentsLabel}
                    </button>
                    {departamentos && (
                      <div
                        id="hd10-departamentos"
                        className={styles.mega}
                        data-role="hd-mega"
                      >
                        {menu.map((item, i) => (
                          <div key={i} className={styles.megaColumn}>
                            <a
                              className={styles.megaTitle}
                              href={item.url || '#'}
                            >
                              {item.label}
                              {selo(item.badge)}
                            </a>
                            {!!item.children?.length && (
                              <ul className={styles.megaList}>
                                {item.children.map((c, j) => (
                                  <li key={j}>
                                    <a href={c.url || '#'}>{c.label}</a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <ul className={styles.navList}>
                  {menu.map((item, i) => (
                    <li
                      key={i}
                      className={`${styles.navEntry}${item.alignEnd ? ` ${styles.navEnd}` : ''}`}
                    >
                      <a
                        className={styles.navItem}
                        href={item.url || '#'}
                        data-role="hd-menu-item"
                      >
                        {item.label}
                        {selo(item.badge)}
                      </a>
                      {!!item.children?.length && (
                        <ul className={styles.submenu}>
                          {item.children.map((c, j) => (
                            <li key={j}>
                              <a
                                className={styles.submenuItem}
                                href={c.url || '#'}
                              >
                                {c.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          )}

          {gaveta && (
            <nav
              id="hd10-menu"
              className={styles.drawer}
              aria-label="Menu"
              data-role="hd-drawer"
            >
              {conta(
                <>
                  {Ico.user(26)}
                  <span className={styles.drawerAccountLabel}>
                    {accountLabel}
                  </span>
                  <span className={styles.chevronEnd}>{Ico.chevron}</span>
                </>,
                styles.drawerAccount
              )}
              {menuTitle && (
                <span className={styles.drawerTitle}>{menuTitle}</span>
              )}
              <ul className={styles.drawerList}>
                {menu.map((item, i) => (
                  <li key={i}>
                    {item.children?.length ? (
                      <>
                        <button
                          type="button"
                          className={styles.drawerItem}
                          aria-expanded={aberto === i}
                          onClick={() => setAberto(aberto === i ? null : i)}
                        >
                          {item.label}
                          {selo(item.badge)}
                          <span
                            className={`${styles.chevronEnd}${aberto === i ? ` ${styles.chevronOpen}` : ''}`}
                          >
                            {Ico.chevron}
                          </span>
                        </button>
                        {aberto === i && (
                          <ul className={styles.drawerSub}>
                            {item.url && (
                              <li>
                                <a href={item.url}>Ver tudo</a>
                              </li>
                            )}
                            {item.children.map((c, j) => (
                              <li key={j}>
                                <a href={c.url || '#'}>{c.label}</a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <a className={styles.drawerItem} href={item.url || '#'}>
                        {item.label}
                        {selo(item.badge)}
                        <span className={styles.chevronEnd}>{Ico.chevron}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <ul className={styles.drawerFoot}>
                {wishlistLabel && (
                  <li>
                    <a className={styles.drawerLink} href={wishlistUrl || '#'}>
                      {Ico.heart(20)}
                      {wishlistLabel}
                    </a>
                  </li>
                )}
                {serviceLinks.map((l, i) => (
                  <li key={i}>
                    <a className={styles.drawerLink} href={l.url || '#'}>
                      {l.icon && l.icon !== 'none' && ICONE_SERVICO[l.icon]}
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </header>
      </div>

      <CartSidebar10
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onTotalChange={setTotalItems}
      />
    </>
  );
}

import React, { useEffect, useRef, useState } from 'react';

import CartSidebar16, {
  CART_16_QUANTIDADE,
} from '@/components/templates/_shared/CartSidebar16';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Header16` do faststore.starter (família 16, Infantil; desenho
 * `Header16` / `Header16-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Régua amarela com as vantagens; a barra creme com a marca e a bolinha coral, a busca em
 * pílula com a lupa no círculo de destaque, conta, favoritos e a "Sacola" em pílula com o
 * contador coral; o menu em pílulas sob o filete tracejado. Mobile: menu, marca, lupa e
 * sacola; o menu abre a tela com a busca, a lista em cartões com bolinha e Entrar/Favoritos.
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, a marca em texto do mock ("sua
 *    marca", genérica) com a bolinha, no mesmo `.logo` / `data-role="hd-logo"`.
 *  - Busca sem GraphQL: as sugestões filtram os rótulos do menu; enviar só fecha a gaveta.
 *  - Carrinho: contador e gaveta (`_shared/CartSidebar16`) com o item de exemplo. A gaveta
 *    fica FORA do envelope `.header16Box`: o container-type dele prenderia a camada fixa.
 *  - Sem trava de scroll do <body> com o menu aberto (travaria o editor) e sem item "atual"
 *    (`aria-current`): o canvas não tem rota.
 */

type Header16TopbarIcon =
  | 'truck'
  | 'card'
  | 'exchange'
  | 'gift'
  | 'star'
  | 'none';

interface Header16TopbarItem {
  text?: string;
  icon?: Header16TopbarIcon;
  /** Com link, a vantagem vira link; sem, texto. */
  url?: string;
}

interface Header16MenuItem {
  label?: string;
  url?: string;
  /** Item em destaque (o "Ofertas" do desenho): borda e texto na cor de destaque. */
  highlight?: boolean;
  /** Imagem da bolinha do item no menu mobile; vazia, a bolinha fica só na cor. */
  image?: string;
  /** Submenu (mega-menu do CMS): painel no hover/foco no desktop, acordeão no mobile. */
  children?: { label?: string; url?: string }[];
}

interface Header16Props {
  /** Vantagens da régua; o mobile mostra só a primeira, como no desenho. */
  topbarItems?: Header16TopbarItem[];
  /** Imagem do logo. Vazio: a marca em texto (`brandName`) com a bolinha. */
  logo?: string;
  logoAlt?: string;
  brandName?: string;
  menu?: Header16MenuItem[];
  searchPlaceholder?: string;
  /** Placeholder da busca dentro do menu mobile; vazio usa `searchPlaceholder`. */
  searchPlaceholderMenu?: string;
  accountLabel?: string;
  wishlistLabel?: string;
  wishlistUrl?: string;
  cartLabel?: string;
}

const FONTES =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap';

const MOCK: Header16Props = {
  topbarItems: [
    { text: 'Frete grátis acima de R$ 199', icon: 'truck' },
    { text: 'Até 6x sem juros', icon: 'card' },
    { text: 'Primeira troca grátis', icon: 'exchange' },
  ],
  brandName: 'SERIE//A',
  menu: [
    {
      label: 'Brinquedos',
      url: '/brinquedos',
      children: [
        { label: 'Blocos de montar', url: '/brinquedos/blocos-de-montar' },
        { label: 'Pelúcias', url: '/brinquedos/pelucias' },
        { label: 'Jogos e quebra-cabeças', url: '/brinquedos/jogos' },
      ],
    },
    {
      label: 'Roupas',
      url: '/roupas',
      children: [
        { label: 'Pijamas', url: '/roupas/pijamas' },
        { label: 'Conjuntos', url: '/roupas/conjuntos' },
      ],
    },
    {
      label: 'Bebê',
      url: '/bebe',
      children: [
        { label: 'Enxoval', url: '/bebe/enxoval' },
        { label: 'Hora do banho', url: '/bebe/banho' },
      ],
    },
    { label: 'Livros', url: '/livros' },
    { label: 'Papelaria', url: '/papelaria' },
    { label: 'Ofertas', url: '/ofertas', highlight: true },
  ],
  searchPlaceholder: 'Buscar brinquedos, roupas, livros…',
  searchPlaceholderMenu: 'O que a criançada quer hoje?',
  accountLabel: 'Entrar',
  wishlistLabel: 'Favoritos',
  wishlistUrl: '/wishlist',
  cartLabel: 'Sacola',
};

const TERMOS_16 = (MOCK.menu ?? []).map(m => m.label ?? '').filter(Boolean);

const svg = (
  w: number,
  children: React.ReactNode,
  sw = '2.2',
  className?: string
) => (
  <svg
    className={className}
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const ICONE_REGUA: Record<
  Exclude<Header16TopbarIcon, 'none'>,
  React.ReactNode
> = {
  truck: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 10h18" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
      <path d="M18 3v4h-4M6 21v-4h4" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="5" rx="1" />
      <path d="M5 13v8h14v-8M12 8v13" />
      <path d="M12 8c-2-4-6-3-5 0M12 8c2-4 6-3 5 0" />
    </>
  ),
  star: (
    <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
  ),
};

const Ico = {
  menu: svg(24, <path d="M4 7h16M4 12h16M4 17h10" />),
  close: svg(22, <path d="M6 6l12 12M18 6 6 18" />, '2.4'),
  search: (w: number, sw = '2.2') =>
    svg(
      w,
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>,
      sw
    ),
  user: (w: number) =>
    svg(
      w,
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </>
    ),
  heart: (w: number) =>
    svg(
      w,
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
    ),
  bag: svg(
    20,
    <>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  down: svg(16, <path d="m6 9 6 6 6-6" />, '2.4'),
  right: svg(20, <path d="m9 6 6 6-6 6" />, '2.4'),
};

export default function Header16() {
  const { logo: logoEnviado } = useLayout();
  const {
    topbarItems = [],
    logoAlt,
    brandName,
    menu = [],
    searchPlaceholder,
    searchPlaceholderMenu,
    accountLabel,
    wishlistLabel,
    wishlistUrl,
    cartLabel,
  } = MOCK;
  const logo = logoEnviado || undefined;

  const [cartOpen, setCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(CART_16_QUANTIDADE);
  const abrirCarrinho = () => setCartOpen(true);
  const [termo, setTermo] = useState('');
  const [sugestoesAbertas, setSugestoesAbertas] = useState<string | null>(null);
  const [gaveta, setGaveta] = useState(false);
  const [focarBusca, setFocarBusca] = useState(false);
  const [aberto, setAberto] = useState<number | null>(null);
  const buscaMenuRef = useRef<HTMLInputElement>(null);

  const termoLimpo = termo.trim();
  // Termo curto → `null`: o core pula a consulta (`doNotRun`); string vazia consultaria.
  const curto = termoLimpo.length < 2;
  const termos: { value: string }[] = curto
    ? []
    : TERMOS_16.filter(t =>
        t.toLowerCase().includes(termoLimpo.toLowerCase())
      ).map(value => ({ value }));
  const produtos: { id: string; name: string }[] = [];
  const temSugestao = termos.length > 0 || produtos.length > 0;

  useEffect(() => {
    if (!gaveta) return;
    if (focarBusca) buscaMenuRef.current?.focus();
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && setGaveta(false);
    document.addEventListener('keydown', fechar);
    return () => {
      document.removeEventListener('keydown', fechar);
    };
  }, [gaveta, focarBusca]);

  const irPara = (t: string) => {
    const limpo = t.trim();
    if (!limpo) return;
    setTermo(limpo);
    setSugestoesAbertas(null);
    setGaveta(false);
  };

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    irPara(termo);
  };

  const abrirMenu = (busca: boolean) => {
    setFocarBusca(busca);
    setGaveta(v => (busca ? true : !v));
  };

  const conta = (
    conteudo: React.ReactNode,
    className: string,
    rotulo?: string
  ) => (
    <a
      className={className}
      href="/account"
      aria-label={rotulo}
      data-role="hd-account"
    >
      {conteudo}
    </a>
  );

  const busca = (
    className: string,
    onde: string,
    placeholder?: string,
    ref?: React.Ref<HTMLInputElement>
  ) => (
    <form
      className={className}
      role="search"
      onSubmit={buscar}
      data-role="hd-search"
    >
      <label className={styles.srOnly} htmlFor={`hd16-busca-${onde}`}>
        Buscar
      </label>
      <input
        ref={ref}
        id={`hd16-busca-${onde}`}
        className={styles.searchInput}
        type="search"
        autoComplete="off"
        placeholder={placeholder}
        value={termo}
        onChange={e => {
          setTermo(e.target.value);
          setSugestoesAbertas(onde);
        }}
        onFocus={() => setSugestoesAbertas(onde)}
        onBlur={() => setSugestoesAbertas(null)}
      />
      <button type="submit" className={styles.searchSubmit} aria-label="Buscar">
        {Ico.search(20, '2.4')}
      </button>
      {temSugestao && sugestoesAbertas === onde && (
        <div className={styles.suggestions} data-role="hd-suggestions">
          {termos.length > 0 && (
            <ul className={styles.suggestList}>
              {termos.slice(0, 5).map(t => (
                <li key={t.value}>
                  <button
                    type="button"
                    className={styles.suggestItem}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => irPara(t.value)}
                  >
                    {Ico.search(16)}
                    {t.value}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {produtos.length > 0 && (
            <ul className={styles.suggestList}>
              {produtos.slice(0, 4).map(p => (
                <li key={p.id}>
                  <a className={styles.suggestItem} href="#">
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );

  const vantagens = topbarItems.filter(t => t.text);
  const nomeSacola = cartLabel || 'Sacola';
  const rotuloCarrinho = `Abrir ${nomeSacola.toLowerCase()}, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
  const contador = totalItems > 99 ? '99+' : totalItems;

  return (
    <>
      <div className={styles.header16Box}>
        <header
          className={`${styles.header16}${gaveta ? ` ${styles.menuOpen}` : ''}`}
          data-role="hd-root"
        >
          <link rel="stylesheet" href={FONTES} />

          {vantagens.length > 0 && (
            <div className={styles.topbar} data-role="hd-topbar">
              <ul className={styles.topbarList}>
                {vantagens.map((v, i) => {
                  const icone =
                    v.icon && v.icon !== 'none' ? ICONE_REGUA[v.icon] : null;
                  const conteudo = (
                    <>
                      {icone && svg(16, icone, '2', styles.topbarIcon)}
                      {v.text}
                    </>
                  );
                  // O mobile mostra só a 1ª vantagem.
                  const soDesktop = i > 0 ? ` ${styles.dsk}` : '';
                  return (
                    <React.Fragment key={i}>
                      {i > 0 && (
                        <li
                          className={`${styles.topbarDot} ${styles.dsk}`}
                          aria-hidden="true"
                        />
                      )}
                      <li className={`${styles.topbarItem}${soDesktop}`}>
                        {v.url ? <a href={v.url}>{conteudo}</a> : conteudo}
                      </li>
                    </React.Fragment>
                  );
                })}
              </ul>
            </div>
          )}

          <div className={styles.bar} data-role="hd-bar">
            <button
              type="button"
              className={`${styles.menuButton} ${styles.mob}`}
              aria-label={gaveta ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={gaveta}
              aria-controls="hd16-menu"
              onClick={() => abrirMenu(false)}
              data-role="hd-menu-button"
            >
              {gaveta ? Ico.close : Ico.menu}
            </button>

            <a
              className={styles.logo}
              href="/"
              aria-label={logoAlt || brandName || 'Página inicial'}
              data-role="hd-logo"
            >
              {logo ? (
                <img src={logo} alt="Logo" height={40} />
              ) : (
                <>
                  {brandName}
                  <span className={styles.logoDot} aria-hidden="true" />
                </>
              )}
            </a>

            {busca(
              `${styles.search} ${styles.dsk}`,
              'barra',
              searchPlaceholder
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.mob}${gaveta ? ` ${styles.hidden}` : ''}`}
                aria-label="Buscar"
                onClick={() => abrirMenu(true)}
                data-role="hd-search-button"
              >
                {Ico.search(22)}
              </button>
              {conta(
                Ico.user(24),
                `${styles.iconButton} ${styles.round} ${styles.dsk}`,
                accountLabel || 'Entrar na minha conta'
              )}
              <a
                className={`${styles.iconButton} ${styles.round} ${styles.dsk}`}
                href={wishlistUrl || '#'}
                aria-label={wishlistLabel || 'Favoritos'}
                data-role="hd-wishlist"
              >
                {Ico.heart(24)}
              </a>
              <button
                type="button"
                className={styles.cart}
                onClick={abrirCarrinho}
                aria-label={rotuloCarrinho}
                data-role="hd-cart"
              >
                {Ico.bag}
                <span className={`${styles.cartLabel} ${styles.dsk}`}>
                  {nomeSacola}
                </span>
                <span className={styles.cartCount} data-role="hd-badge">
                  {contador}
                </span>
              </button>
            </div>
          </div>

          {menu.length > 0 && (
            <nav
              className={`${styles.nav} ${styles.dsk}`}
              aria-label="Principal"
              data-role="hd-nav"
            >
              <ul className={styles.navList}>
                {menu.map((item, i) => (
                  <li key={i} className={styles.navEntry}>
                    <a
                      className={`${styles.navItem}${item.highlight ? ` ${styles.navHighlight}` : ''}`}
                      href={item.url || '#'}
                      data-role="hd-menu-item"
                    >
                      {item.label}
                      {!!item.children?.length && Ico.down}
                    </a>
                    {!!item.children?.length && (
                      <ul className={styles.submenu} data-role="hd-submenu">
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
            </nav>
          )}

          {gaveta && (
            <div id="hd16-menu" className={styles.drawer} data-role="hd-drawer">
              {busca(
                styles.drawerSearch,
                'menu',
                searchPlaceholderMenu || searchPlaceholder,
                buscaMenuRef
              )}
              <nav className={styles.drawerNav} aria-label="Menu">
                <ul className={styles.drawerList}>
                  {menu.map((item, i) => {
                    const bolinha = (
                      <span className={styles.drawerDot} aria-hidden="true">
                        {item.image && (
                          <img
                            src={item.image}
                            alt=""
                            width={40}
                            height={40}
                            loading="lazy"
                          />
                        )}
                      </span>
                    );
                    return (
                      <li key={i}>
                        {item.children?.length ? (
                          <>
                            <button
                              type="button"
                              className={`${styles.drawerItem}`}
                              aria-expanded={aberto === i}
                              onClick={() => setAberto(aberto === i ? null : i)}
                            >
                              {bolinha}
                              <span className={styles.drawerLabel}>
                                {item.label}
                              </span>
                              <span
                                className={`${styles.chevron}${aberto === i ? ` ${styles.chevronOpen}` : ''}`}
                              >
                                {Ico.right}
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
                          <a
                            className={`${styles.drawerItem}`}
                            href={item.url || '#'}
                          >
                            {bolinha}
                            <span className={styles.drawerLabel}>
                              {item.label}
                            </span>
                            <span className={styles.chevron}>{Ico.right}</span>
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <div className={styles.drawerFoot}>
                  {conta(
                    <>
                      {Ico.user(20)}
                      {accountLabel || 'Entrar'}
                    </>,
                    styles.drawerLink
                  )}
                  <a className={styles.drawerLink} href={wishlistUrl || '#'}>
                    {Ico.heart(20)}
                    {wishlistLabel || 'Favoritos'}
                  </a>
                </div>
              </nav>
            </div>
          )}
        </header>
      </div>
      <CartSidebar16
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onTotalChange={setTotalItems}
      />
    </>
  );
}

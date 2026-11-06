import React, { useEffect, useRef, useState } from 'react';

import CartSidebar17, {
  CART_17_QUANTIDADE,
} from '@/components/templates/_shared/CartSidebar17';
import { FONTES_17 } from '@/components/templates/common/template_17/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Header17` do faststore.starter (família 17, Pet; desenho `Header17` /
 * `Header17-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Régua na cor da marca com as mensagens (ícone + texto, separadas por bolinhas); abaixo, a
 * marca com a patinha no círculo de destaque, a busca larga em pílula clara com a lupa no
 * círculo, "Olá! Entre / Minha conta", favoritos e a "Sacola" em pílula de destaque com o
 * contador tangerina; a barra de departamentos entre filetes, em pílulas (o item "destaque",
 * "Ofertas", vai à direita, em pílula tangerina). Mobile: menu, marca, lupa e sacola; o menu
 * abre a tela com a busca, a lista com setas entre filetes, o destaque em pílula e, no pé,
 * Entrar, Favoritos e Central de ajuda.
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, a marca em texto do mock ("SERIE//A",
 *    genérica) com a patinha, no mesmo `.logo` / `data-role="hd-logo"`.
 *  - Busca sem GraphQL: as sugestões filtram os rótulos do menu; enviar só fecha a gaveta.
 *  - Carrinho: contador e gaveta (`_shared/CartSidebar17`) com os itens do desenho. A gaveta
 *    fica FORA do envelope `.header17Box`: o container-type dele prenderia a camada fixa.
 *  - Sem trava de scroll do <body> com o menu aberto (travaria o editor) e sem item "atual"
 *    (`aria-current`): o canvas não tem rota.
 */

type Header17TopbarIcon =
  | 'store'
  | 'card'
  | 'pix'
  | 'truck'
  | 'exchange'
  | 'paw'
  | 'none';

interface Header17TopbarItem {
  text?: string;
  icon?: Header17TopbarIcon;
  /** Com link, a mensagem vira link; sem, texto. */
  url?: string;
}

interface Header17MenuItem {
  label?: string;
  url?: string;
  /** Item em destaque (o "Ofertas" do desenho): pílula tangerina, alinhada à direita. */
  highlight?: boolean;
  /** Submenu (mega-menu do CMS): painel no hover/foco no desktop, acordeão no mobile. */
  children?: { label?: string; url?: string }[];
}

interface Header17Props {
  /** Mensagens da régua; o mobile mostra só a primeira, como no desenho. */
  topbarItems?: Header17TopbarItem[];
  /** Imagem do logo. Vazio: a marca em texto (`brandName`) com a patinha. */
  logo?: string;
  logoAlt?: string;
  brandName?: string;
  menu?: Header17MenuItem[];
  searchPlaceholder?: string;
  /** Linha de cima do atalho da conta (desktop), ex.: "Olá! Entre". */
  accountGreeting?: string;
  /** Rótulo da conta, ex.: "Minha conta" (desktop) — o menu mobile usa `accountMenuLabel`. */
  accountLabel?: string;
  accountMenuLabel?: string;
  wishlistLabel?: string;
  wishlistUrl?: string;
  helpLabel?: string;
  helpUrl?: string;
  cartLabel?: string;
}


// O mock.ts do starter, com a marca genérica no lugar da de exemplo.
const MOCK: Header17Props = {
  topbarItems: [
    { text: 'Retire na loja em 2 h', icon: 'store' },
    { text: 'Parcele em até 6x sem juros', icon: 'card' },
    { text: 'Pague com Pix na finalização', icon: 'pix' },
  ],
  brandName: 'SERIE//A',
  menu: [
    {
      label: 'Cachorros',
      url: '/cachorros',
      children: [
        { label: 'Ração', url: '/cachorros/racao' },
        { label: 'Petiscos', url: '/cachorros/petiscos' },
        { label: 'Brinquedos', url: '/cachorros/brinquedos' },
        { label: 'Camas e casinhas', url: '/cachorros/camas' },
      ],
    },
    {
      label: 'Gatos',
      url: '/gatos',
      children: [
        { label: 'Ração', url: '/gatos/racao' },
        { label: 'Areia e higiene', url: '/gatos/areia' },
        { label: 'Arranhadores', url: '/gatos/arranhadores' },
      ],
    },
    { label: 'Pássaros', url: '/passaros' },
    { label: 'Peixes', url: '/peixes' },
    { label: 'Outros pets', url: '/outros-pets' },
    { label: 'Farmácia', url: '/farmacia' },
    { label: 'Ofertas', url: '/ofertas', highlight: true },
  ],
  searchPlaceholder: 'Buscar ração, petisco, brinquedo…',
  accountGreeting: 'Olá! Entre',
  accountLabel: 'Minha conta',
  accountMenuLabel: 'Entrar ou cadastrar',
  wishlistLabel: 'Favoritos',
  wishlistUrl: '/wishlist',
  helpLabel: 'Central de ajuda',
  helpUrl: '/ajuda',
  cartLabel: 'Sacola',
};

const TERMOS_17 = (MOCK.menu ?? []).map(m => m.label ?? '').filter(Boolean);

const svg = (
  w: number,
  children: React.ReactNode,
  sw = '1.8',
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

const PATA = (
  <>
    <ellipse cx="5.5" cy="10" rx="2" ry="2.6" />
    <ellipse cx="9.5" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="14.5" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="18.5" cy="10" rx="2" ry="2.6" />
    <path d="M12 11.5c-3 0-6 3.6-6 6.2 0 1.9 1.6 2.8 3.2 2.3.9-.3 1.8-.6 2.8-.6s1.9.3 2.8.6c1.6.5 3.2-.4 3.2-2.3 0-2.6-3-6.2-6-6.2z" />
  </>
);

const ICONE_REGUA: Record<
  Exclude<Header17TopbarIcon, 'none'>,
  React.ReactNode
> = {
  store: (
    <>
      <path d="M4 10v10h16V10" />
      <path d="M3 10l2-6h14l2 6" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  pix: <path d="M12 3l9 9-9 9-9-9z" />,
  truck: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
      <path d="M18 3v4h-4M6 21v-4h4" />
    </>
  ),
  paw: PATA,
};

const Ico = {
  menu: svg(24, <path d="M4 7h16M4 12h16M4 17h10" />),
  close: svg(22, <path d="M6 6l12 12M18 6 6 18" />),
  search: (w: number, sw = '1.8') =>
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
  help: svg(
    20,
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
    </>
  ),
  bag: (w: number) =>
    svg(
      w,
      <>
        <path d="M5 8h14l-1 12H6L5 8z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </>
    ),
  down: svg(14, <path d="m6 9 6 6 6-6" />, '2'),
  right: svg(20, <path d="m9 6 6 6-6 6" />, '2'),
};

export default function Header17() {
  const { logo: logoEnviado } = useLayout();
  const {
    topbarItems = [],
    logoAlt,
    brandName,
    menu = [],
    searchPlaceholder,
    accountGreeting,
    accountLabel,
    accountMenuLabel,
    wishlistLabel,
    wishlistUrl,
    helpLabel,
    helpUrl,
    cartLabel,
  } = MOCK;
  const logo = logoEnviado || undefined;

  const [cartOpen, setCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(CART_17_QUANTIDADE);
  const abrirCarrinho = () => setCartOpen(true);
  const [termo, setTermo] = useState('');
  const [sugestoesAbertas, setSugestoesAbertas] = useState<string | null>(null);
  const [gaveta, setGaveta] = useState(false);
  const [focarBusca, setFocarBusca] = useState(false);
  const [aberto, setAberto] = useState<number | null>(null);
  const buscaMenuRef = useRef<HTMLInputElement>(null);

  const termoLimpo = termo.trim();
  // Termo curto: sem sugestão (o core pula a consulta com menos de 2 letras).
  const curto = termoLimpo.length < 2;
  const termos: { value: string }[] = curto
    ? []
    : TERMOS_17.filter(t =>
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
    ref?: React.Ref<HTMLInputElement>
  ) => (
    <form
      className={className}
      role="search"
      onSubmit={buscar}
      data-role="hd-search"
    >
      <div className={styles.searchField}>
        <label className={styles.srOnly} htmlFor={`hd17-busca-${onde}`}>
          Buscar produtos
        </label>
        <input
          ref={ref}
          id={`hd17-busca-${onde}`}
          className={styles.searchInput}
          type="search"
          autoComplete="off"
          placeholder={searchPlaceholder}
          value={termo}
          onChange={e => {
            setTermo(e.target.value);
            setSugestoesAbertas(onde);
          }}
          onFocus={() => setSugestoesAbertas(onde)}
          onBlur={() => setSugestoesAbertas(null)}
        />
        <button
          type="submit"
          className={styles.searchSubmit}
          aria-label="Buscar"
        >
          {Ico.search(20, '2')}
        </button>
      </div>
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

  const mensagens = topbarItems.filter(t => t.text);
  const nomeSacola = cartLabel || 'Sacola';
  const rotuloCarrinho = `Abrir ${nomeSacola.toLowerCase()}, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
  const contador = totalItems > 99 ? '99+' : totalItems;
  const comuns = menu.filter(m => !m.highlight);
  const destaques = menu.filter(m => m.highlight);

  return (
    <>
      <div className={styles.header17Box}>
        <header className={styles.header17} data-role="hd-root">
          <link rel="stylesheet" href={FONTES_17} />

          {mensagens.length > 0 && (
            <div className={styles.topbar} data-role="hd-topbar">
              <ul className={styles.topbarList}>
                {mensagens.map((v, i) => {
                  const icone =
                    v.icon && v.icon !== 'none' ? ICONE_REGUA[v.icon] : null;
                  const conteudo = (
                    <>
                      {icone && svg(15, icone, '1.8', styles.topbarIcon)}
                      {v.text}
                    </>
                  );
                  // O mobile mostra só a 1ª mensagem.
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
              aria-controls="hd17-menu"
              onClick={() => abrirMenu(false)}
              data-role="hd-menu-button"
            >
              {gaveta ? Ico.close : Ico.menu}
            </button>

            <a
              className={styles.logo}
              href="/"
              aria-label={
                logoAlt ||
                (brandName ? `${brandName}, página inicial` : 'Página inicial')
              }
              data-role="hd-logo"
            >
              {logo ? (
                <img src={logo} alt="Logo" height={40} />
              ) : (
                <>
                  <span className={styles.logoMark} aria-hidden="true">
                    {svg(22, PATA, '1.8', styles.logoPaw)}
                  </span>
                  {brandName}
                </>
              )}
            </a>

            {busca(`${styles.search} ${styles.dsk}`, 'barra')}

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
                <>
                  {Ico.user(24)}
                  <span className={styles.accountText}>
                    {accountGreeting && (
                      <span className={styles.accountGreeting}>
                        {accountGreeting}
                      </span>
                    )}
                    <span className={styles.accountLabel}>
                      {accountLabel || 'Minha conta'}
                    </span>
                  </span>
                </>,
                `${styles.account} ${styles.dsk}`
              )}
              <a
                className={`${styles.iconButton} ${styles.wish} ${styles.dsk}`}
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
                {Ico.bag(20)}
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
              aria-label="Departamentos"
              data-role="hd-nav"
            >
              <ul className={styles.navList}>
                {[...comuns, ...destaques].map((item, i) => (
                  <li
                    key={i}
                    className={`${styles.navEntry}${item.highlight ? ` ${styles.navEntryHighlight}` : ''}`}
                  >
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
            <div id="hd17-menu" className={styles.drawer} data-role="hd-drawer">
              {busca(styles.drawerSearch, 'menu', buscaMenuRef)}
              <nav className={styles.drawerNav} aria-label="Menu">
                <ul className={styles.drawerList}>
                  {comuns.map((item, i) => (
                    <li key={i} className={styles.drawerEntry}>
                      {item.children?.length ? (
                        <>
                          <button
                            type="button"
                            className={styles.drawerItem}
                            aria-expanded={aberto === i}
                            onClick={() => setAberto(aberto === i ? null : i)}
                          >
                            {item.label}
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
                        <a className={styles.drawerItem} href={item.url || '#'}>
                          {item.label}
                          <span className={styles.chevron}>{Ico.right}</span>
                        </a>
                      )}
                    </li>
                  ))}
                  {destaques.map((item, i) => (
                    <li key={`d${i}`} className={styles.drawerHighlightEntry}>
                      <a
                        className={styles.drawerHighlight}
                        href={item.url || '#'}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className={styles.drawerFoot}>
                  {conta(
                    <>
                      {Ico.user(20)}
                      {accountMenuLabel || accountLabel || 'Entrar'}
                    </>,
                    styles.drawerLink
                  )}
                  <a className={styles.drawerLink} href={wishlistUrl || '#'}>
                    {Ico.heart(20)}
                    {wishlistLabel || 'Favoritos'}
                  </a>
                  {helpLabel && (
                    <a className={styles.drawerLink} href={helpUrl || '#'}>
                      {Ico.help}
                      {helpLabel}
                    </a>
                  )}
                </div>
              </nav>
            </div>
          )}
        </header>
      </div>
      <CartSidebar17
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onTotalChange={setTotalItems}
      />
    </>
  );
}

import React, { useEffect, useState } from 'react';

import CartSidebar12, { CART_12_QUANTIDADE } from '@/components/templates/_shared/CartSidebar12';
import { FONTES_12 } from '@/components/templates/common/template_12/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Header12` do faststore.starter (família 12, Suave; desenho
 * `Header12` / `Header12-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Régua rosada com o presente, a mensagem e "Ver regras"; abaixo, a barra branca em
 * pílula: a marca em serifa, o menu em pílulas (o item destaque na cor de acento), a busca
 * em pílula, conta e favoritos em círculos e a sacola no círculo de destaque com o
 * contador. Mobile: menu, marca, busca e sacola; o menu abre o painel com a busca, a lista,
 * "Entrar"/"Favoritos" e o link da régua no pé.
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, a marca em texto do catálogo,
 *    dentro do mesmo `.logo` / `data-role="hd-logo"`.
 *  - Busca sem GraphQL: as sugestões filtram uma lista fixa (os itens do menu e os
 *    produtos de exemplo do card 12); enviar só fecha as sugestões.
 *  - Carrinho: contador e gaveta (`_shared/CartSidebar12`) com o item de exemplo. A gaveta
 *    fica FORA do envelope `.header12Box`: o container-type dele prenderia a camada fixa.
 *  - Sem trava de scroll do <body> com o menu aberto: no canvas ela travaria o editor.
 *  - Sem item "atual" (`aria-current`): o canvas não tem rota.
 */

type Header12MenuItem = {
  label?: string;
  url?: string;
  highlight?: boolean;
  children?: { label?: string; url?: string }[];
};

const MOCK = {
  topbarText: 'Ganhe uma amostra em compras acima de R$ 150',
  topbarLinkLabel: 'Ver regras',
  topbarLinkMenuLabel: 'Ver regras da amostra grátis',
  topbarLinkUrl: '/regras-amostra-gratis',
  brandName: 'SERIE//A',
  menu: [
    { label: 'Skincare', url: '/skincare' },
    { label: 'Maquiagem', url: '/maquiagem' },
    { label: 'Cabelos', url: '/cabelos' },
    { label: 'Corpo e banho', url: '/corpo-e-banho' },
    { label: 'Kits', url: '/kits' },
    { label: 'Ofertas', url: '/ofertas', highlight: true },
  ] as Header12MenuItem[],
  searchPlaceholder: 'Buscar produto',
  accountLabel: 'Entrar',
  wishlistLabel: 'Favoritos',
  wishlistUrl: '/wishlist',
  cartLabel: 'Sacola',
};

// Produtos de exemplo do card 12, só para as sugestões da busca terem o que mostrar.
const PRODUTOS_BUSCA_12 = [
  { slug: 'protetor-solar-fps-50-toque-seco', name: 'Protetor Solar FPS 50 Toque Seco 40 ml' },
  { slug: 'serum-vitamina-c-10', name: 'Sérum Vitamina C 10% 30 ml' },
  { slug: 'agua-micelar-200-ml', name: 'Água Micelar 200 ml' },
  { slug: 'mascara-capilar-nutricao', name: 'Máscara Capilar Nutrição 250 g' },
];

const TERMOS_12 = MOCK.menu.map(m => m.label ?? '').filter(Boolean);

const svg = (w: number, children: React.ReactNode, join = false) => (
  <svg
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    {...(join ? { strokeLinejoin: 'round' as const } : {})}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Ico = {
  gift: (w: number) =>
    svg(
      w,
      <>
        <rect x="3" y="8" width="18" height="5" rx="1" />
        <path d="M5 13v8h14v-8M12 8v13" />
        <path d="M12 8c-2-4-6-3-5 0M12 8c2-4 6-3 5 0" />
      </>,
      true
    ),
  menu: svg(20, <path d="M4 7h16M4 12h16M4 17h10" />),
  close: svg(18, <path d="M6 6l12 12M18 6 6 18" />),
  search: (w: number) =>
    svg(
      w,
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  user: (w: number) =>
    svg(
      w,
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </>
    ),
  heart: (w: number) => svg(w, <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />, true),
  bag: (
    <svg className={styles.bagIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  ),
  chevron: svg(18, <path d="m9 6 6 6-6 6" />),
};

export default function Header12() {
  const { logo } = useLayout();
  const {
    topbarText,
    topbarLinkLabel,
    topbarLinkMenuLabel,
    topbarLinkUrl,
    brandName,
    menu,
    searchPlaceholder,
    accountLabel,
    wishlistLabel,
    wishlistUrl,
    cartLabel,
  } = MOCK;

  const [cartOpen, setCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(CART_12_QUANTIDADE);

  const [termo, setTermo] = useState('');
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false);
  const [gaveta, setGaveta] = useState(false);
  const [aberto, setAberto] = useState<number | null>(null);

  const termoLimpo = termo.trim().toLowerCase();
  const curto = termoLimpo.length < 2;
  const termos = curto ? [] : TERMOS_12.filter(t => t.toLowerCase().includes(termoLimpo));
  const produtos = curto ? [] : PRODUTOS_BUSCA_12.filter(p => p.name.toLowerCase().includes(termoLimpo));
  const temSugestao = sugestoesAbertas && (termos.length > 0 || produtos.length > 0);

  useEffect(() => {
    if (!gaveta) return;
    const fechar = (e: KeyboardEvent) => e.key === 'Escape' && setGaveta(false);
    document.addEventListener('keydown', fechar);
    return () => document.removeEventListener('keydown', fechar);
  }, [gaveta]);

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

  const abrirMenu = (busca: boolean) => {
    setGaveta(v => (busca ? true : !v));
  };

  const conta = (conteudo: React.ReactNode, className: string, rotulo?: string) => (
    <a className={className} href="/account" aria-label={rotulo} data-role="hd-account">
      {conteudo}
    </a>
  );

  const busca = (className: string, onde: string) => (
    <form className={className} role="search" onSubmit={buscar} data-role="hd-search">
      <label className={styles.searchField}>
        {/* Envio pelo Enter (form role="search"); a lupa do desenho é decorativa. */}
        {Ico.search(18)}
        <span className={styles.srOnly}>{searchPlaceholder || 'Buscar'}</span>
        <input
          id={`hd12-busca-${onde}`}
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
      {temSugestao && (
        <div className={styles.suggestions} data-role="hd-suggestions">
          {termos.length > 0 && (
            <ul className={styles.suggestList}>
              {termos.slice(0, 5).map(t => (
                <li key={t}>
                  <button type="button" className={styles.suggestItem} onMouseDown={e => e.preventDefault()} onClick={() => irPara(t)}>
                    {Ico.search(16)}
                    {t}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {produtos.length > 0 && (
            <ul className={styles.suggestList}>
              {produtos.slice(0, 4).map(p => (
                <li key={p.slug}>
                  <a className={styles.suggestItem} href={`/${p.slug}/p`}>
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

  const nomeSacola = (cartLabel || 'Sacola').toLowerCase();
  const rotuloCarrinho = `Abrir ${nomeSacola}, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
  const linkMenu = topbarLinkMenuLabel || topbarLinkLabel;

  return (
    <>
      <div className={styles.header12Box}>
        <header className={`${styles.header12}${gaveta ? ` ${styles.menuOpen}` : ''}`} data-role="hd-root">
          <link rel="stylesheet" href={FONTES_12} />

          {topbarText && (
            <div className={styles.topbar} data-role="hd-topbar">
              <span className={`${styles.topbarIcon} ${styles.dsk}`}>{Ico.gift(16)}</span>
              <span className={`${styles.topbarIcon} ${styles.mob}`}>{Ico.gift(14)}</span>
              <span>{topbarText}</span>
              {topbarLinkLabel && topbarLinkUrl && (
                <a className={`${styles.topbarLink} ${styles.dsk}`} href={topbarLinkUrl}>
                  {topbarLinkLabel}
                </a>
              )}
            </div>
          )}

          <div className={styles.bar} data-role="hd-bar">
            <button
              type="button"
              className={`${styles.round} ${styles.menuButton} ${styles.mob}`}
              aria-label={gaveta ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={gaveta}
              aria-controls="hd12-menu"
              onClick={() => abrirMenu(false)}
              data-role="hd-menu-button"
            >
              {gaveta ? Ico.close : Ico.menu}
            </button>

            <a className={styles.logo} href="/" aria-label={brandName || 'Página inicial'} data-role="hd-logo">
              {logo ? <img src={logo} alt="Logo" height={32} /> : brandName}
            </a>

            {menu.length > 0 && (
              <nav className={`${styles.nav} ${styles.dsk}`} aria-label="Categorias" data-role="hd-nav">
                <ul className={styles.navList}>
                  {menu.map((item, i) => (
                    <li key={i} className={styles.navEntry}>
                      <a
                        className={`${styles.navItem}${item.highlight ? ` ${styles.navHighlight}` : ''}`}
                        href={item.url || '#'}
                        data-role="hd-menu-item"
                      >
                        {item.label}
                      </a>
                      {!!item.children?.length && (
                        <ul className={styles.submenu} data-role="hd-submenu">
                          {item.children.map((c, j) => (
                            <li key={j}>
                              <a className={styles.submenuItem} href={c.url || '#'}>
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

            {busca(`${styles.search} ${styles.dsk}`, 'barra')}

            <div className={styles.actions}>
              <button
                type="button"
                className={`${styles.round} ${styles.mob}`}
                aria-label={searchPlaceholder || 'Buscar'}
                onClick={() => abrirMenu(true)}
                data-role="hd-search-button"
              >
                {Ico.search(18)}
              </button>
              {conta(Ico.user(20), `${styles.round} ${styles.dsk}`, accountLabel || 'Minha conta')}
              <a className={`${styles.round} ${styles.dsk}`} href={wishlistUrl || '#'} aria-label={wishlistLabel || 'Favoritos'} data-role="hd-wishlist">
                {Ico.heart(20)}
              </a>
              <button type="button" className={`${styles.round} ${styles.cart}`} onClick={() => setCartOpen(true)} aria-label={rotuloCarrinho} data-role="hd-cart">
                {Ico.bag}
                <span className={styles.cartCount} data-role="hd-badge">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              </button>
            </div>
          </div>

          {gaveta && (
            <div className={styles.drawerWrap}>
              <nav id="hd12-menu" className={styles.drawer} aria-label="Menu" data-role="hd-drawer">
                {busca(styles.drawerSearch, 'menu')}
                <ul className={styles.drawerList}>
                  {menu.map((item, i) => (
                    <li key={i}>
                      {item.children?.length ? (
                        <>
                          <button
                            type="button"
                            className={`${styles.drawerItem}${item.highlight ? ` ${styles.navHighlight}` : ''}`}
                            aria-expanded={aberto === i}
                            onClick={() => setAberto(aberto === i ? null : i)}
                          >
                            {item.label}
                            <span className={`${styles.chevron}${aberto === i ? ` ${styles.chevronOpen}` : ''}`}>{Ico.chevron}</span>
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
                        <a className={`${styles.drawerItem}${item.highlight ? ` ${styles.navHighlight}` : ''}`} href={item.url || '#'}>
                          {item.label}
                          <span className={styles.chevron}>{Ico.chevron}</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
                <div className={styles.drawerFoot}>
                  {conta(
                    <>
                      {Ico.user(18)}
                      {accountLabel || 'Entrar'}
                    </>,
                    styles.drawerLink
                  )}
                  <a className={styles.drawerLink} href={wishlistUrl || '#'}>
                    {Ico.heart(18)}
                    {wishlistLabel || 'Favoritos'}
                  </a>
                </div>
                {linkMenu && topbarLinkUrl && (
                  <a className={styles.drawerRules} href={topbarLinkUrl}>
                    {linkMenu}
                  </a>
                )}
              </nav>
            </div>
          )}
        </header>
      </div>

      <CartSidebar12 open={cartOpen} onClose={() => setCartOpen(false)} onTotalChange={setTotalItems} />
    </>
  );
}

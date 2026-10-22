import React, { useEffect, useState } from 'react';

import CartSidebar11, {
  CART_11_QUANTIDADE,
} from '@/components/templates/_shared/CartSidebar11';
import { FONTES_11 } from '@/components/templates/common/template_11/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Header11` do faststore.starter (família 11, Grade; desenho
 * `Header11` / `Header11-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e
 * as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Régua de mensagens em mono caixa-alta; a linha principal é uma grade de células entre
 * filetes: marca, menu numerado (01, 02…), busca, "Entrar", "Favoritos" e o carrinho no
 * preenchimento de destaque com o contador "[N]". Mobile: régua com a 1ª mensagem; menu,
 * marca e carrinho; o menu abre a tela com a busca, a lista numerada e, no pé, "Entrar" e
 * "Favoritos".
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, a marca em texto do catálogo
 *    (com o sobrescrito do mock), dentro do mesmo `.logo` / `data-role="hd-logo"`.
 *  - Busca sem GraphQL: as sugestões filtram uma lista fixa (os itens do menu e os
 *    produtos de exemplo da vitrine 11); enviar só fecha as sugestões.
 *  - Carrinho: contador e gaveta (`_shared/CartSidebar11`) com o item de exemplo. A
 *    gaveta fica FORA do envelope `.header11Box`: o container-type dele prenderia a
 *    camada fixa.
 *  - Sem trava de scroll do <body> com o menu aberto: no canvas ela travaria o editor.
 */

type Header11MenuItem = {
  label?: string;
  url?: string;
  children?: { label?: string; url?: string }[];
};

const MOCK = {
  topbarMessages: [
    { text: 'Frete grátis acima de R$ 500' },
    { text: 'Entrega em 48h nas capitais' },
    { text: 'Troca em 30 dias' },
    { text: 'Showroom SP · seg a sáb' },
  ] as { text?: string; url?: string }[],
  brandName: 'SERIE//A',
  brandSup: '®',
  menu: [
    { label: 'Loja', url: '/loja' },
    { label: 'Iluminação', url: '/iluminacao' },
    { label: 'Mobiliário', url: '/mobiliario' },
    { label: 'Objetos', url: '/objetos' },
    { label: 'Journal', url: '/journal' },
  ] as Header11MenuItem[],
  searchPlaceholder: 'Buscar',
  accountLabel: 'Entrar',
  wishlistLabel: 'Favoritos',
  wishlistUrl: '/wishlist',
  cartLabel: 'Carrinho',
};

// Produtos de exemplo das vitrines 11 (mock do `molecules/ProductShelf11`), só para as
// sugestões da busca terem o que mostrar.
const PRODUTOS_BUSCA_11 = [
  { slug: 'luminaria-de-mesa-arco', name: 'Luminária de Mesa Arco' },
  { slug: 'pendente-globo-vidro', name: 'Pendente Globo Vidro' },
  { slug: 'vaso-ceramica-cilindro', name: 'Vaso Cerâmica Cilindro' },
  { slug: 'cadeira-tubular-aco', name: 'Cadeira Tubular Aço' },
  { slug: 'banco-madeira-macica', name: 'Banco Madeira Maciça' },
  { slug: 'prateleira-modular', name: 'Prateleira Modular' },
];

const TERMOS_11 = MOCK.menu.map(m => m.label ?? '').filter(Boolean);

const svg = (w: number, children: React.ReactNode) => (
  <svg
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    {children}
  </svg>
);
const Ico = {
  menu: svg(22, <path d="M4 8h16M4 16h16" />),
  close: svg(20, <path d="M6 6l12 12M18 6 6 18" />),
  search: svg(
    18,
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  user: svg(
    18,
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </>
  ),
  heart: svg(
    18,
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
  ),
  bag: svg(
    18,
    <>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  chevron: svg(18, <path d="m9 6 6 6-6 6" />),
};

const ordinal = (i: number) => String(i + 1).padStart(2, '0');

export default function Header11() {
  const { logo } = useLayout();
  const {
    topbarMessages,
    brandName,
    brandSup,
    menu,
    searchPlaceholder,
    accountLabel,
    wishlistLabel,
    wishlistUrl,
    cartLabel,
  } = MOCK;

  const [cartOpen, setCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(CART_11_QUANTIDADE);

  const [termo, setTermo] = useState('');
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false);
  const [gaveta, setGaveta] = useState(false);
  const [aberto, setAberto] = useState<number | null>(null);

  const termoLimpo = termo.trim().toLowerCase();
  const curto = termoLimpo.length < 2;
  const termos = curto
    ? []
    : TERMOS_11.filter(t => t.toLowerCase().includes(termoLimpo));
  const produtos = curto
    ? []
    : PRODUTOS_BUSCA_11.filter(p => p.name.toLowerCase().includes(termoLimpo));
  const temSugestao =
    sugestoesAbertas && (termos.length > 0 || produtos.length > 0);

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

  const conta = (conteudo: React.ReactNode, className: string) => (
    <a className={className} href="/account" data-role="hd-account">
      {conteudo}
    </a>
  );

  const busca = (className: string, onde: string) => (
    <form
      className={className}
      role="search"
      onSubmit={buscar}
      data-role="hd-search"
    >
      <label className={styles.searchField}>
        {/* Envio pelo Enter (form role="search"); a lupa do desenho é decorativa. */}
        <span className={styles.searchIcon}>{Ico.search}</span>
        <span className={styles.srOnly}>{searchPlaceholder || 'Buscar'}</span>
        <input
          id={`hd11-busca-${onde}`}
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
            <ul>
              {termos.slice(0, 5).map(t => (
                <li key={t}>
                  <button
                    type="button"
                    className={styles.suggestTerm}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => irPara(t)}
                  >
                    {Ico.search}
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
                  <a className={styles.suggestProduct} href={`/${p.slug}/p`}>
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

  const rotuloCarrinho = `Abrir ${(cartLabel || 'carrinho').toLowerCase()}, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
  const mensagens = topbarMessages.filter(m => m?.text);

  return (
    <>
      <div className={styles.header11Box}>
        <header
          className={`${styles.header11}${gaveta ? ` ${styles.menuOpen}` : ''}`}
          data-role="hd-root"
        >
          <link rel="stylesheet" href={FONTES_11} />

          {mensagens.length > 0 && (
            <div className={styles.topbar} data-role="hd-topbar">
              <div className={styles.topbarInner}>
                {mensagens.map((m, i) =>
                  m.url ? (
                    <a
                      key={i}
                      className={i > 0 ? styles.dsk : undefined}
                      href={m.url}
                    >
                      {m.text}
                    </a>
                  ) : (
                    <span key={i} className={i > 0 ? styles.dsk : undefined}>
                      {m.text}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          <div className={styles.bar} data-role="hd-bar">
            <button
              type="button"
              className={`${styles.menuButton} ${styles.mob}`}
              aria-label={gaveta ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={gaveta}
              aria-controls="hd11-menu"
              onClick={() => setGaveta(v => !v)}
              data-role="hd-menu-button"
            >
              {gaveta ? Ico.close : Ico.menu}
            </button>

            <a
              className={styles.logo}
              href="/"
              aria-label={brandName || 'Página inicial'}
              data-role="hd-logo"
            >
              {logo ? (
                <img src={logo} alt="Logo" height={32} />
              ) : (
                <>
                  {brandName}
                  {brandSup && <sup className={styles.logoSup}>{brandSup}</sup>}
                </>
              )}
            </a>

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
                        className={styles.navItem}
                        href={item.url || '#'}
                        data-role="hd-menu-item"
                      >
                        <span className={styles.ordinal}>{ordinal(i)}</span>
                        {item.label}
                      </a>
                      {!!item.children?.length && (
                        <ul className={styles.submenu} data-role="hd-submenu">
                          {item.children.map((c, j) => (
                            <li key={j}>
                              <a
                                className={styles.submenuItem}
                                href={c.url || '#'}
                              >
                                <span className={styles.ordinal}>
                                  {ordinal(j)}
                                </span>
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

            {accountLabel &&
              conta(accountLabel, `${styles.cell} ${styles.dsk}`)}
            {wishlistLabel && (
              <a
                className={`${styles.cell} ${styles.dsk}`}
                href={wishlistUrl || '#'}
                data-role="hd-wishlist"
              >
                {wishlistLabel}
              </a>
            )}
            <button
              type="button"
              className={styles.cart}
              onClick={() => setCartOpen(true)}
              aria-label={rotuloCarrinho}
              data-role="hd-cart"
            >
              <span className={styles.mob}>{Ico.bag}</span>
              <span className={styles.dsk}>{cartLabel || 'Carrinho'}</span>
              <span className={styles.cartCount} data-role="hd-badge">
                [{totalItems > 99 ? '99+' : totalItems}]
              </span>
            </button>
          </div>

          {gaveta && (
            <nav
              id="hd11-menu"
              className={styles.drawer}
              aria-label="Menu"
              data-role="hd-drawer"
            >
              {busca(styles.drawerSearch, 'menu')}
              <ul>
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
                          <span className={styles.ordinal}>{ordinal(i)}</span>
                          <span className={styles.drawerLabel}>
                            {item.label}
                          </span>
                          <span
                            className={`${styles.chevron}${aberto === i ? ` ${styles.chevronOpen}` : ''}`}
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
                        <span className={styles.ordinal}>{ordinal(i)}</span>
                        <span className={styles.drawerLabel}>{item.label}</span>
                        <span className={styles.chevron}>{Ico.chevron}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <div className={styles.drawerFoot}>
                {conta(
                  <>
                    {Ico.user}
                    {accountLabel || 'Entrar'}
                  </>,
                  styles.drawerLink
                )}
                <a className={styles.drawerLink} href={wishlistUrl || '#'}>
                  {Ico.heart}
                  {wishlistLabel || 'Favoritos'}
                </a>
              </div>
            </nav>
          )}
        </header>
      </div>

      <CartSidebar11
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onTotalChange={setTotalItems}
      />
    </>
  );
}

import React, { useEffect, useRef, useState } from 'react';

import CartSidebar09, { CART_09_QUANTIDADE } from '@/components/templates/_shared/CartSidebar09';
import { FONTES_09, PRODUTOS_09 } from '@/components/templates/common/template_9/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Header09` do faststore.starter (família 09, Editorial; desenho
 * `Header09` / `Header09-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e
 * as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Régua de mensagens; busca à esquerda, marca no centro, conta, favoritos e sacola à
 * direita; navegação de categorias (com submenu) centralizada. Mobile: menu + busca,
 * marca e sacola; o menu abre a lista de categorias com conta, favoritos e atendimento.
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, a marca em texto do catálogo.
 *  - Busca sem GraphQL: as sugestões filtram uma lista fixa (os itens do menu e os
 *    produtos de exemplo da família 09); enviar só fecha as sugestões.
 *  - Sacola: contador e gaveta (`_shared/CartSidebar09`) com itens de exemplo. A gaveta
 *    fica FORA do envelope `.header09Box`: o container-type dele prenderia a camada fixa.
 *  - Sem trava de scroll do <body> com o menu aberto: no canvas ela travaria o editor.
 */

type Header09MenuItem = {
  label: string;
  url: string;
  highlight?: boolean;
  children?: { label: string; url: string }[];
};

const MOCK = {
  topbarMessages: [
    { text: 'Frete grátis acima de R$ 399' },
    { text: 'Troca fácil em 30 dias' },
    { text: 'Até 6x sem juros' },
  ] as { text: string; url?: string }[],
  searchPlaceholder: 'O que você procura?',
  accountLabel: 'Entrar',
  accountMobileLabel: 'Entrar ou criar conta',
  wishlistLabel: 'Favoritos',
  wishlistUrl: '/wishlist',
  cartLabel: 'Sacola',
  helpLabel: 'Atendimento',
  helpUrl: '/atendimento',
  menu: [
    { label: 'Novidades', url: '/novidades' },
    { label: 'Feminino', url: '/feminino' },
    { label: 'Masculino', url: '/masculino' },
    { label: 'Acessórios', url: '/acessorios' },
    { label: 'Casa', url: '/casa' },
    { label: 'Edições', url: '/edicoes' },
    { label: 'Sale', url: '/sale', highlight: true },
  ] as Header09MenuItem[],
};

const svg = (w: number, children: React.ReactNode) => (
  <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    {children}
  </svg>
);
const Ico = {
  menu: svg(22, <path d="M3 7h18M3 12h18M3 17h18" />),
  close: svg(22, <path d="M6 6l12 12M18 6 6 18" />),
  search: (w = 18) =>
    svg(
      w,
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  heart: (w = 20) => svg(w, <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />),
  bag: svg(
    20,
    <>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  chevron: svg(16, <path d="m9 6 6 6-6 6" />),
  user: svg(
    18,
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </>
  ),
  help: svg(
    18,
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
    </>
  ),
};

const TERMOS_09 = MOCK.menu.map(m => m.label);

export default function Header09() {
  const { logo } = useLayout();
  const {
    topbarMessages,
    searchPlaceholder,
    accountLabel,
    accountMobileLabel,
    wishlistLabel,
    wishlistUrl,
    cartLabel,
    helpLabel,
    helpUrl,
    menu,
  } = MOCK;

  const [cartOpen, setCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(CART_09_QUANTIDADE);

  const [termo, setTermo] = useState('');
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false);
  const [buscaMobile, setBuscaMobile] = useState(false);
  const [gaveta, setGaveta] = useState(false);
  const [aberto, setAberto] = useState<number | null>(null);
  const buscaMobileRef = useRef<HTMLInputElement>(null);

  const termoLimpo = termo.trim().toLowerCase();
  const curto = termoLimpo.length < 2;
  const termos = curto ? [] : TERMOS_09.filter(t => t.toLowerCase().includes(termoLimpo));
  const produtos = curto ? [] : PRODUTOS_09.filter(p => p.name.toLowerCase().includes(termoLimpo));
  const temSugestao = sugestoesAbertas && (termos.length > 0 || produtos.length > 0);

  useEffect(() => {
    if (buscaMobile) buscaMobileRef.current?.focus();
  }, [buscaMobile]);

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
    setBuscaMobile(false);
  };

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    irPara(termo);
  };

  const listaSugestoes = temSugestao && (
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
                {t}
              </button>
            </li>
          ))}
        </ul>
      )}
      {produtos.length > 0 && (
        <ul className={styles.suggestProducts}>
          {produtos.slice(0, 4).map(p => (
            <li key={p.id}>
              <a className={styles.suggestProduct} href={`/${p.id}/p`}>
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const campoBusca = (id: string, ref?: React.Ref<HTMLInputElement>) => (
    <form className={styles.search} role="search" onSubmit={buscar} data-role="hd-search">
      <button type="submit" className={styles.searchSubmit} aria-label="Buscar">
        {Ico.search(18)}
      </button>
      <label className={styles.srOnly} htmlFor={id}>
        {searchPlaceholder || 'Buscar'}
      </label>
      <input
        id={id}
        ref={ref}
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
      {listaSugestoes}
    </form>
  );

  const marca = (
    <a className={styles.logo} href="/" aria-label="Página inicial" data-role="hd-logo">
      {logo ? <img src={logo} alt="Logo" height={34} /> : <span>SERIE//A</span>}
    </a>
  );

  const conta = (conteudo: React.ReactNode, className: string) => (
    <a className={className} href="/account" data-role="hd-account">
      {conteudo}
    </a>
  );

  const rotuloSacola = `${cartLabel || 'Sacola'}${totalItems > 0 ? `, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : ''}`;

  return (
    <>
      <div className={styles.header09Box}>
        <header className={styles.header09} data-role="hd-root">
          <link rel="stylesheet" href={FONTES_09} />
          {topbarMessages.length > 0 && (
            <div className={styles.topbar} data-role="hd-topbar">
              {topbarMessages.map((m, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span className={styles.topbarSep} aria-hidden="true">
                      ·
                    </span>
                  )}
                  {m.url ? (
                    <a className={i > 0 ? styles.topbarExtra : undefined} href={m.url}>
                      {m.text}
                    </a>
                  ) : (
                    <span className={i > 0 ? styles.topbarExtra : undefined}>{m.text}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <div className={styles.bar} data-role="hd-bar">
            <div className={styles.barStart}>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.mob}`}
                aria-label={gaveta ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={gaveta}
                aria-controls="hd09-menu"
                onClick={() => setGaveta(v => !v)}
                data-role="hd-menu-button"
              >
                {gaveta ? Ico.close : Ico.menu}
              </button>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.mob}`}
                aria-label="Buscar"
                aria-expanded={buscaMobile}
                onClick={() => setBuscaMobile(v => !v)}
                data-role="hd-search-button"
              >
                {Ico.search(20)}
              </button>
              <div className={styles.dsk}>{campoBusca('hd09-busca')}</div>
            </div>

            {marca}

            <div className={styles.barEnd}>
              {conta(accountLabel, `${styles.textLink} ${styles.dsk}`)}
              <a
                className={`${styles.wishlist} ${styles.dsk}`}
                href={wishlistUrl || '#'}
                aria-label={wishlistLabel}
                data-role="hd-wishlist"
              >
                {Ico.heart(20)}
              </a>
              <button
                type="button"
                className={styles.cart}
                onClick={() => setCartOpen(true)}
                aria-label={rotuloSacola}
                data-role="hd-cart"
              >
                {Ico.bag}
                <span className={styles.cartLabel} aria-hidden="true">
                  {cartLabel} ({totalItems})
                </span>
                {totalItems > 0 && (
                  <span className={styles.cartBadge} aria-hidden="true" data-role="hd-badge">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {buscaMobile && <div className={styles.msearch}>{campoBusca('hd09-busca-m', buscaMobileRef)}</div>}

          {menu.length > 0 && (
            <nav className={styles.nav} aria-label="Categorias" data-role="hd-nav">
              <ul className={styles.navList}>
                {menu.map((item, i) => (
                  <li key={i} className={styles.navEntry}>
                    <a
                      className={`${styles.navItem}${item.highlight ? ` ${styles.accent}` : ''}`}
                      href={item.url || '#'}
                      data-role="hd-menu-item"
                    >
                      {item.label}
                    </a>
                    {!!item.children?.length && (
                      <ul className={styles.submenu}>
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

          {gaveta && (
            <nav id="hd09-menu" className={styles.drawer} aria-label="Menu" data-role="hd-drawer">
              <ul className={styles.drawerList}>
                {menu.map((item, i) => (
                  <li key={i} className={styles.drawerEntry}>
                    {item.children?.length ? (
                      <>
                        <button
                          type="button"
                          className={`${styles.drawerItem}${item.highlight ? ` ${styles.accent}` : ''}`}
                          aria-expanded={aberto === i}
                          onClick={() => setAberto(aberto === i ? null : i)}
                        >
                          {item.label}
                          <span className={aberto === i ? styles.chevronOpen : styles.chevron}>{Ico.chevron}</span>
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
                        className={`${styles.drawerItem}${item.highlight ? ` ${styles.accent}` : ''}`}
                        href={item.url || '#'}
                      >
                        {item.label}
                        {!item.highlight && <span className={styles.chevron}>{Ico.chevron}</span>}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <div className={styles.drawerFoot}>
                {conta(
                  <>
                    {Ico.user}
                    {accountMobileLabel}
                  </>,
                  styles.drawerLink
                )}
                {wishlistLabel && (
                  <a className={styles.drawerLink} href={wishlistUrl || '#'}>
                    {Ico.heart(18)}
                    {wishlistLabel}
                  </a>
                )}
                {helpLabel && (
                  <a className={styles.drawerLink} href={helpUrl || '#'}>
                    {Ico.help}
                    {helpLabel}
                  </a>
                )}
              </div>
            </nav>
          )}
        </header>
      </div>

      <CartSidebar09 open={cartOpen} onClose={() => setCartOpen(false)} onTotalChange={setTotalItems} />
    </>
  );
}

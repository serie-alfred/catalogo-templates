import React, { useEffect, useRef, useState } from 'react';

import CartSidebar13, { CART_13_QUANTIDADE } from '@/components/templates/_shared/CartSidebar13';
import { FONTES_13, PRODUTOS_13 } from '@/components/templates/common/template_13/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Header13` do faststore.starter (família 13, Noturno; desenho
 * `Header13` / `Header13-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Fita verde com as mensagens em condensada maiúscula, separadas por asteriscos e repetidas
 * até o fim da tela; abaixo, a barra preta com a marca (a barra em verde), o menu em
 * condensada (o item com marcador ganha o sublinhado verde; o destaque sai em verde), busca,
 * favoritos, conta e a "Bag (N)" no bloco verde. Mobile: menu, marca, busca e "(N)"; o menu
 * abre a tela inteira com a lista grande, setas e, no pé, conta, favoritos e ajuda.
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, a marca em texto do catálogo
 *    ("SERIE//A", as barras na cor de destaque, como a "/" de lá), no mesmo `.logo` /
 *    `data-role="hd-logo"`.
 *  - Busca sem GraphQL: as sugestões filtram uma lista fixa (os itens do menu e os
 *    produtos de exemplo do card 13); enviar só fecha a faixa.
 *  - Carrinho: contador e gaveta (`_shared/CartSidebar13`) com o item de exemplo. A gaveta
 *    fica FORA do envelope `.header13Box`: o container-type dele prenderia a camada fixa.
 *  - Sem trava de scroll do <body> com o menu aberto: no canvas ela travaria o editor.
 *  - Sem item "atual" (`aria-current`): o canvas não tem rota.
 */

type Header13MenuItem = {
  label?: string;
  url?: string;
  highlight?: boolean;
  marker?: boolean;
  children?: { label?: string; url?: string }[];
};

const MOCK = {
  topbarItems: [{ text: 'Drop 07' }, { text: 'Frete grátis acima de R$ 299' }, { text: 'Até 6x sem juros' }, { text: 'Troca grátis' }],
  brandName: 'SERIE//A',
  menu: [
    { label: 'Drops', url: '/drops', marker: true },
    { label: 'Roupas', url: '/roupas' },
    { label: 'Tênis', url: '/tenis' },
    { label: 'Acessórios', url: '/acessorios' },
    { label: 'Colabs', url: '/colabs' },
    { label: 'Outlet', url: '/outlet', highlight: true },
  ] as Header13MenuItem[],
  searchPlaceholder: 'Buscar',
  accountLabel: 'Entrar / Cadastrar',
  wishlistLabel: 'Favoritos',
  wishlistUrl: '/wishlist',
  helpLabel: 'Ajuda',
  helpUrl: '/ajuda',
  cartLabel: 'Bag',
};

const TERMOS_13 = MOCK.menu.map(m => m.label ?? '').filter(Boolean);

const svg = (w: number, children: React.ReactNode, sw = '1.8', className?: string) => (
  <svg className={className} width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} aria-hidden="true">
    {children}
  </svg>
);

const Ico = {
  star: () => svg(14, <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />, '2.6', styles.star),
  menu: svg(24, <path d="M3 7h18M3 12h18M3 17h12" />),
  close: svg(22, <path d="M6 6l12 12M18 6 6 18" />),
  search: svg(
    22,
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>,
    '1.8',
    styles.searchIcon
  ),
  user: (w: number) =>
    svg(
      w,
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </>
    ),
  heart: (w: number) => svg(w, <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />),
  help: svg(
    20,
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
    </>
  ),
  bag: svg(
    18,
    <>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>,
    '2',
    styles.bagIcon
  ),
  chevron: svg(20, <path d="m9 6 6 6-6 6" />, '2', styles.chevron),
};

/** A marca em texto: a barra sai na cor de destaque. */
function Marca({ nome }: { nome: string }) {
  const partes = nome.split('/');
  return (
    <>
      {partes.map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={styles.slash}>/</span>}
          {p}
        </React.Fragment>
      ))}
    </>
  );
}

export default function Header13() {
  const { logo } = useLayout();
  const {
    topbarItems,
    brandName,
    menu,
    searchPlaceholder,
    accountLabel,
    wishlistLabel,
    wishlistUrl,
    helpLabel,
    helpUrl,
    cartLabel,
  } = MOCK;

  const [cartOpen, setCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(CART_13_QUANTIDADE);

  const [termo, setTermo] = useState('');
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false);
  const [busca, setBusca] = useState(false);
  const [gaveta, setGaveta] = useState(false);
  const [aberto, setAberto] = useState<number | null>(null);
  const buscaRef = useRef<HTMLInputElement>(null);

  const termoLimpo = termo.trim().toLowerCase();
  const curto = termoLimpo.length < 2;
  const termos = curto ? [] : TERMOS_13.filter(t => t.toLowerCase().includes(termoLimpo)).map(value => ({ value }));
  const produtos = curto ? [] : PRODUTOS_13.filter(p => p.name.toLowerCase().includes(termoLimpo));
  const temSugestao = sugestoesAbertas && (termos.length > 0 || produtos.length > 0);

  useEffect(() => {
    if (busca) buscaRef.current?.focus();
  }, [busca]);

  useEffect(() => {
    if (!gaveta && !busca) return;
    const fechar = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setGaveta(false);
      setBusca(false);
    };
    document.addEventListener('keydown', fechar);
    return () => document.removeEventListener('keydown', fechar);
  }, [gaveta, busca]);

  const irPara = (t: string) => {
    if (!t.trim()) return;
    setTermo(t);
    setSugestoesAbertas(false);
    setBusca(false);
    setGaveta(false);
  };

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    irPara(termo);
  };

  const conta = (conteudo: React.ReactNode, className: string, rotulo?: string) => (
    <a className={className} href="/account" aria-label={rotulo} data-role="hd-account">
      {conteudo}
    </a>
  );

  const nomeSacola = cartLabel || 'Bag';
  const rotuloCarrinho = `Abrir ${nomeSacola.toLowerCase()}, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
  const mensagens = topbarItems.filter(t => t.text);
  const contagem = totalItems > 99 ? '99+' : totalItems;

  return (
    <>
      <div className={styles.header13Box}>
        <header className={`${styles.header13}${gaveta ? ` ${styles.menuOpen}` : ''}`} data-role="hd-root">
          <link rel="stylesheet" href={FONTES_13} />

          {mensagens.length > 0 && (
            <div className={styles.topbar} data-role="hd-topbar">
              <div className={styles.tape}>
                {/* A fita repete as mensagens até o fim da tela; só a 1ª volta é lida. */}
                {[0, 1, 2].map(volta => (
                  <span key={volta} className={styles.lap} {...(volta ? { 'aria-hidden': true } : {})}>
                    {mensagens.map((m, i) => (
                      <React.Fragment key={i}>
                        <span>{m.text}</span>
                        {Ico.star()}
                      </React.Fragment>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.barWrap}>
            <div className={styles.bar} data-role="hd-bar">
              <button
                type="button"
                className={`${styles.icon} ${styles.mob}`}
                aria-label={gaveta ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={gaveta}
                aria-controls="hd13-menu"
                onClick={() => setGaveta(v => !v)}
                data-role="hd-menu-button"
              >
                {gaveta ? Ico.close : Ico.menu}
              </button>

              <a className={styles.logo} href="/" aria-label={brandName || 'Página inicial'} data-role="hd-logo">
                {logo ? <img src={logo} alt="Logo" height={32} /> : <Marca nome={brandName} />}
              </a>

              {menu.length > 0 && (
                <nav className={`${styles.nav} ${styles.dsk}`} aria-label="Principal" data-role="hd-nav">
                  <ul className={styles.navList}>
                    {menu.map((item, i) => (
                      <li key={i} className={styles.navEntry}>
                        <a
                          className={`${styles.navItem}${item.highlight ? ` ${styles.highlight}` : ''}${item.marker ? ` ${styles.marked}` : ''}`}
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

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.icon}
                  aria-label={searchPlaceholder || 'Buscar'}
                  aria-expanded={busca}
                  aria-controls="hd13-busca"
                  onClick={() => setBusca(v => !v)}
                  data-role="hd-search-button"
                >
                  {Ico.search}
                </button>
                <a className={`${styles.icon} ${styles.dsk}`} href={wishlistUrl || '#'} aria-label={wishlistLabel || 'Favoritos'} data-role="hd-wishlist">
                  {Ico.heart(22)}
                </a>
                {conta(Ico.user(22), `${styles.icon} ${styles.dsk}`, accountLabel || 'Entrar na minha conta')}
                <button type="button" className={styles.cart} onClick={() => setCartOpen(true)} aria-label={rotuloCarrinho} data-role="hd-cart">
                  {Ico.bag}
                  <span>
                    <span className={styles.dsk}>{nomeSacola} </span>
                    <span data-role="hd-badge">({contagem})</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {busca && (
            <div id="hd13-busca" className={styles.searchStrip}>
              <form className={styles.search} role="search" onSubmit={buscar} data-role="hd-search">
                <label className={styles.searchField}>
                  <span className={styles.srOnly}>{searchPlaceholder || 'Buscar'}</span>
                  <input
                    ref={buscaRef}
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
                <button type="submit" className={styles.searchSubmit} aria-label="Buscar">
                  {Ico.search}
                </button>
                {temSugestao && (
                  <div className={styles.suggestions} data-role="hd-suggestions">
                    {termos.length > 0 && (
                      <ul className={styles.suggestList}>
                        {termos.slice(0, 5).map(t => (
                          <li key={t.value}>
                            <button type="button" className={styles.suggestItem} onMouseDown={e => e.preventDefault()} onClick={() => irPara(t.value)}>
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
                            <a className={styles.suggestItem} href={`/${p.id}/p`}>
                              {p.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}

          {gaveta && (
            <nav id="hd13-menu" className={styles.drawer} aria-label="Menu" data-role="hd-drawer">
              <ul className={styles.drawerList}>
                {menu.map((item, i) => {
                  const cls = `${styles.drawerItem}${item.highlight ? ` ${styles.highlight}` : ''}`;
                  const rotulo = (
                    <span className={styles.drawerLabel}>
                      {item.label}
                      {item.marker && <span className={styles.dot} aria-hidden="true" />}
                    </span>
                  );
                  return (
                    <li key={i} className={styles.drawerEntry}>
                      {item.children?.length ? (
                        <>
                          <button type="button" className={cls} aria-expanded={aberto === i} onClick={() => setAberto(aberto === i ? null : i)}>
                            {rotulo}
                            <span className={aberto === i ? styles.chevronOpen : undefined}>{Ico.chevron}</span>
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
                        <a className={cls} href={item.url || '#'}>
                          {rotulo}
                          {Ico.chevron}
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
                {helpLabel && helpUrl && (
                  <a className={styles.drawerLink} href={helpUrl}>
                    {Ico.help}
                    {helpLabel}
                  </a>
                )}
              </div>
            </nav>
          )}
        </header>
      </div>

      <CartSidebar13 open={cartOpen} onClose={() => setCartOpen(false)} onTotalChange={setTotalItems} />
    </>
  );
}

import React, { useEffect, useRef, useState } from 'react';

import CartSidebar14, { CART_14_QUANTIDADE } from '@/components/templates/_shared/CartSidebar14';
import { FONTES_14, PRODUTOS_14 } from '@/components/templates/common/template_14/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Header14` do faststore.starter (família 14, Esportiva; desenho
 * `Header14` / `Header14-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Faixa marinho no topo com as mensagens em Saira itálica correndo de lado (para com
 * `prefers-reduced-motion`: desvio aprovado da 14), separadas por raios; abaixo, a barra
 * branca com a marca (a barra vira o traço vermelho inclinado), o menu em Saira itálica (o
 * item com marcador ganha o sublinhado grosso vermelho; "Ofertas" sai em vermelho), a busca
 * em paralelogramo, favoritos, conta e a "Sacola" no paralelogramo vermelho com o contador.
 * Mobile: menu, marca, busca e a sacola; o menu abre a tela inteira com a busca, a lista
 * grande (marcador = traço vermelho), setas e, no pé, a conta e os links de ajuda.
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, a marca em texto do catálogo
 *    ("SERIE/A", a barra virando o traço de destaque, como a "/" de lá), no mesmo
 *    `.logo` / `data-role="hd-logo"`.
 *  - Busca sem GraphQL: as sugestões filtram uma lista fixa (os itens do menu e os
 *    produtos de exemplo do card 14); enviar só fecha.
 *  - Carrinho: contador e gaveta (`_shared/CartSidebar14`) com o item de exemplo. A gaveta
 *    fica FORA do envelope `.header14Box`: o container-type dele prenderia a camada fixa.
 *  - Conta sem `ProfileChallenge` (sempre o link de conta); sem trava de scroll do <body>
 *    com o menu aberto (no canvas ela travaria o editor); sem item "atual" (sem rota).
 */

type Header14MenuItem = {
  label?: string;
  url?: string;
  highlight?: boolean;
  marker?: boolean;
  children?: { label?: string; url?: string }[];
};

type Header14DrawerIcon = 'none' | 'orders' | 'help';

const MOCK = {
  topbarItems: [
    { text: 'Frete grátis acima de R$ 299' },
    { text: 'Até 10x sem juros' },
    { text: 'Troca grátis em 30 dias' },
    { text: 'Retire na loja em 2 h' },
  ],
  brandName: 'SERIE/A',
  menu: [
    { label: 'Corrida', url: '/corrida', marker: true },
    { label: 'Treino', url: '/treino' },
    { label: 'Futebol', url: '/futebol' },
    { label: 'Ciclismo', url: '/ciclismo' },
    { label: 'Suplementos', url: '/suplementos' },
    { label: 'Ofertas', url: '/ofertas', highlight: true },
  ] as Header14MenuItem[],
  searchPlaceholder: 'Buscar tênis, whey, garrafa…',
  accountLabel: 'Entrar ou cadastrar',
  wishlistLabel: 'Favoritos',
  wishlistUrl: '/wishlist',
  drawerLinks: [
    { label: 'Meus pedidos', url: '/account/orders', icon: 'orders' },
    { label: 'Central de ajuda', url: '/ajuda', icon: 'help' },
  ] as { label?: string; url?: string; icon?: Header14DrawerIcon }[],
  cartLabel: 'Sacola',
};

const TERMOS_14 = MOCK.menu.map(m => m.label ?? '').filter(Boolean);

const svg = (w: number, children: React.ReactNode, sw = '2', className?: string) => (
  <svg className={className} width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="square" aria-hidden="true">
    {children}
  </svg>
);

const Ico = {
  bolt: () => svg(14, <path d="M13 2 4 14h7l-1 8 9-12h-7z" />, '2', styles.bolt),
  menu: svg(24, <path d="M3 7h18M3 12h18M3 17h12" />, '2.2'),
  close: svg(22, <path d="M6 6l12 12M18 6 6 18" />, '2.2'),
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
  heart: (w: number) => svg(w, <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />),
  orders: svg(
    20,
    <>
      <path d="M3 7l9-4 9 4v10l-9 4-9-4z" />
      <path d="M3 7l9 4 9-4M12 11v10" />
    </>
  ),
  help: svg(
    20,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01" />
    </>
  ),
  bag: svg(
    20,
    <>
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>,
    '2.2',
    styles.bagIcon
  ),
  chevron: svg(20, <path d="m9 6 6 6-6 6" />, '2.4', styles.chevron),
};

/** "SERIE/A": a barra vira o traço inclinado na cor de destaque. */
function Marca({ nome }: { nome: string }) {
  return (
    <>
      {nome.split('/').map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={styles.slash} aria-hidden="true" />}
          {p}
        </React.Fragment>
      ))}
    </>
  );
}

export default function Header14() {
  const { logo } = useLayout();
  const { topbarItems, brandName, menu, searchPlaceholder, accountLabel, wishlistLabel, wishlistUrl, drawerLinks, cartLabel } = MOCK;

  const [cartOpen, setCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(CART_14_QUANTIDADE);

  const [termo, setTermo] = useState('');
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false);
  const [gaveta, setGaveta] = useState(false);
  const [focarBusca, setFocarBusca] = useState(false);
  const [aberto, setAberto] = useState<number | null>(null);
  const buscaMobRef = useRef<HTMLInputElement>(null);

  const termoLimpo = termo.trim().toLowerCase();
  const curto = termoLimpo.length < 2;
  const termos = curto ? [] : TERMOS_14.filter(t => t.toLowerCase().includes(termoLimpo)).map(value => ({ value }));
  const produtos = curto ? [] : PRODUTOS_14.filter(p => p.name.toLowerCase().includes(termoLimpo));
  const temSugestao = sugestoesAbertas && (termos.length > 0 || produtos.length > 0);

  useEffect(() => {
    if (gaveta && focarBusca) {
      buscaMobRef.current?.focus();
      setFocarBusca(false);
    }
  }, [gaveta, focarBusca]);

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

  const conta = (conteudo: React.ReactNode, className: string, rotulo?: string) => (
    <a className={className} href="/account" aria-label={rotulo} data-role="hd-account">
      {conteudo}
    </a>
  );

  const formBusca = (variante: 'dsk' | 'mob') => {
    const id = `hd14-busca-${variante}`;
    return (
      <form className={variante === 'dsk' ? `${styles.search} ${styles.dsk}` : styles.drawerSearch} role="search" onSubmit={buscar} data-role="hd-search">
        <label htmlFor={id} className={styles.srOnly}>
          {searchPlaceholder || 'Buscar produtos'}
        </label>
        <input
          id={id}
          ref={variante === 'mob' ? buscaMobRef : undefined}
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
        <button type="submit" className={styles.searchSubmit} aria-label="Buscar">
          {Ico.search(20)}
        </button>
      </form>
    );
  };

  const sugestoesEl = temSugestao && (
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
              <a className={styles.suggestItem} href={`/${p.id}/p`} onMouseDown={e => e.preventDefault()}>
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const nomeSacola = cartLabel || 'Sacola';
  const rotuloCarrinho = `Abrir ${nomeSacola.toLowerCase()}, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
  const mensagens = topbarItems.filter(t => t.text);
  const contagem = totalItems > 99 ? '99+' : totalItems;
  const linksPe = drawerLinks.filter(l => l.label && l.url);

  return (
    <>
      <div className={styles.header14Box}>
        <header className={`${styles.header14}${gaveta ? ` ${styles.menuOpen}` : ''}`} data-role="hd-root">
          <link rel="stylesheet" href={FONTES_14} />

          {mensagens.length > 0 && (
            <div className={styles.topbar} data-role="hd-topbar">
              <div className={styles.tape}>
                {/* Duas metades iguais: a animação anda -50% e emenda. Só a 1ª volta é lida. */}
                {[0, 1, 2, 3].map(volta => (
                  <span key={volta} className={styles.lap} {...(volta ? { 'aria-hidden': true } : {})}>
                    {mensagens.map((m, i) => (
                      <React.Fragment key={i}>
                        <span>{m.text}</span>
                        {Ico.bolt()}
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
                aria-controls="hd14-menu"
                onClick={() => setGaveta(v => !v)}
                data-role="hd-menu-button"
              >
                {gaveta ? Ico.close : Ico.menu}
              </button>

              <a className={styles.logo} href="/" aria-label={`${brandName.replace('/', ' ')}, página inicial`} data-role="hd-logo">
                {logo ? <img src={logo} alt="Logo" height={30} /> : <Marca nome={brandName} />}
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
                <div className={`${styles.searchWrap} ${styles.dsk}`}>
                  {formBusca('dsk')}
                  {!gaveta && sugestoesEl}
                </div>
                {!gaveta && (
                  <button
                    type="button"
                    className={`${styles.icon} ${styles.mob}`}
                    aria-label="Buscar"
                    aria-controls="hd14-menu"
                    onClick={() => {
                      setGaveta(true);
                      setFocarBusca(true);
                    }}
                    data-role="hd-search-button"
                  >
                    {Ico.search(22)}
                  </button>
                )}
                <a
                  className={`${styles.icon}${gaveta ? '' : ` ${styles.dsk}`}`}
                  href={wishlistUrl || '#'}
                  aria-label={wishlistLabel || 'Favoritos'}
                  data-role="hd-wishlist"
                >
                  {Ico.heart(22)}
                </a>
                {conta(Ico.user(22), `${styles.icon} ${styles.dsk}`, accountLabel || 'Entrar na minha conta')}
                <button type="button" className={styles.cart} onClick={() => setCartOpen(true)} aria-label={rotuloCarrinho} data-role="hd-cart">
                  {Ico.bag}
                  <span className={styles.dsk}>{nomeSacola}</span>
                  <span className={styles.badge} data-role="hd-badge">
                    {contagem}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {gaveta && (
            <div id="hd14-menu" className={styles.drawer} data-role="hd-drawer">
              <div className={styles.drawerSearchWrap}>
                {formBusca('mob')}
                {sugestoesEl}
              </div>
              <nav className={styles.drawerNav} aria-label="Menu">
                <ul className={styles.drawerList}>
                  {menu.map((item, i) => {
                    const cls = `${styles.drawerItem}${item.highlight ? ` ${styles.highlight}` : ''}`;
                    const rotulo = (
                      <span className={styles.drawerLabel}>
                        {item.marker && <span className={styles.dash} aria-hidden="true" />}
                        {item.label}
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
                  {linksPe.map((l, i) => (
                    <a key={i} className={styles.drawerLink} href={l.url}>
                      {l.icon === 'orders' ? Ico.orders : l.icon === 'help' ? Ico.help : null}
                      {l.label}
                    </a>
                  ))}
                </div>
              </nav>
            </div>
          )}
        </header>
      </div>

      <CartSidebar14 open={cartOpen} onClose={() => setCartOpen(false)} onTotalChange={setTotalItems} />
    </>
  );
}

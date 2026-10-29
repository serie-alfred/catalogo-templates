import React, { useEffect, useRef, useState } from 'react';

import CartSidebar15, {
  CART_15_QUANTIDADE,
} from '@/components/templates/_shared/CartSidebar15';
import {
  FONTES_15,
  PRODUTOS_15,
} from '@/components/templates/common/template_15/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Header15` do faststore.starter (família 15, Luxo; desenho `Header15` /
 * `Header15-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Faixa escura com a mensagem e o presente; a busca em fio à esquerda, a marca em serifa
 * espaçada no centro com o fio dourado e "Joalheria", e conta, favoritos e a sacola com o
 * contador no quadrado dourado à direita; o menu em versalete entre dois fios, o item com
 * marcador com o fio dourado embaixo e o destaque em dourado. Mobile: menu, marca, busca e
 * sacola; o menu abre a lista grande em serifa e, no pé, "Sua conta".
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, a marca em texto do mock de lá
 *    ("Sua Marca"), no mesmo `.logo` / `data-role="hd-logo"`.
 *  - Busca sem GraphQL: as sugestões filtram uma lista fixa (os itens do menu e os
 *    produtos de exemplo do card 15); enviar só fecha a faixa.
 *  - Conta sem `ProfileChallenge`: o link de conta, sem sessão.
 *  - Carrinho: contador e gaveta (`_shared/CartSidebar15`) com o item de exemplo. A gaveta
 *    fica FORA do envelope `.header15Box`: o container-type dele prenderia a camada fixa.
 *  - Sem trava de scroll do <body> com o menu aberto: no canvas ela travaria o editor.
 *  - Sem item "atual" (`aria-current`): o canvas não tem rota.
 */

interface Header15MenuItem {
  label?: string;
  url?: string;
  /** Texto na cor de destaque (o "Coleções" do desenho; itálico no menu mobile). */
  highlight?: boolean;
  /** Fio dourado sob o item no desktop (o "Joias" do desenho). */
  marker?: boolean;
  /** Submenu (mega-menu do CMS): painel no hover/foco no desktop, acordeão no mobile. */
  children?: { label?: string; url?: string }[];
}

interface Header15Props {
  /** Mensagens da faixa do topo; no mobile só a 1ª. */
  topbarMessages?: { text?: string; url?: string }[];
  /** Imagem do logo. Vazio: a marca em texto (`brandName`). */
  logo?: string;
  logoAlt?: string;
  brandName?: string;
  /** Rótulo sob a marca, entre fios ("Joalheria"). Só no desktop; vazio some. */
  brandTagline?: string;
  searchPlaceholder?: string;
  /** Nome acessível do ícone da conta no desktop. */
  accountLabel?: string;
  /** Título do bloco da conta no pé do menu mobile ("Sua conta"). */
  accountTitle?: string;
  /** Link da conta no pé do menu mobile ("Entrar ou cadastrar"). */
  accountMobileLabel?: string;
  wishlistLabel?: string;
  wishlistUrl?: string;
  /** Nome da sacola, usado no rótulo acessível do botão. */
  cartLabel?: string;
  helpLabel?: string;
  helpUrl?: string;
  menu?: Header15MenuItem[];
}

const svg = (w: number, children: React.ReactNode, className?: string) => (
  <svg
    className={className}
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    {children}
  </svg>
);
const Ico = {
  gift: svg(
    14,
    <path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-2-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3-2-5 1" />
  ),
  menu: svg(22, <path d="M3 8h18M3 16h18" />),
  close: svg(22, <path d="M6 6l12 12M18 6 6 18" />),
  search: (w = 18) =>
    svg(
      w,
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
  user: (w = 20) =>
    svg(
      w,
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
      </>
    ),
  heart: (w = 20) =>
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
  chevron: svg(18, <path d="m9 6 6 6-6 6" />),
  help: svg(19, <path d="M4 20l1.5-4A8 8 0 1 1 9 19.5z" />),
};

export default function Header15() {
  const { logo } = useLayout();
  const {
    topbarMessages = [],
    logoAlt,
    brandName,
    brandTagline,
    searchPlaceholder,
    accountLabel,
    accountTitle,
    accountMobileLabel,
    wishlistLabel,
    wishlistUrl,
    cartLabel,
    helpLabel,
    helpUrl,
    menu = [],
  } = MOCK;

  const [cartOpen, setCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(CART_15_QUANTIDADE);
  const abrirCarrinho = () => setCartOpen(true);

  const [termo, setTermo] = useState('');
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false);
  const [buscaMobile, setBuscaMobile] = useState(false);
  const [gaveta, setGaveta] = useState(false);
  const [aberto, setAberto] = useState<number | null>(null);
  const buscaMobileRef = useRef<HTMLInputElement>(null);

  const termoLimpo = termo.trim().toLowerCase();
  const curto = termoLimpo.length < 2;
  const termos = curto
    ? []
    : TERMOS_15.filter(t => t.toLowerCase().includes(termoLimpo)).map(
        value => ({ value })
      );
  const produtos = curto
    ? []
    : PRODUTOS_15.filter(p => p.name.toLowerCase().includes(termoLimpo));
  const temSugestao =
    sugestoesAbertas && (termos.length > 0 || produtos.length > 0);

  useEffect(() => {
    if (buscaMobile) buscaMobileRef.current?.focus();
  }, [buscaMobile]);

  useEffect(() => {
    if (!gaveta && !buscaMobile) return;
    const fechar = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setGaveta(false);
      setBuscaMobile(false);
    };
    document.addEventListener('keydown', fechar);
    return () => document.removeEventListener('keydown', fechar);
  }, [gaveta, buscaMobile]);

  const irPara = (t: string) => {
    const limpo = t.trim();
    if (!limpo) return;
    setTermo(limpo);
    setSugestoesAbertas(false);
    setBuscaMobile(false);
    setGaveta(false);
  };

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    irPara(termo);
  };

  const listaSugestoes = temSugestao && (
    <div className={styles.suggestions} data-role="hd-suggestions">
      {termos.length > 0 && (
        <ul className={styles.suggestTerms}>
          {termos.slice(0, 5).map(t => (
            <li key={t.value}>
              <button
                type="button"
                className={styles.suggestTerm}
                onMouseDown={e => e.preventDefault()}
                onClick={() => irPara(t.value)}
              >
                {t.value}
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
    <form
      className={styles.search}
      role="search"
      onSubmit={buscar}
      data-role="hd-search"
    >
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
        <img src={logo} alt="Logo" height={34} />
      ) : (
        <span className={styles.logoText}>{brandName}</span>
      )}
      <span className={styles.logoRule} aria-hidden="true">
        <span className={styles.fio} />
        {brandTagline && (
          <>
            <span className={`${styles.tagline} ${styles.dsk}`}>
              {brandTagline}
            </span>
            <span className={`${styles.fio} ${styles.dsk}`} />
          </>
        )}
      </span>
    </a>
  );

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

  const nomeSacola = cartLabel || 'sacola';
  const rotuloSacola = `Abrir ${nomeSacola.toLowerCase()}, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`;
  const mensagens = topbarMessages.filter(m => m.text);

  return (
    <>
      <div className={styles.header15Box}>
        <header className={styles.header15} data-role="hd-root">
          <link rel="stylesheet" href={FONTES_15} />

          {mensagens.length > 0 && (
            <div className={styles.topbar} data-role="hd-topbar">
              <span className={styles.dsk}>{Ico.gift}</span>
              {mensagens.map((m, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span
                      className={`${styles.topbarSep} ${styles.dsk}`}
                      aria-hidden="true"
                    >
                      ·
                    </span>
                  )}
                  {m.url ? (
                    <a
                      className={`${styles.topbarText}${i > 0 ? ` ${styles.dsk}` : ''}`}
                      href={m.url}
                    >
                      {m.text}
                    </a>
                  ) : (
                    <span
                      className={`${styles.topbarText}${i > 0 ? ` ${styles.dsk}` : ''}`}
                    >
                      {m.text}
                    </span>
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
                aria-controls="hd15-menu"
                onClick={() => setGaveta(v => !v)}
                data-role="hd-menu-button"
              >
                {gaveta ? Ico.close : Ico.menu}
              </button>
              <div className={styles.dsk}>{campoBusca('hd15-busca')}</div>
            </div>

            {marca}

            <div className={styles.barEnd}>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.mob}`}
                aria-label={searchPlaceholder || 'Buscar'}
                aria-expanded={buscaMobile}
                aria-controls="hd15-busca-faixa"
                onClick={() => setBuscaMobile(v => !v)}
                data-role="hd-search-button"
              >
                {Ico.search(20)}
              </button>
              {conta(
                Ico.user(20),
                `${styles.iconButton} ${styles.dsk}`,
                accountLabel || 'Entrar na minha conta'
              )}
              <a
                className={`${styles.iconButton} ${styles.dsk}`}
                href={wishlistUrl || '#'}
                aria-label={wishlistLabel || 'Favoritos'}
                data-role="hd-wishlist"
              >
                {Ico.heart(20)}
              </a>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.cart}`}
                onClick={abrirCarrinho}
                aria-label={rotuloSacola}
                data-role="hd-cart"
              >
                {Ico.bag}
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

          {buscaMobile && (
            <div id="hd15-busca-faixa" className={styles.msearch}>
              {campoBusca('hd15-busca-m', buscaMobileRef)}
            </div>
          )}

          {menu.length > 0 && (
            <nav
              className={styles.nav}
              aria-label="Principal"
              data-role="hd-nav"
            >
              <ul className={styles.navList}>
                {menu.map((item, i) => (
                  <li key={i} className={styles.navEntry}>
                    <a
                      className={`${styles.navItem}${item.marker ? ` ${styles.marked}` : ''}${item.highlight ? ` ${styles.accent}` : ''}`}
                      href={item.url || '#'}
                      data-role="hd-menu-item"
                    >
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
            <nav
              id="hd15-menu"
              className={styles.drawer}
              aria-label="Menu"
              data-role="hd-drawer"
            >
              <ul className={styles.drawerList}>
                {menu.map((item, i) => {
                  const cls = `${styles.drawerItem}${item.highlight ? ` ${styles.accent}` : ''}`;
                  return (
                    <li key={i} className={styles.drawerEntry}>
                      {item.children?.length ? (
                        <>
                          <button
                            type="button"
                            className={cls}
                            aria-expanded={aberto === i}
                            onClick={() => setAberto(aberto === i ? null : i)}
                          >
                            <span className={styles.drawerLabel}>
                              {item.label}
                            </span>
                            <span
                              className={
                                aberto === i
                                  ? styles.chevronOpen
                                  : styles.chevron
                              }
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
                        <a className={cls} href={item.url || '#'}>
                          <span className={styles.drawerLabel}>
                            {item.label}
                          </span>
                          <span className={styles.chevron}>{Ico.chevron}</span>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className={styles.drawerFoot}>
                {accountTitle && (
                  <span className={styles.drawerTitle}>{accountTitle}</span>
                )}
                {conta(
                  <>
                    {Ico.user(19)}
                    {accountMobileLabel || 'Entrar'}
                  </>,
                  styles.drawerLink
                )}
                {wishlistLabel && (
                  <a className={styles.drawerLink} href={wishlistUrl || '#'}>
                    {Ico.heart(19)}
                    {wishlistLabel}
                  </a>
                )}
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
      <CartSidebar15
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onTotalChange={setTotalItems}
      />
    </>
  );
}

// Conteúdo do mock.ts do starter.
const MOCK: Header15Props = {
  topbarMessages: [{ text: 'Entrega segura e embalagem presente' }],
  brandName: 'Sua Marca',
  brandTagline: 'Joalheria',
  searchPlaceholder: 'Buscar joias, relógios e perfumes',
  accountLabel: 'Entrar na minha conta',
  accountTitle: 'Sua conta',
  accountMobileLabel: 'Entrar ou cadastrar',
  wishlistLabel: 'Favoritos',
  wishlistUrl: '/wishlist',
  cartLabel: 'Sacola',
  helpLabel: 'Atendimento',
  helpUrl: '/atendimento',
  menu: [
    { label: 'Joias', url: '/joias', marker: true },
    { label: 'Relógios', url: '/relogios' },
    { label: 'Perfumes', url: '/perfumes' },
    { label: 'Beleza', url: '/beleza' },
    { label: 'Presentes', url: '/presentes' },
    { label: 'Coleções', url: '/colecoes', highlight: true },
  ],
};

const TERMOS_15 = (MOCK.menu ?? []).map(m => m.label ?? '').filter(Boolean);

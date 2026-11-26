'use client';

import React, { useState } from 'react';

import CartSidebar01 from '@/components/templates/_shared/CartSidebar01';
import { useNomeDaLoja } from '@/hooks/useNomeDaLoja';
import { useLayout } from '@/context/LayoutContext';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import {
  ICO_BAG,
  ICO_CHAT,
  ICO_CHEVRON,
  ICO_MENU,
  ICO_SEARCH,
  ICO_SEARCH_MOBILE,
  ICO_USER,
} from './icons';
import styles from './index.module.css';
import { useAbrirNoCanvas } from '@/hooks/useAbrirNoCanvas';

/**
 * Espelha `organisms/Header08` do faststore.starter — header do "Templates - Serie
 * A" (Figma 7316:17346 / 7316:19143). Mesmo markup, classes, `data-role` e vars de
 * Nível 1. O logo é o que o usuário enviou no /gerador; sem ele, a marca em texto SERIE//A.
 * Conteúdo = o mock.ts de lá, por baixo do que o CS subir (`useConteudoDaSecao`,
 * campos do schema de lá); o `logo` do CS vale mais que o do /gerador.
 * O contador mostra o "99" do Figma (no starter é o carrinho de verdade). O ícone da
 * sacola abre o CartSidebar01, o mesmo do Header01 (a Wake usa a sacola da família 01).
 */

const FONTES =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap';

// `viewAllLabel` (o "Ver tudo" da gaveta) fica fora: a réplica não tem gaveta.
interface Header08Conteudo {
  logo?: string;
  logoAlt?: string;
  menu: {
    label?: string;
    url?: string;
    children?: { label?: string; url?: string }[];
  }[];
  searchPlaceholder?: string;
  contactUrl?: string;
  contactLabel?: string;
  accountLabel?: string;
  cartLabel?: string;
  mobileMenuLabel?: string;
}

const MOCK: Header08Conteudo = {
  menu: [
    {
      label: 'Produto',
      url: '#',
      children: [
        { label: 'Novidades', url: '#' },
        { label: 'Mais vendidos', url: '#' },
        { label: 'Ofertas', url: '#' },
      ],
    },
    { label: 'Novidades', url: '#' },
    { label: 'Blog', url: '#' },
  ],
  searchPlaceholder: 'Buscar seu produto',
  contactUrl: '#',
  contactLabel: 'Atendimento',
  accountLabel: 'Minha conta',
  cartLabel: 'Carrinho',
  mobileMenuLabel: 'Menu',
};

const Ico = ({ svg, className }: { svg: string; className?: string }) => (
  <span
    className={`${styles.ico}${className ? ` ${className}` : ''}`}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: svg }}
  />
);

export default function Header08() {
  const { logo: logoDaLoja } = useLayout();
  const nomeDaLoja = useNomeDaLoja();
  const {
    logo: logoDoConteudo,
    logoAlt,
    menu,
    searchPlaceholder,
    contactUrl,
    contactLabel,
    accountLabel,
    cartLabel,
    mobileMenuLabel,
  } = useConteudoDaSecao(MOCK);
  const logo = logoDoConteudo || logoDaLoja;
  // Mini-cart: o mesmo CartSidebar01 do Header01.
  const [cartOpen, setCartOpen] = useState(false);
  useAbrirNoCanvas('carrinho', setCartOpen);

  const marca = (
    <a
      className={styles.logo}
      href="/"
      aria-label="Página inicial"
      data-role="hd-logo"
    >
      {logo ? (
        <img src={logo} alt={logoAlt || 'Logo'} height={32} />
      ) : (
        <span className={styles.logoText}>{nomeDaLoja || 'SERIE//A'}</span>
      )}
    </a>
  );

  const contador = (
    <span className={styles.badge} data-role="hd-badge">
      99
    </span>
  );

  return (
    <>
    <header className={styles.header08} data-role="hd-root">
      <link rel="stylesheet" href={FONTES} />

      <div className={styles.bar} data-role="hd-bar">
        <nav className={styles.menu} aria-label="Menu principal">
          {menu.map((item, i) => (
            <div key={i} className={styles.menuEntry}>
              <a
                className={styles.menuItem}
                href={item.url || '#'}
                data-role="hd-menu-item"
              >
                <span>{item.label}</span>
                {!!item.children?.length && (
                  <Ico svg={ICO_CHEVRON} className={styles.chevron} />
                )}
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
            </div>
          ))}
        </nav>
        <div className={styles.center}>{marca}</div>
        <div className={styles.actions}>
          <form
            className={styles.search}
            role="search"
            data-role="hd-search"
            onSubmit={e => e.preventDefault()}
          >
            <label className={styles.srOnly} htmlFor="hd08-busca">
              {searchPlaceholder}
            </label>
            <input
              id="hd08-busca"
              className={styles.searchInput}
              type="search"
              placeholder={searchPlaceholder}
            />
            <button
              type="submit"
              className={styles.searchSubmit}
              aria-label="Buscar"
            >
              <Ico svg={ICO_SEARCH} />
            </button>
          </form>
          <a
            className={styles.iconButton}
            href={contactUrl || '#'}
            aria-label={contactLabel}
            data-role="hd-contact"
          >
            <Ico svg={ICO_CHAT} />
          </a>
          <a
            className={styles.iconButton}
            href="#"
            aria-label={accountLabel}
            data-role="hd-account"
          >
            <Ico svg={ICO_USER} />
          </a>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={cartLabel}
            data-role="hd-cart"
            onClick={() => setCartOpen(true)}
          >
            <span className={styles.bagBox}>
              <Ico svg={ICO_BAG} />
              {contador}
            </span>
          </button>
        </div>
      </div>

      <div className={styles.mbar} data-role="hd-mbar">
        <div className={styles.mside}>
          <button
            type="button"
            className={styles.menuButton}
            data-role="hd-menu-button"
          >
            <Ico svg={ICO_MENU} />
            <span>{mobileMenuLabel}</span>
          </button>
        </div>
        <div className={styles.center}>{marca}</div>
        <div className={`${styles.mside} ${styles.msideEnd}`}>
          <button
            type="button"
            className={styles.searchButton}
            aria-label="Buscar"
            data-role="hd-search-button"
          >
            <Ico svg={ICO_SEARCH_MOBILE} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={cartLabel}
            data-role="hd-mcart"
            onClick={() => setCartOpen(true)}
          >
            <span className={styles.bagBox}>
              <Ico svg={ICO_BAG} />
              {contador}
            </span>
          </button>
        </div>
      </div>
    </header>

    {/* ── MINI-CART (CartSidebar01, o mesmo do Header01) ── */}
    <CartSidebar01 open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Header08.conteudoPadrao = MOCK;

'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';

import {
  ICO_BAG,
  ICO_CHAT,
  ICO_CHEVRON,
  ICO_LOGO,
  ICO_MENU,
  ICO_SEARCH,
  ICO_SEARCH_MOBILE,
  ICO_USER,
} from './icons';
import styles from './index.module.css';

/**
 * Espelha `organisms/Header08` do faststore.starter — header do "Templates - Serie
 * A" (Figma 7316:17346 / 7316:19143). Mesmo markup, classes, `data-role` e vars de
 * Nível 1. O logo é o que o usuário enviou no /gerador; sem ele, a marca do Figma.
 * O contador mostra o "99" do Figma (no starter é o carrinho de verdade).
 */

const FONTES =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap';

const MENU = [
  { label: 'Produto', submenu: ['Novidades', 'Mais vendidos', 'Ofertas'] },
  { label: 'Novidades', submenu: [] },
  { label: 'Blog', submenu: [] },
];

const Ico = ({ svg, className }: { svg: string; className?: string }) => (
  <span
    className={`${styles.ico}${className ? ` ${className}` : ''}`}
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: svg }}
  />
);

export default function Header08() {
  const { logo } = useLayout();

  const marca = (
    <a
      className={styles.logo}
      href="/"
      aria-label="Página inicial"
      data-role="hd-logo"
    >
      {logo ? (
        <img src={logo} alt="Logo" height={32} />
      ) : (
        <Ico svg={ICO_LOGO} />
      )}
    </a>
  );

  const contador = (
    <span className={styles.badge} data-role="hd-badge">
      99
    </span>
  );

  return (
    <header className={styles.header08} data-role="hd-root">
      <link rel="stylesheet" href={FONTES} />

      <div className={styles.bar} data-role="hd-bar">
        <nav className={styles.menu} aria-label="Menu principal">
          {MENU.map(item => (
            <div key={item.label} className={styles.menuEntry}>
              <a className={styles.menuItem} href="#" data-role="hd-menu-item">
                <span>{item.label}</span>
                {item.submenu.length > 0 && (
                  <Ico svg={ICO_CHEVRON} className={styles.chevron} />
                )}
              </a>
              {item.submenu.length > 0 && (
                <ul className={styles.submenu}>
                  {item.submenu.map(c => (
                    <li key={c}>
                      <a className={styles.submenuItem} href="#">
                        {c}
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
              Buscar seu produto
            </label>
            <input
              id="hd08-busca"
              className={styles.searchInput}
              type="search"
              placeholder="Buscar seu produto"
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
            href="#"
            aria-label="Atendimento"
            data-role="hd-contact"
          >
            <Ico svg={ICO_CHAT} />
          </a>
          <a
            className={styles.iconButton}
            href="#"
            aria-label="Minha conta"
            data-role="hd-account"
          >
            <Ico svg={ICO_USER} />
          </a>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Carrinho"
            data-role="hd-cart"
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
            <span>Menu</span>
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
            aria-label="Carrinho"
            data-role="hd-mcart"
          >
            <span className={styles.bagBox}>
              <Ico svg={ICO_BAG} />
              {contador}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

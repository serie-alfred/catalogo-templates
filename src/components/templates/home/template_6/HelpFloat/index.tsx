'use client';

import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/HelpFloatButton06` do faststore.starter — barra flutuante
 * de ajuda presa na borda direita. Recolhida mostra só a coluna de ícones;
 * o toggle revela os rótulos, e o item "horário" abre um painel.
 *
 * Os ícones da origem são SVGs no CDN de um cliente. Aqui são data-URI
 * neutros, pelo mesmo motivo dos banners: o catálogo é público e nenhum
 * template aponta para asset de cliente. A caixa não muda — os `<img>` têm
 * width/height 20 explícitos nos dois lados.
 */
const icone = (d: string) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none' stroke='%23ffffff' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'%3E${d}%3C/svg%3E`;

interface Item {
  label: string;
  icon: string;
  href?: string;
  expandable?: boolean;
  content?: string;
}

const conteudo = {
  helpLabel: 'ajuda',
  helpItems: [
    {
      label: 'Fale no WhatsApp',
      icon: icone("%3Cpath d='M3 17l1.2-3.3A7 7 0 1 1 7 16.2L3 17z'/%3E"),
      // o número da origem era a linha de atendimento REAL do cliente; aqui vai o
      // placeholder que o resto do catálogo usa (template_2/Header, template_7/Header)
      href: 'https://api.whatsapp.com/send/?phone=5511999999999',
    },
    {
      label: 'Trocas e devoluções',
      icon: icone("%3Cpath d='M3 8h11a3 3 0 0 1 0 6H6'/%3E%3Cpath d='M6 5L3 8l3 3'/%3E"),
      href: 'https://sualoja.troque.app.br/',
    },
    {
      label: 'Rastrear pedido',
      icon: icone("%3Crect x='2' y='6' width='11' height='8'/%3E%3Cpath d='M13 9h3l2 3v2h-5z'/%3E%3Ccircle cx='5.5' cy='15.5' r='1.5'/%3E%3Ccircle cx='15' cy='15.5' r='1.5'/%3E"),
      href: 'https://sualoja.cademeupedido.com.br/',
    },
    {
      label: 'horário',
      icon: icone("%3Ccircle cx='10' cy='10' r='7'/%3E%3Cpath d='M10 6v4l3 2'/%3E"),
      expandable: true,
      content: 'Atendimento (Seg. à Sex.) - 08h às 16h',
    },
  ] as Item[],
};

export default function HelpFloat() {
  const [open, setOpen] = useState(false);
  const [openTab, setOpenTab] = useState<number | null>(null);

  const toggleBar = () => {
    setOpen(v => !v);
    setOpenTab(null);
  };

  return (
    <div
      className={`${styles.bar} ${open ? styles.open : ''}`}
      data-role="help-bar"
    >
      <button
        className={styles.mobileTab}
        data-role="help-mobile-tab"
        onClick={toggleBar}
        aria-expanded={open}
        aria-label={
          open
            ? `Recolher ${conteudo.helpLabel}`
            : `Expandir ${conteudo.helpLabel}`
        }
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M3 17l1.2-3.3A7 7 0 1 1 7 16.2L3 17z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.mobileTabLabel} data-role="help-mobile-label">
          {conteudo.helpLabel}
        </span>
      </button>

      <button
        className={styles.header06}
        data-role="help-header"
        onClick={toggleBar}
        aria-expanded={open}
        aria-label={
          open
            ? `Recolher ${conteudo.helpLabel}`
            : `Expandir ${conteudo.helpLabel}`
        }
      >
        <svg
          className={styles.chevron}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 4L6 10L12 16"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.header06Label} data-role="help-header-label">
          {conteudo.helpLabel}
        </span>
      </button>

      <ul className={styles.list} data-role="help-list">
        {conteudo.helpItems.map((item, i) => {
          const isTab = !item.href && Boolean(item.content);
          const tabOpen = openTab === i;

          return (
            <li key={i} className={styles.item} data-role="help-item">
              {item.href ? (
                <a
                  className={styles.itemLink}
                  data-role="help-item-link"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={item.label}
                >
                  <img
                    className={styles.icon}
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={20}
                    loading="lazy"
                  />
                  <span className={styles.itemLabel} data-role="help-item-label">
                    {item.label}
                  </span>
                </a>
              ) : isTab ? (
                <>
                  <button
                    type="button"
                    className={styles.itemLink}
                    data-role="help-item-link"
                    onClick={() => setOpenTab(v => (v === i ? null : i))}
                    aria-expanded={tabOpen}
                    aria-controls={`helpfloat-tab-${i}`}
                    title={item.label}
                  >
                    <img
                      className={styles.icon}
                      src={item.icon}
                      alt=""
                      aria-hidden="true"
                      width={20}
                      height={20}
                      loading="lazy"
                    />
                    <span
                      className={styles.itemLabel}
                      data-role="help-item-label"
                    >
                      {item.label}
                    </span>
                    <svg
                      className={`${styles.infoArrow} ${tabOpen ? styles.infoArrowOpen : ''}`}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 5L13 10L8 15"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {tabOpen && (
                    <div
                      id={`helpfloat-tab-${i}`}
                      className={styles.tabPanel}
                    >
                      <p className={styles.tabText}>{item.content}</p>
                    </div>
                  )}
                </>
              ) : (
                <span
                  className={styles.itemLink}
                  data-role="help-item-link"
                  title={item.label}
                >
                  <img
                    className={styles.icon}
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    width={20}
                    height={20}
                    loading="lazy"
                  />
                  <span className={styles.itemLabel} data-role="help-item-label">
                    {item.label}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

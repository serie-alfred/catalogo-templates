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
          {/* O glifo da ORIGEM, inline: não é asset de cliente (esses são os <img>
              da lista, ver o topo). Um balão desenhado aqui divergia em fill/stroke
              e o 2-fidelidade (leitura de paleta) acusou. */}
          <path
            d="M14.6547 11.3156L12.1547 10.0656C12.0563 10.0166 11.9467 9.99438 11.8369 10.0012C11.7272 10.0081 11.6212 10.0438 11.5297 10.1047L10.382 10.8703C9.8552 10.5807 9.42165 10.1471 9.13204 9.62031L9.89766 8.47266C9.95857 8.38112 9.99426 8.27514 10.0011 8.1654C10.008 8.05567 9.98576 7.94606 9.93672 7.84766L8.68672 5.34766C8.63491 5.24302 8.55483 5.155 8.45555 5.09355C8.35627 5.0321 8.24176 4.9997 8.125 5C7.2962 5 6.50135 5.32924 5.9153 5.91529C5.32924 6.50134 5 7.2962 5 8.125C5.00207 9.94773 5.72706 11.6952 7.01593 12.9841C8.30479 14.2729 10.0523 14.9979 11.875 15C12.2854 15 12.6917 14.9192 13.0709 14.7621C13.45 14.6051 13.7945 14.3749 14.0847 14.0847C14.3749 13.7945 14.6051 13.45 14.7621 13.0709C14.9192 12.6917 15 12.2854 15 11.875C15.0001 11.7589 14.9678 11.645 14.9068 11.5462C14.8458 11.4474 14.7585 11.3676 14.6547 11.3156ZM11.875 13.75C10.3837 13.7483 8.95389 13.1552 7.89936 12.1006C6.84482 11.0461 6.25166 9.61633 6.25 8.125C6.24988 7.6915 6.39998 7.27135 6.67474 6.93605C6.9495 6.60075 7.33196 6.37101 7.75704 6.28594L8.65391 8.08281L7.89063 9.21875C7.83359 9.30431 7.79855 9.40262 7.7886 9.50496C7.77865 9.60731 7.79411 9.71053 7.8336 9.80547C8.28077 10.8683 9.12627 11.7138 10.1891 12.1609C10.2843 12.2022 10.3883 12.2191 10.4917 12.2101C10.5951 12.2011 10.6946 12.1665 10.7813 12.1094L11.9227 11.3484L13.7195 12.2453C13.6338 12.6709 13.4031 13.0535 13.0667 13.3279C12.7303 13.6023 12.3091 13.7515 11.875 13.75ZM10 1.875C8.59724 1.87469 7.2183 2.23757 5.99739 2.9283C4.77648 3.61904 3.7552 4.6141 3.03295 5.81664C2.3107 7.01918 1.9121 8.38822 1.87593 9.79052C1.83976 11.1928 2.16727 12.5806 2.82657 13.8188L1.93985 16.4789C1.8664 16.6992 1.85574 16.9355 1.90906 17.1615C1.96239 17.3874 2.07759 17.5941 2.24176 17.7582C2.40593 17.9224 2.61258 18.0376 2.83854 18.0909C3.0645 18.1443 3.30085 18.1336 3.5211 18.0602L6.18125 17.1734C7.27092 17.753 8.4783 18.0767 9.71174 18.12C10.9452 18.1633 12.1723 17.925 13.2999 17.4232C14.4275 16.9215 15.426 16.1694 16.2195 15.2241C17.0131 14.2789 17.5809 13.1652 17.8798 11.9678C18.1787 10.7703 18.2009 9.52047 17.9446 8.31315C17.6884 7.10584 17.1605 5.97276 16.401 4.99993C15.6414 4.02711 14.6703 3.24009 13.5612 2.69864C12.4521 2.15718 11.2342 1.87551 10 1.875ZM10 16.875C8.79139 16.8758 7.60399 16.5575 6.55782 15.9523C6.48122 15.9079 6.39606 15.8803 6.30797 15.8713C6.21989 15.8622 6.13089 15.872 6.04688 15.9L3.125 16.875L4.09922 13.9531C4.12731 13.8692 4.13723 13.7802 4.12834 13.6921C4.11945 13.604 4.09195 13.5188 4.04766 13.4422C3.28982 12.132 2.98556 10.6083 3.18206 9.10747C3.37856 7.60667 4.06484 6.21267 5.13445 5.14171C6.20405 4.07076 7.59719 3.38271 9.09773 3.18431C10.5983 2.98592 12.1224 3.28826 13.4335 4.04444C14.7447 4.80062 15.7697 5.96837 16.3495 7.36652C16.9293 8.76468 17.0315 10.3151 16.6402 11.7773C16.2489 13.2394 15.386 14.5316 14.1854 15.4533C12.9848 16.375 11.5136 16.8748 10 16.875Z"
            fill="currentColor"
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

'use client';
import React, { useEffect, useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Réplica de `organisms/HelpFloatButton09` do faststore.starter: mesmo markup, classes e
 * `data-role`; CSS derivado do SCSS de lá (com @media: botão fixo na viewport). Conteúdo =
 * o mock.ts de lá, inline. O painel abre por clique, como na origem.
 *
 * HelpFloatButton09 — ajuda flutuante da família 09 (Editorial; desenho `HelpFloat09` /
 * `HelpFloat09-mobile`). Botão "Ajuda" fixo no canto inferior direito que abre um painel
 * com atalhos (link ou texto) e uma linha de horário.
 *
 * Contrato §4: itens que são link ou texto — sem chat ao vivo, avatar ou status online.
 * Apresentacional: sem evento de analytics e sem valor de commerce.
 */
export type HelpFloat09Icon = 'whatsapp' | 'exchange' | 'truck';

interface HelpFloatButton09Props {
  buttonLabel?: string;
  title?: string;
  /** Trecho do título em itálico, logo depois de `title`. */
  titleEmphasis?: string;
  /** Com `url` o item é link; sem `url`, texto. */
  helpItems?: {
    icon?: HelpFloat09Icon;
    label?: string;
    detail?: string;
    url?: string;
  }[];
  footerText?: string;
}

const CONTEUDO: HelpFloatButton09Props = {
  buttonLabel: 'Ajuda',
  title: 'Como podemos',
  titleEmphasis: 'ajudar?',
  helpItems: [
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      detail: '[00 00000-0000]',
      url: 'https://wa.me/',
    },
    {
      icon: 'exchange',
      label: 'Trocas e devoluções',
      url: '/institucional/trocas',
    },
    { icon: 'truck', label: 'Rastrear pedido', url: '/account/orders' },
  ],
  footerText: 'Seg a sex, 9h às 18h · [0000-0000]',
};

const svg = (w: number, children: React.ReactNode) => (
  <svg
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

const ICONES: Record<HelpFloat09Icon, React.ReactNode> = {
  whatsapp: svg(20, <path d="M4 20l1.3-4A8 8 0 1 1 8 19z" />),
  exchange: svg(
    20,
    <>
      <path d="M4 9h12a4 4 0 0 1 0 8H8" />
      <path d="m8 5-4 4 4 4" />
    </>
  ),
  truck: svg(
    20,
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
};

const Chevron = () => svg(16, <path d="m9 6 6 6-6 6" />);
const Relogio = () =>
  svg(
    16,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  );
const Fechar = () => svg(18, <path d="M6 6l12 12M18 6 6 18" />);
// Fechado: o fone do "Atendimento" do Header09-mobile (o desenho só mostra o aberto).
const Fone = () =>
  svg(
    18,
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
    </>
  );

export default function HelpFloat09() {
  const {
    buttonLabel,
    title,
    titleEmphasis,
    helpItems = [],
    footerText,
  } = CONTEUDO;
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [aberto]);

  if (!helpItems.length && !footerText) return null;

  return (
    <div className={styles.helpFloatButton09} data-role="hf-root">
      <link rel="stylesheet" href={FONTES_09} />
      {aberto && (
        <section
          id="hf09-painel"
          className={styles.panel}
          aria-labelledby="hf09-titulo"
          data-role="hf-panel"
        >
          {(title || titleEmphasis) && (
            <div className={styles.head}>
              <h2
                id="hf09-titulo"
                className={styles.title}
                data-role="hf-title"
              >
                {title} {titleEmphasis && <em>{titleEmphasis}</em>}
              </h2>
            </div>
          )}
          {helpItems.length > 0 && (
            <ul className={styles.list}>
              {helpItems.map((item, i) => {
                const conteudo = (
                  <>
                    {item.icon && ICONES[item.icon]}
                    <span className={styles.itemText}>
                      <span>{item.label}</span>
                      {item.detail && (
                        <span className={styles.detail}>{item.detail}</span>
                      )}
                    </span>
                    {item.url && <Chevron />}
                  </>
                );
                return (
                  <li key={i} className={styles.entry}>
                    {item.url ? (
                      <a
                        className={styles.item}
                        href={item.url}
                        data-role="hf-item"
                      >
                        {conteudo}
                      </a>
                    ) : (
                      <div className={styles.item} data-role="hf-item">
                        {conteudo}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {footerText && (
            <p className={styles.foot} data-role="hf-foot">
              <span className={styles.footIcon}>
                <Relogio />
              </span>
              {footerText}
            </p>
          )}
        </section>
      )}

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={aberto}
        aria-controls="hf09-painel"
        aria-label={aberto ? `Fechar ${buttonLabel || 'ajuda'}` : undefined}
        onClick={() => setAberto(v => !v)}
        data-role="hf-button"
      >
        {aberto ? <Fechar /> : <Fone />}
        {buttonLabel}
      </button>
    </div>
  );
}

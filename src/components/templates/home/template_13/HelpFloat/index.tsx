import React, { useEffect, useState } from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/HelpFloatButton13` do faststore.starter (família 13, Noturno; desenho
 * `HelpFloat13` / `HelpFloat13-mobile`): mesmo markup, classes e `data-role`; CSS derivado
 * do SCSS de lá (com @media: botão fixo na viewport). Conteúdo = o mock.ts de lá, inline.
 * Fechado: o quadrado verde com o "?" no canto inferior direito; aberto, o painel grafite
 * com o título, o horário, o fechar e os atalhos com ícone (o destaque no bloco verde, ↗
 * quando o link sai da loja). O painel abre por clique, como na origem. Sem divergência
 * deliberada.
 */
type HelpFloatButton13Icon =
  | 'none'
  | 'order'
  | 'exchange'
  | 'size'
  | 'whatsapp';

interface HelpFloatButton13Props {
  buttonLabel?: string;
  title?: string;
  scheduleText?: string;
  helpItems?: {
    label?: string;
    url?: string;
    icon?: HelpFloatButton13Icon;
    highlight?: boolean;
  }[];
}

// Conteúdo do mock.ts do starter.
const CONTEUDO: HelpFloatButton13Props = {
  buttonLabel: 'Ajuda',
  title: 'Ajuda',
  scheduleText: 'Seg a sex · 9h às 18h',
  helpItems: [
    { label: 'Status do pedido', url: '/account/orders', icon: 'order' },
    { label: 'Trocas', url: '/ajuda/trocas', icon: 'exchange' },
    { label: 'Tamanhos', url: '/ajuda/medidas', icon: 'size' },
    {
      label: 'Falar no WhatsApp',
      url: 'https://wa.me/0000000000000',
      icon: 'whatsapp',
      highlight: true,
    },
  ],
};

const svg = (
  w: number,
  children: React.ReactNode,
  sw = '1.8',
  className?: string
) => (
  <svg
    className={className}
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const ICONE: Record<Exclude<HelpFloatButton13Icon, 'none'>, React.ReactNode> = {
  order: svg(
    20,
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  exchange: svg(
    20,
    <>
      <path d="M4 9h12a4 4 0 0 1 0 8H8" />
      <path d="m8 5-4 4 4 4" />
    </>
  ),
  size: svg(
    20,
    <>
      <path d="M3 15 15 3l6 6L9 21z" />
      <path d="m7 11 2 2M10 8l2 2M13 5l2 2" />
    </>
  ),
  whatsapp: svg(20, <path d="M4 20l1.3-4A8 8 0 1 1 8 19z" />, '2'),
};

// O ponto do "?" é um traço de 0,01: com a ponta padrão do SVG (`butt`) ele não
// desenha nada, e o ícone aparecia sem o ponto.
const Pergunta = () =>
  svg(
    30,
    <g strokeLinecap="round">
      <path d="M9 9a3 3 0 1 1 4.2 2.7c-.8.4-1.2 1-1.2 1.8v.8" />
      <path d="M12 18v.01" />
    </g>,
    '2.4',
    styles.question
  );
const Fechar = () => svg(18, <path d="M6 6l12 12M18 6 6 18" />);
const Externo = () =>
  svg(16, <path d="M7 17 17 7M8 7h9v9" />, '2.2', styles.arrow);
const Interno = () => svg(16, <path d="m9 6 6 6-6 6" />, '2', styles.arrow);

/** Contato fora da loja (WhatsApp, e-mail, telefone, outro site) leva a seta ↗. */
const externo = (url: string) => /^(https?:|mailto:|tel:|\/\/)/i.test(url);

export default function HelpFloat13() {
  const { buttonLabel, title, scheduleText, helpItems = [] } = CONTEUDO;
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [aberto]);

  if (!helpItems.length && !scheduleText) return null;

  const nome = buttonLabel || 'Ajuda';

  return (
    <div
      className={`${styles.helpFloatButton13}${aberto ? ` ${styles.open}` : ''}`}
      data-role="hf-root"
    >
      <link rel="stylesheet" href={FONTES_13} />
      {aberto && (
        <div
          className={styles.backdrop}
          onClick={() => setAberto(false)}
          aria-hidden="true"
        />
      )}
      {aberto && (
        <section
          id="hf13-painel"
          className={styles.panel}
          aria-labelledby="hf13-titulo"
          data-role="hf-panel"
        >
          <div className={styles.head}>
            <span className={styles.headText}>
              <h2
                id="hf13-titulo"
                className={styles.title}
                data-role="hf-title"
              >
                {title || nome}
              </h2>
              {scheduleText && (
                <span className={styles.schedule} data-role="hf-foot">
                  {scheduleText}
                </span>
              )}
            </span>
            <button
              type="button"
              className={styles.close}
              onClick={() => setAberto(false)}
              aria-label={`Fechar ${nome.toLowerCase()}`}
            >
              <Fechar />
            </button>
          </div>
          {helpItems.length > 0 && (
            <ul className={styles.list}>
              {helpItems.map((item, i) => {
                const cls = `${styles.item}${item.highlight ? ` ${styles.highlight}` : ''}`;
                const icone =
                  item.icon && item.icon !== 'none' ? ICONE[item.icon] : null;
                const corpo = (
                  <>
                    {icone}
                    <span className={styles.label}>{item.label}</span>
                  </>
                );
                return (
                  <li key={i}>
                    {item.url ? (
                      <a
                        className={cls}
                        href={item.url}
                        {...(/^https?:/i.test(item.url)
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        data-role="hf-item"
                      >
                        {corpo}
                        {externo(item.url) ? <Externo /> : <Interno />}
                      </a>
                    ) : (
                      <div className={cls} data-role="hf-item">
                        {corpo}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={aberto}
        aria-controls="hf13-painel"
        aria-label={nome}
        onClick={() => setAberto(v => !v)}
        data-role="hf-button"
      >
        <Pergunta />
      </button>
    </div>
  );
}

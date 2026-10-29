import React, { useEffect, useState } from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/HelpFloatButton14` do faststore.starter (família 14, Esportiva; desenho
 * `HelpFloat14` / `HelpFloat14-mobile`): mesmo markup, classes e `data-role`; CSS derivado
 * do SCSS de lá (com @media: botão fixo na viewport). Conteúdo = o mock.ts de lá, inline.
 * Fechado: o paralelogramo marinho com o balão no canto inferior direito; aberto, o painel
 * branco com a cabeça marinho, o horário, o fechar e os atalhos com ícone, apoio e seta. O
 * painel abre por clique, como na origem. Sem divergência deliberada.
 */
type HelpFloatButton14Icon =
  | 'none'
  | 'whatsapp'
  | 'order'
  | 'exchange'
  | 'size'
  | 'email';

interface HelpFloatButton14Props {
  /** Nome acessível do botão. */
  buttonLabel?: string;
  /** Título do painel. */
  title?: string;
  scheduleText?: string;
  /** Com `url` o item é link (com seta); sem `url`, texto. */
  helpItems?: {
    label?: string;
    description?: string;
    url?: string;
    icon?: HelpFloatButton14Icon;
  }[];
}

const svg = (w: number, children: React.ReactNode, sw = '2') => (
  <svg
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    strokeLinecap="square"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const ICONE: Record<Exclude<HelpFloatButton14Icon, 'none'>, React.ReactNode> = {
  whatsapp: svg(22, <path d="M4 5h16v11H9l-5 4z" />),
  order: svg(
    22,
    <>
      <path d="M3 7l9-4 9 4v10l-9 4-9-4z" />
      <path d="M3 7l9 4 9-4M12 11v10" />
    </>
  ),
  exchange: svg(22, <path d="M4 8h14l-4-4M20 16H6l4 4" />),
  size: svg(
    22,
    <>
      <path d="M3 15 15 3l6 6L9 21z" />
      <path d="m7 11 2 2M10 8l2 2M13 5l2 2" />
    </>
  ),
  email: svg(
    22,
    <>
      <rect x="3" y="5" width="18" height="14" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
};

// Conteúdo do mock.ts do starter.
const CONTEUDO: HelpFloatButton14Props = {
  buttonLabel: 'Ajuda',
  title: 'Precisa de ajuda?',
  scheduleText: 'Seg a sex · 8h às 20h',
  helpItems: [
    {
      label: 'Falar no WhatsApp',
      description: '[00 00000-0000]',
      url: 'https://wa.me/0000000000000',
      icon: 'whatsapp',
    },
    {
      label: 'Rastrear meu pedido',
      description: 'Com o número do pedido',
      url: '/account/orders',
      icon: 'order',
    },
    {
      label: 'Trocas e devoluções',
      description: 'Grátis em até 30 dias',
      url: '/ajuda/trocas',
      icon: 'exchange',
    },
    {
      label: 'Tabela de medidas',
      description: 'Tênis, roupas e acessórios',
      url: '/ajuda/medidas',
      icon: 'size',
    },
    {
      label: 'Enviar e-mail',
      description: '[contato@suamarca.com.br]',
      url: 'mailto:contato@suamarca.com.br',
      icon: 'email',
    },
  ],
};

export default function HelpFloat14() {
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
      className={`${styles.helpFloatButton14}${aberto ? ` ${styles.open}` : ''}`}
      data-role="hf-root"
    >
      <link rel="stylesheet" href={FONTES_14} />
      {aberto && (
        <div
          className={styles.backdrop}
          onClick={() => setAberto(false)}
          aria-hidden="true"
        />
      )}
      <div className={styles.dock}>
        {aberto && (
          <section
            id="hf14-painel"
            className={styles.panel}
            aria-labelledby="hf14-titulo"
            data-role="hf-panel"
          >
            <div className={styles.head}>
              <span className={styles.headText}>
                <h2
                  id="hf14-titulo"
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
                {svg(20, <path d="M6 6l12 12M18 6 6 18" />, '2.2')}
              </button>
            </div>
            {helpItems.length > 0 && (
              <ul className={styles.list}>
                {helpItems.map((item, i) => {
                  const icone =
                    item.icon && item.icon !== 'none' ? ICONE[item.icon] : null;
                  const corpo = (
                    <>
                      {icone && <span className={styles.iconBox}>{icone}</span>}
                      <span className={styles.text}>
                        <span className={styles.label}>{item.label}</span>
                        {item.description && (
                          <span className={styles.description}>
                            {item.description}
                          </span>
                        )}
                      </span>
                    </>
                  );
                  return (
                    <li key={i} className={styles.entry}>
                      {item.url ? (
                        <a
                          className={styles.item}
                          href={item.url}
                          {...(/^https?:/i.test(item.url)
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          data-role="hf-item"
                        >
                          {corpo}
                          {svg(18, <path d="m9 6 6 6-6 6" />, '2.4')}
                        </a>
                      ) : (
                        <div className={styles.item} data-role="hf-item">
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
          aria-controls="hf14-painel"
          aria-label={nome}
          onClick={() => setAberto(v => !v)}
          data-role="hf-button"
        >
          {aberto
            ? svg(24, <path d="M6 6l12 12M18 6 6 18" />, '2.2')
            : svg(24, <path d="M4 5h16v11H9l-5 4z" />, '2.2')}
        </button>
      </div>
    </div>
  );
}

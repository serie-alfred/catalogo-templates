import React, { useEffect, useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/HelpFloatButton16` do faststore.starter (família 16, Infantil; desenho
 * `HelpFloat16` / `HelpFloat16-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`; o
 * CSS é derivado do SCSS de lá, com o @media (camada fixa na viewport). O botão redondo de
 * destaque com o balão "?" no canto inferior direito; aberto, o painel arredondado com a
 * cabeça na cor de destaque e os atalhos em cartões. Conteúdo = o mock.ts de lá.
 */

type HelpFloatButton16Icon =
  | 'truck'
  | 'exchange'
  | 'ruler'
  | 'chat'
  | 'mail'
  | 'phone'
  | 'help'
  | 'none';

interface HelpFloatButton16Props {
  /** Nome do botão para leitores de tela (o desenho só mostra o ícone). */
  buttonLabel?: string;
  /** Título do painel. */
  title?: string;
  scheduleText?: string;
  /** Com `url` o item é link; sem `url`, texto. `highlight` troca o fundo pela borda. */
  helpItems?: {
    label?: string;
    url?: string;
    icon?: HelpFloatButton16Icon;
    highlight?: boolean;
  }[];
}

const FONTES =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap';

const svg = (
  w: number,
  children: React.ReactNode,
  sw = '2.2',
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
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const BALAO = 'M4 20l1.4-4A8 8 0 1 1 8 18.6z';

const ICONE: Record<Exclude<HelpFloatButton16Icon, 'none'>, React.ReactNode> = {
  truck: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" />
      <path d="M18 3v4h-4M6 21v-4h4" />
    </>
  ),
  ruler: (
    <>
      <path d="M3 15 15 3l6 6L9 21z" />
      <path d="m7 11 2 2M10 8l2 2M13 5l2 2" />
    </>
  ),
  chat: <path d={BALAO} />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  phone: (
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.3 2.4c-.5.2-.8.6-.8 1.1v.5M12 16.5v.01" />
    </>
  ),
};

const Balao = () =>
  svg(
    28,
    <>
      <path d={BALAO} />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.3 2.4c-.5.2-.8.6-.8 1.1v.5M12 16.5v.01" />
    </>,
    '2.2',
    styles.toggleIcon
  );
const Fechar = () => svg(18, <path d="M6 6l12 12M18 6 6 18" />, '2.6');
const Seta = () => svg(18, <path d="m9 6 6 6-6 6" />, '2.4');

const MOCK: HelpFloatButton16Props = {
  buttonLabel: 'Ajuda',
  title: 'Posso ajudar?',
  scheduleText: 'Seg a sex · 9h às 18h',
  helpItems: [
    { label: 'Onde está meu pedido', url: '/account/orders', icon: 'truck' },
    { label: 'Trocas e devoluções', url: '/ajuda/trocas', icon: 'exchange' },
    { label: 'Guia de tamanhos', url: '/ajuda/tamanhos', icon: 'ruler' },
    {
      label: 'Falar no WhatsApp',
      url: 'https://wa.me/0000000000000',
      icon: 'chat',
      highlight: true,
    },
  ],
};

export default function HelpFloat16() {
  const { buttonLabel, title, scheduleText, helpItems = [] } = MOCK;
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
      className={`${styles.helpFloatButton16}${aberto ? ` ${styles.open}` : ''}`}
      data-role="hf-root"
    >
      <link rel="stylesheet" href={FONTES} />
      {aberto && (
        <div
          className={styles.veil}
          onClick={() => setAberto(false)}
          aria-hidden="true"
        />
      )}
      {aberto && (
        <section
          id="hf16-painel"
          className={styles.panel}
          aria-labelledby="hf16-titulo"
          data-role="hf-panel"
        >
          <div className={styles.head}>
            <span className={styles.headText}>
              <h2
                id="hf16-titulo"
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
                const conteudo = (
                  <>
                    {icone && svg(20, icone)}
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
                        {conteudo}
                        <Seta />
                      </a>
                    ) : (
                      <div className={cls} data-role="hf-item">
                        {conteudo}
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
        aria-controls="hf16-painel"
        aria-label={nome}
        onClick={() => setAberto(v => !v)}
        data-role="hf-button"
      >
        <Balao />
      </button>
    </div>
  );
}

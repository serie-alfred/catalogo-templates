import React, { useEffect, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/HelpFloatButton10` do faststore.starter (família 10, Varejo; desenho
 * `HelpFloat10` / `HelpFloat10-mobile`): mesmo markup, classes e `data-role`; CSS
 * derivado do SCSS de lá (com @media: botão fixo na viewport). Conteúdo = o mock.ts de
 * lá, inline. Botão redondo com o balão "Precisa de ajuda?"; o painel "Atendimento"
 * abre por clique, como na origem. Sem divergência deliberada.
 */
type HelpFloat10Icon = 'whatsapp' | 'truck' | 'exchange' | 'phone';

interface HelpFloatButton10Props {
  bubbleText?: string;
  title?: string;
  subtitle?: string;
  /** Com `url` o item é link; sem `url`, texto. */
  helpItems?: {
    icon?: HelpFloat10Icon;
    label?: string;
    detail?: string;
    url?: string;
  }[];
  footerText?: string;
}

// Conteúdo do mock.ts do starter (colchetes são do desenho: a loja preenche).
const CONTEUDO: HelpFloatButton10Props = {
  bubbleText: 'Precisa de ajuda?',
  title: 'Atendimento',
  subtitle: 'Como podemos te ajudar?',
  helpItems: [
    {
      icon: 'whatsapp',
      label: 'Falar no WhatsApp',
      url: 'https://wa.me/0000000000000',
    },
    { icon: 'truck', label: 'Status do pedido', url: '/account/orders' },
    { icon: 'exchange', label: 'Trocas e devoluções', url: '/ajuda/trocas' },
    {
      icon: 'phone',
      label: 'Televendas',
      detail: '[0000-0000]',
      url: 'tel:00000000',
    },
  ],
  footerText: 'Seg a sáb, das 8h às 22h',
};

const svg = (w: number, sw: string, children: React.ReactNode) => (
  <svg
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

const ICONES: Record<HelpFloat10Icon, React.ReactNode> = {
  whatsapp: svg(18, '2', <path d="M4 20l1.3-4A8 8 0 1 1 8 19z" />),
  truck: svg(
    18,
    '2',
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  exchange: svg(
    18,
    '2',
    <>
      <path d="M4 9h12a4 4 0 0 1 0 8H8" />
      <path d="m8 5-4 4 4 4" />
    </>
  ),
  phone: svg(
    18,
    '2',
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  ),
};

const Chevron = () => svg(16, '2', <path d="m9 6 6 6-6 6" />);
const Relogio = () =>
  svg(
    16,
    '2',
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  );
const Fechar = () => svg(26, '2.2', <path d="M6 6l12 12M18 6 6 18" />);
const Ajuda = () =>
  svg(
    30,
    '1.8',
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14" />
      <path d="M12 17h.01" />
    </>
  );

export default function HelpFloatButton10() {
  const { bubbleText, title, subtitle, helpItems = [], footerText } = CONTEUDO;
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [aberto]);

  if (!helpItems.length && !footerText) return null;

  const nome = title || 'atendimento';

  return (
    <div
      className={`${styles.helpFloatButton10}${aberto ? ` ${styles.open}` : ''}`}
      data-role="hf-root"
    >
      <link rel="stylesheet" href={FONTES_10} />
      {aberto && (
        <div
          className={styles.veil}
          onClick={() => setAberto(false)}
          aria-hidden="true"
        />
      )}
      {aberto && (
        <section
          id="hf10-painel"
          className={styles.panel}
          aria-labelledby="hf10-titulo"
          data-role="hf-panel"
        >
          {(title || subtitle) && (
            <div className={styles.head}>
              {title && (
                <h2
                  id="hf10-titulo"
                  className={styles.title}
                  data-role="hf-title"
                >
                  {title}
                </h2>
              )}
              {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
            </div>
          )}
          {helpItems.length > 0 && (
            <ul className={styles.list}>
              {helpItems.map((item, i) => {
                const conteudo = (
                  <>
                    {item.icon && ICONES[item.icon] && (
                      <span
                        className={`${styles.icon}${item.icon === 'whatsapp' ? ` ${styles.iconWhatsapp}` : ''}`}
                      >
                        {ICONES[item.icon]}
                      </span>
                    )}
                    <span className={styles.itemText}>
                      <span>{item.label}</span>
                      {item.detail && (
                        <span className={styles.detail}>{item.detail}</span>
                      )}
                    </span>
                    {item.url && (
                      <span className={styles.chevron}>
                        <Chevron />
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={i}>
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

      <div className={styles.launcher}>
        {!aberto && bubbleText && (
          <span className={styles.bubble} data-role="hf-bubble">
            {bubbleText}
          </span>
        )}
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={aberto}
          aria-controls="hf10-painel"
          aria-label={
            aberto
              ? `Fechar ${nome.toLowerCase()}`
              : `Abrir ${nome.toLowerCase()}`
          }
          onClick={() => setAberto(v => !v)}
          data-role="hf-button"
        >
          {aberto ? <Fechar /> : <Ajuda />}
        </button>
      </div>
    </div>
  );
}

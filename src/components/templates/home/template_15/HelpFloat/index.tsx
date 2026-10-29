import React, { useEffect, useRef, useState } from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/HelpFloatButton15` do faststore.starter (família 15, Luxo; desenho
 * `HelpFloat15` / `HelpFloat15-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`;
 * o CSS é derivado do SCSS de lá, com o @media (overlay fixo). Fechado: o quadrado escuro
 * com o balão no canto inferior direito; aberto, o painel "Concierge" com o cabeçalho
 * escuro e os atalhos entre fios. Mobile: o painel vira folha presa ao pé, sobre o véu.
 * Conteúdo = o mock.ts de lá. Como lá, nasce fechado.
 */
type HelpFloat15Icon =
  | 'whatsapp'
  | 'email'
  | 'calendar'
  | 'faq'
  | 'exchange'
  | 'truck';

interface HelpFloatButton15Props {
  /** Nome acessível do botão flutuante ("Ajuda"). */
  buttonLabel?: string;
  title?: string;
  /** Linha sob o título (horário de atendimento). */
  subtitle?: string;
  /** Com `url` o item é link (com a seta); sem `url`, texto. */
  helpItems?: { icon?: HelpFloat15Icon; label?: string; url?: string }[];
}

const svg = (
  w: number,
  children: React.ReactNode,
  sw = '1.3',
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

const BALAO = <path d="M4 20l1.5-4A8 8 0 1 1 9 19.5z" />;

const ICONES: Record<HelpFloat15Icon, React.ReactNode> = {
  whatsapp: BALAO,
  email: (
    <>
      <rect x="3" y="5" width="18" height="14" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  faq: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01" />
    </>
  ),
  exchange: (
    <>
      <path d="M4 9h12a4 4 0 0 1 0 8H8" />
      <path d="m8 5-4 4 4 4" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v10H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
};

export default function HelpFloat15() {
  const { buttonLabel, title, subtitle, helpItems = [] } = CONTEUDO;
  const [aberto, setAberto] = useState(false);
  const botaoRef = useRef<HTMLButtonElement>(null);

  const fechar = () => {
    setAberto(false);
    requestAnimationFrame(() => botaoRef.current?.focus());
  };

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && fechar();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [aberto]);

  const itens = helpItems.filter(i => i.label);
  if (!itens.length) return null;
  const rotulo = buttonLabel || 'Ajuda';

  return (
    <div className={styles.helpFloatButton15} data-role="hf-root">
      <link rel="stylesheet" href={FONTES_15} />
      {aberto && (
        <>
          <div className={styles.overlay} onClick={fechar} aria-hidden="true" />
          <section
            id="hf15-painel"
            className={styles.panel}
            aria-labelledby="hf15-titulo"
            data-role="hf-panel"
          >
            <div className={styles.head}>
              <div className={styles.headText}>
                <h2
                  id="hf15-titulo"
                  className={styles.title}
                  data-role="hf-title"
                >
                  {title || rotulo}
                </h2>
                {subtitle && (
                  <span className={styles.subtitle} data-role="hf-subtitle">
                    {subtitle}
                  </span>
                )}
              </div>
              <button
                type="button"
                className={styles.close}
                onClick={fechar}
                aria-label={`Fechar ${rotulo.toLowerCase()}`}
                data-role="hf-close"
              >
                {svg(
                  18,
                  <path d="M6 6l12 12M18 6 6 18" />,
                  '1.4',
                  styles.closeIcon
                )}
              </button>
            </div>
            <ul className={styles.list}>
              {itens.map((item, i) => {
                const conteudo = (
                  <>
                    {item.icon &&
                      ICONES[item.icon] &&
                      svg(18, ICONES[item.icon], '1.3', styles.itemIcon)}
                    <span className={styles.itemText}>{item.label}</span>
                    {item.url && svg(14, <path d="m9 6 6 6-6 6" />, '1.4')}
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
          </section>
        </>
      )}

      <button
        ref={botaoRef}
        type="button"
        className={`${styles.toggle}${aberto ? ` ${styles.toggleOpen}` : ''}`}
        aria-expanded={aberto}
        aria-controls="hf15-painel"
        aria-label={rotulo}
        onClick={() => setAberto(v => !v)}
        data-role="hf-button"
      >
        {svg(24, BALAO)}
      </button>
    </div>
  );
}

// Conteúdo do mock.ts do starter.
const CONTEUDO: HelpFloatButton15Props = {
  buttonLabel: 'Ajuda',
  title: 'Concierge',
  subtitle: 'Seg a sáb · 10h às 19h',
  helpItems: [
    { icon: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/' },
    { icon: 'email', label: 'E-mail', url: 'mailto:contato@suamarca.com.br' },
    {
      icon: 'calendar',
      label: 'Agendar atendimento na boutique',
      url: '/institucional/boutiques',
    },
    { icon: 'faq', label: 'Perguntas frequentes', url: '/institucional/ajuda' },
  ],
};

import React, { useEffect, useState } from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/HelpFloatButton12` do faststore.starter (família 12, Suave; desenho
 * `HelpFloat12` / `HelpFloat12-mobile`): mesmo markup, classes e `data-role`; CSS derivado
 * do SCSS de lá (com @media: botão fixo na viewport). Conteúdo = o mock.ts de lá, inline.
 * Pílula de destaque "? Ajuda" no canto inferior direito; aberta, vira o círculo com o X e
 * sobe o painel com a cabeça de destaque, o horário e os atalhos com seta (o destaque em
 * negrito, com ↗ quando sai da loja). O painel abre por clique, como na origem. Sem
 * divergência deliberada.
 */

interface HelpFloatButton12Props {
  /** Rótulo do botão fechado (o "Ajuda" do desenho). */
  buttonLabel?: string;
  /** Título do painel. */
  title?: string;
  scheduleText?: string;
  /** Com `url` o item é link; sem `url`, texto. `highlight` pinta o item na cor de destaque. */
  helpItems?: { label?: string; url?: string; highlight?: boolean }[];
}

// Conteúdo do mock.ts do starter.
const CONTEUDO: HelpFloatButton12Props = {
  buttonLabel: 'Ajuda',
  title: 'Como podemos ajudar?',
  scheduleText: 'Atendimento de seg a sex, das 9h às 18h',
  helpItems: [
    { label: 'Status do pedido', url: '/account/orders' },
    { label: 'Trocas e devoluções', url: '/ajuda/trocas' },
    { label: 'Prazos e frete', url: '/ajuda/entregas' },
    { label: 'Formas de pagamento', url: '/ajuda/pagamento' },
    { label: 'Central de ajuda', url: '/ajuda' },
    {
      label: 'Falar no WhatsApp',
      url: 'https://wa.me/0000000000000',
      highlight: true,
    },
  ],
};

const svg = (w: number, children: React.ReactNode, sw = '1.8') => (
  <svg
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

const Pergunta = () =>
  svg(
    22,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6" />
      <path d="M12 17h.01" />
    </>
  );
const FecharGrande = () => svg(22, <path d="M6 6l12 12M18 6 6 18" />, '2');
const Fechar = () => svg(16, <path d="M6 6l12 12M18 6 6 18" />);
const Externo = () => svg(16, <path d="M7 17 17 7M9 7h8v8" />);
const Interno = () => svg(16, <path d="m9 6 6 6-6 6" />);

/** Contato fora da loja (WhatsApp, e-mail, telefone, outro site) leva a seta ↗. */
const externo = (url: string) => /^(https?:|mailto:|tel:|\/\/)/i.test(url);

export default function HelpFloat12() {
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
      className={`${styles.helpFloatButton12}${aberto ? ` ${styles.open}` : ''}`}
      data-role="hf-root"
    >
      <link rel="stylesheet" href={FONTES_12} />
      {aberto && (
        <section
          id="hf12-painel"
          className={styles.panel}
          aria-labelledby="hf12-titulo"
          data-role="hf-panel"
        >
          <div className={styles.head}>
            <span className={styles.headText}>
              <strong
                id="hf12-titulo"
                className={styles.title}
                data-role="hf-title"
              >
                {title || nome}
              </strong>
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
                        {item.label}
                        {externo(item.url) ? <Externo /> : <Interno />}
                      </a>
                    ) : (
                      <div className={cls} data-role="hf-item">
                        {item.label}
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
        aria-controls="hf12-painel"
        aria-label={
          aberto
            ? `Fechar ${nome.toLowerCase()}`
            : `Abrir ${nome.toLowerCase()}`
        }
        onClick={() => setAberto(v => !v)}
        data-role="hf-button"
      >
        {aberto ? (
          <FecharGrande />
        ) : (
          <>
            <Pergunta />
            {nome}
          </>
        )}
      </button>
    </div>
  );
}

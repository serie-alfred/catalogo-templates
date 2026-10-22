import React, { useEffect, useState } from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/HelpFloatButton11` do faststore.starter (família 11, Grade; desenho
 * `HelpFloat11` / `HelpFloat11-mobile`): mesmo markup, classes e `data-role`; CSS
 * derivado do SCSS de lá (com @media: botão fixo na viewport). Conteúdo = o mock.ts de
 * lá, inline. Botão retangular "Ajuda [?]" no canto inferior direito; aberto, sobe o
 * painel com a cabeça, o fechar quadrado, o horário em mono e os atalhos numerados
 * ([01]…) entre filetes, com detalhe opcional e a seta (↗ externo, → página da loja).
 * O painel abre por clique, como na origem. Sem divergência deliberada.
 */

interface HelpFloatButton11Props {
  title?: string;
  titleTag?: string;
  scheduleText?: string;
  /** Com `url` o item é link; sem `url`, texto. */
  helpItems?: { label?: string; detail?: string; url?: string }[];
}

// Conteúdo do mock.ts do starter (colchetes são do desenho: a loja preenche).
const CONTEUDO: HelpFloatButton11Props = {
  title: 'Ajuda',
  titleTag: '[?]',
  scheduleText: 'Seg a sáb · 10h às 19h',
  helpItems: [
    {
      label: 'WhatsApp',
      detail: '[00 00000-0000]',
      url: 'https://wa.me/0000000000000',
    },
    {
      label: 'E-mail',
      detail: 'contato@[suamarca].com.br',
      url: 'mailto:contato@suamarca.com.br',
    },
    { label: 'Agendar visita ao showroom', url: '/showroom' },
    { label: 'Trocas e devoluções', url: '/ajuda/trocas' },
    { label: 'Rastrear pedido', url: '/account/orders' },
  ],
};

const svg = (w: number, children: React.ReactNode) => (
  <svg
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Balao = () => svg(18, <path d="M4 5h16v11H9l-5 4z" />);
const Fechar = () => svg(18, <path d="M6 6l12 12M18 6 6 18" />);
const Externo = () => svg(16, <path d="M7 17 17 7M8 7h9v9" />);
const Interno = () => svg(16, <path d="M5 12h14M13 6l6 6-6 6" />);

/** Contato fora da loja (WhatsApp, e-mail, telefone, outro site) leva a seta ↗. */
const externo = (url: string) => /^(https?:|mailto:|tel:|\/\/)/i.test(url);

export default function HelpFloat11() {
  const { title, titleTag, scheduleText, helpItems = [] } = CONTEUDO;
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [aberto]);

  const nome = title || 'Ajuda';

  return (
    <div
      className={styles.helpFloatButton11}
      data-role="hf-root"
    >
      <link rel="stylesheet" href={FONTES_11} />
      {aberto && (
        <section
          id="hf11-painel"
          className={styles.panel}
          aria-labelledby="hf11-titulo"
          data-role="hf-panel"
        >
          <div className={styles.head}>
            <h2 id="hf11-titulo" className={styles.title} data-role="hf-title">
              {nome}
              {titleTag && <span className={styles.tag}>{titleTag}</span>}
            </h2>
            <button
              type="button"
              className={styles.close}
              onClick={() => setAberto(false)}
              aria-label={`Fechar ${nome.toLowerCase()}`}
            >
              <Fechar />
            </button>
          </div>
          {scheduleText && (
            <p className={styles.schedule} data-role="hf-foot">
              {scheduleText}
            </p>
          )}
          {helpItems.length > 0 && (
            <ul className={styles.list}>
              {helpItems.map((item, i) => {
                const conteudo = (
                  <>
                    <span className={styles.ordinal}>
                      [{String(i + 1).padStart(2, '0')}]
                    </span>
                    <span className={styles.itemText}>
                      {item.label}
                      {item.detail && (
                        <span className={styles.detail}>{item.detail}</span>
                      )}
                    </span>
                    {item.url && (
                      <span className={styles.arrow}>
                        {externo(item.url) ? <Externo /> : <Interno />}
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
                        {...(/^https?:/i.test(item.url)
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
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
        </section>
      )}

      <button
        type="button"
        className={styles.toggle}
        aria-expanded={aberto}
        aria-controls="hf11-painel"
        aria-label={
          aberto
            ? `Fechar ${nome.toLowerCase()}`
            : `Abrir ${nome.toLowerCase()}`
        }
        onClick={() => setAberto(v => !v)}
        data-role="hf-button"
      >
        <Balao />
        {nome}
        {titleTag && <span className={styles.toggleTag}>{titleTag}</span>}
      </button>
    </div>
  );
}

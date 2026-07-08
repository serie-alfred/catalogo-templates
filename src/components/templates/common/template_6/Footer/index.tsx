'use client';

import React, { useState } from 'react';

import styles from './index.module.css';

// Preview estático do Footer06 (Ferracini) — dados fixos, sem VTEX/GraphQL/hooks.
// Origem: faststore.starter/src/components/organisms/Footer06 (gerado via /from-faststore).
// Newsletter como formulário não-interativo (readOnly); colunas sempre abertas no card.

const data = {
  newsletterSubtitle: 'Fique por dentro de todas as novidades',
  newsletterTitle: 'Assine nossa Newsletter',
  newsletterNamePlaceholder: 'Nome',
  newsletterEmailPlaceholder: 'E-mail',
  newsletterButtonLabel: 'Enviar',
  socialTitle: 'Siga-nos',
  socials: ['instagram', 'facebook', 'tiktok', 'youtube'],
  columns: [
    {
      title: 'Institucional',
      links: ['Sobre nós', 'Uso e conservação', 'Tecnologias', 'Outono / Inverno', 'Nossas Lojas', 'Mapa do site'],
    },
    {
      title: 'Central de Ajuda',
      links: ['Ferracini Club', 'Política de Entrega', 'Rastreie seu pedido', 'Trocas e devoluções', 'Segurança e Privacidade'],
    },
    {
      title: 'Atendimento',
      text: 'Segunda a Sexta: 08h às 16h',
      links: ['WhatsApp Ferracini'],
    },
  ],
  copyright: '© 2026 - CNPJ: 53.577.383/0006-36 Calçados Ferracini Ltda. Franca - SP',
};

const SocialIcon = ({ name }: { name: string }) => {
  const common = { className: styles.socialIcon, viewBox: '0 0 24 24', 'aria-hidden': true };
  switch (name) {
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M13.5 21v-7h2.35l.35-2.73H13.5V9.53c0-.79.22-1.33 1.35-1.33h1.44V5.76c-.25-.03-1.1-.11-2.1-.11-2.08 0-3.5 1.27-3.5 3.6v2.01H8.3V14h2.39v7h2.81z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...common}>
          <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.1v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.78.12V9.77a5.7 5.7 0 0 0-.78-.05A5.69 5.69 0 1 0 15.54 15V8.99a7.34 7.34 0 0 0 4.3 1.38V7.27a4.28 4.28 0 0 1-3.24-1.45z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...common}>
          <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.81zM10 15.02V8.98L15.5 12 10 15.02z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 2.2c-2.7 0-3 .01-4.06.06-1.06.05-1.79.22-2.42.46a4.88 4.88 0 0 0-1.77 1.15A4.88 4.88 0 0 0 2.6 5.64c-.24.63-.4 1.36-.46 2.42C2.09 9.12 2.08 9.46 2.08 12s.01 2.88.06 3.94c.06 1.06.22 1.79.46 2.42.25.66.58 1.22 1.15 1.78.56.56 1.12.9 1.77 1.14.63.24 1.36.41 2.42.46 1.06.05 1.36.06 4.06.06s3-.01 4.06-.06c1.06-.05 1.79-.22 2.42-.46a4.88 4.88 0 0 0 1.77-1.14c.57-.56.9-1.12 1.15-1.78.24-.63.4-1.36.46-2.42.05-1.06.06-1.36.06-3.94s-.01-2.88-.06-3.94c-.06-1.06-.22-1.79-.46-2.42a4.88 4.88 0 0 0-1.15-1.78 4.88 4.88 0 0 0-1.77-1.15c-.63-.24-1.36-.41-2.42-.46C15 2.21 14.7 2.2 12 2.2Zm0 1.8c2.67 0 2.99.01 4.04.06.97.04 1.5.21 1.85.34.46.18.8.4 1.15.74.35.35.56.68.74 1.15.13.35.3.88.34 1.85.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.97-.21 1.5-.34 1.85-.18.46-.39.8-.74 1.15-.35.35-.69.56-1.15.74-.35.13-.88.3-1.85.34-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.97-.04-1.5-.21-1.85-.34a3.1 3.1 0 0 1-1.15-.74 3.1 3.1 0 0 1-.74-1.15c-.13-.35-.3-.88-.34-1.85C4 14.99 4 14.67 4 12s.01-2.99.06-4.04c.04-.97.21-1.5.34-1.85.18-.47.39-.8.74-1.15.35-.34.69-.56 1.15-.74.35-.13.88-.3 1.85-.34C9.01 4.01 9.33 4 12 4Zm0 3.05a4.95 4.95 0 1 0 0 9.9 4.95 4.95 0 0 0 0-9.9Zm0 8.16a3.21 3.21 0 1 1 0-6.42 3.21 3.21 0 0 1 0 6.42Zm6.3-8.36a1.16 1.16 0 1 1-2.31 0 1.16 1.16 0 0 1 2.31 0Z" />
        </svg>
      );
  }
};

export default function Footer06() {
  const [openCols, setOpenCols] = useState<number[]>([]);
  const toggleCol = (i: number) =>
    setOpenCols(prev =>
      prev.includes(i) ? prev.filter(c => c !== i) : [...prev, i]
    );

  return (
    <footer className={styles.footer06}>
      {/* NEWSLETTER */}
      <div className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div className={styles.newsletterText}>
            <span>{data.newsletterSubtitle}</span>
            <strong>{data.newsletterTitle}</strong>
          </div>
          <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
            <input className={styles.field} type="text" placeholder={data.newsletterNamePlaceholder} aria-label="Nome" readOnly />
            <input className={styles.field} type="email" placeholder={data.newsletterEmailPlaceholder} aria-label="E-mail" readOnly />
            <button className={styles.newsletterBtn} type="submit">
              {data.newsletterButtonLabel}
            </button>
          </form>
        </div>
      </div>

      {/* SOCIAL + COLUNAS */}
      <div className={styles.body}>
        <div className={styles.social}>
          <h3>{data.socialTitle}</h3>
          <div className={styles.socialLinks}>
            {data.socials.map((s, i) => (
              <a key={i} href="#" aria-label={s}>
                <SocialIcon name={s} />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.columns}>
          {data.columns.map((column, i) => {
            const open = openCols.includes(i);
            return (
            <div
              key={i}
              className={`${styles.group} ${open ? styles.groupOpen : ''}`}
            >
              <button
                type="button"
                className={styles.groupTitle}
                aria-expanded={open}
                onClick={() => toggleCol(i)}
              >
                {column.title}
                <span className={styles.groupToggle} aria-hidden="true">
                  {open ? '−' : '+'}
                </span>
              </button>
              <div className={styles.groupLinks}>
                {column.text && <p className={styles.colText}>{column.text}</p>}
                {column.links.map((link, j) => (
                  <a key={j} href="#" className={i === 2 && j === 0 ? styles.linkHighlight : undefined}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* BARRA INFERIOR */}
      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          <div className={styles.copyright}>{data.copyright}</div>
        </div>
      </div>
    </footer>
  );
}

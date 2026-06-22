import React from 'react';

import styles from './index.module.css';

// Preview estático do Footer05 (SÉRIE//A) — dados fixos, sem VTEX/GraphQL/hooks.
// Origem: faststore.starter/src/components/organisms/Footer05 (gerado via /from-faststore).
// Newsletter como formulário não-interativo (readOnly); colunas sempre abertas.

const data = {
  newsletterEyebrow: 'Inbox / SÉRIE//A',
  newsletterTitle: 'Novidades antes de todo mundo.',
  newsletterDescription:
    'Receba lançamentos, curadorias e condições especiais sem excesso de mensagens.',
  newsletterNamePlaceholder: 'Seu nome',
  newsletterEmailPlaceholder: 'seuemail@exemplo.com',
  newsletterButtonLabel: 'Quero receber',
  newsletterConsentText:
    'Quero receber novidades, ofertas e comunicações da SÉRIE//A. Posso cancelar a qualquer momento.',
  brandName: 'SÉRIE//A',
  brandDescription:
    'Uma loja de departamentos feita para escolhas simples, produtos relevantes e uma compra sem atrito.',
  columns: [
    {
      title: 'Institucional',
      links: [
        { name: 'Sobre nós', url: '#' },
        { name: 'Nossas lojas', url: '#' },
        { name: 'Trabalhe conosco', url: '#' },
        { name: 'Política de privacidade', url: '#' },
        { name: 'Termos de uso', url: '#' },
      ],
    },
    {
      title: 'Atendimento',
      links: [
        { name: 'Central de atendimento', url: '#' },
        { name: 'Trocas e devoluções', url: '#' },
        { name: 'Prazos de entrega', url: '#' },
        { name: 'Formas de pagamento', url: '#' },
        { name: 'Perguntas frequentes', url: '#' },
      ],
    },
    {
      title: 'Minha conta',
      links: [
        { name: 'Meus pedidos', url: '#' },
        { name: 'Meus dados', url: '#' },
        { name: 'Favoritos', url: '#' },
        { name: 'Rastreamento de pedido', url: '#' },
      ],
    },
  ],
  contactTitle: 'Fale com a gente',
  contactItems: [
    { label: '0800 410 2026', detail: 'Seg–sex, 8h às 20h' },
    { label: 'WhatsApp (11) 4002-8922', detail: 'Sábados, 9h às 15h' },
    { label: 'oi@seriea.com.br', detail: 'Resposta em até 1 dia útil' },
  ],
  socials: [
    { label: 'IG', url: '#' },
    { label: 'FB', url: '#' },
    { label: 'TK', url: '#' },
    { label: 'YT', url: '#' },
    { label: 'IN', url: '#' },
  ],
  copyright: '© 2026 SÉRIE//A. TODOS OS DIREITOS RESERVADOS.',
  developedBy: 'DESENVOLVIMENTO POR NORTE STUDIO · PLATAFORMA VTEX',
  paymentMethods: ['VISA', 'MASTER', 'PIX'],
};

const Chevron = () => (
  <svg
    className={styles.chevIcon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

function Wordmark({ name }: { name: string }) {
  const parts = name.split('//');
  if (parts.length === 1) return <>{name}</>;
  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className={styles.wordmarkAccent}>{'//'}</span>}
        </React.Fragment>
      ))}
    </>
  );
}

export default function Footer05() {
  return (
    <footer className={styles.footer05}>
      {/* Newsletter */}
      <section className={styles.newsletter}>
        <div className={styles.newsletterInner}>
          <div className={styles.nlText}>
            <p className={styles.eyebrow}>{data.newsletterEyebrow}</p>
            <h2 className={styles.nlTitle}>{data.newsletterTitle}</h2>
            <p className={styles.nlDesc}>{data.newsletterDescription}</p>
          </div>

          <form className={styles.nlForm} onSubmit={e => e.preventDefault()}>
            <input
              className={styles.nlField}
              placeholder={data.newsletterNamePlaceholder}
              aria-label="Nome"
              readOnly
            />
            <input
              className={styles.nlField}
              type="email"
              placeholder={data.newsletterEmailPlaceholder}
              aria-label="E-mail"
              readOnly
            />
            <button className={styles.nlButton} type="submit">
              {data.newsletterButtonLabel}
            </button>
            <label className={styles.nlConsent}>
              <input type="checkbox" readOnly />
              <span>{data.newsletterConsentText}</span>
            </label>
          </form>
        </div>
      </section>

      {/* Main */}
      <section className={styles.footerMain}>
        <div className={styles.footerMainInner}>
          <div className={styles.footerBrand}>
            <a href="/" className={styles.brandLogo}>
              <Wordmark name={data.brandName} />
            </a>
            <p className={styles.brandDesc}>{data.brandDescription}</p>
          </div>

          {data.columns.map((col, i) => (
            <div key={i} className={`${styles.footerCol} ${styles.footerColOpen}`}>
              <button type="button" className={styles.colHead} aria-expanded="true">
                <span className={styles.colTitle}>{col.title}</span>
                <span className={styles.colChev}>
                  <Chevron />
                </span>
              </button>
              <ul className={styles.colList}>
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a href={link.url}>{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={`${styles.footerContact} ${styles.footerColOpen}`}>
            <button type="button" className={styles.colHead} aria-expanded="true">
              <span className={styles.colTitle}>{data.contactTitle}</span>
              <span className={styles.colChev}>
                <Chevron />
              </span>
            </button>
            <div className={styles.contactBody}>
              <ul className={styles.contactList}>
                {data.contactItems.map((item, i) => (
                  <li key={i}>
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.socials} aria-label="Redes sociais">
                {data.socials.map((social, i) => (
                  <a key={i} href={social.url} aria-label={social.label}>
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom */}
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomInner}>
          <span className={styles.copyright}>{data.copyright}</span>
          <span className={styles.developedBy}>{data.developedBy}</span>
          <div className={styles.paymentRow} aria-label="Formas de pagamento">
            {data.paymentMethods.map((method, i) => (
              <span key={i} className={styles.payChip}>
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

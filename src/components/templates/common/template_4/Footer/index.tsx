import React from 'react';

import styles from './index.module.css';

// Preview estático do Footer04 (MANU) — dados fixos, sem VTEX/GraphQL/hooks.
// Origem: faststore.starter/src/components/organisms/Footer04 (gerado via /from-faststore).

const data = {
  brandName: 'MANU',
  brandTagline: 'EST. 2018',
  brandDescription: 'Alfaiataria contemporânea para o homem moderno.',
  address:
    'Showroom - Rua Oscar Freire, 800\nSão Paulo, SP · 01426-001\nSegunda a Sábado, 10h-19h',
  socials: [
    { label: 'Instagram', url: '#' },
    { label: 'Pinterest', url: '#' },
  ],
  columns: [
    {
      title: 'Atendimento',
      links: [
        { name: 'Troca & Devolução', url: '#', highlight: true },
        { name: 'Rastrear meu pedido', url: '#' },
        { name: 'Guia de tamanhos', url: '#' },
        { name: 'Perguntas frequentes', url: '#' },
        { name: 'Fale conosco', url: '#' },
        { name: 'WhatsApp: (11) 9 9999-9999', url: '#' },
      ],
    },
    {
      title: 'Minha Conta',
      links: [
        { name: 'Fazer login', url: '#' },
        { name: 'Criar conta', url: '#' },
        { name: 'Meus pedidos', url: '#' },
        { name: 'Endereços salvos', url: '#' },
        { name: 'Lista de desejos', url: '#' },
        { name: 'Programa de fidelidade', url: '#' },
      ],
    },
    {
      title: 'A Marca',
      links: [
        { name: 'Nossa história', url: '#' },
        { name: 'Processo & materiais', url: '#' },
        { name: 'Compromisso com qualidade', url: '#' },
        { name: 'Alfaiataria sob medida', url: '#' },
        { name: 'Sustentabilidade', url: '#' },
        { name: 'Blog editorial', url: '#' },
        { name: 'Trabalhe conosco', url: '#' },
      ],
    },
  ],
  newsletterPlaceholder: 'seu@email.com',
  newsletterButtonLabel: 'Entrar',
  copyright: '© 2025 MANU Moda Masculina Ltda. Todos os direitos reservados.',
  legalLinks: [
    { name: 'Política de Privacidade', url: '#' },
    { name: 'Termos de Uso', url: '#' },
    { name: 'Política de Cookies', url: '#' },
    { name: 'LGPD', url: '#' },
  ],
  paymentMethods: 'Pix · Visa · Mastercard · Amex · Elo · Boleto',
  paymentSeals: 'Site Seguro SSL · Reclame Aqui',
};

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.45"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17 7h.01" />
  </svg>
);

const PinterestIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.45"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M10 19 12 7" />
    <path d="M12 7c5 0 5 7 0 7" />
  </svg>
);

const socialIconFor = (label: string) =>
  label.trim().toLowerCase() === 'pinterest' ? <PinterestIcon /> : <InstagramIcon />;

export default function Footer04({ isMobile }: { isMobile?: boolean }) {
  const addressLines = data.address.split('\n');

  return (
    <footer className={styles.footer04}>
      <div className={styles.inner}>
        <div className={styles.mobileNewsletter}>
          <form className={styles.mobileNlForm} onSubmit={e => e.preventDefault()}>
            <input
              className={styles.fieldLine}
              type="email"
              placeholder={data.newsletterPlaceholder}
              aria-label="Email para lista"
              readOnly
            />
            <button type="submit" className={styles.mobileNlBtn}>
              {data.newsletterButtonLabel}
            </button>
          </form>
        </div>

        <div className={styles.columns}>
          <div className={styles.brand}>
            <a href="/" className={styles.logo}>
              <strong className={styles.logoName}>{data.brandName}</strong>
              <span className={styles.logoTagline}>{data.brandTagline}</span>
            </a>
            <p className={styles.brandDescription}>{data.brandDescription}</p>
            <address className={styles.brandAddress}>
              {addressLines.map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < addressLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </address>
            <div className={styles.socialLinks}>
              {data.socials.map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {socialIconFor(social.label)}
                </a>
              ))}
            </div>
          </div>

          {data.columns.map((column, index) => {
            const open = !isMobile || index === 0;
            const groupClasses = [styles.group, open ? styles.groupOpen : '']
              .filter(Boolean)
              .join(' ');

            return (
              <div className={groupClasses} key={index}>
                <button type="button" className={styles.groupTitle} aria-expanded={open}>
                  {column.title}
                  <span className={styles.groupToggle} aria-hidden="true">
                    {open ? '−' : '+'}
                  </span>
                </button>
                <div className={styles.groupLinks} aria-hidden={!open}>
                  {column.links.map((link, j) => (
                    <a
                      key={j}
                      href={link.url}
                      className={
                        'highlight' in link && link.highlight
                          ? styles.linkHighlight
                          : undefined
                      }
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.bottom}>
          <div className={styles.copyright}>{data.copyright}</div>
          <div className={styles.legalLinks}>
            {data.legalLinks.map((link, i) => (
              <React.Fragment key={i}>
                <a href={link.url}>{link.name}</a>
                {i < data.legalLinks.length - 1 && (
                  <span className={styles.legalSep} aria-hidden="true">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className={styles.payment}>
            <div className={styles.paymentMethods}>{data.paymentMethods}</div>
            <div className={styles.paymentSeals}>{data.paymentSeals}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}

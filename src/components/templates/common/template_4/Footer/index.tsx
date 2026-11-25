'use client';

import React, { useState } from 'react';

import styles from './index.module.css';
import { useLogoDoRodape } from '@/hooks/useLogoDoRodape';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

// Preview estático do Footer04 (MANU) — dados fixos, sem VTEX/GraphQL/hooks.
// Origem: faststore.starter/src/components/organisms/Footer04 (gerado via /from-faststore).

/** O conteúdo da seção: os campos do `section.schema` do Footer04 que a réplica desenha. */
interface Footer04Conteudo {
  brandName?: string;
  brandDescription?: string;
  address?: string;
  socials: { label?: string; url?: string }[];
  columns: {
    title?: string;
    links: { name?: string; url?: string; highlight?: boolean }[];
  }[];
  newsletterPlaceholder?: string;
  newsletterButtonLabel?: string;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  copyright?: string;
  legalLinks: { name?: string; url?: string }[];
  paymentMethods?: string;
  paymentSeals?: string;
}

const MOCK: Footer04Conteudo = {
  brandDescription: 'Alfaiataria contemporânea para o homem moderno.',
  // Só marcadores para a loja preencher: nada de endereço ou razão social inventados (o mesmo
  // texto do ft04_endereco / ft04_copyright da Wake).
  address: '[Endereço completo]\n[Cidade], [UF] · [CEP]\n[Horário de atendimento]',
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
  newsletterTitle: 'Assine a newsletter',
  newsletterSubtitle: 'Novidades, lançamentos e ofertas exclusivas no seu e-mail.',
  copyright: '© 2026 [SUA MARCA]. Todos os direitos reservados.',
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
  label.trim().toLowerCase() === 'pinterest' ? (
    <PinterestIcon />
  ) : (
    <InstagramIcon />
  );

/** Crédito padrão da agência (igual em todos os footers): "Desenvolvido por:" + logo SÉRIE//A, o conjunto é o link. */
const AgencyLogo = () => (
  <svg
    viewBox="6.5 3.9 67 13.9"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="currentColor" d="M28.0374 6.99414H33.1182C33.8851 6.99414 34.5498 7.07397 35.1124 7.23407C35.675 7.39416 36.1413 7.6256 36.5122 7.9288C36.8828 8.232 37.1587 8.60102 37.3398 9.03671C37.5208 9.47198 37.6115 9.965 37.6115 10.5158C37.6115 10.8873 37.5666 11.2402 37.4771 11.5753C37.3877 11.9103 37.2503 12.2186 37.0651 12.5006C36.8798 12.7821 36.6462 13.0331 36.3651 13.2531C36.0841 13.473 35.7538 13.6556 35.3744 13.8004L37.5475 17.0019H35.0679L33.189 14.1589H33.1314L30.0638 14.1525V17.0019H28.0378V6.99414H28.0374ZM33.1695 12.3982C33.5532 12.3982 33.8885 12.3532 34.1764 12.2636C34.4638 12.174 34.7046 12.0483 34.8987 11.8857C35.0925 11.7235 35.2375 11.526 35.3333 11.2933C35.4291 11.0606 35.477 10.8016 35.477 10.5153C35.477 9.95608 35.2854 9.52379 34.9017 9.21889C34.5181 8.91356 33.9407 8.76111 33.1695 8.76111H30.0633V12.3978H33.1695V12.3982Z" />
    <path fill="currentColor" d="M38.6307 7H40.6694V17.0048H38.6307V7Z" />
    <path fill="currentColor" d="M18.3717 6.98773H27.0183V8.76914H20.399V10.768H26.142V12.4402H20.399V15.2272H27.0183V17.0018H18.3717V6.9873V6.98773Z" />
    <path fill="currentColor" d="M41.6885 6.99902H50.3351V8.77831H43.7157V10.775H49.4588V12.4456H43.7157V15.2296H50.3351V17.0025H41.6885V6.99945V6.99902Z" />
    <path fill="currentColor" d="M20.8033 5.36388L24.2949 4.41309L24.6467 5.7002L21.1149 6.49515L20.8033 5.36388Z" />
    <path fill="currentColor" d="M17.3521 14.1947C17.3521 15.1727 16.8985 15.9417 16.0044 16.4819C15.1515 16.9974 13.9416 17.2573 12.4078 17.2573C9.07903 17.2573 7.26586 16.1477 7.02125 13.9543L6.99158 13.6826H9.21215L9.25497 13.8736C9.37325 14.4023 9.67085 14.7824 10.1639 15.0393C10.6815 15.3094 11.4412 15.4461 12.4226 15.4461C13.3184 15.4461 14.009 15.326 14.474 15.0856C14.898 14.8682 15.0955 14.5849 15.0955 14.1947C15.0955 13.8736 14.9688 13.6397 14.6945 13.4571C14.3871 13.2511 13.8742 13.1016 13.1675 13.0078L11.3691 12.7543C9.92606 12.5598 8.91667 12.2387 8.28373 11.7746C7.62621 11.2922 7.29257 10.5924 7.29257 9.69338C7.29257 8.7944 7.75297 8.01898 8.65849 7.49836C9.52162 7.00279 10.7248 6.75098 12.2369 6.75098C13.6126 6.75098 14.6996 6.965 15.4652 7.38965C16.2524 7.82449 16.7968 8.52559 17.0825 9.47596L17.1253 9.65516C17.1444 9.73585 17.1597 9.81738 17.1707 9.89934L17.1957 10.0836L15.0476 10.0556L14.9739 9.88618C14.7653 9.41057 14.4643 9.08104 14.0535 8.87848C13.6313 8.66785 13.0149 8.56254 12.2225 8.56254C11.3217 8.56254 10.623 8.67295 10.1448 8.88867C9.72384 9.07806 9.52035 9.32818 9.52035 9.65432C9.52035 9.98045 9.64033 10.2076 9.9002 10.3673C10.2012 10.5533 10.7616 10.7096 11.5688 10.8285L13.5923 11.1083C14.8479 11.2829 15.7916 11.6171 16.3983 12.1012C17.0312 12.6065 17.3534 13.3114 17.3534 14.1955L17.3521 14.1947Z" />
    <path fill="currentColor" d="M66.0343 7H68.182L73.0149 17.0001H70.8863L70.0872 15.3176H64.2513L63.4776 17.0001H61.3427L66.0343 7ZM69.2881 13.6475L67.1277 9.10499L65.0245 13.6475H69.2881Z" />
    <path fill="#97D700" d="M63.4597 7L58.7671 17.0027H56.4681L61.1488 7H63.4597Z" />
    <path fill="#E63888" d="M58.6002 7L53.9076 17.0035H51.6086L56.2893 7H58.6002Z" />
  </svg>
)

const Credit = () => (
  <a
    className={styles.credit}
    href="https://seriea.com.br/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Desenvolvido por SÉRIE//A (abre em nova aba)"
  >
    <span>Desenvolvido por:</span>
    <AgencyLogo />
  </a>
)

export default function Footer04() {
  const logo = useLogoDoRodape();
  const data = useConteudoDaSecao(MOCK);
  const addressLines = (data.address ?? '').split('\n');
  const [openCols, setOpenCols] = useState<number[]>([]);
  const toggleCol = (i: number) =>
    setOpenCols(prev =>
      prev.includes(i) ? prev.filter(c => c !== i) : [...prev, i]
    );

  return (
    <footer className={styles.footer04}>
      <div className={styles.inner}>
        <div className={styles.mobileNewsletter}>
          <form
            className={styles.mobileNlForm}
            onSubmit={e => e.preventDefault()}
          >
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

        {/* Newsletter desktop — input + botão na mesma linha (oculto no mobile). */}
        <div className={styles.desktopNewsletter}>
          <div className={styles.dnlText}>
            {data.newsletterTitle && (
              <span className={styles.dnlTitle}>{data.newsletterTitle}</span>
            )}
            {data.newsletterSubtitle && (
              <span className={styles.dnlSub}>{data.newsletterSubtitle}</span>
            )}
          </div>
          <form className={styles.dnlForm} onSubmit={e => e.preventDefault()}>
            <input
              className={styles.dnlInput}
              type="email"
              placeholder={data.newsletterPlaceholder}
              aria-label="Email para lista"
              readOnly
            />
            <button type="submit" className={styles.dnlBtn}>
              {data.newsletterButtonLabel}
            </button>
          </form>
        </div>

        <div className={styles.columns}>
          <div className={styles.brand}>
            <a href="/" className={styles.logo}>
              {logo ? (
                <img src={logo} alt="Logo" className={styles.logoImg} />
              ) : (
                <strong className={styles.logoName}>
                  {data.brandName || 'SERIE//A'}
                </strong>
              )}
            </a>
            {data.brandDescription && (
              <p className={styles.brandDescription}>{data.brandDescription}</p>
            )}
            {data.address && (
              <address className={styles.brandAddress}>
                {addressLines.map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < addressLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </address>
            )}
            <div className={styles.socialLinks}>
              {data.socials.filter(social => social.label).map((social, i) => (
                <a
                  key={i}
                  href={social.url || '#'}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {socialIconFor(social.label ?? '')}
                </a>
              ))}
            </div>
          </div>

          {data.columns.map((column, index) => {
            const open = openCols.includes(index);
            const groupClasses = [styles.group, open ? styles.groupOpen : '']
              .filter(Boolean)
              .join(' ');

            return (
              <div className={groupClasses} key={index}>
                <button
                  type="button"
                  className={styles.groupTitle}
                  aria-expanded={open}
                  onClick={() => toggleCol(index)}
                >
                  {column.title}
                  <span className={styles.groupToggle} aria-hidden="true">
                    {open ? '−' : '+'}
                  </span>
                </button>
                <div className={styles.groupLinks} aria-hidden={!open}>
                  {column.links.map((link, j) => (
                    <a
                      key={j}
                      href={link.url || '#'}
                      className={
                        link.highlight ? styles.linkHighlight : undefined
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
          {data.copyright && (
            <div className={styles.copyright}>{data.copyright}</div>
          )}
          <div className={styles.legalLinks}>
            {data.legalLinks.map((link, i) => (
              <React.Fragment key={i}>
                <a href={link.url || '#'}>{link.name}</a>
                {i < data.legalLinks.length - 1 && (
                  <span className={styles.legalSep} aria-hidden="true">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className={styles.payment}>
            {data.paymentMethods && (
              <div className={styles.paymentMethods}>{data.paymentMethods}</div>
            )}
            {data.paymentSeals && (
              <div className={styles.paymentSeals}>{data.paymentSeals}</div>
            )}
          </div>
          <Credit />
        </div>
      </div>
    </footer>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Footer04.conteudoPadrao = MOCK;

import React, { useState } from 'react';
import { FONTES_15 } from '@/components/templates/common/template_15/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useLogoDoRodape } from '@/hooks/useLogoDoRodape';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer15` do faststore.starter (família 15, Luxo; desenho `Footer15` /
 * `Footer15-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá, por baixo do que o CS
 * subir (`useConteudoDaSecao`, campos do schema de lá).
 *
 * Fundo escuro: a marca em serifa espaçada, o ornamento dourado (fio · diamante · fio) e a
 * frase em itálico; entre fios, as colunas de links e o "Contato"; no pé, os pagamentos em
 * etiquetas e a linha legal. Mobile: as colunas em acordeão (a primeira aberta).
 *
 * Divergência deliberada: a marca é o logo que o usuário enviou no /gerador; sem ele, o
 * `brandName` do CS ou a marca em texto do catálogo (`SERIE//A`; o mock não traz "Sua Marca").
 * Razão social e CNPJ são marcadores.
 */

type Footer15Social = 'youtube' | 'instagram' | 'x' | 'linkedin' | 'facebook';
type Footer15Payment =
  | 'visa'
  | 'mastercard'
  | 'diners'
  | 'hipercard'
  | 'elo'
  | 'amex'
  | 'aura'
  | 'boleto'
  | 'pix';

/** O conteúdo da seção: os campos do `section.schema` do Footer15. */
interface Footer15Conteudo {
  brandName?: string;
  brandUrl?: string;
  /** Frase em itálico sob o ornamento. */
  tagline?: string;
  columns?: {
    title?: string;
    links?: { label?: string; url?: string; highlight?: boolean }[];
  }[];
  contactTitle?: string;
  /** Telefones (no mobile dividem uma linha). Com `url` (tel:, WhatsApp) vira link. */
  contactLines?: { text?: string; url?: string }[];
  contactHours?: string;
  /** Links sublinhados depois do horário (o e-mail do desenho; mailto:). */
  contactLinks?: { text?: string; url?: string }[];
  socials?: { network?: Footer15Social; url?: string }[];
  payments?: { method?: Footer15Payment }[];
  legal?: string;
}

const ROTULO_REDE: Record<Footer15Social, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

const ROTULO_PAGAMENTO: Record<Footer15Payment, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  diners: 'Diners',
  hipercard: 'Hipercard',
  elo: 'Elo',
  amex: 'Amex',
  aura: 'Aura',
  boleto: 'Boleto',
  pix: 'Pix',
};

const ICONE_REDE: Record<Footer15Social, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3" />
      <path d="m10 9 5 3-5 3z" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />,
  x: <path d="M4 4l16 16M20 4 4 20" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10v7M8 7v.01M12 17v-7M12 13a3 3 0 0 1 6 0v4" />
    </>
  ),
};

const Sinal = ({ aberto }: { aberto: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <path d={aberto ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
  </svg>
);

/** Crédito padrão da agência: "Desenvolvido por:" + logo SÉRIE//A, o conjunto é o link. */
const Credit = () => (
  <a
    className={styles.credit}
    href="https://seriea.com.br/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Desenvolvido por SÉRIE//A (abre em nova aba)"
  >
    <span>Desenvolvido por:</span>
    <svg
      className={styles.creditLogo}
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
  </a>
)

export default function Footer15() {
  const logo = useLogoDoRodape();
  const {
    brandName,
    brandUrl,
    tagline,
    columns = [],
    contactTitle,
    contactLines = [],
    contactHours,
    contactLinks = [],
    socials = [],
    payments = [],
    legal,
  } = useConteudoDaSecao(MOCK);
  const [aberta, setAberta] = useState<number | null>(0);

  const redes = socials.filter(
    s => s.network && ROTULO_REDE[s.network] && s.url
  );
  const pagamentos = payments.filter(
    p => p.method && ROTULO_PAGAMENTO[p.method]
  );
  const telefones = contactLines.filter(c => c.text);
  const links = contactLinks.filter(c => c.text);
  const temContato = !!(
    contactTitle ||
    telefones.length ||
    contactHours ||
    links.length ||
    redes.length
  );

  return (
    <div className={styles.footer15Box}>
      <footer className={styles.footer15} data-role="ft-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          <div className={styles.head} data-role="ft-brand-block">
            <a
              className={styles.brand}
              href={brandUrl || '/'}
              aria-label={`${brandName || 'Página inicial'}${brandName ? ', página inicial' : ''}`}
              data-role="ft-brand"
            >
              {logo ? <img src={logo} alt="Logo" /> : brandName || 'SERIE//A'}
            </a>
            <span className={styles.ornament} aria-hidden="true">
              <span className={styles.fio} />
              <svg
                className={styles.diamond}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M6 4h12l3 5-9 11L3 9z" />
                <path d="M3 9h18" />
              </svg>
              <span className={styles.fio} />
            </span>
            {tagline && (
              <p className={styles.tagline} data-role="ft-tagline">
                {tagline}
              </p>
            )}
          </div>

          <div className={styles.grid}>
            {columns.length > 0 && (
              <div className={styles.cols}>
                {columns.map((col, i) => {
                  const id = `ft15-col-${i}`;
                  const open = aberta === i;
                  return (
                    <div
                      key={i}
                      className={`${styles.column}${open ? ` ${styles.columnOpen}` : ''}`}
                      data-role="ft-column"
                    >
                      <h2 className={styles.title}>
                        <span className={styles.titleDsk}>{col.title}</span>
                        <button
                          type="button"
                          className={styles.toggle}
                          aria-expanded={open}
                          aria-controls={id}
                          onClick={() => setAberta(open ? null : i)}
                        >
                          {col.title}
                          <Sinal aberto={open} />
                        </button>
                      </h2>
                      <ul id={id} className={styles.links}>
                        {(col.links ?? []).map((l, j) => (
                          <li key={j}>
                            <a
                              className={`${styles.link}${l.highlight ? ` ${styles.accent}` : ''}`}
                              href={l.url || '#'}
                              data-role="ft-link"
                            >
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {temContato && (
              <div className={styles.contact} data-role="ft-contact">
                {contactTitle && (
                  <h2 className={styles.contactTitle}>{contactTitle}</h2>
                )}
                {telefones.length > 0 && (
                  <p className={styles.phones}>
                    {telefones.map((c, i) => (
                      <React.Fragment key={i}>
                        {i > 0 && (
                          <span className={styles.phoneSep} aria-hidden="true">
                            {' · '}
                          </span>
                        )}
                        <span className={styles.phone}>
                          {c.url ? <a href={c.url}>{c.text}</a> : c.text}
                        </span>
                      </React.Fragment>
                    ))}
                  </p>
                )}
                {contactHours && <p className={styles.muted}>{contactHours}</p>}
                {links.map((c, i) => (
                  <a key={i} className={styles.contactLink} href={c.url || '#'}>
                    {c.text}
                  </a>
                ))}
                {redes.length > 0 && (
                  <div className={styles.socials}>
                    {redes.map((s, i) => (
                      <a
                        key={i}
                        className={styles.social}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={ROTULO_REDE[s.network as Footer15Social]}
                        data-role="ft-social"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          aria-hidden="true"
                        >
                          {ICONE_REDE[s.network as Footer15Social]}
                        </svg>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {(
            <div className={styles.bottom}>
              {pagamentos.length > 0 && (
                <ul
                  className={styles.payments}
                  aria-label="Formas de pagamento"
                  data-role="ft-payments"
                >
                  {pagamentos.map((p, i) => (
                    <li key={i} className={styles.payment}>
                      {ROTULO_PAGAMENTO[p.method as Footer15Payment]}
                    </li>
                  ))}
                </ul>
              )}
              <div className={styles.legalGroup}>
                {legal && (
                  <p className={styles.legal} data-role="ft-legal">
                    {legal}
                  </p>
                )}
                <Credit />
              </div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

const MOCK: Footer15Conteudo = {
  brandUrl: '/',
  tagline: 'Joias, relógios e perfumes escolhidos para atravessar o tempo.',
  columns: [
    {
      title: 'A loja',
      links: [
        { label: 'Joias', url: '/joias' },
        { label: 'Relógios', url: '/relogios' },
        { label: 'Perfumes', url: '/perfumes' },
        { label: 'Beleza', url: '/beleza' },
        { label: 'Presentes', url: '/presentes' },
      ],
    },
    {
      title: 'Atendimento',
      links: [
        { label: 'Central de ajuda', url: '/institucional/ajuda' },
        { label: 'Trocas e devoluções', url: '/institucional/trocas' },
        { label: 'Guia de medidas', url: '/institucional/guia-de-medidas' },
        { label: 'Cuidados com suas joias', url: '/institucional/cuidados' },
        { label: 'Garantia e certificado', url: '/institucional/garantia' },
      ],
    },
    {
      title: 'A maison',
      links: [
        { label: 'Nossa história', url: '/institucional/historia' },
        { label: 'O ateliê', url: '/institucional/atelie' },
        { label: 'Boutiques', url: '/institucional/boutiques' },
        { label: 'Journal', url: '/journal' },
      ],
    },
  ],
  contactTitle: 'Contato',
  contactLines: [{ text: '[0000-0000]' }, { text: 'WhatsApp [00 00000-0000]' }],
  contactHours: 'Seg a sáb · 10h às 19h',
  contactLinks: [
    {
      text: '[contato@suamarca.com.br]',
      url: 'mailto:contato@suamarca.com.br',
    },
  ],
  socials: [
    { network: 'instagram', url: 'https://www.instagram.com/' },
    { network: 'youtube', url: 'https://www.youtube.com/' },
    { network: 'facebook', url: 'https://www.facebook.com/' },
  ],
  payments: [
    { method: 'visa' },
    { method: 'mastercard' },
    { method: 'amex' },
    { method: 'diners' },
    { method: 'elo' },
    { method: 'pix' },
  ],
  legal:
    '© 2026 [RAZÃO SOCIAL] · CNPJ [00.000.000/0001-00] · [Endereço completo]',
};

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Footer15.conteudoPadrao = MOCK;

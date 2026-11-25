import React, { useState } from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useLogoDoRodape } from '@/hooks/useLogoDoRodape';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer16` do faststore.starter (família 16, Infantil; desenho
 * `Footer16` / `Footer16-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá, por baixo
 * do que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 *
 * Painel escuro com a onda creme no topo (ilustração, hex fixo: desvio aprovado); a marca com
 * a bolinha, o texto e as redes; as colunas com título na cor de destaque; o atendimento; as
 * formas de pagamento em pílulas e a linha legal. Mobile: as colunas viram acordeão.
 *
 * Divergência deliberada: logo = o da seção (campo `logo` do schema), senão o que o usuário
 * enviou no /gerador; sem nenhum, o `brandName` do CS ou a marca em texto do catálogo
 * (`SERIE//A`; o mock não traz marca de demonstração) com a bolinha, no mesmo `.logo` /
 * `data-role="ft-logo"`.
 */

type Footer16Social = 'youtube' | 'instagram' | 'x' | 'linkedin' | 'facebook';
type Footer16Payment =
  | 'visa'
  | 'mastercard'
  | 'diners'
  | 'hipercard'
  | 'elo'
  | 'amex'
  | 'aura'
  | 'boleto'
  | 'pix';

interface Footer16Conteudo {
  /** Imagem do logo. Vazio: a marca em texto (`brandName`) com a bolinha. */
  logo?: string;
  logoAlt?: string;
  brandName?: string;
  aboutText?: string;
  socials: { network?: Footer16Social; url?: string }[];
  columns: { title?: string; links?: { label?: string; url?: string }[] }[];
  contactTitle?: string;
  phoneLabel?: string;
  /** Link do telefone (ex.: tel:+55…); vazio = texto. */
  phoneUrl?: string;
  whatsappLabel?: string;
  whatsappUrl?: string;
  scheduleText?: string;
  emailLabel?: string;
  /** Link do e-mail (ex.: mailto:…); vazio = texto. */
  emailUrl?: string;
  payments: { method?: Footer16Payment }[];
  copyright?: string;
}

const ROTULO_REDE: Record<Footer16Social, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

const ROTULO_PAGAMENTO: Record<Footer16Payment, string> = {
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

const FONTES =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap';

const svg = (children: React.ReactNode, w = 20, sw = '2') => (
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

const ICONE_REDE: Record<Footer16Social, React.ReactNode> = {
  instagram: svg(
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </>
  ),
  youtube: svg(
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="m10 9 5 3-5 3z" />
    </>
  ),
  facebook: svg(
    <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" />
  ),
  x: svg(<path d="M4 4l16 16M20 4 4 20" />),
  linkedin: svg(
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </>
  ),
};

const Sinal = ({ aberto }: { aberto: boolean }) =>
  svg(<path d={aberto ? 'M5 12h14' : 'M12 5v14M5 12h14'} />, 18, '2.6');

/** Texto ou link, conforme o CMS mandou a URL. */
const talvezLink = (
  texto: string,
  url: string | undefined,
  className: string,
  externo = false
) =>
  url ? (
    <a
      className={className}
      href={url}
      {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {texto}
    </a>
  ) : (
    <span className={className}>{texto}</span>
  );

const MOCK: Footer16Conteudo = {
  aboutText:
    'Brinquedos, roupinhas e livros escolhidos com carinho para cada fase da infância.',
  socials: [
    { network: 'instagram', url: 'https://instagram.com/' },
    { network: 'youtube', url: 'https://youtube.com/' },
    { network: 'facebook', url: 'https://facebook.com/' },
  ],
  columns: [
    {
      title: 'Loja',
      links: [
        { label: 'Brinquedos', url: '/brinquedos' },
        { label: 'Roupas', url: '/roupas' },
        { label: 'Bebê', url: '/bebe' },
        { label: 'Livros', url: '/livros' },
        { label: 'Papelaria', url: '/papelaria' },
        { label: 'Ofertas', url: '/ofertas' },
      ],
    },
    {
      title: 'Ajuda',
      links: [
        { label: 'Central de ajuda', url: '/ajuda' },
        { label: 'Trocas e devoluções', url: '/ajuda/trocas' },
        { label: 'Prazos de entrega', url: '/ajuda/entregas' },
        { label: 'Guia de tamanhos', url: '/ajuda/tamanhos' },
        { label: 'Segurança dos brinquedos', url: '/ajuda/seguranca' },
      ],
    },
    {
      title: 'Sobre',
      links: [
        { label: 'Quem somos', url: '/sobre' },
        { label: 'Nossas lojas', url: '/lojas' },
        { label: 'Lista de presentes', url: '/lista-de-presentes' },
        { label: 'Trabalhe conosco', url: '/trabalhe-conosco' },
      ],
    },
  ],
  contactTitle: 'Atendimento',
  phoneLabel: '[0000-0000]',
  phoneUrl: 'tel:+550000000000',
  whatsappLabel: 'WhatsApp [00 00000-0000]',
  whatsappUrl: 'https://wa.me/0000000000000',
  scheduleText: 'Seg a sex · 9h às 18h',
  emailLabel: '[contato@suamarca.com.br]',
  emailUrl: 'mailto:contato@suamarca.com.br',
  payments: [
    { method: 'visa' },
    { method: 'mastercard' },
    { method: 'elo' },
    { method: 'hipercard' },
    { method: 'pix' },
    { method: 'boleto' },
  ],
  copyright:
    '© 2026 [SUA MARCA] · [RAZÃO SOCIAL] · CNPJ [00.000.000/0001-00] · [Endereço completo]',
};

/** Crédito padrão da agência: "Desenvolvido por:" + logo SÉRIE//A, link único. */
const AgencyLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
    data-role="ft-credit"
  >
    <span>Desenvolvido por:</span>
    <AgencyLogo className={styles.creditLogo} />
  </a>
)

export default function Footer16() {
  const logoEnviado = useLogoDoRodape();
  const {
    logo: logoDaSecao,
    logoAlt,
    brandName,
    aboutText,
    socials,
    columns,
    contactTitle,
    phoneLabel,
    phoneUrl,
    whatsappLabel,
    whatsappUrl,
    scheduleText,
    emailLabel,
    emailUrl,
    payments,
    copyright,
  } = useConteudoDaSecao(MOCK);
  const logo = logoDaSecao || logoEnviado || undefined;

  const [aberto, setAberto] = useState<number | null>(0);

  const redes = socials.filter(s => s.network && ICONE_REDE[s.network]);
  const formas = payments
    .map(p => (p.method ? ROTULO_PAGAMENTO[p.method] : ''))
    .filter(Boolean);
  const temContato = !!(
    contactTitle &&
    (phoneLabel || whatsappLabel || scheduleText || emailLabel)
  );

  return (
    <div className={styles.footer16Box}>
      <footer className={styles.footer16} data-role="ft-root">
        <link rel="stylesheet" href={FONTES} />
        {/* Onda creme no topo: ilustração da família 16 (hex fixo, desvio aprovado). */}
        <svg
          className={`${styles.wave} ${styles.dsk}`}
          aria-hidden="true"
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
        >
          <path d="M0 0H1440V20C1320 40 1200 0 1080 20S840 40 720 20 480 0 360 20 120 40 0 20z" />
        </svg>
        <svg
          className={`${styles.wave} ${styles.mob}`}
          aria-hidden="true"
          viewBox="0 0 375 24"
          preserveAspectRatio="none"
        >
          <path d="M0 0H375V12C328 24 281 0 234 12S141 24 94 12 47 0 0 12z" />
        </svg>

        <div className={styles.grid}>
          <div className={styles.brand}>
            <a
              className={styles.logo}
              href="/"
              aria-label={logoAlt || brandName || 'Página inicial'}
              data-role="ft-logo"
            >
              {logo ? (
                <img src={logo} alt={logoAlt || 'Logo'} height={40} loading="lazy" />
              ) : (
                <>
                  {brandName || 'SERIE//A'}
                  <span className={styles.logoDot} aria-hidden="true" />
                </>
              )}
            </a>
            {aboutText && <p className={styles.about}>{aboutText}</p>}
            {redes.length > 0 && (
              <ul
                className={styles.socials}
                aria-label="Redes sociais"
                data-role="ft-socials"
              >
                {redes.map((s, i) => (
                  <li key={i}>
                    <a
                      className={styles.social}
                      href={s.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={ROTULO_REDE[s.network as Footer16Social]}
                    >
                      {ICONE_REDE[s.network as Footer16Social]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.blocks}>
            {columns.map((col, i) => {
              const id = `ft16-coluna-${i}`;
              const titulo = col.title ?? '';
              return (
                <nav
                  key={i}
                  className={`${styles.column}${aberto === i ? ` ${styles.columnOpen}` : ''}`}
                  aria-label={titulo}
                  data-role="ft-column"
                >
                  <h2 className={`${styles.columnTitle} ${styles.dsk}`}>
                    {titulo}
                  </h2>
                  <button
                    type="button"
                    className={`${styles.accordion} ${styles.mob}`}
                    aria-expanded={aberto === i}
                    aria-controls={id}
                    onClick={() => setAberto(aberto === i ? null : i)}
                  >
                    {titulo}
                    <Sinal aberto={aberto === i} />
                  </button>
                  <ul id={id} className={styles.links}>
                    {(col.links ?? []).map((l, j) => (
                      <li key={j}>
                        <a href={l.url || '#'}>{l.label}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              );
            })}

            {temContato && (
              <div
                className={`${styles.column} ${styles.contact}`}
                data-role="ft-column"
              >
                <h2 className={styles.columnTitle}>{contactTitle}</h2>
                {(phoneLabel || whatsappLabel) && (
                  <span className={styles.contactPair}>
                    {phoneLabel &&
                      talvezLink(phoneLabel, phoneUrl, styles.contactLine)}
                    {phoneLabel && whatsappLabel && (
                      <span
                        className={`${styles.contactSep} ${styles.mob}`}
                        aria-hidden="true"
                      >
                        {' · '}
                      </span>
                    )}
                    {whatsappLabel &&
                      talvezLink(
                        whatsappLabel,
                        whatsappUrl,
                        styles.contactLine,
                        true
                      )}
                  </span>
                )}
                {scheduleText && (
                  <span className={`${styles.contactLine} ${styles.muted}`}>
                    {scheduleText}
                  </span>
                )}
                {emailLabel &&
                  talvezLink(
                    emailLabel,
                    emailUrl,
                    `${styles.contactLine} ${styles.dsk}`
                  )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomInner}>
            {formas.length > 0 && (
              <ul
                className={styles.payments}
                aria-label="Formas de pagamento"
                data-role="ft-payments"
              >
                {formas.map(f => (
                  <li key={f} className={styles.payment}>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.legalGroup}>
              {copyright && (
                <p className={styles.legal} data-role="ft-legal">
                  {copyright}
                </p>
              )}
              <Credit />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Footer16.conteudoPadrao = MOCK;

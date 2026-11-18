import React, { useState } from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';
import { useLogoDoRodape } from '@/hooks/useLogoDoRodape';

import styles from './index.module.css';

/** Logo da agência (SÉRIE//A) — viewBox recortado no conteúdo; o aria-label fica no link. */
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
);

/** Crédito padrão da agência na faixa legal: conteúdo fixo. */
const Credit = () => (
  <a
    className={styles.credit}
    href="https://seriea.com.br/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Desenvolvido por SÉRIE//A (abre em nova aba)"
  >
    <span>Desenvolvido por:</span>
    <AgencyLogo className={styles.creditLogo} />
  </a>
);


/**
 * Espelha `organisms/Footer11` do faststore.starter (família 11, Grade; desenho
 * `Footer11` / `Footer11-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e
 * as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Grade de filetes: a marca grande, as redes em células quadradas e o selo; as colunas de
 * links numeradas ([01] Loja…), o contato e a newsletter "[05] Journal" (nome + e-mail);
 * a faixa legal em mono com o copyright, a razão social, as formas de pagamento e
 * "Voltar ao topo". Mobile: as colunas e o contato viram acordeão (o 1º aberto), e o
 * selo desce para a faixa legal.
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, a marca em texto do catálogo
 *    (com o sobrescrito do mock), dentro do mesmo `.logo` / `data-role="ft-logo"`.
 *  - Newsletter sem GraphQL: o envio só mostra a mensagem de sucesso.
 *  - "Voltar ao topo" não rola a página: no canvas rolaria o editor.
 */

type Footer11Social = 'youtube' | 'instagram' | 'x' | 'linkedin' | 'facebook';
type Footer11Payment =
  | 'visa'
  | 'mastercard'
  | 'diners'
  | 'hipercard'
  | 'elo'
  | 'amex'
  | 'aura'
  | 'boleto'
  | 'pix';

interface Footer11Props {
  brandName?: string;
  brandSup?: string;
  socials?: { network?: Footer11Social; url?: string }[];
  sealImage?: string;
  sealLabel?: string;
  sealUrl?: string;
  columns?: { title?: string; links?: { label?: string; url?: string }[] }[];
  contactTitle?: string;
  contactLines?: { text?: string; url?: string }[];
  contactNote?: string;
  newsletterLabel?: string;
  newsletterTitle?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
  successMessage?: string;
  privacyPrefix?: string;
  privacyLabel?: string;
  privacyUrl?: string;
  copyright?: string;
  legalText?: string;
  payments?: { method?: Footer11Payment }[];
  backToTopLabel?: string;
}

const MOCK: Footer11Props = {
  brandName: 'SERIE//A',
  brandSup: '®',
  socials: [
    { network: 'instagram', url: 'https://instagram.com/' },
    { network: 'facebook', url: 'https://facebook.com/' },
    { network: 'youtube', url: 'https://youtube.com/' },
  ],
  sealLabel: '[Selo de site seguro]',
  columns: [
    {
      title: 'Loja',
      links: [
        { label: 'Iluminação', url: '/iluminacao' },
        { label: 'Mobiliário', url: '/mobiliario' },
        { label: 'Objetos', url: '/objetos' },
        { label: 'Têxteis', url: '/texteis' },
        { label: 'Outlet', url: '/outlet' },
      ],
    },
    {
      title: 'Ajuda',
      links: [
        { label: 'Entregas e prazos', url: '/ajuda/entregas' },
        { label: 'Trocas e devoluções', url: '/ajuda/trocas' },
        { label: 'Montagem', url: '/ajuda/montagem' },
        { label: 'Garantia', url: '/ajuda/garantia' },
        { label: 'Perguntas frequentes', url: '/ajuda/perguntas-frequentes' },
      ],
    },
    {
      title: 'Estúdio',
      links: [
        { label: 'Sobre', url: '/sobre' },
        { label: 'Designers', url: '/designers' },
        { label: 'Showroom', url: '/showroom' },
        { label: 'Projetos sob medida', url: '/projetos' },
        { label: 'Trabalhe conosco', url: '/trabalhe-conosco' },
      ],
    },
  ],
  contactTitle: 'Contato',
  contactLines: [
    { text: '[0000-0000]', url: 'tel:00000000' },
    {
      text: 'contato@[suamarca].com.br',
      url: 'mailto:contato@suamarca.com.br',
    },
    { text: 'Showroom: [Endereço], [Cidade] · [UF]' },
  ],
  contactNote: 'Seg a sáb · 10h às 19h',
  newsletterLabel: 'Journal',
  newsletterTitle: 'Receba o Journal',
  namePlaceholder: 'Seu nome',
  emailPlaceholder: 'Seu e-mail',
  buttonLabel: 'Inscrever',
  successMessage: 'Inscrição confirmada. Até o próximo Journal.',
  privacyPrefix: 'Ao se inscrever, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/politica-de-privacidade',
  copyright: '© 2026 [SUA MARCA]',
  legalText: '[RAZÃO SOCIAL] · CNPJ [00.000.000/0001-00]',
  payments: [
    { method: 'visa' },
    { method: 'mastercard' },
    { method: 'elo' },
    { method: 'amex' },
    { method: 'pix' },
    { method: 'boleto' },
  ],
  backToTopLabel: 'Voltar ao topo',
};

const ROTULO_REDE: Record<Footer11Social, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

const ROTULO_PAGAMENTO: Record<Footer11Payment, string> = {
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

const ICONE_REDE: Record<Footer11Social, React.ReactNode> = {
  instagram: svg(
    22,
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" />
    </>
  ),
  facebook: svg(
    22,
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
  ),
  youtube: svg(
    22,
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="m10 9.5 5 2.5-5 2.5z" />
    </>
  ),
  x: svg(20, <path d="M4 4l16 16M20 4 4 20" />),
  linkedin: svg(
    22,
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      {/* O ponto do "i" é um traço de 0,01: sem a ponta redonda não desenha nada. */}
      <path
        d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"
        strokeLinecap="round"
      />
    </>
  ),
};

const Seta = () => svg(18, <path d="M5 12h14M13 6l6 6-6 6" />);
const Topo = () => svg(16, <path d="M12 19V5M6 11l6-6 6 6" />);
const Sinal = ({ aberto }: { aberto: boolean }) =>
  svg(18, <path d={aberto ? 'M5 12h14' : 'M12 5v14M5 12h14'} />);

const ordinal = (i: number) => String(i + 1).padStart(2, '0');

export default function Footer11() {
  const logo = useLogoDoRodape();
  const {
    brandName,
    brandSup,
    socials = [],
    sealImage,
    sealLabel,
    sealUrl,
    columns = [],
    contactTitle,
    contactLines = [],
    contactNote,
    newsletterLabel,
    newsletterTitle,
    namePlaceholder,
    emailPlaceholder,
    buttonLabel,
    successMessage,
    privacyPrefix,
    privacyLabel,
    privacyUrl,
    copyright,
    legalText,
    payments = [],
    backToTopLabel,
  } = MOCK;

  const [aberto, setAberto] = useState<number | null>(0);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'idle' | 'ok'>('idle');

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setEstado('ok');
  }

  const redes = socials.filter(s => s.network && ICONE_REDE[s.network]);
  const formas = payments
    .map(p => (p.method ? ROTULO_PAGAMENTO[p.method] : ''))
    .filter(Boolean);
  const temContato = !!(contactLines.length || contactNote);
  // Ordem dos blocos numerados: as colunas, o contato e a newsletter seguem a mesma contagem.
  const nContato = columns.length;
  const nJournal = columns.length + (temContato ? 1 : 0);

  const selo = (className: string) =>
    sealImage || sealLabel ? (
      sealUrl ? (
        <a
          className={className}
          href={sealUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-role="ft-seal"
        >
          {sealImage ? (
            <img src={sealImage} alt={sealLabel ?? ''} height={44} />
          ) : (
            sealLabel
          )}
        </a>
      ) : (
        <span className={className} data-role="ft-seal">
          {sealImage ? (
            <img src={sealImage} alt={sealLabel ?? ''} height={44} />
          ) : (
            sealLabel
          )}
        </span>
      )
    ) : null;

  const bloco = (
    i: number,
    titulo: string,
    conteudo: React.ReactNode,
    tag: 'nav' | 'div' = 'nav'
  ) => {
    const id = `ft11-bloco-${i}`;
    const Tag = tag;
    return (
      <Tag
        key={i}
        className={styles.column}
        {...(tag === 'nav' ? { 'aria-label': titulo } : {})}
        data-role="ft-column"
      >
        <span className={`${styles.columnTitle} ${styles.dsk}`}>
          [{ordinal(i)}] {titulo}
        </span>
        <button
          type="button"
          className={`${styles.accordion} ${styles.mob}`}
          aria-expanded={aberto === i}
          aria-controls={id}
          onClick={() => setAberto(aberto === i ? null : i)}
        >
          [{ordinal(i)}] {titulo}
          <Sinal aberto={aberto === i} />
        </button>
        <div
          id={id}
          className={`${styles.columnBody}${aberto === i ? ` ${styles.columnOpen}` : ''}`}
        >
          {conteudo}
        </div>
      </Tag>
    );
  };

  return (
    <div className={styles.footer11Box}>
      <footer className={styles.footer11} data-role="ft-root">
        <link rel="stylesheet" href={FONTES_11} />
        <div className={styles.inner}>
          <div className={styles.brandRow}>
            <a
              className={styles.logo}
              href="/"
              aria-label={brandName || 'Página inicial'}
              data-role="ft-logo"
            >
              {logo ? (
                <img src={logo} alt="Logo" height={48} />
              ) : (
                <>
                  {brandName}
                  {brandSup && <sup className={styles.logoSup}>{brandSup}</sup>}
                </>
              )}
            </a>
            {redes.length > 0 && (
              <div className={styles.socials} data-role="ft-socials">
                {redes.map((s, i) => (
                  <a
                    key={i}
                    className={styles.social}
                    href={s.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ROTULO_REDE[s.network as Footer11Social]}
                  >
                    {ICONE_REDE[s.network as Footer11Social]}
                  </a>
                ))}
              </div>
            )}
            {selo(`${styles.seal} ${styles.dsk}`)}
          </div>

          <div className={styles.columns}>
            {columns.map((col, i) =>
              bloco(
                i,
                col.title ?? '',
                <ul className={styles.links}>
                  {(col.links ?? []).map((l, j) => (
                    <li key={j} className={styles.linkItem}>
                      <span className={styles.ordinal}>{ordinal(j)}</span>
                      <a href={l.url || '#'}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              )
            )}

            {temContato &&
              bloco(
                nContato,
                contactTitle ?? '',
                <address className={styles.contact}>
                  {contactLines.map((l, j) =>
                    l.url ? (
                      <a key={j} href={l.url}>
                        {l.text}
                      </a>
                    ) : (
                      <span key={j}>{l.text}</span>
                    )
                  )}
                  {contactNote && (
                    <span className={styles.contactNote}>{contactNote}</span>
                  )}
                </address>,
                'div'
              )}

            <form
              className={styles.newsletter}
              onSubmit={enviar}
              data-role="ft-newsletter"
            >
              {newsletterLabel && (
                <span className={styles.columnTitle}>
                  [{ordinal(nJournal)}] {newsletterLabel}
                </span>
              )}
              {newsletterTitle && (
                <p className={styles.newsletterTitle}>{newsletterTitle}</p>
              )}
              {estado === 'ok' ? (
                <p className={styles.feedback} role="status">
                  {successMessage}
                </p>
              ) : (
                <div className={styles.fields}>
                  <label className={styles.fieldName}>
                    <span className={styles.srOnly}>
                      {namePlaceholder || 'Seu nome'}
                    </span>
                    <input
                      className={styles.input}
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      placeholder={namePlaceholder}
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      data-role="ft-input"
                    />
                  </label>
                  <div className={styles.fieldRow}>
                    <label className={styles.fieldEmail}>
                      <span className={styles.srOnly}>
                        {emailPlaceholder || 'Seu e-mail'}
                      </span>
                      <input
                        className={styles.input}
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder={emailPlaceholder}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        data-role="ft-input"
                      />
                    </label>
                    <button
                      type="submit"
                      className={styles.submit}
                      aria-label={buttonLabel || 'Inscrever'}
                      data-role="ft-button"
                    >
                      <Seta />
                    </button>
                  </div>
                </div>
              )}
              {privacyLabel && (
                <p className={styles.privacy}>
                  {privacyPrefix && `${privacyPrefix} `}
                  <a href={privacyUrl || '#'}>{privacyLabel}</a>.
                </p>
              )}
            </form>
          </div>

          <div className={styles.bottom} data-role="ft-legal">
            {(copyright || legalText) && (
              <span className={styles.legalGroup}>
                {copyright && (
                  <span className={styles.copyright}>{copyright}</span>
                )}
                {legalText && (
                  <span className={styles.legalText}>{legalText}</span>
                )}
              </span>
            )}
            {formas.length > 0 && (
              <span className={styles.payments} data-role="ft-payments">
                {formas.join(' / ')}
              </span>
            )}
            {selo(`${styles.sealBottom} ${styles.mob}`)}
            <span className={styles.creditCell}>
              <Credit />
            </span>
            <a
              className={styles.backToTop}
              href="#"
              onClick={e => e.preventDefault()}
            >
              {backToTopLabel || 'Voltar ao topo'}
              <Topo />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

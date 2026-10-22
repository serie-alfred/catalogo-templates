import React, { useState } from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

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
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </>
  ),
};

const Seta = () => svg(18, <path d="M5 12h14M13 6l6 6-6 6" />);
const Topo = () => svg(16, <path d="M12 19V5M6 11l6-6 6 6" />);
const Sinal = ({ aberto }: { aberto: boolean }) =>
  svg(18, <path d={aberto ? 'M5 12h14' : 'M12 5v14M5 12h14'} />);

const ordinal = (i: number) => String(i + 1).padStart(2, '0');

export default function Footer11() {
  const { logo } = useLayout();
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

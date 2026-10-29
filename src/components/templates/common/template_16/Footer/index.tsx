import React, { useState } from 'react';

import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer16` do faststore.starter (família 16, Infantil; desenho
 * `Footer16` / `Footer16-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Painel escuro com a onda creme no topo (ilustração, hex fixo: desvio aprovado); a marca com
 * a bolinha, o texto e as redes; as colunas com título na cor de destaque; o atendimento; as
 * formas de pagamento em pílulas e a linha legal. Mobile: as colunas viram acordeão.
 *
 * Divergência deliberada: logo = o que o usuário enviou no /gerador; sem ele, a marca em texto
 * do mock ("sua marca", genérica) com a bolinha, no mesmo `.logo` / `data-role="ft-logo"`.
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

interface Footer16Props {
  /** Imagem do logo. Vazio: a marca em texto (`brandName`) com a bolinha. */
  logo?: string;
  logoAlt?: string;
  brandName?: string;
  aboutText?: string;
  socials?: { network?: Footer16Social; url?: string }[];
  columns?: { title?: string; links?: { label?: string; url?: string }[] }[];
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
  payments?: { method?: Footer16Payment }[];
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

const MOCK: Footer16Props = {
  brandName: 'SERIE//A',
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

export default function Footer16() {
  const { logo: logoEnviado } = useLayout();
  const logo = logoEnviado || undefined;
  const {
    logoAlt,
    brandName,
    aboutText,
    socials = [],
    columns = [],
    contactTitle,
    phoneLabel,
    phoneUrl,
    whatsappLabel,
    whatsappUrl,
    scheduleText,
    emailLabel,
    emailUrl,
    payments = [],
    copyright,
  } = MOCK;

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
                <img src={logo} alt="Logo" height={40} loading="lazy" />
              ) : (
                <>
                  {brandName}
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

        {(formas.length > 0 || copyright) && (
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
              {copyright && (
                <p className={styles.legal} data-role="ft-legal">
                  {copyright}
                </p>
              )}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}

import React, { useState } from 'react';

import { FONTES_17 } from '@/components/templates/common/template_17/Spot';
import { useLogoDoRodape } from '@/hooks/useLogoDoRodape';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer17` do faststore.starter (família 17, Pet; desenho `Footer17` /
 * `Footer17-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Painel escuro: a marca com a patinha no círculo de destaque, o texto sobre a loja e as redes
 * em círculos com contorno; as colunas de links com o título em Bricolage sobre o tracinho
 * tangerina; o atendimento (telefone, WhatsApp, horário apagado e e-mail); abaixo de um filete,
 * as formas de pagamento em pílulas e a linha legal. Mobile: as colunas e o atendimento viram
 * acordeão (a 1ª aberta). Sem newsletter: o desenho da 17 não tem.
 *
 * Divergência deliberada: logo = o que o usuário enviou no /gerador; sem ele, a marca em texto
 * do mock ("SERIE//A", genérica) com a patinha, no mesmo `.logo` / `data-role="ft-logo"`.
 */

type Footer17Social = 'youtube' | 'instagram' | 'x' | 'linkedin' | 'facebook';
type Footer17Payment =
  | 'visa'
  | 'mastercard'
  | 'diners'
  | 'hipercard'
  | 'elo'
  | 'amex'
  | 'aura'
  | 'boleto'
  | 'pix';

interface Footer17Props {
  /** Imagem do logo. Vazio: a marca em texto (`brandName`) com a patinha. */
  logo?: string;
  logoAlt?: string;
  brandName?: string;
  aboutText?: string;
  socials?: { network?: Footer17Social; url?: string }[];
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
  payments?: { method?: Footer17Payment }[];
  copyright?: string;
}

const ROTULO_REDE: Record<Footer17Social, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

const ROTULO_PAGAMENTO: Record<Footer17Payment, string> = {
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


// O mock.ts do starter, com a marca genérica no lugar da de exemplo.
const MOCK: Footer17Props = {
  brandName: 'SERIE//A',
  aboutText:
    'Tudo para o dia a dia do seu pet: ração, petiscos, acessórios, higiene e farmácia, com entrega rápida ou retirada na loja.',
  socials: [
    { network: 'instagram', url: 'https://instagram.com/' },
    { network: 'facebook', url: 'https://facebook.com/' },
    { network: 'youtube', url: 'https://youtube.com/' },
    { network: 'x', url: 'https://x.com/' },
  ],
  columns: [
    {
      title: 'Compre por pet',
      links: [
        { label: 'Cachorros', url: '/cachorros' },
        { label: 'Gatos', url: '/gatos' },
        { label: 'Pássaros', url: '/passaros' },
        { label: 'Peixes', url: '/peixes' },
        { label: 'Outros pets', url: '/outros-pets' },
        { label: 'Farmácia', url: '/farmacia' },
      ],
    },
    {
      title: 'Ajuda',
      links: [
        { label: 'Central de ajuda', url: '/ajuda' },
        { label: 'Meus pedidos', url: '/account/orders' },
        { label: 'Trocas e devoluções', url: '/ajuda/trocas' },
        { label: 'Prazos de entrega', url: '/ajuda/entregas' },
        { label: 'Retirada na loja', url: '/ajuda/retirada' },
      ],
    },
    {
      title: 'Institucional',
      links: [
        { label: 'Quem somos', url: '/sobre' },
        { label: 'Nossas lojas', url: '/lojas' },
        { label: 'Política de privacidade', url: '/politica-de-privacidade' },
        { label: 'Trabalhe conosco', url: '/trabalhe-conosco' },
      ],
    },
  ],
  contactTitle: 'Atendimento',
  phoneLabel: '[0000-0000]',
  phoneUrl: 'tel:+550000000000',
  whatsappLabel: 'WhatsApp [00 00000-0000]',
  whatsappUrl: 'https://wa.me/0000000000000',
  scheduleText: 'Seg a sáb · 8h às 20h',
  emailLabel: '[contato@suamarca.com.br]',
  emailUrl: 'mailto:contato@suamarca.com.br',
  payments: [
    { method: 'visa' },
    { method: 'mastercard' },
    { method: 'elo' },
    { method: 'hipercard' },
    { method: 'amex' },
    { method: 'pix' },
    { method: 'boleto' },
  ],
  copyright:
    '© 2026 [SUA MARCA] · [RAZÃO SOCIAL] · CNPJ [00.000.000/0001-00] · [Endereço completo]',
};

const svg = (children: React.ReactNode, w = 20, sw = '1.8') => (
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

const PATA = (
  <>
    <ellipse cx="5.5" cy="10" rx="2" ry="2.6" />
    <ellipse cx="9.5" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="14.5" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="18.5" cy="10" rx="2" ry="2.6" />
    <path d="M12 11.5c-3 0-6 3.6-6 6.2 0 1.9 1.6 2.8 3.2 2.3.9-.3 1.8-.6 2.8-.6s1.9.3 2.8.6c1.6.5 3.2-.4 3.2-2.3 0-2.6-3-6.2-6-6.2z" />
  </>
);

const ICONE_REDE: Record<Footer17Social, React.ReactNode> = {
  instagram: svg(
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" />
    </>
  ),
  facebook: svg(
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
  ),
  youtube: svg(
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9.5 5 2.5-5 2.5z" />
    </>
  ),
  x: svg(<path d="M4 4h4.5L20 20h-4.5zM20 4l-6.6 7.2M4 20l6.6-7.2" />, 18),
  linkedin: svg(
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </>
  ),
};

const Sinal = ({ aberto }: { aberto: boolean }) =>
  svg(<path d={aberto ? 'M5 12h14' : 'M12 5v14M5 12h14'} />, 18, '2');

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

export default function Footer17() {
  const logoEnviado = useLogoDoRodape();
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

  /** Coluna: título com o tracinho no desktop, botão de acordeão no mobile. */
  const coluna = (
    i: number,
    titulo: string,
    conteudo: React.ReactNode,
    className: string
  ) => {
    const id = `ft17-coluna-${i}`;
    return (
      <div
        key={i}
        className={`${styles.column}${aberto === i ? ` ${styles.columnOpen}` : ''}`}
        data-role="ft-column"
      >
        <h2 className={`${styles.columnTitle} ${styles.dsk}`}>
          {titulo}
          <span className={styles.columnMark} aria-hidden="true" />
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
        <div id={id} className={className}>
          {conteudo}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.footer17Box}>
      <footer className={styles.footer17} data-role="ft-root">
        <link rel="stylesheet" href={FONTES_17} />

        <div className={styles.grid}>
          <div className={styles.brand}>
            <a
              className={styles.logo}
              href="/"
              aria-label={
                logoAlt ||
                (brandName ? `${brandName}, página inicial` : 'Página inicial')
              }
              data-role="ft-logo"
            >
              {logo ? (
                <img src={logo} alt="Logo" height={42} loading="lazy" />
              ) : (
                <>
                  <span className={styles.logoMark} aria-hidden="true">
                    {svg(PATA, 22)}
                  </span>
                  {brandName}
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
                      aria-label={ROTULO_REDE[s.network as Footer17Social]}
                    >
                      {ICONE_REDE[s.network as Footer17Social]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.blocks}>
            {columns.map((col, i) =>
              coluna(
                i,
                col.title ?? '',
                <nav aria-label={col.title ?? ''}>
                  <ul className={styles.linkList}>
                    {(col.links ?? []).map((l, j) => (
                      <li key={j}>
                        <a href={l.url || '#'}>{l.label}</a>
                      </li>
                    ))}
                  </ul>
                </nav>,
                styles.links
              )
            )}

            {temContato &&
              coluna(
                columns.length,
                contactTitle ?? '',
                <>
                  {phoneLabel &&
                    talvezLink(phoneLabel, phoneUrl, styles.contactLine)}
                  {whatsappLabel &&
                    talvezLink(
                      whatsappLabel,
                      whatsappUrl,
                      styles.contactLine,
                      true
                    )}
                  {scheduleText && (
                    <span className={`${styles.contactLine} ${styles.muted}`}>
                      {scheduleText}
                    </span>
                  )}
                  {emailLabel &&
                    talvezLink(emailLabel, emailUrl, styles.contactLine)}
                </>,
                styles.links
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

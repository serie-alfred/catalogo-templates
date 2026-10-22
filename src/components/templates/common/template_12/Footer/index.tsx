import React, { useState } from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer12` do faststore.starter (família 12, Suave; desenho
 * `Footer12` / `Footer12-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (razão social e CNPJ entre colchetes, como no desenho).
 *
 * Painel rosado com os cantos de cima arredondados: a marca, o texto e as redes; três
 * colunas de links; o atendimento com o WhatsApp em pílula; pagamentos, selos e a linha
 * legal. Mobile: colunas e atendimento em acordeão (o 1º aberto) e o WhatsApp largo.
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, a marca em texto do catálogo,
 *    dentro do mesmo `.logo` / `data-role="ft-logo"`.
 */

type Footer12Social = 'youtube' | 'instagram' | 'x' | 'linkedin' | 'facebook';
type Footer12Payment =
  | 'visa'
  | 'mastercard'
  | 'diners'
  | 'hipercard'
  | 'elo'
  | 'amex'
  | 'aura'
  | 'boleto'
  | 'pix';

interface Footer12Props {
  /** Imagem do logo. Vazio: a marca em texto (`brandName`). */
  logo?: string;
  logoAlt?: string;
  brandName?: string;
  aboutText?: string;
  socials?: { network?: Footer12Social; url?: string }[];
  columns?: { title?: string; links?: { label?: string; url?: string }[] }[];
  contactTitle?: string;
  contactNote?: string;
  whatsappLabel?: string;
  whatsappUrl?: string;
  /** Linhas do atendimento: com `url` é link (mailto:, tel:…), sem `url` é texto. */
  contactLines?: { text?: string; url?: string }[];
  payments?: { method?: Footer12Payment }[];
  /** Selos de segurança: imagem do CMS; sem imagem, o rótulo na caixa tracejada. */
  seals?: { image?: string; label?: string; url?: string }[];
  copyright?: string;
  legalLinks?: { label?: string; url?: string }[];
}

// O mock.ts de lá; a marca em texto é a do catálogo.
const MOCK: Footer12Props = {
  brandName: 'SERIE//A',
  aboutText:
    'Cuidado gentil para pele, cabelo e corpo, com fórmulas pensadas para a rotina de verdade.',
  socials: [
    { network: 'instagram', url: 'https://instagram.com/' },
    { network: 'facebook', url: 'https://facebook.com/' },
    { network: 'youtube', url: 'https://youtube.com/' },
  ],
  columns: [
    {
      title: 'Comprar',
      links: [
        { label: 'Skincare', url: '/skincare' },
        { label: 'Maquiagem', url: '/maquiagem' },
        { label: 'Cabelos', url: '/cabelos' },
        { label: 'Corpo e banho', url: '/corpo-e-banho' },
        { label: 'Kits', url: '/kits' },
        { label: 'Ofertas', url: '/ofertas' },
      ],
    },
    {
      title: 'Ajuda',
      links: [
        { label: 'Meus pedidos', url: '/account/orders' },
        { label: 'Trocas e devoluções', url: '/ajuda/trocas' },
        { label: 'Prazos de entrega', url: '/ajuda/entregas' },
        { label: 'Formas de pagamento', url: '/ajuda/pagamento' },
        { label: 'Perguntas frequentes', url: '/ajuda/perguntas-frequentes' },
      ],
    },
    {
      title: 'Sobre',
      links: [
        { label: 'Nossa história', url: '/sobre' },
        { label: 'Ingredientes', url: '/ingredientes' },
        { label: 'Sustentabilidade', url: '/sustentabilidade' },
        { label: 'Seja revendedora', url: '/revenda' },
        { label: 'Trabalhe conosco', url: '/trabalhe-conosco' },
      ],
    },
  ],
  contactTitle: 'Atendimento',
  contactNote: 'Seg a sex, das 9h às 18h',
  whatsappLabel: 'WhatsApp [00 00000-0000]',
  whatsappUrl: 'https://wa.me/0000000000000',
  contactLines: [
    {
      text: '[contato@suamarca.com.br]',
      url: 'mailto:contato@suamarca.com.br',
    },
  ],
  payments: [
    { method: 'visa' },
    { method: 'mastercard' },
    { method: 'elo' },
    { method: 'amex' },
    { method: 'pix' },
    { method: 'boleto' },
  ],
  seals: [{ label: '[Selo 01]' }, { label: '[Selo 02]' }],
  copyright:
    '© 2026 [RAZÃO SOCIAL] · CNPJ [00.000.000/0001-00] · [Endereço completo]',
  legalLinks: [
    { label: 'Política de privacidade', url: '/politica-de-privacidade' },
    { label: 'Termos de uso', url: '/termos-de-uso' },
  ],
};

const ROTULO_REDE: Record<Footer12Social, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

const ROTULO_PAGAMENTO: Record<Footer12Payment, string> = {
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

const svg = (children: React.ReactNode) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const ICONE_REDE: Record<Footer12Social, React.ReactNode> = {
  instagram: svg(
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" />
    </>
  ),
  facebook: svg(
    <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" />
  ),
  youtube: svg(
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9.5 5 2.5-5 2.5z" />
    </>
  ),
  x: svg(<path d="M4 4l16 16M20 4 4 20" />),
  linkedin: svg(
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
    </>
  ),
};

const Whats = () => svg(<path d="M4 20l1.3-4A8 8 0 1 1 8 19z" />);
const Sinal = ({ aberto }: { aberto: boolean }) =>
  svg(<path d={aberto ? 'M5 12h14' : 'M12 5v14M5 12h14'} />);

export default function Footer12() {
  const { logo } = useLayout();
  const {
    logoAlt,
    brandName,
    aboutText,
    socials = [],
    columns = [],
    contactTitle,
    contactNote,
    whatsappLabel,
    whatsappUrl,
    contactLines = [],
    payments = [],
    seals = [],
    copyright,
    legalLinks = [],
  } = MOCK;

  const [aberto, setAberto] = useState<number | null>(0);

  const redes = socials.filter(s => s.network && ICONE_REDE[s.network]);
  const formas = payments
    .map(p => (p.method ? ROTULO_PAGAMENTO[p.method] : ''))
    .filter(Boolean);
  const selos = seals.filter(s => s.image || s.label);
  const temWhats = !!(whatsappLabel && whatsappUrl);
  const temContato = !!(
    contactTitle &&
    (contactNote || contactLines.length || temWhats)
  );
  const links = legalLinks.filter(l => l.label);

  const whats = (className: string) =>
    temWhats ? (
      <a
        className={className}
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-role="ft-button"
      >
        <Whats />
        {whatsappLabel}
      </a>
    ) : null;

  const bloco = (
    i: number,
    titulo: string,
    conteudo: React.ReactNode,
    tag: 'nav' | 'div' = 'nav'
  ) => {
    const id = `ft12-bloco-${i}`;
    const Tag = tag;
    return (
      <Tag
        key={i}
        className={styles.column}
        {...(tag === 'nav' ? { 'aria-label': titulo } : {})}
        data-role="ft-column"
      >
        <h2 className={`${styles.columnTitle} ${styles.dsk}`}>{titulo}</h2>
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
    <div className={styles.footer12Box}>
      <footer className={styles.footer12} data-role="ft-root">
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.panel}>
          <div className={styles.inner}>
            <div className={styles.grid}>
              <div className={styles.brand}>
                <a
                  className={styles.logo}
                  href="/"
                  aria-label={logoAlt || brandName || 'Página inicial'}
                  data-role="ft-logo"
                >
                  {logo ? <img src={logo} alt="Logo" height={40} /> : brandName}
                </a>
                {aboutText && <p className={styles.about}>{aboutText}</p>}
                {redes.length > 0 && (
                  <div className={styles.socials} data-role="ft-socials">
                    {redes.map((s, i) => (
                      <a
                        key={i}
                        className={styles.social}
                        href={s.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={ROTULO_REDE[s.network as Footer12Social]}
                      >
                        {ICONE_REDE[s.network as Footer12Social]}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.blocks}>
                {columns.map((col, i) =>
                  bloco(
                    i,
                    col.title ?? '',
                    <ul className={styles.links}>
                      {(col.links ?? []).map((l, j) => (
                        <li key={j}>
                          <a href={l.url || '#'}>{l.label}</a>
                        </li>
                      ))}
                    </ul>
                  )
                )}

                {temContato &&
                  bloco(
                    columns.length,
                    contactTitle ?? '',
                    <address className={styles.contact}>
                      {contactNote && (
                        <p className={styles.contactNote}>{contactNote}</p>
                      )}
                      {whats(`${styles.whats} ${styles.dsk}`)}
                      {contactLines.map((l, j) =>
                        l.url ? (
                          <a
                            key={j}
                            className={styles.contactLine}
                            href={l.url}
                          >
                            {l.text}
                          </a>
                        ) : (
                          <span key={j} className={styles.contactLine}>
                            {l.text}
                          </span>
                        )
                      )}
                    </address>,
                    'div'
                  )}
              </div>

              {whats(`${styles.whatsWide} ${styles.mob}`)}
            </div>

            {(formas.length > 0 || selos.length > 0) && (
              <div className={styles.bottom}>
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
                {selos.length > 0 && (
                  <div className={styles.seals} data-role="ft-seal">
                    {selos.map((s, i) => {
                      const conteudo = s.image ? (
                        <img src={s.image} alt={s.label ?? ''} height={32} />
                      ) : (
                        s.label
                      );
                      const cls = `${styles.seal}${s.image ? '' : ` ${styles.sealEmpty}`}`;
                      return s.url ? (
                        <a
                          key={i}
                          className={cls}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {conteudo}
                        </a>
                      ) : (
                        <span key={i} className={cls}>
                          {conteudo}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {(copyright || links.length > 0) && (
              <div className={styles.legal} data-role="ft-legal">
                {copyright && <span>{copyright}</span>}
                {links.length > 0 && (
                  <span className={styles.legalLinks}>
                    {links.map((l, i) => (
                      <a key={i} href={l.url || '#'}>
                        {l.label}
                      </a>
                    ))}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

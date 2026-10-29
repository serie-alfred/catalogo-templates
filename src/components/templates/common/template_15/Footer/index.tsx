import React, { useState } from 'react';
import { FONTES_15 } from '@/components/templates/common/template_15/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer15` do faststore.starter (família 15, Luxo; desenho `Footer15` /
 * `Footer15-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Fundo escuro: a marca em serifa espaçada, o ornamento dourado (fio · diamante · fio) e a
 * frase em itálico; entre fios, as colunas de links e o "Contato"; no pé, os pagamentos em
 * etiquetas e a linha legal. Mobile: as colunas em acordeão (a primeira aberta).
 *
 * Divergência deliberada: com logo enviado no /gerador, ele entra no lugar da marca em texto
 * (mesmo `.brand` / `data-role="ft-brand"`); lá a marca é só texto (`brandName`).
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

interface Footer15Props {
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

export default function Footer15() {
  const { logo } = useLayout();
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
  } = FOOTER_15;
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
          {(brandName || tagline) && (
            <div className={styles.head} data-role="ft-brand-block">
              {brandName && (
                <a
                  className={styles.brand}
                  href={brandUrl || '/'}
                  aria-label={`${brandName}, página inicial`}
                  data-role="ft-brand"
                >
                  {logo ? <img src={logo} alt="Logo" /> : brandName}
                </a>
              )}
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
          )}

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

          {(pagamentos.length > 0 || legal) && (
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
              {legal && (
                <p className={styles.legal} data-role="ft-legal">
                  {legal}
                </p>
              )}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

const FOOTER_15: Footer15Props = {
  brandName: 'Sua Marca',
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
    '© 2026 [SUA MARCA] · [RAZÃO SOCIAL] · CNPJ [00.000.000/0001-00] · [Endereço completo]',
};

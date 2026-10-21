import React, { useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer09` do faststore.starter (família 09, Editorial; desenho
 * `Footer09` / `Footer09-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e
 * as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Colunas de links + "Atendimento" (contato, horário e redes em texto), a marca gigante,
 * formas de pagamento em etiquetas de texto e a linha legal. Mobile: as colunas viram
 * acordeão (a primeira aberta).
 *
 * Divergência deliberada: a marca é o logo que o usuário enviou no /gerador; sem ele, a
 * marca em texto do catálogo. Razão social e CNPJ são genéricos.
 */

type Footer09Social = 'youtube' | 'instagram' | 'x' | 'linkedin' | 'facebook';
type Footer09Payment = 'visa' | 'mastercard' | 'diners' | 'hipercard' | 'elo' | 'amex' | 'aura' | 'boleto' | 'pix';

const ROTULO_REDE: Record<Footer09Social, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

const ROTULO_PAGAMENTO: Record<Footer09Payment, string> = {
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

const MOCK = {
  columns: [
    {
      title: 'Institucional',
      links: [
        { label: 'Sobre a marca', url: '/institucional/sobre' },
        { label: 'Nossas lojas', url: '/institucional/lojas' },
        { label: 'Trabalhe conosco', url: '/institucional/trabalhe-conosco' },
        { label: 'Sustentabilidade', url: '/institucional/sustentabilidade' },
      ],
    },
    {
      title: 'Ajuda',
      links: [
        { label: 'Trocas e devoluções', url: '/institucional/trocas' },
        { label: 'Prazos de entrega', url: '/institucional/entrega' },
        { label: 'Guia de medidas', url: '/institucional/guia-de-medidas' },
        { label: 'Política de privacidade', url: '/institucional/privacidade' },
      ],
    },
    {
      title: 'Categorias',
      links: [
        { label: 'Novidades', url: '/novidades' },
        { label: 'Feminino', url: '/feminino' },
        { label: 'Masculino', url: '/masculino' },
        { label: 'Sale', url: '/sale', highlight: true },
      ],
    },
  ] as { title: string; links: { label: string; url: string; highlight?: boolean }[] }[],
  contactTitle: 'Atendimento',
  contactLines: [{ text: '[0000-0000]' }, { text: '[e-mail de atendimento]' }] as { text: string; url?: string }[],
  contactHours: 'Seg a sex, 9h às 18h',
  socials: [
    { network: 'instagram', url: 'https://www.instagram.com/' },
    { network: 'facebook', url: 'https://www.facebook.com/' },
    { network: 'youtube', url: 'https://www.youtube.com/' },
  ] as { network: Footer09Social; url: string }[],
  brandUrl: '/',
  payments: ['visa', 'mastercard', 'elo', 'amex', 'pix', 'boleto'] as Footer09Payment[],
  legal: '© 2026 [RAZÃO SOCIAL] · CNPJ [00.000.000/0001-00] · [Endereço completo]',
};

const Sinal = ({ aberto }: { aberto: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d={aberto ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
  </svg>
);

export default function Footer09() {
  const { logo } = useLayout();
  const { columns, contactTitle, contactLines, contactHours, socials, brandUrl, payments, legal } = MOCK;
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <div className={styles.footer09Box}>
      <footer className={styles.footer09} data-role="ft-root">
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.main}>
          <div className={styles.grid}>
            {columns.map((col, i) => {
              const id = `ft09-col-${i}`;
              const open = aberta === i;
              return (
                <div key={i} className={`${styles.column}${open ? ` ${styles.columnOpen}` : ''}`} data-role="ft-column">
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
                    {col.links.map((l, j) => (
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

            <div className={styles.contact} data-role="ft-contact">
              <h2 className={styles.contactTitle}>{contactTitle}</h2>
              <ul className={styles.contactList}>
                {contactLines.map((c, i) => (
                  <li key={i}>{c.url ? <a href={c.url}>{c.text}</a> : c.text}</li>
                ))}
                <li className={styles.muted}>{contactHours}</li>
                <li className={styles.socials}>
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      className={styles.social}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-role="ft-social"
                    >
                      <span>{ROTULO_REDE[s.network]}</span>
                    </a>
                  ))}
                </li>
              </ul>
            </div>
          </div>

          <a className={styles.brand} href={brandUrl} aria-label="Página inicial" data-role="ft-brand">
            {logo ? <img src={logo} alt="Logo" /> : <span>SERIE//A</span>}
          </a>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomInner}>
            <ul className={styles.payments} aria-label="Formas de pagamento" data-role="ft-payments">
              {payments.map((p, i) => (
                <li key={i} className={styles.payment}>
                  {ROTULO_PAGAMENTO[p]}
                </li>
              ))}
            </ul>
            <p className={styles.legal} data-role="ft-legal">
              {legal}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

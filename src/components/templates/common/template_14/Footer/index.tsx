import React, { useState } from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer14` do faststore.starter (família 14, Esportiva; desenho
 * `Footer14` / `Footer14-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Fundo marinho com a faixa lima no topo; a marca (a barra vira o traço lima inclinado) com
 * o texto sobre a loja e as redes em paralelogramos lima; as colunas de links com título em
 * Saira itálica; o atendimento; no pé, as formas de pagamento em etiquetas e o copyright.
 * Mobile: marca e redes em cima, as colunas em acordeão, o atendimento aberto e o pé
 * empilhado.
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, a marca em texto do catálogo
 *    ("SERIE/A", a barra virando o traço de destaque, como a "/" de lá), no mesmo
 *    `.logo` / `data-role="ft-logo"`.
 *  - Links de mock (`href` de exemplo), sem navegação real.
 */

type Footer14Social = 'youtube' | 'instagram' | 'x' | 'linkedin' | 'facebook';
type Footer14Payment = 'visa' | 'mastercard' | 'diners' | 'hipercard' | 'elo' | 'amex' | 'aura' | 'boleto' | 'pix';

const ROTULO_REDE: Record<Footer14Social, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

const ROTULO_PAGAMENTO: Record<Footer14Payment, string> = {
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
  brandName: 'SERIE/A',
  aboutText: 'Equipamento para quem treina de verdade: corrida, academia, futebol, ciclismo e suplementação.',
  socials: [
    { network: 'instagram', url: 'https://instagram.com/' },
    { network: 'youtube', url: 'https://youtube.com/' },
    { network: 'facebook', url: 'https://facebook.com/' },
    { network: 'x', url: 'https://x.com/' },
  ] as { network?: Footer14Social; url?: string }[],
  columns: [
    {
      title: 'Loja',
      links: [
        { label: 'Corrida', url: '/corrida' },
        { label: 'Treino', url: '/treino' },
        { label: 'Futebol', url: '/futebol' },
        { label: 'Ciclismo', url: '/ciclismo' },
        { label: 'Suplementos', url: '/suplementos' },
        { label: 'Ofertas', url: '/ofertas' },
      ],
    },
    {
      title: 'Ajuda',
      links: [
        { label: 'Central de ajuda', url: '/ajuda' },
        { label: 'Trocas e devoluções', url: '/ajuda/trocas' },
        { label: 'Prazos de entrega', url: '/ajuda/entregas' },
        { label: 'Tabela de medidas', url: '/ajuda/medidas' },
        { label: 'Fale conosco', url: '/fale-conosco' },
      ],
    },
    {
      title: 'Institucional',
      links: [
        { label: 'Quem somos', url: '/sobre' },
        { label: 'Nossas lojas', url: '/lojas' },
        { label: 'Assessoria esportiva', url: '/assessoria' },
        { label: 'Trabalhe conosco', url: '/trabalhe-conosco' },
        { label: 'Política de privacidade', url: '/politica-de-privacidade' },
      ],
    },
  ],
  contactTitle: 'Atendimento',
  contactLines: [
    { text: '[0000-0000]' },
    { text: 'WhatsApp [00 00000-0000]' },
    { text: 'Seg a sex · 8h às 20h' },
    { text: '[contato@suamarca.com.br]', url: 'mailto:contato@suamarca.com.br' },
  ] as { text?: string; url?: string }[],
  payments: [
    { method: 'visa' },
    { method: 'mastercard' },
    { method: 'elo' },
    { method: 'amex' },
    { method: 'hipercard' },
    { method: 'pix' },
    { method: 'boleto' },
  ] as { method?: Footer14Payment }[],
  copyright: '© 2026 [SUA MARCA] · [RAZÃO SOCIAL] · CNPJ [00.000.000/0001-00] · [Endereço completo]',
};

const svg = (w: number, children: React.ReactNode, sw = '2') => (
  <svg width={w} height={w} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="square" aria-hidden="true">
    {children}
  </svg>
);

const ICONE_REDE: Record<Footer14Social, React.ReactNode> = {
  instagram: svg(
    20,
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  youtube: svg(
    20,
    <>
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="m10 9 5 3-5 3z" />
    </>
  ),
  facebook: svg(20, <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />),
  x: svg(18, <path d="M4 4l16 16M20 4 4 20" />),
  linkedin: svg(
    20,
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10v7M8 7v.01M12 17v-7M12 13a3 3 0 0 1 6 0v4" />
    </>
  ),
};

const Sinal = ({ aberto }: { aberto: boolean }) => svg(18, <path d={aberto ? 'M5 12h14' : 'M12 5v14M5 12h14'} />, '2.4');

/** "SERIE/A": a barra vira o traço inclinado na cor de destaque. */
function Marca({ nome }: { nome: string }) {
  return (
    <>
      {nome.split('/').map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={styles.slash} aria-hidden="true" />}
          {p}
        </React.Fragment>
      ))}
    </>
  );
}

export default function Footer14() {
  const { logo } = useLayout();
  const { brandName, aboutText, socials, columns, contactTitle, contactLines, payments, copyright } = MOCK;

  const [aberto, setAberto] = useState<number | null>(null);

  const redes = socials.filter(s => s.network && ROTULO_REDE[s.network]);
  const formas = payments.map(p => (p.method ? ROTULO_PAGAMENTO[p.method] : '')).filter(Boolean);
  const linhas = contactLines.filter(l => l.text);

  return (
    <div className={styles.footer14Box}>
      <footer className={styles.footer14} data-role="ft-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.stripe} aria-hidden="true" />

        <div className={styles.grid}>
          <div className={styles.brand}>
            <a className={styles.logo} href="/" aria-label={`${brandName.replace('/', ' ')}, página inicial`} data-role="ft-logo">
              {logo ? <img src={logo} alt="Logo" height={30} loading="lazy" /> : <Marca nome={brandName} />}
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
                    aria-label={ROTULO_REDE[s.network as Footer14Social]}
                  >
                    {ICONE_REDE[s.network as Footer14Social]}
                  </a>
                ))}
              </div>
            )}
          </div>

          {columns.length > 0 && (
            <div className={styles.columns}>
              {columns.map((col, i) => {
                const id = `ft14-coluna-${i}`;
                const estaAberto = aberto === i;
                return (
                  <nav key={i} className={styles.column} aria-label={col.title} data-role="ft-column">
                    <h2 className={`${styles.columnTitle} ${styles.dsk}`}>{col.title}</h2>
                    <button
                      type="button"
                      className={`${styles.accordion} ${styles.mob}`}
                      aria-expanded={estaAberto}
                      aria-controls={id}
                      onClick={() => setAberto(estaAberto ? null : i)}
                    >
                      {col.title}
                      <Sinal aberto={estaAberto} />
                    </button>
                    <ul id={id} className={`${styles.links}${estaAberto ? ` ${styles.linksOpen}` : ''}`}>
                      {(col.links ?? []).map((l, j) => (
                        <li key={j}>
                          <a href={l.url || '#'}>{l.label}</a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                );
              })}
            </div>
          )}

          {contactTitle && linhas.length > 0 && (
            <address className={styles.contact} data-role="ft-contact">
              <h2 className={styles.contactTitle}>{contactTitle}</h2>
              {linhas.map((l, j) =>
                l.url ? (
                  <a key={j} className={styles.contactLink} href={l.url}>
                    {l.text}
                  </a>
                ) : (
                  <span key={j}>{l.text}</span>
                )
              )}
            </address>
          )}
        </div>

        {(formas.length > 0 || copyright) && (
          <div className={styles.bottomWrap}>
            <div className={styles.bottom}>
              {formas.length > 0 && (
                <ul className={styles.payments} aria-label="Formas de pagamento" data-role="ft-payments">
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

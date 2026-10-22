import React, { useState } from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';
import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer13` do faststore.starter (família 13, Noturno; desenho
 * `Footer13` / `Footer13-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (razão social e CNPJ entre colchetes, como no desenho).
 *
 * No topo, as redes em letras gigantes com a seta em verde; a marca com o texto, as colunas
 * de links com título em verde e o atendimento; no pé, as formas de pagamento em etiquetas
 * e o copyright. Mobile: redes 2 × 2 e colunas + atendimento em acordeão (o 1º aberto).
 *
 * Divergências deliberadas:
 *  - Logo: o que o usuário enviou no /gerador; sem ele, a marca em texto do catálogo
 *    ("SERIE//A", as barras na cor de destaque), dentro do mesmo `.logo` / `data-role="ft-logo"`.
 */

type Footer13Social = 'youtube' | 'instagram' | 'x' | 'linkedin' | 'facebook';
type Footer13Payment =
  | 'visa'
  | 'mastercard'
  | 'diners'
  | 'hipercard'
  | 'elo'
  | 'amex'
  | 'aura'
  | 'boleto'
  | 'pix';

interface Footer13Props {
  /** Imagem do logo. Vazio: a marca em texto (`brandName`; a "/" sai na cor de destaque). */
  logo?: string;
  logoAlt?: string;
  brandName?: string;
  aboutText?: string;
  socials?: { network?: Footer13Social; url?: string }[];
  columns?: { title?: string; links?: { label?: string; url?: string }[] }[];
  contactTitle?: string;
  /** Linhas do atendimento: com `url` é link (mailto:, tel:, wa.me…), sem `url` é texto. */
  contactLines?: { text?: string; url?: string; muted?: boolean }[];
  payments?: { method?: Footer13Payment }[];
  copyright?: string;
}

const MOCK: Footer13Props = {
  brandName: 'SERIE//A',
  aboutText: 'Drops semanais e peças em edição limitada. Quando acaba, acabou.',
  socials: [
    { network: 'instagram', url: 'https://instagram.com/' },
    { network: 'youtube', url: 'https://youtube.com/' },
    { network: 'x', url: 'https://x.com/' },
    { network: 'facebook', url: 'https://facebook.com/' },
  ],
  columns: [
    {
      title: 'Loja',
      links: [
        { label: 'Drops', url: '/drops' },
        { label: 'Roupas', url: '/roupas' },
        { label: 'Tênis', url: '/tenis' },
        { label: 'Acessórios', url: '/acessorios' },
        { label: 'Outlet', url: '/outlet' },
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
      title: 'Sobre',
      links: [
        { label: 'Quem somos', url: '/sobre' },
        { label: 'Colabs', url: '/colabs' },
        { label: 'Nossas lojas', url: '/lojas' },
        { label: 'Trabalhe conosco', url: '/trabalhe-conosco' },
      ],
    },
  ],
  contactTitle: 'Atendimento',
  contactLines: [
    { text: '[0000-0000]', url: 'tel:00000000' },
    { text: 'WhatsApp [00 00000-0000]', url: 'https://wa.me/0000000000000' },
    { text: 'Seg a sex · 9h às 18h', muted: true },
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
  copyright:
    '© 2026 [SUA MARCA] · [RAZÃO SOCIAL] · CNPJ [00.000.000/0001-00] · [Endereço completo]',
};

const ROTULO_REDE: Record<Footer13Social, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

const ROTULO_PAGAMENTO: Record<Footer13Payment, string> = {
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

const Seta = () => (
  <svg
    className={styles.arrow}
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

const Sinal = ({ aberto }: { aberto: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d={aberto ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
  </svg>
);

/** "Sua/Marca": a barra sai na cor de destaque. */
function Marca({ nome }: { nome: string }) {
  return (
    <>
      {nome.split('/').map((p, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className={styles.slash}>/</span>}
          {p}
        </React.Fragment>
      ))}
    </>
  );
}

export default function Footer13() {
  const { logo } = useLayout();
  const {
    logoAlt,
    brandName,
    aboutText,
    socials = [],
    columns = [],
    contactTitle,
    contactLines = [],
    payments = [],
    copyright,
  } = MOCK;

  const [aberto, setAberto] = useState<number | null>(0);

  const redes = socials.filter(s => s.network && ROTULO_REDE[s.network]);
  const formas = payments
    .map(p => (p.method ? ROTULO_PAGAMENTO[p.method] : ''))
    .filter(Boolean);
  const linhas = contactLines.filter(l => l.text);
  const temContato = !!(contactTitle && linhas.length);

  const bloco = (
    i: number,
    titulo: string,
    conteudo: React.ReactNode,
    tag: 'nav' | 'div' = 'nav'
  ) => {
    const id = `ft13-bloco-${i}`;
    const Tag = tag;
    const estaAberto = aberto === i;
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
          className={`${styles.accordion} ${styles.mob}${estaAberto ? ` ${styles.accordionOpen}` : ''}`}
          aria-expanded={estaAberto}
          aria-controls={id}
          onClick={() => setAberto(estaAberto ? null : i)}
        >
          {titulo}
          <Sinal aberto={estaAberto} />
        </button>
        <div
          id={id}
          className={`${styles.columnBody}${estaAberto ? ` ${styles.columnOpen}` : ''}`}
        >
          {conteudo}
        </div>
      </Tag>
    );
  };

  return (
    <div className={styles.footer13Box}>
      <footer className={styles.footer13} data-role="ft-root">
        <link rel="stylesheet" href={FONTES_13} />

        {redes.length > 0 && (
          <div className={styles.socialsWrap}>
            <div className={styles.socials} data-role="ft-socials">
              {redes.map((s, i) => (
                <a
                  key={i}
                  className={styles.social}
                  href={s.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ROTULO_REDE[s.network as Footer13Social]}
                  <Seta />
                </a>
              ))}
            </div>
          </div>
        )}

        <div className={styles.grid}>
          <div className={styles.brand}>
            <a
              className={styles.logo}
              href="/"
              aria-label={logoAlt || brandName || 'Página inicial'}
              data-role="ft-logo"
            >
              {logo ? (
                <img src={logo} alt="Logo" height={34} loading="lazy" />
              ) : (
                <Marca nome={brandName ?? ''} />
              )}
            </a>
            {aboutText && <p className={styles.about}>{aboutText}</p>}
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
                  {linhas.map((l, j) => {
                    const cls = `${styles.contactLine}${l.muted ? ` ${styles.muted}` : ''}`;
                    return l.url ? (
                      <a key={j} className={cls} href={l.url}>
                        {l.text}
                      </a>
                    ) : (
                      <span key={j} className={cls}>
                        {l.text}
                      </span>
                    );
                  })}
                </address>,
                'div'
              )}
          </div>
        </div>

        {(formas.length > 0 || copyright) && (
          <div className={styles.bottomWrap}>
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

import React from 'react';

import { ICO_LOGO, ICO_PAGAMENTO, ICO_SOCIAL } from './icons';
import styles from './index.module.css';

/**
 * Espelha `organisms/Footer08` do faststore.starter — rodapé do "Templates - Serie
 * A" (Figma 7316:17345 / 7316:17390). Mesmo markup, classes, `data-role` e vars de
 * Nível 1. A régua de benefícios e a newsletter do Figma são blocos da LP
 * BlackFriday01. A linha legal leva placeholders (no Figma é a de outra empresa).
 */

const FONTES =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Red+Hat+Display:wght@500&display=swap';

const IMG = '/gerador/footer08';

const REDES = ['youtube', 'instagram', 'x', 'linkedin', 'facebook'] as const;
const ROTULO_REDE = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

const PAGAMENTOS = [
  ['visa', 'Visa'],
  ['mastercard', 'Mastercard'],
  ['diners', 'Diners Club'],
  ['hipercard', 'Hipercard'],
  ['elo', 'Elo'],
  ['amex', 'American Express'],
  ['aura', 'Aura'],
  ['boleto', 'Boleto'],
  ['pix', 'Pix'],
] as const;

const COLUNAS = [
  [
    'Site map',
    'Institucional',
    'Terms & conditions',
    'Cookie policy',
    'Cookie policy',
  ],
  [
    'Cookie policy',
    'Privacy policy',
    'Site map',
    'Terms & conditions',
    'Cookie policy',
  ],
];

const SELOS = [
  { src: `${IMG}/yourviews.png`, alt: 'Yourviews', width: 29 },
  { src: `${IMG}/google-reviews.png`, alt: 'Google Reviews', width: 76 },
  { src: `${IMG}/clearsale.png`, alt: 'Clear Sale', width: 52 },
  { src: `${IMG}/letsencrypt.svg`, alt: "Let's Encrypt", width: 40 },
];

const Svg = ({
  svg,
  className,
  label,
}: {
  svg: string;
  className?: string;
  label?: string;
}) => (
  <span
    className={className}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    dangerouslySetInnerHTML={{ __html: svg }}
  />
);

export default function Footer08() {
  // O envelope é o container das regras mobile: a raiz também tem regra mobile, e
  // uma @container não estiliza o próprio container.
  return (
    <div className={styles.footer08Box}>
      <footer className={styles.footer08} data-role="ft-root">
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.brandText}>
              <a
                className={styles.logo}
                href="/"
                aria-label="Página inicial"
                data-role="ft-logo"
              >
                <Svg svg={ICO_LOGO} className={styles.ico} />
              </a>
              <p className={styles.text} data-role="ft-text">
                {
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nBlandit maecenas volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit maecenas volutpat.'
                }
              </p>
            </div>
            <div className={styles.social}>
              <p className={styles.heading} data-role="ft-heading">
                Redes Sociais
              </p>
              <ul className={styles.socialList}>
                {REDES.map(r => (
                  <li key={r}>
                    <a
                      className={styles.socialLink}
                      href="#"
                      aria-label={ROTULO_REDE[r]}
                      data-role="ft-social"
                    >
                      <Svg svg={ICO_SOCIAL[r]} className={styles.ico} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <nav className={styles.columns} aria-label="Links do rodapé">
            {COLUNAS.map((links, i) => (
              <div key={i} className={styles.column}>
                <p className={styles.heading} data-role="ft-heading">
                  Institucional
                </p>
                <ul className={styles.links}>
                  {links.map((l, j) => (
                    <li key={j}>
                      <a className={styles.link} href="#" data-role="ft-link">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.bottom}>
          <div className={styles.payments}>
            <p className={styles.subheading} data-role="ft-subheading">
              Pagamento
            </p>
            <ul className={styles.paymentList}>
              {PAGAMENTOS.map(([k, rotulo]) => (
                <li key={k} data-role="ft-payment">
                  <Svg
                    svg={ICO_PAGAMENTO[k]}
                    className={styles.ico}
                    label={rotulo}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.seals}>
            <p className={styles.subheading} data-role="ft-subheading">
              selos
            </p>
            <ul className={styles.sealList}>
              {SELOS.map(s => (
                <li key={s.alt} data-role="ft-seal">
                  {/* `style`: o `img { width: 100% }` global do catálogo anula o atributo. */}
                  <img
                    className={styles.seal}
                    src={s.src}
                    alt={s.alt}
                    width={s.width}
                    height={32}
                    style={{ width: s.width }}
                  />
                </li>
              ))}
            </ul>
          </div>
          <p className={styles.legal} data-role="ft-legal">
            {
              'RAZÃO SOCIAL DA LOJA LTDA - CNPJ: 00.000.000/0000-00 © Todos os direitos reservados. Os preços exibidos nessa loja são fictícios e servem apenas para demonstração\nTecnologia da plataforma'
            }
          </p>
        </div>
      </footer>
    </div>
  );
}

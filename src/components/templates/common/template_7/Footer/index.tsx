'use client';

import React, { useState } from 'react';

import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer07` do faststore.starter — footer institucional
 * escuro do 07, com duas artes distintas do design (bloco desktop ≥768 e
 * bloco mobile <768, alternados por CSS, com textos de newsletter próprios).
 *
 * Esta é a RE-migração. O mock anterior deste slot renderizava um footer de
 * moda masculina streetwear — outro componente — enquanto o `path` entregava
 * este. Ver ACHADOS-EM-ABERTO.md, 11/09.
 *
 * A newsletter da origem inscreve de verdade (`useNewsLetter` → Master Data).
 * Aqui é estado local: preview não faz rede.
 *
 * O nome da marca NÃO vem da origem: o `/from-faststore` proíbe trazer o
 * wordmark do cliente para o catálogo, que é público. Vem de `useLayout().logo`
 * com o fallback "SERIE//A", como em Header01/03/04/06.
 */
interface Link {
  label: string;
  href?: string;
}

interface Column {
  title: string;
  links: Link[];
}

// ── Assinaturas fixas (plataforma + agência) ─────────────────────────────────
// Não passam pelo CMS: são créditos do rodapé, iguais em toda a loja.

/** Logo VTEX — SVG oficial limpo (sem metadados de editor), na cor da marca. */
const VtexLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 304.60388 109.53113"
    role="img"
    aria-label="VTEX"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="#ff3366" fillRule="nonzero" transform="translate(-0.186108,-0.31959)">
      <path d="m 220.35,41.34 h -10.92 v 37.38 c -0.005,0.704658 -0.57534,1.274558 -1.28,1.28 h -8.41 c -0.70466,-0.0054 -1.27456,-0.575342 -1.28,-1.28 V 41.34 h -11 c -0.33306,0.01356 -0.65736,-0.108641 -0.89866,-0.338623 C 186.32005,40.771395 186.18243,40.453328 186.18,40.12 V 33.5 c 0.002,-0.333328 0.14005,-0.651395 0.38134,-0.881377 0.2413,-0.229982 0.5656,-0.352182 0.89866,-0.338623 h 32.87 c 0.70901,-0.03402 1.3123,0.511172 1.35,1.22 v 6.62 c -0.0377,0.700724 -0.62863,1.242773 -1.33,1.22 z" />
      <path d="m 255.37,79.75 c -4.30509,0.615781 -8.65146,0.896624 -13,0.84 -8.29,0 -15.61,-2.12 -15.61,-13.81 V 45.45 c 0,-11.69 7.39,-13.74 15.67,-13.74 4.31504,-0.05911 8.62812,0.218397 12.9,0.83 0.9,0.13 1.28,0.45 1.28,1.28 v 6 c -0.005,0.704658 -0.57534,1.274558 -1.28,1.28 h -13.5 c -3,0 -4.11,1 -4.11,4.37 v 5.84 h 17.14 c 0.70466,0.0054 1.27456,0.575342 1.28,1.28 v 6.1 c -0.005,0.704658 -0.57534,1.274558 -1.28,1.28 h -17.14 v 6.81 c 0,3.34 1.09,4.37 4.11,4.37 h 13.54 c 0.70466,0.0054 1.27456,0.575342 1.28,1.28 v 6 c 0.01,0.8 -0.38,1.19 -1.28,1.32 z" />
      <path d="m 303.83,80 h -10.21 c -0.71202,0.0529 -1.38046,-0.347368 -1.67,-1 l -8.86,-14 -8,13.74 c -0.45,0.77 -0.9,1.28 -1.61,1.28 H 264 c -0.24831,0.04452 -0.50356,-0.02356 -0.69672,-0.18581 C 263.11012,79.671935 262.99901,79.432264 263,79.18 c 0.0131,-0.157131 0.0573,-0.310094 0.13,-0.45 L 277.06,55.54 263,33.5 c -0.0725,-0.118382 -0.11698,-0.251786 -0.13,-0.39 0.0476,-0.506319 0.49306,-0.880511 1,-0.84 h 10.34 c 0.71,0 1.22,0.64 1.61,1.22 l 8.22,13 8,-13 c 0.28992,-0.657457 0.89863,-1.118721 1.61,-1.22 h 9.51 c 0.50694,-0.04051 0.9524,0.333681 1,0.84 -0.013,0.138214 -0.0575,0.271618 -0.13,0.39 l -14,22.17 14.57,23 c 0.11259,0.195504 0.17768,0.414728 0.19,0.64 -0.12,0.44 -0.45,0.69 -0.96,0.69 z" />
      <path d="m 170.8,32.41 c -0.47969,-0.01067 -0.89936,0.320862 -1,0.79 l -9.33,34.52 c -0.13,0.71 -0.32,1 -0.9,1 -0.58,0 -0.77,-0.26 -0.9,-1 l -9.3,-34.52 c -0.10064,-0.469138 -0.52031,-0.800674 -1,-0.79 h -9.18 c -0.30814,-0.0076 -0.60256,0.127382 -0.79796,0.36577 -0.1954,0.238388 -0.26995,0.553566 -0.20204,0.85423 0,0 11.39,39.57 11.51,40 1.52,4.72 5.21,7 9.9,7 4.49956,0.161453 8.55216,-2.704023 9.9,-7 0.18,-0.54 11.32,-40 11.32,-40 0.0643,-0.2992 -0.0119,-0.611392 -0.20682,-0.847296 C 180.41822,32.5468 180.12596,32.413159 179.82,32.42 Z" />
      <path d="M 118.77,0.32 H 23.05 C 19.586315,0.35166678 16.388901,2.1841531 14.61068,5.1567016 12.832459,8.12925 12.729906,11.813127 14.34,14.88 l 9.58,18.24 H 6.56 C 4.3421294,33.079643 2.2685207,34.216027 1.109161,36.107181 -0.05019865,37.998335 -0.12215931,40.361817 0.92,42.32 l 30.8,58.2 c 1.10523,2.09008 3.275685,3.39759 5.64,3.39759 2.364314,0 4.53477,-1.30751 5.64,-3.39759 l 8.36,-15.77 10.5,19.86 c 1.707211,3.22421 5.056702,5.24072 8.705,5.24072 3.648297,0 6.997789,-2.01651 8.705,-5.24072 l 48,-90.25 c 1.5893,-2.970574 1.49395,-6.5591519 -0.25085,-9.4411411 C 125.27436,2.0368696 122.13886,0.28884316 118.77,0.32 Z M 76,38.45 55,77.83 c -0.7215,1.360201 -2.13529,2.210648 -3.675,2.210648 -1.53971,0 -2.953501,-0.850447 -3.675,-2.210648 l -20.73,-39 C 26.280421,37.629796 26.317769,36.18196 27.018378,35.016327 27.718987,33.850695 28.980019,33.138359 30.34,33.14 h 42.42 c 1.27814,-0.01967 2.471383,0.638051 3.1372,1.729251 0.665817,1.0912 0.704917,2.453148 0.1028,3.580749 z" />
    </g>
  </svg>
)

/** Logo da agência — viewBox recortado no conteúdo (o original tinha folga). */
const AgencyLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="6.5 3.9 67 13.9"
    role="img"
    aria-label="Serie A"
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
)

/** Créditos do rodapé: plataforma + agência. Conteúdo fixo, fora do CMS. */
const Credits = ({ role }: { role: string }) => (
  <div className={styles.credits} data-role={role}>
    <span className={styles.credit}>
      <VtexLogo className={[styles.creditLogo, styles.creditLogoVtex].join(' ')} />
    </span>
    <a
      className={styles.credit}
      href="https://seriea.com.br/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Serie A — abre em nova aba"
    >
      <AgencyLogo className={[styles.creditLogo, styles.creditLogoAgency].join(' ')} />
    </a>
  </div>
)

const conteudo = {
  brandTagline: 'casa · conforto · estilo',
  brandDescription:
    'Curadoria de produtos têxteis e de decoração para transformar cada ambiente da sua casa.',
  nlEyebrow: 'Clube VIP',
  nlEyebrowMobile: 'Clube VIP',
  nlTitle: 'Receba lançamentos e ofertas em primeira mão',
  nlTitleMobile: 'Receba novidades em primeira mão',
  nlNote: 'Sem spam. Cancele quando quiser.',
  nlBenefit: '✓ Acesso antecipado a lançamentos e curadoria exclusiva',
  nlPlaceholder: 'Seu melhor e-mail',
  nlPlaceholderMobile: 'Seu e-mail',
  nlButtonLabel: 'Cadastrar',
  successMessage: 'Pronto! Você entrou no Clube VIP.',
  columns: [
    {
      title: 'Categorias',
      links: [
        { label: 'Tapetes' },
        { label: 'Cama' },
        { label: 'Banho' },
        { label: 'Decoração' },
      ],
    },
    {
      title: 'Atendimento',
      links: [
        { label: 'WhatsApp' },
        { label: 'Central de ajuda' },
        { label: 'Rastreio de pedido' },
        { label: 'Trocas e devoluções' },
      ],
    },
    {
      title: 'Informações',
      links: [
        { label: 'Sobre nós' },
        { label: 'Política de privacidade' },
        { label: 'Termos de uso' },
      ],
    },
  ] as Column[],
  payments: ['Visa', 'Master', 'Pix', 'Boleto'],
  copyright:
    '© 2026 Sua Loja. Todos os direitos reservados. CNPJ 00.000.000/0001-00',
};

export default function Footer() {
  const { logo } = useLayout();
  const [sentDesktop, setSentDesktop] = useState(false);
  const [sentMobile, setSentMobile] = useState(false);

  const submit =
    (setSent: (v: boolean) => void) => (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const email =
        form.querySelector<HTMLInputElement>('input[type="email"]')?.value.trim() ??
        '';
      if (!email) return;
      setSent(true);
      form.reset();
    };

  const renderColumn = (col: Column, i: number) => (
    <div key={i} className={styles.col} data-role="col">
      <p className={styles.colTitle} data-role="col-title">
        {col.title}
      </p>
      <div className={styles.colLinks}>
        {col.links.map((l, j) => (
          <a
            key={j}
            className={styles.colLink}
            data-role="col-link"
            href={l.href || '#'}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );

  return (
    /* wrapper só do catálogo — ver o comentário no index.module.css */
    <div className={styles.footer07Root}>
      <footer className={styles.footer}>
        <div className={styles.desktop} data-role="footer">
          <div className={styles.newsletter} data-role="newsletter">
            <div className={styles.nlText}>
              <p className={styles.nlEyebrow} data-role="nl-eyebrow">
                {conteudo.nlEyebrow}
              </p>
              <h3 className={styles.nlTitle} data-role="nl-title">
                {conteudo.nlTitle}
              </h3>
              <p className={styles.nlNote} data-role="nl-note">
                {conteudo.nlNote}
              </p>
            </div>
            <div className={styles.nlFormWrap}>
              <form
                className={styles.nlForm}
                data-role="nl-form"
                onSubmit={submit(setSentDesktop)}
              >
                <input
                  className={styles.nlInput}
                  data-role="nl-input"
                  type="email"
                  placeholder={conteudo.nlPlaceholder}
                  aria-label={conteudo.nlEyebrow}
                  required
                />
                <button
                  className={styles.nlButton}
                  data-role="nl-button"
                  type="submit"
                >
                  {conteudo.nlButtonLabel}
                </button>
              </form>
              <p className={styles.nlBenefit} data-role="nl-benefit">
                {sentDesktop ? conteudo.successMessage : conteudo.nlBenefit}
              </p>
            </div>
          </div>

          <div className={styles.grid} data-role="grid">
            <div className={styles.brand} data-role="col">
              <div className={styles.brandName} data-role="brand-name">
                {logo ? (
                  <img src={logo} alt="Logo" className={styles.brandLogo} />
                ) : (
                  'SERIE//A'
                )}
              </div>
              <div className={styles.brandTagline} data-role="brand-tagline">
                {conteudo.brandTagline}
              </div>
              <p className={styles.brandDesc} data-role="brand-desc">
                {conteudo.brandDescription}
              </p>
            </div>
            {conteudo.columns.map(renderColumn)}
          </div>

          <div className={styles.bottom} data-role="bottom">
            <p className={styles.copyright} data-role="copyright">
              {conteudo.copyright}
            </p>
            <Credits role="credits" />
            <div className={styles.payments} data-role="payments">
              {conteudo.payments.map((p, i) => (
                <span key={i} className={styles.payment} data-role="payment">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.mobile} data-role="footer">
          <div className={styles.brandNameM} data-role="m-brand-name">
            {logo ? (
              <img src={logo} alt="Logo" className={styles.brandLogo} />
            ) : (
              'SERIE//A'
            )}
          </div>
          <div className={styles.brandTaglineM} data-role="m-brand-tagline">
            {conteudo.brandTagline}
          </div>
          <p className={styles.brandDescM} data-role="m-brand-desc">
            {conteudo.brandDescription}
          </p>

          <div className={styles.newsletterM} data-role="m-newsletter">
            <p className={styles.nlEyebrowM} data-role="m-nl-eyebrow">
              {conteudo.nlEyebrowMobile}
            </p>
            <h3 className={styles.nlTitleM} data-role="m-nl-title">
              {conteudo.nlTitleMobile}
            </h3>
            <p className={styles.nlNoteM} data-role="m-nl-note">
              {conteudo.nlNote}
            </p>
            <form
              className={styles.nlFormM}
              data-role="m-nl-form"
              onSubmit={submit(setSentMobile)}
            >
              <input
                className={styles.nlInputM}
                data-role="m-nl-input"
                type="email"
                placeholder={conteudo.nlPlaceholderMobile}
                aria-label={conteudo.nlEyebrowMobile}
                required
              />
              <button
                className={styles.nlButtonM}
                data-role="m-nl-button"
                type="submit"
              >
                {conteudo.nlButtonLabel}
              </button>
            </form>
            <p className={styles.nlBenefitM} data-role="m-nl-benefit">
              {sentMobile ? conteudo.successMessage : conteudo.nlBenefit}
            </p>
          </div>

          <div className={styles.gridM} data-role="m-grid">
            {conteudo.columns.map((col, i) => (
              <div key={i} className={styles.colM} data-role="m-col">
                <p className={styles.colTitleM} data-role="m-col-title">
                  {col.title}
                </p>
                <div className={styles.colLinksM}>
                  {col.links.map((l, j) => (
                    <a
                      key={j}
                      className={styles.colLinkM}
                      data-role="m-col-link"
                      href={l.href || '#'}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.bottomM} data-role="m-bottom">
            <div className={styles.paymentsM} data-role="m-payments">
              {conteudo.payments.map((p, i) => (
                <span key={i} className={styles.paymentM} data-role="m-payment">
                  {p}
                </span>
              ))}
            </div>
            <p className={styles.copyrightM} data-role="m-copyright">
              {conteudo.copyright}
            </p>
          </div>

          <Credits role="m-credits" />
        </div>
      </footer>
    </div>
  );
}

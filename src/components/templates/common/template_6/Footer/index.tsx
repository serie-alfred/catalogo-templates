'use client';

import React, { useEffect, useRef, useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer06` do faststore.starter (branch base/faststore):
 * newsletter (nome + e-mail), redes sociais, três colunas (accordion abaixo de
 * 768px) e a barra inferior com selos, copyright e os logos de plataforma.
 *
 * Os dois lados publicam os mesmos `data-role` — é por eles que o 2-fidelidade
 * casa nó a nó (par Footer06 em scripts/funil/lib/fidelidade.mjs). Mudou a
 * estrutura aqui, mude lá também.
 *
 * O que diverge da origem, de propósito:
 * - a newsletter não faz rede: o envio só mostra a confirmação por 2s, como a
 *   origem faz depois de gravar;
 * - os selos da origem são imagens do CDN da loja, com a avaliação da própria
 *   loja: aqui são `placehold.co` na mesma proporção (27×37, 36×37 e 48×46);
 * - razão social e CNPJ são genéricos (ver `copyright`).
 */

interface ColumnLink {
  name: string;
  highlight?: boolean;
}

interface Column {
  title: string;
  text?: string;
  links: ColumnLink[];
}

interface Seal {
  src: string;
  alt: string;
  url?: string;
  /** proporção da imagem da origem: a caixa sai certa antes de ela carregar */
  width: number;
  height: number;
}

const data = {
  newsletterSubtitle: 'Fique por dentro de todas as novidades',
  newsletterTitle: 'Assine nossa Newsletter',
  newsletterNamePlaceholder: 'Nome',
  newsletterEmailPlaceholder: 'E-mail',
  newsletterButtonLabel: 'Enviar',
  newsletterSuccessMessage: 'Cadastro enviado com sucesso.',
  socialTitle: 'Siga-nos',
  socials: ['Instagram', 'Facebook', 'TikTok', 'YouTube'],
  columns: [
    {
      title: 'Institucional',
      links: [
        { name: 'Sobre nós' },
        { name: 'Uso e conservação' },
        { name: 'Tecnologias' },
        { name: 'Outono / Inverno' },
        { name: 'Nossas Lojas' },
        { name: 'Mapa do site' },
      ],
    },
    {
      title: 'Central de Ajuda',
      links: [
        { name: 'Clube' },
        { name: 'Política de Entrega' },
        { name: 'Rastreie seu pedido' },
        { name: 'Trocas e devoluções' },
        { name: 'Segurança e Privacidade' },
      ],
    },
    {
      title: 'Atendimento',
      text: 'Segunda a Sexta: 08h às 16h',
      links: [{ name: 'WhatsApp', highlight: true }],
    },
  ] as Column[],
  seals: [
    { src: 'https://placehold.co/54x74?text=Selo', alt: 'Selo de segurança', width: 27, height: 37 },
    { src: 'https://placehold.co/72x74?text=Selo', alt: 'Selo de avaliação', width: 36, height: 37 },
    { src: 'https://placehold.co/96x92?text=Selo', alt: 'Selo de navegação segura', width: 48, height: 46 },
  ] as Seal[],
  // 60 caracteres DE PROPÓSITO, o mesmo tamanho do copyright do mock da origem. A barra
  // de baixo divide a sobra entre selos e logos (`flex: 1` nas duas pontas), e no
  // mobile o texto quebra em duas linhas: o 2-fidelidade mede em fonte-sonda
  // monoespaçada, então cada caractere a mais mudaria a largura dos dois blocos no
  // desktop e o ponto de quebra no celular.
  copyright: '© 2026 - CNPJ: 00.000.000/0001-00 Sua Loja Ltda. Cidade - UF',
};

// ── Ícones sociais (os mesmos glifos da origem, na cor do texto do rodapé) ──

const InstagramIcon = () => (
  <svg className={styles.socialIcon} data-role="social-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 13.125C11.7259 13.125 13.125 11.7259 13.125 10C13.125 8.27411 11.7259 6.875 10 6.875C8.27411 6.875 6.875 8.27411 6.875 10C6.875 11.7259 8.27411 13.125 10 13.125Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.75 2.5H6.25C4.17893 2.5 2.5 4.17893 2.5 6.25V13.75C2.5 15.8211 4.17893 17.5 6.25 17.5H13.75C15.8211 17.5 17.5 15.8211 17.5 13.75V6.25C17.5 4.17893 15.8211 2.5 13.75 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.0625 6.71875C14.494 6.71875 14.8438 6.36897 14.8438 5.9375C14.8438 5.50603 14.494 5.15625 14.0625 5.15625C13.631 5.15625 13.2812 5.50603 13.2812 5.9375C13.2812 6.36897 13.631 6.71875 14.0625 6.71875Z" fill="currentColor" />
  </svg>
);

const FacebookIcon = () => (
  <svg className={styles.socialIcon} data-role="social-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" fill="currentColor" />
    <path className={styles.socialIconCutout} d="M13.125 6.875H11.875C11.3777 6.875 10.9008 7.07254 10.5492 7.42417C10.1975 7.77581 10 8.25272 10 8.75V17.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path className={styles.socialIconCutout} d="M7.5 11.25H12.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TiktokIcon = () => (
  <svg className={styles.socialIcon} data-role="social-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.125 7.96875C14.3992 8.88589 15.9301 9.37796 17.5 9.375V6.25C16.3397 6.25 15.2269 5.78906 14.4064 4.96859C13.5859 4.14812 13.125 3.03532 13.125 1.875H10V12.1875C9.99984 12.5789 9.89464 12.9631 9.69539 13.3001C9.49614 13.637 9.21014 13.9143 8.86721 14.103C8.52428 14.2917 8.137 14.385 7.74575 14.3731C7.3545 14.3611 6.97362 14.2444 6.64284 14.0351C6.31207 13.8258 6.04351 13.5316 5.86519 13.1831C5.68686 12.8347 5.6053 12.4448 5.62902 12.0541C5.65273 11.6633 5.78085 11.2861 6.00001 10.9618C6.21917 10.6375 6.52134 10.3779 6.875 10.2102V6.875C4.38828 7.31797 2.5 9.57344 2.5 12.1875C2.5 13.5965 3.05971 14.9477 4.056 15.944C5.05228 16.9403 6.40354 17.5 7.8125 17.5C9.22146 17.5 10.5727 16.9403 11.569 15.944C12.5653 14.9477 13.125 13.5965 13.125 12.1875V7.96875Z" fill="currentColor" />
  </svg>
);

const YoutubeIcon = () => (
  <svg className={styles.socialIcon} data-role="social-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.2536 9.93239L8.96786 7.20512C8.86026 7.13659 8.73519 7.09724 8.60599 7.09127C8.4768 7.08529 8.34833 7.11292 8.2343 7.17119C8.12026 7.22947 8.02495 7.3162 7.95852 7.42215C7.8921 7.52809 7.85706 7.64926 7.85714 7.77273V13.2273C7.85706 13.3507 7.8921 13.4719 7.95852 13.5779C8.02495 13.6838 8.12026 13.7705 8.2343 13.8288C8.34833 13.8871 8.4768 13.9147 8.60599 13.9087C8.73519 13.9028 8.86026 13.8634 8.96786 13.7949L13.2536 11.0676C13.3515 11.0054 13.4319 10.921 13.4875 10.822C13.543 10.7229 13.5721 10.6123 13.5721 10.5C13.5721 10.3877 13.543 10.2771 13.4875 10.178C13.4319 10.079 13.3515 9.99463 13.2536 9.93239ZM9.28571 11.9531V9.05114L11.5696 10.5L9.28571 11.9531ZM19.4938 5.51591C19.4096 5.20172 19.2484 4.91112 19.0235 4.6681C18.7985 4.42507 18.5163 4.23659 18.2 4.11818C15.1393 2.98978 10.2679 3 10 3C9.73214 3 4.86071 2.98978 1.8 4.11818C1.48372 4.23659 1.20146 4.42507 0.976513 4.6681C0.751567 4.91112 0.59038 5.20172 0.50625 5.51591C0.275 6.36648 0 7.92103 0 10.5C0 13.079 0.275 14.6335 0.50625 15.4841C0.590254 15.7984 0.751384 16.0892 0.976338 16.3324C1.20129 16.5756 1.48361 16.7642 1.8 16.8827C4.73214 17.9625 9.32143 18 9.94107 18H10.0589C10.6786 18 15.2705 17.9625 18.2 16.8827C18.5164 16.7642 18.7987 16.5756 19.0237 16.3324C19.2486 16.0892 19.4097 15.7984 19.4938 15.4841C19.725 14.6318 20 13.079 20 10.5C20 7.92103 19.725 6.36648 19.4938 5.51591ZM18.1107 15.1466C18.0835 15.2512 18.0307 15.3481 17.9567 15.4294C17.8827 15.5107 17.7895 15.5742 17.6848 15.6145C14.8589 16.656 10.0527 16.6372 10.0063 16.6372H10C9.95179 16.6372 5.14911 16.6543 2.32143 15.6145C2.21676 15.5742 2.12359 15.5107 2.04956 15.4294C1.97553 15.3481 1.92275 15.2512 1.89554 15.1466C1.67857 14.3685 1.42857 12.9349 1.42857 10.5C1.42857 8.06506 1.67857 6.63154 1.88929 5.85767C1.91599 5.75249 1.96855 5.65488 2.0426 5.57292C2.11666 5.49097 2.2101 5.42702 2.31518 5.38637C5.04018 4.38154 9.60625 4.36364 9.98036 4.36364H10.0045C10.0527 4.36364 14.8598 4.3483 17.683 5.38637C17.7877 5.42669 17.8809 5.49012 17.9549 5.57145C18.0289 5.65278 18.0817 5.7497 18.1089 5.85426C18.3214 6.63154 18.5714 8.06506 18.5714 10.5C18.5714 12.9349 18.3214 14.3685 18.1107 15.1423V15.1466Z" fill="currentColor" />
  </svg>
);

function socialIconFor(label: string) {
  const key = label.trim().toLowerCase();
  if (key === 'facebook') return <FacebookIcon />;
  if (key === 'tiktok') return <TiktokIcon />;
  if (key === 'youtube') return <YoutubeIcon />;
  return <InstagramIcon />;
}

// ── Logos de plataforma e agência (os mesmos da origem, desenhados aqui) ──
// Mesmos paths, mesma caixa (`width`/`height`: 70×27 e 27 × 1888/566 ≈
// 90,06×27) e mesmo viewBox — o da agência guarda a folga do desenho original,
// 0 0 80 24. O texto da agência pinta com currentColor, a cor do texto do
// rodapé, como na origem.

/** Logo VTEX, na cor da marca. */
const VtexLogo = () => (
  <svg width="70" height="27" viewBox="0 0 304.60388 109.53113" role="img" aria-label="VTEX" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <g fill="#ff3366" fillRule="nonzero" transform="translate(-0.186108,-0.31959)">
      <path d="m 220.35,41.34 h -10.92 v 37.38 c -0.005,0.704658 -0.57534,1.274558 -1.28,1.28 h -8.41 c -0.70466,-0.0054 -1.27456,-0.575342 -1.28,-1.28 V 41.34 h -11 c -0.33306,0.01356 -0.65736,-0.108641 -0.89866,-0.338623 C 186.32005,40.771395 186.18243,40.453328 186.18,40.12 V 33.5 c 0.002,-0.333328 0.14005,-0.651395 0.38134,-0.881377 0.2413,-0.229982 0.5656,-0.352182 0.89866,-0.338623 h 32.87 c 0.70901,-0.03402 1.3123,0.511172 1.35,1.22 v 6.62 c -0.0377,0.700724 -0.62863,1.242773 -1.33,1.22 z" />
      <path d="m 255.37,79.75 c -4.30509,0.615781 -8.65146,0.896624 -13,0.84 -8.29,0 -15.61,-2.12 -15.61,-13.81 V 45.45 c 0,-11.69 7.39,-13.74 15.67,-13.74 4.31504,-0.05911 8.62812,0.218397 12.9,0.83 0.9,0.13 1.28,0.45 1.28,1.28 v 6 c -0.005,0.704658 -0.57534,1.274558 -1.28,1.28 h -13.5 c -3,0 -4.11,1 -4.11,4.37 v 5.84 h 17.14 c 0.70466,0.0054 1.27456,0.575342 1.28,1.28 v 6.1 c -0.005,0.704658 -0.57534,1.274558 -1.28,1.28 h -17.14 v 6.81 c 0,3.34 1.09,4.37 4.11,4.37 h 13.54 c 0.70466,0.0054 1.27456,0.575342 1.28,1.28 v 6 c 0.01,0.8 -0.38,1.19 -1.28,1.32 z" />
      <path d="m 303.83,80 h -10.21 c -0.71202,0.0529 -1.38046,-0.347368 -1.67,-1 l -8.86,-14 -8,13.74 c -0.45,0.77 -0.9,1.28 -1.61,1.28 H 264 c -0.24831,0.04452 -0.50356,-0.02356 -0.69672,-0.18581 C 263.11012,79.671935 262.99901,79.432264 263,79.18 c 0.0131,-0.157131 0.0573,-0.310094 0.13,-0.45 L 277.06,55.54 263,33.5 c -0.0725,-0.118382 -0.11698,-0.251786 -0.13,-0.39 0.0476,-0.506319 0.49306,-0.880511 1,-0.84 h 10.34 c 0.71,0 1.22,0.64 1.61,1.22 l 8.22,13 8,-13 c 0.28992,-0.657457 0.89863,-1.118721 1.61,-1.22 h 9.51 c 0.50694,-0.04051 0.9524,0.333681 1,0.84 -0.013,0.138214 -0.0575,0.271618 -0.13,0.39 l -14,22.17 14.57,23 c 0.11259,0.195504 0.17768,0.414728 0.19,0.64 -0.12,0.44 -0.45,0.69 -0.96,0.69 z" />
      <path d="m 170.8,32.41 c -0.47969,-0.01067 -0.89936,0.320862 -1,0.79 l -9.33,34.52 c -0.13,0.71 -0.32,1 -0.9,1 -0.58,0 -0.77,-0.26 -0.9,-1 l -9.3,-34.52 c -0.10064,-0.469138 -0.52031,-0.800674 -1,-0.79 h -9.18 c -0.30814,-0.0076 -0.60256,0.127382 -0.79796,0.36577 -0.1954,0.238388 -0.26995,0.553566 -0.20204,0.85423 0,0 11.39,39.57 11.51,40 1.52,4.72 5.21,7 9.9,7 4.49956,0.161453 8.55216,-2.704023 9.9,-7 0.18,-0.54 11.32,-40 11.32,-40 0.0643,-0.2992 -0.0119,-0.611392 -0.20682,-0.847296 C 180.41822,32.5468 180.12596,32.413159 179.82,32.42 Z" />
      <path d="M 118.77,0.32 H 23.05 C 19.586315,0.35166678 16.388901,2.1841531 14.61068,5.1567016 12.832459,8.12925 12.729906,11.813127 14.34,14.88 l 9.58,18.24 H 6.56 C 4.3421294,33.079643 2.2685207,34.216027 1.109161,36.107181 -0.05019865,37.998335 -0.12215931,40.361817 0.92,42.32 l 30.8,58.2 c 1.10523,2.09008 3.275685,3.39759 5.64,3.39759 2.364314,0 4.53477,-1.30751 5.64,-3.39759 l 8.36,-15.77 10.5,19.86 c 1.707211,3.22421 5.056702,5.24072 8.705,5.24072 3.648297,0 6.997789,-2.01651 8.705,-5.24072 l 48,-90.25 c 1.5893,-2.970574 1.49395,-6.5591519 -0.25085,-9.4411411 C 125.27436,2.0368696 122.13886,0.28884316 118.77,0.32 Z M 76,38.45 55,77.83 c -0.7215,1.360201 -2.13529,2.210648 -3.675,2.210648 -1.53971,0 -2.953501,-0.850447 -3.675,-2.210648 l -20.73,-39 C 26.280421,37.629796 26.317769,36.18196 27.018378,35.016327 27.718987,33.850695 28.980019,33.138359 30.34,33.14 h 42.42 c 1.27814,-0.01967 2.471383,0.638051 3.1372,1.729251 0.665817,1.0912 0.704917,2.453148 0.1028,3.580749 z" />
    </g>
  </svg>
);

/** Logo da agência: o texto na cor do rodapé, as duas barras na cor da marca. */
const AgencyLogo = () => (
  <svg width="90.0636" height="27" viewBox="0 0 80 24" role="img" aria-label="Série Design" focusable="false" xmlns="http://www.w3.org/2000/svg">
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
);

/** Plataforma e agência: fixos à direita, fora do conteúdo, como na origem. */
const PLATFORM_LOGOS = [
  { url: 'https://vtex.com/br-pt/overview-plataforma', Logo: VtexLogo },
  { url: 'https://seriea.com.br/', Logo: AgencyLogo },
];

export default function Footer06() {
  const wrapperRef = useRef<HTMLElement>(null);
  // A origem decide o accordion pela largura do PRÓPRIO rodapé, não pela viewport:
  // é o que vale também aqui, onde o canvas troca desktop/mobile por CSS.
  const [isMobile, setIsMobile] = useState(false);
  const [openIndex, setOpenIndex] = useState(-1);
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => setSubmitted(false), 2000);
    return () => clearTimeout(t);
  }, [submitted]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const check = (width: number) => setIsMobile(width < 768);
    const ro = new ResizeObserver(([entry]) => check(entry.contentRect.width));
    ro.observe(el);
    check(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const toggleColumn = (index: number) => {
    if (!isMobile) return;
    setOpenIndex(prev => (prev === index ? -1 : index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      nameRef.current?.setCustomValidity('Preencha seu nome.');
      nameRef.current?.reportValidity();
      return;
    }
    if (!email.trim()) return;
    // preview não faz rede: vai direto à confirmação que a origem mostra depois de gravar
    setSubmitted(true);
    setName('');
    setEmail('');
  };

  const renderSeal = (seal: Seal, i: number) =>
    seal.url ? (
      <a key={i} href={seal.url} target="_blank" rel="noopener noreferrer" data-role="seal">
        <img loading="lazy" src={seal.src} alt={seal.alt} width={seal.width} height={seal.height} />
      </a>
    ) : (
      <img key={i} loading="lazy" src={seal.src} alt={seal.alt} width={seal.width} height={seal.height} data-role="seal" />
    );

  return (
    <footer className={styles.footer} ref={wrapperRef} data-role="footer">
      {/* NEWSLETTER — a confirmação ocupa a faixa inteira por 2s, como na origem */}
      <div className={styles.newsletter} data-role="newsletter">
        {submitted ? (
          <p className={styles.nlSuccess} role="status" aria-live="polite" data-role="nl-success">
            {data.newsletterSuccessMessage}
          </p>
        ) : (
          <div className={styles.newsletterInner} data-role="nl-inner">
            <div className={styles.newsletterText} data-role="nl-text">
              <span data-role="nl-subtitle">{data.newsletterSubtitle}</span>
              <strong data-role="nl-title">{data.newsletterTitle}</strong>
            </div>
            <form className={styles.newsletterForm} data-role="nl-form" onSubmit={handleSubmit}>
              <input
                ref={nameRef}
                className={styles.field}
                data-role="nl-input"
                type="text"
                placeholder={data.newsletterNamePlaceholder}
                aria-label="Nome"
                value={name}
                onChange={e => {
                  e.target.setCustomValidity('');
                  setName(e.target.value);
                }}
                autoComplete="name"
                required
              />
              <input
                className={styles.field}
                data-role="nl-input"
                type="email"
                placeholder={data.newsletterEmailPlaceholder}
                aria-label="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <button type="submit" className={styles.newsletterBtn} data-role="nl-button">
                {data.newsletterButtonLabel}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* SOCIAL + COLUNAS */}
      <div className={styles.body} data-role="body">
        <div className={styles.social} data-role="social">
          <h3 data-role="social-title">{data.socialTitle}</h3>
          <div className={styles.socialLinks} data-role="social-links">
            {data.socials.map((label, i) => (
              <a
                key={i}
                href="#"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                data-role="social-link"
              >
                {socialIconFor(label)}
              </a>
            ))}
          </div>
        </div>

        <div className={styles.columns} data-role="columns">
          {data.columns.map((column, index) => {
            const open = openIndex === index;
            const groupClasses = [styles.group, open ? styles.groupOpen : '']
              .filter(Boolean)
              .join(' ');
            return (
              <div className={groupClasses} key={index} data-role="col">
                <button
                  type="button"
                  className={styles.groupTitle}
                  aria-expanded={isMobile ? open : undefined}
                  onClick={() => toggleColumn(index)}
                  data-role="col-title"
                >
                  {column.title}
                  <span className={styles.groupToggle} aria-hidden="true" data-role="col-toggle">
                    <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30.727 30.727">
                      <g>
                        <g>
                          <path d="M29.994,10.183L15.363,24.812L0.733,10.184c-0.977-0.978-0.977-2.561,0-3.536c0.977-0.977,2.559-0.976,3.536,0 l11.095,11.093L26.461,6.647c0.977-0.976,2.559-0.976,3.535,0C30.971,7.624,30.971,9.206,29.994,10.183z" />
                        </g>
                      </g>
                    </svg>
                  </span>
                </button>
                <div
                  className={styles.groupLinks}
                  aria-hidden={isMobile && !open ? true : undefined}
                  data-role="col-links"
                >
                  {column.text && (
                    <p className={styles.colText} data-role="col-text">
                      {column.text}
                    </p>
                  )}
                  {column.links.map((link, j) => (
                    <a
                      key={j}
                      href="#"
                      className={link.highlight ? styles.linkHighlight : undefined}
                      data-role="col-link"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BARRA INFERIOR: selos à esquerda · copyright ao centro · plataforma/agência à direita */}
      <div className={styles.bottom} data-role="bottom">
        <div className={styles.bottomInner} data-role="bottom-inner">
          <div className={styles.seals} data-role="seals">
            {data.seals.map((seal, i) => renderSeal(seal, i))}
          </div>
          <div className={styles.copyright} data-role="copyright">
            {data.copyright}
          </div>
          <div className={styles.platformLogos} data-role="platform-logos">
            {PLATFORM_LOGOS.map(({ url, Logo }) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" data-role="platform-logo">
                <Logo />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

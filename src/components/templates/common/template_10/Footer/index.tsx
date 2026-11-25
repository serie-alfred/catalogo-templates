import React, { useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/** Logo da agência (SÉRIE//A) — viewBox recortado no conteúdo; o aria-label fica no link. */
const AgencyLogo = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="6.5 3.9 67 13.9"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M28.0374 6.99414H33.1182C33.8851 6.99414 34.5498 7.07397 35.1124 7.23407C35.675 7.39416 36.1413 7.6256 36.5122 7.9288C36.8828 8.232 37.1587 8.60102 37.3398 9.03671C37.5208 9.47198 37.6115 9.965 37.6115 10.5158C37.6115 10.8873 37.5666 11.2402 37.4771 11.5753C37.3877 11.9103 37.2503 12.2186 37.0651 12.5006C36.8798 12.7821 36.6462 13.0331 36.3651 13.2531C36.0841 13.473 35.7538 13.6556 35.3744 13.8004L37.5475 17.0019H35.0679L33.189 14.1589H33.1314L30.0638 14.1525V17.0019H28.0378V6.99414H28.0374ZM33.1695 12.3982C33.5532 12.3982 33.8885 12.3532 34.1764 12.2636C34.4638 12.174 34.7046 12.0483 34.8987 11.8857C35.0925 11.7235 35.2375 11.526 35.3333 11.2933C35.4291 11.0606 35.477 10.8016 35.477 10.5153C35.477 9.95608 35.2854 9.52379 34.9017 9.21889C34.5181 8.91356 33.9407 8.76111 33.1695 8.76111H30.0633V12.3978H33.1695V12.3982Z"
    />
    <path fill="currentColor" d="M38.6307 7H40.6694V17.0048H38.6307V7Z" />
    <path
      fill="currentColor"
      d="M18.3717 6.98773H27.0183V8.76914H20.399V10.768H26.142V12.4402H20.399V15.2272H27.0183V17.0018H18.3717V6.9873V6.98773Z"
    />
    <path
      fill="currentColor"
      d="M41.6885 6.99902H50.3351V8.77831H43.7157V10.775H49.4588V12.4456H43.7157V15.2296H50.3351V17.0025H41.6885V6.99945V6.99902Z"
    />
    <path
      fill="currentColor"
      d="M20.8033 5.36388L24.2949 4.41309L24.6467 5.7002L21.1149 6.49515L20.8033 5.36388Z"
    />
    <path
      fill="currentColor"
      d="M17.3521 14.1947C17.3521 15.1727 16.8985 15.9417 16.0044 16.4819C15.1515 16.9974 13.9416 17.2573 12.4078 17.2573C9.07903 17.2573 7.26586 16.1477 7.02125 13.9543L6.99158 13.6826H9.21215L9.25497 13.8736C9.37325 14.4023 9.67085 14.7824 10.1639 15.0393C10.6815 15.3094 11.4412 15.4461 12.4226 15.4461C13.3184 15.4461 14.009 15.326 14.474 15.0856C14.898 14.8682 15.0955 14.5849 15.0955 14.1947C15.0955 13.8736 14.9688 13.6397 14.6945 13.4571C14.3871 13.2511 13.8742 13.1016 13.1675 13.0078L11.3691 12.7543C9.92606 12.5598 8.91667 12.2387 8.28373 11.7746C7.62621 11.2922 7.29257 10.5924 7.29257 9.69338C7.29257 8.7944 7.75297 8.01898 8.65849 7.49836C9.52162 7.00279 10.7248 6.75098 12.2369 6.75098C13.6126 6.75098 14.6996 6.965 15.4652 7.38965C16.2524 7.82449 16.7968 8.52559 17.0825 9.47596L17.1253 9.65516C17.1444 9.73585 17.1597 9.81738 17.1707 9.89934L17.1957 10.0836L15.0476 10.0556L14.9739 9.88618C14.7653 9.41057 14.4643 9.08104 14.0535 8.87848C13.6313 8.66785 13.0149 8.56254 12.2225 8.56254C11.3217 8.56254 10.623 8.67295 10.1448 8.88867C9.72384 9.07806 9.52035 9.32818 9.52035 9.65432C9.52035 9.98045 9.64033 10.2076 9.9002 10.3673C10.2012 10.5533 10.7616 10.7096 11.5688 10.8285L13.5923 11.1083C14.8479 11.2829 15.7916 11.6171 16.3983 12.1012C17.0312 12.6065 17.3534 13.3114 17.3534 14.1955L17.3521 14.1947Z"
    />
    <path
      fill="currentColor"
      d="M66.0343 7H68.182L73.0149 17.0001H70.8863L70.0872 15.3176H64.2513L63.4776 17.0001H61.3427L66.0343 7ZM69.2881 13.6475L67.1277 9.10499L65.0245 13.6475H69.2881Z"
    />
    <path
      fill="#97D700"
      d="M63.4597 7L58.7671 17.0027H56.4681L61.1488 7H63.4597Z"
    />
    <path
      fill="#E63888"
      d="M58.6002 7L53.9076 17.0035H51.6086L56.2893 7H58.6002Z"
    />
  </svg>
);

/** Crédito padrão da agência na faixa legal: conteúdo fixo. */
const Credit = () => (
  <a
    className={styles.credit}
    href="https://seriea.com.br/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Desenvolvido por SÉRIE//A (abre em nova aba)"
  >
    <span>Desenvolvido por:</span>
    <AgencyLogo className={styles.creditLogo} />
  </a>
);

/**
 * Espelha `organisms/Footer10` do faststore.starter (família 10, Varejo; desenho
 * `Footer10` / `Footer10-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e
 * as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Faixa de atendimento em cartões, colunas de links + "Baixe o app" com os selos e as
 * redes, formas de pagamento e selos de segurança em etiquetas, e a faixa legal.
 * Mobile: cartões 2 × 2 sem o texto de apoio e colunas em acordeão (a primeira aberta).
 *
 * Conteúdo: o MOCK abaixo por baixo do que o CS subir (`useConteudoDaSecao`, campos
 * do schema de lá).
 *
 * Sem divergência deliberada: o rodapé de lá não tem logo nem dado dinâmico.
 */

type Footer10Social = 'youtube' | 'instagram' | 'x' | 'linkedin' | 'facebook';
type Footer10Payment =
  | 'visa'
  | 'mastercard'
  | 'diners'
  | 'hipercard'
  | 'elo'
  | 'amex'
  | 'aura'
  | 'boleto'
  | 'pix';
type Footer10ServiceIcon = 'help' | 'whatsapp' | 'email' | 'store';

interface Footer10Badge {
  /** Imagem do selo. Vazio: o rótulo em texto. */
  image?: string;
  label?: string;
  url?: string;
}

/** O conteúdo da seção: os campos do `section.schema` do Footer10. */
interface Footer10Conteudo {
  serviceCards: {
    icon?: Footer10ServiceIcon;
    title?: string;
    text?: string;
    url?: string;
  }[];
  columns: { title?: string; links?: { label?: string; url?: string }[] }[];
  appTitle?: string;
  appText?: string;
  appBadges: Footer10Badge[];
  socials: { network?: Footer10Social; url?: string }[];
  paymentsTitle?: string;
  payments: { method?: Footer10Payment }[];
  securityTitle?: string;
  seals: Footer10Badge[];
  legalLines: { text?: string }[];
}

const ROTULO_REDE: Record<Footer10Social, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  x: 'X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

const ROTULO_PAGAMENTO: Record<Footer10Payment, string> = {
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

const svg = (w: number, sw: string, children: React.ReactNode) => (
  <svg
    width={w}
    height={w}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={sw}
    aria-hidden="true"
  >
    {children}
  </svg>
);

// Os pontos do "?" e do "i" do LinkedIn são traços de 0,01: com a ponta padrão
// do SVG (`butt`) não desenham nada. Por isso a ponta redonda nesses dois.
const ICONE_SERVICO: Record<Footer10ServiceIcon, React.ReactNode> = {
  help: svg(
    22,
    '1.8',
    <g strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14" />
      <path d="M12 17h.01" />
    </g>
  ),
  whatsapp: svg(22, '1.8', <path d="M4 20l1.3-4A8 8 0 1 1 8 19z" />),
  email: svg(
    22,
    '1.8',
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  store: svg(
    22,
    '1.8',
    <>
      <path d="M4 9 5 4h14l1 5" />
      <path d="M4 9h16v11H4z" />
      <path d="M9 20v-6h6v6" />
    </>
  ),
};

const ICONE_REDE: Record<Footer10Social, React.ReactNode> = {
  instagram: svg(
    20,
    '1.8',
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" />
    </>
  ),
  facebook: svg(
    20,
    '1.8',
    <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" />
  ),
  youtube: svg(
    20,
    '1.8',
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
      <path d="m10 9.5 5 2.5-5 2.5z" />
    </>
  ),
  x: svg(18, '1.8', <path d="M4 4l16 16M20 4 4 20" />),
  linkedin: svg(
    20,
    '1.8',
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path
        d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"
        strokeLinecap="round"
      />
    </>
  ),
};

const Sinal = ({ aberto }: { aberto: boolean }) =>
  svg(18, '2', <path d={aberto ? 'M5 12h14' : 'M12 5v14M5 12h14'} />);

function Selo({
  badge,
  className,
}: {
  badge: Footer10Badge;
  className: string;
}) {
  const conteudo = badge.image ? (
    <img src={badge.image} alt={badge.label ?? ''} height={44} loading="lazy" />
  ) : (
    badge.label
  );
  return badge.url ? (
    <a
      className={className}
      href={badge.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {conteudo}
    </a>
  ) : (
    <span className={className}>{conteudo}</span>
  );
}

// Conteúdo do mock.ts do starter (colchetes são do desenho: a loja preenche).
const MOCK: Footer10Conteudo = {
  serviceCards: [
    {
      icon: 'help',
      title: 'Central de ajuda',
      text: 'Dúvidas, trocas e devoluções',
      url: '/ajuda',
    },
    {
      icon: 'whatsapp',
      title: 'WhatsApp',
      text: '[00 00000-0000]',
      url: 'https://wa.me/0000000000000',
    },
    {
      icon: 'email',
      title: 'E-mail',
      text: '[atendimento@suamarca.com.br]',
      url: 'mailto:atendimento@suamarca.com.br',
    },
    {
      icon: 'store',
      title: 'Lojas físicas',
      text: 'Encontre a mais perto de você',
      url: '/lojas',
    },
  ],
  columns: [
    {
      title: 'Institucional',
      links: [
        { label: 'Sobre a [Sua Marca]', url: '/institucional/sobre' },
        { label: 'Trabalhe conosco', url: '/institucional/trabalhe-conosco' },
        { label: 'Venda conosco', url: '/venda-conosco' },
        { label: 'Política de privacidade', url: '/institucional/privacidade' },
        { label: 'Termos de uso', url: '/institucional/termos' },
      ],
    },
    {
      title: 'Ajuda',
      links: [
        { label: 'Acompanhe seu pedido', url: '/account/orders' },
        { label: 'Trocas e devoluções', url: '/ajuda/trocas' },
        { label: 'Prazos de entrega', url: '/ajuda/entrega' },
        { label: 'Formas de pagamento', url: '/ajuda/pagamento' },
        { label: 'Perguntas frequentes', url: '/ajuda/faq' },
      ],
    },
    {
      title: 'Departamentos',
      links: [
        { label: 'Celulares', url: '/celulares' },
        { label: 'Informática', url: '/informatica' },
        { label: 'TV e Vídeo', url: '/tv-e-video' },
        { label: 'Eletrodomésticos', url: '/eletrodomesticos' },
        { label: 'Casa e Cozinha', url: '/casa' },
      ],
    },
    {
      title: 'Minha conta',
      links: [
        { label: 'Entrar', url: '/login' },
        { label: 'Meus pedidos', url: '/account/orders' },
        { label: 'Favoritos', url: '/wishlist' },
        { label: 'Endereços', url: '/account/addresses' },
      ],
    },
  ],
  appTitle: 'Baixe o app',
  appText: 'Ofertas exclusivas e 10% OFF na 1ª compra pelo app.',
  appBadges: [
    { label: '[Selo loja iOS]', url: '#' },
    { label: '[Selo loja Android]', url: '#' },
  ],
  socials: [
    { network: 'instagram', url: 'https://instagram.com/' },
    { network: 'facebook', url: 'https://facebook.com/' },
    { network: 'youtube', url: 'https://youtube.com/' },
    { network: 'x', url: 'https://x.com/' },
  ],
  paymentsTitle: 'Formas de pagamento',
  payments: [
    { method: 'visa' },
    { method: 'mastercard' },
    { method: 'elo' },
    { method: 'amex' },
    { method: 'hipercard' },
    { method: 'pix' },
    { method: 'boleto' },
  ],
  securityTitle: 'Segurança',
  seals: [{ label: '[Selo de site seguro]' }, { label: '[Selo de reputação]' }],
  legalLines: [
    {
      text: '© 2026 [SUA MARCA] · [RAZÃO SOCIAL] · CNPJ [00.000.000/0001-00] · [Endereço completo]',
    },
    {
      text: 'Preços e condições válidos para compras no site, sujeitos à disponibilidade de estoque.',
    },
  ],
};

export default function Footer10() {
  const {
    serviceCards,
    columns,
    appTitle,
    appText,
    appBadges,
    socials,
    paymentsTitle,
    payments,
    securityTitle,
    seals,
    legalLines,
  } = useConteudoDaSecao(MOCK);
  const [aberta, setAberta] = useState<number | null>(0);

  const redes = socials.filter(
    s => s.network && ROTULO_REDE[s.network] && s.url
  );
  const pagamentos = payments.filter(
    p => p.method && ROTULO_PAGAMENTO[p.method]
  );
  const selos = appBadges.filter(b => b.image || b.label);
  const seguranca = seals.filter(b => b.image || b.label);
  const legais = legalLines.filter(l => l.text);
  const temApp = !!(appTitle || appText || selos.length || redes.length);

  return (
    <div className={styles.footer10Box}>
      <footer className={styles.footer10} data-role="ft-root">
        <link rel="stylesheet" href={FONTES_10} />

        {serviceCards.length > 0 && (
          <div className={styles.services} data-role="ft-services">
            <div className={styles.servicesInner}>
              {serviceCards.map((c, i) => {
                const conteudo = (
                  <>
                    {c.icon && ICONE_SERVICO[c.icon] && (
                      <span className={styles.serviceIcon}>
                        {ICONE_SERVICO[c.icon]}
                      </span>
                    )}
                    <span className={styles.serviceBody}>
                      <span className={styles.serviceTitle}>{c.title}</span>
                      {c.text && (
                        <span className={styles.serviceText}>{c.text}</span>
                      )}
                    </span>
                  </>
                );
                return c.url ? (
                  <a
                    key={i}
                    className={styles.service}
                    href={c.url}
                    data-role="ft-service"
                  >
                    {conteudo}
                  </a>
                ) : (
                  <div
                    key={i}
                    className={styles.service}
                    data-role="ft-service"
                  >
                    {conteudo}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className={styles.main}>
          {columns.map((col, i) => {
            const id = `ft10-col-${i}`;
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
                        className={styles.link}
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

          {temApp && (
            <div className={styles.app} data-role="ft-app">
              {appTitle && <h2 className={styles.appTitle}>{appTitle}</h2>}
              {appText && <p className={styles.appText}>{appText}</p>}
              {selos.length > 0 && (
                <div className={styles.appBadges}>
                  {selos.map((b, i) => (
                    <Selo key={i} badge={b} className={styles.appBadge} />
                  ))}
                </div>
              )}
              {redes.length > 0 && (
                <div className={styles.socials}>
                  {redes.map((s, i) => (
                    <a
                      key={i}
                      className={styles.social}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={ROTULO_REDE[s.network as Footer10Social]}
                      data-role="ft-social"
                    >
                      {ICONE_REDE[s.network as Footer10Social]}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {(pagamentos.length > 0 || seguranca.length > 0) && (
          <div className={styles.bottom}>
            {pagamentos.length > 0 && (
              <div className={styles.group}>
                {paymentsTitle && (
                  <h2 className={styles.groupTitle}>{paymentsTitle}</h2>
                )}
                <ul
                  className={styles.chips}
                  aria-label={paymentsTitle || 'Formas de pagamento'}
                  data-role="ft-payments"
                >
                  {pagamentos.map((p, i) => (
                    <li key={i} className={styles.chip}>
                      {ROTULO_PAGAMENTO[p.method as Footer10Payment]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {seguranca.length > 0 && (
              <div className={styles.group}>
                {securityTitle && (
                  <h2 className={styles.groupTitle}>{securityTitle}</h2>
                )}
                <div className={styles.chips} data-role="ft-seals">
                  {seguranca.map((b, i) => (
                    <Selo
                      key={i}
                      badge={b}
                      className={b.image ? styles.sealImage : styles.chip}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styles.legal} data-role="ft-legal">
          <div className={styles.legalInner}>
            {legais.map((l, i) => (
              <span key={i}>{l.text}</span>
            ))}
            <Credit />
          </div>
        </div>
      </footer>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Footer10.conteudoPadrao = MOCK;

import React, { useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer10` do faststore.starter (família 10, Varejo; desenho
 * `Footer10` / `Footer10-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e
 * as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Faixa de atendimento em cartões, colunas de links + "Baixe o app" com os selos e as
 * redes, formas de pagamento e selos de segurança em etiquetas, e a faixa legal.
 * Mobile: cartões 2 × 2 sem o texto de apoio e colunas em acordeão (a primeira aberta).
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

interface Footer10Props {
  serviceCards?: {
    icon?: Footer10ServiceIcon;
    title?: string;
    text?: string;
    url?: string;
  }[];
  columns?: { title?: string; links?: { label?: string; url?: string }[] }[];
  appTitle?: string;
  appText?: string;
  appBadges?: Footer10Badge[];
  socials?: { network?: Footer10Social; url?: string }[];
  paymentsTitle?: string;
  payments?: { method?: Footer10Payment }[];
  securityTitle?: string;
  seals?: Footer10Badge[];
  legalLines?: { text?: string }[];
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
const MOCK: Footer10Props = {
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
    serviceCards = [],
    columns = [],
    appTitle,
    appText,
    appBadges = [],
    socials = [],
    paymentsTitle,
    payments = [],
    securityTitle,
    seals = [],
    legalLines = [],
  } = MOCK;
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

        {legais.length > 0 && (
          <div className={styles.legal} data-role="ft-legal">
            <div className={styles.legalInner}>
              {legais.map((l, i) => (
                <span key={i}>{l.text}</span>
              ))}
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}

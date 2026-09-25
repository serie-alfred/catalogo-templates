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
 * - os logos de plataforma e da agência são os mesmos, servidos daqui
 *   (`public/images/footer/platform/`), na caixa da origem (70×27 e 1888×566);
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

/** Plataforma e agência: fixos à direita, fora do conteúdo, como na origem. */
const PLATFORM_LOGOS: Seal[] = [
  {
    src: '/images/footer/platform/vtex.svg',
    alt: 'VTEX',
    url: 'https://vtex.com/br-pt/overview-plataforma',
    width: 70,
    height: 27,
  },
  {
    src: '/images/footer/platform/agency.svg',
    alt: 'Série Design',
    url: 'https://seriea.com.br/',
    width: 1888,
    height: 566,
  },
];

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

  // `role` é o `data-role` do item: selo à esquerda, logo de plataforma à direita
  const renderSeal = (seal: Seal, i: number, role: string) =>
    seal.url ? (
      <a key={i} href={seal.url} target="_blank" rel="noopener noreferrer" data-role={role}>
        <img loading="lazy" src={seal.src} alt={seal.alt} width={seal.width} height={seal.height} />
      </a>
    ) : (
      <img key={i} loading="lazy" src={seal.src} alt={seal.alt} width={seal.width} height={seal.height} data-role={role} />
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
            {data.seals.map((seal, i) => renderSeal(seal, i, 'seal'))}
          </div>
          <div className={styles.copyright} data-role="copyright">
            {data.copyright}
          </div>
          <div className={styles.platformLogos} data-role="platform-logos">
            {PLATFORM_LOGOS.map((logo, i) => renderSeal(logo, i, 'platform-logo'))}
          </div>
        </div>
      </div>
    </footer>
  );
}

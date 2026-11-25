'use client';

import React, { useState, type SyntheticEvent } from 'react';

import styles from './index.module.css';
import { useLogoDoRodape } from '@/hooks/useLogoDoRodape';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

/** Crédito padrão da agência (bloco "Desenvolvido por: SÉRIE//A"). Conteúdo fixo, fora do CMS. */
const Credit = () => (
  <a
    className={styles.credit}
    href="https://seriea.com.br/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Desenvolvido por SÉRIE//A (abre em nova aba)"
  >
    <span>Desenvolvido por:</span>
    <svg
      className={styles.creditLogo}
      viewBox="6.5 3.9 67 13.9"
      aria-hidden="true"
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
  </a>
)

/**
 * O par +/− do acordeão de coluna do rodapé.
 *
 * Estavam 34 linhas de SVG repetidas literalmente nas QUATRO colunas — 136 das
 * 611 linhas do arquivo. Fica local, e não num `_shared/`, porque o sufixo `03`
 * é uma ilha: um sub-componente compartilhado entre sufixos faria o gerador
 * deixar arquivo para trás ao montar um tema que use só um deles.
 *
 * Quem alterna a visibilidade é o CSS, pelo `[open]` do `<details>` — por isso
 * os dois convivem no DOM e nenhum recebe estado.
 */
const ColChevron = () => (
  <div className={styles.colChev}>
    <svg
      className={styles.plusIcon}
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>

    <svg
      className={styles.minusIcon}
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  </div>
);

/** Os ícones que o campo `icon` dos benefícios aceita (os que a réplica desenha). */
const ICONES_DE_BENEFICIO: Record<string, React.ReactNode> = {
  truck: (
    <svg viewBox="0 0 24 24">
        <path d="M3 7h11v8H3z" />
        <path d="M14 10h4l3 3v2h-7" />
        <circle cx="7" cy="17.5" r="1.6" />
        <circle cx="17" cy="17.5" r="1.6" />
    </svg>
  ),
  return: (
    <svg viewBox="0 0 24 24">
        <path d="M4 11a8 8 0 0 1 14-5.3" />
        <path d="M18 3v4h-4" />
        <path d="M20 13a8 8 0 0 1-14 5.3" />
        <path d="M6 21v-4h4" />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24">
        <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
        <path d="m9.5 12.2 1.8 1.8 3.5-3.7" />
    </svg>
  ),
  headset: (
    <svg viewBox="0 0 24 24">
        <path d="M4 13a8 8 0 0 1 16 0v3a3 3 0 0 1-3 3h-1v-6h4" />
        <path d="M4 13v3a3 3 0 0 0 3 3h1v-6H4" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24">
        <path d="M5 5h14v14H5z" />
        <path d="M3 9h18" />
        <path d="M9 3v4" />
        <path d="M15 3v4" />
        <path d="m12 13 1.2 2.5 2.8.4-2 2 .5 2.7-2.5-1.3-2.5 1.3.5-2.7-2-2 2.8-.4Z" />
    </svg>
  ),
};

/** O conteúdo da seção: os campos do `section.schema` do Footer03 que a réplica desenha. */
interface Footer03Conteudo {
  brandName?: string;
  brandDescription?: string;
  socialInstagram?: string;
  socialTiktok?: string;
  socialYoutube?: string;
  socialPinterest?: string;
  benefits: { icon?: string; title?: string; subtitle?: string }[];
  institucionalTitle?: string;
  institucionalMenu: { name?: string; url?: string }[];
  atendimentoTitle?: string;
  atendimentoMenu: { name?: string; url?: string }[];
  categoriasTitle?: string;
  categoriasMenu: { name?: string; url?: string; isHighlight?: boolean }[];
  policiesTitle?: string;
  policiesMenu: { name?: string; url?: string }[];
  newsletterEyebrow?: string;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  paymentMethods: { label?: string; isHighlight?: boolean }[];
  copyright?: string;
  cnpj?: string;
  newsletterButtonLabel?: string;
  newsletterSuccessTitle?: string;
  newsletterSuccessText?: string;
  pagamentoTitle?: string;
  selo1Label?: string;
  selo2Label?: string;
  selo3Label?: string;
}

const L = (name: string): { name: string; url: string } => ({ name, url: '#' });

const MOCK: Footer03Conteudo = {
  brandDescription:
    'Moda masculina streetwear com estética urbana, acabamento premium e atitude contemporânea. Feita em pequenas tiragens, em São\u00a0Paulo.',
  socialInstagram: '#',
  socialTiktok: '#',
  socialYoutube: '#',
  socialPinterest: '#',
  benefits: [
    { icon: 'truck', title: 'Frete grátis acima de R$ 350', subtitle: 'Para todo o Brasil, em compras à vista ou em até 6×.' },
    { icon: 'return', title: 'Troca fácil em 30 dias', subtitle: 'Devolução simples e rápida em qualquer Correios.' },
    { icon: 'shield', title: 'Compra 100% segura', subtitle: 'Criptografia SSL, dados protegidos e antifraude.' },
    { icon: 'headset', title: 'Atendimento especializado', subtitle: 'Time fluente em fits, tamanhos e novos drops.' },
    { icon: 'calendar', title: 'Drops toda semana', subtitle: 'Coleções limitadas, todas as quintas, às 19h.' },
  ],
  institucionalTitle: 'Institucional',
  institucionalMenu: ['Sobre a marca', 'Nossa história', 'Lojas e showroom', 'Trabalhe conosco', 'Blog · Diário BRAND', 'Imprensa', 'Sustentabilidade'].map(L),
  atendimentoTitle: 'Atendimento',
  atendimentoMenu: ['Central de atendimento', 'Trocas e devoluções', 'Política de entrega', 'Dúvidas frequentes', 'Rastrear pedido', 'Guia de tamanhos', 'Fale conosco'].map(L),
  categoriasTitle: 'Categorias',
  categoriasMenu: [
    ...['Novidades', 'Camisetas', 'Moletons', 'Calças', 'Jaquetas', 'Acessórios'].map(L),
    { name: 'Sale', url: '#', isHighlight: true },
  ],
  policiesTitle: 'Políticas',
  policiesMenu: ['Política de privacidade', 'Termos de uso', 'Política de cookies', 'Política de troca', 'LGPD'].map(L),
  newsletterEyebrow: 'Newsletter',
  newsletterTitle: 'Fique por dentro dos novos drops',
  newsletterSubtitle:
    'Receba lançamentos, ofertas exclusivas e novidades da marca em primeira mão — todas as quintas, antes de irem ao ar.',
  paymentMethods: [
    { label: 'VISA' },
    { label: 'MASTERCARD' },
    { label: 'AMEX' },
    { label: 'ELO' },
    { label: 'HIPER' },
    { label: 'PIX', isHighlight: true },
    { label: 'BOLETO' },
  ],
  copyright: '© 2026 BRAND. Todos os direitos reservados.',
  // Só marcadores para a loja preencher: nada de razão social, CNPJ ou endereço inventados.
  cnpj: '[RAZÃO SOCIAL] · CNPJ [00.000.000/0001-00] · [Endereço completo]',
  newsletterButtonLabel: 'Cadastrar',
  newsletterSuccessTitle: 'Pronto.',
  newsletterSuccessText: 'Você está na lista do próximo drop.',
  pagamentoTitle: 'Pagamento',
  selo1Label: 'SSL · Certificado',
  selo2Label: 'Compra protegida',
  selo3Label: 'Pagamento criptografado',
};

const FooterNovo = () => {
  const logo = useLogoDoRodape();
  const {
    brandName, brandDescription, socialInstagram, socialTiktok, socialYoutube, socialPinterest,
    benefits, institucionalTitle, institucionalMenu, atendimentoTitle, atendimentoMenu,
    categoriasTitle, categoriasMenu, policiesTitle, policiesMenu,
    newsletterEyebrow, newsletterTitle, newsletterSubtitle, paymentMethods,
    copyright, cnpj, newsletterButtonLabel, newsletterSuccessTitle, newsletterSuccessText,
    pagamentoTitle, selo1Label, selo2Label, selo3Label,
  } = useConteudoDaSecao(MOCK);
  const [open, setOpen] = useState<Record<string, boolean>>({
    institucional: true,
    atendimento: true,
    categorias: true,
    politicas: true,
  });
  // `e.currentTarget` só é válido DURANTE o disparo do evento: o React o zera
  // assim que o handler retorna. Lendo dentro do updater do setOpen — que roda
  // depois, na fase de render — dava "e.currentTarget is null". A captura
  // síncrona abaixo guarda o valor enquanto o evento ainda está vivo.
  const handleToggle =
    (key: string) => (e: SyntheticEvent<HTMLDetailsElement>) => {
      const isOpen = e.currentTarget.open;

      setOpen(s => ({ ...s, [key]: isOpen }));
    };

  return (
    <footer className={styles.siteFooter} role="contentinfo">
      <section className={styles.benefits} aria-label="Benefícios da loja">
        <div className={styles.benefitsInner}>
          {benefits.map((b, i) => (
            <article key={i} className={styles.benefit}>
              {b.icon && ICONES_DE_BENEFICIO[b.icon] && (
                <span className={styles.benefitIcon}>
                  {ICONES_DE_BENEFICIO[b.icon]}
                </span>
              )}
              <div>
                {b.title && <p className={styles.benefitTitle}>{b.title}</p>}
                {b.subtitle && <p className={styles.benefitSub}>{b.subtitle}</p>}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.footerMain}>
        <div className={styles.footerMainInner}>
          <div className={styles.footerBrand}>
            <a href="#" className={styles.brandLogo}>
              {logo ? (
                <img src={logo} alt="Logo" className={styles.brandLogoImg} />
              ) : brandName ? (
                brandName
              ) : (
                <>
                  SERIE<span>{'//'}</span>A
                </>
              )}
            </a>
            {brandDescription && <p>{brandDescription}</p>}
            <div className={styles.socials} aria-label="Redes sociais">
              {socialInstagram && (
              <a href={socialInstagram} aria-label="Instagram">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17"
                    cy="7"
                    r=".9"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>
              )}
              {socialTiktok && (
              <a href={socialTiktok} aria-label="TikTok">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5" />
                  <path d="M14 4c.4 2.5 2.4 4.3 5 4.5" />
                </svg>
              </a>
              )}
              {socialYoutube && (
              <a href={socialYoutube} aria-label="YouTube">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="6" width="18" height="12" rx="3" />
                  <path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" />
                </svg>
              </a>
              )}
              {socialPinterest && (
              <a href={socialPinterest} aria-label="Pinterest">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M11 8c2 0 3.5 1.3 3.5 3.3 0 2.4-1.6 4.2-3.4 4.2-1 0-1.7-.5-2-1.2" />
                  <path d="M10.6 12 9 21" />
                </svg>
              </a>
              )}
            </div>
          </div>

          <details
            className={styles.col}
            open={open.institucional}
            onToggle={handleToggle('institucional')}
          >
            <summary className={styles.colHead}>
              <span>{institucionalTitle}</span>
              <ColChevron />
            </summary>

            <ul className={styles.colList}>
              {institucionalMenu.map((item, i) => (
                <li key={i}>
                  <a href={item.url || '#'}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <details
            className={styles.col}
            open={open.atendimento}
            onToggle={handleToggle('atendimento')}
          >
            <summary className={styles.colHead}>
              <span>{atendimentoTitle}</span>
              <ColChevron />
            </summary>
            <ul className={styles.colList}>
              {atendimentoMenu.map((item, i) => (
                <li key={i}>
                  <a href={item.url || '#'}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <details
            className={styles.col}
            open={open.categorias}
            onToggle={handleToggle('categorias')}
          >
            <summary className={styles.colHead}>
              <span>{categoriasTitle}</span>
              <ColChevron />
            </summary>
            <ul className={styles.colList}>
              {categoriasMenu.map((item, i) => (
                <li key={i}>
                  <a href={item.url || '#'}
                    className={item.isHighlight ? styles.colSale : undefined}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <details
            className={`${styles.col} ${styles.colPolicies}`}
            open={open.politicas}
            onToggle={handleToggle('politicas')}
          >
            <summary className={styles.colHead}>
              <span>{policiesTitle}</span>
              <ColChevron />
            </summary>
            <ul className={styles.colList}>
              {policiesMenu.map((item, i) => (
                <li key={i}>
                  <a href={item.url || '#'}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          <div className={styles.nl}>
            {newsletterEyebrow && <p className={styles.nlEyebrow}>{newsletterEyebrow}</p>}
            {newsletterTitle && <h3 className={styles.nlTitle}>{newsletterTitle}</h3>}
            {newsletterSubtitle && <p className={styles.nlSub}>{newsletterSubtitle}</p>}
            <form className={styles.nlForm} id="nl-form">
              <input
                className={styles.nlInput}
                id="nl-input"
                type="email"
                placeholder="Seu e-mail"
                autoComplete="email"
                required
              />
              <button type="submit" className={styles.nlBtn}>
                <p>{newsletterButtonLabel}</p>
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </button>
            </form>
            <div
              className={styles.nlSuccess}
              id="nl-success"
              role="status"
              aria-live="polite"
            >
              <svg viewBox="0 0 24 24">
                <path d="M5 12.5 10 17l9-9.5" />
              </svg>
              <span className={styles.nlSuccessTxt}>
                <b>{newsletterSuccessTitle}</b> {newsletterSuccessText}
              </span>
            </div>
            <p className={styles.nlLegal}>
              Ao se cadastrar, você concorda com nossa{' '}
              <a href="#">Política de Privacidade</a> e com receber comunicações
              da BRAND.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.trust}>
        <div className={styles.trustInner}>
          <div className={styles.trustGroup}>
            <span className={styles.trustLabel}>{pagamentoTitle}</span>
            <div className={styles.payRow}>
              {paymentMethods
                .filter(m => m.label)
                .map((m, i) => (
                  <span key={i} className={styles.payChip}>
                    {(m.label ?? '').toUpperCase().startsWith('MASTER') ? (
                      <svg viewBox="0 0 30 18" width="22" height="13">
                        <circle cx="11" cy="9" r="6" fill="#000" />
                        <circle cx="19" cy="9" r="6" fill="#e73888" opacity=".95" />
                        <path
                          d="M15 4.6a6 6 0 0 1 0 8.8 6 6 0 0 1 0-8.8Z"
                          fill="#000"
                          opacity=".6"
                        />
                      </svg>
                    ) : (
                      <span
                        className={`${styles.payChipLbl} ${m.isHighlight ? styles.payChipLblRose : ''}`}
                      >
                        {m.label}
                      </span>
                    )}
                  </span>
                ))}
            </div>
          </div>
          <div className={styles.secRow}>
            <span className={styles.secRowCell}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5" y="10" width="14" height="9" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              {selo1Label}
            </span>
            <span className={styles.secRowCell}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
                <path d="m9.5 12.2 1.8 1.8 3.5-3.7" />
              </svg>
              {selo2Label}
            </span>
            <span className={styles.secRowCell}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3.5" y="5" width="17" height="11" rx="2" />
                <path d="M3.5 9h17" />
                <path d="M7 13h3" />
              </svg>
              {selo3Label}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.legal}>
        <div className={styles.legalInner}>
          {copyright && <span className={styles.legalBrand}>{copyright}</span>}
          {/* Só marcadores para a loja preencher: nada de razão social, CNPJ ou endereço
              inventados (o mesmo texto do ft03_legal da Wake). */}
          {cnpj && <span className={styles.legalCnpj}>{cnpj}</span>}
          <Credit />
        </div>
      </section>
    </footer>
  );
};

export default FooterNovo;

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
FooterNovo.conteudoPadrao = MOCK;

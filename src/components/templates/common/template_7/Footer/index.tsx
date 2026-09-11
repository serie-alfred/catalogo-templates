'use client';

import React, { useState } from 'react';

import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/**
 * Espelha `organisms/Footer07` do faststore.starter — footer institucional
 * escuro da Brasilusa, com duas artes distintas do design (bloco desktop ≥768 e
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

const conteudo = {
  brandTagline: 'casa · conforto · estilo',
  brandDescription:
    'Curadoria de produtos têxteis e de decoração para transformar cada ambiente da sua casa.',
  nlEyebrow: 'Clube VIP Brasilusa',
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
        </div>
      </footer>
    </div>
  );
}

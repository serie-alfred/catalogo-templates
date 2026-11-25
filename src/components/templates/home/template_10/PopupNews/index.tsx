import React, { useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/PopupNews10` do faststore.starter (família 10, Varejo; desenho
 * `PopupNews10` / `PopupNews10-mobile`). Mesmo markup, mesmas classes, mesmos
 * `data-role`; o CSS é derivado do SCSS de lá, com o @media (overlay fixo).
 * Desktop: modal com a faixa de destaque, o cupom tracejado, nome e e-mail com rótulo,
 * botão, política e "Agora não". Mobile: folha presa ao pé da tela, com a alça.
 *
 * O que sai: a mutação de cadastro, o analytics, o atraso de abertura e o localStorage
 * que suprime o pop-up. No canvas ele já nasce ABERTO; o fechar só esconde (estado
 * local) e o envio mostra a mensagem de sucesso. Sem arte (o mock de lá também não tem).
 */

/**
 * O conteúdo da seção: os campos do `section.schema` do PopupNews10. Ficam de fora
 * `delaySeconds` e `dismissDays` (atraso de abertura e dias sem reaparecer): no canvas
 * o pop-up já nasce aberto.
 */
interface PopupNews10Conteudo {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  couponLabel?: string;
  coupon?: string;
  couponHint?: string;
  text?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
  successMessage?: string;
  privacyPrefix?: string;
  privacyLabel?: string;
  privacyUrl?: string;
  dismissLabel?: string;
}

// Conteúdo do mock.ts do starter.
const MOCK: PopupNews10Conteudo = {
  eyebrow: 'Primeira compra',
  title: 'GANHE 10% OFF',
  subtitle: 'em todo o site, inclusive em ofertas.',
  couponLabel: 'Seu cupom',
  coupon: 'BEMVINDO10',
  couponHint: 'Use ao finalizar a primeira compra',
  text: 'Cadastre-se para receber as ofertas relâmpago antes de todo mundo.',
  nameLabel: 'Nome',
  namePlaceholder: 'Como podemos te chamar?',
  emailLabel: 'E-mail',
  emailPlaceholder: 'seuemail@exemplo.com',
  buttonLabel: 'Quero receber as ofertas',
  successMessage: 'Cadastro feito! Seu cupom já está liberado.',
  privacyPrefix: 'Ao se cadastrar, você concorda com a',
  privacyLabel: 'Política de privacidade',
  privacyUrl: '/institucional/privacidade',
  dismissLabel: 'Agora não',
};

const Fechar = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export default function PopupNews10() {
  const {
    imageDesktop,
    imageMobile,
    imageAlt,
    eyebrow,
    title,
    subtitle,
    couponLabel,
    coupon,
    couponHint,
    text,
    nameLabel,
    namePlaceholder,
    emailLabel,
    emailPlaceholder,
    buttonLabel,
    successMessage,
    privacyPrefix,
    privacyLabel,
    privacyUrl,
    dismissLabel,
  } = useConteudoDaSecao(MOCK);

  const [aberto, setAberto] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'idle' | 'ok'>('idle');
  const enviando = false;

  const fechar = () => setAberto(false);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setEstado('ok');
  }

  if (!aberto) return null;

  return (
    <div className={styles.popupNews10} data-role="pn-root">
      <link rel="stylesheet" href={FONTES_10} />
      <div className={styles.overlay} onClick={fechar} aria-hidden="true" />
      <section
        tabIndex={-1}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pn10-titulo"
      >
        <span className={styles.handle} aria-hidden="true" />
        <button
          type="button"
          className={styles.close}
          onClick={fechar}
          aria-label="Fechar"
        >
          <Fechar />
        </button>

        {(imageDesktop || imageMobile) && (
          <div className={styles.media} data-role="pn-image">
            <picture>
              {imageMobile && (
                <source media="(max-width: 960px)" srcSet={imageMobile} />
              )}
              <img
                src={imageDesktop || imageMobile}
                alt={imageAlt ?? ''}
                width={1120}
                height={400}
              />
            </picture>
          </div>
        )}

        <div className={styles.hero}>
          {eyebrow && (
            <span className={styles.eyebrow} data-role="pn-eyebrow">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 id="pn10-titulo" className={styles.title} data-role="pn-title">
              {title}
            </h2>
          )}
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>

        <div className={styles.body}>
          {coupon && (
            <div className={styles.coupon} data-role="pn-coupon">
              <span className={styles.couponMain}>
                {couponLabel && (
                  <span className={styles.couponLabel}>{couponLabel}</span>
                )}
                <strong className={styles.couponCode}>{coupon}</strong>
              </span>
              {couponHint && (
                <span className={styles.couponHint}>{couponHint}</span>
              )}
            </div>
          )}
          {text && (
            <p className={styles.text} data-role="pn-text">
              {text}
            </p>
          )}

          {estado === 'ok' ? (
            <p className={styles.feedback} role="status">
              {successMessage}
            </p>
          ) : (
            <form className={styles.form} onSubmit={enviar}>
              <label className={styles.field}>
                {nameLabel || 'Nome'}
                <input
                  className={styles.input}
                  data-role="pn-input"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder={namePlaceholder}
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                />
              </label>
              <label className={styles.field}>
                {emailLabel || 'E-mail'}
                <input
                  className={styles.input}
                  data-role="pn-input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder={emailPlaceholder}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </label>
              <button
                type="submit"
                className={styles.submit}
                disabled={enviando}
                data-role="pn-button"
              >
                {buttonLabel}
              </button>
              {privacyLabel && (
                <span className={styles.privacy}>
                  {privacyPrefix && `${privacyPrefix} `}
                  <a href={privacyUrl || '#'}>{privacyLabel}</a>.
                </span>
              )}
            </form>
          )}

          {dismissLabel && (
            <button
              type="button"
              className={styles.dismiss}
              onClick={fechar}
              data-role="pn-dismiss"
            >
              {dismissLabel}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
PopupNews10.conteudoPadrao = MOCK;

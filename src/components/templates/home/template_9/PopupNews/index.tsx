'use client';

import React, { useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/PopupNews09` do faststore.starter (família 09, Editorial;
 * desenho `PopupNews09` / `PopupNews09-mobile`). Mesmo markup, mesmas classes,
 * mesmos `data-role`; o CSS é derivado do SCSS de lá, com o @media (overlay fixo).
 * Conteúdo = o mock.ts de lá, por baixo do que o CS subir (`useConteudoDaSecao`).
 *
 * O que sai: a mutação de cadastro, o analytics, o atraso de abertura e o
 * localStorage que suprime o pop-up. No canvas ele já nasce ABERTO; o fechar só
 * esconde (estado local) e o envio mostra a mensagem de sucesso. Por isso o tipo não
 * traz `delaySeconds` nem `dismissDays` (o 1-conteudo os lista como não desenhados).
 */
interface PopupNews09Conteudo {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  /** `{cupom}` no texto vira o cupom em destaque. */
  text?: string;
  coupon?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
  successMessage?: string;
  dismissLabel?: string;
  privacyPrefix?: string;
  privacyLabel?: string;
  privacyUrl?: string;
}

const MOCK: PopupNews09Conteudo = {
  eyebrow: 'Newsletter',
  title: '10% na primeira',
  titleEmphasis: 'compra',
  text: 'Cadastre-se para receber as novidades. Na primeira compra, use o cupom {cupom}.',
  coupon: '[CUPOM]',
  namePlaceholder: 'Seu nome',
  emailPlaceholder: 'Seu e-mail',
  buttonLabel: 'Cadastrar',
  successMessage: 'Cadastro feito. Obrigado!',
  dismissLabel: 'Agora não',
  privacyPrefix: 'Veja a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/institucional/privacidade',
};

const Fechar = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export default function PopupNews09() {
  const {
    imageDesktop,
    imageMobile,
    imageAlt,
    eyebrow,
    title,
    titleEmphasis,
    text,
    coupon,
    namePlaceholder,
    emailPlaceholder,
    buttonLabel,
    successMessage,
    dismissLabel,
    privacyPrefix,
    privacyLabel,
    privacyUrl,
  } = useConteudoDaSecao(MOCK);

  const [aberto, setAberto] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'idle' | 'ok'>('idle');

  const fechar = () => setAberto(false);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setEstado('ok');
  }

  if (!aberto) return null;

  const [antes, depois] = (text ?? '').split('{cupom}');
  const temCupom = !!text?.includes('{cupom}') && !!coupon;

  return (
    <div className={styles.popupNews09} data-role="pn-root">
      <link rel="stylesheet" href={FONTES_09} />
      <div className={styles.overlay} onClick={fechar} aria-hidden="true" />
      <section
        tabIndex={-1}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pn09-titulo"
      >
        <div className={styles.media} data-role="pn-image">
          {(imageDesktop || imageMobile) && (
            <picture>
              {imageMobile && <source media="(max-width: 960px)" srcSet={imageMobile} />}
              <img src={imageDesktop || imageMobile} alt={imageAlt ?? ''} width={760} height={1160} />
            </picture>
          )}
          <button
            type="button"
            className={`${styles.close} ${styles.closeMob}`}
            onClick={fechar}
            aria-label="Fechar"
          >
            <Fechar />
          </button>
        </div>

        <div className={styles.panel}>
          <button
            type="button"
            className={`${styles.close} ${styles.closeDsk}`}
            onClick={fechar}
            aria-label="Fechar"
          >
            <Fechar />
          </button>
          {eyebrow && (
            <span className={styles.eyebrow} data-role="pn-eyebrow">
              <span className={styles.eyebrowRule} aria-hidden="true" />
              {eyebrow}
            </span>
          )}
          {(title || titleEmphasis) && (
            <h2 id="pn09-titulo" className={styles.title} data-role="pn-title">
              {title} {titleEmphasis && <em>{titleEmphasis}</em>}
            </h2>
          )}
          {text && (
            <p className={styles.text} data-role="pn-text">
              {temCupom ? (
                <>
                  {antes}
                  <strong className={styles.coupon}>{coupon}</strong>
                  {depois}
                </>
              ) : (
                text.replace('{cupom}', '')
              )}
            </p>
          )}

          {estado === 'ok' ? (
            <p className={styles.feedback} role="status">
              {successMessage}
            </p>
          ) : (
            <form className={styles.form} onSubmit={enviar}>
              <label className={styles.field}>
                <span className={styles.srOnly}>{namePlaceholder}</span>
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
                <span className={styles.srOnly}>{emailPlaceholder}</span>
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
                data-role="pn-button"
              >
                {buttonLabel}
              </button>
            </form>
          )}

          <div className={styles.foot}>
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
            {privacyLabel && (
              <span className={styles.privacy}>
                {privacyPrefix && (
                  <span className={styles.dsk}>{privacyPrefix} </span>
                )}
                <a href={privacyUrl || '#'}>{privacyLabel}</a>
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
PopupNews09.conteudoPadrao = MOCK;

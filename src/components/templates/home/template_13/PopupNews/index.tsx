import React, { useState } from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/PopupNews13` do faststore.starter (família 13, Noturno; desenho
 * `PopupNews13` / `PopupNews13-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`;
 * o CSS é derivado do SCSS de lá, com o @media (overlay fixo). Desktop: modal preto com
 * filete, a coluna da arte à esquerda e, à direita, o selo verde, o título em condensada,
 * o texto, Nome e E-mail, "Quero entrar", a política e "Agora não". Mobile: folha presa ao
 * pé com o filete verde em cima.
 *
 * O que sai: a mutação de cadastro, o analytics, o atraso de abertura e o localStorage
 * que suprime o pop-up. No canvas ele já nasce ABERTO; o fechar só esconde (estado
 * local) e o envio mostra a mensagem de sucesso. Sem arte (o mock de lá também não tem):
 * vale a coluna grafite de placeholder.
 */

// Conteúdo do mock.ts do starter.
const CONTEUDO = {
  imageDesktop: '',
  imageMobile: '',
  imageAlt: '',
  eyebrow: 'Acesso antecipado',
  title: 'Os drops chegam primeiro pra quem tá na lista',
  text: 'Receba o link antes da abertura de cada drop.',
  nameLabel: 'Nome',
  namePlaceholder: 'Como quer ser chamado',
  emailLabel: 'E-mail',
  emailPlaceholder: 'voce@email.com',
  buttonLabel: 'Quero entrar',
  successMessage:
    'Pronto! Você vai receber o link do próximo drop antes de todo mundo.',
  privacyPrefix: 'Ao se cadastrar, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/politica-de-privacidade',
  dismissLabel: 'Agora não',
};

export default function PopupNews13() {
  const {
    imageDesktop,
    imageMobile,
    imageAlt,
    eyebrow,
    title,
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
  } = CONTEUDO;

  const [aberto, setAberto] = useState(true);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'idle' | 'ok' | 'erro'>('idle');
  const motivo = '';
  const enviando = false;

  const fechar = () => setAberto(false);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setEstado('ok');
  }

  if (!aberto) return null;

  return (
    <div className={styles.popupNews13} data-role="pn-root">
      <link rel="stylesheet" href={FONTES_13} />
      <div className={styles.overlay} onClick={fechar} aria-hidden="true" />
      <section
        tabIndex={-1}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pn13-titulo"
      >
        <div
          className={`${styles.media}${imageMobile ? ` ${styles.mediaMobile}` : ''}`}
          data-role="pn-image"
        >
          {(imageDesktop || imageMobile) && (
            <picture>
              {imageMobile && (
                <source media="(max-width: 960px)" srcSet={imageMobile} />
              )}
              <img
                src={imageDesktop || imageMobile}
                alt={imageAlt ?? ''}
                width={640}
                height={1040}
              />
            </picture>
          )}
        </div>

        <div className={styles.side}>
          <button
            type="button"
            className={styles.close}
            onClick={fechar}
            aria-label="Fechar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          {eyebrow && (
            <span className={styles.eyebrow} data-role="pn-eyebrow">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 id="pn13-titulo" className={styles.title} data-role="pn-title">
              {title}
            </h2>
          )}
          {text && (
            <p className={styles.text} data-role="pn-text">
              {text}
            </p>
          )}

          <form className={styles.form} onSubmit={enviar}>
            {estado === 'ok' ? (
              <p className={styles.feedback} role="status">
                {successMessage}
              </p>
            ) : (
              <>
                <label className={styles.field}>
                  {nameLabel || 'Nome'}
                  <input
                    className={styles.input}
                    data-role="pn-input"
                    type="text"
                    name="name"
                    autoComplete="given-name"
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
                {estado === 'erro' && (
                  <p className={styles.feedback} role="alert">
                    {motivo ||
                      'Não foi possível concluir a inscrição. Tente novamente.'}
                  </p>
                )}
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={enviando}
                  data-role="pn-button"
                >
                  {buttonLabel}
                </button>
              </>
            )}

            {privacyLabel && (
              <p className={styles.privacy}>
                {privacyPrefix && `${privacyPrefix} `}
                <a href={privacyUrl || '#'}>{privacyLabel}</a>.
              </p>
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
          </form>
        </div>
      </section>
    </div>
  );
}

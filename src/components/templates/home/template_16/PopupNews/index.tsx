import React, { useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/PopupNews16` do faststore.starter (família 16, Infantil; desenho
 * `PopupNews16` / `PopupNews16-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`;
 * o CSS é derivado do SCSS de lá, com o @media (overlay fixo). Desktop: modal creme com filete
 * e sombra chapada, a arte à esquerda com o selo coral inclinado e, à direita, o fechar
 * redondo, o título, o texto, Nome e E-mail em pílulas, "Quero meu cupom", a política e
 * "Agora não". Mobile: folha presa ao pé da tela.
 *
 * O que sai: a mutação de cadastro, o analytics, o atraso de abertura e o localStorage que
 * suprime o pop-up. No canvas ele já nasce ABERTO; o fechar só esconde (estado local) e o
 * envio mostra a mensagem de sucesso. Sem arte (o mock de lá também não tem): vale o fundo de
 * placeholder do CSS.
 */

interface PopupNews16Props {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  /** Selo redondo sobre a arte: a linha grande ("10%") e a pequena ("off"). Vazio esconde. */
  sealTitle?: string;
  sealText?: string;
  title?: string;
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
  delaySeconds?: number;
  dismissDays?: number;
}

const FONTES =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap';
const MOCK: PopupNews16Props = {
  sealTitle: '10%',
  sealText: 'off',
  title: 'Ganhe 10% na primeira compra',
  text: 'Cadastre-se e receba o cupom no e-mail, junto com novidades e dicas de brincadeira.',
  nameLabel: 'Nome',
  namePlaceholder: 'Seu nome',
  emailLabel: 'E-mail',
  emailPlaceholder: 'voce@email.com',
  buttonLabel: 'Quero meu cupom',
  successMessage: 'Oba! O cupom já está a caminho do seu e-mail.',
  privacyPrefix: 'Ao se cadastrar, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/politica-de-privacidade',
  dismissLabel: 'Agora não',
  delaySeconds: 3,
  dismissDays: 7,
};

export default function PopupNews16() {
  const {
    imageDesktop,
    imageMobile,
    imageAlt,
    sealTitle,
    sealText,
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
  } = MOCK;

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
    <div className={styles.popupNews16} data-role="pn-root">
      <link rel="stylesheet" href={FONTES} />
      <div className={styles.overlay} onClick={fechar} aria-hidden="true" />
      <section
        tabIndex={-1}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pn16-titulo"
      >
        <div className={styles.media} data-role="pn-image">
          {(imageDesktop || imageMobile) && (
            <picture>
              {imageMobile && (
                <source media="(max-width: 960px)" srcSet={imageMobile} />
              )}
              <img
                src={imageDesktop || imageMobile}
                alt={imageAlt ?? ''}
                width={680}
                height={1040}
              />
            </picture>
          )}
          {(sealTitle || sealText) && (
            <span className={styles.seal} data-role="pn-eyebrow">
              {sealTitle && (
                <span className={styles.sealTitle}>{sealTitle}</span>
              )}
              {sealText && <span className={styles.sealText}>{sealText}</span>}
            </span>
          )}
        </div>

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
            strokeWidth="2.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className={styles.side}>
          {title && (
            <h2 id="pn16-titulo" className={styles.title} data-role="pn-title">
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

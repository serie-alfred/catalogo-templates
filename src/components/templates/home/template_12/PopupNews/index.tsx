import React, { useState } from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/PopupNews12` do faststore.starter (família 12, Suave; desenho
 * `PopupNews12` / `PopupNews12-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`;
 * o CSS é derivado do SCSS de lá, com o @media (overlay fixo). Desktop: modal arredondado
 * com a arte num arco à esquerda e, à direita, o selo, o título em serifa, o texto, Nome e
 * E-mail com rótulo, "Quero meu cupom", "Agora não" e a política. Mobile: folha presa ao
 * pé da tela com a alça.
 *
 * O que sai: a mutação de cadastro, o analytics, o atraso de abertura e o localStorage
 * que suprime o pop-up. No canvas ele já nasce ABERTO; o fechar só esconde (estado
 * local) e o envio mostra a mensagem de sucesso. Sem arte (o mock de lá também não tem):
 * vale o arco de placeholder.
 */

// Conteúdo do mock.ts do starter.
const CONTEUDO = {
  eyebrow: 'Primeira compra',
  title: 'Ganhe 10% na primeira compra',
  text: 'Cadastre-se e receba o cupom no seu e-mail, junto com as novidades da marca.',
  nameLabel: 'Nome',
  namePlaceholder: 'Como podemos te chamar?',
  emailLabel: 'E-mail',
  emailPlaceholder: 'seu@email.com',
  buttonLabel: 'Quero meu cupom',
  successMessage: 'Prontinho! O cupom está a caminho do seu e-mail.',
  privacyPrefix: 'Veja a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/politica-de-privacidade',
  dismissLabel: 'Agora não',
};

export default function PopupNews12() {
  const {
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
    <div className={styles.popupNews12} data-role="pn-root">
      <link rel="stylesheet" href={FONTES_12} />
      <div className={styles.overlay} onClick={fechar} aria-hidden="true" />
      <section
        tabIndex={-1}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pn12-titulo"
      >
        <div className={styles.media} data-role="pn-image">
          <span className={styles.arch}></span>
        </div>

        <div className={styles.side}>
          <span className={styles.handle} aria-hidden="true" />
          <div className={styles.top}>
            {eyebrow && (
              <span className={styles.eyebrow} data-role="pn-eyebrow">
                {eyebrow}
              </span>
            )}
            <button
              type="button"
              className={styles.close}
              onClick={fechar}
              aria-label="Fechar"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <form className={styles.form} onSubmit={enviar}>
            {title && (
              <h2
                id="pn12-titulo"
                className={styles.title}
                data-role="pn-title"
              >
                {title}
              </h2>
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
                  {privacyPrefix && `${privacyPrefix} `}
                  <a href={privacyUrl || '#'}>{privacyLabel}</a>
                </span>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

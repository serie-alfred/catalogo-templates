import React, { useState } from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/PopupNews15` do faststore.starter (família 15, Luxo; desenho
 * `PopupNews15` / `PopupNews15-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`;
 * o CSS é derivado do SCSS de lá, com o @media (overlay fixo). Desktop: a arte à esquerda e
 * o painel com o fio dourado por dentro; chamada, título em serifa com o trecho em itálico,
 * Nome e E-mail com rótulo e linha fina, botão dourado, privacidade e "Agora não". Mobile:
 * folha presa ao pé com a arte no topo.
 *
 * O que sai: a mutação de cadastro, o analytics, o atraso de abertura e o localStorage
 * que suprime o pop-up. No canvas ele já nasce ABERTO; o fechar só esconde (estado local)
 * e o envio mostra a mensagem de sucesso. Sem arte (o mock de lá também não tem): vale o
 * fundo de placeholder.
 */
interface PopupNews15Props {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  eyebrow?: string;
  title?: string;
  /** Trecho do título em itálico, logo depois de `title`. */
  titleEmphasis?: string;
  /** `{cupom}` no texto é trocado pelo cupom (só texto). */
  text?: string;
  coupon?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
  successMessage?: string;
  dismissLabel?: string;
  /** Texto antes do link de privacidade ("Ao se cadastrar, você concorda com a"). */
  privacyPrefix?: string;
  privacyLabel?: string;
  privacyUrl?: string;
}

const Fechar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export default function PopupNews15() {
  const {
    imageDesktop,
    imageMobile,
    imageAlt,
    eyebrow,
    title,
    titleEmphasis,
    text,
    coupon,
    nameLabel,
    namePlaceholder,
    emailLabel,
    emailPlaceholder,
    buttonLabel,
    successMessage,
    dismissLabel,
    privacyPrefix,
    privacyLabel,
    privacyUrl,
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

  const texto = (text ?? '').split('{cupom}').join(coupon ?? '');

  const agoraNao = dismissLabel && (
    <button
      type="button"
      className={styles.dismiss}
      onClick={fechar}
      data-role="pn-dismiss"
    >
      {dismissLabel}
    </button>
  );

  return (
    <div className={styles.popupNews15} data-role="pn-root">
      <link rel="stylesheet" href={FONTES_15} />
      <div className={styles.overlay} onClick={fechar} aria-hidden="true" />
      <section
        tabIndex={-1}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pn15-titulo"
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
                width={800}
                height={1200}
              />
            </picture>
          )}
        </div>

        <button
          type="button"
          className={styles.close}
          onClick={fechar}
          aria-label="Fechar"
          data-role="pn-close"
        >
          <Fechar />
        </button>

        <div className={styles.panel}>
          {eyebrow && (
            <span className={styles.eyebrow} data-role="pn-eyebrow">
              {eyebrow}
            </span>
          )}
          {(title || titleEmphasis) && (
            <h2 id="pn15-titulo" className={styles.title} data-role="pn-title">
              {title} {titleEmphasis && <em>{titleEmphasis}</em>}
            </h2>
          )}
          {texto && (
            <p className={styles.text} data-role="pn-text">
              {texto}
            </p>
          )}

          {estado === 'ok' ? (
            <>
              <p className={styles.feedback} role="status">
                {successMessage}
              </p>
              {agoraNao}
            </>
          ) : (
            <form className={styles.form} onSubmit={enviar}>
              <label className={styles.field}>
                <span className={nameLabel ? styles.label : styles.srOnly}>
                  {nameLabel || namePlaceholder || 'Nome'}
                </span>
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
                <span className={emailLabel ? styles.label : styles.srOnly}>
                  {emailLabel || emailPlaceholder || 'E-mail'}
                </span>
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
                    'Não foi possível concluir o cadastro. Tente novamente.'}
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
              {privacyLabel && (
                <p className={styles.privacy} data-role="pn-privacy">
                  {privacyPrefix && `${privacyPrefix} `}
                  <a href={privacyUrl || '#'}>{privacyLabel}</a>.
                </p>
              )}
              {agoraNao}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

// Conteúdo do mock.ts do starter.
const CONTEUDO: PopupNews15Props = {
  eyebrow: 'Primeira visita',
  title: 'Seja bem-vinda à',
  titleEmphasis: 'maison',
  text: 'Cadastre-se e receba 10% na primeira compra com o cupom {cupom}, enviado por e-mail.',
  coupon: 'BEMVINDA10',
  nameLabel: 'Nome',
  namePlaceholder: 'Como gostaria de ser chamada(o)',
  emailLabel: 'E-mail',
  emailPlaceholder: 'seu@email.com.br',
  buttonLabel: 'Quero receber',
  successMessage: 'Cadastro feito. Seu cupom chega por e-mail.',
  dismissLabel: 'Agora não',
  privacyPrefix: 'Ao se cadastrar, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/institucional/privacidade',
};

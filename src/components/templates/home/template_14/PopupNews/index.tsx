import React, { useState } from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/PopupNews14` do faststore.starter (família 14, Esportiva; desenho
 * `PopupNews14` / `PopupNews14-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`;
 * o CSS é derivado do SCSS de lá, com o @media (overlay fixo). Desktop: modal branco sobre o
 * véu marinho, a arte cortada em diagonal e, ao lado, o selo lima, o título com o destaque no
 * paralelogramo vermelho, Nome e E-mail, "Quero meu cupom", a política e "Agora não". Mobile:
 * folha presa ao pé.
 *
 * O que sai: a mutação de cadastro, o analytics, o atraso de abertura, o foco/Escape e o
 * localStorage que suprime o pop-up. No canvas ele já nasce ABERTO; o fechar só esconde
 * (estado local) e o envio mostra a mensagem de sucesso. Sem arte (o mock de lá também não
 * tem): vale o bloco cinza-azulado de placeholder.
 */

// Conteúdo do mock.ts do starter.
const CONTEUDO = {
  imageDesktop: '',
  imageMobile: '',
  imageAlt: '',
  eyebrow: 'Cupom de boas-vindas',
  title: 'Ganhe 10% off na primeira compra',
  titleHighlight: '10% off',
  text: 'Cadastre-se e receba o cupom no e-mail, além de planos de treino e lançamentos antes de todo mundo.',
  nameLabel: 'Nome',
  namePlaceholder: 'Como podemos te chamar',
  emailLabel: 'E-mail',
  emailPlaceholder: 'voce@email.com',
  buttonLabel: 'Quero meu cupom',
  successMessage: 'Pronto! O cupom está a caminho do seu e-mail.',
  privacyPrefix: 'Ao se cadastrar, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/politica-de-privacidade',
  dismissLabel: 'Agora não',
};

/** Título com o trecho de destaque no paralelogramo (se o trecho não estiver no título, sai liso). */
function Titulo({ titulo, destaque }: { titulo: string; destaque?: string }) {
  const i = destaque ? titulo.indexOf(destaque) : -1;
  if (!destaque || i < 0) return <>{titulo}</>;
  return (
    <>
      {titulo.slice(0, i)}
      <span className={styles.highlight}>{destaque}</span>
      {titulo.slice(i + destaque.length)}
    </>
  );
}

export default function PopupNews14() {
  const {
    imageDesktop,
    imageMobile,
    imageAlt,
    eyebrow,
    title,
    titleHighlight,
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
    <div className={styles.popupNews14} data-role="pn-root">
      <link rel="stylesheet" href={FONTES_14} />
      <div className={styles.overlay} onClick={fechar} aria-hidden="true" />
      <section
        tabIndex={-1}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pn14-titulo"
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
                width={760}
                height={1120}
              />
            </picture>
          )}
        </div>

        <button
          type="button"
          className={styles.close}
          onClick={fechar}
          aria-label="Fechar"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="square"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className={styles.side}>
          {eyebrow && (
            <span className={styles.eyebrow} data-role="pn-eyebrow">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 id="pn14-titulo" className={styles.title} data-role="pn-title">
              <Titulo titulo={title} destaque={titleHighlight} />
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="square"
                    aria-hidden="true"
                  >
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
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

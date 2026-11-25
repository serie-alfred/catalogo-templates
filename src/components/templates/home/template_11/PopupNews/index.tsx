import React, { useState } from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/PopupNews11` do faststore.starter (família 11, Grade; desenho
 * `PopupNews11` / `PopupNews11-mobile`). Mesmo markup, mesmas classes, mesmos
 * `data-role`; o CSS é derivado do SCSS de lá, com o @media (overlay fixo).
 * Desktop: modal de 880 em duas células, a arte à esquerda e, à direita, a régua
 * "[Journal]" com o fechar quadrado, o título, o texto, Nome e E-mail com rótulo em mono,
 * "Inscrever", a política e "Agora não". Mobile: folha presa ao pé da tela, com a régua,
 * a arte baixa e o formulário.
 *
 * Conteúdo = o mock.ts de lá, por baixo do que o CS subir (`useConteudoDaSecao`, campos do
 * schema de lá). Por isso o tipo não traz `delaySeconds` nem `dismissDays` (o 1-conteudo
 * os lista como não desenhados).
 *
 * O que sai: a mutação de cadastro, o analytics, o atraso de abertura e o localStorage
 * que suprime o pop-up. No canvas ele já nasce ABERTO; o fechar só esconde (estado
 * local) e o envio mostra a mensagem de sucesso. Sem arte (o mock de lá também não tem):
 * vale o bloco cinza do `.media`.
 */

/** O conteúdo da seção: os campos do `section.schema` do PopupNews11. */
interface PopupNews11Conteudo {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  eyebrow?: string;
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
}

// Conteúdo do mock.ts do starter.
const MOCK: PopupNews11Conteudo = {
  eyebrow: '[Journal]',
  title: 'Receba o Journal',
  text: 'Lançamentos, edições limitadas e textos sobre design de interiores. Uma vez por mês.',
  nameLabel: 'Nome',
  namePlaceholder: 'Seu nome',
  emailLabel: 'E-mail',
  emailPlaceholder: 'nome@email.com',
  buttonLabel: 'Inscrever',
  successMessage: 'Inscrição confirmada. Até o próximo Journal.',
  privacyPrefix: 'Ao se inscrever você aceita a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/politica-de-privacidade',
  dismissLabel: 'Agora não',
};

const svg = (children: React.ReactNode) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export default function PopupNews11() {
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
    <div className={styles.popupNews11} data-role="pn-root">
      <link rel="stylesheet" href={FONTES_11} />
      <div className={styles.overlay} onClick={fechar} aria-hidden="true" />
      <section
        tabIndex={-1}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pn11-titulo"
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
                width={880}
                height={1120}
              />
            </picture>
          )}
        </div>

        <div className={styles.side}>
          <div className={styles.bar}>
            <span className={styles.eyebrow} data-role="pn-eyebrow">
              {eyebrow}
            </span>
            <button
              type="button"
              className={styles.close}
              onClick={fechar}
              aria-label="Fechar"
            >
              {svg(<path d="M6 6l12 12M18 6 6 18" />)}
            </button>
          </div>

          <form className={styles.form} onSubmit={enviar}>
            {title && (
              <h2
                id="pn11-titulo"
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
            <span className={styles.spacer} aria-hidden="true" />

            {estado === 'ok' ? (
              <p className={styles.feedback} role="status">
                {successMessage}
              </p>
            ) : (
              <>
                <label className={styles.field}>
                  <span className={styles.label}>{nameLabel || 'Nome'}</span>
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
                  <span className={styles.label}>{emailLabel || 'E-mail'}</span>
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
                  {svg(<path d="M5 12h14M13 6l6 6-6 6" />)}
                </button>
              </>
            )}

            <div className={styles.foot}>
              {privacyLabel && (
                <span className={styles.privacy}>
                  {privacyPrefix && `${privacyPrefix} `}
                  <a href={privacyUrl || '#'}>{privacyLabel}</a>.
                </span>
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
          </form>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
PopupNews11.conteudoPadrao = MOCK;

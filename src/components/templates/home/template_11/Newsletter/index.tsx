import React, { useState } from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter11` do faststore.starter (família 11, Grade; desenho
 * `Newsletter11` / `Newsletter11-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Divergência deliberada: sem a mutação de cadastro e sem analytics; o envio só mostra a
 * mensagem de sucesso (o estado de erro fica no markup, mas não acontece aqui).
 */
interface Newsletter11Props {
  eyebrow?: string;
  title?: string;
  note?: string;
  text?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  privacyPrefix?: string;
  privacyLabel?: string;
  privacyUrl?: string;
}

// Conteúdo do mock.ts do starter.
const MOCK: Newsletter11Props = {
  eyebrow: '[08] Journal por e-mail',
  title: 'Newsletter',
  note: '1 e-mail por mês. Sem spam.',
  text: 'Lançamentos, peças de edição limitada e textos do Journal antes de todo mundo.',
  nameLabel: 'Nome',
  namePlaceholder: 'Seu nome',
  emailLabel: 'E-mail',
  emailPlaceholder: 'nome@email.com',
  buttonLabel: 'Inscrever',
  successMessage: 'Inscrição feita. O próximo e-mail chega no começo do mês.',
  errorMessage: 'Não deu para inscrever agora. Tente de novo em instantes.',
  privacyPrefix: 'Ao se inscrever, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/institucional/privacidade',
};

export default function Newsletter11() {
  const {
    eyebrow,
    title,
    note,
    text,
    nameLabel,
    namePlaceholder,
    emailLabel,
    emailPlaceholder,
    buttonLabel,
    successMessage,
    errorMessage,
    privacyPrefix,
    privacyLabel,
    privacyUrl,
  } = MOCK;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const enviando = false;
  const [estado, setEstado] = useState<'idle' | 'ok' | 'erro'>('idle');

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setEstado('ok');
    setNome('');
    setEmail('');
  }

  const privacidade = (extra: string) =>
    (privacyPrefix || privacyLabel) && (
      <p className={`${styles.privacy} ${extra}`}>
        {privacyPrefix}
        {privacyLabel && (
          <>
            {' '}
            <a href={privacyUrl || '#'}>{privacyLabel}</a>.
          </>
        )}
      </p>
    );

  return (
    <div className={styles.newsletter11Box}>
      <section
        className={styles.newsletter11}
        aria-label="Newsletter"
        data-role="nl-root"
      >
        <link rel="stylesheet" href={FONTES_11} />
        <div className={styles.box}>
          <div className={styles.intro}>
            {eyebrow ? (
              <span className={styles.eyebrow} data-role="nl-eyebrow">
                {eyebrow}
              </span>
            ) : (
              <span aria-hidden="true" />
            )}
            {title && (
              <h2 className={styles.title} data-role="nl-title">
                {title}
              </h2>
            )}
            {/* Mobile: o texto fica junto do título (no desktop ele abre o formulário). */}
            {text && (
              <p className={`${styles.text} ${styles.textIntro}`}>{text}</p>
            )}
            {note ? (
              <span className={styles.note}>{note}</span>
            ) : (
              <span aria-hidden="true" />
            )}
          </div>
          {estado === 'ok' ? (
            <div className={styles.form}>
              <p className={styles.feedback} role="status">
                {successMessage}
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={enviar} data-role="nl-form">
              {text && (
                <p
                  className={`${styles.text} ${styles.textForm}`}
                  data-role="nl-text"
                >
                  {text}
                </p>
              )}
              <div className={styles.fields}>
                <label className={styles.field}>
                  <span className={styles.label}>{nameLabel || 'Nome'}</span>
                  <input
                    className={styles.input}
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
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder={emailPlaceholder}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </label>
              </div>
              <button
                type="submit"
                className={styles.submit}
                disabled={enviando}
                data-role="nl-submit"
              >
                {buttonLabel || 'Inscrever'}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
              {estado === 'erro' && (
                <p className={styles.feedback} role="alert">
                  {errorMessage}
                </p>
              )}
              {privacidade(styles.privacyForm)}
            </form>
          )}
        </div>
        {/* Mobile: a política fica abaixo da caixa, como no desenho. */}
        {estado !== 'ok' && privacidade(styles.privacyOut)}
      </section>
    </div>
  );
}

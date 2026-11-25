'use client';
import React, { useState } from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter14` do faststore.starter (família 14, Esportiva; desenho
 * `Newsletter14`). Mesmo markup, mesmas classes e `data-role`; o CSS é derivado do SCSS de lá.
 * Conteúdo = o mock.ts de lá, por baixo do que o CS subir (`useConteudoDaSecao`, campos do
 * schema de lá).
 *
 * Divergência deliberada: o envio não grava nada (lá, `subscribeNewsletter` + `generate_lead`);
 * aqui só mostra a mensagem de sucesso. Por isso o tipo não traz o `errorMessage`.
 */
interface Newsletter14Conteudo {
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
  privacySuffix?: string;
}

const MOCK: Newsletter14Conteudo = {
  title: 'Treino na sua caixa de entrada',
  text: 'Planos de treino, lançamentos e ofertas da semana. Ganhe 10% na primeira compra.',
  nameLabel: 'Nome',
  namePlaceholder: 'Como podemos te chamar',
  emailLabel: 'E-mail',
  emailPlaceholder: 'voce@email.com',
  buttonLabel: 'Cadastrar',
  successMessage: 'Pronto! Seu primeiro treino chega no seu e-mail.',
  privacyPrefix: 'Ao se cadastrar, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/institucional/privacidade',
  privacySuffix: 'Cancele quando quiser.',
};

export default function Newsletter14() {
  const {
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
    privacySuffix,
  } = useConteudoDaSecao(MOCK);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setOk(true);
  }

  return (
    <div className={styles.newsletter14Box}>
      <section className={styles.newsletter14} aria-label={title || 'Newsletter'} data-role="nl-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.stripe} aria-hidden="true" />
        <div className={styles.inner}>
          {(title || text) && (
            <div className={styles.head}>
              {title && (
                <h2 className={styles.title} data-role="nl-title">
                  {title}
                </h2>
              )}
              {text && (
                <p className={styles.text} data-role="nl-text">
                  {text}
                </p>
              )}
            </div>
          )}
          {ok ? (
            <div className={styles.form}>
              <p className={styles.feedback} role="status">
                {successMessage}
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={enviar} data-role="nl-form">
              <div className={styles.row}>
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
                <button type="submit" className={styles.submit} data-role="nl-submit">
                  {buttonLabel || 'Cadastrar'}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
              {(privacyPrefix || privacyLabel || privacySuffix) && (
                <p className={styles.privacy}>
                  {privacyPrefix}
                  {privacyLabel && (
                    <>
                      {' '}
                      <a href={privacyUrl || '#'}>{privacyLabel}</a>.
                    </>
                  )}
                  {privacySuffix && ` ${privacySuffix}`}
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Newsletter14.conteudoPadrao = MOCK;

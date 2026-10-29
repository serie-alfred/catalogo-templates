'use client';
import React, { useState } from 'react';

import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter14` do faststore.starter (família 14, Esportiva; desenho
 * `Newsletter14`). Mesmo markup, mesmas classes e `data-role`; o CSS é derivado do SCSS de lá.
 * Conteúdo = o mock.ts de lá.
 *
 * Divergência deliberada: o envio não grava nada (lá, `subscribeNewsletter` + `generate_lead`);
 * aqui só mostra a mensagem de sucesso.
 */

const CONTEUDO = {
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
  privacySuffix: 'Cancele quando quiser.',
};

export default function Newsletter14() {
  const c = CONTEUDO;
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
      <section className={styles.newsletter14} aria-label={c.title || 'Newsletter'} data-role="nl-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.stripe} aria-hidden="true" />
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 className={styles.title} data-role="nl-title">
              {c.title}
            </h2>
            <p className={styles.text} data-role="nl-text">
              {c.text}
            </p>
          </div>
          {ok ? (
            <div className={styles.form}>
              <p className={styles.feedback} role="status">
                {c.successMessage}
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={enviar} data-role="nl-form">
              <div className={styles.row}>
                <label className={styles.field}>
                  <span className={styles.label}>{c.nameLabel}</span>
                  <input
                    className={styles.input}
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder={c.namePlaceholder}
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>{c.emailLabel}</span>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder={c.emailPlaceholder}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </label>
                <button type="submit" className={styles.submit} data-role="nl-submit">
                  {c.buttonLabel}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
              <p className={styles.privacy}>
                {c.privacyPrefix} <a href="#">{c.privacyLabel}</a>. {c.privacySuffix}
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

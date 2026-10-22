import React, { useState } from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter12` do faststore.starter (família 12, Suave; desenho
 * `Newsletter12` / `Newsletter12-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (sem arte: vale o arco de placeholder).
 *
 * Divergência deliberada: sem a mutação de cadastro e sem analytics; o envio só mostra a
 * mensagem de sucesso (o estado de erro fica no markup, mas não acontece aqui).
 */

// Conteúdo do mock.ts do starter.
const MOCK = {
  title: 'Ganhe 10% na primeira compra',
  text: 'Receba dicas de rotina e os lançamentos em primeira mão. O cupom chega no seu e-mail.',
  nameLabel: 'Nome',
  namePlaceholder: 'Como podemos te chamar?',
  emailLabel: 'E-mail',
  emailPlaceholder: 'seu@email.com',
  buttonLabel: 'Quero meu cupom',
  successMessage: 'Pronto! O seu cupom já está a caminho do seu e-mail.',
  errorMessage: 'Não deu para cadastrar agora. Tente de novo em instantes.',
  privacyPrefix: 'Ao se cadastrar, você aceita a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '#',
  imageDesktop: '',
  imageMobile: '',
  imageAlt: 'Ganhe 10% na primeira compra',
};

export default function Newsletter12() {
  const {
    title,
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
    imageDesktop,
    imageMobile,
    imageAlt,
  } = MOCK;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'idle' | 'ok' | 'erro'>('idle');

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setEstado('ok');
    setNome('');
    setEmail('');
  }

  const cabeca = (
    <div className={styles.head}>
      <h2 className={styles.title} data-role="nl-title">
        {title}
      </h2>
      <p className={styles.text} data-role="nl-text">
        {text}
      </p>
    </div>
  );

  return (
    <div className={styles.newsletter12Box}>
      <section className={styles.newsletter12} aria-label="Newsletter" data-role="nl-root">
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.inner}>
          <div className={styles.panel}>
            <span className={styles.art} data-role="nl-image">
              {(imageDesktop || imageMobile) && (
                <picture>
                  {imageMobile && <source media="(max-width: 960px)" srcSet={imageMobile} />}
                  <img src={imageDesktop || imageMobile} alt={imageAlt ?? ''} width={480} height={540} loading="lazy" decoding="async" />
                </picture>
              )}
            </span>
            {estado === 'ok' ? (
              <div className={styles.form}>
                {cabeca}
                <p className={styles.feedback} role="status">
                  {successMessage}
                </p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={enviar} data-role="nl-form">
                {cabeca}
                <div className={styles.fields}>
                  <label className={styles.field}>
                    {nameLabel}
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
                    {emailLabel}
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
                <div className={styles.actions}>
                  <button type="submit" className={styles.submit} data-role="nl-submit">
                    {buttonLabel}
                  </button>
                  <span className={styles.privacy}>
                    {privacyPrefix} <a href={privacyUrl}>{privacyLabel}</a>.
                  </span>
                  {estado === 'erro' && (
                    <p className={styles.feedback} role="alert">
                      {errorMessage}
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

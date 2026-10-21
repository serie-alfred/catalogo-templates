import React, { useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter10` do faststore.starter (família 10, Varejo; desenho
 * `Newsletter10` / `Newsletter10-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Divergência deliberada: sem a mutação de cadastro e sem analytics; o envio só mostra a
 * mensagem de sucesso (o estado de erro fica no markup, mas não acontece aqui).
 */

// Conteúdo do mock.ts do starter.
// Textos literais do desenho `Newsletter10` (o cupom é texto do CMS, como manda o contrato).
const MOCK: Newsletter10Props = {
  title: 'Cadastre-se e ganhe',
  titleHighlight: '10% OFF',
  titleAfter: 'na primeira compra',
  text: 'Receba ofertas relâmpago e cupons exclusivos antes de todo mundo.',
  nameLabel: 'Nome',
  namePlaceholder: 'Como podemos te chamar?',
  emailLabel: 'E-mail',
  emailPlaceholder: 'seuemail@exemplo.com',
  buttonLabel: 'Quero meu cupom',
  successMessage: 'Pronto! Seu cupom chega no e-mail cadastrado.',
  errorMessage: 'Não foi possível concluir o cadastro. Tente de novo.',
  privacyPrefix: 'Ao se cadastrar, você concorda com a',
  privacyLabel: 'Política de privacidade',
  privacyUrl: '/politica-de-privacidade',
  privacySuffix: 'Cancele quando quiser.',
};
interface Newsletter10Props {
  title?: string;
  /** Trecho do título em destaque (fundo no acento), logo depois de `title`. */
  titleHighlight?: string;
  /** Fim do título, depois do destaque. */
  titleAfter?: string;
  text?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
  successMessage?: string;
  errorMessage?: string;
  /** Ex.: "Ao se cadastrar, você concorda com a". */
  privacyPrefix?: string;
  privacyLabel?: string;
  privacyUrl?: string;
  /** Ex.: "Cancele quando quiser." */
  privacySuffix?: string;
}

export default function Newsletter10() {
  const {
    title,
    titleHighlight,
    titleAfter,
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
    privacySuffix,
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

  const privacidade = (privacyPrefix || privacyLabel || privacySuffix) && (
    <p className={styles.privacy}>
      {privacyPrefix}
      {privacyLabel && (
        <>
          {' '}
          <a href={privacyUrl || '#'}>{privacyLabel}</a>
        </>
      )}
      {privacyLabel && '.'}
      {privacySuffix && ` ${privacySuffix}`}
    </p>
  );

  return (
    <div className={styles.newsletter10Box}>
      <section
        className={styles.newsletter10}
        aria-label="Newsletter"
        data-role="nl-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <div className={styles.intro}>
            <span className={styles.icon} aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </span>
            <div className={styles.copy}>
              {(title || titleHighlight || titleAfter) && (
                <h2 className={styles.title} data-role="nl-title">
                  {title}
                  {titleHighlight && (
                    <>
                      {' '}
                      <span className={styles.highlight}>{titleHighlight}</span>
                    </>
                  )}
                  {titleAfter && ` ${titleAfter}`}
                </h2>
              )}
              {text && (
                <p className={styles.text} data-role="nl-text">
                  {text}
                </p>
              )}
            </div>
          </div>
          {estado === 'ok' ? (
            <div className={styles.form}>
              <p className={styles.feedback} role="status">
                {successMessage}
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={enviar} data-role="nl-form">
              <div className={styles.row}>
                <label className={`${styles.field} ${styles.fieldName}`}>
                  {nameLabel || 'Nome'}
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder={namePlaceholder}
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                  />
                </label>
                <label className={`${styles.field} ${styles.fieldEmail}`}>
                  {emailLabel || 'E-mail'}
                  <input
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
                  data-role="nl-submit"
                >
                  {buttonLabel}
                </button>
              </div>
              {estado === 'erro' && (
                <p className={styles.feedback} role="alert">
                  {errorMessage}
                </p>
              )}
              {privacidade}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

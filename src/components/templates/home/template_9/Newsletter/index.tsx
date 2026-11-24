'use client';

import React, { useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter09` do faststore.starter (família 09, Editorial;
 * desenho `Newsletter09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá, por baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 * Sem envio de verdade (a mutation fica no starter): enviar mostra a mensagem de
 * sucesso, para o cliente ver o texto dela no preview. Por isso o tipo não traz o
 * `errorMessage` (o 1-conteudo o lista como não desenhado).
 */

interface Newsletter09Conteudo {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  text?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
  successMessage?: string;
  privacyPrefix?: string;
  privacyLabel?: string;
  privacyUrl?: string;
}

const MOCK: Newsletter09Conteudo = {
  eyebrow: 'Newsletter',
  title: 'Receba as novidades',
  titleEmphasis: 'primeiro',
  text: 'Lançamentos, reposições e o Diário, uma vez por semana. Nada além disso.',
  namePlaceholder: 'Seu nome',
  emailPlaceholder: 'Seu e-mail',
  buttonLabel: 'Assinar',
  successMessage: 'Pronto! Você vai receber as novidades primeiro.',
  privacyPrefix: 'Ao assinar, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/politica-de-privacidade',
};

export default function Newsletter09() {
  const {
    eyebrow,
    title,
    titleEmphasis,
    text,
    namePlaceholder,
    emailPlaceholder,
    buttonLabel,
    successMessage,
    privacyPrefix,
    privacyLabel,
    privacyUrl,
  } = useConteudoDaSecao(MOCK);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setEnviado(true);
    setNome('');
    setEmail('');
  };

  return (
    <div className={styles.newsletter09Box}>
      <section
        className={styles.newsletter09}
        aria-label={eyebrow || 'Newsletter'}
        data-role="nl-root"
      >
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          {eyebrow && (
            <span className={styles.eyebrow} data-role="nl-eyebrow">
              {eyebrow}
            </span>
          )}
          {(title || titleEmphasis) && (
            <h2 className={styles.title} data-role="nl-title">
              {title} {titleEmphasis && <em>{titleEmphasis}</em>}
            </h2>
          )}
          {text && (
            <p className={styles.text} data-role="nl-text">
              {text}
            </p>
          )}
          {enviado ? (
            <p className={styles.feedback} role="status">
              {successMessage}
            </p>
          ) : (
            <form className={styles.form} onSubmit={enviar} data-role="nl-form">
              <label className={`${styles.field} ${styles.fieldName}`}>
                <span className={styles.srOnly}>{namePlaceholder || 'Nome'}</span>
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
                <span className={styles.srOnly}>{emailPlaceholder || 'E-mail'}</span>
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
              <button type="submit" className={styles.submit} data-role="nl-submit">
                {buttonLabel}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          )}
          {(privacyPrefix || privacyLabel) && (
            <p className={styles.privacy}>
              {privacyPrefix}{' '}
              {privacyLabel && <a href={privacyUrl || '#'}>{privacyLabel}</a>}.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Newsletter09.conteudoPadrao = MOCK;

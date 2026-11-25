'use client';
import React, { useState } from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter15` do faststore.starter (família 15, Luxo; desenho
 * `Newsletter15`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Divergências deliberadas: sem envio (`subscribeNewsletter`) nem analytics — o submit só
 * mostra a mensagem de sucesso; o envelope `.newsletter15Box` é o container das `@container`.
 */

interface Newsletter15Conteudo {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
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
}

const MOCK: Newsletter15Conteudo = {
  eyebrow: 'Correspondência',
  title: 'Cartas da',
  titleEmphasis: 'maison',
  text: 'Lançamentos em primeira mão, convites para eventos privados e histórias do ateliê. Uma vez por mês, nunca mais que isso.',
  nameLabel: 'Nome',
  namePlaceholder: 'Como gostaria de ser chamada(o)',
  emailLabel: 'E-mail',
  emailPlaceholder: 'seu@email.com.br',
  buttonLabel: 'Assinar',
  successMessage: 'Inscrição confirmada. A próxima carta chega no seu e-mail.',
  privacyPrefix: 'Ao assinar, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '#',
};

export default function Newsletter15() {
  const {
    eyebrow,
    title,
    titleEmphasis,
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
  } = useConteudoDaSecao(MOCK);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setOk(true);
  };

  const titulo = [title, titleEmphasis].filter(Boolean).join(' ');

  return (
    <div className={styles.newsletter15Box}>
      <section className={styles.newsletter15} aria-label={titulo || eyebrow || 'Newsletter'} data-role="nl-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          <div className={styles.head}>
            {eyebrow && (
              <span className={styles.eyebrow} data-role="nl-eyebrow">
                <span className={styles.rule} aria-hidden="true" />
                {eyebrow}
                <span className={styles.rule} aria-hidden="true" />
              </span>
            )}
            {titulo && (
              <h2 className={styles.title} data-role="nl-title">
                {title} {titleEmphasis && <em>{titleEmphasis}</em>}
              </h2>
            )}
            {text && (
              <p className={styles.text} data-role="nl-text">
                {text}
              </p>
            )}
          </div>
          <form className={styles.form} onSubmit={enviar} data-role="nl-form">
            {ok ? (
              <p className={styles.feedback} role="status">
                {successMessage}
              </p>
            ) : (
              <>
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
                <button type="submit" className={styles.submit} data-role="nl-submit">
                  {buttonLabel || 'Assinar'}
                </button>
              </>
            )}
            {(privacyPrefix || privacyLabel) && (
              <p className={styles.privacy}>
                {privacyPrefix} {privacyLabel && <a href={privacyUrl || '#'}>{privacyLabel}</a>}.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Newsletter15.conteudoPadrao = MOCK;

import React, { useState } from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter13` do faststore.starter (família 13, Noturno; desenho
 * `Newsletter13` / `Newsletter13-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Divergência deliberada: sem a mutação de cadastro e sem analytics; o envio só mostra a
 * mensagem de sucesso. Por isso o tipo não traz o `errorMessage` (o 1-conteudo o lista como
 * não desenhado).
 *
 * Conteúdo: o MOCK abaixo por baixo do que o CS subir (`useConteudoDaSecao`, campos do
 * schema de lá).
 */

/** O conteúdo da seção: os campos do `section.schema` do Newsletter13. */
interface Newsletter13Conteudo {
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
}

const MOCK: Newsletter13Conteudo = {
  title: 'Entre na lista',
  text: 'Acesso antecipado aos drops e aviso de reposição. Nada de spam.',
  nameLabel: 'Nome',
  namePlaceholder: 'Como quer ser chamado',
  emailLabel: 'E-mail',
  emailPlaceholder: 'voce@email.com',
  buttonLabel: 'Entrar',
  successMessage: 'Pronto! Você está na lista do próximo drop.',
  privacyPrefix: 'Ao se cadastrar, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/institucional/privacidade',
};

export default function Newsletter13() {
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
  } = useConteudoDaSecao(MOCK);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<'idle' | 'ok'>('idle');

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setEstado('ok');
    setNome('');
    setEmail('');
  }

  return (
    <div className={styles.newsletter13Box}>
      <section
        className={styles.newsletter13}
        aria-label={title || 'Newsletter'}
        data-role="nl-root"
      >
        <link rel="stylesheet" href={FONTES_13} />
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
          {estado === 'ok' ? (
            <div className={styles.form}>
              <p className={styles.feedback} role="status">
                {successMessage}
              </p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={enviar} data-role="nl-form">
              <label className={styles.field}>
                {nameLabel || 'Nome'}
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
                {emailLabel || 'E-mail'}
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
              <button
                type="submit"
                className={styles.submit}
                data-role="nl-submit"
              >
                {buttonLabel || 'Entrar'}
              </button>
              {(privacyPrefix || privacyLabel) && (
                <p className={styles.privacy}>
                  {privacyPrefix}
                  {privacyLabel && (
                    <>
                      {' '}
                      <a href={privacyUrl || '#'}>{privacyLabel}</a>.
                    </>
                  )}
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
Newsletter13.conteudoPadrao = MOCK;

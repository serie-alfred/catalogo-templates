'use client';
import React, { useState } from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter15` do faststore.starter (família 15, Luxo; desenho
 * `Newsletter15`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá.
 *
 * Divergências deliberadas: sem envio (`subscribeNewsletter`) nem analytics — o submit só
 * mostra a mensagem de sucesso; o envelope `.newsletter15Box` é o container das `@container`.
 */

const M = {
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
};

export default function Newsletter15() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [ok, setOk] = useState(false);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;
    setOk(true);
  };

  return (
    <div className={styles.newsletter15Box}>
      <section className={styles.newsletter15} aria-label={`${M.title} ${M.titleEmphasis}`} data-role="nl-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <span className={styles.eyebrow} data-role="nl-eyebrow">
              <span className={styles.rule} aria-hidden="true" />
              {M.eyebrow}
              <span className={styles.rule} aria-hidden="true" />
            </span>
            <h2 className={styles.title} data-role="nl-title">
              {M.title} <em>{M.titleEmphasis}</em>
            </h2>
            <p className={styles.text} data-role="nl-text">
              {M.text}
            </p>
          </div>
          <form className={styles.form} onSubmit={enviar} data-role="nl-form">
            {ok ? (
              <p className={styles.feedback} role="status">
                {M.successMessage}
              </p>
            ) : (
              <>
                <label className={`${styles.field} ${styles.fieldName}`}>
                  {M.nameLabel}
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder={M.namePlaceholder}
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                  />
                </label>
                <label className={`${styles.field} ${styles.fieldEmail}`}>
                  {M.emailLabel}
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder={M.emailPlaceholder}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </label>
                <button type="submit" className={styles.submit} data-role="nl-submit">
                  {M.buttonLabel}
                </button>
              </>
            )}
            <p className={styles.privacy}>
              {M.privacyPrefix} <a href="#">{M.privacyLabel}</a>.
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

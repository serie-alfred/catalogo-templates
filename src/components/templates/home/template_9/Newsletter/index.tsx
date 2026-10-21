'use client';

import React, { useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter09` do faststore.starter (família 09, Editorial;
 * desenho `Newsletter09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá. Sem envio: o formulário só controla os campos (a mutation fica no starter).
 */

export default function Newsletter09() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className={styles.newsletter09Box}>
      <section className={styles.newsletter09} aria-label="Newsletter" data-role="nl-root">
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          <span className={styles.eyebrow} data-role="nl-eyebrow">
            Newsletter
          </span>
          <h2 className={styles.title} data-role="nl-title">
            Receba as novidades <em>primeiro</em>
          </h2>
          <p className={styles.text} data-role="nl-text">
            Lançamentos, reposições e o Diário, uma vez por semana. Nada além disso.
          </p>
          <form className={styles.form} onSubmit={e => e.preventDefault()} data-role="nl-form">
            <label className={`${styles.field} ${styles.fieldName}`}>
              <span className={styles.srOnly}>Seu nome</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                placeholder="Seu nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </label>
            <label className={`${styles.field} ${styles.fieldEmail}`}>
              <span className={styles.srOnly}>Seu e-mail</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder="Seu e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>
            <button type="submit" className={styles.submit} data-role="nl-submit">
              Assinar
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
          <p className={styles.privacy}>
            Ao assinar, você concorda com a <a href="#">Política de Privacidade</a>.
          </p>
        </div>
      </section>
    </div>
  );
}

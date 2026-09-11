'use client';

import React, { useState } from 'react';
import type { FormEvent } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter07` do faststore.starter — "Clube VIP": texto e
 * formulário em 2 colunas no desktop, empilhado no mobile, com conteúdos
 * próprios por breakpoint.
 *
 * O submit é o mesmo stub da origem (lá ele só dispara `generate_lead`); aqui
 * troca para a mensagem de sucesso e não emite evento — preview não rastreia.
 */
const conteudo = {
  eyebrow: 'Clube VIP Brasilusa',
  eyebrowMobile: 'Clube VIP',
  title: 'Receba inspirações e ofertas exclusivas',
  titleMobile: 'Receba inspirações e ofertas exclusivas',
  description:
    'Cadastre-se e tenha acesso antecipado a lançamentos, conteúdos de decoração e descontos especiais para nossos clientes VIP.',
  placeholder: 'Seu melhor e-mail',
  placeholderMobile: 'Seu e-mail',
  buttonLabel: 'Cadastrar',
  note: 'Ao cadastrar você concorda com nossa política de privacidade. Sem spam, prometemos.',
  successMessage: 'Pronto! Você entrou para o Clube VIP Brasilusa.',
};

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <div className={styles.newsletter07Root}>
      <div className={styles.desktop}>
        <div className={styles.section} data-role="nl-section">
          <div className={styles.text} data-role="nl-text">
            <p className={styles.eyebrow} data-role="nl-eyebrow">
              {conteudo.eyebrow}
            </p>
            <h2 className={styles.title} data-role="nl-title">
              {conteudo.title}
            </h2>
            <p className={styles.desc} data-role="nl-desc">
              {conteudo.description}
            </p>
          </div>
          <div>
            {done ? (
              <p className={styles.success}>{conteudo.successMessage}</p>
            ) : (
              <>
                <form
                  className={styles.form}
                  data-role="nl-form"
                  onSubmit={onSubmit}
                >
                  <input
                    className={styles.input}
                    data-role="nl-input"
                    type="email"
                    required
                    placeholder={conteudo.placeholder}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    aria-label={conteudo.placeholder}
                  />
                  <button
                    className={styles.button}
                    data-role="nl-button"
                    type="submit"
                  >
                    {conteudo.buttonLabel}
                  </button>
                </form>
                <p className={styles.note} data-role="nl-note">
                  {conteudo.note}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.mobile}>
        <div className={styles.mSection} data-role="m-nl-section">
          <p className={styles.mEyebrow} data-role="m-nl-eyebrow">
            {conteudo.eyebrowMobile}
          </p>
          <h2 className={styles.mTitle} data-role="m-nl-title">
            {conteudo.titleMobile}
          </h2>
          {done ? (
            <p className={styles.success}>{conteudo.successMessage}</p>
          ) : (
            <form
              className={styles.mForm}
              data-role="m-nl-form"
              onSubmit={onSubmit}
            >
              <input
                className={styles.input}
                data-role="m-nl-input"
                type="email"
                required
                placeholder={conteudo.placeholderMobile}
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label={conteudo.placeholderMobile}
              />
              <button
                className={styles.button}
                data-role="m-nl-button"
                type="submit"
              >
                {conteudo.buttonLabel}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import type { FormEvent } from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter07` do faststore.starter — "Clube VIP": texto e
 * formulário em 2 colunas no desktop, empilhado no mobile, com conteúdos
 * próprios por breakpoint.
 *
 * O submit é o mesmo stub da origem (lá ele só dispara `generate_lead`); aqui
 * troca para a mensagem de sucesso e não emite evento — preview não rastreia.
 * Conteúdo = o mock.ts de lá, por baixo do que o CS subir (`useConteudoDaSecao`,
 * campos do schema de lá).
 */
interface Newsletter07Conteudo {
  eyebrow?: string;
  eyebrowMobile?: string;
  title?: string;
  titleMobile?: string;
  description?: string;
  placeholder?: string;
  placeholderMobile?: string;
  buttonLabel?: string;
  note?: string;
  successMessage?: string;
}

const MOCK: Newsletter07Conteudo = {
  eyebrow: 'Clube VIP',
  eyebrowMobile: 'Clube VIP',
  title: 'Receba inspirações e ofertas exclusivas',
  titleMobile: 'Receba inspirações e ofertas exclusivas',
  description:
    'Cadastre-se e tenha acesso antecipado a lançamentos, conteúdos de decoração e descontos especiais para nossos clientes VIP.',
  placeholder: 'Seu melhor e-mail',
  placeholderMobile: 'Seu e-mail',
  buttonLabel: 'Cadastrar',
  note: 'Ao cadastrar você concorda com nossa política de privacidade. Sem spam, prometemos.',
  successMessage: 'Pronto! Você entrou para o Clube VIP.',
};

export default function Newsletter() {
  const {
    eyebrow,
    eyebrowMobile,
    title,
    titleMobile,
    description,
    placeholder,
    placeholderMobile,
    buttonLabel,
    note,
    successMessage,
  } = useConteudoDaSecao(MOCK);
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
            {eyebrow && (
              <p className={styles.eyebrow} data-role="nl-eyebrow">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className={styles.title} data-role="nl-title">
                {title}
              </h2>
            )}
            {description && (
              <p className={styles.desc} data-role="nl-desc">
                {description}
              </p>
            )}
          </div>
          <div>
            {done ? (
              <p className={styles.success}>{successMessage}</p>
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
                    placeholder={placeholder}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    aria-label={placeholder}
                  />
                  <button
                    className={styles.button}
                    data-role="nl-button"
                    type="submit"
                  >
                    {buttonLabel}
                  </button>
                </form>
                {note && (
                  <p className={styles.note} data-role="nl-note">
                    {note}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.mobile}>
        <div className={styles.mSection} data-role="m-nl-section">
          {eyebrowMobile && (
            <p className={styles.mEyebrow} data-role="m-nl-eyebrow">
              {eyebrowMobile}
            </p>
          )}
          {titleMobile && (
            <h2 className={styles.mTitle} data-role="m-nl-title">
              {titleMobile}
            </h2>
          )}
          {done ? (
            <p className={styles.success}>{successMessage}</p>
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
                placeholder={placeholderMobile}
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label={placeholderMobile}
              />
              <button
                className={styles.button}
                data-role="m-nl-button"
                type="submit"
              >
                {buttonLabel}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Newsletter.conteudoPadrao = MOCK;

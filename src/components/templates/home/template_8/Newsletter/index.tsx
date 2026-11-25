import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter08` do faststore.starter (família 08, Figma "Templates - Serie A").
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS
 * é derivado do SCSS de lá (`yarn derivar:css`). Conteúdo = o mock.ts de lá, por
 * baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá). O
 * envelope `.…Box` é o container das regras mobile (a raiz e o bloco são o mesmo
 * elemento, e uma @container não estiliza o próprio container).
 */

const FONTES =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap';

interface Newsletter08Conteudo {
  title?: string;
  text?: string;
  formTitle?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  buttonLabel?: string;
}

const MOCK: Newsletter08Conteudo = {
  title: 'Lorem ipsum dolor sit amet.',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit maecenas volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit maecenas volutpat.',
  formTitle: 'Lorem ipsum dolor sit amet.',
  namePlaceholder: 'Lorem ipsum',
  emailPlaceholder: 'Lorem ipsum',
  buttonLabel: 'Veja Coleção',
};

export default function Newsletter08() {
  const {
    title,
    text,
    formTitle,
    namePlaceholder,
    emailPlaceholder,
    buttonLabel,
  } = useConteudoDaSecao(MOCK);

  return (
    <div className={styles.newsletter08Box}>
      <section
        className={`${styles.newsletter08} ${styles.newsletter}`}
        data-role="nl-root"
      >
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.newsletterPanel}>
          {title && (
            <h2 className={styles.newsletterTitle} data-role="nl-title">
              {title}
            </h2>
          )}
          {text && (
            <p className={styles.newsletterText} data-role="nl-text">
              {text}
            </p>
          )}
        </div>
        <div className={styles.newsletterForm}>
          {formTitle && (
            <p className={styles.newsletterFormTitle} data-role="nl-form-title">
              {formTitle}
            </p>
          )}
          <form
            className={styles.newsletterFields}
            onSubmit={e => e.preventDefault()}
          >
            <label className={styles.newsletterField}>
              <span className={styles.srOnly}>{namePlaceholder}</span>
              <input
                className={styles.newsletterInput}
                data-role="nl-input"
                type="text"
                name="name"
                placeholder={namePlaceholder}
              />
            </label>
            <label className={styles.newsletterField}>
              <span className={styles.srOnly}>{emailPlaceholder}</span>
              <input
                className={styles.newsletterInput}
                data-role="nl-input"
                type="email"
                name="email"
                placeholder={emailPlaceholder}
              />
            </label>
            <button
              type="submit"
              className={styles.newsletterButton}
              data-role="nl-button"
            >
              {buttonLabel}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Newsletter08.conteudoPadrao = MOCK;

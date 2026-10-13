import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/Newsletter08` do faststore.starter (família 08, Figma "Templates - Serie A").
 * Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1; o CSS
 * é derivado do SCSS de lá (`yarn derivar:css`). Conteúdo = o mock.ts de lá. O
 * envelope `.…Box` é o container das regras mobile (a raiz e o bloco são o mesmo
 * elemento, e uma @container não estiliza o próprio container).
 */

const FONTES =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap';

export default function Newsletter08() {
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
          <h2 className={styles.newsletterTitle} data-role="nl-title">
            Lorem ipsum dolor sit amet.
          </h2>
          <p className={styles.newsletterText} data-role="nl-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit
            maecenas volutpat. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Blandit maecenas volutpat.
          </p>
        </div>
        <div className={styles.newsletterForm}>
          <p className={styles.newsletterFormTitle} data-role="nl-form-title">
            Lorem ipsum dolor sit amet.
          </p>
          <form
            className={styles.newsletterFields}
            onSubmit={e => e.preventDefault()}
          >
            <label className={styles.newsletterField}>
              <span className={styles.srOnly}>Lorem ipsum</span>
              <input
                className={styles.newsletterInput}
                data-role="nl-input"
                type="text"
                name="name"
                placeholder="Lorem ipsum"
              />
            </label>
            <label className={styles.newsletterField}>
              <span className={styles.srOnly}>Lorem ipsum</span>
              <input
                className={styles.newsletterInput}
                data-role="nl-input"
                type="email"
                name="email"
                placeholder="Lorem ipsum"
              />
            </label>
            <button
              type="submit"
              className={styles.newsletterButton}
              data-role="nl-button"
            >
              Veja Coleção
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

import React from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Editorial09` do faststore.starter (família 09, Editorial;
 * desenho `Editorial09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá, sem arte (vale o placeholder da caixa).
 */

const POSTS = [
  { kicker: 'Cuidados', title: 'Linho: como cuidar para durar' },
  { kicker: 'Estilo', title: 'Cinco formas de usar o blazer cru' },
  { kicker: 'Ateliê', title: 'Bastidores da nova coleção' },
];

export default function Editorial09() {
  const href = '#';

  return (
    <div className={styles.editorial09Box}>
      <section className={styles.editorial09} aria-label="Diário · Estilo" data-role="ed-root">
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          <article className={styles.feature}>
            <a
              className={styles.media}
              href={href}
              aria-label="Como montar um armário de poucas peças"
              tabIndex={-1}
              data-role="ed-image"
            />
            <div className={styles.copy}>
              <span className={styles.eyebrow} data-role="ed-eyebrow">
                <span className={styles.eyebrowRule} aria-hidden="true" />
                Diário · Estilo
              </span>
              <h2 className={styles.title} data-role="ed-title">
                Como montar um armário de <em>poucas peças</em>
              </h2>
              <p className={styles.text} data-role="ed-text">
                Menos peças, mais combinações. Separamos o que vale ter, o que vale repetir e como
                pensar o armário por estação, sem perder a vontade de se vestir.
              </p>
              <a className={styles.cta} href={href} data-role="ed-cta">
                Ler matéria
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
              </a>
            </div>
          </article>
          <ul className={styles.posts}>
            {POSTS.map(p => (
              <li key={p.title} data-role="ed-post">
                <a className={styles.post} href={href}>
                  <span className={styles.thumb} />
                  <span className={styles.postCopy}>
                    <span className={styles.kicker}>{p.kicker}</span>
                    <span className={styles.postTitle}>{p.title}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

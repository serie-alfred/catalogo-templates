'use client';

import React, { useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/ClientReview09` do faststore.starter (família 09, Editorial;
 * desenho `ClientReview09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá (cinco depoimentos iguais; nome e cidade são marcadores do desenho).
 */

type Review = {
  text: string;
  rating: number;
  author: string;
  productPrefix: string;
  productName: string;
  productUrl: string;
};

const REVIEW: Review = {
  text: 'Comprei o vestido de linho pensando no verão e acabei usando o ano inteiro. O caimento é exatamente o da foto.',
  rating: 5,
  author: '[Nome da cliente] · [Cidade]',
  productPrefix: 'Comprou:',
  productName: 'Vestido Midi Linho Areia',
  productUrl: '#',
};

const REVIEWS: Review[] = [REVIEW, REVIEW, REVIEW, REVIEW, REVIEW];

const Seta = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'} />
  </svg>
);

const Estrela = ({ cheia }: { cheia: boolean }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill={cheia ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={cheia ? 0 : 1.2}
    aria-hidden="true"
  >
    <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
  </svg>
);

const dois = (n: number) => String(n).padStart(2, '0');

export default function ClientReview09() {
  const [atual, setAtual] = useState(0);
  const total = REVIEWS.length;
  const r = REVIEWS[Math.min(atual, total - 1)];
  const nota = Math.max(0, Math.min(5, Math.round(r.rating)));
  const ir = (i: number) => setAtual((i + total) % total);

  return (
    <div className={styles.clientReview09Box}>
      <section className={styles.clientReview09} aria-label="Quem veste" data-role="cr-root">
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          <span className={styles.eyebrow} data-role="cr-eyebrow">
            <span className={styles.rule} aria-hidden="true" />
            Quem veste
            <span className={styles.rule} aria-hidden="true" />
          </span>
          <figure className={styles.figure} aria-live="polite">
            <blockquote className={styles.quote} data-role="cr-quote">
              “{r.text}”
            </blockquote>
            <figcaption className={styles.caption}>
              {nota > 0 && (
                <>
                  <span className={styles.srOnly}>Nota {nota} de 5</span>
                  <span className={styles.stars} aria-hidden="true" data-role="cr-stars">
                    {[1, 2, 3, 4, 5].map(n => (
                      <Estrela key={n} cheia={n <= nota} />
                    ))}
                  </span>
                </>
              )}
              <span className={styles.author} data-role="cr-author">
                {r.author}
              </span>
              <span className={styles.product}>
                {`${r.productPrefix} `}
                <a href={r.productUrl}>{r.productName}</a>
              </span>
            </figcaption>
          </figure>
          {total > 1 && (
            <div className={styles.nav}>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => ir(atual - 1)}
                aria-label="Depoimento anterior"
              >
                <Seta dir="prev" />
              </button>
              <span className={styles.count}>
                {dois(atual + 1)} <span className={styles.muted}>/ {dois(total)}</span>
              </span>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => ir(atual + 1)}
                aria-label="Próximo depoimento"
              >
                <Seta dir="next" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

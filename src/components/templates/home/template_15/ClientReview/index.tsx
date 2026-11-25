'use client';
import React, { useState } from 'react';

import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/ClientReview15` do faststore.starter (família 15, Luxo; desenho
 * `ClientReview15`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá: três depoimentos por
 * vez no desktop (a janela dá a volta na lista), um no mobile, com as setas e "1 / 3".
 *
 * Divergência deliberada: o envelope `.clientReview15Box` é o container das `@container`.
 */

type Review = {
  rating?: number;
  text?: string;
  author?: string;
  location?: string;
  productName?: string;
};

interface ClientReview15Conteudo {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  reviews: Review[];
}

const MOCK: ClientReview15Conteudo = {
  eyebrow: 'Depoimentos',
  title: 'Palavras de quem',
  titleEmphasis: 'escolheu',
  reviews: [
  {
    rating: 5,
    text: 'Pedi o solitário para o noivado e chegou num estojo impecável, com cartão escrito à mão. Ela chorou antes de abrir.',
    author: '[Nome]',
    location: '[Cidade]',
    productName: 'Anel Solitário Ouro 18k',
  },
  {
    rating: 5,
    text: 'O relógio é ainda mais bonito pessoalmente. O atendimento me ajudou a escolher a pulseira certa por vídeo.',
    author: '[Nome]',
    location: '[Cidade]',
    productName: 'Relógio Automático Cassis 38 mm',
  },
  {
    rating: 5,
    text: 'Uso o Ambre Nuit há um ano e ainda me perguntam qual é o perfume. Fixação de verdade, do jantar até o dia seguinte.',
    author: '[Nome]',
    location: '[Cidade]',
    productName: 'Eau de Parfum Ambre Nuit 100 ml',
  },
  ],
};

const Estrela = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  </svg>
);

const Seta = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ClientReview15() {
  const { eyebrow, title, titleEmphasis, reviews } = useConteudoDaSecao(MOCK);
  const [atual, setAtual] = useState(0);
  if (!reviews.length) return null;
  const total = reviews.length;
  const ir = (i: number) => setAtual((i + total) % total);
  // Três por vez no desktop, um no mobile: a janela começa no atual e dá a volta na lista.
  const janela = Array.from({ length: Math.min(total, 3) }, (_, k) => (atual + k) % total);

  return (
    <div className={styles.clientReview15Box}>
      <section className={styles.clientReview15} aria-label={[title, titleEmphasis].filter(Boolean).join(' ') || 'Depoimentos'} data-role="cr-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          {(eyebrow || title || titleEmphasis) && (
            <div className={styles.head}>
              {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
              {(title || titleEmphasis) && (
                <h2 className={styles.title} data-role="cr-title">
                  {title} {titleEmphasis && <em>{titleEmphasis}</em>}
                </h2>
              )}
            </div>
          )}
          <div className={styles.grid} aria-live="polite">
            {janela.map(i => {
              const r = reviews[i];
              const nota = Math.max(0, Math.min(5, Math.round(Number(r.rating) || 0)));
              const quem = [r.author, r.location].filter(Boolean).join(' · ');
              return (
                <article key={i} className={styles.card} data-role="cr-item">
                  {nota > 0 && (
                    <div className={styles.stars}>
                      <span className={styles.srOnly}>{nota} de 5 estrelas</span>
                      {Array.from({ length: nota }, (_, k) => (
                        <Estrela key={k} />
                      ))}
                    </div>
                  )}
                  {r.text && (
                    <p className={styles.quote} data-role="cr-text">
                      “{r.text}”
                    </p>
                  )}
                  <span className={styles.rule} aria-hidden="true" />
                  {(quem || r.productName) && (
                    <div className={styles.person}>
                      {quem && (
                        <span className={styles.author} data-role="cr-author">
                          {quem}
                        </span>
                      )}
                      {r.productName && <span className={styles.product}>{r.productName}</span>}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          {total > 1 && (
            <div className={styles.nav}>
              <button type="button" className={styles.arrow} onClick={() => ir(atual - 1)} aria-label="Depoimento anterior">
                <Seta dir="prev" />
              </button>
              <span className={styles.count}>
                {atual + 1} <span className={styles.muted}>/ {total}</span>
              </span>
              <button type="button" className={`${styles.arrow} ${styles.arrowNext}`} onClick={() => ir(atual + 1)} aria-label="Próximo depoimento">
                <Seta dir="next" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ClientReview15.conteudoPadrao = MOCK;

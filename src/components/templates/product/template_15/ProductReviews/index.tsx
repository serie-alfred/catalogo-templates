'use client';

import React, { useId, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

/**
 * Espelha `organisms/ProductReviews15` do faststore.starter (família 15, Luxo; desenho
 * `ProductReviews15` / `-mobile`): a chamada dourada e o título em serifa sobre o fio dourado;
 * à esquerda a média em serifa com as estrelas douradas e a contagem, as barras finas 5→1 e
 * "Escrever avaliação" (abre o formulário); à direita a lista entre fios e a paginação em
 * quadrados (a atual cheia no texto). Mesmo markup, classes e `data-role`; o CSS é derivado do
 * SCSS de lá.
 *
 * Conteúdo = o `mock.ts` de lá: 4,9 com 128 avaliações (113/11/4/0/0), as 3 avaliações do
 * desenho repetidas em 3 páginas de 3. Sai: `usePDP`, a moldura do Trustvox (lá só com a loja
 * configurada) e o Reviews and Ratings (consulta e envio; o envio dá sucesso local, como no
 * palco de lá).
 */

type Review15 = {
  id: string;
  title: string;
  text: string;
  rating: number;
  reviewerName: string;
  reviewDateTime: string;
  location: string;
};

const EYEBROW = 'Opiniões';
const TITLE = 'Avaliações';
const COUNT_LABEL = 'avaliações';
const STAR_SINGULAR = 'estrela';
const STAR_PLURAL = 'estrelas';
const WRITE_LABEL = 'Escrever avaliação';
const PREV_LABEL = 'Página anterior';
const NEXT_LABEL = 'Próxima página';
const PER_PAGE = 3;
const FORM = {
  rating: 'Sua nota',
  title: 'Título',
  text: 'Sua avaliação',
  name: 'Seu nome',
  submit: 'Enviar avaliação',
  success: 'Obrigado. A sua avaliação aparece aqui depois da moderação.',
};

const SUMMARY = { average: 4.9, totalCount: 128, starsFive: 113, starsFour: 11, starsThree: 4, starsTwo: 0, starsOne: 0 };

const BASE = [
  {
    rating: 5,
    title: 'Mais bonito do que nas fotos',
    text: 'O brilho do diamante impressiona. Chegou num estojo lindo, com certificado e um cartão escrito à mão. O pedido de noivado foi perfeito.',
  },
  {
    rating: 4,
    title: 'Acabamento impecável',
    text: 'Peça delicada e muito bem-feita. Pedi um número acima por segurança e precisei ajustar; o ateliê fez sem custo e devolveu em poucos dias.',
  },
  {
    rating: 5,
    title: 'Atendimento à altura da joia',
    text: 'Tirei dúvidas sobre o aro pelo WhatsApp antes de comprar e fui muito bem orientada. Entrega rápida e com seguro.',
  },
];
const REVIEWS: Review15[] = [0, 1, 2].flatMap(p =>
  BASE.map((r, i) => ({
    ...r,
    id: `r${p * 3 + i + 1}`,
    reviewerName: '[Nome]',
    location: '[Cidade]',
    reviewDateTime: '2026-10-14T12:00:00Z',
  }))
);

const STAR_PATH = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';
/** `n` estrelas cheias; com `of`, as que faltam até `of` ficam apagadas. */
const Stars = ({ n, of, className }: { n: number; of?: number; className: string }) => (
  <span className={className} aria-hidden="true">
    {Array.from({ length: of ?? n }, (_, i) => (
      <svg key={i} viewBox="0 0 24 24" fill="currentColor" opacity={i < n ? 1 : 0.28}>
        <path d={STAR_PATH} />
      </svg>
    ))}
  </span>
);
const Star = ({ filled }: { filled: boolean }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d={STAR_PATH} />
  </svg>
);
const Arrow = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

/** "14/10/2026", como no desenho. */
const formatDate = (raw: string) => {
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
};
const decimal = (n: number) => n.toFixed(1).replace('.', ',');
const count = (n: number) => n.toLocaleString('pt-BR');
/** Janela de até 3 números de página ao redor da atual (o desenho mostra 3). */
const pageWindow = (current: number, total: number) => {
  const start = Math.max(1, Math.min(current - 1, total - 2));
  return Array.from({ length: Math.min(3, total) }, (_, i) => start + i);
};

export default function ProductReviews15() {
  const uid = useId();
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [sent, setSent] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const total = SUMMARY.totalCount;
  const avg = SUMMARY.average;
  const dist = [
    { stars: 5, count: SUMMARY.starsFive },
    { stars: 4, count: SUMMARY.starsFour },
    { stars: 3, count: SUMMARY.starsThree },
    { stars: 2, count: SUMMARY.starsTwo },
    { stars: 1, count: SUMMARY.starsOne },
  ];
  const from = (page - 1) * PER_PAGE;
  const reviews = REVIEWS.slice(from, from + PER_PAGE);
  const pages = Math.max(1, Math.ceil(REVIEWS.length / PER_PAGE));

  const goPage = (n: number) => {
    setPage(Math.max(1, Math.min(pages, n)));
    listRef.current?.scrollIntoView({ block: 'nearest' });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating >= 1) setSent(true);
  };

  return (
    <div className={styles.productReviews15Box}>
      <section id="avaliacoes" className={styles.productReviews15} aria-label={TITLE} data-role="rv-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          <div className={styles.head} data-role="rv-head">
            <span className={styles.eyebrow}>{EYEBROW}</span>
            <h2 className={styles.title} data-role="rv-title">
              {TITLE}
            </h2>
          </div>

          <div className={styles.body}>
            <aside className={styles.summary} data-role="rv-summary">
              <div className={styles.average} data-role="rv-average">
                <span className={styles.avgValue} aria-hidden="true">
                  {decimal(avg)}
                </span>
                <span className={styles.avgSide}>
                  <span className={styles.srOnly}>Nota média {decimal(avg)} de 5</span>
                  <Stars n={Math.round(avg)} of={5} className={styles.starsBig} />
                  <span className={styles.avgCount}>
                    {count(total)} {COUNT_LABEL}
                  </span>
                </span>
              </div>
              <ul className={styles.dist} aria-label="Distribuição das notas" data-role="rv-distribution">
                {dist.map(d => {
                  const pct = total ? Math.round((d.count / total) * 100) : 0;
                  return (
                    <li key={d.stars} className={styles.distItem}>
                      <span className={styles.distLabel}>
                        {d.stars}
                        <span className={styles.srOnly}>
                          {' '}
                          {d.stars === 1 ? STAR_SINGULAR : STAR_PLURAL}: {pct}%
                        </span>
                      </span>
                      <span className={styles.bar} aria-hidden="true">
                        {pct > 0 && <span className={styles.barFill} style={{ width: `${pct}%` }} />}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                className={styles.write}
                onClick={() => setFormOpen(o => !o)}
                aria-expanded={formOpen}
                aria-controls={`${uid}-form`}
                data-role="rv-write"
              >
                {WRITE_LABEL}
              </button>

              {formOpen && (
                <form id={`${uid}-form`} className={styles.form} onSubmit={onSubmit} data-role="rv-form">
                  {sent ? (
                    <p className={styles.formOk} role="status">
                      {FORM.success}
                    </p>
                  ) : (
                    <>
                      <fieldset className={styles.rate}>
                        <legend className={styles.label}>{FORM.rating}</legend>
                        <div className={styles.rateStars}>
                          {[1, 2, 3, 4, 5].map(n => (
                            <label key={n} className={styles.rateStar}>
                              <input type="radio" name={`${uid}-rating`} value={n} checked={rating === n} onChange={() => setRating(n)} required />
                              <span className={styles.srOnly}>
                                {n} {n === 1 ? STAR_SINGULAR : STAR_PLURAL}
                              </span>
                              <Star filled={n <= rating} />
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <label className={styles.field}>
                        <span className={styles.label}>{FORM.title}</span>
                        <input type="text" required maxLength={120} value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>{FORM.text}</span>
                        <textarea required rows={4} maxLength={2000} value={reviewText} onChange={e => setReviewText(e.target.value)} />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>{FORM.name}</span>
                        <input type="text" required autoComplete="name" maxLength={80} value={reviewName} onChange={e => setReviewName(e.target.value)} />
                      </label>
                      <button type="submit" className={styles.submit} disabled={rating < 1}>
                        {FORM.submit}
                      </button>
                    </>
                  )}
                </form>
              )}
            </aside>

            <div ref={listRef} className={styles.list} data-role="rv-list">
              {reviews.map(r => {
                const nota = Math.max(0, Math.min(5, Math.round(r.rating)));
                const author = [r.reviewerName, r.location].filter(Boolean).join(' · ');
                return (
                  <article key={r.id} className={styles.review} data-role="rv-review">
                    <div className={styles.reviewTop}>
                      <span className={styles.srOnly}>{nota} de 5 estrelas</span>
                      {nota > 0 && <Stars n={nota} className={styles.starsSmall} />}
                      <span className={styles.date}>{formatDate(r.reviewDateTime)}</span>
                    </div>
                    <h3 className={styles.reviewTitle}>{r.title}</h3>
                    <p className={styles.reviewText}>{r.text}</p>
                    <span className={styles.author}>{author}</span>
                  </article>
                );
              })}

              {pages > 1 && (
                <nav className={styles.pager} aria-label="Páginas de avaliações" data-role="rv-pager">
                  {page > 1 && (
                    <button type="button" className={styles.pagerBtn} onClick={() => goPage(page - 1)} aria-label={PREV_LABEL}>
                      <Arrow dir="prev" />
                    </button>
                  )}
                  {pageWindow(page, pages).map(n => (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.pagerBtn}${n === page ? ` ${styles.pagerOn}` : ''}`}
                      onClick={() => goPage(n)}
                      aria-current={n === page ? 'page' : undefined}
                    >
                      {n}
                    </button>
                  ))}
                  {page < pages && (
                    <button type="button" className={styles.pagerBtn} onClick={() => goPage(page + 1)} aria-label={NEXT_LABEL}>
                      <Arrow dir="next" />
                    </button>
                  )}
                </nav>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

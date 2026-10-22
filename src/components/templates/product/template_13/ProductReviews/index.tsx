'use client';

import React, { useId, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

/**
 * Espelha `organisms/ProductReviews13` do faststore.starter (família 13, Noturno; desenho
 * `ProductReviews13` / `-mobile`): o título enorme em condensada; à esquerda a média gigante
 * com as estrelas verdes e a contagem, as barras 5→1 e "Escrever avaliação" (abre o
 * formulário); à direita a lista entre filetes e a paginação em quadrados (a atual cheia em
 * verde). Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Conteúdo = o `mock.ts` de lá: 4,8 com 312 avaliações (256/44/12/0/0), as 3 avaliações do
 * desenho repetidas em 3 páginas de 3. Sai: `usePDP`, a moldura do Trustvox (lá só com a loja
 * configurada) e o Reviews and Ratings (consulta e envio; o envio dá sucesso local, como no
 * palco de lá).
 */

type Review13 = {
  id: string;
  title: string;
  text: string;
  rating: number;
  reviewerName: string;
  reviewDateTime: string;
  location: string;
};

/* ── rótulos (o mock.ts de lá) ── */
const L = {
  title: 'Avaliações',
  countLabel: 'avaliações',
  starSingular: 'estrela',
  starPlural: 'estrelas',
  writeLabel: 'Escrever avaliação',
  prevLabel: 'Página anterior',
  nextLabel: 'Próxima página',
  formRatingLabel: 'Sua nota',
  formTitleLabel: 'Título',
  formTextLabel: 'Sua avaliação',
  formNameLabel: 'Seu nome',
  formSubmitLabel: 'Enviar avaliação',
  formSuccess: 'Valeu! Sua avaliação aparece aqui depois da moderação.',
};
const PER_PAGE = 3;

/* ── dados de exemplo (o mock.ts de lá) ── */
const SUMMARY = { average: 4.8, totalCount: 312, starsFive: 256, starsFour: 44, starsThree: 12, starsTwo: 0, starsOne: 0 };
const BASE: Array<Pick<Review13, 'rating' | 'title' | 'text'>> = [
  {
    rating: 5,
    title: 'Conforto de sobra',
    text: 'Corro 8 km três vezes por semana e o amortecimento segura bem. Na volta à noite o refletivo chama atenção mesmo.',
  },
  {
    rating: 4,
    title: 'Forma um pouco justa',
    text: 'Bonito demais e leve. Achei a forma um pouco estreita no começo, mas lacei mais solto e resolveu.',
  },
  {
    rating: 5,
    title: 'Valeu cada real',
    text: 'Chegou em dois dias, caixa impecável. Uso no dia a dia e no treino, o solado não escorrega no piso molhado.',
  },
];
const REVIEWS: Review13[] = [0, 1, 2].flatMap(p =>
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
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

export default function ProductReviews13() {
  const uid = useId();
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [formOk, setFormOk] = useState(false);
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
    if (rating < 1) return;
    setFormOk(true);
  };

  return (
    <div className={styles.productReviews13Box}>
      <section id="avaliacoes" className={styles.productReviews13} aria-label={L.title} data-role="rv-root">
        <link rel="stylesheet" href={FONTES_13} />
        <div className={styles.inner}>
          <h2 className={styles.title} data-role="rv-title">
            {L.title}
          </h2>

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
                    {count(total)} {L.countLabel}
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
                          {d.stars === 1 ? L.starSingular : L.starPlural}: {pct}%
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
                {L.writeLabel}
              </button>

              {formOpen && (
                <form id={`${uid}-form`} className={styles.form} onSubmit={onSubmit} data-role="rv-form">
                  {formOk ? (
                    <p className={styles.formOk} role="status">
                      {L.formSuccess}
                    </p>
                  ) : (
                    <>
                      <fieldset className={styles.rate}>
                        <legend className={styles.label}>{L.formRatingLabel}</legend>
                        <div className={styles.rateStars}>
                          {[1, 2, 3, 4, 5].map(n => (
                            <label key={n} className={styles.rateStar}>
                              <input type="radio" name={`${uid}-rating`} value={n} checked={rating === n} onChange={() => setRating(n)} required />
                              <span className={styles.srOnly}>
                                {n} {n === 1 ? L.starSingular : L.starPlural}
                              </span>
                              <Star filled={n <= rating} />
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <label className={styles.field}>
                        <span className={styles.label}>{L.formTitleLabel}</span>
                        <input type="text" required maxLength={120} value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>{L.formTextLabel}</span>
                        <textarea required rows={4} maxLength={2000} value={reviewText} onChange={e => setReviewText(e.target.value)} />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>{L.formNameLabel}</span>
                        <input type="text" required autoComplete="name" maxLength={80} value={reviewName} onChange={e => setReviewName(e.target.value)} />
                      </label>
                      <button type="submit" className={styles.submit} disabled={rating < 1}>
                        {L.formSubmitLabel}
                      </button>
                    </>
                  )}
                </form>
              )}
            </aside>

            <div ref={listRef} className={styles.list} data-role="rv-list">
              {reviews.map((r, i) => {
                const nota = Math.max(0, Math.min(5, Math.round(r.rating)));
                const author = [r.reviewerName, r.location].map(s => s.trim()).filter(Boolean).join(' · ');
                return (
                  <article key={r.id ?? i} className={styles.review} data-role="rv-review">
                    <div className={styles.reviewTop}>
                      <span className={styles.srOnly}>{nota} de 5 estrelas</span>
                      {nota > 0 && <Stars n={nota} className={styles.starsSmall} />}
                      <span className={styles.date}>{formatDate(r.reviewDateTime)}</span>
                    </div>
                    <h3 className={styles.reviewTitle}>{r.title}</h3>
                    <p className={styles.reviewText}>{r.text}</p>
                    {author && <span className={styles.author}>{author}</span>}
                  </article>
                );
              })}

              {pages > 1 && (
                <nav className={styles.pager} aria-label="Páginas de avaliações" data-role="rv-pager">
                  {page > 1 && (
                    <button type="button" className={styles.pagerBtn} onClick={() => goPage(page - 1)} aria-label={L.prevLabel}>
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
                    <button type="button" className={styles.pagerBtn} onClick={() => goPage(page + 1)} aria-label={L.nextLabel}>
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

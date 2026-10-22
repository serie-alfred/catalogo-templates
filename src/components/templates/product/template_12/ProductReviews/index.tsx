'use client';

import React, { useId, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

/**
 * Espelha `organisms/ProductReviews12` do faststore.starter (família 12, Suave; desenho
 * `ProductReviews12`): a CASCA sem Trustvox — a cabeça (título em serifa + "Escrever
 * avaliação" em pílula), o cartão branco do resumo (média, estrelas, contagem e as barras
 * 5→1 com o %) e a lista em cartões (avatar com as iniciais, nome, data, estrelas, título e
 * texto) com "Ver mais avaliações". Mesmo markup, classes e `data-role`; o CSS é derivado do
 * SCSS de lá.
 *
 * Dados = o `mock.ts` de lá (resumo e as 6 avaliações em blocos de 3). Saem o `usePDP`, as
 * consultas do Reviews and Ratings e o ramo do Trustvox (só a moldura com o widget de
 * terceiros); o formulário abre e "envia" só no estado local, como lá no palco.
 */
interface Review12 {
  id?: string;
  title?: string;
  text?: string;
  rating?: number;
  reviewerName?: string;
  reviewDateTime?: string;
}

/* ── rótulos (o mock.ts de lá) ── */
const L = {
  title: 'Avaliações',
  countLabel: 'avaliações',
  starSingular: 'estrela',
  starPlural: 'estrelas',
  writeLabel: 'Escrever avaliação',
  emptyText: 'Este produto ainda não tem avaliações. Conte o que achou.',
  moreLabel: 'Ver mais avaliações',
  formRatingLabel: 'Sua nota',
  formTitleLabel: 'Título',
  formTextLabel: 'Sua avaliação',
  formNameLabel: 'Seu nome',
  formSubmitLabel: 'Enviar avaliação',
  formSuccess: 'Obrigada! Sua avaliação aparece aqui depois da moderação.',
};
const PER_PAGE = 3;

/* ── resumo e avaliações (o mock.ts de lá) ── */
const SUMMARY = {
  average: 4.9,
  totalCount: 1240,
  starsFive: 1066,
  starsFour: 124,
  starsThree: 37,
  starsTwo: 13,
  starsOne: 0,
};
const BASE: Array<Pick<Review12, 'rating' | 'reviewerName'>> = [
  { rating: 5, reviewerName: 'Ana Barros' },
  { rating: 4, reviewerName: 'Carla Dias' },
  { rating: 5, reviewerName: 'Eva Freitas' },
];
const REVIEWS: Review12[] = [0, 1].flatMap(p =>
  BASE.map((r, i) => ({
    ...r,
    id: `r${p * 3 + i + 1}`,
    reviewDateTime: '2026-10-14T12:00:00Z',
    title: '[Título da avaliação]',
    text: '[Texto da avaliação publicada pela cliente, sobre textura, cheiro, resultado e uso no dia a dia.]',
  }))
);

const STAR_PATH =
  'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';
// Os três tons dos avatares, na ordem do desenho.
const TONS = ['toneRose', 'toneSage', 'toneLilac'];

/** A régua de estrelas do desenho: só as cheias, cada uma 25 unidades (viewBox 124 para 5). */
const StarsRow = ({ n, className }: { n: number; className: string }) => {
  const k = Math.max(1, Math.min(5, n));
  return (
    <svg
      className={className}
      viewBox={`0 0 ${k * 25 - 1} 24`}
      fill="currentColor"
      aria-hidden="true"
    >
      {Array.from({ length: k }, (_, i) => (
        <path
          key={i}
          d={STAR_PATH}
          transform={i ? `translate(${i * 25} 0)` : undefined}
        />
      ))}
    </svg>
  );
};
const Star = ({ size, filled }: { size: number; filled: boolean }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d={STAR_PATH} />
  </svg>
);

/** "14/10/2026", como no desenho (dd/mm/aaaa). */
const formatDate = (raw?: string) => {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
};
const decimal = (n: number) => n.toFixed(1).replace('.', ',');
const count = (n: number) => n.toLocaleString('pt-BR');
const initials = (name?: string) =>
  String(name ?? '')
    .replace(/[^A-Za-zÀ-ÿ\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]!.toUpperCase())
    .join('');

export default function ProductReviews12() {
  const uid = useId();
  const [shown, setShown] = useState(PER_PAGE);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [enviado, setEnviado] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const total = SUMMARY.totalCount;
  const avg = SUMMARY.average;
  const dist = [
    { stars: 5, count: SUMMARY.starsFive },
    { stars: 4, count: SUMMARY.starsFour },
    { stars: 3, count: SUMMARY.starsThree },
    { stars: 2, count: SUMMARY.starsTwo },
    { stars: 1, count: SUMMARY.starsOne },
  ];
  const reviews = REVIEWS.slice(0, shown);
  const hasMore = reviews.length < REVIEWS.length;

  const toggleForm = () => {
    setFormOpen(o => !o);
    window.setTimeout(
      () => formRef.current?.scrollIntoView({ block: 'nearest' }),
      0
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;
    setEnviado(true);
  };

  const writeButton = (extra: string) => (
    <button
      type="button"
      className={`${styles.write} ${extra}`}
      onClick={toggleForm}
      aria-expanded={formOpen}
      aria-controls={`${uid}-form`}
      data-role="rv-write"
    >
      {L.writeLabel}
    </button>
  );

  return (
    <div className={styles.productReviews12Box}>
      <section
        id="avaliacoes"
        className={styles.productReviews12}
        aria-label={L.title}
        data-role="rv-root"
      >
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.inner}>
          <div className={styles.head} data-role="rv-head">
            <h2 className={styles.title} data-role="rv-title">
              {L.title}
            </h2>
            {writeButton(styles.onlyDesktop)}
          </div>

          <div className={styles.body}>
            <aside className={styles.summary} data-role="rv-summary">
              {total > 0 ? (
                <>
                  <div className={styles.average} data-role="rv-average">
                    <span className={styles.avgValue} aria-hidden="true">
                      {decimal(avg)}
                    </span>
                    <span className={styles.avgSide}>
                      <span
                        role="img"
                        aria-label={`Nota ${decimal(avg)} de 5`}
                        className={styles.avgStars}
                      >
                        <StarsRow n={5} className={styles.starsBig} />
                      </span>
                      <span className={styles.avgCount}>
                        {count(total)} {L.countLabel}
                      </span>
                    </span>
                  </div>
                  <ul
                    className={styles.dist}
                    aria-label="Distribuição das notas"
                    data-role="rv-distribution"
                  >
                    {dist.map(d => {
                      const pct = total
                        ? Math.round((d.count / total) * 100)
                        : 0;
                      return (
                        <li key={d.stars} className={styles.distItem}>
                          <span className={styles.distLabel}>
                            {d.stars}{' '}
                            {d.stars === 1 ? L.starSingular : L.starPlural}
                          </span>
                          <span className={styles.bar} aria-hidden="true">
                            <span style={{ width: `${pct}%` }} />
                          </span>
                          <span className={styles.distPct}>{pct}%</span>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <p className={styles.empty}>{L.emptyText}</p>
              )}
              {writeButton(styles.onlyMobile)}

              {formOpen && (
                <form
                  id={`${uid}-form`}
                  ref={formRef}
                  className={styles.form}
                  onSubmit={onSubmit}
                  data-role="rv-form"
                >
                  {enviado ? (
                    <p className={styles.formOk} role="status">
                      {L.formSuccess}
                    </p>
                  ) : (
                    <>
                      <fieldset className={styles.rate}>
                        <legend className={styles.label}>
                          {L.formRatingLabel}
                        </legend>
                        <div className={styles.rateStars}>
                          {[1, 2, 3, 4, 5].map(n => (
                            <label key={n} className={styles.rateStar}>
                              <input
                                type="radio"
                                name={`${uid}-rating`}
                                value={n}
                                checked={rating === n}
                                onChange={() => setRating(n)}
                                required
                              />
                              <span className={styles.srOnly}>
                                {n} {n === 1 ? L.starSingular : L.starPlural}
                              </span>
                              <Star size={26} filled={n <= rating} />
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <label className={styles.field}>
                        <span className={styles.label}>{L.formTitleLabel}</span>
                        <input
                          className={styles.input}
                          type="text"
                          required
                          maxLength={120}
                          value={reviewTitle}
                          onChange={e => setReviewTitle(e.target.value)}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>{L.formTextLabel}</span>
                        <textarea
                          className={styles.textarea}
                          required
                          rows={4}
                          maxLength={2000}
                          value={reviewText}
                          onChange={e => setReviewText(e.target.value)}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>{L.formNameLabel}</span>
                        <input
                          className={styles.input}
                          type="text"
                          required
                          autoComplete="name"
                          maxLength={80}
                          value={reviewName}
                          onChange={e => setReviewName(e.target.value)}
                        />
                      </label>
                      <button
                        type="submit"
                        className={styles.submit}
                        disabled={rating < 1}
                      >
                        {L.formSubmitLabel}
                      </button>
                    </>
                  )}
                </form>
              )}
            </aside>

            <div className={styles.list} data-role="rv-list">
              {reviews.map((r, i) => {
                const nota = Math.max(
                  0,
                  Math.min(5, Math.round(Number(r.rating ?? 0)))
                );
                const stars = (extra: string) => (
                  <span
                    role="img"
                    aria-label={`Nota ${nota} de 5`}
                    className={`${styles.reviewStars} ${extra}`}
                  >
                    <StarsRow n={nota} className={styles.starsSmall} />
                  </span>
                );
                return (
                  <article
                    key={r.id ?? i}
                    className={styles.review}
                    data-role="rv-review"
                  >
                    <div className={styles.reviewTop}>
                      <span
                        className={`${styles.avatar} ${styles[TONS[i % TONS.length]]}`}
                        aria-hidden="true"
                      >
                        {initials(r.reviewerName)}
                      </span>
                      <span className={styles.who}>
                        <strong className={styles.name}>
                          {r.reviewerName}
                        </strong>
                        <span className={styles.date}>
                          {formatDate(r.reviewDateTime)}
                        </span>
                      </span>
                      {stars(styles.onlyDesktop)}
                    </div>
                    {stars(styles.onlyMobile)}
                    {r.title && (
                      <h3 className={styles.reviewTitle}>{r.title}</h3>
                    )}
                    {r.text && <p className={styles.reviewText}>{r.text}</p>}
                  </article>
                );
              })}
              {hasMore && (
                <button
                  type="button"
                  className={styles.more}
                  onClick={() => setShown(s => s + PER_PAGE)}
                  data-role="rv-more"
                >
                  {L.moreLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

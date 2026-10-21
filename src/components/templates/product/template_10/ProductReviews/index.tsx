'use client';

import React, { useId, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductReviews10` do faststore.starter (família 10, Varejo;
 * desenho `ProductReviews10` / `-mobile`) — a CASCA sem Trustvox: média,
 * distribuição 1-5, "Escrever avaliação" (formulário que abre), a lista e "Ver
 * mais". Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 * Conteúdo = o exemplo do palco do `mock.ts` de lá (o que o starter desenha sem
 * PDP). Sai o `usePDP`, o Reviews and Ratings e o ramo do widget Trustvox; o envio
 * do formulário só confirma, como o starter faz no exemplo.
 */

interface Review {
  id: string;
  title: string;
  text: string;
  rating: number;
  reviewerName: string;
  reviewDateTime: string;
}

const MOCK = {
  title: 'Avaliações',
  countLabel: 'avaliações',
  starSingular: 'estrela',
  starPlural: 'estrelas',
  writeLabel: 'Escrever avaliação',
  moreLabel: 'Ver mais avaliações',
  pageSize: 3,
  formRatingLabel: 'Sua nota',
  formTitleLabel: 'Título',
  formTextLabel: 'Sua avaliação',
  formNameLabel: 'Seu nome',
  formSubmitLabel: 'Enviar avaliação',
  formSuccess: 'Obrigado! Sua avaliação aparece aqui depois da moderação.',
};

const SUMMARY = {
  average: 4.8,
  totalCount: 1284,
  starsFive: 1002,
  starsFour: 193,
  starsThree: 51,
  starsTwo: 26,
  starsOne: 12,
};

const REVIEWS: Review[] = [
  {
    id: 'r1',
    rating: 5,
    reviewDateTime: '2026-10-14T12:00:00Z',
    title: 'Bateria dura o dia todo',
    text: 'Uso para trabalho e redes sociais e chego no fim do dia com sobra. A tela é muito boa até no sol.',
    reviewerName: '[Nome do cliente]',
  },
  {
    id: 'r2',
    rating: 4,
    reviewDateTime: '2026-10-09T12:00:00Z',
    title: 'Câmera excelente',
    text: 'As fotos de dia ficam ótimas. À noite perde um pouco, mas pelo preço compensa muito.',
    reviewerName: '[Nome do cliente]',
  },
  {
    id: 'r3',
    rating: 5,
    reviewDateTime: '2026-10-03T12:00:00Z',
    title: 'Chegou rápido e bem embalado',
    text: 'Pedido entregue em 2 dias. Configuração simples e o desempenho está ótimo.',
    reviewerName: '[Nome do cliente]',
  },
];

const STAR_PATH = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';
const Stars = ({ value, size }: { value: number; size: number }) => (
  <span className={styles.stars} aria-hidden="true">
    {[1, 2, 3, 4, 5].map(n => (
      <svg
        key={n}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={n <= value ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d={STAR_PATH} />
      </svg>
    ))}
  </span>
);

const formatDate = (raw: string) => {
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? raw : d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
};
const average = (n: number) => n.toFixed(1).replace('.', ',');
const count = (n: number) => n.toLocaleString('pt-BR');

export default function ProductReviews10() {
  const uid = useId();
  const [pages, setPages] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [enviado, setEnviado] = useState(false);

  const total = SUMMARY.totalCount;
  const avg = SUMMARY.average;
  const dist = [
    { stars: 5, count: SUMMARY.starsFive },
    { stars: 4, count: SUMMARY.starsFour },
    { stars: 3, count: SUMMARY.starsThree },
    { stars: 2, count: SUMMARY.starsTwo },
    { stars: 1, count: SUMMARY.starsOne },
  ];
  const size = pages * MOCK.pageSize;
  const reviews = REVIEWS.slice(0, size);
  const hasMore = size < total;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;
    setEnviado(true);
  };

  return (
    <div className={styles.productReviews10Box}>
      <section id="avaliacoes" className={styles.productReviews10} aria-label={MOCK.title} data-role="rv-root">
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <h2 className={styles.title} data-role="rv-title">
            {MOCK.title}
          </h2>
          <div className={styles.cols}>
            <div className={styles.summary} data-role="rv-summary">
              <div className={styles.average} data-role="rv-average">
                <span className={styles.averageValue} aria-hidden="true">
                  {average(avg)}
                </span>
                <span className={styles.averageMeta}>
                  <span className={styles.srOnly}>Nota média {average(avg)} de 5</span>
                  <Stars value={Math.round(avg)} size={20} />
                  <span className={styles.muted}>
                    {count(total)} {MOCK.countLabel}
                  </span>
                </span>
              </div>
              <ul className={styles.dist} data-role="rv-distribution">
                {dist.map(d => (
                  <li key={d.stars}>
                    <span className={styles.distLabel}>
                      <span aria-hidden="true">{d.stars}</span>
                      <span className={styles.srOnly}>
                        {d.stars} {d.stars === 1 ? MOCK.starSingular : MOCK.starPlural}
                      </span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d={STAR_PATH} />
                      </svg>
                    </span>
                    <span className={styles.bar} aria-hidden="true">
                      <span style={{ width: `${Math.round((d.count / total) * 100)}%` }} />
                    </span>
                    <span className={styles.distCount}>{count(d.count)}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={styles.outline}
                onClick={() => setFormOpen(o => !o)}
                aria-expanded={formOpen}
                aria-controls={`${uid}-form`}
                data-role="rv-write"
              >
                {MOCK.writeLabel}
              </button>

              {formOpen && (
                <form id={`${uid}-form`} className={styles.form} onSubmit={onSubmit} data-role="rv-form">
                  {enviado ? (
                    <p className={styles.formOk} role="status">
                      {MOCK.formSuccess}
                    </p>
                  ) : (
                    <>
                      <fieldset className={styles.rate}>
                        <legend className={styles.label}>{MOCK.formRatingLabel}</legend>
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
                                {n} {n === 1 ? MOCK.starSingular : MOCK.starPlural}
                              </span>
                              <svg
                                width="26"
                                height="26"
                                viewBox="0 0 24 24"
                                fill={n <= rating ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                strokeWidth="1.6"
                                aria-hidden="true"
                              >
                                <path d={STAR_PATH} />
                              </svg>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <label className={styles.field}>
                        <span className={styles.label}>{MOCK.formTitleLabel}</span>
                        <input
                          type="text"
                          required
                          maxLength={120}
                          value={reviewTitle}
                          onChange={e => setReviewTitle(e.target.value)}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>{MOCK.formTextLabel}</span>
                        <textarea
                          required
                          rows={4}
                          maxLength={2000}
                          value={reviewText}
                          onChange={e => setReviewText(e.target.value)}
                        />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>{MOCK.formNameLabel}</span>
                        <input
                          type="text"
                          required
                          autoComplete="name"
                          maxLength={80}
                          value={reviewName}
                          onChange={e => setReviewName(e.target.value)}
                        />
                      </label>
                      <button type="submit" className={styles.submit} disabled={rating < 1}>
                        {MOCK.formSubmitLabel}
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>

            <div className={styles.list} data-role="rv-list">
              {reviews.map(r => {
                const nota = Math.max(0, Math.min(5, Math.round(r.rating)));
                const meta = [r.reviewerName, formatDate(r.reviewDateTime)].filter(Boolean).join(' · ');
                return (
                  <article key={r.id} className={styles.review} data-role="rv-review">
                    <div className={styles.reviewTop}>
                      <span className={styles.srOnly}>Nota {nota} de 5</span>
                      <Stars value={nota} size={16} />
                      <h3 className={styles.reviewTitle}>{r.title}</h3>
                    </div>
                    <p className={styles.reviewText}>{r.text}</p>
                    <span className={styles.reviewMeta}>{meta}</span>
                  </article>
                );
              })}

              {hasMore && (
                <button
                  type="button"
                  className={`${styles.outline} ${styles.more}`}
                  onClick={() => setPages(n => n + 1)}
                  data-role="rv-more"
                >
                  {MOCK.moreLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

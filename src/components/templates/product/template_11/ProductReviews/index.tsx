'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

/**
 * Espelha `organisms/ProductReviews11` do faststore.starter (família 11, Grade; desenho
 * `ProductReviews11`): a CASCA sem Trustvox — a cabeça (título · "4,9 / 5 · 32 avaliações"
 * · "Escrever avaliação"), a distribuição 1-5 em células, a lista como tabela (Data ·
 * Cliente · Nota · Avaliação) e a paginação numerada. Mesmo markup, classes e `data-role`;
 * o CSS é derivado do SCSS de lá.
 *
 * Dados = o `mock.ts` de lá (média, distribuição e as 15 avaliações em 3 páginas). Saem o
 * `usePDP`, as consultas do Reviews and Ratings e o ramo do Trustvox (só a moldura com o
 * widget de terceiros); o formulário abre e "envia" só no estado local, como lá no palco.
 * A página tem 5 avaliações no desktop e 3 no mobile, decidido pelo `matchMedia` do
 * documento (no canvas, o do iframe).
 */
interface Review11 {
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
  dateLabel: 'Data',
  customerLabel: 'Cliente',
  ratingLabel: 'Nota',
  reviewLabel: 'Avaliação',
  prevLabel: 'Anterior',
  nextLabel: 'Próxima',
  pageSize: 5,
  mobilePageSize: 3,
  formRatingLabel: 'Sua nota',
  formTitleLabel: 'Título',
  formTextLabel: 'Sua avaliação',
  formNameLabel: 'Seu nome',
  formSubmitLabel: 'Enviar avaliação',
  formSuccess: 'Obrigado! Sua avaliação aparece aqui depois da moderação.',
};

/* ── dados de exemplo (o mock.ts de lá) ── */
const SUMMARY = {
  average: 4.9,
  totalCount: 32,
  starsFive: 28,
  starsFour: 3,
  starsThree: 1,
  starsTwo: 0,
  starsOne: 0,
};
const BASE: Review11[] = [
  {
    rating: 5,
    reviewDateTime: '2026-10-14T12:00:00Z',
    title: 'Luz certa para ler',
    text: 'O braço segura a posição sem afrouxar e a cúpula não esquenta. Uso todas as noites na escrivaninha.',
  },
  {
    rating: 5,
    reviewDateTime: '2026-10-02T12:00:00Z',
    title: 'Acabamento impecável',
    text: 'A pintura preta é fosca de verdade, sem marcas de dedo. Chegou muito bem embalada.',
  },
  {
    rating: 4,
    reviewDateTime: '2026-09-21T12:00:00Z',
    title: 'Bonita, cabo poderia ser maior',
    text: 'Gostei muito do desenho. Para a minha mesa precisei de uma extensão, então vale conferir a medida do cabo.',
  },
  {
    rating: 5,
    reviewDateTime: '2026-09-09T12:00:00Z',
    title: 'Combina com tudo',
    text: 'Comprei a preta e a branca para o quarto. A temperatura de cor é quente e confortável.',
  },
  {
    rating: 5,
    reviewDateTime: '2026-08-30T12:00:00Z',
    title: 'Base estável',
    text: 'A peça é pesada na base e muito estável. Não balança quando ajusto o braço.',
  },
];
const REVIEWS: Review11[] = [0, 1, 2].flatMap(p =>
  BASE.map((r, i) => ({
    ...r,
    id: `r${p * 5 + i + 1}`,
    reviewerName: '[Nome do cliente]',
  }))
);

const STAR_PATH =
  'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';
const Star = ({ size, filled = true }: { size: number; filled?: boolean }) => (
  <svg
    className={styles.star}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke={filled ? 'none' : 'currentColor'}
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d={STAR_PATH} />
  </svg>
);
const Arrow = ({ dir, size }: { dir: 'prev' | 'next'; size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path
      d={dir === 'next' ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'}
    />
  </svg>
);

/** "14.10.2026", como no desenho. */
const formatDate = (raw?: string) => {
  if (!raw) return '';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return raw;
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}`;
};
const decimal = (n: number) => n.toFixed(1).replace('.', ',');
const count = (n: number) => n.toLocaleString('pt-BR');
/** Janela de até 3 números de página ao redor da atual (o desenho mostra 3). */
const pageWindow = (current: number, total: number) => {
  const start = Math.max(1, Math.min(current - 1, total - 2));
  return Array.from({ length: Math.min(3, total) }, (_, i) => start + i);
};

export default function ProductReviews11() {
  const uid = useId();

  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 960px)');
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const perPage = mobile ? L.mobilePageSize : L.pageSize;

  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [enviado, setEnviado] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => setPage(1), [perPage]);

  const total = SUMMARY.totalCount;
  const avg = SUMMARY.average;
  const dist = [
    { stars: 5, count: SUMMARY.starsFive },
    { stars: 4, count: SUMMARY.starsFour },
    { stars: 3, count: SUMMARY.starsThree },
    { stars: 2, count: SUMMARY.starsTwo },
    { stars: 1, count: SUMMARY.starsOne },
  ];
  const from = (page - 1) * perPage;
  const reviews = REVIEWS.slice(from, from + perPage);
  const pages = Math.max(1, Math.ceil(REVIEWS.length / perPage));

  const goPage = (n: number) => {
    setPage(Math.max(1, Math.min(pages, n)));
    listRef.current?.scrollIntoView({ block: 'nearest' });
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
      onClick={() => setFormOpen(o => !o)}
      aria-expanded={formOpen}
      aria-controls={`${uid}-form`}
      data-role="rv-write"
    >
      {L.writeLabel}
      <Arrow dir="next" size={18} />
    </button>
  );

  return (
    <div className={styles.productReviews11Box}>
      <link rel="stylesheet" href={FONTES_11} />
      <section
        id="avaliacoes"
        className={styles.productReviews11}
        aria-label={L.title}
        data-role="rv-root"
      >
        <div className={styles.box}>
          <div className={styles.head} data-role="rv-head">
            <h2 className={styles.title} data-role="rv-title">
              {L.title}
            </h2>
            <span className={styles.average} data-role="rv-average">
              <Star size={16} />
              <span className={styles.srOnly}>Nota média </span>
              {decimal(avg)} / 5 · {count(total)} {L.countLabel}
            </span>
            <span className={styles.spacer} />
            {writeButton(styles.onlyDesktop)}
          </div>

          <ul
            className={styles.dist}
            aria-label="Distribuição das notas"
            data-role="rv-distribution"
          >
            {dist.map(d => (
              <li key={d.stars} className={styles.distItem}>
                <span className={styles.distLabel}>
                  {d.stars} {d.stars === 1 ? L.starSingular : L.starPlural}
                </span>
                <span className={styles.bar} aria-hidden="true">
                  {d.count > 0 && (
                    <span
                      style={{
                        width: `${Math.round((d.count / total) * 100)}%`,
                      }}
                    />
                  )}
                </span>
                <span className={styles.distCount}>{count(d.count)}</span>
              </li>
            ))}
          </ul>

          {writeButton(styles.onlyMobile)}

          {formOpen && (
            <form
              id={`${uid}-form`}
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
                          <Star size={24} filled={n <= rating} />
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className={styles.field}>
                    <span className={styles.label}>{L.formTitleLabel}</span>
                    <input
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
                    <Arrow dir="next" size={18} />
                  </button>
                </>
              )}
            </form>
          )}

          {reviews.length > 0 && (
            <div ref={listRef} data-role="rv-list">
              <div className={styles.tableHead} aria-hidden="true">
                <span>{L.dateLabel}</span>
                <span>{L.customerLabel}</span>
                <span>{L.ratingLabel}</span>
                <span>{L.reviewLabel}</span>
              </div>
              {reviews.map((r, i) => {
                const nota = Math.max(
                  0,
                  Math.min(5, Math.round(Number(r.rating ?? 0)))
                );
                return (
                  <article
                    key={r.id ?? i}
                    className={styles.review}
                    data-role="rv-review"
                  >
                    <span className={styles.date}>
                      {formatDate(r.reviewDateTime)}
                    </span>
                    <span className={styles.name}>{r.reviewerName}</span>
                    <span className={styles.rating}>
                      <Star size={14} />
                      <span className={styles.srOnly}>Nota </span>
                      {decimal(nota)}
                    </span>
                    {r.title && (
                      <h3 className={styles.reviewTitle}>{r.title}</h3>
                    )}
                    {r.text && <p className={styles.reviewText}>{r.text}</p>}
                  </article>
                );
              })}
            </div>
          )}

          {pages > 1 && (
            <nav
              className={styles.pager}
              aria-label="Páginas de avaliações"
              data-role="rv-pager"
            >
              <button
                type="button"
                className={styles.pagerPrev}
                onClick={() => goPage(page - 1)}
                disabled={page <= 1}
                aria-label={L.prevLabel}
              >
                <Arrow dir="prev" size={14} />
                <span className={styles.onlyDesktop}>{L.prevLabel}</span>
              </button>
              {pageWindow(page, pages).map(n => (
                <button
                  key={n}
                  type="button"
                  className={`${styles.pagerNum}${n === page ? ` ${styles.pagerOn}` : ''}`}
                  onClick={() => goPage(n)}
                  aria-current={n === page ? 'page' : undefined}
                >
                  {n}
                </button>
              ))}
              <span className={styles.spacer} />
              <button
                type="button"
                className={styles.pagerNext}
                onClick={() => goPage(page + 1)}
                disabled={page >= pages}
                aria-label={L.nextLabel}
              >
                <span className={styles.onlyDesktop}>{L.nextLabel}</span>
                <Arrow dir="next" size={14} />
              </button>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
}

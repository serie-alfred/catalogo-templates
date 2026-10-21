import React, { useId, useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductReviews09` do faststore.starter (família 09, Editorial;
 * desenho `ProductReviews09` / `-mobile`) — a CASCA sem Trustvox: média, distribuição
 * 1-5, "Escrever avaliação" (formulário que abre), lista paginada (desktop) ou com
 * "Ver mais" (mobile). Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS
 * de lá. Conteúdo = o `mock.ts` de lá. Sai o `usePDP`, o Reviews and Ratings e o
 * ramo do widget Trustvox. O corte desktop/mobile da lista, que lá sai de um
 * `matchMedia`, aqui sai do `isMobile` do renderer (o mesmo 960px).
 */

const MOCK = {
  title: 'Avaliações',
  countLabel: 'avaliações',
  starSingular: 'estrela',
  starPlural: 'estrelas',
  writeLabel: 'Escrever avaliação',
  moreLabel: 'Ver mais avaliações',
  pageSize: 3,
  pageSizeMobile: 2,
  formRatingLabel: 'Sua nota',
  formTitleLabel: 'Título',
  formTextLabel: 'Sua avaliação',
  formNameLabel: 'Seu nome',
  formSubmitLabel: 'Enviar avaliação',
  formSuccess: 'Obrigado! Sua avaliação aparece aqui depois da moderação.',
};

const SUMMARY = {
  average: 4.8,
  totalCount: 86,
  starsFive: 72,
  starsFour: 10,
  starsThree: 3,
  starsTwo: 1,
  starsOne: 0,
};
const LIST_TOTAL = 54;

const REVIEWS = [
  {
    id: 'r1',
    rating: 5,
    reviewDateTime: '2026-09-12T12:00:00Z',
    title: 'Usei do trabalho ao jantar',
    text: 'O linho é encorpado sem ser pesado e o forro faz diferença. Lavei duas vezes e ficou ainda mais macio.',
    reviewerName: '[Nome da cliente]',
  },
  {
    id: 'r2',
    rating: 5,
    reviewDateTime: '2026-08-28T12:00:00Z',
    title: 'Caimento perfeito',
    text: 'Tenho 1,65 m e o comprimento ficou no meio da canela. A cor areia é exatamente a da foto.',
    reviewerName: '[Nome da cliente]',
  },
  {
    id: 'r3',
    rating: 4,
    reviewDateTime: '2026-08-15T12:00:00Z',
    title: 'Lindo, mas amassa',
    text: 'Esperado de linho, então não é defeito. Recomendo para quem gosta do aspecto natural do tecido.',
    reviewerName: '[Nome da cliente]',
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
        strokeWidth="1.4"
      >
        <path d={STAR_PATH} />
      </svg>
    ))}
  </span>
);

const formatDate = (raw: string) =>
  new Date(raw).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
const average = (n: number) => n.toFixed(1).replace('.', ',');

/** 1 2 3 … 18 — primeira, última e vizinhas da atual (1-based). */
function pageList(current: number, total: number): Array<number | '…'> {
  const set = new Set<number>([1, total, current - 1, current, current + 1]);
  if (current <= 2) [2, 3].forEach(n => set.add(n));
  if (current >= total - 1) [total - 1, total - 2].forEach(n => set.add(n));
  const nums = Array.from(set)
    .filter(n => n >= 1 && n <= total)
    .sort((a, b) => a - b);
  const out: Array<number | '…'> = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) out.push('…');
    out.push(n);
  });
  return out;
}

export default function ProductReviews09({ isMobile = false }: { isMobile?: boolean }) {
  const m = MOCK;
  const uid = useId();
  const [page, setPage] = useState(1);
  const [mobilePages, setMobilePages] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [formOk, setFormOk] = useState(false);

  const total = SUMMARY.totalCount;
  const avg = SUMMARY.average;
  const dist = [
    { stars: 5, count: SUMMARY.starsFive },
    { stars: 4, count: SUMMARY.starsFour },
    { stars: 3, count: SUMMARY.starsThree },
    { stars: 2, count: SUMMARY.starsTwo },
    { stars: 1, count: SUMMARY.starsOne },
  ];
  const reviews = REVIEWS.slice(0, isMobile ? mobilePages * m.pageSizeMobile : m.pageSize);
  const totalPages = Math.max(1, Math.ceil(LIST_TOTAL / m.pageSize));
  const hasMore = mobilePages * m.pageSizeMobile < LIST_TOTAL;

  return (
    <div className={styles.productReviews09Box}>
      <link rel="stylesheet" href={FONTES_09} />
      <section id="avaliacoes" className={styles.productReviews09} aria-label={m.title} data-role="rv-root">
        <div className={styles.inner}>
          <div className={styles.side}>
            <h2 className={styles.title} data-role="rv-title">
              {m.title}
            </h2>

            <div className={styles.average} data-role="rv-average">
              <span className={styles.averageValue} aria-hidden="true">
                {average(avg)}
              </span>
              <span className={styles.averageMeta}>
                <span className={styles.srOnly}>Nota média {average(avg)} de 5</span>
                <Stars value={Math.round(avg)} size={14} />
                <span className={styles.muted13}>
                  {total} {m.countLabel}
                </span>
              </span>
            </div>
            <ul className={styles.dist} data-role="rv-distribution">
              {dist.map(d => (
                <li key={d.stars}>
                  <span>
                    {d.stars} {d.stars === 1 ? m.starSingular : m.starPlural}
                  </span>
                  <span className={styles.bar} aria-hidden="true">
                    <span style={{ width: `${Math.round((d.count / total) * 100)}%` }} />
                  </span>
                  <span className={styles.distCount}>{d.count}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={styles.write}
              onClick={() => setFormOpen(o => !o)}
              aria-expanded={formOpen}
              aria-controls={`${uid}-form`}
              data-role="rv-write"
            >
              {m.writeLabel}
            </button>

            {formOpen && (
              <form
                id={`${uid}-form`}
                className={styles.form}
                onSubmit={e => {
                  e.preventDefault();
                  if (rating >= 1) setFormOk(true);
                }}
                data-role="rv-form"
              >
                {formOk ? (
                  <p className={styles.formOk} role="status">
                    {m.formSuccess}
                  </p>
                ) : (
                  <>
                    <fieldset className={styles.rate}>
                      <legend className={styles.label}>{m.formRatingLabel}</legend>
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
                              {n} {n === 1 ? m.starSingular : m.starPlural}
                            </span>
                            <svg
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill={n <= rating ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              strokeWidth="1.4"
                              aria-hidden="true"
                            >
                              <path d={STAR_PATH} />
                            </svg>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                    <label className={styles.field}>
                      <span className={styles.label}>{m.formTitleLabel}</span>
                      <input type="text" required maxLength={120} />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.label}>{m.formTextLabel}</span>
                      <textarea required rows={4} maxLength={2000} />
                    </label>
                    <label className={styles.field}>
                      <span className={styles.label}>{m.formNameLabel}</span>
                      <input type="text" required autoComplete="name" maxLength={80} />
                    </label>
                    <button type="submit" className={styles.submit} disabled={rating < 1}>
                      {m.formSubmitLabel}
                    </button>
                  </>
                )}
              </form>
            )}
          </div>

          <div className={styles.list} data-role="rv-list">
            {reviews.map(r => (
              <article key={r.id} className={styles.review} data-role="rv-review">
                <div className={styles.reviewTop}>
                  <span className={styles.srOnly}>Nota {r.rating} de 5</span>
                  <Stars value={r.rating} size={13} />
                  <span className={styles.muted12}>{formatDate(r.reviewDateTime)}</span>
                </div>
                <h3 className={styles.reviewTitle}>{r.title}</h3>
                <p className={styles.reviewText}>{r.text}</p>
                <span className={styles.reviewer}>{r.reviewerName}</span>
              </article>
            ))}

            {totalPages > 1 && (
              <nav className={styles.pages} aria-label="Páginas de avaliações" data-role="rv-pages">
                {pageList(page, totalPages).map((n, i) =>
                  n === '…' ? (
                    <span key={`e${i}`} className={styles.ellipsis} aria-hidden="true">
                      ...
                    </span>
                  ) : (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.page}${n === page ? ` ${styles.pageOn}` : ''}`}
                      aria-current={n === page ? 'page' : undefined}
                      aria-label={`Página ${n}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  )
                )}
                {page < totalPages && (
                  <button
                    type="button"
                    className={`${styles.page} ${styles.pageNext}`}
                    aria-label="Próxima página"
                    onClick={() => setPage(page + 1)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                )}
              </nav>
            )}

            {hasMore && (
              <button
                type="button"
                className={styles.more}
                onClick={() => setMobilePages(n => n + 1)}
                data-role="rv-more"
              >
                {m.moreLabel}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

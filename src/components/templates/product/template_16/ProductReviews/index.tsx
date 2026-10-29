'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductReviews16` do faststore.starter (família 16, Infantil; desenho
 * `ProductReviews16`): o título em Fredoka; à esquerda o cartão com a média, as estrelas, as barras
 * 5→1 e "Escrever avaliação"; à direita a lista em cartões e a paginação em círculos (no mobile,
 * "Ver mais avaliações"). Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Lá a nota e a lista vêm do Reviews and Ratings (ou do widget do Trustvox); aqui são o exemplo do
 * mock.ts de lá. O formulário abre e "envia" só localmente.
 */
const FONTES =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap';

interface Review16 {
  id: string;
  title: string;
  text: string;
  rating: number;
  reviewerName: string;
  reviewDateTime: string;
  location: string;
}

const L = {
  title: 'O que as famílias acharam',
  countLabel: 'avaliações',
  starSingular: 'estrela',
  starPlural: 'estrelas',
  writeLabel: 'Escrever avaliação',
  prevLabel: 'Página anterior',
  nextLabel: 'Próxima página',
  moreLabel: 'Ver mais avaliações',
  formRatingLabel: 'Sua nota',
  formTitleLabel: 'Título',
  formTextLabel: 'Sua avaliação',
  formNameLabel: 'Seu nome',
  formSubmitLabel: 'Enviar avaliação',
  formSuccess: 'Obrigado! Sua avaliação aparece aqui depois da moderação.',
};
const PER_PAGE = 3;
const MOBILE_PER = 2;
const SUMMARY = { average: 4.8, totalCount: 128, starsFive: 105, starsFour: 18, starsThree: 5, starsTwo: 0, starsOne: 0 };
const BASE = [
  { rating: 5, title: 'Macio e quentinho', text: 'Comprei o tamanho 4 para minha filha de 3 anos e ficou com folguinha para crescer. O algodão é bem macio.' },
  { rating: 4, title: 'Lindo, mas veio um pouco grande', text: 'A estampa é linda e não desbotou. Achei a calça comprida, mas dobrando a barra resolveu.' },
  { rating: 5, title: 'Virou o pijama favorito', text: 'Meu filho pede para usar todo dia. Chegou rápido e bem embalado, já comprei a outra cor.' },
];
const REVIEWS: Review16[] = [0, 1, 2].flatMap(p =>
  BASE.map((r, i) => ({
    ...r,
    id: `r${p * 3 + i + 1}`,
    reviewerName: '[Nome]',
    location: '[Cidade]',
    reviewDateTime: '2026-10-14T12:00:00Z',
  }))
);

const STAR_PATH = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';
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

const formatDate = (raw: string) => {
  const d = new Date(raw);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}/${p(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
};
const decimal = (n: number) => n.toFixed(1).replace('.', ',');
const count = (n: number) => n.toLocaleString('pt-BR');
const pageWindow = (current: number, total: number) => {
  const start = Math.max(1, Math.min(current - 1, total - 2));
  return Array.from({ length: Math.min(3, total) }, (_, i) => start + i);
};

export default function ProductReviews16() {
  const uid = useId();
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  const [shown, setShown] = useState(MOBILE_PER);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 960px)');
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const total = SUMMARY.totalCount;
  const avg = SUMMARY.average;
  const dist = [
    { stars: 5, count: SUMMARY.starsFive },
    { stars: 4, count: SUMMARY.starsFour },
    { stars: 3, count: SUMMARY.starsThree },
    { stars: 2, count: SUMMARY.starsTwo },
    { stars: 1, count: SUMMARY.starsOne },
  ];
  const from = mobile ? 0 : (page - 1) * PER_PAGE;
  const to = mobile ? shown : from + PER_PAGE;
  const reviews = REVIEWS.slice(from, to);
  const pages = Math.max(1, Math.ceil(REVIEWS.length / PER_PAGE));
  const hasMore = mobile && reviews.length < REVIEWS.length;

  const goPage = (n: number) => {
    setPage(Math.max(1, Math.min(pages, n)));
    listRef.current?.scrollIntoView({ block: 'nearest' });
  };

  return (
    <div className={styles.productReviews16Box}>
      <section id="avaliacoes" className={styles.productReviews16} aria-label={L.title} data-role="rv-root">
        <link rel="stylesheet" href={FONTES} />
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
                  const pct = Math.round((d.count / total) * 100);
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
                <form
                  id={`${uid}-form`}
                  className={styles.form}
                  onSubmit={e => {
                    e.preventDefault();
                    if (rating > 0) setEnviado(true);
                  }}
                  data-role="rv-form"
                >
                  {enviado ? (
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
                        <input type="text" required maxLength={120} />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>{L.formTextLabel}</span>
                        <textarea required rows={4} maxLength={2000} />
                      </label>
                      <label className={styles.field}>
                        <span className={styles.label}>{L.formNameLabel}</span>
                        <input type="text" required autoComplete="name" maxLength={80} />
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
              {reviews.map(r => (
                <article key={r.id} className={styles.review} data-role="rv-review">
                  <div className={styles.reviewTop}>
                    <span className={styles.srOnly}>{r.rating} de 5 estrelas</span>
                    <Stars n={r.rating} className={styles.starsSmall} />
                    <span className={styles.date}>{formatDate(r.reviewDateTime)}</span>
                  </div>
                  <h3 className={styles.reviewTitle}>{r.title}</h3>
                  <p className={styles.reviewText}>{r.text}</p>
                  <span className={styles.author}>
                    {r.reviewerName} · {r.location}
                  </span>
                </article>
              ))}

              {hasMore && (
                <button type="button" className={styles.more} onClick={() => setShown(n => n + MOBILE_PER)} data-role="rv-more">
                  {L.moreLabel}
                </button>
              )}

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

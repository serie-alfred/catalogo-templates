'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

import { FONTES_17 } from '@/components/templates/common/template_17/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/ProductReviews17` do faststore.starter (família 17, Pet; desenho
 * `ProductReviews17`): o título em Bricolage; à esquerda o cartão no primário a 9% (a média grande,
 * as 5 estrelas e a contagem, as barras 5→1 com a estrela e o percentual, e "Escrever avaliação" em
 * pílula primária); à direita a lista entre filetes (estrelas + data, título, texto, "nome ·
 * cidade") e a paginação em círculos. No mobile tudo empilha e a paginação vira "Ver mais
 * avaliações" (soma o próximo bloco). Mesmo markup, classes e `data-role`; o CSS é derivado do
 * SCSS de lá.
 *
 * Lá a nota e a lista vêm do Reviews and Ratings (ou, com Trustvox, só a moldura com o widget);
 * aqui são o exemplo do mock.ts de lá (a casca sem Trustvox). O formulário abre e "envia" só
 * localmente, como o mock de lá.
 */
interface Review17 {
  id: string;
  title: string;
  text: string;
  rating: number;
  reviewerName: string;
  reviewDateTime: string;
  location: string;
}

const L = {
  title: 'O que os tutores dizem',
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
// Média e distribuição do desenho: 4,9 em 214, com as barras de 86% · 10% · 3% · 1% · 0.
const SUMMARY = { average: 4.9, totalCount: 214, starsFive: 184, starsFour: 21, starsThree: 6, starsTwo: 3, starsOne: 0 };
const BASE = [
  {
    rating: 5,
    title: 'O Bob comeu tudo e pediu mais',
    text: 'Troquei aos poucos durante uma semana, como indica a embalagem. Ele se adaptou bem, as fezes ficaram firmes e o pelo está mais macio.',
    reviewerName: 'Fernanda S.',
    location: 'Curitiba',
  },
  {
    rating: 4,
    title: 'Boa, mas o croquete é grande',
    text: 'Ração de qualidade e o meu cão gosta. Para um cão de porte médio achei o grão um pouco grande, mas ele se acostumou.',
    reviewerName: 'Rafael T.',
    location: 'Belo Horizonte',
  },
  {
    rating: 5,
    title: 'Retirei na loja no mesmo dia',
    text: 'Comprei pelo site e busquei à tarde. O pacote de 15 kg rende pouco mais de um mês para a minha labradora.',
    reviewerName: 'Marina A.',
    location: 'Recife',
  },
];
// Repetidas para a paginação ter páginas (como no mock de lá).
const REVIEWS: Review17[] = [0, 1, 2].flatMap(p =>
  BASE.map((r, i) => ({ ...r, id: `r${p * 3 + i + 1}`, reviewDateTime: '2026-10-14T12:00:00Z' }))
);

const STAR_PATH = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';
/** Cinco estrelas: as `n` primeiras cheias, as outras só com o contorno (como no desenho). */
const Stars = ({ n, className }: { n: number; className: string }) => (
  <span className={className} aria-hidden="true">
    {[0, 1, 2, 3, 4].map(i =>
      i < n ? (
        <svg key={i} viewBox="0 0 24 24" fill="currentColor">
          <path d={STAR_PATH} />
        </svg>
      ) : (
        <svg key={i} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d={STAR_PATH} />
        </svg>
      )
    )}
  </span>
);
const Star = ({ filled, size = 26 }: { filled: boolean; size?: number }) => (
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
const Arrow = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

/** "14/10/2026", como no desenho. */
const formatDate = (raw: string) => {
  const d = new Date(raw);
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

export default function ProductReviews17() {
  const uid = useId();
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  // Desktop pagina; mobile soma blocos ("Ver mais"). No canvas o iframe É a janela da loja.
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
    <div className={styles.productReviews17Box}>
      <section id="avaliacoes" className={styles.productReviews17} aria-label={L.title} data-role="rv-root">
        <link rel="stylesheet" href={FONTES_17} />
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
                  <Stars n={Math.round(avg)} className={styles.starsBig} />
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
                        <span className={styles.srOnly}> {d.stars === 1 ? L.starSingular : L.starPlural}</span>
                      </span>
                      <span className={styles.distStar}>
                        <Star filled size={14} />
                      </span>
                      <span className={styles.bar} aria-hidden="true">
                        {pct > 0 && <span className={styles.barFill} style={{ width: `${pct}%` }} />}
                      </span>
                      <span className={styles.distPct}>{pct}%</span>
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

              {pages > 1 && (
                <nav className={styles.pager} aria-label="Páginas de avaliações" data-role="rv-pager">
                  {page > 1 && (
                    <button
                      type="button"
                      className={styles.pagerBtn}
                      onClick={() => goPage(page - 1)}
                      aria-label={L.prevLabel}
                    >
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
                    <button
                      type="button"
                      className={styles.pagerBtn}
                      onClick={() => goPage(page + 1)}
                      aria-label={L.nextLabel}
                    >
                      <Arrow dir="next" />
                    </button>
                  )}
                </nav>
              )}
            </div>
          </div>

          {hasMore && (
            <button type="button" className={styles.more} onClick={() => setShown(n => n + MOBILE_PER)} data-role="rv-more">
              {L.moreLabel}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

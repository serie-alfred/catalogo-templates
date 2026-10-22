'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/ClientReview12` do faststore.starter (família 12, Suave; desenho
 * `ClientReview12` / `ClientReview12-mobile`). Mesmo markup, mesmas classes, mesmos
 * `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o
 * mock.ts de lá (marcadores no lugar de nome e cidade, sem miniatura de produto).
 */
interface ClientReview12Review {
  initials?: string;
  author?: string;
  location?: string;
  rating?: number;
  tag?: string;
  text?: string;
  productName?: string;
  productUrl?: string;
  productImage?: string;
}

// Conteúdo do mock.ts do starter.
const TITLE = 'Quem usa, conta';
const SUBTITLE = 'Depoimentos de quem já faz parte da nossa rotina';
const base = {
  author: '[Nome da cliente]',
  location: '[Cidade, UF]',
  text: '[Texto do depoimento, com até 240 caracteres, sobre textura, resultado e uso no dia a dia.]',
  productUrl: '#',
  rating: 5,
};
const REVIEWS: ClientReview12Review[] = [
  { ...base, initials: 'AB', tag: 'Pele mista', productName: 'Sérum Vitamina C 10%' },
  { ...base, initials: 'CD', tag: 'Pele seca', productName: 'Hidratante Facial Gel-Creme' },
  { ...base, initials: 'EF', tag: 'Pele sensível', productName: 'Protetor Solar FPS 50 Toque Seco' },
];

const STAR = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';

/** As 5 estrelas do desenho num SVG só (viewBox 124 × 24); as que passam da nota ficam apagadas. */
const Stars = ({ nota }: { nota: number }) => (
  <span className={styles.stars} role="img" aria-label={`Nota ${nota} de 5`}>
    <svg viewBox="0 0 124 24" fill="currentColor" aria-hidden="true">
      {[0, 1, 2, 3, 4].map(i => (
        <path key={i} d={STAR} transform={i ? `translate(${i * 25} 0)` : undefined} opacity={nota >= i + 0.5 ? 1 : 0.28} />
      ))}
    </svg>
  </span>
);

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ClientReview12() {
  const railRef = useRef<HTMLDivElement>(null);
  const [trilho, setTrilho] = useState({ inicio: true, fim: true, atual: 0 });

  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el || !el.scrollWidth) return;
    const primeiro = el.firstElementChild as HTMLElement | null;
    const passo = (primeiro?.offsetWidth || el.clientWidth) + 12;
    setTrilho({
      inicio: el.scrollLeft <= 1,
      fim: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      atual: Math.round(el.scrollLeft / passo),
    });
  }, []);
  useEffect(() => {
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [medir]);

  const suave = (): ScrollBehavior =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  const passo = (dir: 1 | -1) =>
    railRef.current?.scrollBy({ left: dir * railRef.current.clientWidth, behavior: suave() });
  const ir = (i: number) => {
    const el = railRef.current;
    const alvo = el?.children[i] as HTMLElement | undefined;
    if (el && alvo) el.scrollTo({ left: alvo.offsetLeft - el.offsetLeft - 16, behavior: suave() });
  };

  const atual = Math.min(trilho.atual, REVIEWS.length - 1);

  return (
    <div className={styles.clientReview12Box}>
      <section className={styles.clientReview12} aria-label={TITLE} data-role="cr-root">
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.headCopy}>
              <h2 className={styles.title} data-role="cr-title">
                {TITLE}
              </h2>
              <p className={styles.subtitle}>{SUBTITLE}</p>
            </div>
            <div className={styles.arrows}>
              <button type="button" className={styles.arrow} onClick={() => passo(-1)} disabled={trilho.inicio} aria-label="Depoimentos anteriores">
                <Chevron dir="prev" />
              </button>
              <button type="button" className={`${styles.arrow} ${styles.arrowNext}`} onClick={() => passo(1)} disabled={trilho.fim} aria-label="Próximos depoimentos">
                <Chevron dir="next" />
              </button>
            </div>
          </div>
          <div ref={railRef} className={styles.rail} onScroll={medir} data-role="cr-list">
            {REVIEWS.map((r, i) => (
              <figure key={i} className={styles.card} data-role="cr-card">
                <div className={styles.who}>
                  {r.initials && (
                    <span className={styles.avatar} aria-hidden="true">
                      {r.initials}
                    </span>
                  )}
                  <span className={styles.whoCopy}>
                    {r.author && <strong className={styles.author}>{r.author}</strong>}
                    {r.location && <span className={styles.location}>{r.location}</span>}
                  </span>
                </div>
                {(!!r.rating || r.tag) && (
                  <div className={styles.tags}>
                    {!!r.rating && <Stars nota={Math.min(5, Math.max(0, Number(r.rating)))} />}
                    {r.tag && <span className={styles.tag}>{r.tag}</span>}
                  </div>
                )}
                {r.text && <blockquote className={styles.quote}>{r.text}</blockquote>}
                {r.productName && (
                  <figcaption className={styles.product}>
                    <a className={styles.productLink} href={r.productUrl || '#'} data-role="cr-product">
                      <span className={styles.thumb}>
                        {r.productImage && <img src={r.productImage} alt="" width={80} height={80} loading="lazy" decoding="async" />}
                      </span>
                      <span className={styles.productName}>{r.productName}</span>
                    </a>
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
          <div className={styles.dots}>
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={styles.dotBtn}
                onClick={() => ir(i)}
                aria-current={i === atual}
                aria-label={i === atual ? `Depoimento ${i + 1}, atual` : `Depoimento ${i + 1}`}
              >
                <span className={`${styles.dot}${i === atual ? ` ${styles.dotOn}` : ''}`} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

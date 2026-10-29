'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

/**
 * Espelha `organisms/ClientReview14` do faststore.starter (família 14, Esportiva; desenho
 * `ClientReview14`): título em Saira itálica e as setas em paralelogramo; três cartões por vez
 * na superfície cinza-azulada com o selo vermelho das aspas, as estrelas vermelhas, o texto e,
 * depois de um filete, "nome · cidade" e "perfil · Sobre: produto". No mobile os cartões rolam
 * de lado com as barras inclinadas embaixo. Mesmo markup, classes e `data-role`; CSS derivado
 * do SCSS. Conteúdo = o mock.ts de lá; o trilho (setas, barras) é o mesmo scroll nativo.
 */
type Review = {
  rating?: number;
  text?: string;
  author?: string;
  location?: string;
  profile?: string;
  productName?: string;
};

const TITLE = 'Quem treina, recomenda';
const ABOUT_LABEL = 'Sobre:';
const REVIEWS: Review[] = [
  {
    rating: 5,
    text: 'Fiz minha primeira meia maratona com o Velox Run 3. Leve, firme na passada e nenhuma bolha nos 21 km.',
    author: 'Ana',
    location: 'São Paulo',
    profile: 'Corredora de rua',
    productName: 'Tênis Velox Run 3',
  },
  {
    rating: 5,
    text: 'A legging não desce no agachamento e não fica transparente. Já comprei a segunda cor.',
    author: 'Júlia',
    location: 'Curitiba',
    profile: 'Treino funcional',
    productName: 'Legging Compressão Core',
  },
  {
    rating: 5,
    text: 'Dissolve fácil, sem gosto de giz. Uso todo dia depois do treino e a entrega chegou em dois dias.',
    author: 'Rafael',
    location: 'Recife',
    profile: 'Musculação',
    productName: 'Whey Isolado 900 g',
  },
];

const STAR = 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';

const Stars = ({ nota }: { nota: number }) => (
  <span className={styles.stars} role="img" aria-label={`${nota} de 5 estrelas`}>
    {[0, 1, 2, 3, 4].map(i => (
      <svg key={i} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" opacity={nota >= i + 0.5 ? 1 : 0.28}>
        <path d={STAR} />
      </svg>
    ))}
  </span>
);

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ClientReview14() {
  const reviews = REVIEWS;
  const railRef = useRef<HTMLDivElement>(null);
  const [trilho, setTrilho] = useState({ inicio: true, fim: true, atual: 0 });

  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el || !el.scrollWidth) return;
    const primeiro = el.firstElementChild as HTMLElement | null;
    const passo = (primeiro?.offsetWidth || el.clientWidth) + 10;
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

  const suave = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
  const passo = (dir: 1 | -1) => railRef.current?.scrollBy({ left: dir * railRef.current.clientWidth, behavior: suave() });
  const ir = (i: number) => {
    const el = railRef.current;
    const alvo = el?.children[i] as HTMLElement | undefined;
    if (el && alvo) el.scrollTo({ left: alvo.offsetLeft - el.offsetLeft - 16, behavior: suave() });
  };

  const atual = Math.min(trilho.atual, reviews.length - 1);

  return (
    <div className={styles.clientReview14Box}>
      <section className={styles.clientReview14} aria-label={TITLE} data-role="cr-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 className={styles.title} data-role="cr-title">
              {TITLE}
            </h2>
            <div className={styles.arrows}>
              <button type="button" className={styles.prev} onClick={() => passo(-1)} disabled={trilho.inicio} aria-label="Depoimentos anteriores">
                <Chevron dir="prev" />
              </button>
              <button type="button" className={styles.next} onClick={() => passo(1)} disabled={trilho.fim} aria-label="Próximos depoimentos">
                <Chevron dir="next" />
              </button>
            </div>
          </div>
          <div ref={railRef} className={styles.rail} onScroll={medir} data-role="cr-list">
            {reviews.map((r, i) => {
              const quem = [r.author, r.location].filter(Boolean).join(' · ');
              const sobre = [r.profile, r.productName && `${ABOUT_LABEL} ${r.productName}`].filter(Boolean).join(' · ');
              return (
                <figure key={i} className={styles.card} data-role="cr-card">
                  <div className={styles.top}>
                    <span className={styles.quoteMark} aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M4 18v-6c0-4 2-6 6-7l1 2c-2 .6-3 1.8-3 4h3v7zm9 0v-6c0-4 2-6 6-7l1 2c-2 .6-3 1.8-3 4h3v7z" />
                      </svg>
                    </span>
                    {!!r.rating && <Stars nota={Math.min(5, Math.max(0, Number(r.rating)))} />}
                  </div>
                  {r.text && <blockquote className={styles.quote}>{r.text}</blockquote>}
                  {(quem || sobre) && (
                    <figcaption className={styles.who}>
                      {quem && <span className={styles.author}>{quem}</span>}
                      {sobre && <span className={styles.about}>{sobre}</span>}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
          <div className={styles.bars}>
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                className={styles.barBtn}
                onClick={() => ir(i)}
                aria-current={i === atual}
                aria-label={i === atual ? `Depoimento ${i + 1}, atual` : `Depoimento ${i + 1}`}
              >
                <span className={`${styles.bar}${i === atual ? ` ${styles.barOn}` : ''}`} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

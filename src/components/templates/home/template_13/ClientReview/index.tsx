import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/ClientReview13` do faststore.starter (família 13, Noturno; desenho
 * `ClientReview13` / `ClientReview13-mobile`). Mesmo markup, mesmas classes, mesmos
 * `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o
 * mock.ts de lá (perfil e cidade são marcadores do desenho; sem foto: vale o grafite).
 * Trilho de rolagem nativa com setas e régua de traços, como lá.
 */
interface ClientReview13Review {
  rating?: number;
  text?: string;
  author?: string;
  location?: string;
  productName?: string;
  image?: string;
}

// Conteúdo do mock.ts do starter.
const quem = { author: '[@perfil]', location: '[Cidade]', rating: 5 };
const MOCK = {
  title: 'Quem usa, aprova',
  reviews: [
    {
      ...quem,
      text: 'Usei a noite inteira no frio e o corta-vento segurou. O refletivo aparece de verdade no farol.',
      productName: 'Jaqueta Corta-Vento',
    },
    {
      ...quem,
      text: 'Forma certinha, peguei meu número de sempre. Amortecimento macio sem ficar mole.',
      productName: 'Tênis Runner V2',
    },
    {
      ...quem,
      text: 'Moletom pesado e caimento oversized do jeito que eu queria. Já lavei várias vezes e não deformou.',
      productName: 'Moletom Oversized',
    },
  ] as ClientReview13Review[],
};

const STAR =
  'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';

const Stars = ({ nota }: { nota: number }) => (
  <span
    className={styles.stars}
    role="img"
    aria-label={`${nota} de 5 estrelas`}
  >
    {[0, 1, 2, 3, 4].map(i => (
      <svg
        key={i}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        opacity={nota >= i + 0.5 ? 1 : 0.28}
      >
        <path d={STAR} />
      </svg>
    ))}
  </span>
);

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ClientReview13() {
  const { title, reviews } = MOCK;
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
  }, [medir, reviews.length]);

  const suave = (): ScrollBehavior =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';
  const passo = (dir: 1 | -1) =>
    railRef.current?.scrollBy({
      left: dir * railRef.current.clientWidth,
      behavior: suave(),
    });
  const ir = (i: number) => {
    const el = railRef.current;
    const alvo = el?.children[i] as HTMLElement | undefined;
    if (el && alvo)
      el.scrollTo({
        left: alvo.offsetLeft - el.offsetLeft - 16,
        behavior: suave(),
      });
  };

  if (!reviews.length) return null;
  const atual = Math.min(trilho.atual, reviews.length - 1);

  return (
    <div className={styles.clientReview13Box}>
      <section
        className={styles.clientReview13}
        aria-label={title || 'Depoimentos'}
        data-role="cr-root"
      >
        <link rel="stylesheet" href={FONTES_13} />
        <div className={styles.inner}>
          <div className={styles.head}>
            {title && (
              <h2 className={styles.title} data-role="cr-title">
                {title}
              </h2>
            )}
            <div className={styles.arrows}>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => passo(-1)}
                disabled={trilho.inicio}
                aria-label="Depoimentos anteriores"
              >
                <Chevron dir="prev" />
              </button>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => passo(1)}
                disabled={trilho.fim}
                aria-label="Próximos depoimentos"
              >
                <Chevron dir="next" />
              </button>
            </div>
          </div>
          <div
            ref={railRef}
            className={styles.rail}
            onScroll={medir}
            data-role="cr-list"
          >
            {reviews.map((r, i) => {
              const nome = [r.author, r.location].filter(Boolean).join(' · ');
              return (
                <figure key={i} className={styles.card} data-role="cr-card">
                  {!!r.rating && (
                    <Stars nota={Math.min(5, Math.max(0, Number(r.rating)))} />
                  )}
                  {r.text && (
                    <blockquote className={styles.quote}>{r.text}</blockquote>
                  )}
                  {(nome || r.productName) && (
                    <figcaption className={styles.who}>
                      <span className={styles.avatar} aria-hidden="true">
                        {r.image && (
                          <img
                            src={r.image}
                            alt=""
                            width={96}
                            height={96}
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </span>
                      <span className={styles.whoCopy}>
                        {nome && <span className={styles.author}>{nome}</span>}
                        {r.productName && (
                          <span className={styles.product}>
                            {r.productName}
                          </span>
                        )}
                      </span>
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
          {reviews.length > 1 && (
            <div className={styles.dots}>
              {reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={styles.dotBtn}
                  onClick={() => ir(i)}
                  aria-current={i === atual}
                  aria-label={
                    i === atual
                      ? `Depoimento ${i + 1}, atual`
                      : `Depoimento ${i + 1}`
                  }
                >
                  <span
                    className={`${styles.dot}${i === atual ? ` ${styles.dotOn}` : ''}`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

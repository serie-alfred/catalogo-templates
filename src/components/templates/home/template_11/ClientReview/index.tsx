import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/ClientReview11` do faststore.starter (família 11, Grade; desenho
 * `ClientReview11` / `ClientReview11-mobile`). Mesmo markup, mesmas classes, mesmos
 * `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o
 * mock.ts de lá (sem miniatura da peça: vale o placeholder do CSS). o nome da peça sai sem
 * classe, como lá (não tem regra no desenho).
 */
interface ClientReview11Review {
  text?: string;
  rating?: number;
  author?: string;
  productRef?: string;
  productName?: string;
  productUrl?: string;
  productImage?: string;
}

interface ClientReview11Props {
  sectionNumber?: string;
  title?: string;
  reviews?: ClientReview11Review[];
}

// Conteúdo do mock.ts do starter.
const author = '[Nome do cliente] · [Cidade, UF]';

const MOCK: ClientReview11Props = {
  sectionNumber: '06',
  title: 'Quem já tem em casa',
  reviews: [
    {
      rating: 5,
      text: 'Chegou bem embalada e a montagem levou dez minutos. A luz é quente na medida certa para leitura.',
      author,
      productRef: 'N°024',
      productName: 'Luminária de Mesa Arco',
      productUrl: '/luminaria-de-mesa-arco/p',
    },
    {
      rating: 5,
      text: 'O freijó é ainda mais bonito ao vivo. Uso o banco como mesa lateral na sala.',
      author,
      productRef: 'N°008',
      productName: 'Banco Madeira Maciça',
      productUrl: '/banco-madeira-macica/p',
    },
    {
      rating: 5,
      text: 'A equipe do showroom me ajudou a definir a altura do pendente. Ficou exato sobre a mesa de jantar.',
      author,
      productRef: 'N°042',
      productName: 'Pendente Globo Vidro',
      productUrl: '/pendente-globo-vidro/p',
    },
  ],
};

const ESTRELA =
  'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';

const Seta = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    width="18"
    height="18"
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

function nota(rating?: number) {
  const n = Number(rating);
  return Number.isFinite(n) && n > 0 ? Math.min(5, n) : 0;
}

export default function ClientReview11() {
  const { sectionNumber, title, reviews = [] } = MOCK;
  const railRef = useRef<HTMLDivElement>(null);
  const [trilho, setTrilho] = useState({ inicio: true, fim: true });

  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el || !el.scrollWidth) return;
    setTrilho({
      inicio: el.scrollLeft <= 1,
      fim: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
    });
  }, []);
  useEffect(() => {
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [medir, reviews.length]);
  const passo = (dir: 1 | -1) => {
    const el = railRef.current;
    if (el)
      el.scrollBy({
        left: dir * el.clientWidth,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
  };

  if (!reviews.length) return null;

  return (
    <div className={styles.clientReview11Box}>
      <section
        className={styles.clientReview11}
        aria-label={title || 'Depoimentos'}
        data-role="rv-root"
      >
        <link rel="stylesheet" href={FONTES_11} />
        <div className={styles.inner}>
          <div className={styles.head}>
            {(title || sectionNumber) && (
              <h2 className={styles.title} data-role="rv-title">
                {sectionNumber && (
                  <span className={styles.number}>[{sectionNumber}]</span>
                )}
                {title}
              </h2>
            )}
            <span className={styles.spacer} />
            <button
              type="button"
              className={styles.arrow}
              onClick={() => passo(-1)}
              disabled={trilho.inicio}
              aria-label="Depoimentos anteriores"
            >
              <Seta dir="prev" />
            </button>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => passo(1)}
              disabled={trilho.fim}
              aria-label="Próximos depoimentos"
            >
              <Seta dir="next" />
            </button>
          </div>
          <div ref={railRef} className={styles.rail} onScroll={medir}>
            {reviews.map((r, i) => {
              const n = nota(r.rating);
              const cheias = Math.round(n);
              return (
                <figure key={i} className={styles.review} data-role="rv-item">
                  {n > 0 && (
                    <div className={styles.rating}>
                      <span className={styles.stars}>
                        <span className={styles.srOnly}>
                          Nota {n.toString().replace('.', ',')} de 5
                        </span>
                        {[0, 1, 2, 3, 4].map(k => (
                          <svg
                            key={k}
                            className={styles.star}
                            viewBox="0 0 24 24"
                            fill={k < cheias ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth={k < cheias ? 0 : 1.5}
                            aria-hidden="true"
                          >
                            <path d={ESTRELA} />
                          </svg>
                        ))}
                      </span>
                      <span className={styles.score} aria-hidden="true">
                        {n.toFixed(1).replace('.', ',')}
                      </span>
                    </div>
                  )}
                  {r.text && (
                    <blockquote className={styles.quote}>{r.text}</blockquote>
                  )}
                  {(r.author || r.productName) && (
                    <figcaption className={styles.caption}>
                      {r.author && (
                        <span className={styles.author}>{r.author}</span>
                      )}
                      {r.productName && (
                        <a
                          className={styles.product}
                          href={r.productUrl || '#'}
                          data-role="rv-product"
                        >
                          <span className={styles.thumb}>
                            {r.productImage && (
                              <img
                                src={r.productImage}
                                alt=""
                                width={88}
                                height={88}
                                loading="lazy"
                                decoding="async"
                              />
                            )}
                          </span>
                          <span className={styles.productCopy}>
                            {r.productRef && (
                              <span className={styles.productRef}>
                                {r.productRef}
                              </span>
                            )}
                            <span>
                              {r.productName}
                            </span>
                          </span>
                        </a>
                      )}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

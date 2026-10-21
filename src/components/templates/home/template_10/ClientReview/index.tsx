'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/ClientReview10` do faststore.starter (família 10, Varejo;
 * desenho `ClientReview10`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá (nome e cidade como marcadores, como no desenho); trilho de scroll nativo com
 * as setas e os pontos medidos do scroll, como lá. Sem foto de produto.
 */

interface Review {
  rating: number;
  title: string;
  text: string;
  productName: string;
  author: string;
}

const TITLE = 'O que nossos clientes dizem';
const TEXT = 'Depoimentos enviados para o nosso atendimento.';
const AUTOR = '[Nome do cliente] · [Cidade, UF]';
const REVIEWS: Review[] = [
  {
    rating: 5,
    title: 'Chegou antes do prazo',
    text: 'Comprei a air fryer numa terça e chegou na quinta. Bem embalada e funcionando perfeitamente.',
    productName: 'Air Fryer 5,5 L Digital 1500 W Inox',
    author: AUTOR,
  },
  {
    rating: 5,
    title: 'Ótimo custo-benefício',
    text: 'A imagem é excelente para o preço e a configuração inicial foi simples.',
    productName: 'Smart TV 55" 4K UHD com Wi-Fi',
    author: AUTOR,
  },
  {
    rating: 5,
    title: 'Troca resolvida pelo site',
    text: 'Precisei trocar a cor do fone e o processo foi todo online, sem complicação.',
    productName: 'Fone Bluetooth com Cancelamento de Ruído',
    author: AUTOR,
  },
];

const STAR =
  'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z';

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ClientReview10() {
  const railRef = useRef<HTMLUListElement>(null);
  const [estado, setEstado] = useState({ inicio: true, fim: true, atual: 0 });

  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el || !el.children.length) return;
    const primeiro = el.children[0] as HTMLElement;
    const passo =
      primeiro.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0);
    setEstado({
      inicio: el.scrollLeft <= 1,
      fim: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      atual: Math.min(
        el.children.length - 1,
        Math.round(el.scrollLeft / (passo || 1))
      ),
    });
  }, []);

  useEffect(() => {
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [medir]);

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

  return (
    <div className={styles.clientReview10Box}>
      <section
        className={styles.clientReview10}
        aria-label={TITLE}
        data-role="rv-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.heading}>
              <h2 className={styles.title} data-role="rv-title">
                {TITLE}
              </h2>
              <p className={styles.text} data-role="rv-text">
                {TEXT}
              </p>
            </div>
            <div className={styles.arrows}>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => passo(-1)}
                disabled={estado.inicio}
                aria-label="Depoimentos anteriores"
              >
                <Chevron dir="prev" />
              </button>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => passo(1)}
                disabled={estado.fim}
                aria-label="Próximos depoimentos"
              >
                <Chevron dir="next" />
              </button>
            </div>
          </div>
          <ul ref={railRef} className={styles.list} onScroll={medir}>
            {REVIEWS.map(r => {
              const nota = Math.max(0, Math.min(5, Math.round(r.rating)));
              return (
                <li key={r.title} className={styles.card} data-role="rv-item">
                  <span
                    className={styles.stars}
                    role="img"
                    aria-label={`Nota ${nota} de 5`}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <svg
                        key={n}
                        viewBox="0 0 24 24"
                        fill={n <= nota ? 'currentColor' : 'none'}
                        stroke={n <= nota ? 'none' : 'currentColor'}
                        strokeWidth="1.6"
                        aria-hidden="true"
                      >
                        <path d={STAR} />
                      </svg>
                    ))}
                  </span>
                  <strong className={styles.reviewTitle}>{r.title}</strong>
                  <p className={styles.reviewText}>{r.text}</p>
                  <div className={styles.foot}>
                    <span className={styles.thumb} />
                    <span className={styles.meta}>
                      <a className={styles.product} href="#">
                        {r.productName}
                      </a>
                      <span className={styles.author}>{r.author}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className={styles.dots} aria-hidden="true">
            {REVIEWS.map((r, i) => (
              <span
                key={r.title}
                className={`${styles.dot}${i === estado.atual ? ` ${styles.dotOn}` : ''}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

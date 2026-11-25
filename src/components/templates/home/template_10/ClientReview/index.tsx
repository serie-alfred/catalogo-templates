'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/ClientReview10` do faststore.starter (família 10, Varejo;
 * desenho `ClientReview10`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá (nome e cidade como marcadores, como no desenho); trilho de scroll nativo com
 * as setas e os pontos medidos do scroll, como lá. Sem foto de produto.
 */

interface Review {
  rating?: number;
  title?: string;
  text?: string;
  productName?: string;
  productUrl?: string;
  productImage?: string;
  author?: string;
}

/** O conteúdo da seção: os campos do `section.schema` do ClientReview10. */
interface ClientReview10Conteudo {
  title?: string;
  text?: string;
  reviews: Review[];
}

const AUTOR = '[Nome do cliente] · [Cidade, UF]';
const MOCK: ClientReview10Conteudo = {
  title: 'O que nossos clientes dizem',
  text: 'Depoimentos enviados para o nosso atendimento.',
  reviews: [
    {
      rating: 5,
      title: 'Chegou antes do prazo',
      text: 'Comprei a air fryer numa terça e chegou na quinta. Bem embalada e funcionando perfeitamente.',
      productName: 'Air Fryer 5,5 L Digital 1500 W Inox',
      productUrl: '/air-fryer-5-5l-digital-inox/p',
      author: AUTOR,
    },
    {
      rating: 5,
      title: 'Ótimo custo-benefício',
      text: 'A imagem é excelente para o preço e a configuração inicial foi simples.',
      productName: 'Smart TV 55" 4K UHD com Wi-Fi',
      productUrl: '/smart-tv-55-4k-uhd-wifi/p',
      author: AUTOR,
    },
    {
      rating: 5,
      title: 'Troca resolvida pelo site',
      text: 'Precisei trocar a cor do fone e o processo foi todo online, sem complicação.',
      productName: 'Fone Bluetooth com Cancelamento de Ruído',
      productUrl: '/fone-bluetooth-cancelamento-ruido/p',
      author: AUTOR,
    },
  ],
};

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
  const { title, text, reviews } = useConteudoDaSecao(MOCK);
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

  if (!reviews.length) return null;

  return (
    <div className={styles.clientReview10Box}>
      <section
        className={styles.clientReview10}
        aria-label={title || 'Depoimentos'}
        data-role="rv-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.heading}>
              {title && (
                <h2 className={styles.title} data-role="rv-title">
                  {title}
                </h2>
              )}
              {text && (
                <p className={styles.text} data-role="rv-text">
                  {text}
                </p>
              )}
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
            {reviews.map((r, i) => {
              const nota = Math.max(
                0,
                Math.min(5, Math.round(Number(r.rating) || 0))
              );
              return (
                <li key={i} className={styles.card} data-role="rv-item">
                  {nota > 0 && (
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
                  )}
                  {r.title && (
                    <strong className={styles.reviewTitle}>{r.title}</strong>
                  )}
                  {r.text && <p className={styles.reviewText}>{r.text}</p>}
                  {(r.productName || r.author) && (
                    <div className={styles.foot}>
                      <span className={styles.thumb}>
                        {r.productImage && (
                          <img
                            src={r.productImage}
                            alt=""
                            width={44}
                            height={44}
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </span>
                      <span className={styles.meta}>
                        {r.productName &&
                          (r.productUrl ? (
                            <a className={styles.product} href={r.productUrl}>
                              {r.productName}
                            </a>
                          ) : (
                            <span className={styles.product}>
                              {r.productName}
                            </span>
                          ))}
                        {r.author && (
                          <span className={styles.author}>{r.author}</span>
                        )}
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <div className={styles.dots} aria-hidden="true">
            {reviews.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot}${i === estado.atual ? ` ${styles.dotOn}` : ''}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ClientReview10.conteudoPadrao = MOCK;

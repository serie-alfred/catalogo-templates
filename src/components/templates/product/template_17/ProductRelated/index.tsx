'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  FONTES_17,
  ProductCard17,
  produto17,
} from '@/components/templates/common/template_17/Spot';

import styles from './index.module.css';

/**
 * Espelha os relacionados da família 17 do faststore.starter: o override
 * `overrides/CrossSellingShelf17` da seção NATIVA `CrossSellingShelf` (moldura
 * `sass/crossSellingShelf17.module.scss`) com o carrossel `organisms/ProductShowcase17` e o
 * ProductCard17 dentro — o mesmo DOM que o palco de lá monta (`CrossSellingShelf17Stage`:
 * `section > h2 + [data-fs-product-shelf] > carrossel`). Produtos = o mock.ts do
 * ProductShowcase17, com Pix e as notas que o palco injeta (sem foto, como o desenho).
 *
 * Divergências deliberadas: sem a consulta "quem levou também levou" e sem analytics.
 */

// O mock.ts do ProductShowcase17: sem desconto; o 1x some a parcela (lá, `bestInstallment`).
const PRODUTOS = [
  produto17(
    'petisco-bifinho-natural-500g',
    'Petisco Bifinho Natural 500 g',
    'Vitta Pet',
    39.9,
    39.9,
    2,
    19.95,
    38.3,
    true,
    4.7,
    97
  ),
  produto17(
    'cama-ninho-antiderrapante-g',
    'Cama Ninho Antiderrapante G',
    'Casa do Bicho',
    189.9,
    189.9,
    6,
    31.65,
    182.3,
    true,
    4.9,
    132
  ),
  produto17(
    'peitoral-ajustavel-com-guia-m',
    'Peitoral Ajustável com Guia M',
    'Vitta Pet',
    89.9,
    89.9,
    3,
    29.97,
    86.3,
    true,
    4.7,
    75
  ),
  produto17(
    'mordedor-corda-trancada',
    'Mordedor Corda Trançada',
    'Vitta Pet',
    19.9,
    19.9,
    1,
    19.9,
    19.1,
    true,
    4.8,
    63
  ),
];

const Seta = ({ dir }: { dir: 'prev' | 'next' }) => (
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

export default function ProductRelated17() {
  const railRef = useRef<HTMLUListElement>(null);
  const [trilho, setTrilho] = useState({
    inicio: true,
    fim: true,
    paginas: 1,
    atual: 0,
  });

  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el || !el.scrollWidth) return;
    const fim = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    const paginas = Math.max(
      1,
      Math.ceil((el.scrollWidth - 1) / el.clientWidth)
    );
    setTrilho({
      inicio: el.scrollLeft <= 1,
      fim,
      paginas,
      atual: fim ? paginas - 1 : Math.round(el.scrollLeft / el.clientWidth),
    });
  }, []);

  useEffect(() => {
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [medir]);

  const passo = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir * el.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  };

  return (
    <div className={styles.crossSellingShelf17Box}>
      <section
        className={`section section-product-shelf layout__section ${styles.crossSellingShelf17}`}
      >
        <h2 className="text__title-section layout__content">
          Quem levou esta ração também levou
        </h2>
        <div data-fs-product-shelf>
          <div
            className={styles.productShowcase17}
            id="quem-levou-tambem-levou"
            data-role="rel-carousel"
          >
            {/* As fontes da família (o título é o h2 nativo da seção, fora deste nó). */}
            <link rel="stylesheet" href={FONTES_17} />
            <div className={styles.arrows}>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => passo(-1)}
                disabled={trilho.inicio}
                aria-label="Produtos anteriores"
              >
                <Seta dir="prev" />
              </button>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowNext}`}
                onClick={() => passo(1)}
                disabled={trilho.fim}
                aria-label="Próximos produtos"
              >
                <Seta dir="next" />
              </button>
            </div>
            <ul
              ref={railRef}
              className={styles.rail}
              onScroll={medir}
              data-role="rel-list"
            >
              {PRODUTOS.map(p => (
                <li key={p.id} className={styles.slide}>
                  <ProductCard17 product={p} />
                </li>
              ))}
            </ul>
            {/* Pontos (só no mobile, como no desenho): uma página por largura do trilho. */}
            {trilho.paginas > 1 && (
              <div className={styles.dots} aria-hidden="true">
                {Array.from({ length: trilho.paginas }).map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.dot}${i === trilho.atual ? ` ${styles.dotOn}` : ''}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

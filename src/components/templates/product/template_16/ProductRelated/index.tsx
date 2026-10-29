'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  FONTES_16,
  ProductCard16,
  produto16,
} from '@/components/templates/common/template_16/Spot';

import styles from './index.module.css';

/**
 * Espelha os relacionados da família 16 do faststore.starter: o override
 * `overrides/CrossSellingShelf16` da seção NATIVA `CrossSellingShelf` (moldura
 * `sass/crossSellingShelf16.module.scss`) com o carrossel `organisms/ProductShowcase16` e o
 * ProductCard16 dentro — o mesmo DOM que o palco de lá monta (`CrossSellingShelf16Stage`:
 * `section > h2 + [data-fs-product-shelf] > carrossel`). Produtos = o mock.ts do
 * ProductShowcase16 (sem foto, sem Pix e sem estrelas, como o desenho).
 *
 * Divergências deliberadas: sem a consulta "quem levou também levou" e sem analytics.
 */

const PRODUTOS = [
  produto16(
    'conjunto-moletom-arco-iris',
    'Conjunto Moletom Arco-Íris',
    159.9,
    159.9,
    6,
    26.65
  ),
  produto16(
    'pelucia-dino-verde-30-cm',
    'Pelúcia Dino Verde 30 cm',
    119.9,
    119.9,
    6,
    19.98
  ),
  produto16(
    'livro-cartonado-bichos-do-mar',
    'Livro Cartonado Bichos do Mar',
    39.9,
    39.9,
    2,
    19.95
  ),
  produto16(
    'meia-antiderrapante-kit-3-pares',
    'Meia Antiderrapante Kit 3 pares',
    44.9,
    44.9,
    2,
    22.45
  ),
];

const Seta = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ProductRelated16() {
  const railRef = useRef<HTMLUListElement>(null);
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
  }, [medir]);

  const passo = (dir: 1 | -1) => {
    const el = railRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className={styles.crossSellingShelf16Box}>
      <section
        className={`section section-product-shelf layout__section ${styles.crossSellingShelf16}`}
      >
        <h2 className="text__title-section layout__content">
          Quem levou este, também levou
        </h2>
        <div data-fs-product-shelf>
          <div
            className={styles.productShowcase16}
            id="quem-levou-tambem-levou"
            data-role="rel-carousel"
          >
            {/* As fontes da família (o título é o h2 nativo da seção, fora deste nó). */}
            <link rel="stylesheet" href={FONTES_16} />
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
                  <ProductCard16 product={p} showRating={false} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

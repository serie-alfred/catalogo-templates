'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  FONTES_11,
  ProductCard11,
  produto11,
  type Produto11,
} from '@/components/templates/common/template_11/Spot';

import styles from './index.module.css';

/**
 * Espelha os relacionados da família 11 do faststore.starter (desenho `ProductRelated11`):
 * a moldura da seção NATIVA `CrossSellingShelf` que o override `overrides/CrossSellingShelf11`
 * pele (`section > h2 + [data-fs-product-shelf]`, como o palco de lá a reproduz), com o
 * carrossel `organisms/ProductShowcase11` dentro e o card 11 em cada slot, em grade de
 * filetes (`variant="grid"`, `layout="shelf"`, como no override). Mesmo markup, classes e
 * `data-role`; o CSS junta as duas folhas de lá. Produtos = o `mock.ts` do
 * ProductShowcase11. As classes globais do core (`section`, `text__title-section`…) ficam
 * como no DOM nativo; nenhuma regra delas é necessária aqui.
 */

const PRODUTOS: Produto11[] = [
  produto11(
    '040',
    'lampada-filamento-globo',
    'Lâmpada Filamento Globo',
    89,
    3,
    29.67
  ),
  produto11('036', 'abajur-ceramica', 'Abajur Cerâmica', 560, 10, 56),
  produto11('008', 'banco-madeira-macica', 'Banco Madeira Maciça', 760, 10, 76),
  produto11('055', 'prateleira-modular', 'Prateleira Modular', 1980, 10, 198),
];

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

export default function ProductRelated11() {
  const railRef = useRef<HTMLUListElement>(null);
  const [trilho, setTrilho] = useState({ inicio: true, fim: true, atual: 0 });

  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el || !el.scrollWidth) return;
    const passo =
      (el.firstElementChild as HTMLElement | null)?.offsetWidth ||
      el.clientWidth;
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

  const atual = Math.min(trilho.atual, PRODUTOS.length - 1);

  return (
    <div className={styles.crossSellingShelf11Box}>
      <section
        className={`section section-product-shelf layout__section ${styles.crossSellingShelf11}`}
      >
        <h2 className="text__title-section layout__content">
          Quem viu também viu
        </h2>
        <div data-fs-product-shelf>
          <div
            className={styles.productShowcase11}
            id="quem-viu-tambem-viu"
            data-role="rel-carousel"
          >
            {/* As fontes da família (o título é o h2 nativo da seção, fora deste nó). */}
            <link rel="stylesheet" href={FONTES_11} />
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
                className={styles.arrow}
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
                  <ProductCard11 product={p} variant="grid" layout="shelf" />
                </li>
              ))}
            </ul>
            {PRODUTOS.length > 1 && (
              <div className={styles.progress} aria-hidden="true">
                <span className={styles.progressNum}>
                  {String(atual + 1).padStart(2, '0')} /{' '}
                  {String(PRODUTOS.length).padStart(2, '0')}
                </span>
                <span className={styles.progressTrack}>
                  <span
                    style={{
                      width: `${100 / PRODUTOS.length}%`,
                      left: `${(atual * 100) / PRODUTOS.length}%`,
                    }}
                  />
                </span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

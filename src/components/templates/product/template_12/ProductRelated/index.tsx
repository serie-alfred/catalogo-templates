'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  FONTES_12,
  ProductCard12,
  produto12,
  type Produto12,
} from '@/components/templates/common/template_12/Spot';

import styles from './index.module.css';

/**
 * Espelha os relacionados da família 12 do faststore.starter (desenho `ProductRelated12`):
 * a moldura da seção NATIVA `CrossSellingShelf` que o override `overrides/CrossSellingShelf12`
 * pele (`section > h2 + [data-fs-product-shelf]`, como o palco `CrossSellingShelf12Stage` de lá
 * a reproduz), com o carrossel `organisms/ProductShowcase12` dentro e o ProductCard12 em cada
 * slot. Mesmo markup, classes e `data-role`; o CSS junta as duas folhas de lá. Produtos e notas
 * = o `mock.ts` do ProductShowcase12. As classes globais do core (`section`,
 * `text__title-section`…) ficam como no DOM nativo; nenhuma regra delas é necessária aqui.
 *
 * Divergências deliberadas: sem a consulta da seção nativa nem analytics; a nota vai em
 * `product.rating` (lá, prop `rating` do card no palco).
 */

const PRODUTOS: Produto12[] = [
  produto12('gel-de-limpeza-suave-150ml', 'Gel de Limpeza Suave 150 ml', 59.9, 59.9, 2, 29.95, { average: 4.8, totalCount: 674 }),
  produto12('hidratante-facial-gel-creme-50g', 'Hidratante Facial Gel-Creme 50 g', 89.9, 89.9, 3, 29.97, { average: 4.8, totalCount: 860 }),
  produto12('protetor-solar-fps-50-toque-seco-40ml', 'Protetor Solar FPS 50 Toque Seco 40 ml', 79.9, 94.9, 2, 39.95, { average: 4.7, totalCount: 2115 }),
  produto12('tonico-facial-calmante-120ml', 'Tônico Facial Calmante 120 ml', 54.9, 54.9, 2, 27.45, { average: 4.8, totalCount: 455 }),
];

const Seta = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ProductRelated12() {
  const railRef = useRef<HTMLUListElement>(null);
  const [trilho, setTrilho] = useState({ inicio: true, fim: true, pos: 0, vis: 1 });

  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el || !el.scrollWidth) return;
    setTrilho({
      inicio: el.scrollLeft <= 1,
      fim: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      pos: el.scrollWidth > el.clientWidth ? el.scrollLeft / (el.scrollWidth - el.clientWidth) : 0,
      vis: el.scrollWidth ? Math.min(1, el.clientWidth / el.scrollWidth) : 1,
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
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <div className={styles.crossSellingShelf12Box}>
      <section className={`section section-product-shelf layout__section ${styles.crossSellingShelf12}`}>
        <h2 className="text__title-section layout__content">Quem comprou, também levou</h2>
        <div data-fs-product-shelf>
          <div className={styles.productShowcase12} id="quem-comprou-tambem-levou" data-role="rel-carousel">
            {/* As fontes da família (o título é o h2 nativo da seção, fora deste nó). */}
            <link rel="stylesheet" href={FONTES_12} />
            <div className={styles.arrows}>
              <button type="button" className={`${styles.arrow} ${styles.arrowPrev}`} onClick={() => passo(-1)} disabled={trilho.inicio} aria-label="Produtos anteriores">
                <Seta dir="prev" />
              </button>
              <button type="button" className={`${styles.arrow} ${styles.arrowNext}`} onClick={() => passo(1)} disabled={trilho.fim} aria-label="Próximos produtos">
                <Seta dir="next" />
              </button>
            </div>
            <ul ref={railRef} className={styles.rail} onScroll={medir} data-role="rel-list">
              {PRODUTOS.map(p => (
                <li key={p.id} className={styles.slide}>
                  <ProductCard12 product={p} />
                </li>
              ))}
            </ul>
            {PRODUTOS.length > 1 && trilho.vis < 1 && (
              <div className={styles.progress} aria-hidden="true">
                <span style={{ width: `${trilho.vis * 100}%`, left: `${trilho.pos * (1 - trilho.vis) * 100}%` }} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FONTES_14, ProductCard14, produto14, type Produto14 } from '@/components/templates/common/template_14/Spot';

import styles from './index.module.css';

/**
 * Espelha os relacionados da família 14 do faststore.starter (desenho `ProductRelated14`):
 * a moldura da seção NATIVA `CrossSellingShelf` que o override `overrides/CrossSellingShelf14`
 * pele (`section > h2 + [data-fs-product-shelf]`, como o palco `CrossSellingShelf14Stage` de lá
 * a reproduz), com o carrossel `organisms/ProductShowcase14` dentro e o ProductCard14 em cada
 * slot. Mesmo markup, classes e `data-role`; o CSS junta as duas folhas de lá. Produtos e notas
 * = o `mock.ts` do ProductShowcase14 (as notas, lá, só o palco injeta). As classes globais do
 * core (`section`, `text__title-section`…) ficam como no DOM nativo; nenhuma regra delas é
 * necessária aqui. Sem setas e sem régua no mobile, como lá.
 *
 * Divergências deliberadas: sem a consulta da seção nativa nem analytics.
 */

const PRODUTOS: Produto14[] = [
  produto14('camiseta-dry-pace', 'Camiseta Dry Pace', 129.9, 129.9, 10, 12.99, 0, true, { average: 5, totalCount: 87 }),
  produto14('shorts-split-5', "Shorts Split 5''", 149.9, 149.9, 10, 14.99, 0, true, { average: 5, totalCount: 56 }),
  produto14('meia-pace-cano-medio', 'Meia Pace Cano Médio', 59.9, 59.9, 2, 29.95),
  produto14('garrafa-termica-750ml', 'Garrafa Térmica 750 ml', 89.9, 89.9, 3, 29.97, 86.3),
  produto14('bone-run-dry', 'Boné Run Dry', 99.9, 99.9, 3, 33.3),
];

const Seta = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ProductRelated14() {
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
    if (!el) return;
    el.scrollBy({
      left: dir * el.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <div className={styles.crossSellingShelf14Box}>
      <section className={`section section-product-shelf layout__section ${styles.crossSellingShelf14}`}>
        <h2 className="text__title-section layout__content">Complete seu treino</h2>
        <div data-fs-product-shelf>
          <div className={styles.productShowcase14} id="complete-seu-treino" data-role="rel-carousel">
            {/* As fontes da família (o título é o h2 nativo da seção, fora deste nó). */}
            <link rel="stylesheet" href={FONTES_14} />
            <div className={styles.arrows}>
              <button type="button" className={styles.prev} onClick={() => passo(-1)} disabled={trilho.inicio} aria-label="Produtos anteriores">
                <Seta dir="prev" />
              </button>
              <button type="button" className={styles.next} onClick={() => passo(1)} disabled={trilho.fim} aria-label="Próximos produtos">
                <Seta dir="next" />
              </button>
            </div>
            <ul ref={railRef} className={styles.rail} onScroll={medir} data-role="rel-list">
              {PRODUTOS.map(p => (
                <li key={p.id} className={styles.slide}>
                  <ProductCard14 product={p} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FONTES_15, ProductCard15, produto15, type Produto15 } from '@/components/templates/common/template_15/Spot';

import styles from './index.module.css';

/**
 * Espelha os relacionados da família 15 do faststore.starter (desenho `ProductRelated15`):
 * a moldura da seção NATIVA `CrossSellingShelf` que o override `overrides/CrossSellingShelf15`
 * pele (`section > h2 + [data-fs-product-shelf]`, como o palco `CrossSellingShelf15Stage` de lá
 * a reproduz), com o carrossel `organisms/ProductShowcase15` dentro (três cards por vez, o
 * desvio aprovado da 15) e o ProductCard15 em cada slot. Mesmo markup, classes e `data-role`; o
 * CSS junta as duas folhas de lá. Produtos = o `mock.ts` do ProductShowcase15 (quatro, para o
 * trilho rolar). As classes globais do core (`section`, `text__title-section`…) ficam como no
 * DOM nativo; nenhuma regra delas é necessária aqui.
 *
 * Divergências deliberadas: sem a consulta da seção nativa nem analytics.
 */

const PRODUTOS: Produto15[] = [
  produto15('brincos-perola-barroca', 'Brincos Pérola Barroca', 1290, 1290, 10, 129),
  produto15('colar-riviera-prata-925', 'Colar Riviera Prata 925', 2450, 2450, 10, 245),
  produto15('alianca-lisa-ouro-18k-4mm', 'Aliança Lisa Ouro 18k 4 mm', 3290, 3290, 10, 329),
  produto15('anel-solitario-ouro-18k', 'Anel Solitário Ouro 18k', 6890, 6890, 10, 689),
];

const Seta = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ProductRelated15() {
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
    <div className={styles.crossSellingShelf15Box}>
      <section className={`section section-product-shelf layout__section ${styles.crossSellingShelf15}`}>
        <h2 className="text__title-section layout__content">Você também pode gostar</h2>
        <div data-fs-product-shelf>
          <div className={styles.productShowcase15} id="voce-tambem-pode-gostar" data-role="rel-carousel">
            {/* As fontes da família (o título é o h2 nativo da seção, fora deste nó). */}
            <link rel="stylesheet" href={FONTES_15} />
            <div className={styles.arrows}>
              <button type="button" className={styles.arrow} onClick={() => passo(-1)} disabled={trilho.inicio} aria-label="Produtos anteriores">
                <Seta dir="prev" />
              </button>
              <button type="button" className={styles.arrow} onClick={() => passo(1)} disabled={trilho.fim} aria-label="Próximos produtos">
                <Seta dir="next" />
              </button>
            </div>
            <ul ref={railRef} className={styles.rail} onScroll={medir} data-role="rel-list">
              {PRODUTOS.map(p => (
                <li key={p.id} className={styles.slide}>
                  <ProductCard15 product={p} />
                </li>
              ))}
            </ul>
            {PRODUTOS.length > 1 && trilho.vis < 1 && (
              <div className={styles.progressWrap} aria-hidden="true">
                <div className={styles.progress}>
                  <span style={{ width: `${trilho.vis * 100}%`, left: `${trilho.pos * (1 - trilho.vis) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

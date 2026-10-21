import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  FONTES_09,
  ProductCard09,
  type Produto09,
} from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha os relacionados da família 09 do faststore.starter (desenho `ProductRelated09`):
 * a moldura da seção NATIVA `CrossSellingShelf` que o override `overrides/CrossSellingShelf09`
 * pele (`section > h2 + [data-fs-product-shelf]`, como o palco de lá a reproduz), com o
 * carrossel `organisms/ProductShowcase09` dentro e o card 09 em cada slot. Mesmo markup,
 * classes e `data-role`; o CSS junta as duas folhas de lá. Produtos = o `mock.ts` do
 * ProductShowcase09. As classes globais do core (`section`, `text__title-section`…) ficam
 * como no DOM nativo; nenhuma regra delas é necessária aqui.
 */

const produto = (
  id: string,
  name: string,
  price: number,
  listPrice: number,
  installmentValue: number
): Produto09 => ({ id, name, price, listPrice, installments: 6, installmentValue, inStock: true });

const PRODUTOS: Produto09[] = [
  produto('saia-plissada-midi-caramelo', 'Saia Plissada Midi Caramelo', 359, 359, 59.83),
  produto('blazer-estruturado-cru', 'Blazer Estruturado Cru', 689, 790, 114.83),
  produto('trico-gola-alta-mescla', 'Tricô Gola Alta Mescla', 399, 399, 66.5),
  produto('camisa-oversized-algodao-off-white', 'Camisa Oversized Algodão Off-White', 329, 329, 54.83),
];

const Seta = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d={dir === 'next' ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'} />
  </svg>
);

export default function ProductRelated09() {
  const railRef = useRef<HTMLUListElement>(null);
  const [trilho, setTrilho] = useState({ inicio: true, fim: true, largura: 1, esquerda: 0 });

  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el || !el.scrollWidth) return;
    setTrilho({
      inicio: el.scrollLeft <= 1,
      fim: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      largura: el.clientWidth / el.scrollWidth,
      esquerda: el.scrollLeft / el.scrollWidth,
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
    <div className={styles.crossSellingShelf09Box}>
      <link rel="stylesheet" href={FONTES_09} />
      <section className={`section section-product-shelf layout__section ${styles.crossSellingShelf09}`}>
        <h2 className="text__title-section layout__content">Você também pode gostar</h2>
        <div data-fs-product-shelf>
          <div className={styles.productShowcase09} id="voce-tambem-pode-gostar" data-role="rel-carousel">
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
            <ul ref={railRef} className={styles.rail} onScroll={medir} data-role="rel-list">
              {PRODUTOS.map(p => (
                <li key={p.id} className={styles.slide}>
                  <ProductCard09 product={p} />
                </li>
              ))}
            </ul>
            <div className={styles.progress} aria-hidden="true">
              <span style={{ width: `${trilho.largura * 100}%`, left: `${trilho.esquerda * 100}%` }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

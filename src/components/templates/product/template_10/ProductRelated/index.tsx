'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  FONTES_10,
  ProductCard10,
  produto10,
  type Produto10,
} from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha os relacionados da família 10 do faststore.starter (desenho `ProductRelated10`):
 * a moldura da seção NATIVA `CrossSellingShelf` que o override `overrides/CrossSellingShelf10`
 * pele (`section > h2 + [data-fs-product-shelf]`, como o palco de lá a reproduz), com o
 * carrossel `organisms/ProductShowcase10` dentro e o card 10 em cada slot, sem estrelas
 * (`showRating={false}`, como no override). Mesmo markup, classes e `data-role`; o CSS junta
 * as duas folhas de lá. Produtos = o `mock.ts` do ProductShowcase10. As classes globais do
 * core (`section`, `text__title-section`…) ficam como no DOM nativo; nenhuma regra delas é
 * necessária aqui.
 */

const PRODUTOS: Produto10[] = [
  produto10(
    'smartphone-x3-128gb-grafite',
    'Smartphone X3 128 GB 5G Tela 6,5" Grafite',
    1299,
    1599,
    10,
    129.9,
    1234.05
  ),
  produto10(
    'smartphone-x7-pro-256gb-prata',
    'Smartphone X7 Pro 256 GB 5G Tela 6,8" Prata',
    3199,
    3999,
    10,
    319.9,
    3039.05
  ),
  produto10(
    'carregador-turbo-usb-c-33w',
    'Carregador Turbo USB-C 33 W',
    89.9,
    89.9,
    3,
    29.97,
    85.41
  ),
  produto10(
    'fone-bluetooth-cancelamento-ruido-r',
    'Fone Bluetooth com Cancelamento de Ruído',
    299.9,
    499.9,
    10,
    29.99,
    284.91
  ),
  produto10(
    'pelicula-vidro-smartphone-x5',
    'Película de Vidro para Smartphone X5',
    39.9,
    39.9,
    2,
    19.95,
    37.91
  ),
  // 6º fora da tela: o trilho rola e as setas ficam ativas, como no desenho.
  produto10(
    'capa-protetora-smartphone-x5',
    'Capa Protetora para Smartphone X5',
    59.9,
    79.9,
    3,
    19.97,
    56.91
  ),
];

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

export default function ProductRelated10() {
  const railRef = useRef<HTMLUListElement>(null);
  const [trilho, setTrilho] = useState({
    inicio: true,
    fim: true,
    largura: 1,
    esquerda: 0,
  });

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
    if (!el) return;
    el.scrollBy({
      left: dir * el.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  };

  return (
    <div className={styles.crossSellingShelf10Box}>
      <link rel="stylesheet" href={FONTES_10} />
      <section
        className={`section section-product-shelf layout__section ${styles.crossSellingShelf10}`}
      >
        <h2 className="text__title-section layout__content">
          Quem viu, também viu
        </h2>
        <div data-fs-product-shelf>
          <div
            className={styles.productShowcase10}
            id="quem-viu-tambem-viu"
            data-role="rel-carousel"
          >
            <div className={styles.arrows}>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowPrev}`}
                onClick={() => passo(-1)}
                disabled={trilho.inicio}
                aria-label="Produtos anteriores"
              >
                <Chevron dir="prev" />
              </button>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowNext}`}
                onClick={() => passo(1)}
                disabled={trilho.fim}
                aria-label="Próximos produtos"
              >
                <Chevron dir="next" />
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
                  <ProductCard10 product={p} showRating={false} />
                </li>
              ))}
            </ul>
            <div className={styles.progress} aria-hidden="true">
              <span
                style={{
                  width: `${trilho.largura * 100}%`,
                  left: `${trilho.esquerda * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

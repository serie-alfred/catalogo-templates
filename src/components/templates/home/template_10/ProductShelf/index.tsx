'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  ProductCard10,
  FONTES_10,
  produto10,
  type Produto10,
} from '@/components/templates/common/template_10/Spot';

/**
 * Espelha `molecules/ProductShelf10` do faststore.starter — o núcleo das duas
 * vitrines 10 (`Showcase10` = ProductShelfCustom10, variante `full`;
 * `ShelfBanner10` = ProductShelfBanner10, variante `banner`). Mesmo markup,
 * mesmas classes e `data-role`; os cards são o ProductCard10 (common/template_10/Spot).
 *
 * A folha mora em cada réplica (Showcase, ShelfBanner) — uma por item do
 * catálogo — e chega aqui por prop; as duas saem do mesmo SCSS.
 * Produtos = o mock.ts do núcleo de lá, com as notas do desenho (sem foto: vale o
 * placeholder). Sempre o ProductCard10: as vitrines 10 do starter não trocam o card
 * pelo spot escolhido (sem `usesSpot`), então a réplica também não troca.
 * Divergência deliberada: o starter interpola `style.variantFull`, que não existe no
 * SCSS (sai `undefined` no class); aqui a variante `full` não leva classe extra.
 */

type Estilos = Record<string, string>;

export type Banner10 = {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  url?: string;
  eyebrow?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
};

export type ProductShelf10Props = {
  styles: Estilos;
  variant: 'full' | 'banner';
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
  banner?: Banner10;
};

const p = (
  id: string,
  name: string,
  price: number,
  listPrice: number,
  installmentValue: number,
  pix: number,
  average: number,
  totalCount: number
): Produto10 =>
  produto10(id, name, price, listPrice, 10, installmentValue, pix, true, {
    average,
    totalCount,
  });

/** O mock.ts do `molecules/ProductShelf10`, com as notas do desenho. */
const smartphone = p(
  'smartphone-x5-128gb-preto',
  'Smartphone X5 128 GB 5G Tela 6,7" Preto',
  1799,
  2299,
  179.9,
  1709.05,
  4.8,
  1284
);
const tv = p(
  'smart-tv-55-4k-uhd-wifi',
  'Smart TV 55" 4K UHD com Wi-Fi',
  2499,
  3199,
  249.9,
  2374.05,
  4.7,
  856
);
const airFryer = p(
  'air-fryer-5-5l-digital-inox',
  'Air Fryer 5,5 L Digital 1500 W Inox',
  399.9,
  599.9,
  39.99,
  379.91,
  4.9,
  2031
);
const notebook = p(
  'notebook-15-6-core-i5-16gb',
  'Notebook 15,6" Core i5 16 GB SSD 512 GB',
  3699,
  4499,
  369.9,
  3514.05,
  4.6,
  412
);
const fone = p(
  'fone-bluetooth-cancelamento-ruido',
  'Fone Bluetooth com Cancelamento de Ruído',
  299.9,
  499.9,
  29.99,
  284.91,
  4.8,
  967
);
const cafeteira = p(
  'cafeteira-expresso-20-bar',
  'Cafeteira Expresso 20 Bar com Vaporizador',
  649.9,
  899,
  64.99,
  617.41,
  4.5,
  233
);

/** Vitrine (desenho `Showcase10`). */
export const PRODUTOS_SHELF_10: Produto10[] = [
  smartphone,
  tv,
  airFryer,
  notebook,
  fone,
  cafeteira,
];
/** Vitrine com banner (desenho `ShelfBanner10`). */
export const PRODUTOS_SHELF_10_BANNER: Produto10[] = [
  tv,
  fone,
  notebook,
  cafeteira,
  smartphone,
  airFryer,
];

const Chevron = ({ dir, size }: { dir: 'prev' | 'next'; size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={size > 18 ? 2 : 2.2}
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ProductShelf10({
  styles,
  variant,
  title,
  viewAllLabel,
  viewAllUrl,
  tagLabel,
  banner,
}: ProductShelf10Props) {
  const produtos =
    variant === 'banner' ? PRODUTOS_SHELF_10_BANNER : PRODUTOS_SHELF_10;
  const listName = title || '';

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
    if (el)
      el.scrollBy({
        left: dir * el.clientWidth,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
  };

  const cabecalho = (
    <div className={styles.head}>
      {title && (
        <h2 className={styles.title} data-role="sh-title">
          {title}
        </h2>
      )}
      <div className={styles.actions}>
        {viewAllLabel && (
          <a
            className={styles.viewAll}
            href={viewAllUrl || '#'}
            data-role="sh-view-all"
          >
            {viewAllLabel}
            <Chevron dir="next" size={18} />
          </a>
        )}
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowPrev}`}
          onClick={() => passo(-1)}
          disabled={trilho.inicio}
          aria-label="Produtos anteriores"
        >
          <Chevron dir="prev" size={20} />
        </button>
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowNext}`}
          onClick={() => passo(1)}
          disabled={trilho.fim}
          aria-label="Próximos produtos"
        >
          <Chevron dir="next" size={20} />
        </button>
      </div>
    </div>
  );

  const lista = (
    <ul
      ref={railRef}
      className={styles.rail}
      onScroll={medir}
      data-role="sh-list"
    >
      {produtos.map(prod => (
        <li key={prod.id} className={styles.slide}>
          <ProductCard10 product={prod} badge={tagLabel} />
        </li>
      ))}
    </ul>
  );

  const progresso = (
    <div className={styles.progress} aria-hidden="true">
      <span
        style={{
          width: `${trilho.largura * 100}%`,
          left: `${trilho.esquerda * 100}%`,
        }}
      />
    </div>
  );

  const temBanner =
    variant === 'banner' &&
    banner &&
    (banner.imageDesktop || banner.imageMobile || banner.title);

  return (
    <div className={styles.productShelf10Box}>
      <link rel="stylesheet" href={FONTES_10} />
      <section
        className={`${styles.productShelf10}${variant === 'banner' ? ` ${styles.variantBanner}` : ''}`}
        aria-label={listName || undefined}
        data-role="sh-root"
      >
        {variant === 'full' ? (
          <div className={styles.inner}>
            {cabecalho}
            {lista}
            {progresso}
          </div>
        ) : (
          <div className={styles.inner}>
            {temBanner && (
              <a
                className={styles.banner}
                href={banner?.url || '#'}
                data-role="sh-banner"
              >
                <span className={styles.bannerArt}>
                  {(banner?.imageDesktop || banner?.imageMobile) && (
                    <picture>
                      {banner?.imageMobile && (
                        <source
                          media="(max-width: 960px)"
                          srcSet={banner.imageMobile}
                        />
                      )}
                      <img
                        src={banner?.imageDesktop || banner?.imageMobile}
                        alt={banner?.imageAlt ?? ''}
                        width={600}
                        height={1120}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  )}
                </span>
                <span className={styles.bannerCopy}>
                  {banner?.eyebrow && (
                    <span className={styles.bannerEyebrow}>
                      {banner.eyebrow}
                    </span>
                  )}
                  {banner?.title && (
                    <span className={styles.bannerTitle}>{banner.title}</span>
                  )}
                  {banner?.text && (
                    <span className={styles.bannerText}>{banner.text}</span>
                  )}
                  {banner?.ctaLabel && (
                    <span className={styles.bannerCta}>
                      {banner.ctaLabel}
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  )}
                </span>
              </a>
            )}
            <div className={styles.side}>
              {cabecalho}
              {lista}
              {progresso}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

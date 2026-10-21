'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ProductCard09, FONTES_09, type Produto09 } from '@/components/templates/common/template_9/Spot';

/**
 * Espelha `molecules/ProductShelf09` do faststore.starter — o núcleo das duas
 * vitrines 09 (`Showcase09` = ProductShelfCustom09, variante `full`;
 * `ShelfBanner09` = ProductShelfBanner09, variante `banner`). Mesmo markup,
 * mesmas classes e `data-role`; os cards são o ProductCard09 (common/template_9/Spot).
 *
 * A folha mora em cada réplica (Showcase, ShelfBanner) — uma por item do
 * catálogo — e chega aqui por prop; as duas saem do mesmo SCSS.
 * Produtos = o mock.ts do núcleo de lá (sem foto: vale o placeholder).
 * Sempre o ProductCard09: as vitrines 09 do starter não trocam o card pelo spot
 * escolhido (sem `usesSpot`), então a réplica também não troca.
 */

type Estilos = Record<string, string>;

export type Banner09 = {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  url?: string;
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  ctaLabel?: string;
};

export type ProductShelf09Props = {
  styles: Estilos;
  variant: 'full' | 'banner';
  title?: string;
  titleEmphasis?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
  banner?: Banner09;
};

const p = (
  id: string,
  name: string,
  price: number,
  listPrice: number,
  installmentValue: number
): Produto09 => ({ id, name, price, listPrice, installments: 6, installmentValue, inStock: true });

/** O mock.ts do `molecules/ProductShelf09`. */
const PRODUTOS: Produto09[] = [
  p('vestido-midi-linho-areia', 'Vestido Midi Linho Areia', 489, 489, 81.5),
  p('camisa-oversized-algodao-off-white', 'Camisa Oversized Algodão Off-White', 329, 329, 54.83),
  p('calca-pantalona-alfaiataria', 'Calça Pantalona Alfaiataria', 419, 419, 69.83),
  p('blazer-estruturado-cru', 'Blazer Estruturado Cru', 689, 790, 114.83),
  p('trico-gola-alta-mescla', 'Tricô Gola Alta Mescla', 399, 399, 66.5),
];

const Seta = ({ dir, size = 20 }: { dir: 'prev' | 'next'; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'} />
  </svg>
);

export default function ProductShelf09({
  styles,
  variant,
  title,
  titleEmphasis,
  subtitle,
  viewAllLabel,
  viewAllUrl,
  tagLabel,
  banner,
}: ProductShelf09Props) {
  const listName = [title, titleEmphasis].filter(Boolean).join(' ');

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
    if (el)
      el.scrollBy({
        left: dir * el.clientWidth,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
  };

  const setas = (
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
  );

  const progresso = (
    <div className={styles.progress} aria-hidden="true">
      <span style={{ width: `${trilho.largura * 100}%`, left: `${trilho.esquerda * 100}%` }} />
    </div>
  );

  const titulo = (title || titleEmphasis) && (
    <h2 className={styles.title} data-role="sh-title">
      {title} {titleEmphasis && <em>{titleEmphasis}</em>}
    </h2>
  );

  const lista = (
    <ul ref={railRef} className={styles.rail} onScroll={medir} data-role="sh-list">
      {PRODUTOS.map(prod => (
        <li key={prod.id} className={styles.slide}>
          <ProductCard09 product={prod} badge={tagLabel} />
        </li>
      ))}
    </ul>
  );

  const temBanner =
    variant === 'banner' && banner && (banner.imageDesktop || banner.imageMobile || banner.title);

  return (
    <div className={styles.productShelf09Box}>
      <link rel="stylesheet" href={FONTES_09} />
      <section
        className={`${styles.productShelf09} ${variant === 'banner' ? styles.variantBanner : styles.variantFull}`}
        aria-label={listName || undefined}
        data-role="sh-root"
      >
        {variant === 'full' ? (
          <div className={styles.inner}>
            <div className={styles.head}>
              <div className={styles.heading}>
                {titulo}
                {subtitle && (
                  <p className={styles.subtitle} data-role="sh-subtitle">
                    {subtitle}
                  </p>
                )}
              </div>
              <div className={styles.actions}>
                {viewAllLabel && (
                  <a className={styles.viewAll} href={viewAllUrl || '#'} data-role="sh-view-all">
                    <span>{viewAllLabel}</span>
                  </a>
                )}
                {setas}
              </div>
            </div>
            {lista}
            <div className={styles.footMob}>
              {progresso}
              {viewAllLabel && (
                <a className={styles.viewAllMob} href={viewAllUrl || '#'}>
                  <span>{viewAllLabel}</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.inner}>
            {temBanner && (
              <a
                className={styles.banner}
                href={banner?.url || '#'}
                aria-label={banner?.imageAlt || listName || undefined}
                data-role="sh-banner"
              >
                {(banner?.imageDesktop || banner?.imageMobile) && (
                  <picture className={styles.bannerMedia}>
                    {banner?.imageMobile && (
                      <source media="(max-width: 960px)" srcSet={banner.imageMobile} />
                    )}
                    <img
                      src={banner?.imageDesktop || banner?.imageMobile}
                      alt=""
                      width={840}
                      height={1280}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                )}
                {(banner?.eyebrow || banner?.title || banner?.ctaLabel) && (
                  <span className={styles.bannerCard}>
                    {banner?.eyebrow && <span className={styles.bannerEyebrow}>{banner.eyebrow}</span>}
                    {(banner?.title || banner?.titleEmphasis) && (
                      <span className={styles.bannerTitle}>
                        {banner?.title} {banner?.titleEmphasis && <em>{banner.titleEmphasis}</em>}
                      </span>
                    )}
                    {banner?.ctaLabel && (
                      <span className={styles.bannerCta}>
                        {banner.ctaLabel} <Seta dir="next" size={16} />
                      </span>
                    )}
                  </span>
                )}
              </a>
            )}
            <div className={styles.side}>
              <div className={styles.head}>
                {titulo}
                {setas}
              </div>
              {lista}
              {progresso}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

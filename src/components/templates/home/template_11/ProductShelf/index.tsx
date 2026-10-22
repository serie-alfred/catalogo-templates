'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  ProductCard11,
  FONTES_11,
  PRODUTOS_11,
  produto11,
  type Produto11,
} from '@/components/templates/common/template_11/Spot';

/**
 * Espelha `molecules/ProductShelf11` do faststore.starter — o núcleo das duas
 * vitrines 11 (`Showcase11` = ProductShelfCustom11, variante `full`;
 * `ShelfBanner11` = ProductShelfBanner11, variante `banner`). Mesmo markup,
 * mesmas classes e `data-role`; os cards são o ProductCard11 (common/template_11/Spot)
 * em grade de filetes, com o `layout` que o starter passa (`shelf` na `full`, `quick`
 * na `banner`).
 *
 * A folha mora em cada réplica (Showcase, ShelfBanner) — uma por item do
 * catálogo — e chega aqui por prop; as duas saem do mesmo SCSS.
 * Produtos = o mock.ts do núcleo de lá (sem foto: vale o placeholder). Sempre o
 * ProductCard11: nenhum manifest 11 do starter tem `usesSpot`, então a réplica também
 * não troca o card pelo spot escolhido.
 */

type Estilos = Record<string, string>;

export type Banner11 = {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  url?: string;
  eyebrow?: string;
  title?: string;
  ctaLabel?: string;
};

export type ProductShelf11Props = {
  styles: Estilos;
  variant: 'full' | 'banner';
  sectionNumber?: string;
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
  banner?: Banner11;
};

const [luminaria, pendente, vaso, cadeira] = PRODUTOS_11;
const banco = produto11(
  '008',
  'banco-madeira-macica',
  'Banco Madeira Maciça',
  760,
  10,
  76
);
const prateleira = produto11(
  '055',
  'prateleira-modular',
  'Prateleira Modular',
  1980,
  10,
  198
);

/** Vitrine (desenho `Showcase11`). */
const PRODUTOS_FULL: Produto11[] = [luminaria, pendente, vaso, cadeira];
/** Vitrine com banner (desenho `ShelfBanner11`). */
const PRODUTOS_BANNER: Produto11[] = [banco, prateleira, luminaria, cadeira];

/** A grade da vitrine com banner tem quatro células de produto ao lado do banner (desenho). */
const NO_BANNER = 4;

const Seta = ({ dir, size }: { dir: 'prev' | 'next'; size: number }) => (
  <svg
    width={size}
    height={size}
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

export default function ProductShelf11({
  styles: style,
  variant,
  sectionNumber,
  title,
  subtitle,
  viewAllLabel,
  viewAllUrl,
  tagLabel,
  banner,
}: ProductShelf11Props) {
  const todos = variant === 'banner' ? PRODUTOS_BANNER : PRODUTOS_FULL;
  const produtos = variant === 'banner' ? todos.slice(0, NO_BANNER) : todos;
  const listName = title || '';

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
  }, [medir, produtos.length]);
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

  if (!produtos.length) return null;

  const temBanner =
    variant === 'banner' &&
    !!banner &&
    !!(
      banner.imageDesktop ||
      banner.imageMobile ||
      banner.title ||
      banner.ctaLabel
    );

  const cabecalho = (
    <div className={style.head} data-role="sh-head">
      {(title || sectionNumber) && (
        <h2 className={style.title} data-role="sh-title">
          {sectionNumber && (
            <span className={style.number}>[{sectionNumber}]</span>
          )}
          {title}
        </h2>
      )}
      {variant === 'full' && subtitle && (
        <span className={style.subtitle} data-role="sh-subtitle">
          {subtitle}
        </span>
      )}
      <span className={style.spacer} />
      {viewAllLabel && (
        <a
          className={style.viewAll}
          href={viewAllUrl || '#'}
          data-role="sh-view-all"
        >
          {viewAllLabel}
          <Seta dir="next" size={16} />
        </a>
      )}
      {variant === 'full' && (
        <>
          <button
            type="button"
            className={style.arrow}
            onClick={() => passo(-1)}
            disabled={trilho.inicio}
            aria-label="Produtos anteriores"
          >
            <Seta dir="prev" size={18} />
          </button>
          <button
            type="button"
            className={style.arrow}
            onClick={() => passo(1)}
            disabled={trilho.fim}
            aria-label="Próximos produtos"
          >
            <Seta dir="next" size={18} />
          </button>
        </>
      )}
    </div>
  );

  const cards = produtos.map((p, i) => (
    <li key={p.id || i} className={style.slide}>
      <ProductCard11
        product={p}
        badge={tagLabel}
        variant="grid"
        layout={variant === 'banner' ? 'quick' : 'shelf'}
      />
    </li>
  ));

  const bannerEl = temBanner && (
    <div className={style.banner} data-role="sh-banner">
      <a
        className={style.bannerArt}
        href={banner?.url || '#'}
        tabIndex={-1}
        aria-hidden="true"
      >
        {(banner?.imageDesktop || banner?.imageMobile) && (
          <picture>
            {banner?.imageMobile && (
              <source media="(max-width: 960px)" srcSet={banner.imageMobile} />
            )}
            <img
              src={banner?.imageDesktop || banner?.imageMobile}
              alt={banner?.imageAlt ?? ''}
              width={1280}
              height={960}
            />
          </picture>
        )}
        {banner?.eyebrow && (
          <span className={style.bannerEyebrow}>{banner.eyebrow}</span>
        )}
      </a>
      {(banner?.title || banner?.ctaLabel) && (
        <div className={style.bannerCopy}>
          {banner?.title && <p className={style.bannerTitle}>{banner.title}</p>}
          {banner?.ctaLabel && (
            <a
              className={style.bannerCta}
              href={banner?.url || '#'}
              data-role="sh-banner-cta"
            >
              {banner.ctaLabel}
              <Seta dir="next" size={18} />
            </a>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className={style.productShelf11Box}>
      <section
        className={`${style.productShelf11} ${
          variant === 'banner' ? style.variantBanner : style.variantFull
        }`}
        aria-label={listName || undefined}
        data-role="sh-root"
      >
        <link rel="stylesheet" href={FONTES_11} />
        <div className={style.inner}>
          {cabecalho}
          {variant === 'full' ? (
            <>
              <ul
                ref={railRef}
                className={style.rail}
                onScroll={medir}
                data-role="sh-list"
              >
                {cards}
              </ul>
              {/* Mobile: posição no trilho ("01 / 04") e a barra, como no desenho. */}
              {produtos.length > 1 && (
                <div className={style.progress} aria-hidden="true">
                  <span className={style.progressNum}>
                    {String(
                      Math.min(trilho.atual, produtos.length - 1) + 1
                    ).padStart(2, '0')}{' '}
                    / {String(produtos.length).padStart(2, '0')}
                  </span>
                  <span className={style.progressTrack}>
                    <span
                      style={{
                        width: `${100 / produtos.length}%`,
                        left: `${(Math.min(trilho.atual, produtos.length - 1) * 100) / produtos.length}%`,
                      }}
                    />
                  </span>
                </div>
              )}
            </>
          ) : (
            // Desktop: banner e cards na mesma grade (a lista é `display: contents`). Mobile: o
            // banner em cima e a lista vira o trilho que rola de lado.
            <div className={style.grid}>
              {bannerEl}
              <ul className={style.cards} data-role="sh-list">
                {cards}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

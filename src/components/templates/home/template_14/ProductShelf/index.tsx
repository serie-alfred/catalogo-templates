'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  ESGOTADO_14,
  FONTES_14,
  ProductCard14,
  produto14,
  type Produto14,
} from '@/components/templates/common/template_14/Spot';

/**
 * Espelha `molecules/ProductShelf14` do faststore.starter — o núcleo das duas vitrines 14
 * (`Showcase14` = ProductShelfCustom14, variante `full`; `ShelfBanner14` =
 * ProductShelfBanner14, variante `banner`). Mesmo markup, mesmas classes e `data-role`; os
 * cards são o ProductCard14 (common/template_14/Spot).
 *
 * A folha mora em cada réplica (Showcase, ShelfBanner) — uma por item do catálogo — e chega
 * aqui por prop; as duas saem do mesmo SCSS. Produtos = o mock.ts do núcleo de lá (sem foto:
 * vale o placeholder). Sempre o ProductCard14: nenhum manifest 14 tem `usesSpot`.
 *
 * Divergências deliberadas: sem consulta de coleção nem analytics (`view_item_list`); as notas
 * dos cards são as do desenho (lá o card as consulta no resolver `getProductRating`).
 */

type Estilos = Record<string, string>;

export type Banner14 = {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  url?: string;
  eyebrow?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
};

export type ProductShelf14Props = {
  styles: Estilos;
  variant: 'full' | 'banner';
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
  banner?: Banner14;
};

const nota = (totalCount: number) => ({ average: 5, totalCount });
const tenis = produto14('tenis-velox-run-3', 'Tênis Velox Run 3', 699.9, 899.9, 10, 69.99, 671.9, true, nota(212));
const whey = produto14('whey-isolado-900g', 'Whey Isolado 900 g', 259.9, 299.9, 10, 25.99, 249.5, true, nota(340));
const legging = produto14('legging-compressao-core', 'Legging Compressão Core', 219.9, 259.9, 10, 21.99);
const camiseta = produto14('camiseta-dry-pace', 'Camiseta Dry Pace', 129.9, 129.9, 10, 12.99, 0, true, nota(87));
const garrafa = produto14('garrafa-termica-750ml', 'Garrafa Térmica 750 ml', 89.9, 89.9, 3, 29.97, 86.3);
const mochila = produto14('mochila-treino-22l', 'Mochila Treino 22 L', 329.9, 329.9, 10, 32.99);

/** Vitrine (desenho `Showcase14`): os 4 do desenho + 2, para o trilho ter o que rolar. */
const PRODUTOS_FULL: Produto14[] = [tenis, whey, legging, camiseta, garrafa, ESGOTADO_14];
/** Vitrine com banner (desenho `ShelfBanner14`): os 3 do desenho ao lado do banner + 2. */
const PRODUTOS_BANNER: Produto14[] = [whey, garrafa, mochila, tenis, legging];

const Seta = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ProductShelf14({
  styles: style,
  variant,
  title,
  viewAllLabel,
  viewAllUrl,
  tagLabel,
  banner,
}: ProductShelf14Props) {
  const produtos = variant === 'banner' ? PRODUTOS_BANNER : PRODUTOS_FULL;
  const temBanner =
    variant === 'banner' && !!banner && !!(banner.imageDesktop || banner.imageMobile || banner.title || banner.ctaLabel);
  const listName = title || '';

  // O trilho que rola: no desktop da vitrine com banner é a faixa (banner + cards); nos demais
  // casos, a lista de cards. Lê-se o que de fato transborda.
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLUListElement>(null);
  const rolavel = useCallback(() => {
    const t = trackRef.current;
    if (t && t.scrollWidth > t.clientWidth + 1) return t;
    return railRef.current;
  }, []);
  const [trilho, setTrilho] = useState({ inicio: true, fim: true, largura: 100, esquerda: 0 });
  const medir = useCallback(() => {
    const el = rolavel();
    if (!el || !el.scrollWidth) return;
    setTrilho({
      inicio: el.scrollLeft <= 1,
      fim: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      largura: Math.min(100, (el.clientWidth / el.scrollWidth) * 100),
      esquerda: (el.scrollLeft / el.scrollWidth) * 100,
    });
  }, [rolavel]);
  useEffect(() => {
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [medir, produtos.length]);
  const passo = (dir: 1 | -1) => {
    const el = rolavel();
    if (el)
      el.scrollBy({
        left: dir * el.clientWidth,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
  };

  if (!produtos.length) return null;

  const cards = produtos.map((p, i) => (
    <li key={p.id || i} className={style.slide}>
      <ProductCard14 product={p} badge={tagLabel} />
    </li>
  ));

  const setas = (
    <div className={style.arrows}>
      <button type="button" className={style.prev} onClick={() => passo(-1)} disabled={trilho.inicio} aria-label="Produtos anteriores">
        <Chevron dir="prev" />
      </button>
      <button type="button" className={style.next} onClick={() => passo(1)} disabled={trilho.fim} aria-label="Próximos produtos">
        <Chevron dir="next" />
      </button>
    </div>
  );

  const viewAll = variant === 'full' && viewAllLabel && (
    <a className={style.viewAll} href={viewAllUrl || '#'} data-role="sh-view-all">
      {viewAllLabel}
      <Seta className={style.viewAllIcon} />
    </a>
  );

  const bannerEl = temBanner && (
    <a className={style.banner} href={banner?.url || '#'} data-role="sh-banner">
      <span className={style.bannerArt}>
        {(banner?.imageDesktop || banner?.imageMobile) && (
          <picture>
            {banner?.imageMobile && <source media="(max-width: 960px)" srcSet={banner.imageMobile} />}
            <img src={banner?.imageDesktop || banner?.imageMobile} alt={banner?.imageAlt ?? ''} width={680} height={520} />
          </picture>
        )}
      </span>
      <span className={style.bannerBody}>
        {banner?.eyebrow && <span className={style.bannerEyebrow}>{banner.eyebrow}</span>}
        {banner?.title && <span className={style.bannerTitle}>{banner.title}</span>}
        {banner?.text && <span className={style.bannerText}>{banner.text}</span>}
        {banner?.ctaLabel && (
          <span className={style.bannerCta} data-role="sh-banner-cta">
            {banner.ctaLabel}
            <Seta className={style.bannerCtaIcon} />
          </span>
        )}
      </span>
    </a>
  );

  const progresso = variant === 'full' && produtos.length > 1 && (
    <div className={style.progress} aria-hidden="true">
      <span style={{ width: `${trilho.largura}%`, left: `${trilho.esquerda}%` }} />
    </div>
  );

  return (
    <div className={style.productShelf14Box}>
      <section
        className={`${style.productShelf14} ${variant === 'banner' ? style.variantBanner : (style.variantFull ?? '')}`.trim()}
        aria-label={listName || undefined}
        data-role="sh-root"
      >
        <link rel="stylesheet" href={FONTES_14} />
        <div className={style.inner}>
          <div className={style.head} data-role="sh-head">
            {title && (
              <h2 className={style.title} data-role="sh-title">
                {title}
              </h2>
            )}
            <div className={style.tools}>
              {viewAll}
              {setas}
            </div>
          </div>
          {variant === 'full' ? (
            <ul ref={railRef} className={style.rail} onScroll={medir} data-role="sh-list">
              {cards}
            </ul>
          ) : (
            // Desktop: banner e cards na mesma faixa que rola (a lista é `display: contents`).
            // Mobile: o banner em cima e a lista vira o trilho.
            <div ref={trackRef} className={style.track} onScroll={medir}>
              {bannerEl}
              <ul ref={railRef} className={style.cards} onScroll={medir} data-role="sh-list">
                {cards}
              </ul>
            </div>
          )}
          {progresso}
        </div>
      </section>
    </div>
  );
}

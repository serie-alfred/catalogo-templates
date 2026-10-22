'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  ProductCard12,
  FONTES_12,
  PRODUTOS_12,
  produto12,
  type Produto12,
} from '@/components/templates/common/template_12/Spot';

/**
 * Espelha `molecules/ProductShelf12` do faststore.starter — o núcleo das duas
 * vitrines 12 (`Showcase12` = ProductShelfCustom12, variante `full`;
 * `ShelfBanner12` = ProductShelfBanner12, variante `banner`). Mesmo markup,
 * mesmas classes e `data-role`; os cards são o ProductCard12 (common/template_12/Spot).
 *
 * A folha mora em cada réplica (Showcase, ShelfBanner) — uma por item do
 * catálogo — e chega aqui por prop; as duas saem do mesmo SCSS.
 * Produtos e notas = o mock.ts do núcleo de lá (sem foto: vale o placeholder). Sempre o
 * ProductCard12: nenhum manifest 12 do starter tem `usesSpot`, então a réplica também
 * não troca o card pelo spot escolhido.
 *
 * Divergências deliberadas: sem consulta de coleção nem analytics (`view_item_list`);
 * a nota de cada produto vai em `product.rating` (lá, prop `rating` do card).
 */

type Estilos = Record<string, string>;

export type Banner12 = {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  url?: string;
  eyebrow?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
};

export type ProductShelf12Props = {
  styles: Estilos;
  variant: 'full' | 'banner';
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
  banner?: Banner12;
};

const [protetor, serum] = PRODUTOS_12;
const hidratante = produto12('hidratante-facial-gel-creme-50g', 'Hidratante Facial Gel-Creme 50 g', 89.9, 89.9, 3, 29.97, { average: 4.8, totalCount: 860 });
const kit = produto12('kit-rotina-noturna-3-itens', 'Kit Rotina Noturna (3 itens)', 249.9, 289.7, 3, 83.3, null);
const oleo = produto12('oleo-corporal-amendoas-200ml', 'Óleo Corporal Amêndoas 200 ml', 64.9, 64.9, 2, 32.45, { average: 4.9, totalCount: 512 });
const mascara = produto12('mascara-capilar-reconstrucao-250g', 'Máscara Capilar Reconstrução 250 g', 72.9, 72.9, 2, 36.45, { average: 4.6, totalCount: 338 });

/** Vitrine (desenho `Showcase12`). */
const PRODUTOS_FULL: Produto12[] = [serum, hidratante, protetor, kit];
/** Vitrine com banner (desenho `ShelfBanner12`): três cards ao lado do banner. */
const PRODUTOS_BANNER: Produto12[] = [hidratante, oleo, mascara];

/** Nas quatro colunas da vitrine com banner, três são cards e uma é o banner (desenho). */
const AO_LADO_DO_BANNER = 3;

const Seta = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ProductShelf12({
  styles: style,
  variant,
  title,
  subtitle,
  viewAllLabel,
  viewAllUrl,
  tagLabel,
  banner,
}: ProductShelf12Props) {
  const todos = variant === 'banner' ? PRODUTOS_BANNER : PRODUTOS_FULL;
  const temBanner =
    variant === 'banner' &&
    !!banner &&
    !!(banner.imageDesktop || banner.imageMobile || banner.title || banner.ctaLabel);
  const produtos =
    variant === 'banner' ? todos.slice(0, temBanner ? AO_LADO_DO_BANNER : 4) : todos;
  const listName = title || '';

  const railRef = useRef<HTMLUListElement>(null);
  const [trilho, setTrilho] = useState({ inicio: true, fim: true, largura: 100, esquerda: 0 });
  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el || !el.scrollWidth) return;
    setTrilho({
      inicio: el.scrollLeft <= 1,
      fim: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      largura: Math.min(100, (el.clientWidth / el.scrollWidth) * 100),
      esquerda: (el.scrollLeft / el.scrollWidth) * 100,
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
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
  };

  if (!produtos.length) return null;

  const cards = produtos.map((p, i) => (
    <li key={p.id || i} className={style.slide}>
      <ProductCard12 product={p} badge={tagLabel} />
    </li>
  ));

  const bannerEl = temBanner && (
    <a className={style.banner} href={banner?.url || '#'} data-role="sh-banner">
      {banner?.eyebrow && <span className={style.bannerEyebrow}>{banner.eyebrow}</span>}
      {banner?.title && <h3 className={style.bannerTitle}>{banner.title}</h3>}
      {banner?.text && <p className={style.bannerText}>{banner.text}</p>}
      <span className={style.bannerArt}>
        {(banner?.imageDesktop || banner?.imageMobile) && (
          <picture>
            {banner?.imageMobile && <source media="(max-width: 960px)" srcSet={banner.imageMobile} />}
            <img
              src={banner?.imageDesktop || banner?.imageMobile}
              alt={banner?.imageAlt ?? ''}
              width={560}
              height={520}
              loading="lazy"
              decoding="async"
            />
          </picture>
        )}
      </span>
      {banner?.ctaLabel && (
        <span className={style.bannerCta} data-role="sh-banner-cta">
          {banner.ctaLabel}
        </span>
      )}
    </a>
  );

  const barra = (
    <div className={style.progress} aria-hidden="true">
      <span style={{ width: `${trilho.largura}%`, left: `${trilho.esquerda}%` }} />
    </div>
  );

  return (
    <div className={style.productShelf12Box}>
      <section
        className={[style.productShelf12, variant === 'banner' ? style.variantBanner : '']
          .filter(Boolean)
          .join(' ')}
        aria-label={listName || undefined}
        data-role="sh-root"
      >
        <link rel="stylesheet" href={FONTES_12} />
        <div className={style.inner}>
          <div className={style.head} data-role="sh-head">
            {title && (
              <h2 className={style.title} data-role="sh-title">
                {title}
              </h2>
            )}
            {variant === 'full' && subtitle && (
              <p className={style.subtitle} data-role="sh-subtitle">
                {subtitle}
              </p>
            )}
            {viewAllLabel && (
              <a className={style.viewAll} href={viewAllUrl || '#'} data-role="sh-view-all">
                {viewAllLabel}
                <Seta size={16} />
              </a>
            )}
          </div>
          {variant === 'full' ? (
            <div className={style.stage}>
              <button type="button" className={`${style.arrow} ${style.arrowPrev}`} onClick={() => passo(-1)} disabled={trilho.inicio} aria-label="Produtos anteriores">
                <Chevron dir="prev" />
              </button>
              <button type="button" className={`${style.arrow} ${style.arrowNext}`} onClick={() => passo(1)} disabled={trilho.fim} aria-label="Próximos produtos">
                <Chevron dir="next" />
              </button>
              <ul ref={railRef} className={style.rail} onScroll={medir} data-role="sh-list">
                {cards}
              </ul>
              {/* Mobile: a barra de posição no trilho, como no desenho. */}
              {produtos.length > 1 && barra}
            </div>
          ) : (
            // Desktop: cards e banner na mesma grade (a lista é `display: contents`). Mobile: o
            // banner em cima e a lista vira o trilho que rola de lado.
            <div className={style.grid}>
              <ul ref={railRef} className={style.cards} onScroll={medir} data-role="sh-list">
                {cards}
              </ul>
              {bannerEl}
            </div>
          )}
          {/* Barra de posição no trilho do mobile (vitrine com banner), como no desenho. */}
          {variant === 'banner' && produtos.length > 1 && barra}
        </div>
      </section>
    </div>
  );
}

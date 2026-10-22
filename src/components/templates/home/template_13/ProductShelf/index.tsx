'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ProductCard13, FONTES_13, produto13, type Produto13 } from '@/components/templates/common/template_13/Spot';

/**
 * Espelha `molecules/ProductShelf13` do faststore.starter — o núcleo das duas
 * vitrines 13 (`Showcase13` = ProductShelfCustom13, variante `full`;
 * `ShelfBanner13` = ProductShelfBanner13, variante `banner`). Mesmo markup,
 * mesmas classes e `data-role`; os cards são o ProductCard13 (common/template_13/Spot).
 *
 * A folha mora em cada réplica (Showcase, ShelfBanner) — uma por item do
 * catálogo — e chega aqui por prop; as duas saem do mesmo SCSS.
 * Produtos = o mock.ts do núcleo de lá (sem foto: vale o placeholder). Sempre o
 * ProductCard13: nenhum manifest 13 do starter tem `usesSpot`, então a réplica também
 * não troca o card pelo spot escolhido.
 *
 * Divergências deliberadas: sem consulta de coleção nem analytics (`view_item_list`).
 */

type Estilos = Record<string, string>;

export type Banner13 = {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  url?: string;
  eyebrow?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
};

export type ProductShelf13Props = {
  styles: Estilos;
  variant: 'full' | 'banner';
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
  banner?: Banner13;
};

const tenis = produto13('tenis-runner-v2-preto-lima', 'Tênis Runner V2 Preto/Lima', 699.9, 6, 116.65);
const moletom = produto13('moletom-oversized-logo', 'Moletom Oversized Logo', 349.9, 6, 58.32);
const camiseta = produto13('camiseta-boxy-heavy-260g', 'Camiseta Boxy Heavy 260 g', 179.9, 6, 29.98);
const calca = produto13('calca-cargo-ripstop', 'Calça Cargo Ripstop', 399.9, 6, 66.65);
const jaqueta = produto13('jaqueta-corta-vento-refletiva', 'Jaqueta Corta-Vento Refletiva', 599.9, 6, 99.98);
const bone = produto13('bone-five-panel-nylon', 'Boné Five Panel Nylon', 149.9, 3, 49.97);
const meia = produto13('meia-cano-alto-pack-3', 'Meia Cano Alto Pack 3', 79.9, 2, 39.95);

/** Vitrine (desenho `Showcase13`): os 4 do desenho + 2, para o trilho ter o que rolar. */
const PRODUTOS_FULL: Produto13[] = [tenis, moletom, camiseta, calca, bone, meia];
/** Vitrine com banner (desenho `ShelfBanner13`): os 4 do desenho ao lado do banner + 2. */
const PRODUTOS_BANNER: Produto13[] = [jaqueta, calca, bone, tenis, moletom, camiseta];

const Seta = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Chevron = ({ dir, forte }: { dir: 'prev' | 'next'; forte?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={forte ? 2 : 1.8} aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ProductShelf13({
  styles: style,
  variant,
  title,
  viewAllLabel,
  viewAllUrl,
  tagLabel,
  banner,
}: ProductShelf13Props) {
  const produtos = variant === 'banner' ? PRODUTOS_BANNER : PRODUTOS_FULL;
  const temBanner =
    variant === 'banner' &&
    !!banner &&
    !!(banner.imageDesktop || banner.imageMobile || banner.title || banner.ctaLabel);
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
      <ProductCard13 product={p} badge={tagLabel} />
    </li>
  ));

  const setas = (
    <div className={style.arrows}>
      <button type="button" className={style.arrow} onClick={() => passo(-1)} disabled={trilho.inicio} aria-label="Produtos anteriores">
        <Chevron dir="prev" />
      </button>
      <button
        type="button"
        className={`${style.arrow}${variant === 'banner' ? ` ${style.arrowFill}` : ''}`}
        onClick={() => passo(1)}
        disabled={trilho.fim}
        aria-label="Próximos produtos"
      >
        <Chevron dir="next" forte={variant === 'banner'} />
      </button>
    </div>
  );

  const viewAll = viewAllLabel && (
    <a className={style.viewAll} href={viewAllUrl || '#'} data-role="sh-view-all">
      <span>{viewAllLabel}</span>
    </a>
  );

  const bannerEl = temBanner && (
    <a className={style.banner} href={banner?.url || '#'} data-role="sh-banner">
      {(banner?.imageDesktop || banner?.imageMobile) && (
        <picture className={style.bannerArt}>
          {banner?.imageMobile && <source media="(max-width: 960px)" srcSet={banner.imageMobile} />}
          <img
            src={banner?.imageDesktop || banner?.imageMobile}
            alt={banner?.imageAlt ?? ''}
            width={1000}
            height={840}
            loading="lazy"
            decoding="async"
          />
        </picture>
      )}
      {banner?.eyebrow && <span className={style.bannerEyebrow}>{banner.eyebrow}</span>}
      {banner?.title && <h3 className={style.bannerTitle}>{banner.title}</h3>}
      {banner?.text && <p className={style.bannerText}>{banner.text}</p>}
      {banner?.ctaLabel && (
        <span className={style.bannerCta} data-role="sh-banner-cta">
          {banner.ctaLabel}
          <Seta className={style.ctaArrow} />
        </span>
      )}
    </a>
  );

  const progresso = produtos.length > 1 && (
    <div className={style.progress} aria-hidden="true">
      <span style={{ width: `${trilho.largura}%`, left: `${trilho.esquerda}%` }} />
    </div>
  );

  return (
    <div className={style.productShelf13Box}>
      <section
        className={`${style.productShelf13} ${variant === 'banner' ? style.variantBanner : style.variantFull}`}
        aria-label={listName || undefined}
        data-role="sh-root"
      >
        <link rel="stylesheet" href={FONTES_13} />
        {variant === 'full' ? (
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
            <ul ref={railRef} className={style.rail} onScroll={medir} data-role="sh-list">
              {cards}
            </ul>
            {progresso}
          </div>
        ) : (
          <>
            <div className={style.head} data-role="sh-head">
              {title && (
                <h2 className={style.title} data-role="sh-title">
                  {title}
                </h2>
              )}
              {setas}
            </div>
            {/* Desktop: banner e cards na mesma faixa que rola (a lista é `display: contents`).
                Mobile: o banner em cima e a lista vira o trilho. */}
            <div ref={trackRef} className={style.track} onScroll={medir}>
              {bannerEl}
              <ul ref={railRef} className={style.cards} onScroll={medir} data-role="sh-list">
                {cards}
              </ul>
            </div>
            {progresso}
          </>
        )}
      </section>
    </div>
  );
}

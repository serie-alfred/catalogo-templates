'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { ProductCard15, FONTES_15, produto15, type Produto15 } from '@/components/templates/common/template_15/Spot';

/**
 * Espelha `molecules/ProductShelf15` do faststore.starter — o núcleo das duas
 * vitrines 15 (`Showcase15` = ProductShelfCustom15, variante `full`;
 * `ShelfBanner15` = ProductShelfBanner15, variante `banner`). Mesmo markup,
 * mesmas classes e `data-role`; os cards são o ProductCard15 (common/template_15/Spot),
 * três por vez no desktop (desvio aprovado da família 15).
 *
 * A folha mora em cada réplica (Showcase, ShelfBanner) — uma por item do
 * catálogo — e chega aqui por prop; as duas saem do mesmo SCSS.
 * Produtos = o mock.ts do núcleo de lá (sem foto: vale o placeholder). Sempre o
 * ProductCard15: nenhum manifest 15 do starter tem `usesSpot`.
 *
 * Divergências deliberadas: sem consulta de coleção nem analytics (`view_item_list`); o
 * envelope `.productShelf15Box` é o container das `@container` do CSS derivado.
 */

type Estilos = Record<string, string>;

export type Banner15 = {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  url?: string;
  eyebrow?: string;
  title?: string;
  /** Trecho do título em itálico, logo depois de `title`. */
  titleEmphasis?: string;
  text?: string;
  ctaLabel?: string;
};

export type ProductShelf15Props = {
  styles: Estilos;
  variant: 'full' | 'banner';
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
  banner?: Banner15;
};

// O mock.ts do núcleo de lá: marca, nome, preço e parcela (10x sem juros) do desenho.
const v = (id: string, brand: string, name: string, price: number, installmentValue: number) =>
  produto15(id, name, price, price, 10, installmentValue, true, brand);
const anel = v('anel-solitario-ouro-18k', 'Sua Marca Joias', 'Anel Solitário Ouro 18k', 6890, 689);
const relogio = v('relogio-automatico-cassis-38mm', 'Sua Marca Relógios', 'Relógio Automático Cassis 38 mm', 18900, 1890);
const perfume = v('eau-de-parfum-ambre-nuit-100ml', 'Sua Marca Parfums', 'Eau de Parfum Ambre Nuit 100 ml', 789, 78.9);
const serum = v('serum-facial-eclat-30ml', 'Sua Marca Beauté', 'Sérum Facial Éclat 30 ml', 389, 38.9);
const brincos = v('brincos-perola-barroca', 'Sua Marca Joias', 'Brincos Pérola Barroca', 1290, 129);

/** Vitrine (`Showcase15`): os três do desenho e mais dois, para o carrossel ter o que rolar. */
const PRODUTOS_FULL: Produto15[] = [anel, relogio, perfume, brincos, serum];
/** Vitrine com banner (`ShelfBanner15`): os três do desenho e mais dois. */
const PRODUTOS_BANNER: Produto15[] = [perfume, serum, brincos, anel, relogio];

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ProductShelf15({
  styles: style,
  variant,
  eyebrow,
  title,
  titleEmphasis,
  viewAllLabel,
  viewAllUrl,
  tagLabel,
  banner,
}: ProductShelf15Props) {
  const produtos = variant === 'banner' ? PRODUTOS_BANNER : PRODUTOS_FULL;
  const temBanner =
    variant === 'banner' &&
    !!banner &&
    !!(banner.imageDesktop || banner.imageMobile || banner.title || banner.ctaLabel);
  const listName = [title, titleEmphasis].filter(Boolean).join(' ');

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

  const setas = (
    <div className={style.arrows}>
      <button type="button" className={style.arrow} onClick={() => passo(-1)} disabled={trilho.inicio} aria-label="Produtos anteriores">
        <Chevron dir="prev" />
      </button>
      <button type="button" className={style.arrow} onClick={() => passo(1)} disabled={trilho.fim} aria-label="Próximos produtos">
        <Chevron dir="next" />
      </button>
    </div>
  );

  const viewAll = (cls: string) =>
    viewAllLabel && (
      <a className={cls} href={viewAllUrl || '#'} data-role="sh-view-all">
        {viewAllLabel}
      </a>
    );

  const cabeca = (
    <div className={style.heading}>
      {eyebrow && (
        <span className={style.eyebrow} data-role="sh-eyebrow">
          {eyebrow}
        </span>
      )}
      {listName && (
        <h2 className={style.title} data-role="sh-title">
          {title} {titleEmphasis && <em>{titleEmphasis}</em>}
        </h2>
      )}
    </div>
  );

  const lista = (
    <ul ref={railRef} className={style.rail} onScroll={medir} data-role="sh-list">
      {produtos.map((p, i) => (
        <li key={p.id || i} className={style.slide}>
          <ProductCard15 product={p} badge={tagLabel} />
        </li>
      ))}
    </ul>
  );

  const progresso = produtos.length > 1 && (
    <div className={style.progressWrap} aria-hidden="true">
      <span className={style.progress}>
        <span style={{ width: `${trilho.largura}%`, left: `${trilho.esquerda}%` }} />
      </span>
    </div>
  );

  const bannerEl = temBanner && (
    <a className={style.banner} href={banner?.url || '#'} data-role="sh-banner">
      {(banner?.imageDesktop || banner?.imageMobile) && (
        <picture className={style.bannerArt}>
          {banner?.imageMobile && <source media="(max-width: 960px)" srcSet={banner.imageMobile} />}
          <img src={banner?.imageDesktop || banner?.imageMobile} alt={banner?.imageAlt ?? ''} width={760} height={920} loading="lazy" decoding="async" />
        </picture>
      )}
      {banner?.eyebrow && <span className={style.bannerEyebrow}>{banner.eyebrow}</span>}
      {(banner?.title || banner?.titleEmphasis) && (
        <span className={style.bannerTitle}>
          {banner?.title} {banner?.titleEmphasis && <em>{banner.titleEmphasis}</em>}
        </span>
      )}
      {banner?.text && <span className={style.bannerText}>{banner.text}</span>}
      {banner?.ctaLabel && (
        <span className={style.bannerCta} data-role="sh-banner-cta">
          {banner.ctaLabel}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M4 12h16M14 6l6 6-6 6" />
          </svg>
        </span>
      )}
    </a>
  );

  return (
    <div className={style.productShelf15Box}>
      <section
        className={`${style.productShelf15} ${variant === 'banner' ? style.variantBanner : style.variantFull}`}
        aria-label={listName || undefined}
        data-role="sh-root"
      >
        <link rel="stylesheet" href={FONTES_15} />
        <div className={style.inner}>
          <div className={style.head} data-role="sh-head">
            {cabeca}
            <div className={style.tools}>
              {variant === 'full' && viewAll(style.viewAll)}
              {setas}
            </div>
          </div>
          {variant === 'full' ? (
            lista
          ) : (
            <div className={style.row}>
              {bannerEl}
              {lista}
            </div>
          )}
          {progresso}
          {variant === 'full' && viewAll(style.viewAllMob)}
        </div>
      </section>
    </div>
  );
}

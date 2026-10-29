'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  ProductCard16,
  FONTES_16,
  produto16,
  type Produto16,
} from '@/components/templates/common/template_16/Spot';

/**
 * Espelha `molecules/ProductShelf16` do faststore.starter — o núcleo das duas vitrines 16
 * (`Showcase16` = ProductShelfCustom16, variante `full`; `ShelfBanner16` =
 * ProductShelfBanner16, variante `banner`). Mesmo markup, mesmas classes e `data-role`; os
 * cards são o ProductCard16 (common/template_16/Spot).
 *
 * A folha mora em cada réplica (Showcase, ShelfBanner) — uma por item do catálogo — e chega
 * aqui por prop; as duas saem do mesmo SCSS. Produtos = o mock.ts do núcleo de lá (sem foto,
 * sem Pix e sem nota: o desenho da vitrine também não tem). Sempre o ProductCard16: nenhum
 * manifest 16 do starter tem `usesSpot`.
 *
 * Divergências deliberadas: sem consulta de coleção nem analytics (`view_item_list`).
 */

type Estilos = Record<string, string>;

export type Banner16 = {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  url?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
};

export type ProductShelf16Props = {
  styles: Estilos;
  variant: 'full' | 'banner';
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
  banner?: Banner16;
};

const v = (
  id: string,
  name: string,
  price: number,
  listPrice: number,
  n: number,
  valor: number
) => produto16(id, name, price, listPrice, n, valor);
const blocos = v(
  'kit-blocos-de-montar-120-pecas',
  'Kit Blocos de Montar 120 peças',
  189.9,
  229.9,
  6,
  31.65
);
const dino = v(
  'pelucia-dino-verde-30-cm',
  'Pelúcia Dino Verde 30 cm',
  119.9,
  119.9,
  6,
  19.98
);
const pijama = v(
  'pijama-algodao-estrelinhas',
  'Pijama Algodão Estrelinhas',
  89.9,
  89.9,
  6,
  14.98
);
const mochila = v(
  'mochila-escolar-foguete',
  'Mochila Escolar Foguete',
  249.9,
  249.9,
  6,
  41.65
);
const quebra = v(
  'quebra-cabeca-fazendinha-48-pecas',
  'Quebra-Cabeça Fazendinha 48 peças',
  69.9,
  69.9,
  2,
  34.95
);
const massinha = v(
  'kit-massinha-cores-vivas',
  'Kit Massinha Cores Vivas',
  59.9,
  59.9,
  2,
  29.95
);
const bichos = v(
  'livro-cartonado-bichos-do-mar',
  'Livro Cartonado Bichos do Mar',
  39.9,
  39.9,
  2,
  19.95
);
const patinhos = v(
  'livro-de-banho-patinhos',
  'Livro de Banho Patinhos',
  49.9,
  49.9,
  2,
  24.95
);
const contos = v(
  'colecao-contos-de-ninar-4-volumes',
  'Coleção Contos de Ninar 4 volumes',
  129.9,
  129.9,
  6,
  21.65
);
const abc = v('livro-de-pano-abc', 'Livro de Pano ABC', 59.9, 59.9, 2, 29.95);

/** Vitrine (desenho `Showcase16`): os 4 do desenho + 2, para o trilho ter o que rolar. */
const PRODUTOS_FULL: Produto16[] = [
  blocos,
  dino,
  pijama,
  mochila,
  quebra,
  massinha,
];
/** Vitrine com banner (desenho `ShelfBanner16`): os 3 do desenho ao lado do banner + 2. */
const PRODUTOS_BANNER: Produto16[] = [bichos, patinhos, contos, abc, quebra];

const Seta = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ProductShelf16({
  styles: style,
  variant,
  title,
  subtitle,
  viewAllLabel,
  viewAllUrl,
  tagLabel,
  banner,
}: ProductShelf16Props) {
  const produtos = variant === 'banner' ? PRODUTOS_BANNER : PRODUTOS_FULL;
  const temBanner =
    variant === 'banner' &&
    !!banner &&
    !!(
      banner.imageDesktop ||
      banner.imageMobile ||
      banner.title ||
      banner.ctaLabel
    );

  const railRef = useRef<HTMLUListElement>(null);
  const [trilho, setTrilho] = useState({
    inicio: true,
    fim: true,
    paginas: 1,
    atual: 0,
  });
  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el || !el.clientWidth) return;
    const fim = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
    const paginas = Math.max(
      1,
      Math.ceil((el.scrollWidth - 1) / el.clientWidth)
    );
    setTrilho({
      inicio: el.scrollLeft <= 1,
      fim,
      paginas,
      atual: fim
        ? paginas - 1
        : Math.min(paginas - 1, Math.round(el.scrollLeft / el.clientWidth)),
    });
  }, []);
  useEffect(() => {
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [medir, produtos.length]);
  const passo = (dir: 1 | -1) => {
    const el = railRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  const setas = (
    <div className={style.arrows}>
      <button
        type="button"
        className={style.arrow}
        onClick={() => passo(-1)}
        disabled={trilho.inicio}
        aria-label="Produtos anteriores"
      >
        <Chevron dir="prev" />
      </button>
      <button
        type="button"
        className={`${style.arrow} ${style.arrowNext}`}
        onClick={() => passo(1)}
        disabled={trilho.fim}
        aria-label="Próximos produtos"
      >
        <Chevron dir="next" />
      </button>
    </div>
  );

  const bannerEl = temBanner && (
    <a className={style.banner} href={banner?.url || '#'} data-role="sh-banner">
      <span className={style.bannerArt} data-role="sh-banner-image">
        {(banner?.imageDesktop || banner?.imageMobile) && (
          <picture>
            {banner?.imageMobile && (
              <source media="(max-width: 960px)" srcSet={banner.imageMobile} />
            )}
            <img
              src={banner?.imageDesktop || banner?.imageMobile}
              alt={banner?.imageAlt ?? ''}
              width={560}
              height={400}
            />
          </picture>
        )}
      </span>
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

  return (
    <div className={style.productShelf16Box}>
      <section
        className={`${style.productShelf16} ${variant === 'banner' ? style.variantBanner : ''}`}
        aria-label={title || undefined}
        data-role="sh-root"
      >
        <link rel="stylesheet" href={FONTES_16} />
        <div className={style.inner}>
          <div className={style.head} data-role="sh-head">
            {(title || (variant === 'full' && subtitle)) && (
              <div className={style.headCopy}>
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
              </div>
            )}
            <div className={style.tools}>
              {variant === 'full' && viewAllLabel && (
                <a
                  className={style.viewAll}
                  href={viewAllUrl || '#'}
                  data-role="sh-view-all"
                >
                  {viewAllLabel}
                </a>
              )}
              {setas}
            </div>
          </div>
          <div className={style.body}>
            {bannerEl}
            <ul
              ref={railRef}
              className={style.rail}
              onScroll={medir}
              data-role="sh-list"
            >
              {produtos.map((p, i) => (
                <li key={p.id || i} className={style.slide}>
                  <ProductCard16 product={p} badge={tagLabel} />
                </li>
              ))}
            </ul>
          </div>
          {variant === 'full' && trilho.paginas > 1 && (
            <div className={style.dots} aria-hidden="true">
              {Array.from({ length: trilho.paginas }).map((_, i) => (
                <span
                  key={i}
                  className={`${style.dot}${i === trilho.atual ? ` ${style.dotOn}` : ''}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  ProductCard17,
  FONTES_17,
  produto17,
  type Produto17,
} from '@/components/templates/common/template_17/Spot';

/**
 * Espelha `molecules/ProductShelf17` do faststore.starter — o núcleo das duas vitrines 17
 * (`Showcase17` = ProductShelfCustom17, variante `full`; `ShelfBanner17` =
 * ProductShelfBanner17, variante `banner`). Mesmo markup, mesmas classes e `data-role`; os
 * cards são o ProductCard17 (common/template_17/Spot).
 *
 * A folha mora em cada réplica (Showcase, ShelfBanner) — uma por item do catálogo — e chega
 * aqui por prop; as duas saem do mesmo SCSS. Produtos = o mock.ts do núcleo de lá, com as notas
 * que o palco injeta (sem foto: o desenho também não tem). Sempre o ProductCard17: nenhum
 * manifest 17 do starter tem `usesSpot`.
 *
 * Divergências deliberadas: sem consulta de coleção nem analytics (`view_item_list`), e sem a
 * raiz de seção do organism (`div.productShelfCustom17` / `div.productShelfBanner17`, que lá
 * só recebe as variáveis do painel; aqui quem as recebe é o envelope do canvas).
 */

type Estilos = Record<string, string>;

export type Banner17 = {
  /** Chamada acima do título do banner (ex.: "Gatos"). */
  eyebrow?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  url?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
};

export type ProductShelf17Props = {
  styles: Estilos;
  variant: 'full' | 'banner';
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  tagLabel?: string;
  banner?: Banner17;
};

// O mock.ts do núcleo (variantes do card com Pix e as notas do palco).
const v = (
  id: string,
  name: string,
  brand: string,
  price: number,
  listPrice: number,
  n: number,
  valor: number,
  pix: number,
  nota: number,
  total: number
) =>
  produto17(id, name, brand, price, listPrice, n, valor, pix, true, nota, total);
const racaoCaes = v(
  'racao-premium-caes-adultos-15kg',
  'Ração Premium Cães Adultos Frango e Arroz 15 kg',
  'Nobre Pet',
  329.9,
  389.9,
  6,
  54.98,
  316.7,
  4.9,
  214
);
const racaoGatos = v(
  'racao-gatos-castrados-salmao-10kg',
  'Ração Gatos Castrados Salmão 10,1 kg',
  'Felis',
  279.9,
  279.9,
  6,
  46.65,
  268.7,
  4.8,
  186
);
const bifinho = v(
  'petisco-bifinho-natural-500g',
  'Petisco Bifinho Natural 500 g',
  'Vitta Pet',
  39.9,
  39.9,
  2,
  19.95,
  38.3,
  4.7,
  97
);
const arranhador = v(
  'arranhador-torre-sisal-90cm',
  'Arranhador Torre Sisal 90 cm',
  'Casa do Bicho',
  199.9,
  249.9,
  6,
  33.32,
  191.9,
  4.6,
  58
);
const areia = v(
  'areia-sanitaria-graos-finos-4kg',
  'Areia Sanitária Grãos Finos 4 kg',
  'Felis',
  34.9,
  42.9,
  2,
  17.45,
  33.5,
  4.5,
  241
);
const cama = v(
  'cama-redonda-pelucia-m',
  'Cama Redonda Pelúcia Tamanho M',
  'Casa do Bicho',
  149.9,
  179.9,
  5,
  29.98,
  143.9,
  4.7,
  58
);

/** Vitrine (desenho `Showcase17`): os 4 do desenho + 2, para o trilho ter o que rolar. */
const PRODUTOS_FULL: Produto17[] = [
  racaoCaes,
  racaoGatos,
  bifinho,
  arranhador,
  areia,
  cama,
];
/** Vitrine com banner (desenho `ShelfBanner17`): os 3 do desenho ao lado do banner + 2. */
const PRODUTOS_BANNER: Produto17[] = [
  racaoGatos,
  arranhador,
  areia,
  bifinho,
  cama,
];

const Seta = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function ProductShelf17({
  styles: style,
  variant,
  title,
  subtitle,
  viewAllLabel,
  viewAllUrl,
  tagLabel,
  banner,
}: ProductShelf17Props) {
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
  const listName = title || '';

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
    if (el)
      el.scrollBy({
        left: dir * el.clientWidth,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
  };

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
              width={640}
              height={520}
            />
          </picture>
        )}
      </span>
      {banner?.eyebrow && (
        <span className={style.bannerEyebrow}>{banner.eyebrow}</span>
      )}
      {banner?.title && (
        <span className={style.bannerTitle}>{banner.title}</span>
      )}
      {banner?.text && <span className={style.bannerText}>{banner.text}</span>}
      {banner?.ctaLabel && (
        <span className={style.bannerCta} data-role="sh-banner-cta">
          {banner.ctaLabel}
          <Seta />
        </span>
      )}
    </a>
  );

  return (
    <div className={style.productShelf17Box}>
      <section
        className={`${style.productShelf17}${variant === 'banner' ? ` ${style.variantBanner}` : ''}`}
        aria-label={listName || undefined}
        data-role="sh-root"
      >
        <link rel="stylesheet" href={FONTES_17} />
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
                  <ProductCard17 product={p} badge={tagLabel} />
                </li>
              ))}
            </ul>
          </div>
          {trilho.paginas > 1 && (
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

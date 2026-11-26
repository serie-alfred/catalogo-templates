import React from 'react';

import CardDaLoja from '@/components/templates/CardDaLoja';
import Spot01 from '@/components/templates/common/template_1/Spot';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';

/**
 * Espelha `molecules/ProductShelf08` do faststore.starter — o núcleo das duas
 * vitrines 08 (`Showcase08` = ProductShelfCustom08, variante cheia;
 * `ShelfBanner08` = ProductShelfBanner08, com banner). Mesmas classes, `data-role`
 * e vars; CSS derivado do SCSS de lá (`yarn derivar:css`). O starter usa Swiper;
 * aqui a faixa é flex com a mesma largura de card (ver "Só no catálogo" no CSS).
 *
 * A folha mora em cada réplica (Showcase, ShelfBanner) — o funil exige uma por
 * item do catálogo — e chega aqui por prop; as duas saem do mesmo SCSS.
 *
 * O card é o da loja (`CardDaLoja`). A família 08 não tem card próprio: sem Card de
 * Produto escolhido, ou com o Spot01, vale o Spot01 — o starter faz o mesmo com o
 * ProductCard01. A vitrine só dá o slot (o `.slide`).
 */

type Estilos = Record<string, string>;

/** Banner ao lado dos cards (variante `banner`), na forma do schema. */
export type Banner08 = {
  desktop?: string;
  mobile?: string;
  alt?: string;
  url?: string;
};

export type ProductShelf08Props = {
  variant: 'full' | 'banner';
  styles: Estilos;
  title?: string;
  subtitle?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  banner?: Banner08;
};

const FONTES =
  'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;0,800;1,600&display=swap';

const PRODUTOS = [1, 2, 3, 4, 5, 6];

const Chevron = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    aria-hidden="true"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d={
        dir === 'next'
          ? 'M8.33333 13.3333L11.6667 10L8.33333 6.66667'
          : 'M11.6667 13.3333L8.33333 10L11.6667 6.66667'
      }
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ProductShelf08({
  variant,
  styles,
  title,
  subtitle,
  viewAllLabel,
  viewAllUrl,
  banner,
}: ProductShelf08Props) {
  // Produtos = os da loja (todos), quando o CS cadastrou; senão os 6 de exemplo.
  const daLoja = useProdutosDaLoja();
  const itens = daLoja
    ? daLoja.map(produto => ({ key: produto.id, produto }))
    : PRODUTOS.map(i => ({ key: String(i), produto: undefined }));
  return (
    <div className={styles.productShelf08Box}>
      <section
        className={`${styles.productShelf08} ${styles.shelf} ${variant === 'banner' ? styles.shelfBanner : styles.shelfFull}`}
        data-role="sh-root"
      >
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.shelfHead}>
          <div className={styles.shelfHeading}>
            {title && (
              <h2 className={styles.shelfTitle} data-role="sh-title">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={styles.shelfSubtitle} data-role="sh-subtitle">
                {subtitle}
              </p>
            )}
          </div>
          {viewAllLabel && (
            <a
              className={styles.shelfViewAll}
              href={viewAllUrl || '#'}
              data-role="sh-view-all"
            >
              {viewAllLabel}
            </a>
          )}
        </div>
        <div className={styles.shelfRow}>
          <div className={styles.shelfCarousel}>
            <div className={styles.track}>
              {itens.map(({ key, produto }) => (
                <div key={key} className={styles.slide}>
                  <CardDaLoja familia="Spot01" produto={produto}>
                    <Spot01 soCard produto={produto} />
                  </CardDaLoja>
                </div>
              ))}
            </div>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowPrev}`}
              aria-label="Produtos anteriores"
              disabled
            >
              <Chevron dir="prev" />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowNext}`}
              aria-label="Próximos produtos"
            >
              <Chevron dir="next" />
            </button>
          </div>
          {variant === 'banner' && banner && (banner.desktop || banner.mobile) && (
            <a
              className={styles.shelfBannerLink}
              href={banner.url || '#'}
              aria-label={banner.alt || 'Ver ofertas'}
            >
              <picture
                className={styles.shelfBannerMedia}
                data-role="sh-banner"
              >
                <img
                  className={styles.onlyDesktop}
                  src={banner.desktop || banner.mobile}
                  alt={banner.alt ?? ''}
                  width={477}
                  height={485}
                />
                <img
                  className={styles.onlyMobile}
                  src={banner.mobile || banner.desktop}
                  alt={banner.alt ?? ''}
                  width={358}
                  height={358}
                />
              </picture>
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

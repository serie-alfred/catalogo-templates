import React from 'react';

/**
 * Espelha `molecules/ProductShelf08` do faststore.starter — o núcleo das duas
 * vitrines 08 (`Showcase08` = ProductShelfCustom08, variante cheia;
 * `ShelfBanner08` = ProductShelfBanner08, com banner). Mesmas classes, `data-role`
 * e vars; CSS derivado do SCSS de lá (`yarn derivar:css`). O starter usa Swiper;
 * aqui a faixa é flex com a mesma largura de card (ver "Só no catálogo" no CSS).
 *
 * A folha mora em cada réplica (Showcase, ShelfBanner) — o funil exige uma por
 * item do catálogo — e chega aqui por prop; as duas saem do mesmo SCSS.
 */

type Estilos = Record<string, string>;

const IMG = '/gerador/familia08';
const RETRATO = `${IMG}/ph-card.png`;

const FONTES =
  'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;0,800;1,600&display=swap';

const PRODUTOS = [1, 2, 3, 4, 5, 6];

const Heart = () => (
  <svg
    aria-hidden="true"
    width="22.333"
    height="21.583"
    viewBox="0 0 22.3333 21.5834"
    fill="none"
  >
    <path
      d="M9.70981 18.0954C7.12363 16.1615 2 11.7402 2 7.76157C2 5.13183 3.92982 3 6.58333 3C7.95833 3 9.33333 3.45833 11.1667 5.29167C13 3.45833 14.375 3 15.75 3C18.4035 3 20.3333 5.13183 20.3333 7.76157C20.3333 11.7402 15.2097 16.1615 12.6235 18.0954C11.7532 18.7461 10.5801 18.7461 9.70981 18.0954Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

function Card({ styles }: { styles: Estilos }) {
  return (
    <div className={styles.card} data-role="sh-card">
      <a
        className={styles.cardLink}
        href="#"
        aria-label="Camisa Polo Piquet Manga Curta Azul"
      />
      <div className={styles.cardMedia}>
        <img
          className={styles.cardImg}
          src={RETRATO}
          alt="Camisa Polo Piquet Manga Curta Azul"
          width={230}
          height={345}
        />
        <div className={styles.cardTags}>
          <span className={styles.cardTag} data-role="sh-tag">
            Novidade
          </span>
          <span className={styles.cardOff} data-role="sh-off">
            10% OFF
          </span>
        </div>
        <button
          type="button"
          className={styles.cardWish}
          data-role="sh-wish"
          aria-pressed={false}
          aria-label="Adicionar à lista de desejos"
        >
          <Heart />
        </button>
      </div>
      <div className={styles.cardInfo}>
        <h3 className={styles.cardName} data-role="sh-card-name">
          Camisa Polo Piquet Manga Curta Azul
        </h3>
        <div className={styles.cardPrices}>
          <s className={styles.cardList} data-role="sh-list-price">
            R$ 149,90
          </s>
          <span className={styles.cardPrice} data-role="sh-price">
            R$ 59,90
          </span>
        </div>
        <p className={styles.cardPix} data-role="sh-pix">
          <strong>R$ 55,90</strong> no pix
        </p>
        <p className={styles.cardInstallment} data-role="sh-installment">
          8x R$ 5,90 no cartão
        </p>
      </div>
    </div>
  );
}

export default function ProductShelf08({
  variant,
  styles,
}: {
  variant: 'full' | 'banner';
  styles: Estilos;
}) {
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
            <h2 className={styles.shelfTitle} data-role="sh-title">
              LOREM IPSUM
            </h2>
            <p className={styles.shelfSubtitle} data-role="sh-subtitle">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>
          <a className={styles.shelfViewAll} href="#" data-role="sh-view-all">
            Ver todos
          </a>
        </div>
        <div className={styles.shelfRow}>
          <div className={styles.shelfCarousel}>
            <div className={styles.track}>
              {PRODUTOS.map(i => (
                <div key={i} className={styles.slide}>
                  <Card styles={styles} />
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
          {variant === 'banner' && (
            <a
              className={styles.shelfBannerLink}
              href="#"
              aria-label="Ver ofertas"
            >
              <picture
                className={styles.shelfBannerMedia}
                data-role="sh-banner"
              >
                <img
                  className={styles.onlyDesktop}
                  src={RETRATO}
                  alt=""
                  width={477}
                  height={485}
                />
                <img
                  className={styles.onlyMobile}
                  src={`${IMG}/ph-square.png`}
                  alt=""
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

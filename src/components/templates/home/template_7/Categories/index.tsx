'use client';
import React, { useRef, useState, type ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories07` do faststore.starter — grid "Nossa
 * curadoria": 6 cards no desktop, 4 no mobile, com listas de conteúdo
 * diferentes por breakpoint.
 *
 * O mock da origem não manda `image`, então os cards ficam no gradiente de
 * fallback — mesma coisa aqui, para os dois lados baterem.
 */
interface CategoryItem {
  label: string;
  url: string;
}

// A partir daqui o grid de 6 colunas fixas passaria a espremer os cards (o CMS
// não limita quantas categorias são cadastradas) → vira carrossel.
const CAROUSEL_THRESHOLD = 6;

const PrevIcon = () => (
  <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 8L10 12L14 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);
const NextIcon = () => (
  <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 16L14 12L10 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
);

function CategoriesCarousel({ children }: { children: ReactNode[] }) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const sync = (s: SwiperType) => {
    setIsBeginning(s.isBeginning);
    setIsEnd(s.isEnd);
  };
  return (
    <div className={styles.carousel} data-role="cat-grid">
      <Swiper
        className={styles.swiper}
        slidesPerView={CAROUSEL_THRESHOLD}
        spaceBetween={16}
        autoHeight
        onSwiper={s => {
          swiperRef.current = s;
          sync(s);
        }}
        onSlideChange={sync}
        onBreakpoint={sync}
      >
        {children.map((child, i) => (
          <SwiperSlide key={i} className={styles.slide}>
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
      {!isBeginning && (
        <button type="button" className={styles.navPrev} aria-label="Categorias anteriores" onClick={() => swiperRef.current?.slidePrev()}>
          <PrevIcon />
        </button>
      )}
      {!isEnd && (
        <button type="button" className={styles.navNext} aria-label="Próximas categorias" onClick={() => swiperRef.current?.slideNext()}>
          <NextIcon />
        </button>
      )}
    </div>
  );
}

const conteudo = {
  title: 'Nossa curadoria',
  viewAllLabel: 'Ver todos →',
  viewAllUrl: '/categorias',
  categories: [
    { label: 'Tapetes', url: '/tapetes' },
    { label: 'Cama', url: '/cama' },
    { label: 'Mesa & Cozinha', url: '/mesa-cozinha' },
    { label: 'Banho', url: '/banho' },
    { label: 'Decoração', url: '/decoracao' },
    { label: 'Infantil', url: '/infantil' },
  ] as CategoryItem[],
  categoriesMobile: [
    { label: 'Tapetes', url: '/tapetes' },
    { label: 'Cama', url: '/cama' },
    { label: 'Banho', url: '/banho' },
    { label: 'Decoração', url: '/decoracao' },
  ] as CategoryItem[],
};

function Card({
  c,
  imgClass,
  labelClass,
  cardRole,
  imgRole,
  labelRole,
}: {
  c: CategoryItem;
  imgClass: string;
  labelClass: string;
  cardRole: string;
  imgRole: string;
  labelRole: string;
}) {
  return (
    <a className={styles.card} href={c.url} data-role={cardRole}>
      <div className={imgClass} data-role={imgRole}>
        <span className={styles.scrim} aria-hidden="true" />
      </div>
      <p className={labelClass} data-role={labelRole}>
        {c.label}
      </p>
    </a>
  );
}

export default function Categories() {
  return (
    <div className={styles.categories07Root}>
      <div className={styles.desktop}>
        <div className={styles.header} data-role="cat-header">
          <h2 className={styles.title} data-role="cat-title">
            {conteudo.title}
          </h2>
          <a
            className={styles.viewAll}
            href={conteudo.viewAllUrl}
            data-role="cat-viewall"
          >
            {conteudo.viewAllLabel}
          </a>
        </div>
        {conteudo.categories.length >= CAROUSEL_THRESHOLD ? (
          <CategoriesCarousel>
            {conteudo.categories.map((c, i) => (
              <Card
                key={i}
                c={c}
                imgClass={styles.img}
                labelClass={styles.label}
                cardRole="cat-card"
                imgRole="cat-img"
                labelRole="cat-label"
              />
            ))}
          </CategoriesCarousel>
        ) : (
          <div className={styles.grid} data-role="cat-grid">
            {conteudo.categories.map((c, i) => (
              <Card
                key={i}
                c={c}
                imgClass={styles.img}
                labelClass={styles.label}
                cardRole="cat-card"
                imgRole="cat-img"
                labelRole="cat-label"
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.mobile}>
        <div className={styles.mSection} data-role="m-cat">
          <h2 className={styles.mTitle} data-role="m-cat-title">
            {conteudo.title}
          </h2>
          <div className={styles.mGrid} data-role="m-cat-grid">
            {conteudo.categoriesMobile.map((c, i) => (
              <Card
                key={i}
                c={c}
                imgClass={styles.mImg}
                labelClass={styles.mLabel}
                cardRole="m-cat-card"
                imgRole="m-cat-img"
                labelRole="m-cat-label"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

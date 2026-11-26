'use client';

import React, { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import { iconeDoItem } from './icones';
import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do Ruler01. O `icon` é uma das chaves de `ICONES_RULER01` (icones.ts): o painel só escolhe. */
interface Ruler01Conteudo {
  benefits: { icon?: string; title?: string; text?: string }[];
}

const MOCK: Ruler01Conteudo = {
  benefits: [
    {
      icon: 'entrega',
      title: 'Entrega Expressa',
      text: 'para todo o Brasil',
    },
    {
      icon: 'seguranca',
      title: 'Compra Segura',
      text: 'ambiente protegido',
    },
    {
      icon: 'promocao',
      title: '5% de Desconto',
      text: 'no boleto bancário',
    },
    {
      icon: 'troca',
      title: 'Troca Fácil',
      text: '30 dias para troca',
    },
  ],
};

/** Classe de posição que o CSS da réplica usa (o 2º e o 3º item têm cor própria na origem Tray). */
const CLASSE_DA_POSICAO = ['', 'second', 'third'];

// Espelha molecules/Ruler01 do faststore.starter:
// Swiper com Navigation, slidesPerView 1/2/3/4 por breakpoint (setas só no mobile).
const BREAKPOINTS = {
  768: { slidesPerView: 2 },
  1024: { slidesPerView: 3 },
  1360: { slidesPerView: 4 },
};

export default function Ruler() {
  const { benefits } = useConteudoDaSecao(MOCK);
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const syncNavState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  if (!benefits.length) return null;

  return (
    <section className={styles.home__ruler}>
      <div className={styles.ruler__container}>
        <Swiper
          breakpointsBase="container"
          className={styles.ruler__swiper}
          modules={[Navigation]}
          slidesPerView={1}
          breakpoints={BREAKPOINTS}
          onSwiper={swiper => {
            swiperRef.current = swiper;
            syncNavState(swiper);
          }}
          onSlideChange={syncNavState}
          onBreakpoint={syncNavState}
        >
          {benefits.map((item, index) => (
            <SwiperSlide
              key={index}
              className={`${CLASSE_DA_POSICAO[index] ?? ''} ${styles.swiper__slide}`}
            >
              <div className={styles.ruler__item}>
                <div
                  className={styles.item__icon}
                  // O SVG vem da lista fixa (icones.ts), nunca do conteúdo: o /p é público.
                  dangerouslySetInnerHTML={{ __html: iconeDoItem(item.icon, index) }}
                />
                <div className={styles.item__text}>
                  <span>
                    {item.title && <b>{item.title}</b>}
                    {item.text}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {!isBeginning && (
          <div
            className={styles['swiper-ruler-button-prev']}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 8L10 12L14 16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}

        {!isEnd && (
          <div
            className={styles['swiper-ruler-button-next']}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <svg
              fill="none"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 16L14 12L10 8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Ruler.conteudoPadrao = MOCK;

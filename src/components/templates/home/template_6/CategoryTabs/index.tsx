'use client';

import React, { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import styles from './index.module.css';

/**
 * Espelha `molecules/CategoryTabs06` do faststore.starter — o bloco "Compre Por
 * Categoria" da home 06: título, abas de categoria e um carrossel de cards de
 * MODELO, com a segunda foto aparecendo no hover.
 *
 * O que sai: `useProductsQuery` (cada aba é uma coleção VTEX), `useSession` e o
 * tracking. Os produtos de cada aba são os mesmos do `mock.ts` da origem, com as
 * fotos trocadas por `placehold.co` nas mesmas medidas — o catálogo é público e
 * nenhum template daqui aponta para o CDN de uma loja.
 *
 * Trocar de aba troca a lista e volta o carrossel para o começo, como na origem.
 */
const foto = (rotulo: string, tom: string) =>
  `https://placehold.co/500x500/${tom}/8a8a8a?text=${encodeURIComponent(rotulo)}`;

type Modelo = { id: string; nome: string; img: string; hover?: string };

const ABAS: Array<{ label: string; botao: string; modelos: Modelo[] }> = [
  {
    label: 'BOTAS',
    botao: 'Ver modelo',
    modelos: [
      { id: 'b1', nome: 'Bota Columbia 8641-727B', img: foto('Bota 1', 'ececec') },
      { id: 'b2', nome: 'Bota Columbia 8640-727A', img: foto('Bota 2', 'e6e6e6') },
      { id: 'b3', nome: 'Bota Atenas 9816-517E', img: foto('Bota 3', 'e0e0e0'), hover: foto('Bota 3 verso', 'd6d6d6') },
      { id: 'b4', nome: 'Bota Fluence 5542-559J', img: foto('Bota 4', 'dadada'), hover: foto('Bota 4 verso', 'd0d0d0') },
      { id: 'b5', nome: 'Bota Cross 9932-517A', img: foto('Bota 5', 'd4d4d4') },
    ],
  },
  {
    label: 'SAPATÊNIS',
    botao: 'Ver modelo',
    modelos: [
      { id: 's1', nome: 'Sapatênis Esportivo Milan 7970-720B', img: foto('Sapatenis 1', 'ececec') },
      { id: 's2', nome: 'Sapatênis Esportivo Milan 7970-720D', img: foto('Sapatenis 2', 'e6e6e6') },
      { id: 's3', nome: 'Sapatênis Esportivo Vox 8057-617D', img: foto('Sapatenis 3', 'e0e0e0') },
      { id: 's4', nome: 'Sapatênis Esportivo Star 1055B', img: foto('Sapatenis 4', 'dadada'), hover: foto('Sapatenis 4 verso', 'd0d0d0') },
      { id: 's5', nome: 'Sapatênis Esportivo Pulse 2262C', img: foto('Sapatenis 5', 'd4d4d4'), hover: foto('Sapatenis 5 verso', 'cacaca') },
    ],
  },
  {
    label: 'SAPATOS',
    botao: 'Ver modelo',
    modelos: [
      { id: 'c1', nome: 'Sapato Casual Austin 5168-675I', img: foto('Sapato 1', 'ececec') },
      { id: 'c2', nome: 'Sapato Casual Modena 3167-719J', img: foto('Sapato 2', 'e6e6e6'), hover: foto('Sapato 2 verso', 'dcdcdc') },
      { id: 'c3', nome: 'Sapato Casual Forest 6707-715H', img: foto('Sapato 3', 'e0e0e0'), hover: foto('Sapato 3 verso', 'd6d6d6') },
      { id: 'c4', nome: 'Sapato Casual Melnik 5286-645G', img: foto('Sapato 4', 'dadada') },
      { id: 'c5', nome: 'Sapato Casual Fluence 5540-559G', img: foto('Sapato 5', 'd4d4d4'), hover: foto('Sapato 5 verso', 'cacaca') },
    ],
  },
];

const TITULO = 'Compre Por Categoria';

const BREAKPOINTS = {
  0: { slidesPerView: 1, spaceBetween: 0 },
  1025: { slidesPerView: 3, spaceBetween: 0 },
};

export default function CategoryTabs() {
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [slideAtivo, setSlideAtivo] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const aba = ABAS[abaAtiva];
  const modelos = aba.modelos;

  const trocarAba = (i: number) => {
    setAbaAtiva(i);
    setSlideAtivo(0);
  };

  return (
    /* wrapper só do catálogo: carrega o container-type das @container */
    <div className={styles.tabsWrap}>
      <section className={styles.row} data-role="tabs-root">
        <div className={styles.header06Col}>
          <h2 className={styles.title} data-role="tabs-title">{TITULO}</h2>

          <div className={styles.tabsRow} role="tablist" aria-label={TITULO} data-role="tabs-row">
            {ABAS.map((t, i) => (
              <button
                key={t.label}
                type="button"
                role="tab"
                aria-selected={i === abaAtiva}
                className={`${styles.tab} ${i === abaAtiva ? styles.tabActive : ''}`}
                data-role="tab"
                onClick={() => trocarAba(i)}
              >
                <span className={styles.tabInner}>
                  <span className={styles.tabLabel}>{t.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sliderZone} data-role="tabs-slider">
          <Swiper
            key={abaAtiva}
            className={styles.swiper}
            slidesPerView={1}
            spaceBetween={0}
            loop
            breakpoints={BREAKPOINTS}
            onSwiper={s => {
              swiperRef.current = s;
              setSlideAtivo(s.realIndex);
            }}
            onSlideChange={s => setSlideAtivo(s.realIndex)}
          >
            {modelos.map(m => (
              <SwiperSlide key={m.id} className={styles.slide}>
                <section className={styles.card} data-role="tab-card" data-hover-image={m.hover ? true : undefined}>
                  <a className={styles.cardLink} href="#">
                    <div className={styles.cardBody}>
                      <div className={styles.imgLine}>
                        <img
                          className={styles.cardImg}
                          data-role="tab-card-img"
                          src={m.img}
                          alt={m.nome}
                          width={500}
                          height={500}
                          loading="lazy"
                        />
                        {m.hover && (
                          <img
                            className={styles.cardImgHover}
                            src={m.hover}
                            alt=""
                            aria-hidden="true"
                            width={500}
                            height={500}
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className={styles.cta}>
                        <p className={styles.ctaLabel} data-role="tab-cta">{aba.botao}</p>
                      </div>
                    </div>
                  </a>
                </section>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={styles.dotsRow} data-role="tabs-dots">
            {modelos.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === slideAtivo ? styles.dotActive : ''}`}
                aria-label={`Ir para o modelo ${i + 1}`}
                aria-current={i === slideAtivo}
                onClick={() => swiperRef.current?.slideToLoop(i)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

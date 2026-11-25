'use client';
import React from 'react';
import styles from './index.module.css';
import Spot from '../../../common/template_7/Spot';
import { LAYOUTS } from '@/data/layoutData';
import { TemplateRegistry } from '@/utils/templateRegistry';
import { useLayout } from '@/context/LayoutContext';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

/**
 * Conteúdo = o que a réplica mostra, por baixo do que o CS subir
 * (`useConteudoDaSecao`, campos do schema do ProductShelfCustom07). `eyebrow` e
 * `titleMobile` ficam fora (o markup daqui não tem onde desenhá-los) e
 * `collectionId`/`collectionUrl` viram a coleção da loja na fase de produtos.
 */
interface Showcase07Conteudo {
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
}

const MOCK: Showcase07Conteudo = {
  title: 'Lorem Ipsum Dolor Sit',
  viewAllLabel: 'Ver Todos',
  viewAllUrl: '/',
};

export default function Showcase() {
  const { selections } = useLayout();
  const { title, viewAllLabel, viewAllUrl } = useConteudoDaSecao(MOCK);

  // Filtra os spots selecionados
  const selectedSpots = selections.filter(item => item.layoutKey === 'spot');

  return (
    <div className={styles.home__showcase}>
      <div className={`${styles.showcase__container}`}>
        <div className={styles.showcase__title}>
          {title && <h2>{title}</h2>}
          {viewAllLabel && <a href={viewAllUrl || '#'}>{viewAllLabel}</a>}
        </div>

        <div className={styles.showcase__wrapper}>
          <div className={styles.showcase__swiper} data-tray-tst="vitrine_home">
            {/* Botão prev */}
            <div className={styles.swiper__button__prev}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </div>
            <div className={styles.swiper__wrapper}>
              {selectedSpots.length > 0
                ? selectedSpots.map((spot: { id: string; uid: string; variables?: Record<string, string> }) => {
                    const layoutItem = LAYOUTS.spot.items.find(
                      it => it.id === spot.id
                    );
                    if (!layoutItem) return null;

                    const SpotComponent =
                      TemplateRegistry[layoutItem.component];

                    return SpotComponent ? (
                      [1, 2, 3, 4].map((_, index) => (
                        <div
                          key={`${spot?.uid}-${index}`}
                          className={styles.swiper__slide}
                          style={spot.variables as React.CSSProperties}
                          data-tray-tst="vitrine_produto"
                          itemScope
                          itemType="https://schema.org/SomeProducts"
                        >
                          <SpotComponent soCard />
                        </div>
                      ))
                    ) : (
                      <></>
                    );
                  })
                : [1, 2, 3, 4].map((_, index) => (
                    <div
                      key={`${index}`}
                      className={styles.swiper__slide}
                      data-tray-tst="vitrine_produto"
                      itemScope
                      itemType="https://schema.org/SomeProducts"
                    >
                      <Spot />
                    </div>
                  ))}
            </div>
            {/* Botão next */}
            <div className={styles.swiper__button__next}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>

          {/* Paginação */}
          <div
            className={`${styles.swiper__showcase__pagination} ${styles.swiper__pagination__clickable} ${styles.swiper__pagination__bullets} ${styles.swiper__pagination__horizontal}`}
          >
            {[...Array(8)].map((_, index) => (
              <span
                key={index}
                className={`${styles.swiper__bullet} ${
                  index == 0 ? styles.swiper__bullet__active : ''
                }`}
                role="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index == 0 ? 'true' : undefined}
              ></span>
            ))}
          </div>
          <div className={styles.swiper__pagination}></div>
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Showcase.conteudoPadrao = MOCK;

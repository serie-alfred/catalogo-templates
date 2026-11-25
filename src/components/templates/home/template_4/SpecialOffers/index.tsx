'use client';

import React from 'react';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do SpecialOffers04. */
interface SpecialOffers04Conteudo {
  title?: string;
  text?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  cards: {
    image?: string;
    alt?: string;
    title?: string;
    discount?: string;
    text?: string;
    buttonLabel?: string;
    link?: string;
  }[];
}

const MOCK: SpecialOffers04Conteudo = {
  title: 'Special Offers',
  text: 'Quam elementum pulvinar etiam non quam tincidunt eget nullam non.',
  ctaLabel: 'Ver Todos',
  ctaUrl: '/',
  cards: [
    { image: 'https://placehold.co/400x600', alt: 'Special Discount', title: 'Special Discount', discount: '30% OFF', text: 'Aproveite descontos especiais em itens selecionados.', buttonLabel: 'Browse Now', link: '/' },
    { image: 'https://placehold.co/400x600', alt: 'Weekly Discount', title: 'Weekly Discount', discount: '40% OFF', text: 'Ofertas semanais para você renovar seu carrinho.', buttonLabel: 'Browse Now', link: '/' },
    { image: 'https://placehold.co/400x600', alt: 'Birthday Discount', title: 'Birthday Discount', discount: '50% OFF', text: 'Celebre com a gente e ganhe um super desconto.', buttonLabel: 'Browse Now', link: '/' },
  ],
};

/** A cor de cada card, na ordem do schema (verde, salmão, cinza). */
const COR_DO_CARD = ['green', 'salmao', 'grey'] as const;

export default function SpecialOffers() {
  const { title, text, ctaLabel, ctaUrl, cards } = useConteudoDaSecao(MOCK);

  return (
    <section className={styles.specialoffersContainer} data-role="so-root">
      <div className={`${styles.specialoffersContent} component__container`}>
        <div className={styles.specialText}>
          <div className={styles.titleOffers}>
            {title && <h3 data-role="so-title">{title}</h3>}
            {text && <p data-role="so-text">{text}</p>}
          </div>
          {ctaLabel && (
            <div className={styles.actOffers}>
              <a href={ctaUrl || '#'} data-role="so-cta">
                {ctaLabel}
                <svg
                  fill="none"
                  height="10"
                  viewBox="0 0 12 10"
                  width="12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.6666 5.00033H1.33331"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7.33331 8.33333L10.6666 5"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7.33331 1.66699L10.6666 5.00033"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Ofertas */}
        <div className={styles.specialContent}>
          {cards.slice(0, 3).map((card, i) => (
            <div
              key={i}
              className={`${styles.specialContainer} ${styles[COR_DO_CARD[i]]}`}
              data-role="so-card"
            >
              <div className={styles.containerImage}>
                <div className={styles.image}>
                  <img data-role="so-card-image"
                    src={card.image}
                    alt={card.alt ?? ''}
                    width="400"
                    height="600"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className={styles.containerText}>
                {card.title && <h3 data-role="so-card-title">{card.title}</h3>}
                {card.discount && <h4 data-role="so-card-discount">{card.discount}</h4>}
                {card.text && <p data-role="so-card-text">{card.text}</p>}
                {card.buttonLabel && (
                  <a className={styles.button} href={card.link || '#'}>
                    <div className={styles.buttonWrapper} data-role="so-card-button">{card.buttonLabel}</div>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
SpecialOffers.conteudoPadrao = MOCK;

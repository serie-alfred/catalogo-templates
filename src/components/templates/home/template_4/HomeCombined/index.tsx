'use client';

import React from 'react';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do HomeCombined04. */
interface HomeCombined04Conteudo {
  title?: string;
  text?: string;
  avatars: { image?: string; alt?: string }[];
  avatarsText?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  verticalImage?: string;
  verticalAlt?: string;
  verticalLink?: string;
  horizontalImage?: string;
  horizontalAlt?: string;
  horizontalLink?: string;
  discountTitle?: string;
  discountText?: string;
  discountCtaLabel?: string;
  discountCtaUrl?: string;
}

const MOCK: HomeCombined04Conteudo = {
  title: 'Exquisite design combined with functionalities',
  text: 'Pellentesque ullamcorper dignissim condimentum volutpat consequat mauris nunc lacinia quis.',
  avatars: [
    { image: 'https://startersites.io/blocksy/furniture/wp-content/uploads/2024/05/home-avatar-1.webp', alt: 'Avatar 1' },
    { image: 'https://startersites.io/blocksy/furniture/wp-content/uploads/2024/05/home-avatar-2.webp', alt: 'Avatar 2' },
    { image: 'https://startersites.io/blocksy/furniture/wp-content/uploads/2024/05/home-avatar-3.webp', alt: 'Avatar 3' },
  ],
  avatarsText: 'Contact with our expert',
  ctaLabel: 'Shop Now',
  ctaUrl: 'https://startersites.io/blocksy/furniture/shop/',
  verticalImage: 'https://placehold.co/290x516',
  verticalAlt: 'Banner 1',
  verticalLink: '/',
  horizontalImage: 'https://placehold.co/311x309',
  horizontalAlt: 'Banner 2',
  horizontalLink: '/',
  discountTitle: '25% OFF',
  discountText: 'Donec ac odio tempor dapibus.',
  discountCtaLabel: 'Explore Now',
  discountCtaUrl: 'https://startersites.io/blocksy/furniture/shop/',
};

export default function HomeCombined() {
  const {
    title,
    text,
    avatars,
    avatarsText,
    ctaLabel,
    ctaUrl,
    verticalImage,
    verticalAlt,
    verticalLink,
    horizontalImage,
    horizontalAlt,
    horizontalLink,
    discountTitle,
    discountText,
    discountCtaLabel,
    discountCtaUrl,
  } = useConteudoDaSecao(MOCK);

  return (
    <section className={styles.homeCombined} data-role="hc-root">
      <div className={`${styles.rowAlignwide} component__container`}>
        <div className={styles.rowContent}>
          {/* Texto */}
          <div className={styles.columnText}>
            {title && (
              <h2 className={styles.heading} data-role="hc-title">
                {title}
              </h2>
            )}
            {text && (
              <p className={styles.text} data-role="hc-text">
                {text}
              </p>
            )}

            {(avatars.length > 0 || avatarsText) && (
              <div className={styles.avatars} data-role="hc-avatars">
                {avatars.map((a, i) => (
                  <img data-role="hc-avatar"
                    key={i}
                    src={a.image}
                    alt={a.alt ?? ''}
                    width="30"
                    height="48"
                  />
                ))}
                {avatarsText && (
                  <p className={styles.contactExpert} data-role="hc-avatars-text">{avatarsText}</p>
                )}
              </div>
            )}

            {ctaLabel && (
              <div className={styles.buttonWrapper}>
                <a
                  className={styles.button}
                  href={ctaUrl || '#'}
                  rel="noopener"
                  data-role="hc-cta"
                >
                  {ctaLabel}
                </a>
              </div>
            )}
          </div>

          {/* Imagens e Desconto */}
          <div className={styles.columnImage}>
            <div className={styles.productVertical}>
              <a href={verticalLink || '#'}>
                <img
                  className={styles.banner}
                  data-role="hc-banner"
                  src={verticalImage}
                  alt={verticalAlt ?? ''}
                  loading="lazy"
                />
              </a>
            </div>

            <div className={styles.containerProduct}>
              <div className={styles.productHorizontal}>
                <a href={horizontalLink || '#'}>
                  <img
                    className={styles.banner}
                    data-role="hc-banner"
                    src={horizontalImage}
                    alt={horizontalAlt ?? ''}
                    loading="lazy"
                  />
                </a>
              </div>

              <div className={styles.discount} data-role="hc-discount">
                {discountTitle && (
                  <h3 className={styles.discountTitle} data-role="hc-discount-title">{discountTitle}</h3>
                )}
                {discountText && (
                  <p className={styles.discountText} data-role="hc-discount-text">
                    {discountText}
                  </p>
                )}
                {discountCtaLabel && (
                  <a
                    className={styles.button}
                    href={discountCtaUrl || '#'}
                    rel="noopener"
                    data-role="hc-discount-cta"
                  >
                    {discountCtaLabel}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
HomeCombined.conteudoPadrao = MOCK;

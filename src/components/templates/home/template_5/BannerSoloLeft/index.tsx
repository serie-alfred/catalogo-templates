'use client';

import React from 'react';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do BannerSoloLeft05. */
interface BannerSoloLeft05Conteudo {
  image?: string;
  alt?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
  link?: string;
}

const MOCK: BannerSoloLeft05Conteudo = {
  image: 'https://placehold.co/500x529',
  alt: 'Banner',
  title: 'ÖAK Style collection',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit maecenas volutpat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Blandit maecenas volutpat.',
  buttonLabel: 'Ver Coleção',
  link: '#',
};

export default function SoloBannerWithLink() {
  const { image, alt, title, description, buttonLabel, link } =
    useConteudoDaSecao(MOCK);
  if (!image && !title && !description) return null;

  return (
    <section className={styles.homeCollection} data-role="bl-root">
      <div className={styles.collectionContent}>
        <div className={styles.gridImage}>
          <div className={styles.bannerImageText}>
            {image && (
              <a href={link || '#'}>
                <img
                  className={styles.bannerImage}
                  data-role="bl-img"
                  src={image}
                  loading="lazy"
                  alt={alt ?? ''}
                />
              </a>
            )}
            <div className={styles.bannerText}>
              {title && <h2 data-role="bl-title">{title}</h2>}
              {description && <span data-role="bl-text">{description}</span>}
              {buttonLabel && (
                <a
                  href={link || '#'}
                  className={styles.bannerButton}
                  data-role="bl-cta"
                >
                  {buttonLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
SoloBannerWithLink.conteudoPadrao = MOCK;

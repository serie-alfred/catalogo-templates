'use client';

import React from 'react';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do BannerSolo04. */
interface BannerSolo04Conteudo {
  image?: string;
  alt?: string;
  link?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

const MOCK: BannerSolo04Conteudo = {
  image: 'https://placehold.co/749x570',
  alt: 'Banner promocional',
  link: '#',
  title: 'Título Fixo do Banner',
  text: 'Descrição fixa do banner para destacar a campanha ou produto.',
  ctaLabel: 'Ver Mais',
  ctaUrl: 'https://meusite.com/produtos',
};

export default function BannerSolo() {
  const { image, alt, link, title, text, ctaLabel, ctaUrl } =
    useConteudoDaSecao(MOCK);

  return (
    <section className={styles.collectionSoloContainer} data-role="bs-root">
      <div className={`${styles.collectionContent} component__container`}>
        <div className={styles.bannerImageText}>
          {image && (
            <a href={link || '#'}>
              <img data-role="bs-image"
                src={image}
                width="749"
                height="570"
                alt={alt ?? ''}
                loading="lazy"
              />
            </a>
          )}
          <div className={styles.bannerText}>
            <div className={styles.containerBannerText}>
              {title && <h2 data-role="bs-title">{title}</h2>}
              {text && <p data-role="bs-text">{text}</p>}
              {ctaLabel && (
                <a href={ctaUrl || '#'} data-role="bs-cta">
                  <span>{ctaLabel}</span>
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
BannerSolo.conteudoPadrao = MOCK;

'use client';

import React from 'react';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do BannerFull05. */
interface BannerFull05Conteudo {
  desktopImage?: string;
  mobileImage?: string;
  alt?: string;
  link?: string;
}

const MOCK: BannerFull05Conteudo = {
  desktopImage: 'https://placehold.co/1920x640',
  mobileImage: 'https://placehold.co/390x640',
  alt: 'Título do Banner',
  link: '#',
};

export default function BannerFull() {
  const { desktopImage, mobileImage, alt, link } = useConteudoDaSecao(MOCK);
  const desktop = desktopImage || mobileImage;
  const mobile = mobileImage || desktopImage;
  if (!desktop) return null;

  return (
    <section className={styles.homeBannerFull} data-role="bf-root">
      <div className={styles.contentBannerFull}>
        <a href={link || '#'}>
          <img
            alt={alt ?? ''}
            className={styles.bannerDesktop}
            data-role="bf-img-desktop"
            src={desktop}
            width="1920"
            height="640"
          />

          <img
            alt={alt ?? ''}
            className={styles.bannerMobile}
            data-role="bf-img-mobile"
            src={mobile}
            width="390"
            height="640"
          />
        </a>
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerFull.conteudoPadrao = MOCK;

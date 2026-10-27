import React from 'react';

import { getImageProps } from 'next/image';

import styles from './index.module.css';

/**
 * O banner é o maior elemento do topo (o LCP da home), então não pode ser
 * `lazy`. As duas artes (desktop e celular) vão num `<picture>`: o navegador
 * baixa só a da largura da tela, já com prioridade alta. Eram dois `<Image>`
 * trocados por CSS — um `priority` em cada um baixaria os dois.
 *
 * O `media` do `<source>` é o mesmo breakpoint do CSS (1023px).
 */
export default function BannerMain() {
  const comum = { alt: 'Foguete Decolando', priority: true };
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...comum,
    src: '/images/home/fullbanners/image_fx.png',
    width: 1408,
    height: 768,
  });
  const {
    props: { srcSet: mobile, ...img },
  } = getImageProps({
    ...comum,
    src: '/images/home/fullbanners/BannerMainMobile.png',
    width: 768,
    height: 1408,
  });

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <picture>
          <source media="(min-width: 1023px)" srcSet={desktop} />
          {/* O `priority` do getImageProps só tira o `lazy`: a prioridade
              alta do download precisa vir escrita. */}
          <img
            {...img}
            aria-hidden
            srcSet={mobile}
            fetchPriority="high"
            className={styles.bannerimg}
          />
        </picture>
        <div className={styles.textBanner}>
          <h1>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</h1>
        </div>
      </div>
    </div>
  );
}

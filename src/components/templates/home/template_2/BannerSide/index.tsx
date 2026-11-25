import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do BannerSide02. */
interface BannerSide02Conteudo {
  title?: string;
  text?: string;
  src?: string;
  alt?: string;
  href?: string;
}

const MOCK: BannerSide02Conteudo = {
  title: 'Lorem ipsum dolor sit amet consectetur. Quisque massa vel quis.',
  text: 'Lorem ipsum dolor sit amet consectetur. Senectus sagittis maecenas imperdiet lorem blandit diam arcu morbi. Sed scelerisque turpis massa est amet. Ut integer sit habitasse nullam donec sagittis condimentum vestibulum felis. Maecenas vulputate aliquet aliquam.',
  src: 'https://placehold.co/960x700',
  alt: 'Banner',
  href: '#',
};

const HomeBanner = () => {
  const { title, text, src, alt, href } = useConteudoDaSecao(MOCK);

  if (!src && !title && !text) return null;

  return (
    <div className={styles.homeBannerSide} data-role="banner-side">
      <div className={styles.bannerContainer}>
        <div className={styles.bannerRow}>
          <div className={styles.sectionText}>
            <div className={styles.textContent}>
              {title && <h2 data-role="banner-side-title">{title}</h2>}
              {text && <span data-role="banner-side-text">{text}</span>}
            </div>
          </div>
          {src && (
            <div className={styles.bannerItem} data-role="banner-side-image">
              <a href={href || '#'}>
                <img src={src} width="960" height="700" alt={alt ?? ''} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
HomeBanner.conteudoPadrao = MOCK;

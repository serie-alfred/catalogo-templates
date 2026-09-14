import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/BannerSide06` do faststore.starter — par de banner-cards
 * lado a lado: arte clicável, parágrafo de duas linhas e link "Veja mais".
 *
 * Duas diferenças deliberadas em relação à origem, ambas fora do desenho:
 *  • as artes são placeholders. O catálogo é público e nenhum template daqui
 *    aponta para o CDN de um cliente (39 já usam placehold.co). A geometria não
 *    muda: `aspect-ratio: 512/531` no CSS é quem manda na altura.
 *  • analytics (view/select promotion) não vem: preview não emite evento.
 */
interface Card {
  img: string;
  alt: string;
  link: string;
  /** duas linhas, separadas por <br> como na origem */
  linhas: [string, string];
  ctaLabel: string;
}

const cards: Card[] = [
  {
    img: 'https://placehold.co/512x531/2b2b2b/f2f2f2?text=Best+Sellers',
    alt: 'Best Sellers',
    link: '/mais-vendidos',
    linhas: ['Conforto e estilo aprovados por quem já usa.', 'Garanta o seu!'],
    ctaLabel: 'Veja mais',
  },
  {
    img: 'https://placehold.co/512x531/3a3a3a/f2f2f2?text=Mochilas',
    alt: 'Mochilas',
    link: '/acessorios/mochilas',
    linhas: ['Leve tudo com estilo!', 'Explore a coleção de mochilas.'],
    ctaLabel: 'Veja mais',
  },
];

export default function BannerSide() {
  return (
    /* O wrapper não existe na origem: lá a raiz é a própria `.row`. Ele existe
       porque um elemento NÃO consulta o próprio container — sem um ancestral
       com `container-type`, as `@container` da `.row` nunca casariam e o
       mobile não trocaria de layout. É um <div> nu, sem caixa própria. */
    <div className={styles.bannerSide06Root}>
      <div className={styles.row} data-role="bs-row">
        {cards.map((card, index) => (
          <div key={index} className={styles.column} data-role="bs-column">
            <div className={styles.card} data-role="bs-card">
              <a href={card.link}>
                <img
                  className={styles.cardImg}
                  data-role="bs-card-img"
                  src={card.img}
                  alt={card.alt}
                  width={512}
                  height={531}
                  loading="lazy"
                />
              </a>
            </div>
            <div className={styles.textCol} data-role="bs-text-col">
              <p className={styles.text} data-role="bs-text">
                {card.linhas[0]}
                <br />
                {card.linhas[1]}
              </p>
              <a
                className={styles.vejaLink}
                data-role="bs-veja-link"
                href={card.link}
              >
                <span className={styles.vejaLabel} data-role="bs-veja-label">
                  {card.ctaLabel}
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

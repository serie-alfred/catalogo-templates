import React from 'react';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Conteúdo: os nomes do `section.schema` do ClientReview06 do starter (`title`,
 * `subtitle`, `reviews[]`: `img`, `desc`, `name`), com o mock por baixo do que o
 * CS subir (`useConteudoDaSecao`).
 */
interface ClientReviewConteudo {
  title?: string;
  subtitle?: string;
  reviews: { img?: string; desc?: string; name?: string }[];
}

const MOCK: ClientReviewConteudo = {
  title: 'Depoimentos',
  subtitle: 'O que dizem sobre nós',
  reviews: [
    {
      img: 'https://agenciaseriedesign2.fbitsstatic.net/media/imgperson2.png?v=202505281457',
      desc: 'Excelente atendimento na NutriFlex! Comprei meus suplementos lá e fiquei impressionado com a qualidade e variedade. Já virei cliente fiel!',
      name: 'Camila M.',
    },
    {
      img: 'https://agenciaseriedesign2.fbitsstatic.net/media/imgperson1.png?v=202505281457',
      desc: 'Amo a NutriFlex! Suas opções de suplementos são incríveis, sempre encontro o que preciso para potencializar meus treinos. Recomendo demais!',
      name: 'Teodoro D.',
    },
    {
      img: 'https://agenciaseriedesign2.fbitsstatic.net/media/imgperson2.png?v=202505281457',
      desc: 'Excelente atendimento na NutriFlex! Comprei meus suplementos lá e fiquei impressionado com a qualidade e variedade. Já virei cliente fiel!',
      name: 'Camila M.',
    },
    {
      img: 'https://agenciaseriedesign2.fbitsstatic.net/media/imgperson1.png?v=202505281457',
      desc: 'Amo a NutriFlex! Suas opções de suplementos são incríveis, sempre encontro o que preciso para potencializar meus treinos. Recomendo demais!',
      name: 'Teodoro D.',
    },
  ],
};

export default function ClientReview() {
  const { title, subtitle, reviews } = useConteudoDaSecao(MOCK);
  const items = reviews.filter(r => r && (r.desc || r.name));

  const StarIcon = () => (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.8638 0.722089L6.7437 2.49644C6.8637 2.74343 7.18365 2.98035 7.45365 3.02571L9.04845 3.29287C10.0683 3.46426 10.3083 4.2103 9.5734 4.94625L8.33355 6.19635C8.12355 6.40805 8.0086 6.81635 8.07355 7.10875L8.42855 8.65625C8.7085 9.88115 8.06355 10.355 6.9887 9.7148L5.49385 8.8226C5.2239 8.6613 4.77895 8.6613 4.50395 8.8226L3.00913 9.7148C1.93925 10.355 1.28932 9.8761 1.56929 8.65625L1.92425 7.10875C1.98924 6.81635 1.87426 6.40805 1.66428 6.19635L0.42442 4.94625C-0.3055 4.2103 -0.0705252 3.46426 0.94936 3.29287L2.54418 3.02571C2.80915 2.98035 3.12912 2.74343 3.2491 2.49644L4.129 0.722089C4.60895 -0.240696 5.38885 -0.240696 5.8638 0.722089Z"
        fill="#FFDE21"
      />
    </svg>
  );

  if (!items.length && !title) return null;

  return (
    <section className={styles.reviewContainer} data-role="cr-root">
      {title && (
        <p className={styles.titleReview} data-role="cr-title">{title}</p>
      )}
      {subtitle && (
        <span className={styles.subtitleReview} data-role="cr-subtitle">{subtitle}</span>
      )}

      <div className={`${styles.review} component__container`}>
        <div className={`${styles.swiper}`}>
          <div className={`${styles.swiper__wrapper}`}>
            {items.map((review, index) => (
              <div key={index} className={`${styles.swiper__slide}`}>
                <div className={styles.reviewItem} data-role="cr-item">
                  {review.img && (
                    <img src={review.img} alt={`imagem de ${review.name ?? ''}`} data-role="cr-photo" />
                  )}
                  <div className={styles.stars} data-role="cr-stars">
                    <div className={styles.stars__inner}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>
                  </div>
                  <p className={styles.desc} data-role="cr-desc">{review.desc}</p>
                  <span className={styles.name} data-role="cr-name">{review.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ClientReview.conteudoPadrao = MOCK;

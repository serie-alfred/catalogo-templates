import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/SocialProof07` do faststore.starter — prova social
 * centralizada: número grande, subtítulo, estrelas e nota.
 *
 * `data-role` idênticos aos da origem: é por eles que o estágio 2-fidelidade
 * casa os dois lados nó a nó.
 */
const conteudo = {
  number: '+100 mil ambientes',
  subtitle: 'transformados com conforto, estilo e curadoria especializada',
  rating: '4,9 · mais de 12.000 avaliações',
  starCount: 5,
};

function Star() {
  return (
    <svg
      className={styles.star}
      data-role="sp-star"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export default function ClientReview() {
  return (
    <div className={styles.socialProof07Root}>
      <div className={styles.section} data-role="sp-section">
        <p className={styles.number} data-role="sp-number">
          {conteudo.number}
        </p>
        <p className={styles.subtitle} data-role="sp-subtitle">
          {conteudo.subtitle}
        </p>
        <div className={styles.stars} data-role="sp-stars">
          {Array.from({ length: conteudo.starCount }).map((_, i) => (
            <Star key={i} />
          ))}
          <span className={styles.rating} data-role="sp-rating">
            {conteudo.rating}
          </span>
        </div>
      </div>
    </div>
  );
}

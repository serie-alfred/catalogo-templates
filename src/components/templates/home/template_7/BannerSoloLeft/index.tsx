import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/EditorialBanner07` do faststore.starter — banner editorial
 * de 2 colunas: imagem com citação + coluna de texto (eyebrow, título, corpo e
 * link). No mobile reflui para 1 coluna.
 *
 * A origem não recebe `image` do mock, então a arte é o gradiente de fallback —
 * mesmo comportamento aqui, para os dois lados baterem.
 */
const conteudo = {
  quote: '"O tapete define o ponto focal de qualquer ambiente"',
  eyebrow: 'Guia de decoração',
  title: 'Como escolher o tapete ideal para cada ambiente',
  body:
    'O tapete certo transforma um espaço comum em um ambiente sofisticado. Ele define limites, adiciona textura, conforto e personalidade — e ainda protege o piso.',
  linkLabel: 'Ler guia completo →',
  linkUrl: '/guia/tapetes',
};

export default function BannerSoloLeft() {
  return (
    <div className={styles.editorialBanner07Root}>
      <div className={styles.section} data-role="ed-section">
        <div className={styles.image} data-role="ed-image">
          <span className={styles.texture} aria-hidden="true" />
          <span className={styles.scrim} aria-hidden="true" />
          <div className={styles.quoteWrap}>
            <p className={styles.quote} data-role="ed-quote">
              {conteudo.quote}
            </p>
          </div>
        </div>
        <div className={styles.text} data-role="ed-text">
          <p className={styles.eyebrow} data-role="ed-eyebrow">
            {conteudo.eyebrow}
          </p>
          <h2 className={styles.title} data-role="ed-title">
            {conteudo.title}
          </h2>
          <p className={styles.body} data-role="ed-body">
            {conteudo.body}
          </p>
          <a className={styles.link} href={conteudo.linkUrl} data-role="ed-link">
            {conteudo.linkLabel}
          </a>
        </div>
      </div>
    </div>
  );
}

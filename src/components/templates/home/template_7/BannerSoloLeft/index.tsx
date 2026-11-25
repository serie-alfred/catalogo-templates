import React from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/EditorialBanner07` do faststore.starter — banner editorial
 * de 2 colunas: imagem com citação + coluna de texto (eyebrow, título, corpo e
 * link). No mobile reflui para 1 coluna.
 *
 * A origem não recebe `image` do mock, então a arte é o gradiente de fallback —
 * mesmo comportamento aqui, para os dois lados baterem; com a arte do CS, ela
 * entra sobre o gradiente (`imageEl`, como no starter). Conteúdo = o mock.ts de
 * lá, por baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 */
interface BannerSoloLeftConteudo {
  image?: string;
  quote?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  linkLabel?: string;
  linkUrl?: string;
}

const MOCK: BannerSoloLeftConteudo = {
  quote: '"O tapete define o ponto focal de qualquer ambiente"',
  eyebrow: 'Guia de decoração',
  title: 'Como escolher o tapete ideal para cada ambiente',
  body:
    'O tapete certo transforma um espaço comum em um ambiente sofisticado. Ele define limites, adiciona textura, conforto e personalidade — e ainda protege o piso.',
  linkLabel: 'Ler guia completo →',
  linkUrl: '/guia/tapetes',
};

export default function BannerSoloLeft() {
  const { image, quote, eyebrow, title, body, linkLabel, linkUrl } =
    useConteudoDaSecao(MOCK);

  return (
    <div className={styles.editorialBanner07Root}>
      <div className={styles.section} data-role="ed-section">
        <div className={styles.image} data-role="ed-image">
          {image && (
            <img
              className={styles.imageEl}
              src={image}
              alt=""
              data-role="ed-image-el"
            />
          )}
          <span className={styles.texture} aria-hidden="true" />
          <span className={styles.scrim} aria-hidden="true" />
          {quote && (
            <div className={styles.quoteWrap}>
              <p className={styles.quote} data-role="ed-quote">
                {quote}
              </p>
            </div>
          )}
        </div>
        <div className={styles.text} data-role="ed-text">
          {eyebrow && (
            <p className={styles.eyebrow} data-role="ed-eyebrow">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className={styles.title} data-role="ed-title">
              {title}
            </h2>
          )}
          {body && (
            <p className={styles.body} data-role="ed-body">
              {body}
            </p>
          )}
          {linkLabel && (
            <a className={styles.link} href={linkUrl || '#'} data-role="ed-link">
              {linkLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
BannerSoloLeft.conteudoPadrao = MOCK;

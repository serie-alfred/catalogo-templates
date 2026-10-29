import React from 'react';

import styles from './index.module.css';
import { FONTES_15 } from '@/components/templates/common/template_15/Spot';

/**
 * Espelha `molecules/ProductDescription15` do faststore.starter (família 15, Luxo; desenho
 * `ProductDescription15`): a chamada dourada, o título em serifa com o trecho em itálico e a
 * descrição centrados; três destaques com o numeral romano em itálico dourado entre o fio
 * dourado e um fio apagado; a ficha técnica em linhas e a imagem da descrição ao lado. Mesmo
 * markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Conteúdo = o `mock.ts` de lá (chamada, título e produto de exemplo), já resolvido como o
 * starter resolve: a especificação "Destaques" vira os destaques ("Título: texto"), a "Imagem
 * da descrição" vira a figura (o bloco areia em data URI do mock) e as demais especificações
 * viram a ficha, menos a escondida no CMS ("Detalhes da peça") e o guia de medidas. Sai o
 * `usePDP`.
 */

const EYEBROW = 'A peça em detalhes';
const TITLE = 'Feito para';
const TITLE_EMPHASIS = 'durar gerações';
const PRODUCT_NAME = 'Anel Solitário Ouro 18k';
const DESCRIPTION_HTML =
  '<p>Cada solitário é montado à mão no nosso ateliê e passa por inspeção individual antes de seguir no estojo da maison.</p>';
const FEATURES = [
  'Ouro 18k maciço: Liga 750 com acabamento polido espelhado, que não escurece com o uso diário.',
  'Seis garras: Garras finas que deixam a luz atravessar o diamante por todos os ângulos.',
  'Origem certificada: Diamante com certificado de laboratório independente e rastreio de origem.',
];
const SPECS = [
  { name: 'Metal', value: 'Ouro amarelo 18k' },
  { name: 'Pedra', value: 'Diamante, lapidação brilhante' },
  { name: 'Peso da pedra', value: '[0,00] ct' },
  { name: 'Cor e pureza', value: '[G] · [VS1]' },
  { name: 'Largura do aro', value: '[0,0] mm' },
  { name: 'Garantia', value: '[00] meses' },
];
const IMAGE_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="#E6DFD2"/></svg>'
)}`;
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** "Título: texto" → { title, text }; sem ":" fica só o título. */
const split = (line: string) => {
  const i = line.indexOf(':');
  return i > 0 ? { title: line.slice(0, i).trim(), text: line.slice(i + 1).trim() } : { title: line.trim(), text: '' };
};

export default function ProductDescription15() {
  const features = FEATURES.map(split);
  const heading = [TITLE, TITLE_EMPHASIS].filter(Boolean).join(' ');

  return (
    <div className={styles.productDescription15Box}>
      <section className={styles.productDescription15} aria-label={heading} data-role="pd-root">
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.inner}>
          <div className={styles.head} data-role="pd-head">
            <span className={styles.eyebrow}>{EYEBROW}</span>
            <h2 className={styles.title}>
              {TITLE} <em>{TITLE_EMPHASIS}</em>
            </h2>
            <div className={styles.intro} data-role="pd-description" dangerouslySetInnerHTML={{ __html: DESCRIPTION_HTML }} />
          </div>

          <div className={styles.features} data-role="pd-features">
            {features.map((f, i) => (
              <article key={`${f.title}-${i}`} className={styles.feature}>
                <span className={styles.numeral} aria-hidden="true">
                  {ROMAN[i] ?? i + 1}
                </span>
                <div className={styles.featureBody}>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  {f.text && <p className={styles.featureText}>{f.text}</p>}
                </div>
              </article>
            ))}
          </div>

          <div className={styles.bottom}>
            <dl className={styles.specs} data-role="pd-specs">
              {SPECS.map(s => (
                <div key={s.name} className={styles.spec}>
                  <dt>{s.name}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
            <figure className={styles.figure} data-role="pd-image">
              <img src={IMAGE_URL} alt={`${heading} — ${PRODUCT_NAME}`} width={1200} height={600} loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
}

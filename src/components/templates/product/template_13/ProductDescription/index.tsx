import React from 'react';

import styles from './index.module.css';
import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

/**
 * Espelha `molecules/ProductDescription13` do faststore.starter (família 13, Noturno; desenho
 * `ProductDescription13`): o título enorme em condensada com a descrição ao lado; as
 * tecnologias em cartões numerados ("01" em verde, título e texto); a ficha técnica em linhas
 * entre filetes e a imagem da descrição ao lado. Mesmo markup, classes e `data-role`; o CSS é
 * derivado do SCSS de lá.
 *
 * Conteúdo = o `mock.ts` de lá (título + produto de exemplo), já resolvido como o starter
 * resolve: a especificação "Tecnologia" vira os cartões ("Título: texto"), a "Imagem da
 * descrição" vira a figura (o bloco grafite em data URI do mock) e as demais especificações
 * viram a ficha, menos a escondida no CMS ("Detalhes") e o guia de medidas. Sai o `usePDP`.
 */

const TITLE = 'Tecnologia';
const PRODUCT_NAME = 'Tênis Runner V2 Preto/Lima';
const DESCRIPTION_HTML =
  '<p>O Runner V2 foi desenhado para quilômetros no asfalto e para a volta pra casa depois do rolê.</p>';
const FEATURES = [
  'Amortecimento: Espuma de alta resposta na entressola devolve energia a cada passada sem perder estabilidade.',
  'Cabedal respirável: Mesh técnico com ventilação nas laterais e fios refletivos que aparecem no farol.',
  'Solado de borracha: Desenho em gomos que segura em piso molhado e aguenta o desgaste do dia a dia.',
];
const SPECS = [
  { name: 'Cabedal', value: 'Mesh técnico' },
  { name: 'Entressola', value: 'Espuma de alta resposta' },
  { name: 'Solado', value: 'Borracha' },
  { name: 'Drop', value: '[00 mm]' },
  { name: 'Peso', value: '[000 g] no tamanho 41' },
  { name: 'Garantia', value: '[00] dias' },
];
const IMAGE_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="#1E1E1E"/></svg>'
)}`;

const two = (n: number) => String(n).padStart(2, '0');

/** "Título: texto" → { title, text }; sem ":" fica só o título. */
const split = (line: string) => {
  const i = line.indexOf(':');
  return i > 0 ? { title: line.slice(0, i).trim(), text: line.slice(i + 1).trim() } : { title: line.trim(), text: '' };
};

export default function ProductDescription13() {
  const features = FEATURES.map(split);

  return (
    <div className={styles.productDescription13Box}>
      <section className={styles.productDescription13} aria-label={TITLE} data-role="pd-root">
        <link rel="stylesheet" href={FONTES_13} />
        <div className={styles.inner}>
          <div className={styles.head} data-role="pd-head">
            <h2 className={styles.title}>{TITLE}</h2>
            <div className={styles.intro} data-role="pd-description" dangerouslySetInnerHTML={{ __html: DESCRIPTION_HTML }} />
          </div>

          <div className={styles.cards} data-role="pd-features">
            {features.map((f, i) => (
              <article key={`${f.title}-${i}`} className={styles.card}>
                <span className={styles.cardNum} aria-hidden="true">
                  {two(i + 1)}
                </span>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{f.title}</h3>
                  {f.text && <p className={styles.cardText}>{f.text}</p>}
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
              <img src={IMAGE_URL} alt={`${TITLE} — ${PRODUCT_NAME}`} width={1200} height={600} loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
}

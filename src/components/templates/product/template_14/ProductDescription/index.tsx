import React from 'react';

import styles from './index.module.css';
import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

/**
 * Espelha `molecules/ProductDescription14` do faststore.starter (família 14, Esportiva; desenho
 * `ProductDescription14`): na superfície clara, o título em Saira itálica com a descrição
 * embaixo; as tecnologias em três colunas numeradas ("01" em vermelho, filete grosso em cima);
 * "Especificações" em linhas entre filetes e a imagem da descrição ao lado. Mesmo markup,
 * classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Conteúdo = o `mock.ts` de lá, já resolvido como o starter resolve: o título com `{produto}`
 * trocado pelo nome, a especificação "Tecnologia" vira as colunas ("Título: texto"), a "Imagem
 * da descrição" vira a figura (o bloco em data URI do mock) e as demais especificações viram a
 * ficha, menos as escondidas no CMS ("Detalhes", "Destaques") e a tabela de medidas. Sai o
 * `usePDP`.
 */

const PRODUCT_NAME = 'Velox Run 3';
const HEADING = `Por dentro do ${PRODUCT_NAME}`;
const SPECS_TITLE = 'Especificações';
const DESCRIPTION_HTML =
  '<p>Desenvolvido para treinos longos e provas de rua, o Velox Run 3 combina leveza e estabilidade. A nova espuma deixa a passada mais macia sem perder resposta, e o cabedal mais justo segura o pé nas curvas.</p>';
const FEATURES = [
  'Amortecimento: Espuma de alta resposta na entressola devolve energia a cada passada, do primeiro ao último quilômetro.',
  'Cabedal respirável: Mesh técnico com ventilação lateral e detalhes refletivos para treinos no começo da manhã.',
  'Tração no molhado: Solado de borracha com desenho em gomos que segura no asfalto molhado e resiste ao desgaste.',
];
const SPECS = [
  { name: 'Indicação', value: 'Asfalto e esteira' },
  { name: 'Pisada', value: 'Neutra' },
  { name: 'Peso', value: '248 g no tamanho 41' },
  { name: 'Drop', value: '8 mm' },
  { name: 'Cabedal', value: 'Mesh técnico' },
  { name: 'Solado', value: 'Borracha' },
];
const IMAGE_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="#D5DAE0"/></svg>'
)}`;

const two = (n: number) => String(n).padStart(2, '0');

/** "Título: texto" → { title, text }; sem ":" fica só o título. */
const split = (line: string) => {
  const i = line.indexOf(':');
  return i > 0 ? { title: line.slice(0, i).trim(), text: line.slice(i + 1).trim() } : { title: line.trim(), text: '' };
};

export default function ProductDescription14() {
  const features = FEATURES.map(split);

  return (
    <div className={styles.productDescription14Box}>
      <section className={styles.productDescription14} aria-label={HEADING} data-role="pd-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.inner}>
          <div className={styles.head} data-role="pd-head">
            <h2 className={styles.title}>{HEADING}</h2>
            <div className={styles.intro} data-role="pd-description" dangerouslySetInnerHTML={{ __html: DESCRIPTION_HTML }} />
          </div>

          <div className={styles.cards} data-role="pd-features">
            {features.map((f, i) => (
              <article key={`${f.title}-${i}`} className={styles.card}>
                <span className={styles.cardNum} aria-hidden="true">
                  {two(i + 1)}
                </span>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                {f.text && <p className={styles.cardText}>{f.text}</p>}
              </article>
            ))}
          </div>

          <div className={styles.bottom}>
            <div className={styles.specsBox} data-role="pd-specs">
              <h3 className={styles.specsTitle}>{SPECS_TITLE}</h3>
              <dl className={styles.specs}>
                {SPECS.map(s => (
                  <div key={s.name} className={styles.spec}>
                    <dt>{s.name}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure className={styles.figure} data-role="pd-image">
              <img src={IMAGE_URL} alt={HEADING} width={1200} height={600} loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
}

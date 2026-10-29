import React from 'react';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductDescription16` do faststore.starter (família 16, Infantil; desenho
 * `ProductDescription16`): o título em Fredoka e a descrição; os destaques em cartões brancos com
 * a bolinha verde-água numerada e inclinada; a ficha técnica num cartão creme com linhas
 * tracejadas e a imagem da descrição ao lado. Mesmo markup, classes e `data-role`; o CSS é
 * derivado do SCSS de lá.
 *
 * Lá descrição, destaques, ficha e imagem vêm do produto da PDP; aqui são o exemplo do mock.ts de
 * lá (a imagem é o bloco lilás de exemplo, um SVG inline sem rede).
 */
const FONTES =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap';

const TITLE = 'Feito para noites tranquilas';
const NOME = 'Pijama Algodão Estrelinhas';
const DESCRICAO =
  'O Pijama Estrelinhas é de algodão macio, com modelagem folgada para a criança se mexer à vontade na cama. A estampa é feita com tinta à base d’água, que não pesa no tecido e não desbota.';
const FEATURES = [
  { title: 'Algodão macio', text: 'Tecido 100% algodão, respirável e gostoso de vestir, sem etiqueta pinicando no pescoço.' },
  { title: 'Estampa que dura', text: 'As estrelinhas continuam bonitas depois de muitas lavagens na máquina.' },
  { title: 'Fácil de vestir', text: 'Gola com abertura ampla e elástico suave na cintura, para a criança se vestir sozinha.' },
];
const SPECS = [
  { name: 'Composição', value: '100% algodão' },
  { name: 'Faixa etária', value: '2 a 10 anos' },
  { name: 'Peças', value: 'Blusa manga longa e calça' },
  { name: 'Lavagem', value: 'Máquina, água fria' },
  { name: 'Garantia', value: '[00] dias' },
];
const IMAGEM = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="#E8E3F3"/></svg>'
)}`;

export default function ProductDescription16() {
  return (
    <div className={styles.productDescription16Box}>
      <section className={styles.productDescription16} aria-label={TITLE} data-role="pd-root">
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.inner}>
          <div className={styles.head} data-role="pd-head">
            <h2 className={styles.title}>{TITLE}</h2>
            <div className={styles.intro} data-role="pd-description">
              <p>{DESCRICAO}</p>
            </div>
          </div>

          <div className={styles.cards} data-role="pd-features">
            {FEATURES.map((f, i) => (
              <article key={f.title} className={styles.card}>
                <span className={styles.cardNum} aria-hidden="true">
                  {i + 1}
                </span>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{f.title}</h3>
                  <p className={styles.cardText}>{f.text}</p>
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
              <img src={IMAGEM} alt={`${TITLE} — ${NOME}`} width={1200} height={600} loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
}

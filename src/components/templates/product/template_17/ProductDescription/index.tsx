import React from 'react';

import { FONTES_17 } from '@/components/templates/common/template_17/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductDescription17` do faststore.starter (família 17, Pet; desenho
 * `ProductDescription17`): "Sobre o produto" em Bricolage com a descrição embaixo; os destaques em
 * três cartões no primário a 9% (o número "01" no primário, o título e o texto); embaixo, as
 * "Especificações" em linhas com filete e a imagem da descrição (2:1) ao lado. No mobile tudo
 * empilha e a imagem vem antes das especificações (é o `column-reverse` do CSS). Mesmo markup,
 * classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Lá descrição, destaques, ficha e imagem vêm do produto da PDP (especificações com o nome
 * configurado no CMS; as escondidas — Composição, Níveis de garantia — ficam de fora); aqui são o
 * exemplo do mock.ts de lá, já resolvido (a imagem é o bloco verde-acinzentado de exemplo, um SVG
 * inline sem rede).
 */
const TITLE = 'Sobre o produto';
const SPECS_TITLE = 'Especificações';
const NOME = 'Ração Premium Cães Adultos Frango e Arroz 15 kg';
const DESCRICAO =
  'Alimento completo e balanceado para cães adultos, feito com ingredientes selecionados e sem corantes artificiais. Croquete de tamanho médio, pensado para mastigação fácil.';
const FEATURES = [
  {
    title: 'Proteína de verdade',
    text: 'Frango como primeiro ingrediente, para músculos fortes e muita disposição nos passeios.',
  },
  { title: 'Digestão leve', text: 'Arroz e fibras selecionadas que ajudam a formar fezes firmes e com menos odor.' },
  { title: 'Pele e pelagem', text: 'Ômegas 3 e 6 na medida para uma pelagem macia e brilhante.' },
];
const SPECS = [
  { name: 'Espécie', value: 'Cão' },
  { name: 'Idade', value: 'Adulto, a partir de 12 meses' },
  { name: 'Porte', value: 'Médio e grande' },
  { name: 'Sabor', value: 'Frango e arroz' },
  { name: 'Peso líquido', value: '15 kg' },
  { name: 'Fabricante', value: '[Razão social do fabricante]' },
];
const IMAGEM = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="#D5D9CF"/></svg>'
)}`;

export default function ProductDescription17() {
  return (
    <div className={styles.productDescription17Box}>
      <section className={styles.productDescription17} aria-label={TITLE} data-role="pd-root">
        <link rel="stylesheet" href={FONTES_17} />
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
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardText}>{f.text}</p>
              </article>
            ))}
          </div>

          <div className={styles.bottom}>
            <div className={styles.specsBox}>
              <h3 className={styles.specsTitle}>{SPECS_TITLE}</h3>
              <dl className={styles.specs} data-role="pd-specs">
                {SPECS.map(s => (
                  <div key={s.name} className={styles.spec}>
                    <dt>{s.name}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure className={styles.figure} data-role="pd-image">
              <img src={IMAGEM} alt={`${TITLE} — ${NOME}`} width={1200} height={600} loading="lazy" decoding="async" />
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
}

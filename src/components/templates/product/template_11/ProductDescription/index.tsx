import React from 'react';

import styles from './index.module.css';
import {
  FONTES_11,
  referencia11,
} from '@/components/templates/common/template_11/Spot';

/**
 * Espelha `molecules/ProductDescription11` do faststore.starter (família 11, Grade; desenho
 * `ProductDescription11`): uma caixa de filetes com a cabeça "[N°024] Descrição e ficha
 * técnica"; à esquerda a descrição e o desenho técnico, à direita a ficha em grade de 2
 * colunas e a lista numerada de materiais. Mesmo markup, classes e `data-role`; o CSS é
 * derivado do SCSS de lá.
 *
 * Conteúdo = o `mock.ts` de lá (rótulos + produto de exemplo), já resolvido como o starter
 * resolve: as especificações "Desenho técnico" e "Materiais" saem da ficha e viram o bloco
 * do desenho (o mesmo bloco liso em data URI do mock) e a lista numerada. Sai o `usePDP`.
 */

const TITLE = 'Descrição e ficha técnica';
const DESCRIPTION_LABEL = 'Descrição';
const DRAWING_LABEL = 'Desenho técnico';
const MATERIALS_LABEL = 'Materiais';
const SKU = '024';

// O "desenho técnico" do exemplo: um bloco liso (no ar é a imagem da especificação do produto).
const DRAWING_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><rect width="1200" height="900" fill="#F3F3F3"/></svg>'
)}`;

const DESCRIPTION_HTML =
  '<p>A Arco nasceu de um desenho de 1:5 feito à mão: uma base pesada, um braço que gira em dois pontos e uma cúpula pequena que direciona a luz sem ofuscar. Funciona na escrivaninha, no criado-mudo ou ao lado da poltrona de leitura.</p>';

const SPECS: Array<{ name: string; value: string }> = [
  { name: 'Altura', value: '52 cm' },
  { name: 'Largura', value: '45 cm' },
  { name: 'Profundidade', value: '18 cm' },
  { name: 'Peso', value: '2,4 kg' },
  { name: 'Cúpula', value: 'Ø 16 cm' },
  { name: 'Lâmpada', value: 'LED 8 W · E27' },
  { name: 'Temperatura', value: '2700 K' },
  { name: 'Tensão', value: 'Bivolt' },
  { name: 'Cabo', value: '1,8 m têxtil' },
  { name: 'Garantia', value: '2 anos' },
];

const MATERIALS = [
  'Base em aço carbono com pintura eletrostática',
  'Braço em aço com articulação de latão',
  'Cúpula em alumínio repuxado',
  'Cabo têxtil trançado com interruptor',
];

const two = (n: number) => String(n).padStart(2, '0');

export default function ProductDescription11() {
  const ref = referencia11(SKU);

  return (
    <div className={styles.productDescription11Box}>
      <link rel="stylesheet" href={FONTES_11} />
      <section
        className={styles.productDescription11}
        aria-label={TITLE}
        data-role="pd-root"
      >
        <div className={styles.box}>
          <div className={styles.headRow}>
            <h2 className={styles.title} data-role="pd-title">
              <span className={styles.ref}>[{ref}]</span>
              {TITLE}
            </h2>
          </div>
          <div className={styles.cols}>
            <div className={styles.left}>
              <div className={styles.description} data-role="pd-description">
                <span className={styles.label}>{DESCRIPTION_LABEL}</span>
                <div
                  className={styles.html}
                  dangerouslySetInnerHTML={{ __html: DESCRIPTION_HTML }}
                />
              </div>
              <figure className={styles.drawing} data-role="pd-drawing">
                <img
                  src={DRAWING_URL}
                  alt={DRAWING_LABEL}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className={styles.drawingLabel}>
                  {DRAWING_LABEL}
                </figcaption>
              </figure>
            </div>
            <div className={styles.right}>
              <dl className={styles.specs} data-role="pd-specs">
                {SPECS.map(s => (
                  <div key={s.name} className={styles.spec}>
                    <dt>{s.name}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className={styles.materials} data-role="pd-materials">
                <span className={styles.label}>{MATERIALS_LABEL}</span>
                <ol className={styles.materialList}>
                  {MATERIALS.map((m, i) => (
                    <li key={`${m}-${i}`}>
                      <span className={styles.materialNum} aria-hidden="true">
                        [{two(i + 1)}]
                      </span>
                      {m}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

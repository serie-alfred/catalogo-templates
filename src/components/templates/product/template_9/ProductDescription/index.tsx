import React from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductDescription09` do faststore.starter (família 09, Editorial;
 * desenho `ProductDescription09`): "Sobre a peça" com o HTML da descrição (com a imagem
 * dentro) e a ficha de especificações ao lado. Mesmo markup, classes e `data-role`; o
 * CSS é derivado do SCSS de lá. Conteúdo = o `mock.ts` de lá (rótulos + produto de
 * exemplo; a imagem da descrição é o SVG de uma cor só de lá). Sai o `usePDP`.
 */

const MOCK = {
  eyebrow: 'Descrição',
  title: 'Sobre a',
  titleEmphasis: 'peça',
  specsLabel: 'Especificações',
};

const IMAGEM = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="680" height="300"><rect width="680" height="300" fill="#E6DED2"/></svg>'
)}`;

const DESCRIPTION_HTML =
  '<p>Vestido midi em linho puro de fio médio, com toque seco e textura natural. Decote canoa, alças largas e fenda lateral discreta. A modelagem é solta, sem marcação na cintura, e o comprimento fica abaixo do joelho.</p>' +
  `<p><img src="${IMAGEM}" alt="Detalhe do tecido" width="680" height="300"></p>` +
  '<p>O forro em algodão vai até a altura do joelho. A modelo tem 1,74 m e veste M.</p>';

const SPECS = [
  { name: 'Composição', value: '100% linho' },
  { name: 'Forro', value: '100% algodão' },
  { name: 'Modelagem', value: 'Solta' },
  { name: 'Comprimento', value: 'Midi' },
  { name: 'Cuidados', value: 'Lavar à mão em água fria, secar à sombra' },
  { name: 'Origem', value: '[País de fabricação]' },
];

export default function ProductDescription09() {
  const { eyebrow, title, titleEmphasis, specsLabel } = MOCK;
  return (
    <div className={styles.productDescription09Box}>
      <link rel="stylesheet" href={FONTES_09} />
      <section className={styles.productDescription09} aria-label={eyebrow} data-role="pd-root">
        <div className={styles.inner}>
          <article className={styles.article} data-role="pd-description">
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 className={styles.title} data-role="pd-title">
              {title} <em>{titleEmphasis}</em>
            </h2>
            <div className={styles.html} dangerouslySetInnerHTML={{ __html: DESCRIPTION_HTML }} />
          </article>
          <div className={styles.specs} data-role="pd-specs">
            <span className={styles.eyebrow}>{specsLabel}</span>
            <dl className={styles.list}>
              {SPECS.map(s => (
                <div key={s.name} className={styles.row}>
                  <dt>{s.name}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}

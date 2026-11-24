import React from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductDescription09` do faststore.starter (família 09, Editorial;
 * desenho `ProductDescription09`): "Sobre a peça" com o HTML da descrição (com a imagem
 * dentro) e a ficha de especificações ao lado. Mesmo markup, classes e `data-role`; o
 * CSS é derivado do SCSS de lá. Sai o `usePDP`.
 *
 * Os rótulos e o `hiddenSpecs` são do CMS e vêm do `useConteudoDaSecao`. A descrição e
 * as especificações são do produto: até o produto em destaque da loja existir (fase de
 * produtos), o produto de exemplo do `mock.ts` de lá (a imagem da descrição é o SVG de
 * uma cor só de lá).
 */

interface ProductDescription09Conteudo {
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  specsLabel?: string;
  /** Especificações a esconder, separadas por vírgula ("Guia de medidas, Gênero"). */
  hiddenSpecs?: string;
}

const MOCK: ProductDescription09Conteudo = {
  eyebrow: 'Descrição',
  title: 'Sobre a',
  titleEmphasis: 'peça',
  specsLabel: 'Especificações',
  hiddenSpecs: '',
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

/** Como o starter compara nomes: sem acento, sem caixa, sem espaço nas pontas. */
const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

export default function ProductDescription09() {
  const { eyebrow, title, titleEmphasis, specsLabel, hiddenSpecs } = useConteudoDaSecao(MOCK);
  const escondidas = new Set(
    String(hiddenSpecs ?? '')
      .split(',')
      .map(norm)
      .filter(Boolean)
  );
  const specs = SPECS.filter(s => !escondidas.has(norm(s.name)));

  return (
    <div className={styles.productDescription09Box}>
      <link rel="stylesheet" href={FONTES_09} />
      <section className={styles.productDescription09} aria-label={eyebrow || 'Descrição'} data-role="pd-root">
        <div className={styles.inner}>
          <article className={styles.article} data-role="pd-description">
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            {(title || titleEmphasis) && (
              <h2 className={styles.title} data-role="pd-title">
                {title} {titleEmphasis && <em>{titleEmphasis}</em>}
              </h2>
            )}
            <div className={styles.html} dangerouslySetInnerHTML={{ __html: DESCRIPTION_HTML }} />
          </article>
          {specs.length > 0 && (
            <div className={styles.specs} data-role="pd-specs">
              {specsLabel && <span className={styles.eyebrow}>{specsLabel}</span>}
              <dl className={styles.list}>
                {specs.map(s => (
                  <div key={s.name} className={styles.row}>
                    <dt>{s.name}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductDescription09.conteudoPadrao = MOCK;

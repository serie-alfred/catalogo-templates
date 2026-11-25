import React from 'react';

import styles from './index.module.css';
import { FONTES_12 } from '@/components/templates/common/template_12/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

/**
 * Espelha `molecules/ProductDescription12` do faststore.starter (família 12, Suave; desenho
 * `ProductDescription12`): "Sobre o produto" com o texto ao lado; os ativos em cartões pastel;
 * "Como usar" em passos numerados e "Resultados" em quadros, cada um num cartão branco
 * arredondado. Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Conteúdo = o `mock.ts` de lá (títulos + produto de exemplo), já resolvido como o starter
 * resolve: as especificações viram ativos ("Título: texto"), passos e resultados. Sai o `usePDP`.
 *
 * Só os quatro títulos são do CMS (`useConteudoDaSecao`). Os nomes de especificação
 * (`activesSpecName`…) dizem de qual spec do produto sai cada bloco: o produto aqui é o de
 * exemplo, então ficam fora do tipo.
 */

interface ProductDescription12Conteudo {
  title?: string;
  activesTitle?: string;
  howToTitle?: string;
  resultsTitle?: string;
}

const MOCK: ProductDescription12Conteudo = {
  title: 'Sobre o produto',
  activesTitle: 'Ativos em destaque',
  howToTitle: 'Como usar',
  resultsTitle: 'Resultados',
};

const DESCRIPTION_HTML =
  '<p>[Descrição do produto cadastrada na plataforma. Sérum leve, de absorção rápida, com vitamina C estabilizada a 10% para uso diário.]</p>' +
  '<p>[Segundo parágrafo da descrição: textura, fragrância e para quem é indicado.]</p>';

const ACTIVES = [
  'Vitamina C 10%: Antioxidante que ilumina e ajuda a uniformizar o tom da pele.',
  'Ácido hialurônico: Atrai e retém água, deixando a pele hidratada e com viço.',
  'Niacinamida: Ajuda a controlar a oleosidade e a refinar a aparência dos poros.',
];
const STEPS = [
  'Lave o rosto e seque com toques leves.',
  'Aplique de 4 a 5 gotas e espalhe pelo rosto e pescoço.',
  'Finalize com hidratante e protetor solar.',
];
const RESULTS = [
  '[00]%: [resultado do teste]',
  '[00]%: [resultado do teste]',
  '[00]%: [resultado do teste]',
];
const NOTE =
  '[Metodologia: número de participantes, período e tipo de avaliação]';

// Os três tons dos cartões de ativos, na ordem do desenho.
const TONS = ['toneRose', 'toneLilac', 'toneSage'];

/** "Título: texto" → { title, text }; sem ":" fica só o título. */
const split = (line: string) => {
  const i = line.indexOf(':');
  return i > 0
    ? { title: line.slice(0, i).trim(), text: line.slice(i + 1).trim() }
    : { title: line.trim(), text: '' };
};

export default function ProductDescription12() {
  const { title, activesTitle, howToTitle, resultsTitle } =
    useConteudoDaSecao(MOCK);
  const actives = ACTIVES.map(split);
  const results = RESULTS.map(split);

  return (
    <div className={styles.productDescription12Box}>
      <section
        className={styles.productDescription12}
        aria-label={title || 'Sobre o produto'}
        data-role="pd-root"
      >
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.inner}>
          <div className={styles.intro} data-role="pd-intro">
            {title && <h2 className={styles.title}>{title}</h2>}
            <div
              className={styles.html}
              dangerouslySetInnerHTML={{ __html: DESCRIPTION_HTML }}
            />
          </div>

          {activesTitle && (
            <h3 className={styles.sectionTitle}>{activesTitle}</h3>
          )}
          <div className={styles.cards} data-role="pd-actives">
            {actives.map((a, i) => (
              <article
                key={`${a.title}-${i}`}
                className={`${styles.card} ${styles[TONS[i % TONS.length]]}`}
              >
                <h4 className={styles.cardTitle}>{a.title}</h4>
                {a.text && <p className={styles.cardText}>{a.text}</p>}
              </article>
            ))}
          </div>

          <div className={styles.boxes}>
            <div className={styles.box} data-role="pd-howto">
              {howToTitle && <h3 className={styles.boxTitle}>{howToTitle}</h3>}
              <ol className={styles.steps}>
                {STEPS.map((s, i) => (
                  <li key={`${s}-${i}`} className={styles.step}>
                    <span className={styles.stepNum} aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className={styles.stepText}>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.box} data-role="pd-results">
              {resultsTitle && (
                <h3 className={styles.boxTitle}>{resultsTitle}</h3>
              )}
              <ul className={styles.results}>
                {results.map((r, i) => (
                  <li key={`${r.title}-${i}`} className={styles.result}>
                    <span className={styles.resultValue}>{r.title}</span>
                    {r.text && (
                      <span className={styles.resultText}>{r.text}</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className={styles.note}>{NOTE}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductDescription12.conteudoPadrao = MOCK;

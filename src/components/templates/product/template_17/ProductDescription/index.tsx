import React from 'react';

import { FONTES_17 } from '@/components/templates/common/template_17/Spot';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';

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
 *
 * Os rótulos e o `hiddenSpecs` são do CMS e vêm do `useConteudoDaSecao`. Ficam fora do tipo
 * `featuresSpecName` e `imageSpecName`: dizem QUAL especificação do produto vira os destaques e a
 * imagem, e o exemplo já vem resolvido.
 */
interface ProductDescription17Conteudo {
  title?: string;
  specsTitle?: string;
  /** Especificações a esconder, separadas por vírgula ("Composição, Níveis de garantia"). */
  hiddenSpecs?: string;
}

const MOCK: ProductDescription17Conteudo = {
  title: 'Sobre o produto',
  specsTitle: 'Especificações',
  hiddenSpecs: 'Composição, Níveis de garantia',
};

const NOME = 'Ração Premium Cães Adultos Frango e Arroz 15 kg';
const DESCRICAO =
  'Alimento completo e balanceado para cães adultos, feito com ingredientes selecionados e sem corantes artificiais. Croquete de tamanho médio, pensado para mastigação fácil.';
const FEATURES = [
  {
    title: 'Proteína de verdade',
    text: 'Frango como primeiro ingrediente, para músculos fortes e muita disposição nos passeios.',
  },
  {
    title: 'Digestão leve',
    text: 'Arroz e fibras selecionadas que ajudam a formar fezes firmes e com menos odor.',
  },
  {
    title: 'Pele e pelagem',
    text: 'Ômegas 3 e 6 na medida para uma pelagem macia e brilhante.',
  },
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

/** Como o starter compara nomes: sem acento, sem caixa, sem espaço nas pontas. */
const norm = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

export default function ProductDescription17() {
  const { title, specsTitle, hiddenSpecs } = useConteudoDaSecao(MOCK);
  const escondidas = new Set(
    String(hiddenSpecs ?? '')
      .split(',')
      .map(norm)
      .filter(Boolean)
  );
  // O 1º produto da loja (o mesmo da PDP), quando o CS cadastrou; senão o produto de exemplo.
  const produto = useProdutosDaLoja()?.[0];
  // Texto do CS, nunca HTML: o /p é público. Linha em branco separa parágrafos.
  const paragrafos = produto?.description.split(/\n\s*\n/).filter(p => p.trim()) ?? [];
  // Os destaques do exemplo não são do cliente: com produto, só a descrição, a ficha e a foto.
  const features = produto ? [] : FEATURES;
  const specs = (produto ? produto.specs : SPECS).filter(s => !escondidas.has(norm(s.name)));

  return (
    <div className={styles.productDescription17Box}>
      <section
        className={styles.productDescription17}
        aria-label={title || 'Descrição'}
        data-role="pd-root"
      >
        <link rel="stylesheet" href={FONTES_17} />
        <div className={styles.inner}>
          <div className={styles.head} data-role="pd-head">
            {title && <h2 className={styles.title}>{title}</h2>}
            <div className={styles.intro} data-role="pd-description">
              {produto
                ? paragrafos.map((p, i) => (
                    <p key={i} style={{ whiteSpace: 'pre-line' }}>
                      {p.trim()}
                    </p>
                  ))
                : <p>{DESCRICAO}</p>}
            </div>
          </div>

          {features.length > 0 && (
          <div className={styles.cards} data-role="pd-features">
            {features.map((f, i) => (
              <article key={f.title} className={styles.card}>
                <span className={styles.cardNum} aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardText}>{f.text}</p>
              </article>
            ))}
          </div>
          )}

          <div className={styles.bottom}>
            {specs.length > 0 && (
              <div className={styles.specsBox}>
                {specsTitle && (
                  <h3 className={styles.specsTitle}>{specsTitle}</h3>
                )}
                <dl className={styles.specs} data-role="pd-specs">
                  {specs.map(s => (
                    <div key={s.name} className={styles.spec}>
                      <dt>{s.name}</dt>
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            <figure className={styles.figure} data-role="pd-image">
              <img
                src={produto ? (produto.images[1] ?? produto.images[0] ?? IMAGEM) : IMAGEM}
                alt={`${title || 'Descrição'} — ${produto ? produto.name : NOME}`}
                width={1200}
                height={600}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductDescription17.conteudoPadrao = MOCK;

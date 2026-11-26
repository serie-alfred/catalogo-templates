import React from 'react';

import styles from './index.module.css';
import { FONTES_14 } from '@/components/templates/common/template_14/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';

/**
 * Espelha `molecules/ProductDescription14` do faststore.starter (família 14, Esportiva; desenho
 * `ProductDescription14`): na superfície clara, o título em Saira itálica com a descrição
 * embaixo; as tecnologias em três colunas numeradas ("01" em vermelho, filete grosso em cima);
 * "Especificações" em linhas entre filetes e a imagem da descrição ao lado. Mesmo markup,
 * classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Os campos do schema (título com `{produto}`, nomes das especificações, título da ficha,
 * `hiddenSpecs`) são do CMS e vêm do `useConteudoDaSecao`. A descrição e as especificações são
 * do produto: até o produto em destaque da loja existir (fase de produtos), o produto de
 * exemplo do `mock.ts` de lá, resolvido como o starter resolve: a especificação das tecnologias
 * vira as colunas ("Título: texto"), a da imagem vira a figura (o bloco em data URI do mock) e
 * as demais viram a ficha, menos as escondidas no CMS e a tabela de medidas. Sai o `usePDP`.
 */

interface ProductDescription14Conteudo {
  /** `{produto}` vira o nome do produto. */
  title?: string;
  featuresSpecName?: string;
  specsTitle?: string;
  imageSpecName?: string;
  /** Especificações a esconder, separadas por vírgula ("Detalhes, Destaques"). */
  hiddenSpecs?: string;
}

const MOCK: ProductDescription14Conteudo = {
  title: 'Por dentro do {produto}',
  featuresSpecName: 'Tecnologia',
  specsTitle: 'Especificações',
  imageSpecName: 'Imagem da descrição',
  hiddenSpecs: 'Detalhes, Destaques',
};

const PRODUCT_NAME = 'Velox Run 3';
const DESCRIPTION_HTML =
  '<p>Desenvolvido para treinos longos e provas de rua, o Velox Run 3 combina leveza e estabilidade. A nova espuma deixa a passada mais macia sem perder resposta, e o cabedal mais justo segura o pé nas curvas.</p>';
const IMAGE_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"><rect width="1200" height="600" fill="#D5DAE0"/></svg>'
)}`;
/** As especificações do produto de exemplo (o `properties` do mock de lá). */
const PROPERTIES: { name: string; values: string[] }[] = [
  {
    name: 'Tecnologia',
    values: [
      'Amortecimento: Espuma de alta resposta na entressola devolve energia a cada passada, do primeiro ao último quilômetro.',
      'Cabedal respirável: Mesh técnico com ventilação lateral e detalhes refletivos para treinos no começo da manhã.',
      'Tração no molhado: Solado de borracha com desenho em gomos que segura no asfalto molhado e resiste ao desgaste.',
    ],
  },
  { name: 'Indicação', values: ['Asfalto e esteira'] },
  { name: 'Pisada', values: ['Neutra'] },
  { name: 'Peso', values: ['248 g no tamanho 41'] },
  { name: 'Drop', values: ['8 mm'] },
  { name: 'Cabedal', values: ['Mesh técnico'] },
  { name: 'Solado', values: ['Borracha'] },
  { name: 'Imagem da descrição', values: [IMAGE_URL] },
  { name: 'Detalhes', values: ['Cabedal em mesh técnico respirável com reforço no calcanhar'] },
  { name: 'Destaques', values: ['248 g: peso no tamanho 41'] },
  { name: 'Tabela de medidas', values: ['BR: 38 | 39 | 40'] },
];

const GUIDE_RE = /guia\s*de\s*medidas|tabela\s*de\s*medidas|size\s*guide/i;

/** Como o starter compara nomes: sem acento, sem caixa, sem espaço nas pontas. */
const norm = (s: string) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();

const two = (n: number) => String(n).padStart(2, '0');

/** "Título: texto" → { title, text }; sem ":" fica só o título. */
const split = (line: string) => {
  const i = line.indexOf(':');
  return i > 0 ? { title: line.slice(0, i).trim(), text: line.slice(i + 1).trim() } : { title: line.trim(), text: '' };
};

export default function ProductDescription14() {
  const { title, featuresSpecName, specsTitle, imageSpecName, hiddenSpecs } = useConteudoDaSecao(MOCK);
  // O 1º produto da loja (o mesmo da PDP), quando o CS cadastrou; senão o produto de exemplo.
  const produto = useProdutosDaLoja()?.[0];
  const properties = produto ? produto.specs.map(s => ({ name: s.name, values: [s.value] })) : PROPERTIES;
  const nome = produto ? produto.name : PRODUCT_NAME;
  // Texto do CS, nunca HTML: o /p é público. Linha em branco separa parágrafos.
  const paragrafos = produto?.description.split(/\n\s*\n/).filter(p => p.trim()) ?? [];

  const heading = String(title ?? '')
    .replace(/\{produto\}/gi, nome)
    .trim();
  const featuresKey = norm(featuresSpecName ?? '');
  const imageKey = norm(imageSpecName ?? '');
  const hidden = new Set(
    String(hiddenSpecs ?? '')
      .split(',')
      .map(norm)
      .filter(Boolean)
  );
  const valuesOf = (key: string): string[] =>
    key
      ? (properties.find(p => norm(p.name) === key)?.values ?? [])
          .flatMap(v => String(v ?? '').split(/\r?\n/))
          .map(v => v.trim())
          .filter(Boolean)
      : [];

  const features = valuesOf(featuresKey).map(split);
  // Só URL ou data URI: o arquivo do /arquivos depende do domínio da loja, que o catálogo não tem.
  const imagem = valuesOf(imageKey)[0] ?? '';
  const imageUrl = /^(https?:|data:)/i.test(imagem) ? imagem : '';
  const specs = properties.filter(
    p => !GUIDE_RE.test(p.name) && norm(p.name) !== featuresKey && norm(p.name) !== imageKey && !hidden.has(norm(p.name))
  )
    .map(p => ({ name: p.name, value: p.values.filter(Boolean).join(', ') }))
    .filter(p => p.value);

  return (
    <div className={styles.productDescription14Box}>
      <section className={styles.productDescription14} aria-label={heading || 'Descrição do produto'} data-role="pd-root">
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.inner}>
          <div className={styles.head} data-role="pd-head">
            {heading && <h2 className={styles.title}>{heading}</h2>}
            {produto ? (
              paragrafos.length > 0 && (
                <div className={styles.intro} data-role="pd-description">
                  {paragrafos.map((p, i) => (
                    <p key={i} style={{ whiteSpace: 'pre-line' }}>
                      {p.trim()}
                    </p>
                  ))}
                </div>
              )
            ) : (
              <div className={styles.intro} data-role="pd-description" dangerouslySetInnerHTML={{ __html: DESCRIPTION_HTML }} />
            )}
          </div>

          {features.length > 0 && (
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
          )}

          {(specs.length > 0 || imageUrl) && (
            <div className={`${styles.bottom}${imageUrl ? '' : ` ${styles.bottomSolo}`}`}>
              {specs.length > 0 && (
                <div className={styles.specsBox} data-role="pd-specs">
                  {specsTitle && <h3 className={styles.specsTitle}>{specsTitle}</h3>}
                  <dl className={styles.specs}>
                    {specs.map(s => (
                      <div key={s.name} className={styles.spec}>
                        <dt>{s.name}</dt>
                        <dd>{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
              {imageUrl && (
                <figure className={styles.figure} data-role="pd-image">
                  <img src={imageUrl} alt={heading} width={1200} height={600} loading="lazy" decoding="async" />
                </figure>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductDescription14.conteudoPadrao = MOCK;

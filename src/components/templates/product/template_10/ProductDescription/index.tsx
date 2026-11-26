'use client';

import React, { useId, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductDescription10` do faststore.starter (família 10, Varejo;
 * desenho `ProductDescription10`): cartão com abas (Descrição · Especificações
 * técnicas · Garantia), "O que vem na caixa" e o quadro de aviso ao lado. Mesmo
 * markup, classes e `data-role`; o CSS é derivado do SCSS de lá. Conteúdo = o
 * `mock.ts` de lá (rótulos + produto de exemplo), já resolvido como o starter
 * resolve: a marca na 1ª linha da ficha e a especificação "O que vem na caixa" fora
 * dela, na caixa ao lado. Sai o `usePDP`.
 *
 * Os rótulos, os textos dos quadros, a aba inicial e o `hiddenSpecs` são do CMS e vêm
 * do `useConteudoDaSecao`. Descrição, marca e especificações são do produto: até o
 * produto em destaque da loja existir (fase de produtos), o produto de exemplo do
 * `mock.ts` de lá.
 */

type Tab = 'description' | 'specs' | 'extra';

/** O conteúdo da seção: os campos do `section.schema` do ProductDescription10. */
interface ProductDescription10Conteudo {
  descriptionTabLabel?: string;
  specsTabLabel?: string;
  extraTabLabel?: string;
  extraTabText?: string;
  /** `description`, `specs` ou `extra`; a aba que não existe cai na primeira. */
  initialTab?: string;
  specsTitle?: string;
  /** Rótulo da linha da marca na ficha (vazio = sem a linha). */
  brandLabel?: string;
  /** Especificações a esconder da ficha, separadas por vírgula. */
  hiddenSpecs?: string;
  boxTitle?: string;
  /** Nome da especificação do produto com os itens da caixa. */
  boxSpecName?: string;
  infoTitle?: string;
  infoText?: string;
}

const MOCK: ProductDescription10Conteudo = {
  descriptionTabLabel: 'Descrição',
  specsTabLabel: 'Especificações técnicas',
  extraTabLabel: 'Garantia',
  extraTabText:
    '12 meses de garantia pelo fabricante, contados a partir da data da nota fiscal.',
  initialTab: 'specs',
  specsTitle: 'Ficha técnica',
  brandLabel: 'Marca',
  hiddenSpecs: '',
  boxTitle: 'O que vem na caixa',
  boxSpecName: 'O que vem na caixa',
  infoTitle: 'Garantia',
  infoText: '12 meses pelo fabricante.',
};

/** Produto de exemplo (o `mock.ts` de lá): marca, descrição e propriedades. */
const PRODUTO = {
  brand: '[Marca 01]',
  description:
    '<p>Smartphone X5 com tela AMOLED de 6,7", processador octa-core e 8 GB de RAM. A bateria de 5.000 mAh segura o dia inteiro, e a câmera tripla de 50 MP registra bem até com pouca luz.</p>' +
    '<p>Conexão 5G, Wi-Fi, Bluetooth 5.3 e NFC para pagar por aproximação.</p>',
  properties: [
    { name: 'Modelo', values: ['X5'] },
    { name: 'Tela', values: ['6,7" AMOLED'] },
    { name: 'Resolução', values: ['2400 × 1080'] },
    { name: 'Processador', values: ['Octa-core'] },
    { name: 'Memória RAM', values: ['8 GB'] },
    { name: 'Armazenamento', values: ['128 GB'] },
    { name: 'Câmera traseira', values: ['50 MP + 8 MP + 2 MP'] },
    { name: 'Bateria', values: ['5.000 mAh'] },
    { name: 'Conectividade', values: ['5G, Wi-Fi, Bluetooth 5.3, NFC'] },
    { name: 'Dimensões', values: ['16,4 × 7,6 × 0,8 cm'] },
    { name: 'Peso', values: ['190 g'] },
    {
      name: 'O que vem na caixa',
      values: [
        'Smartphone X5',
        'Cabo USB-C',
        'Ferramenta para chip',
        'Guia rápido',
      ],
    },
  ],
};

// A imagem do guia de medidas é da compra (ProductDetails10), não da ficha.
const GUIDE_RE = /guia\s*de\s*medidas|tabela\s*de\s*medidas|size\s*guide/i;
/** Como o starter compara nomes: sem acento, sem caixa, sem espaço nas pontas. */
const norm = (s: string | undefined) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export default function ProductDescription10() {
  const {
    descriptionTabLabel,
    specsTabLabel,
    extraTabLabel,
    extraTabText,
    initialTab,
    specsTitle,
    brandLabel,
    hiddenSpecs,
    boxTitle,
    boxSpecName,
    infoTitle,
    infoText,
  } = useConteudoDaSecao(MOCK);
  const uid = useId();
  const daLoja = useProdutosDaLoja()?.[0];
  // O 1º produto da loja (o da PDP) ou o de exemplo; a ficha é a lista de especificações.
  const dados = daLoja
    ? {
        brand: daLoja.brand,
        description: '',
        properties: daLoja.specs.map(s => ({ name: s.name, values: [s.value] })),
      }
    : PRODUTO;
  // Texto do CS, nunca HTML: o /p é público. Linha em branco separa parágrafos.
  const paragrafos = daLoja?.description.split(/\n\s*\n/).filter(p => p.trim()) ?? [];

  const descriptionHtml = daLoja
    ? paragrafos.join('\n')
    : PRODUTO.description.trim();
  const hidden = new Set(
    String(hiddenSpecs ?? '')
      .split(',')
      .map(norm)
      .filter(Boolean)
  );
  const boxKey = norm(boxSpecName);
  const boxProp = boxKey
    ? dados.properties.find(p => norm(p.name) === boxKey)
    : undefined;
  const boxItems = (boxProp?.values ?? [])
    .flatMap(v => String(v ?? '').split(/\r?\n/))
    .map(v => v.trim())
    .filter(Boolean);

  const specs: Array<{ name: string; value: string }> = dados.properties
    .filter(
      p =>
        p.name &&
        !GUIDE_RE.test(p.name) &&
        norm(p.name) !== boxKey &&
        !hidden.has(norm(p.name))
    )
    .map(p => ({ name: p.name, value: p.values.filter(Boolean).join(', ') }))
    .filter(p => p.value);
  if (
    brandLabel &&
    dados.brand &&
    !specs.some(s => norm(s.name) === norm(brandLabel))
  )
    specs.unshift({ name: brandLabel, value: dados.brand });

  const tabs: Array<{ id: Tab; label: string }> = [
    ...(descriptionHtml && descriptionTabLabel
      ? [{ id: 'description' as Tab, label: descriptionTabLabel }]
      : []),
    ...(specs.length && specsTabLabel
      ? [{ id: 'specs' as Tab, label: specsTabLabel }]
      : []),
    ...(extraTabLabel && extraTabText
      ? [{ id: 'extra' as Tab, label: extraTabLabel }]
      : []),
  ];
  const [chosen, setChosen] = useState<Tab | null>(null);
  const current: Tab | undefined =
    tabs.find(t => t.id === (chosen ?? initialTab))?.id ?? tabs[0]?.id;

  if (!descriptionHtml && !specs.length) return null;

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next =
      tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    setChosen(next.id);
    (e.currentTarget.ownerDocument ?? document)
      .getElementById(`${uid}-tab-${next.id}`)
      ?.focus();
  };

  return (
    <div className={styles.productDescription10Box}>
      <section
        className={styles.productDescription10}
        aria-label={descriptionTabLabel || 'Detalhes do produto'}
        data-role="pd-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <div className={styles.card}>
            <div
              className={styles.tabs}
              role="tablist"
              aria-label="Informações do produto"
              data-role="pd-tabs"
            >
              {tabs.map((t, i) => (
                <button
                  key={t.id}
                  id={`${uid}-tab-${t.id}`}
                  type="button"
                  role="tab"
                  className={`${styles.tab}${t.id === current ? ` ${styles.tabOn}` : ''}`}
                  aria-selected={t.id === current}
                  aria-controls={`${uid}-panel`}
                  tabIndex={t.id === current ? 0 : -1}
                  onClick={() => setChosen(t.id)}
                  onKeyDown={e => onKey(e, i)}
                  data-role="pd-tab"
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className={styles.body}>
              <div
                id={`${uid}-panel`}
                className={styles.main}
                role="tabpanel"
                aria-labelledby={current ? `${uid}-tab-${current}` : undefined}
                data-role="pd-panel"
              >
                {current === 'description' &&
                  (daLoja ? (
                    <div className={styles.html}>
                      {paragrafos.map((p, i) => (
                        <p key={i} style={{ whiteSpace: 'pre-line' }}>
                          {p.trim()}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={styles.html}
                      dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                    />
                  ))}
                {current === 'specs' && (
                  <>
                    {specsTitle && (
                      <h3 className={styles.panelTitle}>{specsTitle}</h3>
                    )}
                    <dl className={styles.specs} data-role="pd-specs">
                      {specs.map(s => (
                        <div key={s.name} className={styles.row}>
                          <dt>{s.name}</dt>
                          <dd>{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}
                {current === 'extra' && (
                  <p className={styles.extra}>{extraTabText}</p>
                )}
              </div>

              {(boxItems.length > 0 || infoTitle || infoText) && (
                <aside className={styles.aside}>
                  {boxItems.length > 0 && (
                    <div className={styles.box} data-role="pd-box">
                      {boxTitle && (
                        <h3 className={styles.boxTitle}>{boxTitle}</h3>
                      )}
                      <ul className={styles.boxList}>
                        {boxItems.map((item, i) => (
                          <li key={`${item}-${i}`}>
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.4"
                              aria-hidden="true"
                            >
                              <path d="m5 12 5 5 9-10" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {(infoTitle || infoText) && (
                    <div className={styles.info} data-role="pd-info">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        aria-hidden="true"
                      >
                        <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3z" />
                        <path d="m9 12 2 2 4-4" />
                      </svg>
                      <div className={styles.infoCopy}>
                        {infoTitle && (
                          <strong className={styles.infoTitle}>
                            {infoTitle}
                          </strong>
                        )}
                        {infoText && (
                          <span className={styles.infoText}>{infoText}</span>
                        )}
                      </div>
                    </div>
                  )}
                </aside>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductDescription10.conteudoPadrao = MOCK;

'use client';

import React, { useState } from 'react';

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { useProdutosDaLoja } from '@/hooks/useProdutosDaLoja';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductDescription07` do faststore.starter — a descrição da PDP 07,
 * que era um bloco do ProductInfo07 e virou peça própria (como o ProductDescription01).
 * Desktop: "Sobre o produto" (título + parágrafos) e, ao lado, as especificações, o
 * cartão de cuidados e o FAQ. Mobile: o acordeão de 3 blocos. As duas árvores trocam por
 * CSS aos 960px.
 *
 * O que sai: `usePDP` — a descrição e a ficha abaixo são as do `mock.ts` da origem.
 * `useState` fica para o FAQ e o acordeão, que é o que faz o preview parecer vivo.
 *
 * Conteúdo: só os rótulos, o título e o FAQ vêm do CMS (`useConteudoDaSecao`, campos
 * do schema do ProductDescription07); os parágrafos, a ficha e o texto de cuidados são
 * do produto de exemplo e ficam aqui.
 */
interface ProductDescription07Conteudo {
  descEyebrow?: string;
  descTitle?: string;
  specsEyebrow?: string;
  careTitle?: string;
  faqTitle?: string;
  faqItems: { q?: string; a?: string }[];
  deliveryInfo?: string;
}

const DESCRICAO = {
  paragrafos: [
    'Com superfície levemente aveludada e toque surpreendentemente suave, o Tapete Belga Essence Clássico é confeccionado com 70% de poliéster e 30% de algodão — uma composição pensada para durabilidade sem abrir mão do conforto.',
    'Seus arabescos florais, bordas contrastantes e acabamento com franjas elegantes criam um ponto de destaque em qualquer composição, sem perder a sofisticação que um ambiente bem decorado exige.',
    'Ideal para posicionar embaixo de mesa de centro, com sofá neutro ou em quarto com composição clássica — em ambientes com madeira, tons claros e decoração atemporal.',
  ],
};

const ESPECIFICACOES = {
  cards: [
    { label: 'Composição', value: '70% Poliéster · 30% Algodão' },
    { label: 'Dimensões', value: '2,00m × 2,50m' },
    { label: 'Perfil', value: 'Baixo perfil · 6mm' },
    { label: 'Embalagem', value: '1 tapete enrolado' },
  ],
  cuidadosTexto:
    'Lavar à mão ou em máquina com programa delicado. Não usar alvejante. Secar à sombra. Não usar secadora.',
};

const MOCK: ProductDescription07Conteudo = {
  descEyebrow: 'Sobre o produto',
  descTitle: 'Elegância clássica para sala ou quarto',
  specsEyebrow: 'Especificações',
  careTitle: 'Cuidados e lavagem',
  faqTitle: 'Dúvidas frequentes',
  faqItems: [
    {
      q: 'Como escolher o tamanho certo?',
      a: 'Meça o espaço e deixe o tapete ultrapassar o sofá em pelo menos 20 cm de cada lado. Para salas de 20m² ou mais, o 2,00m × 2,50m é o padrão.',
    },
    {
      q: 'O tapete tem antiderrapante?',
      a: 'A base tem acabamento de baixo perfil. Para pisos muito lisos, recomendamos usar uma manta antiderrapante por baixo (vendida separadamente).',
    },
    {
      q: 'Qual o prazo de entrega?',
      a: 'Enviamos para todo o Brasil. O prazo estimado aparece no carrinho após informar seu CEP, variando conforme a região.',
    },
  ],
  deliveryInfo:
    'Enviamos para todo o Brasil com rastreio. O prazo e o valor do frete aparecem no carrinho após você informar o CEP. Trocas em até 7 dias corridos após o recebimento.',
};

export default function ProductDescription07() {
  const {
    descEyebrow,
    descTitle,
    specsEyebrow,
    careTitle,
    faqTitle,
    faqItems,
    deliveryInfo,
  } = useConteudoDaSecao(MOCK);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openAcc, setOpenAcc] = useState<number | null>(null);

  // A descrição e a ficha são do 1º produto da loja (o mesmo da PDP) quando o CS cadastrou,
  // em texto puro (o /p é público); senão as do produto de exemplo. O texto de cuidados é do
  // exemplo: o cadastro não o tem, e some junto.
  const produto = useProdutosDaLoja()?.[0];
  const paragrafos = produto
    ? produto.description.split(/\n\s*\n/).filter(p => p.trim())
    : DESCRICAO.paragrafos;
  const cards = produto
    ? produto.specs.map(s => ({ label: s.name, value: s.value }))
    : ESPECIFICACOES.cards;

  // a descrição vai como PARÁGRAFOS (na origem, o HTML da API num <div>); os outros dois
  // itens seguem texto com `\n`, num <p> com `pre-line`
  const acordeaoMobile: Array<{ title: string; body?: string; paragrafos?: string[] }> = [
    { title: 'Descrição do produto', paragrafos },
    {
      title: 'Composição e especificações',
      body: [
        ...cards.map(s => `${s.label}: ${s.value}`),
        ...(produto ? [] : [`${careTitle}: ${ESPECIFICACOES.cuidadosTexto}`]),
      ].join('\n'),
    },
    { title: 'Entrega e prazo', body: deliveryInfo },
  ];

  const alternar = (
    set: React.Dispatch<React.SetStateAction<number | null>>,
    i: number
  ) => set(prev => (prev === i ? null : i));

  const porTecla = (e: React.KeyboardEvent, fn: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fn();
    }
  };

  return (
    /* envelope só do catálogo: carrega o container-type das @container */
    <div className={styles.productDescription07Box}>
      <div className={styles.productDescription07}>
        {/* ═══════════════ DESKTOP ═══════════════ */}
        <div className={styles.desktop}>
          <div className={styles.description} data-role="description">
            <div className={styles.descCol} data-role="desc-col">
              {descEyebrow && (
                <p className={styles.sectionEyebrow}>{descEyebrow}</p>
              )}
              {descTitle && (
                <h2 className={styles.descTitle} data-role="desc-title">
                  {descTitle}
                </h2>
              )}
              {/* UM `desc-p` com os parágrafos dentro, como na origem: lá a descrição é o
                  HTML que a API entrega, injetado num bloco só. Os 16px entre eles vêm de
                  `.descP p + p`, declarado igual aqui e no starter. */}
              <div className={styles.descP} data-role="desc-p">
                {paragrafos.map((p, i) => (
                  <p key={i} style={produto ? { whiteSpace: 'pre-line' } : undefined}>
                    {produto ? p.trim() : p}
                  </p>
                ))}
              </div>
            </div>
            <div className={styles.specsCol} data-role="specs-col">
              {specsEyebrow && (
                <p className={styles.sectionEyebrow}>{specsEyebrow}</p>
              )}
              <div className={styles.specsGrid} data-role="specs-grid">
                {cards.map((s, i) => (
                  <div key={i} className={styles.specCard} data-role="spec-card">
                    <p className={styles.specLabel}>{s.label}</p>
                    <p className={styles.specValue}>{s.value}</p>
                  </div>
                ))}
              </div>
              {!produto && (
                <div className={styles.care} data-role="care">
                  {careTitle && <p className={styles.specLabel}>{careTitle}</p>}
                  <p className={styles.careText}>{ESPECIFICACOES.cuidadosTexto}</p>
                </div>
              )}
              <div className={styles.faq} data-role="faq">
                {faqTitle && (
                  <p className={styles.sectionEyebrow}>{faqTitle}</p>
                )}
                {faqItems.map((f, i) => (
                  <div
                    key={i}
                    className={`${styles.faqItem} ${i === faqItems.length - 1 ? styles.faqItemLast : ''}`}
                    data-role="faq-item"
                  >
                    <div
                      className={styles.faqHead}
                      role="button"
                      tabIndex={0}
                      onClick={() => alternar(setOpenFaq, i)}
                      onKeyDown={e => porTecla(e, () => alternar(setOpenFaq, i))}
                      aria-expanded={openFaq === i}
                      aria-controls={`pdp07-faq-panel-${i}`}
                    >
                      <p className={styles.faqQ}>{f.q}</p>
                      <span className={styles.faqToggle}>{openFaq === i ? '−' : '+'}</span>
                    </div>
                    {openFaq === i && (
                      <p id={`pdp07-faq-panel-${i}`} className={styles.faqA} role="region">
                        {f.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ MOBILE ═══════════════ */}
        <div className={styles.mobile}>
          <div className={styles.mAccordion} data-role="m-accordion">
            {acordeaoMobile.map((a, i) => (
              <div
                key={i}
                className={`${styles.mAccItem} ${i === acordeaoMobile.length - 1 ? styles.mAccItemLast : ''}`}
                data-role="m-acc-item"
              >
                <div
                  className={styles.mAccHead}
                  role="button"
                  tabIndex={0}
                  onClick={() => alternar(setOpenAcc, i)}
                  onKeyDown={e => porTecla(e, () => alternar(setOpenAcc, i))}
                  aria-expanded={openAcc === i}
                  aria-controls={`pdp07-acc-panel-${i}`}
                >
                  <p className={styles.mAccQ}>{a.title}</p>
                  <span className={styles.mAccToggle}>{openAcc === i ? '−' : '+'}</span>
                </div>
                {openAcc === i && a.paragrafos && (
                  <div id={`pdp07-acc-panel-${i}`} className={styles.mAccBody} role="region">
                    {a.paragrafos.map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                )}
                {openAcc === i && !a.paragrafos && a.body && (
                  <p id={`pdp07-acc-panel-${i}`} className={styles.mAccBody} role="region">
                    {a.body}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
ProductDescription07.conteudoPadrao = MOCK;

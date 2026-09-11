'use client';

import React, { useMemo, useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/CategorySeoFaq06` do faststore.starter — o bloco editorial
 * do rodapé da PLP 06: texto de SEO com corte "saiba mais" e o acordeão de
 * dúvidas frequentes.
 *
 * O que sai: o `getCategoryHtml` (o resolver de banners da busca da VTEX, que é
 * de onde o texto vem quando o CMS não manda HTML), o `usePathname` que resolve
 * a categoria e o tracking de view_promotion. O conteúdo aqui é o mesmo que o
 * palco de fidelidade injeta na origem.
 *
 * O corte é por BLOCO, não por altura: colapsado mostra só até o 2º parágrafo,
 * então nenhuma linha aparece pela metade — o resto só entra no DOM depois do
 * clique, igual à origem.
 */
const SEO_TITULO = 'Tênis casuais masculinos';

const SEO_HTML =
  '<p>Conforto e estilo para o dia a dia. Nossa linha de tênis casuais reúne modelos em couro legítimo, solado leve e palmilha anatômica — feitos no Brasil para durar.</p>' +
  '<p>Encontre o seu por tamanho, cor ou linha, com troca fácil em 30 dias e frete grátis nas compras acima de R$ 350.</p>' +
  '<p>Todos os modelos passam por controle de qualidade peça a peça, com costura reforçada e acabamento revisado à mão antes do envio.</p>';

const FAQ_TITULO = 'Perguntas frequentes';

const FAQ = [
  {
    q: 'Como escolher o tamanho certo?',
    a: 'Meça o pé no fim do dia, do calcanhar ao dedo mais longo, e compare com a tabela de medidas de cada produto.',
  },
  {
    q: 'Qual o prazo de entrega?',
    a: 'De 2 a 7 dias úteis para as capitais e de 5 a 12 dias úteis para as demais regiões, após a confirmação do pagamento.',
  },
  {
    q: 'Posso trocar se não servir?',
    a: 'Sim. A primeira troca é gratuita em até 30 dias, com o produto sem uso e na embalagem original.',
  },
];

const ROTULO_MAIS = 'saiba mais';
const ROTULO_MENOS = 'ver menos';

const Chevron = () => (
  <svg
    className={styles.chevron}
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M1 1L6 7L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CategoryDescription() {
  const [aberto, setAberto] = useState(false);
  const [faqAberto, setFaqAberto] = useState<number | null>(null);

  /* mesmo corte da origem: 2º <h2> se houver, senão o fim do 2º </p> */
  const previa = useMemo(() => {
    const minusculo = SEO_HTML.toLowerCase();
    const segundoH2 = minusculo.indexOf('<h2', minusculo.indexOf('<h2') + 1);
    if (segundoH2 > 0) return SEO_HTML.slice(0, segundoH2);
    const primeiroP = minusculo.indexOf('</p>');
    const segundoP = primeiroP >= 0 ? minusculo.indexOf('</p>', primeiroP + 4) : -1;
    if (segundoP > 0) return SEO_HTML.slice(0, segundoP + 4);
    return SEO_HTML;
  }, []);
  const temMais = previa.length < SEO_HTML.length;

  return (
    /* wrapper só do catálogo: carrega o container-type das @container */
    <div className={styles.seoFaqWrap}>
      <section className={styles.categorySeoFaq06} data-fs-category-seo-faq data-role="seo-faq">
        <div className={styles.seoBlock} data-role="seo-block">
          <div className={styles.seoWrapper}>
            <h2 className={styles.seoTitle} data-role="seo-title">{SEO_TITULO}</h2>
            <div
              className={styles.seoContent}
              data-role="seo-content"
              dangerouslySetInnerHTML={{ __html: aberto ? SEO_HTML : previa }}
            />
            {temMais && (
              <button
                type="button"
                className={styles.seoToggle}
                data-role="seo-toggle"
                aria-expanded={aberto}
                onClick={() => setAberto(v => !v)}
              >
                {aberto ? ROTULO_MENOS : ROTULO_MAIS}
              </button>
            )}
          </div>
        </div>

        <div className={styles.faqBlock} data-role="faq-block">
          <h3 className={styles.faqTitle} data-role="faq-title">{FAQ_TITULO}</h3>
          <div className={styles.faqList} data-role="faq-list">
            {FAQ.map((entrada, i) => {
              const isOpen = faqAberto === i;
              const qId = `cat-seo-faq-q-${i}`;
              const aId = `cat-seo-faq-a-${i}`;
              return (
                <div
                  key={i}
                  className={`${styles.faqItem}${isOpen ? ` ${styles.faqOpen}` : ''}`}
                  data-role="faq-item"
                >
                  <button
                    type="button"
                    id={qId}
                    className={styles.faqQuestion}
                    data-role="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={aId}
                    onClick={() => setFaqAberto(isOpen ? null : i)}
                  >
                    <span>{entrada.q}</span>
                    <Chevron />
                  </button>
                  <div
                    id={aId}
                    className={styles.faqAnswerWrap}
                    data-role="faq-answer"
                    role="region"
                    aria-labelledby={qId}
                  >
                    <p className={styles.faqAnswer}>{entrada.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

/**
 * Espelha `organisms/CategorySeoFaq10` do faststore.starter (família 10, Varejo;
 * desenho `CategoryDescription10`): perguntas frequentes em acordeão (duas colunas no
 * desktop) e o cartão de texto da categoria com "Ver mais". Mesmo markup, classes e
 * `data-role`; CSS derivado do SCSS.
 *
 * Lá o conteúdo vem, por categoria, dos banners HTML do Intelligent Search (áreas "one"
 * e "two"), lido pelo caminho da PLP; aqui é o mock de contexto de lá, no mesmo formato
 * HTML, passado pelos mesmos leitores (`separarTitulo`, `lerPerguntas`). Sem GraphQL e
 * sem o `view_promotion` (preview não emite evento).
 */
interface Pergunta {
  q: string;
  a: string;
}

/* ── rótulos (o mock.ts de lá) ── */
const FAQ_TITLE = 'Perguntas frequentes sobre {categoria}';
const ABOUT_TITLE = '{Categoria} com o melhor preço';
const READ_MORE = 'Ver mais';
const READ_LESS = 'Ver menos';

/* ── contexto de exemplo (o mock.ts de lá) ── */
const NOME = 'Smartphones';
const SOBRE_HTML =
  '<p>Na [Sua Marca] você encontra smartphones de diversas marcas, com opções 4G e 5G, diferentes tamanhos de tela e capacidades de armazenamento. Compare modelos, filtre por preço e memória e escolha a forma de pagamento que preferir. Todos os aparelhos têm nota fiscal e garantia do fabricante.</p>';
const FAQ_HTML =
  '<details><summary>Qual a diferença entre 4G e 5G?</summary><p>O 5G oferece velocidades maiores e menor latência onde há cobertura. Os celulares 5G também funcionam normalmente em redes 4G.</p></details>' +
  '<details><summary>Quanto de memória interna eu preciso?</summary><p>Para uso básico, 128 GB bastam. Se você grava muitos vídeos ou guarda jogos, prefira 256 GB ou mais.</p></details>' +
  '<details><summary>O smartphone vem com carregador?</summary><p>Depende do fabricante. O que vem na caixa está descrito na página de cada produto.</p></details>' +
  '<details><summary>Posso parcelar sem juros?</summary><p>Sim. As condições de parcelamento de cada produto aparecem na página dele e no carrinho.</p></details>' +
  '<details><summary>Como funciona a garantia?</summary><p>Todos os aparelhos têm a garantia do fabricante, com nota fiscal emitida na compra.</p></details>' +
  '<details><summary>Em quanto tempo o pedido chega?</summary><p>O prazo é calculado pelo CEP no carrinho, antes de você finalizar a compra.</p></details>';

const semTags = (html: string) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** `<h2>` inicial do HTML da área "one" vira título; o resto é o corpo. */
function separarTitulo(html: string): { titulo: string; corpo: string } {
  const m = /^\s*<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(html);
  if (!m) return { titulo: '', corpo: html.trim() };
  return { titulo: semTags(m[1]), corpo: html.slice(m[0].length).trim() };
}

/** FAQ da área "two" → pares pergunta/resposta (details/summary ou h3/h4 + texto). */
function lerPerguntas(html: string): Pergunta[] {
  const out: Pergunta[] = [];
  const details =
    /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
  let m: RegExpExecArray | null;
  while ((m = details.exec(html)))
    out.push({ q: semTags(m[1]), a: m[2].trim() });
  if (out.length) return out;
  const partes = html.split(/(<h[34][^>]*>[\s\S]*?<\/h[34]>)/i);
  for (let i = 1; i < partes.length; i += 2) {
    out.push({ q: semTags(partes[i]), a: (partes[i + 1] ?? '').trim() });
  }
  return out.filter(p => p.q);
}

const comCategoria = (tpl: string, nome: string) =>
  tpl
    .replace(/\{categoria\}/g, nome.toLocaleLowerCase('pt-BR'))
    .replace(/\{Categoria\}/g, nome);

const Sinal = ({ aberto }: { aberto: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    aria-hidden="true"
  >
    <path d={aberto ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
  </svg>
);

const Chevron = ({ up }: { up: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    aria-hidden="true"
  >
    <path d={up ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
  </svg>
);

export default function CategoryDescription10() {
  const nome = NOME;
  const { titulo, corpo } = useMemo(() => separarTitulo(SOBRE_HTML), []);
  const perguntas = useMemo(() => lerPerguntas(FAQ_HTML), []);
  const colunas = useMemo(() => {
    const meio = Math.ceil(perguntas.length / 2);
    return [
      perguntas.slice(0, meio).map((p, i) => ({ p, i })),
      perguntas.slice(meio).map((p, i) => ({ p, i: i + meio })),
    ];
  }, [perguntas]);

  const [aberto, setAberto] = useState(false);
  const [temMais, setTemMais] = useState(true);
  const [faqAberta, setFaqAberta] = useState<number | null>(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  // "Ver mais" só quando o texto recolhido esconde alguma coisa (medido no navegador).
  const textoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = textoRef.current;
    if (!el || aberto) return;
    const medir = () => setTemMais(el.scrollHeight > el.clientHeight + 1);
    medir();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [corpo, aberto]);

  const temSobre = !!semTags(corpo);
  const temFaq = perguntas.length > 0 || !!semTags(FAQ_HTML);
  const tituloSobre = titulo || comCategoria(ABOUT_TITLE, nome);

  const item = ({ p, i }: { p: Pergunta; i: number }) => {
    const on = faqAberta === i;
    return (
      <div
        key={i}
        className={`${styles.faqItem}${on ? ` ${styles.faqItemOpen}` : ''}`}
        data-role="cd-faq-item"
      >
        <h3 className={styles.faqHeading}>
          <button
            type="button"
            id={`${uid}-q${i}`}
            className={styles.question}
            aria-expanded={on}
            aria-controls={`${uid}-a${i}`}
            onClick={() => setFaqAberta(on ? null : i)}
            data-role="cd-question"
          >
            {p.q}
            <span className={styles.sign}>
              <Sinal aberto={on} />
            </span>
          </button>
        </h3>
        <div
          id={`${uid}-a${i}`}
          role="region"
          aria-labelledby={`${uid}-q${i}`}
          className={styles.answer}
          hidden={!on}
          data-role="cd-answer"
          dangerouslySetInnerHTML={{ __html: p.a }}
        />
      </div>
    );
  };

  return (
    <div className={styles.categorySeoFaq10Box}>
      <link rel="stylesheet" href={FONTES_10} />
      <section
        className={styles.categorySeoFaq10}
        aria-label="Sobre a categoria"
        data-role="cd-root"
      >
        <div className={styles.inner}>
          {temFaq && (
            <>
              <h2 className={styles.faqTitle} data-role="cd-faq-title">
                {comCategoria(FAQ_TITLE, nome)}
              </h2>
              {perguntas.length > 0 ? (
                <div className={styles.faqGrid} data-role="cd-faq">
                  {colunas
                    .filter(c => c.length)
                    .map((c, k) => (
                      <div key={k} className={styles.faqCol}>
                        {c.map(item)}
                      </div>
                    ))}
                </div>
              ) : (
                <div
                  className={styles.faqHtml}
                  dangerouslySetInnerHTML={{ __html: FAQ_HTML }}
                />
              )}
            </>
          )}

          {temSobre && (
            <article className={styles.about} data-role="cd-about">
              {tituloSobre && (
                <h3 className={styles.aboutTitle} data-role="cd-title">
                  {tituloSobre}
                </h3>
              )}
              <div
                id={`${uid}-texto`}
                ref={textoRef}
                className={`${styles.text}${aberto ? '' : ` ${styles.textClamped}`}`}
                data-role="cd-text"
                dangerouslySetInnerHTML={{ __html: corpo }}
              />
              {(temMais || aberto) && (
                <button
                  type="button"
                  className={styles.more}
                  aria-expanded={aberto}
                  aria-controls={`${uid}-texto`}
                  onClick={() => setAberto(v => !v)}
                  data-role="cd-more"
                >
                  {aberto ? READ_LESS : READ_MORE}
                  <Chevron up={aberto} />
                </button>
              )}
            </article>
          )}
        </div>
      </section>
    </div>
  );
}

'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_11 } from '@/components/templates/common/template_11/Spot';

/**
 * Espelha `organisms/CategorySeoFaq11` do faststore.starter (família 11, Grade; desenho
 * `CategoryDescription11`): a moldura de filete com "Sobre a categoria" (título, texto
 * recolhido e "Ler mais") e as perguntas frequentes numeradas em acordeão. Mesmo markup,
 * classes e `data-role`; CSS derivado do SCSS.
 *
 * Lá o conteúdo vem, por categoria, dos banners HTML do Intelligent Search (áreas "one" e
 * "two"), lido pelo caminho da PLP; aqui é o mock de contexto de lá, no mesmo formato HTML,
 * passado pelos mesmos leitores (`separarTitulo`, `lerPerguntas`). Sem GraphQL e sem o
 * `view_promotion` (preview não emite evento).
 */
interface Pergunta {
  q: string;
  a: string;
}

/* ── rótulos (o mock.ts de lá) ── */
const ABOUT_EYEBROW = 'Sobre a categoria';
const ABOUT_TITLE = 'Como escolher {categoria}';
const FAQ_EYEBROW = 'Perguntas frequentes';
const READ_MORE = 'Ler mais';
const READ_LESS = 'Ler menos';

/* ── contexto de exemplo (o mock.ts de lá) ── */
const NOME = 'Iluminação';
const SOBRE_HTML =
  '<h2>Como escolher a luminária certa</h2>' +
  '<p>Para leitura e trabalho, prefira luz direcionável e temperatura neutra, entre 3000 K e 4000 K. Para salas e quartos, luz quente e difusa deixa o ambiente mais calmo. Pendentes sobre mesas de jantar ficam bem entre 70 e 80 cm acima do tampo.</p>' +
  '<p>Todas as luminárias trazem na ficha técnica a potência, a temperatura de cor e o tipo de soquete, para combinar peças da mesma família de luz.</p>' +
  '<p>Em ambientes amplos, combine uma luz geral no teto com pontos de apoio em mesas e no piso: a mistura de alturas deixa a luz mais confortável e valoriza os materiais da casa.</p>';
const FAQ_HTML =
  '<details><summary>As lâmpadas acompanham as luminárias?</summary><p>Sim. Todas as peças saem com lâmpada LED compatível, na temperatura indicada na ficha técnica.</p></details>' +
  '<details><summary>Qual temperatura de cor escolher?</summary><p>Luz quente (2700 K a 3000 K) para descanso; neutra (4000 K) para leitura e trabalho.</p></details>' +
  '<details><summary>Vocês fazem a instalação?</summary><p>A instalação não está inclusa. A ficha técnica traz o esquema elétrico de cada peça.</p></details>' +
  '<details><summary>Posso trocar se a peça não servir no ambiente?</summary><p>Sim. A troca é gratuita em até 30 dias, com a peça sem uso e na embalagem original.</p></details>' +
  '<details><summary>Qual a garantia das luminárias?</summary><p>Todas as peças têm a garantia do fabricante, com nota fiscal emitida na compra.</p></details>';

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

const Ico = ({
  size,
  children,
}: {
  size: number;
  children: React.ReactNode;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export default function CategoryDescription11() {
  const { titulo, corpo } = useMemo(() => separarTitulo(SOBRE_HTML), []);
  const perguntas = useMemo(() => lerPerguntas(FAQ_HTML), []);

  const [aberto, setAberto] = useState(false);
  const [temMais, setTemMais] = useState(true);
  const [faqAberta, setFaqAberta] = useState<number | null>(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  // "Ler mais" só quando o texto recolhido esconde alguma coisa (medido no navegador).
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
  const tituloSobre = titulo || comCategoria(ABOUT_TITLE, NOME);

  return (
    <div className={styles.categorySeoFaq11Box}>
      <link rel="stylesheet" href={FONTES_11} />
      <section
        className={styles.categorySeoFaq11}
        aria-label={ABOUT_EYEBROW}
        data-role="cd-root"
      >
        <div className={styles.box}>
          {temSobre && (
            <div className={styles.about} data-role="cd-about">
              <span className={styles.eyebrow}>[{ABOUT_EYEBROW}]</span>
              {tituloSobre && (
                <h2 className={styles.aboutTitle} data-role="cd-title">
                  {tituloSobre}
                </h2>
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
                  <Ico size={16}>
                    <path d={aberto ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
                  </Ico>
                </button>
              )}
            </div>
          )}

          {temFaq && (
            <div className={styles.faq} data-role="cd-faq">
              <span className={styles.faqHead}>[{FAQ_EYEBROW}]</span>
              {perguntas.length > 0 ? (
                perguntas.map((p, i) => {
                  const on = faqAberta === i;
                  return (
                    <div
                      key={i}
                      className={styles.faqItem}
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
                          <span className={styles.num}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className={styles.qText}>{p.q}</span>
                          <Ico size={18}>
                            <path d={on ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                          </Ico>
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
                })
              ) : (
                <div
                  className={styles.faqHtml}
                  dangerouslySetInnerHTML={{ __html: FAQ_HTML }}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

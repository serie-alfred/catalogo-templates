'use client';

import React, { useId, useMemo, useState } from 'react';

import styles from './index.module.css';
import { FONTES_14 } from '@/components/templates/common/template_14/Spot';

/**
 * Espelha `organisms/CategorySeoFaq14` do faststore.starter (família 14, Esportiva; desenho
 * `CategoryDescription14`): na superfície clara, o selo "Guia da categoria" com o traço
 * vermelho inclinado, o título em Saira itálica, o texto e o "Ler mais" com o sublinhado grosso
 * vermelho; ao lado, as perguntas frequentes em acordeão entre filetes ("+" no paralelogramo
 * marinho, "−" em vermelho). Mesmo markup, classes e `data-role`; CSS derivado do SCSS.
 *
 * Lá o conteúdo vem, por categoria, dos banners HTML do Intelligent Search (áreas "one" e
 * "two"); aqui é o mock de contexto de lá, no mesmo formato HTML, passado pelos mesmos leitores
 * (`separar`, `lerPerguntas`). Sem GraphQL e sem o `view_promotion`.
 */
interface Pergunta {
  q: string;
  a: string;
}

/* ── rótulos (o mock.ts de lá) ── */
const EYEBROW = 'Guia da categoria';
const ABOUT_TITLE = '{Categoria} para cada ritmo';
const FAQ_TITLE = 'Perguntas frequentes';

/* ── contexto de exemplo (o mock.ts de lá) ── */
const NOME = 'Corrida';
const SOBRE_HTML =
  '<h2>Equipamento de corrida para cada ritmo</h2>' +
  '<p>Do primeiro 5 km à maratona, a seleção de corrida da [SUA MARCA] reúne tênis com tecnologia de amortecimento, roupas com tecido que seca rápido e acessórios de hidratação. Tudo testado em asfalto, trilha e esteira.</p>' +
  '<p>Use os filtros de modalidade, tamanho, cor e preço para chegar mais rápido ao equipamento certo.</p>' +
  '<p><a href="/corrida">Ler mais</a></p>';
const FAQ_HTML =
  '<details><summary>Como escolher o tênis de corrida certo?</summary><p>Considere o tipo de piso, a distância dos treinos e a pisada. Para asfalto e treinos longos, prefira mais amortecimento; para provas curtas, modelos mais leves.</p></details>' +
  '<details><summary>Qual a diferença entre drop alto e baixo?</summary><p>O drop é a diferença de altura entre o calcanhar e a ponta do tênis. Drop alto alivia a panturrilha; drop baixo favorece a pisada no meio do pé.</p></details>' +
  '<details><summary>De quanto em quanto tempo trocar o tênis?</summary><p>Em geral, entre 600 e 800 km de uso, ou quando o amortecimento perde a resposta.</p></details>' +
  '<details><summary>Posso trocar se o número não servir?</summary><p>Pode. A primeira troca é gratuita em até 30 dias, com o produto sem uso e na embalagem original.</p></details>' +
  '<details><summary>Qual o prazo de entrega?</summary><p>O prazo aparece no carrinho depois do CEP e começa a contar a partir da confirmação do pagamento.</p></details>';

const semTags = (html: string) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** `<h2>` inicial vira título; um link sozinho no fim vira o "Ler mais"; o resto é o corpo. */
function separar(html: string): { titulo: string; corpo: string; link: { href: string; label: string } | null } {
  let resto = html.trim();
  let titulo = '';
  const h = /^\s*<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(resto);
  if (h) {
    titulo = semTags(h[1]);
    resto = resto.slice(h[0].length).trim();
  }
  let link: { href: string; label: string } | null = null;
  const l = /(?:<p[^>]*>\s*)?<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>(?:\s*<\/p>)?\s*$/i.exec(resto);
  if (l && semTags(resto.slice(0, l.index))) {
    link = { href: l[1], label: semTags(l[2]) };
    resto = resto.slice(0, l.index).trim();
  }
  return { titulo, corpo: resto, link };
}

/** FAQ da área "two" → pares pergunta/resposta (details/summary ou h3/h4 + texto). */
function lerPerguntas(html: string): Pergunta[] {
  const out: Pergunta[] = [];
  const details = /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
  let m: RegExpExecArray | null;
  while ((m = details.exec(html))) out.push({ q: semTags(m[1]), a: m[2].trim() });
  if (out.length) return out;
  const partes = html.split(/(<h[34][^>]*>[\s\S]*?<\/h[34]>)/i);
  for (let i = 1; i < partes.length; i += 2) {
    out.push({ q: semTags(partes[i]), a: (partes[i + 1] ?? '').trim() });
  }
  return out.filter(p => p.q);
}

const comCategoria = (tpl: string, nome: string) =>
  tpl.replace(/\{categoria\}/g, nome.toLocaleLowerCase('pt-BR')).replace(/\{Categoria\}/g, nome);

export default function CategoryDescription14() {
  const { titulo, corpo, link } = useMemo(() => separar(SOBRE_HTML), []);
  const perguntas = useMemo(() => lerPerguntas(FAQ_HTML), []);

  const [faqAberta, setFaqAberta] = useState<number | null>(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  const temSobre = !!semTags(corpo);
  const temFaq = perguntas.length > 0 || !!semTags(FAQ_HTML);
  const tituloSobre = titulo || comCategoria(ABOUT_TITLE, NOME);
  const idTitulo = `${uid}-titulo`;

  return (
    <div className={styles.categorySeoFaq14Box}>
      <section
        className={styles.categorySeoFaq14}
        {...(temSobre && tituloSobre ? { 'aria-labelledby': idTitulo } : { 'aria-label': FAQ_TITLE })}
        data-role="cd-root"
      >
        <link rel="stylesheet" href={FONTES_14} />
        <div className={styles.box}>
          {temSobre && (
            <div className={styles.about} data-role="cd-about">
              {EYEBROW && (
                <span className={styles.eyebrow} data-role="cd-eyebrow">
                  <span className={styles.eyebrowMark} aria-hidden="true" />
                  {EYEBROW}
                </span>
              )}
              {tituloSobre && (
                <h2 id={idTitulo} className={styles.aboutTitle} data-role="cd-title">
                  {tituloSobre}
                </h2>
              )}
              <div className={styles.text} data-role="cd-text" dangerouslySetInnerHTML={{ __html: corpo }} />
              {link && (
                <a className={styles.readMore} href={link.href} data-role="cd-more">
                  {link.label}
                </a>
              )}
            </div>
          )}

          {temFaq && (
            <div className={styles.faq} data-role="cd-faq">
              {FAQ_TITLE && <h3 className={styles.faqTitle}>{FAQ_TITLE}</h3>}
              <div className={styles.faqList}>
                {perguntas.map((p, i) => {
                  const on = faqAberta === i;
                  return (
                    <div key={i} className={`${styles.faqItem}${on ? ` ${styles.faqOpen}` : ''}`} data-role="cd-faq-item">
                      <h4 className={styles.faqHeading}>
                        <button
                          type="button"
                          id={`${uid}-q${i}`}
                          className={styles.question}
                          aria-expanded={on}
                          aria-controls={`${uid}-a${i}`}
                          onClick={() => setFaqAberta(on ? null : i)}
                          data-role="cd-question"
                        >
                          <span className={styles.qText}>{p.q}</span>
                          <span className={styles.sign} aria-hidden="true">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.4}
                              strokeLinecap="square"
                              aria-hidden="true"
                            >
                              <path d={on ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                            </svg>
                          </span>
                        </button>
                      </h4>
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
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

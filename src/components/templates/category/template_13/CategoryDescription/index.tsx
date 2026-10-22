'use client';

import React, { useId, useMemo, useState } from 'react';

import styles from './index.module.css';
import { FONTES_13 } from '@/components/templates/common/template_13/Spot';

/**
 * Espelha `organisms/CategorySeoFaq13` do faststore.starter (família 13, Noturno; desenho
 * `CategoryDescription13`): o texto da categoria (título grande em condensada, corpo e o "Ler
 * mais" sublinhado em verde) e as perguntas frequentes em acordeão com "+"/"−". Mesmo markup,
 * classes e `data-role`; CSS derivado do SCSS.
 *
 * Lá o conteúdo vem, por categoria, dos banners HTML do Intelligent Search (áreas "one" e
 * "two"), lido pelo caminho da PLP; aqui é o mock de contexto de lá, no mesmo formato HTML,
 * passado pelos mesmos leitores (`separar`, `lerPerguntas`). Sem GraphQL e sem o
 * `view_promotion` (preview não emite evento).
 */
interface Pergunta {
  q: string;
  a: string;
}

/* ── rótulos (o mock.ts de lá) ── */
const ABOUT_TITLE = '{Categoria} da loja';
const FAQ_TITLE = 'Perguntas frequentes';

/* ── contexto de exemplo (o mock.ts de lá) ── */
const NOME = 'Tênis';
const SOBRE_HTML =
  '<h2>Tênis pra rodar a cidade de noite</h2>' +
  '<p>Corrida, skate, basquete ou só o rolê: a seleção de tênis da [SUA MARCA] junta modelos de performance e lançamentos em edição limitada. Cada drop chega em numeração do 37 ao 44, com tabela de medidas em centímetros na página do produto.</p>' +
  '<p>Use os filtros de tamanho, cor, preço e marca para chegar mais rápido no par certo.</p>' +
  '<p><a href="#">Ler mais</a></p>';
const FAQ_HTML =
  '<details><summary>Como escolher o tamanho certo?</summary><p>Meça o pé do calcanhar à ponta do dedo maior e compare com a tabela de medidas de cada modelo. Entre dois números, prefira o maior.</p></details>' +
  '<details><summary>Os tênis têm reposição depois do drop?</summary><p>Alguns modelos voltam em novas cores; os de edição limitada não têm reposição. Ative o "Me avise" na página do produto.</p></details>' +
  '<details><summary>Posso trocar se não servir?</summary><p>Pode. A primeira troca é gratuita em até 30 dias, com o tênis sem uso e na caixa original.</p></details>' +
  '<details><summary>Qual o prazo de entrega?</summary><p>O prazo aparece no carrinho depois do CEP e começa a contar a partir da confirmação do pagamento.</p></details>' +
  '<details><summary>Como limpar tênis de camurça?</summary><p>Use escova macia e borracha própria para camurça, sempre a seco. Evite água e máquina de lavar.</p></details>';

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

export default function CategoryDescription13() {
  const { titulo, corpo, link } = useMemo(() => separar(SOBRE_HTML), []);
  const perguntas = useMemo(() => lerPerguntas(FAQ_HTML), []);

  const [faqAberta, setFaqAberta] = useState<number | null>(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  const temSobre = !!semTags(corpo);
  const temFaq = perguntas.length > 0 || !!semTags(FAQ_HTML);
  if (!temSobre && !temFaq) return null;

  const tituloSobre = titulo || comCategoria(ABOUT_TITLE, NOME);
  const idTitulo = `${uid}-titulo`;

  return (
    <div className={styles.categorySeoFaq13Box}>
      <section
        className={styles.categorySeoFaq13}
        {...(temSobre && tituloSobre ? { 'aria-labelledby': idTitulo } : { 'aria-label': FAQ_TITLE })}
        data-role="cd-root"
      >
        <link rel="stylesheet" href={FONTES_13} />
        <div className={styles.box}>
          {temSobre && (
            <div className={styles.about} data-role="cd-about">
              {tituloSobre && (
                <h2 id={idTitulo} className={styles.aboutTitle} data-role="cd-title">
                  {tituloSobre}
                </h2>
              )}
              <div className={styles.text} data-role="cd-text" dangerouslySetInnerHTML={{ __html: corpo }} />
              {link && (
                <a className={styles.readMore} href={link.href} data-role="cd-more">
                  <span className={styles.readMoreText}>{link.label}</span>
                </a>
              )}
            </div>
          )}

          {temFaq && (
            <div className={styles.faq} data-role="cd-faq">
              <h3 className={styles.faqTitle}>{FAQ_TITLE}</h3>
              {perguntas.length > 0 ? (
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
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={on ? 2.4 : 2.2} aria-hidden="true">
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
              ) : (
                <div className={styles.faqHtml} dangerouslySetInnerHTML={{ __html: FAQ_HTML }} />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

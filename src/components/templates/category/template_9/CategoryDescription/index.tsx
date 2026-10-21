'use client';

import React, { useId, useState } from 'react';

import styles from './index.module.css';
import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

/**
 * Espelha `organisms/CategorySeoFaq09` do faststore.starter (família 09, Editorial;
 * desenho `CategoryDescription09`): "Sobre a categoria" com "Ler mais" e as perguntas
 * frequentes em acordeão. Mesmo markup, classes e `data-role`; CSS derivado do SCSS.
 *
 * Lá o conteúdo vem, por categoria, dos banners HTML do Intelligent Search (áreas "one"
 * e "two"), lido pelo caminho da PLP; aqui é o exemplo do mock.ts de lá, no mesmo
 * formato HTML, passado pelos mesmos leitores (`separarTitulo`, `lerPerguntas`). Sem
 * GraphQL e sem o `view_promotion` (preview não emite evento).
 */
interface Pergunta {
  q: string;
  a: string;
}

const TITLE_PREFIX = 'Sobre';
const FAQ_TITLE = 'Perguntas frequentes';
const READ_MORE = 'Ler mais';
const READ_LESS = 'Ler menos';

const NOME = 'Vestidos';
const SOBRE_HTML =
  '<p>Vestido é a peça que resolve o look sozinha. Aqui você encontra modelos em linho, algodão e viscose, com comprimentos midi, longos e curtos, em cortes que valorizam o movimento do tecido.</p>' +
  '<p>Para o dia, prefira tecidos naturais e modelagens soltas. Para a noite, aposte em alças finas e caimento fluido, que funcionam com sandália rasteira ou salto.</p>';
const FAQ_HTML =
  '<details><summary>Como escolher o tamanho certo?</summary><p>Cada produto tem a tabela de medidas na própria página. Se ficar entre dois tamanhos, escolha pelo busto e fale com o atendimento para confirmar.</p></details>' +
  '<details><summary>O linho amassa muito?</summary><p>Amassa um pouco, e faz parte do charme do tecido. Pendure a peça logo depois de lavar e passe ainda úmida.</p></details>' +
  '<details><summary>Qual o prazo para trocar?</summary><p>A primeira troca é gratuita em até 30 dias, com a etiqueta e sem sinais de uso.</p></details>' +
  '<details><summary>Como lavar peças de linho?</summary><p>À mão ou no ciclo delicado, em água fria e com sabão neutro. Seque à sombra.</p></details>';

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
  while ((m = details.exec(html))) out.push({ q: semTags(m[1]), a: m[2].trim() });
  if (out.length) return out;
  const partes = html.split(/(<h[34][^>]*>[\s\S]*?<\/h[34]>)/i);
  for (let i = 1; i < partes.length; i += 2) {
    out.push({ q: semTags(partes[i]), a: (partes[i + 1] ?? '').trim() });
  }
  return out.filter(p => p.q);
}

const { titulo, corpo } = separarTitulo(SOBRE_HTML);
const PERGUNTAS = lerPerguntas(FAQ_HTML);
const BLOCOS = (corpo.match(/<\/(p|ul|ol|h[2-6]|div)>/gi) ?? []).length;
const TEM_MAIS = BLOCOS > 1 || semTags(corpo).length > 280;

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const Sinal = ({ aberto }: { aberto: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d={aberto ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
  </svg>
);

export default function CategoryDescription09() {
  const [aberto, setAberto] = useState(false);
  const [faqAberta, setFaqAberta] = useState<number | null>(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  return (
    <div className={styles.categorySeoFaq09Box}>
      <link rel="stylesheet" href={FONTES_09} />
      <section className={styles.categorySeoFaq09} aria-label="Sobre a categoria" data-role="cd-root">
        <div className={styles.inner}>
          <div className={styles.about} data-role="cd-about">
            <h2 className={styles.title} data-role="cd-title">
              {titulo || (
                <>
                  {TITLE_PREFIX} <em>{NOME.toLocaleLowerCase('pt-BR')}</em>
                </>
              )}
            </h2>
            <div
              id={`${uid}-texto`}
              className={`${styles.text}${aberto || !TEM_MAIS ? '' : ` ${styles.textClamped}`}`}
              data-role="cd-text"
              dangerouslySetInnerHTML={{ __html: corpo }}
            />
            {TEM_MAIS && (
              <button
                type="button"
                className={`${styles.more}${aberto ? ` ${styles.moreOpen}` : ''}`}
                aria-expanded={aberto}
                aria-controls={`${uid}-texto`}
                onClick={() => setAberto(v => !v)}
                data-role="cd-more"
              >
                <span>{aberto ? READ_LESS : READ_MORE}</span>
                <Chevron />
              </button>
            )}
          </div>

          <div className={styles.faq} data-role="cd-faq">
            <span className={styles.faqTitle}>{FAQ_TITLE}</span>
            <div className={styles.faqList}>
              {PERGUNTAS.map((p, i) => {
                const on = faqAberta === i;
                return (
                  <div key={i} className={styles.faqItem} data-role="cd-faq-item">
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
                        <Sinal aberto={on} />
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
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

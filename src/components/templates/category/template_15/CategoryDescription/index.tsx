'use client';

import React, { useId, useMemo, useState } from 'react';

import styles from './index.module.css';
import { FONTES_15 } from '@/components/templates/common/template_15/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { faqEmHtml, paragrafosEmHtml, categoriaDoExemplo } from '@/utils/categoriaDaLoja';
import { useCategoriaDaLoja } from '@/hooks/useCategoriaDaLoja';

/**
 * Espelha `organisms/CategorySeoFaq15` do faststore.starter (família 15, Luxo; desenho
 * `CategoryDescription15`): faixa areia em duas colunas — a chamada dourada, o título em
 * serifa com o trecho em itálico, o texto apagado e o "Ler mais" sobre fio dourado; à direita
 * "Perguntas frequentes" e o acordeão em serifa entre fios, com "+"/"−" finos. Mesmo markup,
 * classes e `data-role`; CSS derivado do SCSS.
 *
 * Lá o conteúdo vem, por categoria, dos banners HTML do Intelligent Search (áreas "one" e
 * "two"), lido pelo caminho da PLP; aqui é o mock de contexto de lá, no mesmo formato HTML,
 * passado pelos mesmos leitores (`separar`, `lerPerguntas`). Sem GraphQL e sem o
 * `view_promotion` (preview não emite evento). Os rótulos são do CMS e vêm do
 * `useConteudoDaSecao`; o texto da categoria entra com a categoria em destaque da loja.
 */
interface Pergunta {
  q: string;
  a: string;
}

/* ── rótulos (o mock.ts de lá) ── */
interface CategoryDescription15Conteudo {
  aboutEyebrow?: string;
  aboutTitle?: string;
  faqTitle?: string;
}

const MOCK: CategoryDescription15Conteudo = {
  aboutEyebrow: 'Sobre os {categoria}',
  aboutTitle: '{Categoria} da maison',
  faqTitle: 'Perguntas frequentes',
};

/* ── contexto de exemplo (o mock.ts de lá) ── */
const NOME = 'Anéis';
const SOBRE_HTML =
  '<h2>Anéis para marcar <em>os seus momentos</em></h2>' +
  '<p>Do solitário de noivado à aliança do dia a dia, cada anel da [SUA MARCA] é feito em ouro 18k ou prata 925, com pedras de origem certificada e acabamento à mão no nosso ateliê.</p>' +
  '<p>Todas as peças acompanham estojo, certificado de garantia e podem ser ajustadas em até um número sem custo.</p>' +
  '<p><a href="#">Ler mais</a></p>';
const FAQ_HTML =
  '<details><summary>Como descubro o tamanho do meu aro?</summary><p>Meça a circunferência interna de um anel que já sirva e compare com o nosso guia de medidas. Se ficar entre dois números, escolha o maior.</p></details>' +
  '<details><summary>As pedras têm certificado de origem?</summary><p>Sim. Diamantes e pedras preciosas acompanham certificado de origem e de autenticidade.</p></details>' +
  '<details><summary>Posso gravar uma mensagem no anel?</summary><p>Pode. A gravação interna é feita no ateliê e acrescenta até 5 dias úteis ao prazo.</p></details>' +
  '<details><summary>Qual o prazo para ajuste de tamanho?</summary><p>O ajuste leva até 10 dias úteis a partir do recebimento da peça no ateliê.</p></details>' +
  '<details><summary>Como cuidar do ouro 18k?</summary><p>Guarde no estojo, longe de outras peças, e limpe com flanela macia. Evite perfume e produtos de limpeza.</p></details>';

const semTags = (html: string) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    // As entidades do texto escapado da categoria da loja (o resultado é texto React).
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/** Título: só o itálico sobrevive (`<em>`/`<i>` → `<em>`), sem atributos. */
const soItalico = (html: string) =>
  html
    .replace(/<(\/?)(?:em|i)(?:\s[^>]*)?>/gi, '\u0000$1em\u0001')
    .replace(/<[^>]*>/g, '')
    .replace(/\u0000/g, '<')
    .replace(/\u0001/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

/** `<h2>` inicial vira título; um link sozinho no fim vira o "Ler mais"; o resto é o corpo. */
function separar(html: string): {
  titulo: string;
  corpo: string;
  link: { href: string; label: string } | null;
} {
  let resto = html.trim();
  let titulo = '';
  const h = /^\s*<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(resto);
  if (h) {
    titulo = soItalico(h[1]);
    resto = resto.slice(h[0].length).trim();
  }
  let link: { href: string; label: string } | null = null;
  const l =
    /(?:<p[^>]*>\s*)?<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>(?:\s*<\/p>)?\s*$/i.exec(
      resto
    );
  if (l && semTags(resto.slice(0, l.index))) {
    link = { href: l[1], label: semTags(l[2]) };
    resto = resto.slice(0, l.index).trim();
  }
  return { titulo, corpo: resto, link };
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

export default function CategoryDescription15() {
  // A categoria da loja (Conteúdo da loja → Página de categoria): nome, texto e
  // FAQ do cadastro, como HTML ESCAPADO no formato do exemplo (o /p é público).
  const categoria = useCategoriaDaLoja();
  const nome = categoria?.name || NOME;
  const sobreHtml = categoria?.paragrafos.length
    ? paragrafosEmHtml(categoria.paragrafos)
    : SOBRE_HTML;
  const faqHtml = categoria?.faq.length ? faqEmHtml(categoria.faq) : FAQ_HTML;
  const { aboutEyebrow, aboutTitle, faqTitle } = useConteudoDaSecao(MOCK);
  const { titulo, corpo, link } = useMemo(
    () => separar(sobreHtml),
    [sobreHtml]
  );
  const perguntas = useMemo(() => lerPerguntas(faqHtml), [faqHtml]);

  const [faqAberta, setFaqAberta] = useState<number | null>(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  const tituloSobre = titulo || comCategoria(aboutTitle ?? '', nome);
  const chamada = comCategoria(aboutEyebrow ?? '', nome);
  const idTitulo = `${uid}-titulo`;

  return (
    <div className={styles.categorySeoFaq15Box}>
      <section
        className={styles.categorySeoFaq15}
        aria-labelledby={idTitulo}
        data-role="cd-root"
      >
        <link rel="stylesheet" href={FONTES_15} />
        <div className={styles.box}>
          <div className={styles.about} data-role="cd-about">
            {chamada && (
              <span className={styles.eyebrow} data-role="cd-eyebrow">
                {chamada}
              </span>
            )}
            <h2
              id={idTitulo}
              className={styles.aboutTitle}
              data-role="cd-title"
              dangerouslySetInnerHTML={{
                __html: titulo ? tituloSobre : tituloSobre.replace(/[<>]/g, ''),
              }}
            />
            <div
              className={styles.text}
              data-role="cd-text"
              dangerouslySetInnerHTML={{ __html: corpo }}
            />
            {link && (
              <a
                className={styles.readMore}
                href={link.href}
                data-role="cd-more"
              >
                {link.label}
              </a>
            )}
          </div>

          <div className={styles.faq} data-role="cd-faq">
            <h3 className={styles.faqTitle}>{faqTitle}</h3>
            <div className={styles.faqList}>
              {perguntas.map((p, i) => {
                const on = faqAberta === i;
                return (
                  <div
                    key={i}
                    className={`${styles.faqItem}${on ? ` ${styles.faqOpen}` : ''}`}
                    data-role="cd-faq-item"
                  >
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
                        <svg
                          className={styles.sign}
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          aria-hidden="true"
                        >
                          <path d={on ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                        </svg>
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
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
CategoryDescription15.conteudoPadrao = MOCK;

/** A categoria de exemplo, para o painel partir do que a tela mostra (FichaDaCategoria). */
CategoryDescription15.categoriaPadrao = categoriaDoExemplo({ nome: NOME, sobreHtml: SOBRE_HTML, faqHtml: FAQ_HTML });

'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

import styles from './index.module.css';
import { FONTES_12 } from '@/components/templates/common/template_12/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import { faqEmHtml, paragrafosEmHtml } from '@/utils/categoriaDaLoja';
import { useCategoriaDaLoja } from '@/hooks/useCategoriaDaLoja';

/**
 * Espelha `organisms/CategorySeoFaq12` do faststore.starter (família 12, Suave; desenho
 * `CategoryDescription12`): o cartão rosado do guia (selo, título, texto recolhido no mobile
 * com "Ler mais" e o link "Ler o guia completo") e as perguntas frequentes em cartões de
 * acordeão. Mesmo markup, classes e `data-role`; CSS derivado do SCSS.
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

/* ── rótulos (o mock.ts de lá; o CS muda pelo useConteudoDaSecao) ── */
interface CategoryDescription12Conteudo {
  aboutEyebrow?: string;
  /** Título do texto quando o HTML não traz `<h2>`; `{categoria}` vira o nome. */
  aboutTitle?: string;
  faqTitle?: string;
  readMoreLabel?: string;
  readLessLabel?: string;
}

const MOCK: CategoryDescription12Conteudo = {
  aboutEyebrow: 'Guia',
  aboutTitle: 'Como escolher {categoria}',
  faqTitle: 'Perguntas frequentes',
  readMoreLabel: 'Ler mais',
  readLessLabel: 'Ler menos',
};

/* ── contexto de exemplo (o mock.ts de lá) ── */
const NOME = 'Séruns';
const SOBRE_HTML =
  '<h2>Como escolher o seu sérum</h2>' +
  '<p>O sérum é o passo de tratamento da rotina: tem textura leve e concentração maior de ativos. Escolha pelo objetivo principal: vitamina C para luminosidade e manchas, niacinamida para oleosidade e poros, ácido hialurônico para hidratação.</p>' +
  '<p>Comece com um ativo por vez e observe a pele por algumas semanas antes de combinar. Em caso de dúvida, fale com o nosso atendimento.</p>' +
  '<p><a href="#">Ler o guia completo</a></p>';
const FAQ_HTML =
  '<details><summary>Posso usar vitamina C durante o dia?</summary><p>Pode, e combina bem: aplique pela manhã, antes do hidratante, e finalize sempre com protetor solar.</p></details>' +
  '<details><summary>Qual a ordem certa dos produtos?</summary><p>Da textura mais leve para a mais densa: limpeza, tônico, sérum, hidratante e, de dia, protetor solar.</p></details>' +
  '<details><summary>O sérum substitui o hidratante?</summary><p>Na maioria dos casos, não. O sérum trata e o hidratante sela a hidratação; os dois se complementam.</p></details>' +
  '<details><summary>Pele sensível pode usar ácidos?</summary><p>Prefira concentrações baixas, faça um teste numa área pequena e introduza aos poucos na rotina.</p></details>';

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

/** `<h2>` inicial vira título; um link sozinho no fim vira o CTA; o resto é o corpo. */
function separar(html: string): {
  titulo: string;
  corpo: string;
  link: { href: string; label: string } | null;
} {
  let resto = html.trim();
  let titulo = '';
  const h = /^\s*<h2[^>]*>([\s\S]*?)<\/h2>/i.exec(resto);
  if (h) {
    titulo = semTags(h[1]);
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

const Ico = ({
  size,
  w = 1.8,
  children,
}: {
  size: number;
  w?: number;
  children: React.ReactNode;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export default function CategoryDescription12() {
  // A categoria da loja (Conteúdo da loja → Página de categoria): nome, texto e
  // FAQ do cadastro, como HTML ESCAPADO no formato do exemplo (o /p é público).
  const categoria = useCategoriaDaLoja();
  const nome = categoria?.name || NOME;
  const sobreHtml = categoria?.paragrafos.length
    ? paragrafosEmHtml(categoria.paragrafos)
    : SOBRE_HTML;
  const faqHtml = categoria?.faq.length ? faqEmHtml(categoria.faq) : FAQ_HTML;
  const { aboutEyebrow, aboutTitle, faqTitle, readMoreLabel, readLessLabel } =
    useConteudoDaSecao(MOCK);
  const { titulo, corpo, link } = useMemo(
    () => separar(sobreHtml),
    [sobreHtml]
  );
  const perguntas = useMemo(() => lerPerguntas(faqHtml), [faqHtml]);

  const [aberto, setAberto] = useState(false);
  const [temMais, setTemMais] = useState(false);
  const [faqAberta, setFaqAberta] = useState<number | null>(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  // "Ler mais" só quando o texto recolhido esconde alguma coisa: mais de um bloco, ou o 1º
  // passando das 9 linhas. O botão só aparece no mobile (no desktop não há recorte).
  const textoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = textoRef.current;
    if (!el || aberto) return;
    const medir = () => {
      const primeiro = el.firstElementChild as HTMLElement | null;
      setTemMais(
        el.children.length > 1 ||
          (!!primeiro && primeiro.scrollHeight > primeiro.clientHeight + 1)
      );
    };
    medir();
    // A fonte da página, ao carregar, muda as quebras do texto cortado sem mudar a caixa,
    // e o ResizeObserver não avisa. Mede de novo quando as fontes chegam.
    let vivo = true;
    document.fonts?.ready.then(() => vivo && medir());
    if (typeof ResizeObserver === 'undefined')
      return () => {
        vivo = false;
      };
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      vivo = false;
      ro.disconnect();
    };
  }, [corpo, aberto]);

  const temSobre = !!semTags(corpo);
  const temFaq = perguntas.length > 0 || !!semTags(faqHtml);
  const tituloSobre = titulo || comCategoria(aboutTitle || '', nome);
  const recolhido = temMais && !aberto;

  return (
    <div className={styles.categorySeoFaq12Box}>
      <section
        className={styles.categorySeoFaq12}
        aria-label={tituloSobre || faqTitle || 'Sobre a categoria'}
        data-role="cd-root"
      >
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.box}>
          {temSobre && (
            <article
              className={`${styles.about}${recolhido ? ` ${styles.aboutClamped}` : ''}`}
              data-role="cd-about"
            >
              {aboutEyebrow && (
                <span className={styles.eyebrow}>{aboutEyebrow}</span>
              )}
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
              {link && (
                <a
                  className={styles.guide}
                  href={link.href}
                  onClick={e => e.preventDefault()}
                  data-role="cd-guide"
                >
                  {link.label}
                  <Ico size={16}>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </Ico>
                </a>
              )}
              {(temMais || aberto) && (
                <button
                  type="button"
                  className={styles.more}
                  aria-expanded={aberto}
                  aria-controls={`${uid}-texto`}
                  onClick={() => setAberto(v => !v)}
                  data-role="cd-more"
                >
                  {aberto
                    ? readLessLabel || 'Ler menos'
                    : readMoreLabel || 'Ler mais'}
                  <Ico size={16}>
                    <path d={aberto ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
                  </Ico>
                </button>
              )}
            </article>
          )}

          {temFaq && (
            <div className={styles.faq} data-role="cd-faq">
              {faqTitle && <h2 className={styles.faqTitle}>{faqTitle}</h2>}
              {perguntas.length > 0 ? (
                perguntas.map((p, i) => {
                  const on = faqAberta === i;
                  return (
                    <div
                      key={i}
                      className={`${styles.faqItem}${on ? ` ${styles.faqOpen}` : ''}`}
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
                          <span>{p.q}</span>
                          <span className={styles.sign} aria-hidden="true">
                            <Ico size={16} w={2}>
                              <path d={on ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                            </Ico>
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
                })
              ) : (
                <div
                  className={styles.faqHtml}
                  dangerouslySetInnerHTML={{ __html: faqHtml }}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
CategoryDescription12.conteudoPadrao = MOCK;

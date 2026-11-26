import type { ConteudoLoja } from '@/types/conteudo';

/**
 * A categoria da página de categoria (`ConteudoLoja.categoria`) pronta para
 * desenhar: o nome, a descrição em parágrafos (texto, nunca HTML) e as
 * perguntas frequentes com resposta. `null` quando o CS não preencheu nada — aí
 * cada peça fica com a categoria de exemplo dela.
 *
 * Só importa tipos: o funil carrega este arquivo direto no Node.
 */

export interface CategoriaNormal {
  /** '' = a peça usa o nome de exemplo dela. */
  name: string;
  /** Um item por parágrafo (linha em branco separa). */
  paragrafos: string[];
  /** Só pares com pergunta e resposta. */
  faq: { question: string; answer: string }[];
}

const texto = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export function categoriaDaLoja(
  loja: ConteudoLoja | null | undefined
): CategoriaNormal | null {
  const c = loja?.categoria;
  if (!c || typeof c !== 'object') return null;
  const name = texto(c.name);
  const paragrafos = texto(c.description)
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
  const faq = (Array.isArray(c.faq) ? c.faq : [])
    .map(f => ({ question: texto(f?.question), answer: texto(f?.answer) }))
    .filter(f => f.question && f.answer);
  return name || paragrafos.length || faq.length
    ? { name, paragrafos, faq }
    : null;
}

/* ── Para as peças que desenham a categoria a partir de HTML de exemplo ──
   O texto do CS vira HTML ESCAPADO no mesmo formato do exemplo, então a peça
   segue com o próprio markup e nada do CS é interpretado como HTML (o /p é
   público). */

const ENTIDADES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
export const escaparHtml = (s: string) =>
  s.replace(/[&<>"']/g, c => ENTIDADES[c]);
const comQuebras = (s: string) => escaparHtml(s).replace(/\n/g, '<br>');

/** Os parágrafos da categoria como `<p>…</p>` (escapados). */
export const paragrafosEmHtml = (paragrafos: string[]) =>
  paragrafos.map(p => `<p>${comQuebras(p)}</p>`).join('');

/** O FAQ da categoria como `<details><summary>…` (escapado), o formato do exemplo. */
export const faqEmHtml = (faq: { question: string; answer: string }[]) =>
  faq
    .map(
      f =>
        `<details><summary>${escaparHtml(f.question)}</summary><p>${comQuebras(f.answer)}</p></details>`
    )
    .join('');

/* ── O exemplo de cada peça, para o painel partir do que a tela mostra ── */

const DECODIFICAR: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
  nbsp: ' ',
};
const textoDoHtml = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, e: string) => DECODIFICAR[e])
    .replace(/[ \t]+/g, ' ')
    .trim();

export interface CategoriaDeExemplo {
  nome?: string;
  /** HTML do texto "Sobre" (um `<h2>` inicial é título, não texto). */
  sobreHtml?: string;
  /** HTML do FAQ: `<details><summary>` ou `<h3>` + resposta. */
  faqHtml?: string;
  paragrafos?: string[];
  perguntas?: { q: string; a: string }[];
}

/**
 * A categoria de exemplo de uma peça no formato do Conteúdo da loja (texto puro):
 * o painel mostra esse valor de partida, como faz com o mock de cada seção.
 */
export function categoriaDoExemplo(e: CategoriaDeExemplo): {
  name?: string;
  description?: string;
  faq?: { question: string; answer: string }[];
} {
  const paragrafos =
    e.paragrafos ??
    (e.sobreHtml
      ? e.sobreHtml
          .replace(/^\s*<h2[^>]*>[\s\S]*?<\/h2>/i, '')
          .split(/<\/p>|<\/h[1-6]>/i)
          .map(textoDoHtml)
          .filter(Boolean)
      : []);
  let perguntas = e.perguntas ?? [];
  if (!perguntas.length && e.faqHtml) {
    const details = [
      ...e.faqHtml.matchAll(
        /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi
      ),
    ];
    perguntas = details.length
      ? details.map(m => ({ q: m[1], a: m[2] }))
      : e.faqHtml
          .split(/(<h[34][^>]*>[\s\S]*?<\/h[34]>)/i)
          .reduce<{ q: string; a: string }[]>((acc, parte, i, partes) => {
            if (i % 2 === 1) acc.push({ q: parte, a: partes[i + 1] ?? '' });
            return acc;
          }, []);
  }
  const faq = perguntas
    .map(p => ({ question: textoDoHtml(p.q), answer: textoDoHtml(p.a) }))
    .filter(p => p.question);
  return {
    ...(e.nome ? { name: e.nome } : {}),
    ...(paragrafos.length ? { description: paragrafos.join('\n\n') } : {}),
    ...(faq.length ? { faq } : {}),
  };
}

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
  return name || paragrafos.length || faq.length ? { name, paragrafos, faq } : null;
}

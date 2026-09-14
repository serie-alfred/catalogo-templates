import { LAYOUTS, type LayoutSection } from '@/data/layoutData';

/**
 * Injeta o <link> de uma fonte do Google, idempotente por família.
 *
 * O parâmetro `doc` existe porque o iframe da visão mobile é OUTRO documento:
 * os <link> injetados no documento do editor não valem lá, e sem isso as
 * fontes por componente (ex.: `--header-font: 'Manrope'` do Header01) cairiam
 * silenciosamente no fallback dentro do frame.
 */
export function loadGoogleFont(family: string, doc: Document = document) {
  if (!family) return;

  const id = `preview-font-${family.replace(/\s+/g, '-')}`;
  if (doc.getElementById(id)) return;

  const link = doc.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    '+'
  )}:wght@400;700&display=swap`;
  doc.head.appendChild(link);
}

/**
 * Extrai as famílias das fontes por componente e as carrega.
 * Os valores são gravados no formato `'Família', sans-serif`.
 *
 * Carrega DOIS conjuntos, e o segundo é o que faltava:
 *
 *  1. o que o usuário escolheu (`variables`);
 *  2. o DEFAULT de toda var de fonte do `variablesSchema` do item.
 *
 * Sem (2), um componente cuja fonte padrão não é uma das três do tema renderiza
 * no fallback do navegador enquanto ninguém mexe no seletor — e some assim que
 * alguém mexe. Medido no `CategoryTitle06`, cujo título é League Spartan: 98px
 * de largura no starter contra 107px aqui, porque a face nunca era baixada.
 */
export function loadComponentFonts(
  selections: {
    id?: string;
    layoutKey?: string;
    variables?: Record<string, string>;
  }[],
  doc: Document = document
) {
  const familia = (valor: string) => /^'([^']+)'/.exec(valor)?.[1];
  for (const sel of selections) {
    for (const value of Object.values(sel.variables ?? {})) {
      const f = familia(value);
      if (f) loadGoogleFont(f, doc);
    }
    const secao = sel.layoutKey
      ? (LAYOUTS as Record<string, LayoutSection>)[sel.layoutKey]
      : undefined;
    const item = secao?.items.find(i => i.id === sel.id);
    for (const v of item?.variablesSchema ?? []) {
      if (v.type !== 'font') continue;
      const f = familia(v.default);
      if (f) loadGoogleFont(f, doc);
    }
  }
}

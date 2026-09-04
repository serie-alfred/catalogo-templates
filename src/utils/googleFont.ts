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
 */
export function loadComponentFonts(
  selections: { variables?: Record<string, string> }[],
  doc: Document = document
) {
  for (const sel of selections) {
    if (!sel.variables) continue;
    for (const value of Object.values(sel.variables)) {
      const match = /^'([^']+)'/.exec(value);
      if (match) loadGoogleFont(match[1], doc);
    }
  }
}

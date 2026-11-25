import type React from 'react';
import type { FrameColors, FrameFonts } from '@/types/frameMessage';

/**
 * Famílias serifadas (D4-08, decisão 7 do lote E, 18/11/2026): a pilha delas termina
 * em `Georgia, serif`, para o fallback (troca de fonte, falha no carregamento) não
 * cair numa sans. Lista pelo nome, sem consultar o Google: o `buildThemeStyle` roda
 * no servidor e o catálogo do Google pode estar fora. As famílias com "Sans" no nome
 * nunca são serifadas. A MESMA regex mora no generator (`ehSerifada` em
 * `src/utils/fontVariables.js`) e no estágio `2-vitrine` do funil (que lê este arquivo): mude as três juntas.
 */
const SERIFADAS =
  /(^|\s)(serif|slab)\b|garamond|fraunces|playfair|\blora\b|merriweather|baskerville|bodoni|caslon|cormorant|crimson|georgia|\btimes\b|spectral|vollkorn|cinzel|literata|newsreader|gelasio|\bdomine\b|\bcardo\b|\bprata\b|\bbitter\b|\barvo\b|zilla|\baleo\b|rokkitt/i;

export function ehFonteSerifada(family: string): boolean {
  return !/\bsans\b/i.test(family) && SERIFADAS.test(family);
}

/**
 * O valor de fonte que o editor grava (tokens globais e variáveis por componente):
 * `'Família', sans-serif`, ou `'Família', Georgia, serif` quando ela é serifada.
 */
export function pilhaDaFonte(family: string): string {
  return ehFonteSerifada(family)
    ? `'${family}', Georgia, serif`
    : `'${family}', sans-serif`;
}


/**
 * O tema com que o editor nasce: os valores iniciais do `useLayoutGenerator`.
 * Um template completo só define o que o desenho dele pede (`TEMA_DAS_FAMILIAS`);
 * o resto continua daqui — no editor, numa aba nova; na vitrine `/templates`,
 * sempre. Os dois lados lendo a mesma constante é o que os mantém iguais.
 */
export const TEMA_INICIAL: { colors: FrameColors; fonts: FrameFonts } = {
  colors: {
    colorPrimary: '#1a1a1a',
    colorSecondary: '#ffffff',
    colorTertiary: '#fff',
    colorPrimaryBackground: '#000',
    colorSecondaryBackground: '#dd1838',
    colorTertiaryBackground: '#000',
    colorFooter: '#1A051C',
    colorFooterText: '#94A3B8',
    colorPrimaryText: '#fff',
    colorSecondaryText: '#51ff00',
  },
  fonts: {
    fontPrimary: 'Roboto',
    fontSecondary: 'Poppins',
    fontTertiary: 'Open Sans',
  },
};

/** Aceita #abc e #aabbcc; devolve sempre 6 dígitos. */
function normalizeHex(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  return hex.length === 3 ? hex.replace(/./g, c => c + c) : hex;
}

/** Luminância YIQ (0–255). */
export function luminance(hexColor: string): number {
  const hex = normalizeHex(hexColor);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/** Luminância relativa da WCAG (0–1): a que a razão de contraste usa. */
function luminanciaRelativa(hexColor: string): number {
  const hex = normalizeHex(hexColor);
  const canal = (i: number) => {
    const c = parseInt(hex.substring(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(0) + 0.7152 * canal(2) + 0.0722 * canal(4);
}

/**
 * Razão de contraste da WCAG entre duas cores (1 a 21). Hex inválido dá `NaN`,
 * e qualquer comparação com `NaN` é falsa — quem avisa "contraste baixo" não
 * avisa à toa enquanto o usuário ainda digita o hex.
 */
export function razaoDeContraste(a: string, b: string): number {
  const [l1, l2] = [luminanciaRelativa(a), luminanciaRelativa(b)].sort(
    (x, y) => y - x
  );
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Preto ou branco, o que tiver contraste sobre a cor dada. Limiar 128.
 *
 * O hex curto importa: os defaults do tema incluem `#fff` e `#000`, e sem
 * normalizar o parse devolvia NaN — a comparação virava falsa e a função
 * respondia branco sobre branco.
 */
export function contrastOn(hexColor: string): string {
  return luminance(hexColor) >= 128 ? '#000000' : '#ffffff';
}

/**
 * Versão visível em fundo branco (mesma regra do editor). Limiar 220, mais alto
 * que o do `contrastOn`: aqui a pergunta não é "preto ou branco?", é "esta cor
 * some no branco?" — e só as quase-brancas somem.
 */
export function colorSafeOnWhite(hexColor: string): string {
  return luminance(hexColor) >= 220 ? '#000000' : hexColor;
}

/**
 * Monta as variáveis de tema como estilo INLINE para um wrapper.
 *
 * Custom properties são herdadas por todos os descendentes, então isso
 * substitui o `setProperty` no `:root` que o editor usa — e, sendo estilo
 * inline, já vale no 1º paint (SSR), sem o flash de cores default.
 *
 * Compartilhado por /p (SharedPreview) e pelo iframe mobile (FrameClient) para
 * que as duas visões não divirjam quando uma variável nova entrar.
 */
export function buildThemeStyle(
  c: FrameColors,
  f: FrameFonts
): React.CSSProperties {
  return {
    '--text-primary-color': c.colorPrimary,
    '--text-secundary-color': c.colorSecondary,
    '--text-tertiary-color': c.colorTertiary,
    '--background-primary-color': c.colorPrimaryBackground,
    '--background-primary-color-safe': colorSafeOnWhite(
      c.colorPrimaryBackground
    ),
    '--background-secundary-color': c.colorSecondaryBackground,
    '--background-tertiary-color': c.colorTertiaryBackground,
    // Irmãs da -safe da primária (D2-07, 18/11/2026): a letra de acento que lê a
    // cor secundária/terciária sobre neutro claro não some com a marca branca.
    '--background-secundary-color-safe': colorSafeOnWhite(
      c.colorSecondaryBackground
    ),
    '--background-tertiary-color-safe': colorSafeOnWhite(
      c.colorTertiaryBackground
    ),
    '--background-footer': c.colorFooter,
    '--text-color-footer': c.colorFooterText,
    '--text-color-base': c.colorPrimaryText,
    '--text-color-secundary': c.colorSecondaryText,
    // Serifada termina em `Georgia, serif` (D4-08, `pilhaDaFonte`).
    '--font-primary': pilhaDaFonte(f.fontPrimary),
    '--font-secundary': pilhaDaFonte(f.fontSecondary),
    '--font-tertiary': pilhaDaFonte(f.fontTertiary),
    // O itálico dos destaques: os templates escrevem `font-style: var(--font-italic, italic)`.
    '--font-italic': f.fontItalic === 'normal' ? 'normal' : 'italic',
  } as React.CSSProperties;
}

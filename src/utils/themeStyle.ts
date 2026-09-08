import type React from 'react';
import type { FrameColors, FrameFonts } from '@/types/frameMessage';

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

/** Versão visível em fundo branco (mesma regra do editor). */
export function colorSafeOnWhite(hexColor: string): string {
  const hex = normalizeHex(hexColor);
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brilho = (r * 299 + g * 587 + b * 114) / 1000;
  return brilho >= 220 ? '#000000' : hexColor;
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
    '--background-footer': c.colorFooter,
    '--text-color-footer': c.colorFooterText,
    '--text-color-base': c.colorPrimaryText,
    '--text-color-secundary': c.colorSecondaryText,
    '--font-primary': `'${f.fontPrimary}', sans-serif`,
    '--font-secundary': `'${f.fontSecondary}', sans-serif`,
    '--font-tertiary': `'${f.fontTertiary}', sans-serif`,
  } as React.CSSProperties;
}

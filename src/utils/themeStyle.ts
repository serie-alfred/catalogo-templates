import type React from 'react';
import type { FrameColors, FrameFonts } from '@/types/frameMessage';

/** Versão visível em fundo branco (mesma regra do editor). */
export function colorSafeOnWhite(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return hexColor;
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
    '--background-primary-color-safe': colorSafeOnWhite(c.colorPrimaryBackground),
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

import { LAYOUTS, type LayoutKey } from '@/data/layoutData';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';
import { PLATFORMS, type Platform } from '@/types/platform';

/** O LayoutItem por trás de uma selection, ou null se a entrada é lixo. */
function resolve(selection: LayoutSelection) {
  return (
    LAYOUTS[selection.layoutKey]?.items.find(
      item => item.id === selection.id
    ) ?? null
  );
}

export interface PlatformPartition {
  /** Sobrevive à troca: o item existe também na plataforma de destino. */
  kept: LayoutSelection[];
  /** Some: o item não é oferecido na plataforma de destino. */
  lost: LayoutSelection[];
  /** Títulos do que some, para o diálogo. Sem repetição. */
  lostTitles: string[];
}

/**
 * Separa as seções que sobrevivem a uma troca de plataforma.
 *
 * As que ficam são preservadas INTEIRAS — mesmo `uid`, mesma `pagina` e o mesmo
 * objeto `variables`, por referência. Como o item é o mesmo, o
 * `variablesSchema` é bit a bit o mesmo e `pickChangedVariables` continua
 * comparando contra os mesmos defaults na hora do export.
 *
 * Números do catálogo hoje: 21 dos 44 itens ativos existem nas três
 * plataformas, 12 são Tray+Wake e 11 são só VTEX. Tray e Wake têm catálogo
 * IDÊNTICO, então trocar entre as duas nunca perde nada.
 */
export function partitionByPlatform(
  selections: LayoutSelection[],
  target: Platform
): PlatformPartition {
  const kept: LayoutSelection[] = [];
  const lost: LayoutSelection[] = [];

  for (const selection of selections) {
    const item = resolve(selection);
    if (item?.platforms.includes(target)) kept.push(selection);
    else lost.push(selection);
  }

  const lostTitles = [...new Set(lost.map(s => resolve(s)?.title ?? s.id))];

  return { kept, lost, lostTitles };
}

/**
 * Descarta entradas que não correspondem a nada no catálogo.
 *
 * `layoutSelections` é lido do localStorage com `JSON.parse` e sem nenhuma
 * validação. Um catálogo que mudou entre sessões — item renomeado, removido —
 * deixava linhas fantasma que o painel listava e o export ignorava em silêncio.
 */
export function sanitizeSelections(value: unknown): LayoutSelection[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is LayoutSelection => {
    if (!entry || typeof entry !== 'object') return false;
    const { uid, id, layoutKey } = entry as Partial<LayoutSelection>;
    if (typeof uid !== 'string' || typeof id !== 'string') return false;
    if (typeof layoutKey !== 'string') return false;
    return !!LAYOUTS[layoutKey as LayoutKey]?.items.some(i => i.id === id);
  });
}

/** Aceita só um dos valores do tipo — o localStorage pode conter qualquer coisa. */
export function sanitizePlatform(value: string | null): Platform | null {
  return PLATFORMS.includes(value as Platform) ? (value as Platform) : null;
}

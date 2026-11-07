import { LAYOUTS, type LayoutKey } from '@/data/layoutData';
import type { EditorMode, LayoutSelection } from '@/hooks/useLayoutGenerator';
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
 * Hoje Tray, Wake e VTEX oferecem o catálogo inteiro (trocar entre as três não
 * perde nada); a Nuvemshop só os itens portados e a Wake 2.0 só as famílias 10
 * e 17 (os blocos do Design Studio). Os números mudam a cada família: conte no
 * `layoutData.ts`, não neste comentário.
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

/**
 * Aceita só uma plataforma OFERECIDA — o storage pode conter qualquer coisa.
 * Com a flag da Nuvemshop desligada, `'Nuvemshop'` é recusado aqui (ver
 * `PLATFORMS` em types/platform.ts), o que cobre a aba, o tema salvo e o
 * `/gerador/import-log`.
 */
export function sanitizePlatform(value: string | null): Platform | null {
  return PLATFORMS.includes(value as Platform) ? (value as Platform) : null;
}

/**
 * O modo LP só existe onde o generator sabe montar uma LP sozinha: Wake (página
 * custom de hotsite) e VTEX (seções numa Landing Page do CMS). A Tray não tem.
 * A Nuvemshop terá (`page.<slug>.json`), mas só na fase 7 do contrato dela:
 * até lá o generator não monta LP por seções da Nuvemshop.
 */
export function plataformaTemLp(platform: Platform | null): boolean {
  return platform === 'Wake' || platform === 'Wake 2.0' || platform === 'VTEX';
}

/**
 * O modo Checkout só existe em VTEX: o checkout-vtex é o checkout NATIVO da
 * VTEX, e Tray/Wake não têm o que mostrar ali (a Nuvemshop também não: o tema
 * só pinta 7 cores do checkout, que é da plataforma). Trocar de plataforma sai do modo
 * — e a hidratação passa pelo mesmo filtro, porque o `/gerador/import-log`
 * grava `layoutPlatform` cru e o `editorMode` guardado pode ser de outra sessão.
 */
export function modeForPlatform(
  mode: EditorMode,
  platform: Platform | null
): EditorMode {
  if (mode === 'checkout' && platform !== 'VTEX') return 'loja';
  if (mode === 'lp' && !plataformaTemLp(platform)) return 'loja';
  return mode;
}

/** `editorMode` lido do localStorage: só os três valores, e só o que a plataforma aceita. */
export function sanitizeEditorMode(
  value: string | null,
  platform: Platform | null
): EditorMode {
  const modo: EditorMode =
    value === 'checkout' || value === 'lp' ? value : 'loja';
  return modeForPlatform(modo, platform);
}

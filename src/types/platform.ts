// types/platform.ts
export type Platform = 'Tray' | 'Wake' | 'VTEX' | 'Nuvemshop' | 'Wake 2.0';

/**
 * A Nuvemshop fica atrás de flag até a fase 6 do contrato da plataforma
 * (`.nuvemshop-contrato.md`, na pasta acima do repo): enquanto nenhum item do
 * catálogo a declarar, oferecê-la seria um editor sem nenhuma seção.
 *
 * `NEXT_PUBLIC_*` é embutido no bundle no BUILD (e lido quando o `next dev`
 * sobe): ligar ou desligar pede build novo, não só a variável na Vercel.
 */
export const NUVEMSHOP_LIGADA =
  process.env.NEXT_PUBLIC_PLATAFORMA_NUVEMSHOP === '1';

/**
 * As plataformas OFERECIDAS. O `PlatformSelect` lista estas, nesta ordem, e a
 * hidratação (`sanitizePlatform`) recusa o que estiver fora — então, com a flag
 * desligada, uma aba ou um tema salvo com `Nuvemshop` volta sem plataforma,
 * como qualquer valor desconhecido.
 *
 * A Wake é UMA só: a do Design Studio (`'Wake 2.0'`, todas as famílias; o export sai
 * como o da Wake mais `wake.designStudio: true`), que aparece como "Wake"
 * (`rotuloDaPlataforma`). A Wake clássica (`'Wake'`, "Wake (legado)") saiu do seletor:
 * aba e tema salvos com ela abrem na do Design Studio (`sanitizePlatform`).
 */
export const PLATFORMS: Platform[] = [
  'Tray',
  'Wake 2.0',
  'VTEX',
  ...(NUVEMSHOP_LIGADA ? (['Nuvemshop'] as const) : []),
];

/**
 * O nome que a TELA mostra. O valor guardado (aba, tema salvo, preview,
 * `/gerador/import-log`) continua o de `Platform`. `'Wake'` (a clássica) só aparece em
 * registro antigo (import-log, resumo de tema salvo) e é mostrada como era.
 */
const ROTULOS: Record<Platform, string> = {
  Tray: 'Tray',
  'Wake 2.0': 'Wake',
  Wake: 'Wake (legado)',
  VTEX: 'VTEX',
  Nuvemshop: 'Nuvemshop',
};

/** Aceita `string` porque o resumo de tema salvo guarda a plataforma crua. */
export function rotuloDaPlataforma(platform: Platform | string): string {
  return Object.hasOwn(ROTULOS, platform)
    ? ROTULOS[platform as Platform]
    : platform;
}

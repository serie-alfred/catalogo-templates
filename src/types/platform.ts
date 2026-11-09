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
 * "Wake 2.0": a trilha Wake com as seções da home das famílias 09 a 17 virando blocos
 * do Design Studio. Atrás de flag, como a Nuvemshop; o export sai como o da Wake
 * mais `wake.designStudio: true`.
 */
export const WAKE2_LIGADA = process.env.NEXT_PUBLIC_PLATAFORMA_WAKE2 === '1';

/**
 * As plataformas OFERECIDAS. O `PlatformSelect` lista estas, e a hidratação
 * (`sanitizePlatform`) recusa o que estiver fora — então, com a flag desligada,
 * uma aba ou um tema salvo com `Nuvemshop` volta sem plataforma, como qualquer
 * valor desconhecido.
 */
export const PLATFORMS: Platform[] = [
  'Tray',
  'Wake',
  'VTEX',
  ...(NUVEMSHOP_LIGADA ? (['Nuvemshop'] as const) : []),
  ...(WAKE2_LIGADA ? (['Wake 2.0'] as const) : []),
];

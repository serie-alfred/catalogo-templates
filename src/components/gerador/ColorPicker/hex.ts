/**
 * O que o seletor (`react-colorful`) pode receber sem inventar cor.
 *
 * O campo hex grava a cada tecla, então o valor passa por `#`, `#c`, `#c0`…
 * antes de virar `#c0121c`. O `HexColorPicker` converte o `color` que recebe
 * para HSVA; um hex parcial dá NaN, e o efeito que compara o HSVA novo com o do
 * cache usa `!==` — NaN nunca é igual a NaN —, então ele "vê" uma mudança e
 * chama o `onChange` com `#NaNNaNNaN`, que sobrescrevia o que estava sendo
 * digitado. Só com o seletor aberto (o foco no campo o abre).
 *
 * Por isso o seletor só recebe hex completo; enquanto o texto é parcial, fica na
 * última cor válida. E o que vier dele que não for hex completo é descartado.
 *
 * Módulo puro (sem React): o funil o importa direto (`2-checkout`).
 */

/** `#rgb` ou `#rrggbb` — o que o `normalizeHex` do checkout e o seletor aceitam. */
export const HEX_COMPLETO = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export const ehHexCompleto = (valor: unknown): valor is string =>
  typeof valor === 'string' && HEX_COMPLETO.test(valor);

/** A cor que o seletor mostra: a digitada se estiver completa; senão, a última boa. */
export function corDoSeletor(exibida: string, ultimaValida: string): string {
  return ehHexCompleto(exibida) ? exibida : ultimaValida;
}

/** A cor de partida do seletor para um valor qualquer do estado. */
export const validaOuPreto = (valor: string): string =>
  ehHexCompleto(valor) ? valor : '#000000';

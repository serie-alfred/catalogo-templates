/**
 * Nível 2 do contrato de cores do checkout: as variáveis GLOBAIS da loja.
 *
 * É o espelho exato do `VAR_MAP` do generator
 * (`produtos-template-generator/src/platforms/faststore/services/VariablesGenerator.js`),
 * que escreve o `:root` do tema FastStore a partir de `faststore.variables` do
 * config.json. O checkout não carrega o CSS da loja (é outra página, outro
 * domínio de arquivos), então o compose reescreve no `checkout6-custom.css` as
 * mesmas variáveis, com os MESMOS nomes e o MESMO formato de valor. Se um dos
 * dois lados mudar sozinho, a cor escolhida no /gerador pinta a loja e não pinta
 * o checkout, sem erro nenhum — por isso o `level2.test.mjs` lê o arquivo do
 * generator e reprova qualquer divergência, e o estágio 1 do funil confere de novo.
 *
 * PURO: sem fs. O generator e o catálogo importam este arquivo.
 */

/** Chave do config (`faststore.variables`) → nome da custom property de nível 2. */
export const VAR_MAP = Object.freeze({
  fontPrimary: '--font-primary',
  fontSecondary: '--font-secundary',
  fontTertiary: '--font-tertiary',
  colorPrimaryBackground: '--background-primary-color',
  colorPrimaryBackgroundSafe: '--background-primary-color-safe',
  colorSecondaryBackground: '--background-secundary-color',
  colorTertiaryBackground: '--background-tertiary-color',
  colorFooter: '--background-footer',
  colorPrimary: '--text-primary-color',
  colorSecondary: '--text-secundary-color',
  colorTertiary: '--text-tertiary-color',
  colorPrimaryText: '--text-color-base',
  colorSecondaryText: '--text-color-secundary',
  colorFooterText: '--text-color-footer',
});

/** As chaves cujo valor é um nome de família (o resto é cor). */
export const FONT_KEYS = Object.freeze(['fontPrimary', 'fontSecondary', 'fontTertiary']);

/**
 * Pilha de fonte do nível 2, byte a byte a do generator:
 * `'Montserrat', Arial, Helvetica, sans-serif`.
 * O generator não escapa aspas; a validação de valor fica em `derive.mjs`.
 */
export function fontStack(family) {
  return `'${family}', Arial, Helvetica, sans-serif`;
}

export function isFontKey(key) {
  return FONT_KEYS.includes(key);
}

/** Nome da var de nível 2 de uma chave do config, ou `null` se a chave não existe. */
export function level2VarFor(key) {
  return Object.hasOwn(VAR_MAP, key) ? VAR_MAP[key] : null;
}

/** O inverso: `--background-primary-color` → `colorPrimaryBackground`. */
export function level2KeyFor(cssVar) {
  for (const [key, nome] of Object.entries(VAR_MAP)) if (nome === cssVar) return key;
  return null;
}

/** O valor como ele entra no `:root` (fonte vira pilha; cor passa como veio). */
export function level2Value(key, value) {
  return isFontKey(key) ? fontStack(value) : value;
}

/**
 * A declaração inteira, sem `;` — o mesmo texto que `VAR_MAP[key](value)` devolve
 * no generator. Chave desconhecida devolve `null` (o generator a descarta).
 */
export function level2Declaration(key, value) {
  const nome = level2VarFor(key);
  return nome ? `${nome}: ${level2Value(key, value)}` : null;
}

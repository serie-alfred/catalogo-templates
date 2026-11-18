/**
 * O catálogo do seletor de fontes: as do sistema + as do Google Fonts.
 *
 * As do Google vêm de `/gerador/api/fonts` (proxy da API com a chave do
 * servidor, ordenado por popularidade) e são buscadas UMA vez por página: o
 * editor tem até quatro seletores montados ao mesmo tempo (os três da
 * tipografia e o do painel da direita), e antes cada um fazia o próprio
 * round-trip ao Google. A promessa fica guardada no módulo; o navegador ainda
 * guarda a resposta por um dia (Cache-Control da rota), e o servidor guarda a
 * resposta do Google pelo mesmo prazo.
 */

export type OrigemDaFonte = 'sistema' | 'google';

export interface FonteDoCatalogo {
  family: string;
  origem: OrigemDaFonte;
}

/**
 * Fontes que já estão no computador de quem visita a loja (as "web safe"):
 * não há o que baixar. Escolher uma delas não injeta `<link>` do Google.
 */
export const FONTES_DO_SISTEMA: readonly string[] = [
  'Arial',
  'Helvetica',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Georgia',
  'Times New Roman',
  'Garamond',
  'Courier New',
];

const DO_SISTEMA = new Set(FONTES_DO_SISTEMA.map(f => f.toLowerCase()));

export function ehFonteDoSistema(family: string): boolean {
  return DO_SISTEMA.has(family.trim().toLowerCase());
}

/**
 * Famílias serifadas (D4-08, decisão 7 do lote E, 18/11/2026): a pilha delas termina
 * em `Georgia, serif`, para o fallback (troca de fonte, falha no carregamento) não
 * cair numa sans. Lista pelo nome, sem consultar o Google: o `buildThemeStyle` roda
 * no servidor e o catálogo do Google pode estar fora. As famílias com "Sans" no nome
 * nunca são serifadas. A MESMA regex mora no generator (`ehSerifada` em
 * `src/utils/fontVariables.js`) e no estágio `2-vitrine` do funil: mude as três juntas.
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

let google: Promise<FonteDoCatalogo[] | null> | null = null;

/**
 * As do Google, uma vez por página. `null` = catálogo indisponível (sem
 * `GOOGLE_FONTS_API_KEY` a rota devolve 500): o seletor avisa e segue
 * aceitando o nome digitado. Uma falha não fica guardada — o próximo seletor
 * que montar tenta de novo.
 */
export function carregarFontesGoogle(): Promise<FonteDoCatalogo[] | null> {
  if (!google) {
    google = fetch('/gerador/api/fonts')
      .then(res => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        if (!Array.isArray(data) || data.length === 0) return null;
        return data
          .filter(
            (f): f is { family: string } =>
              !!f && typeof (f as { family?: unknown }).family === 'string'
          )
          .filter(f => !ehFonteDoSistema(f.family))
          // Fontes de ícone (Material Symbols/Icons) não são tipografia: escolhidas
          // num título, trocam as letras por ícones.
          .filter(f => !/^Material (Symbols|Icons)/i.test(f.family))
          .map(f => ({ family: f.family, origem: 'google' as const }));
      })
      .catch(() => null)
      .then(lista => {
        if (!lista) google = null;
        return lista;
      });
  }
  return google;
}

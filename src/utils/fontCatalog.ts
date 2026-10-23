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

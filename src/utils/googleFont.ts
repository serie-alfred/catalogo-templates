import { LAYOUTS, type LayoutSection } from '@/data/layoutData';
import { ehFonteDoSistema } from './fontCatalog';

/**
 * Os pesos que o tema gerado baixa: 300–900, normal e itálico (`GOOGLE_FONT_SPEC` do
 * generator). Era 400;700 com a nota "os templates só usam regular e bold", mas as
 * réplicas têm ~1.300 declarações de outros pesos (500, 600, 800, 900) e itálico: o
 * canvas desenhava o 500 com a face 400 e o 800 com a 700, e a loja mostrava outra
 * coisa. O Google ignora o que a família não tem. Revisão das variáveis de 17/11, D4-04.
 */
const PESOS_PADRAO = [300, 400, 500, 600, 700, 800, 900];

/** `ital,wght@0,300;…;1,900`: os pesos padrão nos dois estilos. */
const EIXO_PADRAO =
  'ital,wght@' +
  [0, 1].flatMap(ital => PESOS_PADRAO.map(p => `${ital},${p}`)).join(';');

/**
 * Famílias que aparecem como padrão no `variablesSchema` e NÃO estão no Google Fonts: fontes
 * comerciais, licenciadas e servidas pela própria loja. Pedidas ao Google, voltam 400 e deixam
 * um erro no console (era o vermelho do 2-render nas seções 06). O preview delas cai no fallback
 * do CSS, como já caía.
 */
const FORA_DO_GOOGLE = new Set(['Fabriga']);

/** A família vai para a URL do Google Fonts? */
export const ehFonteDoGoogle = (family: string) =>
  !!family && !FORA_DO_GOOGLE.has(family.trim());

/**
 * Injeta o <link> de uma fonte do Google, idempotente por família (e pesos).
 *
 * O parâmetro `doc` existe porque o iframe da visão mobile é OUTRO documento:
 * os <link> injetados no documento do editor não valem lá, e sem isso as
 * fontes por componente (ex.: `--header-font: 'Manrope'` do Header01) cairiam
 * silenciosamente no fallback dentro do frame.
 *
 * `pesos` existe por causa do checkout: o Checkout01 usa 300–700 e o arquivo
 * entregue importa os cinco (`buildGoogleFontsImport` do checkout-vtex). Com
 * 400;700 só, o 500 e o 600 do preview seriam sintetizados pelo navegador — o
 * preview mentiria sobre o peso. Sem o parâmetro nada muda: mesmo `id`, mesma
 * URL de antes.
 */
export function loadGoogleFont(
  family: string,
  doc: Document = document,
  pesos: readonly number[] = PESOS_PADRAO
) {
  // Sem família, fora do Google ou do sistema (Arial, Georgia…): o Google não
  // serve, e o <link> só renderia um 400 no console.
  if (!ehFonteDoGoogle(family)) return;
  if (ehFonteDoSistema(family)) return;

  const lista = [...new Set(pesos)].sort((a, b) => a - b);
  const padrao = lista.join(';') === PESOS_PADRAO.join(';');
  const id = `preview-font-${family.replace(/\s+/g, '-')}${
    padrao ? '' : `-w${lista.join('-')}`
  }`;
  if (doc.getElementById(id)) return;

  const link = doc.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    '+'
  )}:${padrao ? EIXO_PADRAO : `wght@${lista.join(';')}`}&display=swap`;
  doc.head.appendChild(link);
}

/**
 * Extrai as famílias das fontes por componente e as carrega.
 * Os valores são gravados no formato `'Família', sans-serif` (serifada:
 * `'Família', Georgia, serif` — `pilhaDaFonte`); a família é o primeiro item.
 *
 * Carrega DOIS conjuntos, e o segundo é o que faltava:
 *
 *  1. o que o usuário escolheu (`variables`);
 *  2. o DEFAULT de toda var de fonte do `variablesSchema` do item.
 *
 * Sem (2), um componente cuja fonte padrão não é uma das três do tema renderiza
 * no fallback do navegador enquanto ninguém mexe no seletor — e some assim que
 * alguém mexe. Medido no `CategoryTitle06`, cujo título é League Spartan: 98px
 * de largura no starter contra 107px aqui, porque a face nunca era baixada.
 */
export function loadComponentFonts(
  selections: {
    id?: string;
    layoutKey?: string;
    variables?: Record<string, string>;
  }[],
  doc: Document = document
) {
  const familia = (valor: string) => /^'([^']+)'/.exec(valor)?.[1];
  for (const sel of selections) {
    for (const value of Object.values(sel.variables ?? {})) {
      const f = familia(value);
      if (f) loadGoogleFont(f, doc);
    }
    const secao = sel.layoutKey
      ? (LAYOUTS as Record<string, LayoutSection>)[sel.layoutKey]
      : undefined;
    const item = secao?.items.find(i => i.id === sel.id);
    for (const v of item?.variablesSchema ?? []) {
      if (v.type !== 'font') continue;
      const f = familia(v.default);
      if (f) loadGoogleFont(f, doc);
    }
  }
}

/**
 * Amostra do nome da fonte no seletor: baixa só os glifos do próprio nome
 * (`text=`), uma vez por família. A fonte inteira continua vindo do
 * `loadGoogleFont` quando ela é escolhida.
 */
export function loadFontNamePreview(family: string, doc: Document = document) {
  if (!ehFonteDoGoogle(family) || ehFonteDoSistema(family)) return;
  const id = `preview-name-${family.replace(/\s+/g, '-')}`;
  if (doc.getElementById(id)) return;
  const link = doc.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(
    / /g,
    '+'
  )}&text=${encodeURIComponent(family)}&display=swap`;
  doc.head.appendChild(link);
}

/**
 * Espera as folhas de fonte do Google já injetadas no documento carregarem (ou
 * falharem), com teto. O `document.fonts.ready` sozinho não basta: uma face cuja
 * folha ainda não chegou não está pendente, então ele resolve na hora e a captura
 * sai na fonte de fallback. Revisão das variáveis de 17/11, D4-05.
 */
export function folhasDeFonteCarregadas(
  doc: Document = document,
  tetoMs = 5000
): Promise<void> {
  const links = [
    ...doc.querySelectorAll<HTMLLinkElement>('link[id^="preview-font-"]'),
  ].filter(l => !l.sheet);
  const cada = links.map(
    l =>
      new Promise<void>(resolve => {
        l.addEventListener('load', () => resolve(), { once: true });
        l.addEventListener('error', () => resolve(), { once: true });
      })
  );
  return Promise.race([
    Promise.all(cada).then(() => undefined),
    new Promise<void>(resolve => setTimeout(resolve, tetoMs)),
  ]);
}

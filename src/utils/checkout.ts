/**
 * O modo Checkout do /gerador, do lado do catálogo.
 *
 * Tudo o que decide COR e FONTE do checkout vem do `checkout-vtex` vendorizado
 * pelo `yarn checkout:sync` (src/lib/checkout/*.mjs, src/data/checkout/): este
 * arquivo só adapta o estado do editor ao contrato daquele lib. É a invariante
 * central do pipeline — o preview e o arquivo do cliente saem do MESMO
 * `compose.mjs`, do mesmo SHA —, então nada aqui recalcula token, deriva cor ou
 * monta `:root` por conta própria.
 */
import modeloJson from '@/data/checkout/Checkout01/checkout.json';
import versao from '@/data/checkout/VERSION.json';
import {
  composeCheckout,
  emitTokens,
  resolveTokens,
  ErroCompose,
} from '@/lib/checkout/compose.mjs';
import { fontStack, isFontKey } from '@/lib/checkout/level2.mjs';
import {
  isFontFamily,
  normalizeHex,
  parseFontValue,
  primaryFamily,
} from '@/lib/checkout/derive.mjs';
import { colorSafeOnWhite } from '@/utils/themeStyle';
import type { FrameColors, FrameFonts } from '@/types/frameMessage';

export { ErroCompose };
export {
  EXEMPLO_DO_RODAPE,
  PLACEHOLDERS_DO_RODAPE,
  rodapeDeExemplo,
} from '@/utils/checkoutExemplo';

/*
 * O lib é JavaScript puro, e o TypeScript infere os parâmetros pelos DEFAULTS
 * (`logo = null` vira o tipo `null`). A assinatura real, uma vez, aqui.
 */
type OpcoesCompose = {
  level2?: Record<string, string>;
  level1?: Record<string, string>;
  logo?: string | null;
  version?: string | null;
};
const compose = composeCheckout as unknown as (
  model: unknown,
  sources: unknown,
  opcoes: OpcoesCompose
) => unknown;

/** Um papel do `checkout.json` (formato `ComponentVariable` + a cadeia de níveis). */
export interface PapelCheckout {
  cssVar: string;
  alias: string;
  label: string;
  type: 'color' | 'font';
  default: string;
  group: string;
  inheritsLabel?: string;
  level2: string | null;
  level3: string;
  painel: boolean;
  derivado?: { regra: string; de: string; com?: string; peso?: number };
}

export interface ModeloCheckout {
  id: string;
  contrato: number;
  papeis: PapelCheckout[];
  etapas: { id: string; hash: string; passo: string }[];
  fontes: { pesosImport: number[] };
  limites: { logoAvisoBytes: number; logoErroBytes: number };
  arquivos: { css: string; js: string; header: string; footer: string };
}

export const MODELO_CHECKOUT = modeloJson as unknown as ModeloCheckout;
/** O SHA do checkout-vtex vendorizado: vai no `faststore.checkout.version`. */
export const CHECKOUT_VERSAO: string = versao.sha;
export const CHECKOUT_PROVISORIO: boolean = versao.provisorio;

export const CHECKOUT_ETAPAS = [
  { id: 'carrinho', rotulo: 'Carrinho' },
  { id: 'email', rotulo: 'E-mail' },
  { id: 'perfil', rotulo: 'Identificação' },
  { id: 'entrega', rotulo: 'Entrega' },
  { id: 'pagamento', rotulo: 'Pagamento' },
] as const;
export type CheckoutEtapa = (typeof CHECKOUT_ETAPAS)[number]['id'];

/** Os papéis que o cliente edita. Os derivados de contraste ficam fora. */
export const PAPEIS_DO_PAINEL = MODELO_CHECKOUT.papeis.filter(p => p.painel);

/** Pesos que o checkout pede ao Google Fonts (os mesmos do `@import` do compose). */
export const PESOS_CHECKOUT = MODELO_CHECKOUT.fontes.pesosImport;

/** Caixa máxima do logo no header do checkout, em raster. */
export const LOGO_CHECKOUT_MAX = { w: 280, h: 64 } as const;

export interface CheckoutState {
  model: string;
  /** Nível 1: `{ '--checkout-<papel>': valor }`, só papéis do painel. */
  variables: Record<string, string>;
  etapa: CheckoutEtapa;
}

export const CHECKOUT_PADRAO: CheckoutState = {
  model: MODELO_CHECKOUT.id,
  variables: {},
  etapa: 'carrinho',
};

const ETAPAS = new Set<string>(CHECKOUT_ETAPAS.map(e => e.id));
const PAINEL = new Map(PAPEIS_DO_PAINEL.map(p => [p.cssVar, p]));

/** O valor serve para o papel? Cor = hex; fonte = o que o `parseFontValue` aceita. */
export function valorValido(cssVar: string, valor: unknown): boolean {
  const papel = PAINEL.get(cssVar);
  if (!papel || typeof valor !== 'string') return false;
  return papel.type === 'color'
    ? normalizeHex(valor) !== null
    : parseFontValue(valor) !== null;
}

/**
 * Só o que o compose aceita. O nível 1 é o ÚNICO dado exclusivo do checkout que
 * o compose trata como erro (gate0 #14b): `#1` a meio caminho de `#123456` o faria
 * lançar — o preview ficaria com o último valor bom e o export mandaria lixo
 * para a VALIDATE do generator, que aborta o tema por isso.
 */
export function variaveisValidas(
  variables: Record<string, string>
): Record<string, string> {
  const saida: Record<string, string> = {};
  for (const [k, v] of Object.entries(variables ?? {}))
    if (valorValido(k, v)) saida[k] = v;
  return saida;
}

/** Lê o que veio do localStorage — pode ser de outra versão do contrato. */
export function sanitizeCheckout(value: unknown): CheckoutState {
  if (!value || typeof value !== 'object') return CHECKOUT_PADRAO;
  const v = value as Partial<CheckoutState>;
  const variables: Record<string, string> = {};
  for (const [k, val] of Object.entries(v.variables ?? {}))
    if (PAINEL.has(k) && typeof val === 'string') variables[k] = val;
  return {
    model: v.model === MODELO_CHECKOUT.id ? v.model : MODELO_CHECKOUT.id,
    variables,
    etapa: ETAPAS.has(v.etapa as string)
      ? (v.etapa as CheckoutEtapa)
      : CHECKOUT_PADRAO.etapa,
  };
}

/** `'Lato', Arial, Helvetica, sans-serif` — a pilha do nível 2, igual à do generator. */
export function valorDeFonte(familia: string): string {
  return fontStack(familia);
}

/**
 * `faststore.variables` do config.json: as 14 chaves globais. É o NÍVEL 2 do
 * checkout — o preview e o export leem esta mesma função, então as duas pontas
 * não podem mandar cores diferentes para o compose.
 */
export function variaveisGlobais(
  c: FrameColors,
  f: FrameFonts
): Record<string, string> {
  return {
    fontPrimary: f.fontPrimary,
    fontSecondary: f.fontSecondary,
    fontTertiary: f.fontTertiary,
    colorPrimary: c.colorPrimary,
    colorSecondary: c.colorSecondary,
    colorTertiary: c.colorTertiary,
    colorPrimaryBackground: c.colorPrimaryBackground,
    colorSecondaryBackground: c.colorSecondaryBackground,
    colorTertiaryBackground: c.colorTertiaryBackground,
    colorFooter: c.colorFooter,
    colorFooterText: c.colorFooterText,
    colorPrimaryText: c.colorPrimaryText,
    colorSecondaryText: c.colorSecondaryText,
    colorPrimaryBackgroundSafe: colorSafeOnWhite(c.colorPrimaryBackground),
  };
}

/**
 * O nível 2 que o PREVIEW passa ao compose: sem o valor que não serve ao
 * checkout. Digitar no campo hex de uma cor global grava `#1`, `#12`… a cada
 * tecla, e isso só pode valer "ainda não é cor" (cai no nível 3 por um
 * instante).
 *
 * O compose também não lança por isso: nível 2 inválido é AVISO
 * (`nivel2-invalido`) + nível 3 (gate0 #14b) — é cor da LOJA, e o checkout não
 * derruba o tema dela. O filtro existe para o painel não piscar esse aviso a
 * cada tecla; o export manda `faststore.variables` cru, e o aviso aparece lá.
 */
export function nivel2DoPreview(
  level2: Record<string, string>
): Record<string, string> {
  const saida: Record<string, string> = {};
  for (const [k, v] of Object.entries(level2 ?? {})) {
    const ok = isFontKey(k) ? isFontFamily(v) : normalizeHex(v) !== null;
    if (ok) saida[k] = v;
  }
  return saida;
}

export interface PapelResolvido {
  papel: PapelCheckout;
  valor: string;
  /**
   * De onde veio o valor. `guarda` é a guarda de visibilidade (gate0 #14a/#16):
   * a cor herdada da loja (nível 2) não aparece sobre o fundo da página — razão
   * de contraste abaixo do `visibilidade.min` do papel, como um botão
   * `#ffffff` em página branca —, então vale o nível 3 do Figma e o compose avisa.
   */
  fonte: 'nivel1' | 'nivel2' | 'nivel3' | 'guarda' | 'derivado';
  /** A chave de `faststore.variables` de onde herdou (nível 2 e guarda). */
  key?: string;
  /** Na guarda: a cor da loja que foi recusada. */
  herdado?: string;
}

export interface AvisoCheckout {
  codigo: string;
  mensagem: string;
}

/** Cada papel com o valor que terá na loja e de onde veio — é o "herdando de X". */
export function resolverPapeis(
  level2: Record<string, string>,
  level1: Record<string, string>
): Map<string, PapelResolvido> {
  const r = resolveTokens(MODELO_CHECKOUT, {
    level2: nivel2DoPreview(level2),
    level1: variaveisValidas(level1),
  }) as unknown as { papeis: PapelResolvido[] };
  return new Map(r.papeis.map(p => [p.papel.cssVar, p]));
}

/** O `:root` do `<style id="ck-tokens">`: byte a byte o do slot `tokens` do arquivo composto. */
export function tokensDoCheckout(
  level2: Record<string, string>,
  level1: Record<string, string>
): string {
  return emitTokens(MODELO_CHECKOUT, {
    level2: nivel2DoPreview(level2),
    level1: variaveisValidas(level1),
  }) as unknown as string;
}

/** A família efetiva do checkout (a do papel de fonte), para baixar no iframe. */
export function familiaDoCheckout(
  level2: Record<string, string>,
  level1: Record<string, string>
): string | null {
  for (const r of resolverPapeis(level2, level1).values())
    if (r.papel.type === 'font')
      return (primaryFamily(r.valor) as unknown as string | null) ?? null;
  return null;
}

export interface BaseDoModelo {
  css: string;
  js: string;
  header: string;
  footer: string;
  /** O logo de exemplo do Figma, tirado do `default/` do dist: o preview sem logo. */
  logoExemplo: string;
}

let basePromessa: Promise<BaseDoModelo> | null = null;

export const urlDoModelo = (arquivo: string) =>
  `/gerador/checkout/${MODELO_CHECKOUT.id}/${arquivo}`;

export const urlDaFixture = (etapa: CheckoutEtapa, mobile: boolean) =>
  urlDoModelo(`${etapa}.${mobile ? 390 : 1280}.html`);

/** A base do modelo (dist, com slots), buscada uma vez por documento. */
export function carregarBase(): Promise<BaseDoModelo> {
  if (!basePromessa) {
    const a = MODELO_CHECKOUT.arquivos;
    const texto = (arquivo: string) =>
      fetch(urlDoModelo(arquivo)).then(r => {
        if (!r.ok) throw new Error(`${arquivo}: HTTP ${r.status}`);
        return r.text();
      });
    basePromessa = Promise.all([
      texto(a.css),
      texto(a.js),
      texto(a.header),
      texto(a.footer),
      texto(`default/${a.header}`),
    ]).then(([css, js, header, footer, headerDefault]) => ({
      css,
      js,
      header,
      footer,
      logoExemplo:
        /<img class="etm-header__logo-img" src="([^"]+)"/.exec(
          headerDefault
        )?.[1] ?? '',
    }));
    // Falha não fica em cache: a próxima montagem tenta de novo.
    basePromessa.catch(() => {
      basePromessa = null;
    });
  }
  return basePromessa;
}

export interface CheckoutComposto {
  css: string;
  js: string;
  header: string;
  footer: string;
  readme: string;
  avisos: AvisoCheckout[];
}

/**
 * Os códigos com que o compose diz que NÃO embutiu o logo (gate0 #17): o
 * header sai com `{{LOGO_SRC}}` para o time trocar à mão. Aviso, não erro — o
 * logo é dado global da loja, como o nível 2 (#14b).
 */
export const LOGO_RECUSADO = new Set(['logo-invalido', 'logo-grande']);
export const logoRecusado = (avisos: AvisoCheckout[]) =>
  avisos.find(a => LOGO_RECUSADO.has(a.codigo)) ?? null;

/**
 * O compose do lib vendorizado com os níveis já filtrados — o que o PREVIEW
 * mostra (header e footer nos slots; o arquivo composto na prova de
 * equivalência do funil).
 *
 * Só lança `ErroCompose` pelo que é exclusivo do checkout (gate0 #14b): papel
 * desconhecido, nível 1 inválido, modelo ou template quebrado. Nível 2 e logo
 * inválidos voltam em `avisos` (`nivel2-invalido`, `guarda-visibilidade`,
 * `logo-invalido`, `logo-grande`, `logo-pesado`) — o preview troca o logo
 * recusado pelo de exemplo (ver `logoRecusado`).
 */
export function comporCheckout(
  base: BaseDoModelo,
  {
    level2,
    level1,
    logo,
    version = CHECKOUT_VERSAO,
  }: {
    level2: Record<string, string>;
    level1: Record<string, string>;
    logo: string | null;
    version?: string | null;
  }
): CheckoutComposto {
  return compose(MODELO_CHECKOUT, base, {
    level2: nivel2DoPreview(level2),
    level1: variaveisValidas(level1),
    logo: logo || null,
    version,
  }) as CheckoutComposto;
}

/**
 * O compose SEM filtro: exatamente o que o generator vai rodar com o config
 * exportado (`faststore.variables` cru). O export chama para conferir antes de
 * entregar: o que lança aqui a VALIDATE do generator recusa; os `avisos` (nível
 * 2 inválido, guarda de visibilidade, logo recusado) o generator também dá, sem
 * abortar.
 */
export function comporParaExport(
  base: BaseDoModelo,
  opcoes: {
    level2: Record<string, string>;
    level1: Record<string, string>;
    logo: string | null;
    version: string | null;
  }
): CheckoutComposto {
  return compose(MODELO_CHECKOUT, base, opcoes) as CheckoutComposto;
}

/**
 * Reduz o logo para o header do checkout: até 280×64 em raster (PNG, mantém a
 * transparência e a proporção; nunca amplia). SVG passa como veio — escala sem
 * perda —, a não ser que estoure o teto do compose (`logo-grande`, 100 KB): aí
 * ele também vira PNG.
 *
 * Existe porque o upload aceita 2 MB (PanelBrandAssets) e o data URL vai INTEIRO
 * no template do Admin e em toda página do checkout.
 *
 * NUNCA lança, e só redesenha data URL. Um logo por URL (`https://…`) vai como
 * veio: o compose aceita URL https e o header o limita a 32 px de altura, e
 * desenhar imagem de outra origem num canvas o "suja" — o `toDataURL` lançaria
 * SecurityError e derrubaria o export. Qualquer outra coisa também vai como veio:
 * quem decide é o compose, que avisa (`logo-invalido`, gate0 #17) e deixa o
 * `{{LOGO_SRC}}` no header, e o preview mostra o logo de exemplo no lugar. Só o
 * data URL que nem decodifica vira "sem logo" (''), como antes.
 */
export async function reduzirLogo(src: string): Promise<string> {
  if (!src) return '';
  if (!/^data:image\//i.test(src)) return src;
  const svg = /^data:image\/svg\+xml/i.test(src);
  const cabe = src.length <= MODELO_CHECKOUT.limites.logoErroBytes;
  if (svg && cabe) return src;

  const img = new Image();
  img.src = src;
  try {
    await img.decode();
  } catch {
    // Data URL que não é imagem de verdade: sem logo (o compose avisa
    // `logo-ausente`), em vez de uma imagem quebrada no header entregue.
    return '';
  }
  try {
    const w0 = img.naturalWidth || LOGO_CHECKOUT_MAX.w;
    const h0 = img.naturalHeight || LOGO_CHECKOUT_MAX.h;
    const escala = Math.min(
      1,
      LOGO_CHECKOUT_MAX.w / w0,
      LOGO_CHECKOUT_MAX.h / h0
    );
    // Raster que já cabe na caixa passa como veio, se couber no teto do compose.
    if (escala === 1 && !svg && cabe) return src;

    const w = Math.max(1, Math.round(w0 * escala));
    const h = Math.max(1, Math.round(h0 * escala));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return src;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL('image/png');
  } catch {
    // Canvas indisponível ou recusado: vai como veio, e o compose diz se serve.
    return src;
  }
}

/**
 * O snapshot do `/p/{id}` tem checkout? Só tema VTEX com o bloco. O POST do
 * preview grava o que vier, então um snapshot Tray/Wake com `checkout` (feito à
 * mão) não abre o checkout nem ganha as etapas no menu: o checkout-vtex é o
 * checkout nativo da VTEX.
 */
export function snapshotTemCheckout(snapshot: {
  platform: string | null;
  checkout?: unknown;
}): boolean {
  return snapshot.platform === 'VTEX' && !!snapshot.checkout;
}

/** O bloco `faststore.checkout` do config.json. Sempre presente em VTEX. */
export function blocoDoConfig(checkout: CheckoutState) {
  return {
    model: checkout.model,
    version: CHECKOUT_VERSAO,
    variables: variaveisValidas(checkout.variables),
  };
}

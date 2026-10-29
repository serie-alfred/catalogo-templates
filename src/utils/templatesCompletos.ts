import {
  LAYOUTS,
  type LayoutItem,
  type LayoutKey,
  type Pagina,
} from '@/data/layoutData';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';
import type { Platform } from '@/types/platform';
import type { FrameColors, FrameFonts } from '@/types/frameMessage';
import { contrastOn } from './themeStyle';
import {
  COMMON_SINGLETON_SELECTIONS,
  NON_DUPLICABLE_SELECTIONS,
} from './sectionRules';

/**
 * "Por template": o cliente escolhe uma FAMÍLIA inteira (o valor de `template`
 * dos itens do catálogo) e recebe todos os slots preenchidos com ela.
 *
 * A lista de templates é DERIVADA do catálogo, não escrita à mão: família nova
 * que entrar no `layoutData.ts` aparece aqui sozinha quando for completa.
 *
 * Regra de "completo": a família cobre, NA PLATAFORMA ESCOLHIDA, todos os slots
 * de `SLOTS_OBRIGATORIOS` — o que o catálogo já trata como estrutura de página:
 *   - common: os singletons comuns de `sectionRules` (header, footer,
 *     breadcrumb, spot), que toda página carrega;
 *   - home: a abertura (`banner-main`, singleton) e a vitrine (`showcase`, a
 *     única peça da home que mostra produto, com o spot da família);
 *   - category / product: o singleton que É a página — a grade da PLP
 *     (`category-main`) e a compra da PDP (`product-info`).
 * Família incompleta NÃO aparece: escolher um template promete uma loja
 * pronta, e uma página vazia ou com peça de outra família quebraria isso.
 */
export const SLOTS_OBRIGATORIOS: Record<Pagina, readonly string[]> = {
  common: [...COMMON_SINGLETON_SELECTIONS],
  home: ['banner-main', 'showcase'],
  category: ['category-main'],
  product: ['product-info'],
};

/** Nome das famílias 09 a 14 (`.familias-contrato.md`). As anteriores ficam
 *  com nome neutro — o repo é público, e o sufixo de algumas é um cliente. */
const NOMES: Record<string, string> = {
  '9': 'Editorial',
  '10': 'Varejo',
  '11': 'Grade',
  '12': 'Suave',
  '13': 'Noturno',
  '14': 'Esportiva',
  '15': 'Luxo',
  '16': 'Infantil',
};

/**
 * Ordem padrão das seções em cada página. A da home segue o mapa do desenho das
 * famílias 09–13 (`design-familias-09-13/README.md`): abertura, régua,
 * categorias, vitrines, banners, editorial, depoimentos, marcas, newsletter.
 * Pop-up e ajuda flutuante vão por último: são camadas, não blocos da página.
 * Slot fora da lista entra depois dos conhecidos, na ordem do catálogo.
 */
const ORDEM: Record<Pagina, readonly string[]> = {
  common: ['header', 'breadcrumb', 'spot', 'footer'],
  home: [
    'banner-main',
    'banner-full',
    'home-carousel',
    'ruler',
    'categories',
    'multi-categories',
    'showcase',
    'banner-grid',
    'countdown',
    'banner-side',
    'editorial',
    'client-review',
    'brands',
    'newsletter',
  ],
  category: [
    'category-title',
    'category-banner',
    'category-main',
    'category-description',
  ],
  product: [
    'banner-top',
    'product-info',
    'product-description',
    'product-banner',
    'product-reviews',
    'product-related',
  ],
};
const CAMADAS = ['popup-news', 'help-float'];

/**
 * A "cara" de cada família: os tokens globais (Nível 2) e as fontes do desenho,
 * aplicados junto com as peças. Só as cores AUTORAIS — as três de texto sobre
 * fundo (`--text-color-base`, `--text-color-secundary`, `--text-tertiary-color`)
 * o editor deriva do fundo por contraste. Token que a família não usa fica como
 * está. Família sem entrada (01–08) mantém a paleta e as fontes atuais.
 *
 * GERADO, não escrito à mão (script do kit das famílias, fora do repo): para
 * cada token, os hex que a tabela "Nível 1 → Nível 2" dos `_bases/<Comp>NN/
 * notas.md` do faststore.starter liga a ele; fica o da paleta do contrato
 * (`.familias-contrato.md` §1) e, num token de FUNDO, o que os papéis de fundo
 * (`*-bg`) usam — acento e tag que caem num token de fundo pintam letra, não
 * área —, e entre esses o mais votado. O comentário de cada linha traz os votos.
 * Fontes = contrato §1 (título → primária; texto → secundária e terciária). A 13 não herda a marca
 * (o SCSS dela não lê token de cor nem de fonte): só as fontes, para o tema
 * global ficar coerente se o usuário trocar uma peça por outra família.
 */
export type CoresDoTema = Partial<
  Record<
    | 'colorPrimary'
    | 'colorSecondary'
    | 'colorPrimaryBackground'
    | 'colorSecondaryBackground'
    | 'colorTertiaryBackground'
    | 'colorFooter'
    | 'colorFooterText',
    string
  >
>;
export type TemaDaFamilia = {
  colors?: CoresDoTema;
  fonts?: { fontPrimary: string; fontSecondary: string; fontTertiary: string };
};

export const TEMA_DAS_FAMILIAS: Record<string, TemaDaFamilia> = {
  '9': {
    colors: {
      colorFooter: '#f7f4ef', // --background-footer: #F7F4EF×1 [só papéis de fundo: #F7F4EF×1]
      colorFooterText: '#1d1b18', // --text-color-footer: #1D1B18×1 #9C4A2F×1
      colorPrimary: '#1d1b18', // --text-primary-color: #1D1B18×31 #5E574F×1 [fora da paleta do contrato: #5E574F]
      colorPrimaryBackground: '#1d1b18', // --background-primary-color: #9C4A2F×8 #1D1B18×5 #F7F4EF×1 [só papéis de fundo: #1D1B18×5 #F7F4EF×1]
      colorSecondaryBackground: '#1d1b18', // --background-secundary-color: #1D1B18×1 [só papéis de fundo: #1D1B18×1]
    },
    fonts: {
      fontPrimary: 'Fraunces',
      fontSecondary: 'Figtree',
      fontTertiary: 'Figtree',
    },
  },
  '10': {
    colors: {
      colorFooter: '#ffffff', // --background-footer: #FFFFFF×1 [só papéis de fundo: #FFFFFF×1]
      colorFooterText: '#101828', // --text-color-footer: #101828×1
      colorPrimary: '#101828', // --text-primary-color: #101828×23 #475467×1 [fora da paleta do contrato: #475467]
      colorPrimaryBackground: '#1340d8', // --background-primary-color: #1340D8×22 #FFFFFF×1 [fora da paleta do contrato: #FFFFFF] [só papéis de fundo: #1340D8×7]
      colorSecondaryBackground: '#1340d8', // --background-secundary-color: #1340D8×4 #FFCF24×2 [só papéis de fundo: #FFCF24×1 #1340D8×3]
      colorTertiaryBackground: '#ffcf24', // --background-tertiary-color: #FFCF24×4 #D92D20×4 [fora da paleta do contrato: #D92D20] [só papéis de fundo: #FFCF24×2]
    },
    fonts: {
      fontPrimary: 'Archivo',
      fontSecondary: 'Archivo',
      fontTertiary: 'Archivo',
    },
  },
  '11': {
    colors: {
      colorFooter: '#ffffff', // --background-footer: #FFFFFF×1 [só papéis de fundo: #FFFFFF×1]
      colorFooterText: '#0a0a0a', // --text-color-footer: #0A0A0A×1
      colorPrimary: '#0a0a0a', // --text-primary-color: #0A0A0A×34
      colorPrimaryBackground: '#0a0a0a', // --background-primary-color: #0A0A0A×10 #FF4F00×5 #FFFFFF×1 [só papéis de fundo: #FF4F00×1 #0A0A0A×7 #FFFFFF×1]
      colorSecondaryBackground: '#ffffff', // --background-secundary-color: #FFFFFF×1 [só papéis de fundo: #FFFFFF×1]
      colorTertiaryBackground: '#0a0a0a', // --background-tertiary-color: #FF4F00×2 #0A0A0A×1 [só papéis de fundo: #0A0A0A×1]
    },
    fonts: {
      fontPrimary: 'Geist',
      fontSecondary: 'Geist Mono',
      fontTertiary: 'Geist Mono',
    },
  },
  '12': {
    colors: {
      colorFooter: '#f4dcd6', // --background-footer: #F4DCD6×1 [só papéis de fundo: #F4DCD6×1]
      colorFooterText: '#3b1f33', // --text-color-footer: #3B1F33×1
      colorPrimary: '#3b1f33', // --text-primary-color: #3B1F33×27
      colorPrimaryBackground: '#7a2e5f', // --background-primary-color: #7A2E5F×23 [só papéis de fundo: #7A2E5F×8]
      colorSecondaryBackground: '#f4dcd6', // --background-secundary-color: #F4DCD6×5 [só papéis de fundo: #F4DCD6×4]
      colorTertiaryBackground: '#dce6da', // --background-tertiary-color: #DCE6DA×3 [só papéis de fundo: #DCE6DA×3]
    },
    fonts: {
      fontPrimary: 'Young Serif',
      fontSecondary: 'Nunito Sans',
      fontTertiary: 'Nunito Sans',
    },
  },
  '13': {
    fonts: {
      fontPrimary: 'Barlow Condensed',
      fontSecondary: 'Barlow',
      fontTertiary: 'Barlow',
    },
  },
  '14': {
    colors: {
      colorFooter: '#0b1b33', // --background-footer: #0B1B33×1 [só papéis de fundo: #0B1B33×1]
      colorFooterText: '#ffffff', // --text-color-footer: #FFFFFF×1 #D9F99D×1
      colorPrimary: '#0b1b33', // --text-primary-color: #0B1B33×25
      colorPrimaryBackground: '#e4002b', // --background-primary-color: #E4002B×22 #0B1B33×1 [só papéis de fundo: #E4002B×6 #0B1B33×1]
      colorSecondaryBackground: '#0b1b33', // --background-secundary-color: #0B1B33×8 #D9F99D×1 [só papéis de fundo: #0B1B33×6]
      colorTertiaryBackground: '#d9f99d', // --background-tertiary-color: #D9F99D×2 [só papéis de fundo: #D9F99D×1]
    },
    fonts: {
      fontPrimary: 'Saira',
      fontSecondary: 'Inter',
      fontTertiary: 'Inter',
    },
  },
  '15': {
    colors: {
      colorFooter: '#1a1714', // --background-footer: #1A1714×1 [só papéis de fundo: #1A1714×1]
      colorFooterText: '#faf8f4', // --text-color-footer: #FAF8F4×1 #C9A961×1 [fora da paleta do contrato: #C9A961]
      colorPrimary: '#1a1714', // --text-primary-color: #1A1714×27 #4A433C×1 [fora da paleta do contrato: #4A433C]
      colorPrimaryBackground: '#1a1714', // --background-primary-color: #7A5F1C×19 #1A1714×7 #FAF8F4×1 [só papéis de fundo: #7A5F1C×2 #1A1714×6 #FAF8F4×1]
      colorSecondaryBackground: '#1a1714', // --background-secundary-color: #1A1714×1 [só papéis de fundo: #1A1714×1]
    },
    fonts: {
      fontPrimary: 'Cormorant Garamond',
      fontSecondary: 'Manrope',
      fontTertiary: 'Manrope',
    },
  },
  '16': {
    colors: {
      colorFooter: '#2a2350', // --background-footer: #2A2350×1 [só papéis de fundo: #2A2350×1]
      colorFooterText: '#fffbf2', // --text-color-footer: #FFFBF2×1
      colorPrimary: '#2a2350', // --text-primary-color: #2A2350×22
      colorPrimaryBackground: '#5b4bdb', // --background-primary-color: #5B4BDB×23 [só papéis de fundo: #5B4BDB×8]
      colorSecondaryBackground: '#ffc93c', // --background-secundary-color: #FFC93C×6 #22B8A7×1 [só papéis de fundo: #FFC93C×4 #22B8A7×1]
      colorTertiaryBackground: '#ff6f61', // --background-tertiary-color: #FF6F61×4 #FFC93C×2 #22B8A7×1 [só papéis de fundo: #FF6F61×2 #FFC93C×1]
    },
    fonts: {
      fontPrimary: 'Fredoka',
      fontSecondary: 'Nunito',
      fontTertiary: 'Nunito',
    },
  },
};

/**
 * As variáveis de NÍVEL 1 que a peça precisa para bater com o desenho DEPOIS do
 * tema da família: onde o token de Nível 2 serve a vários papéis do desenho (na
 * 09, `--background-primary-color` é o fundo do header, o botão e o acento), um
 * valor só não acerta todos. Aplicadas como `variables` da seção — o painel da
 * direita as mostra como cor própria, com o reset de sempre — e exportadas por
 * componente, como qualquer escolha do usuário.
 *
 * GERADO (script do kit das famílias, fora do repo): para cada var de cor do
 * `variablesSchema`, o hex do desenho é o `default`; o valor que ela resolve sai
 * das cadeias `var(--<n1>, var(--<token>, #hex))` do CSS das réplicas com o token
 * avaliado em `TEMA_DAS_FAMILIAS` (derivadas pelo contraste). Só entra o que
 * diverge — ou cujo token o tema não define. Chave: o `component` do item.
 * A 13 não tem entrada, e o script confirma: o SCSS dela não tem Nível 2 de cor
 * (`var(--<n1>, #hex)`), então toda var já cai no hex do desenho sem ajuda.
 */
export const NIVEL1_DAS_FAMILIAS: Record<
  string,
  Record<string, Record<string, string>>
> = {
  '9': {
    Header09: {
      '--header-topbar-text': '#f7f4ef',
      '--header-bg': '#f7f4ef',
      '--header-text': '#1d1b18',
      '--header-accent': '#9c4a2f',
    },
    Spot09: {
      '--spot-tag-text': '#9c4a2f',
      '--spot-btn-text': '#f7f4ef',
    },
    Footer09: {
      '--footer-accent': '#9c4a2f',
    },
    ShelfBanner09: {
      '--showcase-tag-text': '#9c4a2f',
    },
    Showcase09: {
      '--showcase-tag-text': '#9c4a2f',
    },
    HelpFloat09: {
      '--help-header-text': '#f7f4ef',
    },
    PopupNews09: {
      '--popup-button-text': '#f7f4ef',
    },
    Newsletter09: {
      '--newsletter-desc-color': '#5e574f',
    },
    CategoryMain09: {
      '--cat-main-accent': '#9c4a2f',
    },
    ProductInfo09: {
      '--pdp-accent': '#9c4a2f',
      '--pdp-button-text': '#f7f4ef',
    },
    ProductReviews09: {
      '--prod-reviews-accent': '#9c4a2f',
    },
    ProductRelated09: {
      '--showcase-tag-text': '#9c4a2f',
    },
    Countdown09: {
      '--countdown-accent': '#9c4a2f',
    },
  },
  '10': {
    Header10: {
      '--header-bg': '#ffffff',
      '--header-text': '#101828',
      '--header-accent-text': '#101828',
    },
    Spot10: {
      '--spot-tag-bg': '#d92d20',
      '--spot-tag-text': '#ffffff',
    },
    Footer10: {
      '--footer-legal-text': '#475467',
    },
    BannerMain10: {
      '--banner-main-button-text': '#101828',
    },
    ShelfBanner10: {
      '--showcase-tag-bg': '#d92d20',
      '--showcase-tag-text': '#ffffff',
    },
    Showcase10: {
      '--showcase-tag-bg': '#d92d20',
      '--showcase-tag-text': '#ffffff',
    },
    PopupNews10: {
      '--popup-accent': '#ffcf24',
    },
    Newsletter10: {
      '--newsletter-button-text': '#101828',
    },
    ProductRelated10: {
      '--showcase-tag-bg': '#d92d20',
      '--showcase-tag-text': '#ffffff',
    },
    Countdown10: {
      '--countdown-bg': '#ffcf24',
      '--countdown-text': '#101828',
    },
  },
  '11': {
    Header11: {
      '--header-bg': '#ffffff',
      '--header-text': '#0a0a0a',
      '--header-accent': '#ff4f00',
      '--header-accent-text': '#0a0a0a',
    },
    Spot11: {
      '--spot-btn-bg': '#ff4f00',
      '--spot-btn-text': '#0a0a0a',
    },
    BannerMain11: {
      '--banner-main-accent': '#ff4f00',
    },
    BannerGrid11: {
      '--banner-grid-accent': '#ff4f00',
      '--banner-grid-accent-text': '#0a0a0a',
    },
    CategoryMain11: {
      '--cat-main-accent': '#ff4f00',
    },
    ProductInfo11: {
      '--pdp-accent': '#ff4f00',
    },
    Countdown11: {
      '--countdown-accent': '#ff4f00',
      '--countdown-accent-text': '#0a0a0a',
    },
  },
  '12': {
    Header12: {
      '--header-text': '#3b1f33',
    },
    Spot12: {
      '--spot-tag-text': '#3b1f33',
    },
    Breadcrumb12: {
      '--breadcrumb-text': '#3b1f33',
    },
    BannerMain12: {
      '--banner-main-text': '#3b1f33',
    },
    ShelfBanner12: {
      '--showcase-tag-text': '#3b1f33',
    },
    Showcase12: {
      '--showcase-tag-text': '#3b1f33',
    },
    Newsletter12: {
      '--newsletter-title-color': '#3b1f33',
    },
    CategoryDescription12: {
      '--cat-desc-text': '#3b1f33',
    },
    ProductRelated12: {
      '--showcase-tag-text': '#3b1f33',
    },
  },
  '14': {
    Spot14: {
      '--spot-tag-text': '#0b1b33',
    },
    Footer14: {
      '--footer-accent': '#d9f99d',
    },
    BannerMain14: {
      '--banner-main-accent': '#d9f99d',
    },
    Showcase14: {
      '--showcase-tag-bg': '#d9f99d',
      '--showcase-tag-text': '#0b1b33',
    },
    HelpFloat14: {
      '--help-header-bg': '#0b1b33',
    },
    PopupNews14: {
      '--popup-accent': '#d9f99d',
    },
    Countdown14: {
      '--countdown-accent': '#d9f99d',
    },
  },
  '15': {
    Header15: {
      '--header-bg': '#faf8f4',
      '--header-text': '#1a1714',
      '--header-accent': '#7a5f1c',
      '--header-topbar-text': '#faf8f4',
    },
    Spot15: {
      '--spot-tag-bg': '#7a5f1c',
      '--spot-tag-text': '#faf8f4',
      '--spot-btn-text': '#faf8f4',
    },
    Breadcrumb15: {
      '--breadcrumb-accent': '#7a5f1c',
    },
    Footer15: {
      '--footer-accent': '#c9a961',
    },
    Brand15: {
      '--brands-accent': '#7a5f1c',
    },
    Categories15: {
      '--categories-accent': '#7a5f1c',
    },
    BannerMain15: {
      '--banner-main-text': '#faf8f4',
      '--banner-main-button-bg': '#faf8f4',
    },
    Ruler15: {
      '--ruler-icon': '#7a5f1c',
    },
    BannerGrid15: {
      '--banner-grid-accent': '#7a5f1c',
    },
    ShelfBanner15: {
      '--banner-side-text': '#faf8f4',
      '--showcase-accent': '#7a5f1c',
      '--showcase-tag-bg': '#7a5f1c',
    },
    Showcase15: {
      '--showcase-accent': '#7a5f1c',
      '--showcase-tag-bg': '#7a5f1c',
    },
    CategoryTitle15: {
      '--cat-title-accent': '#7a5f1c',
    },
    HelpFloat15: {
      '--help-header-text': '#faf8f4',
    },
    PopupNews15: {
      '--popup-button-bg': '#7a5f1c',
      '--popup-button-text': '#faf8f4',
    },
    Newsletter15: {
      '--newsletter-desc-color': '#4a433c',
      '--newsletter-button-text': '#faf8f4',
    },
    ClientReview15: {
      '--socialproof-accent': '#7a5f1c',
    },
    CategoryMain15: {
      '--cat-main-accent': '#7a5f1c',
    },
    CategoryDescription15: {
      '--cat-desc-accent': '#7a5f1c',
    },
    ProductDescription15: {
      '--prod-desc-accent': '#7a5f1c',
    },
    ProductInfo15: {
      '--pdp-accent': '#7a5f1c',
      '--pdp-button-text': '#faf8f4',
    },
    ProductReviews15: {
      '--prod-reviews-accent': '#7a5f1c',
    },
    ProductRelated15: {
      '--showcase-accent': '#7a5f1c',
    },
    Countdown15: {
      '--countdown-accent': '#7a5f1c',
    },
    Editorial15: {
      '--editorial-accent': '#7a5f1c',
    },
  },
  '16': {
    Header16: {
      '--header-text': '#2a2350',
      '--header-topbar-text': '#2a2350',
    },
    Spot16: {
      '--spot-tag-bg': '#ffc93c',
      '--spot-tag-text': '#2a2350',
    },
    Breadcrumb16: {
      '--breadcrumb-bg': '#fffbf2',
    },
    BannerMain16: {
      '--banner-main-text': '#2a2350',
    },
    Ruler16: {
      '--ruler-bg': '#22b8a7',
      '--ruler-text': '#2a2350',
    },
    ShelfBanner16: {
      '--banner-side-text': '#2a2350',
      '--showcase-tag-bg': '#ffc93c',
    },
    Showcase16: {
      '--showcase-tag-bg': '#ffc93c',
    },
    CategoryTitle16: {
      '--cat-title-text': '#2a2350',
    },
    PopupNews16: {
      '--popup-text': '#2a2350',
    },
    Newsletter16: {
      '--newsletter-button-text': '#2a2350',
    },
    ProductDescription16: {
      '--prod-desc-text': '#2a2350',
      '--prod-desc-accent': '#22b8a7',
    },
    ProductInfo16: {
      '--pdp-text': '#2a2350',
      '--pdp-accent': '#ffc93c',
    },
    Countdown16: {
      '--countdown-accent-text': '#2a2350',
    },
  },
};

export type TemplateCompleto = {
  /** Valor de `template` no catálogo ("9"). */
  template: string;
  /** "09 · Editorial" ou "Template 01". */
  nome: string;
  /** Itens da família na plataforma, um por peça, já na ordem de aplicação. */
  itens: { layoutKey: LayoutKey; item: LayoutItem }[];
  /** Thumbs da prévia: header, banner principal, vitrine e footer. */
  previa: string[];
  /** Paleta e fontes globais do desenho, quando a família tem. */
  tema?: TemaDaFamilia;
  /** Quantas peças ganham variáveis de Nível 1 próprias (NIVEL1_DAS_FAMILIAS). */
  comCorPropria: number;
};

function pad(template: string) {
  return template.padStart(2, '0');
}

export function nomeDoTemplate(template: string): string {
  const nome = NOMES[template];
  return nome ? `${pad(template)} · ${nome}` : `Template ${pad(template)}`;
}

function posicao(item: LayoutItem): number {
  const pagina = item.pagina[0];
  const lista = ORDEM[pagina] ?? [];
  const i = lista.indexOf(item.selection);
  if (i >= 0) return i;
  if (CAMADAS.includes(item.selection))
    return 2000 + CAMADAS.indexOf(item.selection);
  return 1000;
}

/** Os itens de uma família numa plataforma, sem slot singleton repetido. */
function itensDaFamilia(template: string, platform: Platform) {
  const todos = (Object.keys(LAYOUTS) as LayoutKey[]).flatMap(layoutKey =>
    LAYOUTS[layoutKey].items
      .filter(i => i.template === template && i.platforms.includes(platform))
      .map(item => ({ layoutKey, item }))
  );
  const vistos = new Set<string>();
  const unicos = todos.filter(({ item }) => {
    const unico =
      NON_DUPLICABLE_SELECTIONS.has(item.selection) ||
      item.selection === 'showcase';
    if (!unico) return true;
    const chave = `${item.pagina[0]}:${item.selection}`;
    if (vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
  // `sort` é estável: empate mantém a ordem do catálogo.
  return unicos.sort((a, b) => posicao(a.item) - posicao(b.item));
}

function completa(itens: { item: LayoutItem }[]): boolean {
  return (Object.keys(SLOTS_OBRIGATORIOS) as Pagina[]).every(pagina =>
    SLOTS_OBRIGATORIOS[pagina].every(sel =>
      itens.some(
        ({ item }) => item.selection === sel && item.pagina.includes(pagina)
      )
    )
  );
}

/** Templates completos na plataforma, do mais novo para o mais antigo. */
export function templatesCompletos(
  platform: Platform | null
): TemplateCompleto[] {
  if (!platform) return [];
  const familias = new Set(
    Object.values(LAYOUTS).flatMap(s => s.items.map(i => i.template))
  );
  return [...familias]
    .map(template => ({ template, itens: itensDaFamilia(template, platform) }))
    .filter(({ itens }) => completa(itens))
    .sort((a, b) => Number(b.template) - Number(a.template))
    .map(({ template, itens }) => {
      const thumb = (sel: string) =>
        itens.find(({ item }) => item.selection === sel)?.item.image ?? '';
      return {
        template,
        nome: nomeDoTemplate(template),
        itens,
        tema: TEMA_DAS_FAMILIAS[template],
        comCorPropria: itens.filter(
          ({ item }) => NIVEL1_DAS_FAMILIAS[template]?.[item.component]
        ).length,
        previa: ['header', 'banner-main', 'showcase', 'footer']
          .map(thumb)
          .filter(Boolean),
      };
    });
}

/**
 * A paleta e as fontes com que a família fica, partindo de `base`: a mesma
 * regra do `vestirTemplate` do editor — a família sobrepõe só o que define, e as
 * três cores de texto sobre fundo saem do contraste com o fundo resultante. A
 * vitrine `/templates` passa `TEMA_INICIAL`, que é com o que uma aba nova do
 * editor aplica a família; o estágio `2-vitrine` do funil compara os dois.
 */
export function temaDoTemplate(
  t: TemplateCompleto,
  base: { colors: FrameColors; fonts: FrameFonts }
): { colors: FrameColors; fonts: FrameFonts } {
  const cores = { ...base.colors, ...t.tema?.colors };
  return {
    colors: {
      ...cores,
      colorPrimaryText: contrastOn(cores.colorPrimaryBackground),
      colorSecondaryText: contrastOn(cores.colorSecondaryBackground),
      colorTertiary: contrastOn(cores.colorTertiaryBackground),
    },
    fonts: t.tema?.fonts ?? base.fonts,
  };
}

/** As seções da loja com a família inteira, em todas as páginas. */
export function selecoesDoTemplate(t: TemplateCompleto): LayoutSelection[] {
  return t.itens.map(({ layoutKey, item }) => {
    const variables = NIVEL1_DAS_FAMILIAS[t.template]?.[item.component];
    return {
      uid: crypto.randomUUID(),
      id: item.id,
      layoutKey,
      pagina: item.pagina[0],
      // Cópia: o objeto do mapa não pode virar estado mutável de uma seção.
      ...(variables ? { variables: { ...variables } } : {}),
    };
  });
}

/**
 * Com o que uma aba NOVA do /gerador abre: a plataforma e o template completo
 * aplicados de saída, para o editor não começar numa tela vazia. Trocar aqui
 * muda a entrada de todo mundo; `template` aceita "09" ou "9".
 *
 * Só vale para a aba que começa sem nada (ver `abaSemTrabalho` em
 * utils/editorStorage.ts e a hidratação em useLayoutGenerator): recarregar, o
 * "Editar" do /p e um tema reaberto do histórico nunca passam por aqui.
 */
export const ENTRADA_PADRAO: { platform: Platform; template: string } = {
  platform: 'VTEX',
  template: '09', // 09 · Editorial
};

/**
 * O template de `ENTRADA_PADRAO`, se ele for completo na plataforma. Se deixar
 * de ser (catálogo mudou), null: o editor abre vazio, com o convite do canvas.
 */
export function templatePadrao(): TemplateCompleto | null {
  const alvo = Number(ENTRADA_PADRAO.template);
  return (
    templatesCompletos(ENTRADA_PADRAO.platform).find(
      t => Number(t.template) === alvo
    ) ?? null
  );
}

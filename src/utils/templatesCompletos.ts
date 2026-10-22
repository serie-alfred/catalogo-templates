import {
  LAYOUTS,
  type LayoutItem,
  type LayoutKey,
  type Pagina,
} from '@/data/layoutData';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';
import type { Platform } from '@/types/platform';
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

/** Nome das famílias 09 a 13 (`.familias-contrato.md`). As anteriores ficam
 *  com nome neutro — o repo é público, e o sufixo de algumas é um cliente. */
const NOMES: Record<string, string> = {
  '9': 'Editorial',
  '10': 'Varejo',
  '11': 'Grade',
  '12': 'Suave',
  '13': 'Noturno',
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

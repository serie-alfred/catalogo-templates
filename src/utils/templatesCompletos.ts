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

export type TemplateCompleto = {
  /** Valor de `template` no catálogo ("9"). */
  template: string;
  /** "09 · Editorial" ou "Template 01". */
  nome: string;
  /** Itens da família na plataforma, um por peça, já na ordem de aplicação. */
  itens: { layoutKey: LayoutKey; item: LayoutItem }[];
  /** Thumbs da prévia: header, banner principal, vitrine e footer. */
  previa: string[];
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
        previa: ['header', 'banner-main', 'showcase', 'footer']
          .map(thumb)
          .filter(Boolean),
      };
    });
}

/** As seções da loja com a família inteira, em todas as páginas. */
export function selecoesDoTemplate(t: TemplateCompleto): LayoutSelection[] {
  return t.itens.map(({ layoutKey, item }) => ({
    uid: crypto.randomUUID(),
    id: item.id,
    layoutKey,
    pagina: item.pagina[0],
  }));
}

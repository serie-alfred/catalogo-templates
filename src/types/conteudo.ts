/**
 * Conteúdo real do cliente (textos, imagens, menus, produtos) — os tipos.
 *
 * Três níveis, como as cores:
 *  - Nível 1 (`ConteudoDaSecao`): o que o CS mudou NESTA seção, nas chaves do
 *    schema do componente (as do `section.schema` do starter). Mora em
 *    `LayoutSelection.content`, vai no tema, no undo e no snapshot do preview.
 *  - Nível 2 (`ConteudoLoja` + `Produto`): o conteúdo da loja do cliente,
 *    compartilhado por todas as seções; sobrevive à troca de template.
 *  - Nível 3: o `MOCK` do componente (= `mock.ts` do starter).
 *
 * Quem resolve os três é `resolverConteudo` (src/utils/conteudo.ts), a mesma
 * função para o canvas, o /p e o palco do export.
 */

/** Valor de um campo de conteúdo: JSON puro (vai para storage e postMessage). */
export type ValorDeConteudo =
  | string
  | number
  | boolean
  | ValorDeConteudo[]
  | { [chave: string]: ValorDeConteudo };

/**
 * Nível 1: os campos que o CS mudou numa seção. Esparso — campo ausente herda;
 * campo presente vale, mesmo vazio (`''` some com o texto, `[]` esvazia a lista).
 */
export type ConteudoDaSecao = { [campo: string]: ValorDeConteudo };

/**
 * Um nó do schema de conteúdo: o subconjunto do JSON Schema do CMS da VTEX que
 * os manifests do starter usam. `yarn derivar:conteudo` copia só estas chaves.
 */
export interface CampoDoSchema {
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';
  title?: string;
  description?: string;
  default?: ValorDeConteudo;
  enum?: (string | number)[];
  enumNames?: string[];
  /** `image-uploader`, `media-gallery` ou `textarea`. */
  widget?: { 'ui:widget'?: string; restrictMediaTypes?: unknown };
  /** Dois campos antigos dizem `textarea` aqui em vez do widget. */
  format?: string;
  items?: CampoDoSchema;
  properties?: Record<string, CampoDoSchema>;
  required?: string[];
  minItems?: number;
  maxItems?: number;
  minimum?: number;
  maximum?: number;
}

/** A raiz do schema de um componente. */
export interface SchemaDeConteudo extends CampoDoSchema {
  type: 'object';
  properties: Record<string, CampoDoSchema>;
}

/* ── Nível 2 (fase 2 e 3 do plano): contrato do conteúdo da loja ─────────── */

export interface LinkDaLoja {
  label: string;
  url: string;
}

export interface ItemDeMenu extends LinkDaLoja {
  highlight?: boolean;
  image?: string;
  children?: ItemDeMenu[];
}

export interface GrupoDeLinks {
  title: string;
  links: LinkDaLoja[];
}

export interface ImagemDaLoja {
  src: string;
  alt?: string;
  url?: string;
}

export interface SlideDaLoja {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  url?: string;
  eyebrow?: string;
  title?: string;
  titleEmphasis?: string;
  text?: string;
  ctaLabel?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
}

export interface CategoriaDaLoja {
  id: string;
  label: string;
  url?: string;
  image?: string;
  children?: CategoriaDaLoja[];
}

export interface ColecaoDaLoja {
  id: string;
  nome: string;
  produtoIds: string[];
}

export type RedeSocial =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'youtube'
  | 'pinterest'
  | 'x'
  | 'linkedin'
  | 'whatsapp';

/** O conteúdo da loja do cliente (Nível 2). Os campos de item seguem o vocabulário do starter. */
export interface ConteudoLoja {
  versao: 1;
  nomeDaLoja?: string;
  avisos?: { text: string; url?: string }[];
  menus?: {
    principal?: ItemDeMenu[];
    rodape?: GrupoDeLinks[];
    institucional?: LinkDaLoja[];
  };
  contato?: {
    whatsapp?: string;
    phone?: string;
    email?: string;
    address?: string;
    hours?: string;
  };
  redes?: Partial<Record<RedeSocial, string>>;
  legal?: {
    razaoSocial?: string;
    cnpj?: string;
    endereco?: string;
    copyright?: string;
  };
  pagamentos?: ImagemDaLoja[];
  selos?: ImagemDaLoja[];
  bannersPrincipais?: SlideDaLoja[];
  categorias?: CategoriaDaLoja[];
  colecoes?: ColecaoDaLoja[];
  /** O que a PDP e a PLP do preview mostram. */
  destaques?: { produtoId?: string; categoriaId?: string };
}

/** Produto canônico do cliente; cada card converte com o `deProduto` da família. */
export interface Produto {
  id: string;
  name: string;
  url?: string;
  images: string[];
  price: number;
  listPrice?: number;
  installments?: { count: number; value: number };
  inStock: boolean;
  brand?: string;
  badge?: string;
  categoryIds?: string[];
  /** Texto puro (sem HTML): o /p é público. */
  description?: string;
  specs?: { name: string; value: string }[];
  variants?: {
    name: string;
    options: { label: string; color?: string; available?: boolean }[];
  }[];
  rating?: { value: number; count: number };
}

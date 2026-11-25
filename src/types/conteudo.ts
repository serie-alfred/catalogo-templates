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

/* ── Nível 2: o conteúdo da loja ─────────────────────────────────────────── */

/*
 * As chaves de PRIMEIRO nível falam a língua do CS (`menuPrincipal`, `contato`);
 * as dos itens são as do starter (`label`, `url`, `children`, `network`,
 * `method`), as mesmas dos schemas das famílias 09–17. Assim a projeção para
 * uma seção (src/utils/conteudoLoja.ts) é quase sempre uma cópia, e o
 * formulário da loja usa os mesmos campos do painel de uma seção.
 *
 * Mora no TEMA, como as cores: aba, undo, temas salvos e snapshot do preview.
 * São poucos KB (as imagens são URLs do Blob). Os produtos, que pesam, ficam
 * fora (fase 3).
 */

export interface LinkDaLoja {
  label?: string;
  url?: string;
}

export interface ItemDeMenu extends LinkDaLoja {
  highlight?: boolean;
  image?: string;
  children?: LinkDaLoja[];
}

export interface GrupoDeLinks {
  title?: string;
  links?: (LinkDaLoja & { highlight?: boolean })[];
}

export interface AvisoDaLoja {
  text?: string;
  url?: string;
}

export interface ContatoDaLoja {
  whatsapp?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  horario?: string;
}

/** As redes que os rodapés 08–17 desenham (o `enum` do schema deles). */
export type RedeSocial = 'instagram' | 'facebook' | 'youtube' | 'x' | 'linkedin';

/** As bandeiras do `enum` de `payments[].method` dos rodapés 08–17. */
export type MetodoDePagamento =
  | 'visa'
  | 'mastercard'
  | 'elo'
  | 'amex'
  | 'hipercard'
  | 'diners'
  | 'aura'
  | 'pix'
  | 'boleto';

export interface SeloDaLoja {
  image?: string;
  label?: string;
  url?: string;
}

/** Um slide do banner principal: a união dos campos das famílias 09–17. */
export interface SlideDaLoja {
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
  eyebrow?: string;
  title?: string;
  text?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  secondaryLabel?: string;
  secondaryUrl?: string;
}

export interface CategoriaDaLoja {
  name?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
}

/**
 * Como o produto varia, e portanto como a PDP desenha o seletor: botões de
 * texto (tamanhos, voltagens), bolinhas/quadros de cor, ou miniaturas de
 * imagem (estampas, acabamentos). Produto sem variação some com o seletor.
 */
export type TipoDeVariacao = 'texto' | 'cor' | 'imagem';

export interface OpcaoDeVariacao {
  label?: string;
  /** Hex da cor (variação de cor). */
  color?: string;
  /** Miniatura (variação de imagem). */
  swatchImage?: string;
  /** Esgotada: a PDP a mostra riscada e oferece o "avise-me". Vazio = disponível. */
  soldOut?: boolean;
}

export interface VariacaoDoProduto {
  /** O nome que a PDP mostra ("Tamanho", "Cor", "Voltagem"). */
  name?: string;
  tipo?: TipoDeVariacao;
  options?: OpcaoDeVariacao[];
}

/**
 * Um produto do cliente, como o CS cadastra (tudo opcional: o formulário salva
 * pela metade). Quem desenha lê a forma normalizada (`ProdutoNormal`,
 * src/utils/produtos.ts), com os padrões aplicados.
 */
export interface ProdutoDaLoja {
  name?: string;
  images?: { productImage?: string }[];
  price?: number;
  /** Preço "de" (riscado); só aparece maior que o preço. */
  listPrice?: number;
  /** Parcelas sem juros; o valor de cada uma sai do preço quando não vem. */
  installments?: number;
  installmentValue?: number;
  /** Esgotado (o card mostra o "Avise-me"). Vazio = em estoque: o checkbox nasce desmarcado. */
  soldOut?: boolean;
  brand?: string;
  badge?: string;
  url?: string;
  /** Texto puro (sem HTML): o /p é público. Linha em branco separa parágrafos. */
  description?: string;
  /** A ficha técnica da página de produto ("Composição: 100% algodão"). */
  specs?: { name?: string; value?: string }[];
  variants?: VariacaoDoProduto[];
}

/** O conteúdo da loja do cliente (Nível 2). Campo ausente ou lista vazia = cada seção mostra o próprio. */
export interface ConteudoLoja {
  versao: 1;
  nomeDaLoja?: string;
  avisos?: AvisoDaLoja[];
  menuPrincipal?: ItemDeMenu[];
  menuRodape?: GrupoDeLinks[];
  linksLegais?: LinkDaLoja[];
  contato?: ContatoDaLoja;
  redes?: { network?: RedeSocial; url?: string }[];
  dadosLegais?: { razaoSocial?: string; cnpj?: string };
  pagamentos?: { method?: MetodoDePagamento }[];
  selos?: SeloDaLoja[];
  banners?: SlideDaLoja[];
  categorias?: CategoriaDaLoja[];
  /**
   * Os produtos do cliente: toda vitrine, grade de categoria, relacionados e
   * card os mostram, no formato do card escolhido; a PDP mostra o primeiro.
   * Até 200 (é um preview).
   */
  produtos?: ProdutoDaLoja[];
}

import type {
  ConteudoLoja,
  ProdutoDaLoja,
  TipoDeVariacao,
} from '@/types/conteudo';

/**
 * Os produtos do cliente (`ConteudoLoja.produtos`) prontos para desenhar.
 *
 * O CS cadastra pela metade (tudo é opcional no formulário); aqui sai a forma
 * completa, com os padrões aplicados, que cada família converte para o tipo do
 * próprio card (`deProdutoNN` no Spot da família). Uma regra só, para todas as
 * vitrines, grades, relacionados e PDPs.
 *
 * Só importa tipos: o funil carrega este arquivo direto no Node.
 */

/** Teto de produtos por loja: é um preview, não um catálogo. */
export const MAX_PRODUTOS = 200;

export interface OpcaoNormal {
  label: string;
  /** Hex (variação de cor) ou ''. */
  color: string;
  /** Miniatura (variação de imagem) ou ''. */
  swatchImage: string;
  available: boolean;
}

export interface VariacaoNormal {
  /** '' quando o CS não deu nome: a PDP usa o rótulo do CMS dela. */
  name: string;
  tipo: TipoDeVariacao;
  options: OpcaoNormal[];
}

export interface ProdutoNormal {
  /** `loja-1`, `loja-2`… (a posição na lista; estável para `key`). */
  id: string;
  name: string;
  /** URLs das fotos, na ordem do cadastro (a 1ª é a do card). */
  images: string[];
  price: number;
  /** Igual ao preço quando não há "de" maior: o card não mostra desconto. */
  listPrice: number;
  /** 0 = sem parcelamento (1x também é "sem"). */
  installments: number;
  installmentValue: number;
  inStock: boolean;
  brand: string;
  badge: string;
  url: string;
  description: string;
  /** Só as linhas com nome e valor. */
  specs: { name: string; value: string }[];
  variants: VariacaoNormal[];
  /** URL da imagem do guia de medidas; '' = a PDP mostra a de exemplo. */
  sizeGuide: string;
}

const TIPOS: ReadonlySet<string> = new Set(['texto', 'cor', 'imagem']);

const numero = (v: unknown) =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : undefined;
const texto = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const lista = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** Um produto do cadastro na forma completa. */
export function normalizarProduto(p: ProdutoDaLoja, i: number): ProdutoNormal {
  const price = numero(p.price) ?? 0;
  const de = numero(p.listPrice);
  const parcelas = Math.floor(numero(p.installments) ?? 0);
  const valor =
    numero(p.installmentValue) ??
    (parcelas > 1 ? Math.round((price / parcelas) * 100) / 100 : 0);
  return {
    id: `loja-${i + 1}`,
    name: texto(p.name) || `Produto ${i + 1}`,
    images: lista<{ productImage?: unknown }>(p.images)
      .map(f => texto(f?.productImage))
      .filter(Boolean),
    price,
    listPrice: de !== undefined && de > price ? de : price,
    installments: parcelas > 1 ? parcelas : 0,
    installmentValue: parcelas > 1 ? valor : 0,
    inStock: p.soldOut !== true,
    brand: texto(p.brand),
    badge: texto(p.badge),
    url: texto(p.url),
    sizeGuide: texto(p.sizeGuide),
    description: texto(p.description),
    specs: lista<{ name?: unknown; value?: unknown }>(p.specs)
      .map(e => ({ name: texto(e?.name), value: texto(e?.value) }))
      .filter(e => e.name && e.value),
    variants: lista<NonNullable<ProdutoDaLoja['variants']>[number]>(
      p.variants
    ).flatMap(v => {
      const options = lista<Record<string, unknown>>(v?.options)
        .map(o => ({
          label: texto(o?.label),
          color: texto(o?.color),
          swatchImage: texto(o?.swatchImage),
          available: o?.soldOut !== true,
        }))
        .filter(o => o.label || o.color || o.swatchImage);
      if (!options.length) return [];
      // Sem tipo escolhido, o que a opção traz decide: miniatura → imagem,
      // hex → cor, só texto → botões de texto.
      const tipo: TipoDeVariacao = TIPOS.has(String(v?.tipo))
        ? (v.tipo as TipoDeVariacao)
        : options.some(o => o.swatchImage)
          ? 'imagem'
          : options.some(o => o.color)
            ? 'cor'
            : 'texto';
      return [{ name: texto(v?.name), tipo, options }];
    }),
  };
}

/**
 * Os produtos da loja prontos para desenhar, ou `null` quando a loja não tem
 * nenhum — aí cada peça mostra os produtos de exemplo dela, como sempre.
 * Produto sem nome e sem foto (linha em branco do formulário) não conta.
 */
export function produtosDaLoja(
  loja: ConteudoLoja | null | undefined
): ProdutoNormal[] | null {
  const validos = lista<ProdutoDaLoja>(loja?.produtos)
    .filter(
      p =>
        p &&
        typeof p === 'object' &&
        (texto(p.name) ||
          lista<{ productImage?: unknown }>(p.images).some(f =>
            texto(f?.productImage)
          ))
    )
    .slice(0, MAX_PRODUTOS);
  return validos.length ? validos.map(normalizarProduto) : null;
}

/** "R$ 1.234,90", o formato dos cards e da PDP. */
export function emReais(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

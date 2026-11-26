import type {
  CampoDoSchema,
  ConteudoDaSecao,
  ValorDeConteudo,
} from '@/types/conteudo';
import type { SlotDaLoja } from './conteudoLoja';

/**
 * O caminho inverso dos vínculos: o conteúdo que uma SEÇÃO mostra hoje vira o
 * ponto de partida de um slot da loja ("Começar com o menu do Header 09"). O
 * CS edita o menu que já está na tela em vez de digitar tudo do zero.
 *
 * Só para os slots de lista; o contato e os dados legais são poucos campos e
 * o mock deles é marcador (`[0000-0000]`), que não vale copiar.
 *
 * Só importa tipos: o funil carrega este arquivo direto no Node.
 */

/** Onde cada slot mora numa peça: o tipo de peça e o(s) campo(s). */
const FONTES: Partial<Record<SlotDaLoja, { de: RegExp; campos: string[] }>> = {
  menuPrincipal: { de: /^Header\d+$/, campos: ['menu'] },
  menuRodape: { de: /^Footer\d+$/, campos: ['columns'] },
  linksLegais: { de: /^Footer\d+$/, campos: ['legalLinks'] },
  redes: { de: /^Footer\d+$/, campos: ['socials'] },
  pagamentos: { de: /^Footer\d+$/, campos: ['payments'] },
  selos: { de: /^Footer\d+$/, campos: ['seals'] },
  banners: { de: /^BannerMain\d+$/, campos: ['slides'] },
  categorias: { de: /^Categories\d+$/, campos: ['categories'] },
};

/** Chave da peça → chave da loja, onde os nomes diferem (o banner da 09/12/15). */
const PARA_A_LOJA: Record<string, string> = {
  primaryLabel: 'ctaLabel',
  primaryUrl: 'ctaUrl',
  linkLabel: 'secondaryLabel',
  linkUrl: 'secondaryUrl',
};

type Objeto = { [chave: string]: ValorDeConteudo };
const ehObjeto = (v: unknown): v is Objeto =>
  Object.prototype.toString.call(v) === '[object Object]';

/** Os itens no formato do schema da loja: só as chaves que o formulário tem. */
function noFormatoDaLoja(
  itens: ValorDeConteudo,
  schema: CampoDoSchema
): Objeto[] {
  const props = schema.items?.properties ?? {};
  if (!Array.isArray(itens)) return [];
  return itens.filter(ehObjeto).map(item => {
    const saida: Objeto = {};
    for (const [chave, valor] of Object.entries(item)) {
      const destino = PARA_A_LOJA[chave] ?? chave;
      const filho = props[destino];
      if (!filho || saida[destino] !== undefined) continue;
      saida[destino] =
        filho.type === 'array' ? noFormatoDaLoja(valor, filho) : valor;
    }
    return saida;
  });
}

export interface SecaoDaPagina {
  /** Nome no TemplateRegistry (`Header09`). */
  componente: string;
  /** O nome que o CS vê ("Header 09"). */
  titulo: string;
  /** O conteúdo resolvido da seção (mock + Nível 1). */
  conteudo: ConteudoDaSecao;
}

/**
 * O valor inicial de um slot, tirado da primeira seção da página que o mostra.
 * `null` quando nenhuma seção tem o slot (ou ele está vazio nela).
 */
export function partirDaPagina(
  slot: SlotDaLoja,
  schema: CampoDoSchema,
  secoes: SecaoDaPagina[]
): { valor: Objeto[]; titulo: string } | null {
  const fonte = FONTES[slot];
  if (!fonte) return null;
  for (const secao of secoes) {
    if (!fonte.de.test(secao.componente)) continue;
    for (const campo of fonte.campos) {
      const valor = noFormatoDaLoja(secao.conteudo[campo], schema);
      if (valor.length) return { valor, titulo: secao.titulo };
    }
  }
  return null;
}

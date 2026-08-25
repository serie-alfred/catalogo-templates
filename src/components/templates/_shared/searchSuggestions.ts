/**
 * Sugestões de busca placeholder para os previews de header.
 *
 * No FastStore quem alimenta o autocomplete é o hook `useSuggestions` do
 * `@faststore/core/experimental`, que consulta a Intelligent Search da VTEX.
 * Aqui não existe loja: esta função devolve termos plausíveis derivados do que
 * foi digitado, só para o usuário ver o autocomplete funcionando no link de
 * preview. Com o campo vazio, devolve a lista de sugestões fixa do componente —
 * exatamente o fallback que os headers usam no `.starter`.
 */

const VOCABULARY = [
  'tênis masculino',
  'tênis de corrida',
  'tênis feminino',
  'camiseta básica',
  'camisa social',
  'calça jeans',
  'bermuda moletom',
  'jaqueta corta-vento',
  'vestido midi',
  'fone bluetooth',
  'relógio digital',
  'mochila notebook',
  'óculos de sol',
  'cama e banho',
  'ofertas do dia',
];

export function buildSearchSuggestions(
  term: string,
  fallback: string[],
  limit = 6
): string[] {
  const typed = term.trim().toLowerCase();
  if (!typed) return fallback.slice(0, limit);

  const matches = VOCABULARY.filter(entry => entry.includes(typed));
  const derived = [
    typed,
    `${typed} masculino`,
    `${typed} feminino`,
    `${typed} em promoção`,
  ];

  return Array.from(new Set([...matches, ...derived])).slice(0, limit);
}

/**
 * Produtos placeholder para os autocompletes que mostram cards de produto
 * (Header06/Header07 do `.starter` listam produtos junto dos termos).
 */
export interface SuggestionProduct {
  name: string;
  price: string;
  image: string;
}

export function buildSuggestionProducts(term: string): SuggestionProduct[] {
  const typed = term.trim();
  const base = typed ? typed.charAt(0).toUpperCase() + typed.slice(1) : 'Produto';
  return [
    {
      name: `${base} — modelo clássico`,
      price: 'R$ 249,90',
      image: 'https://placehold.co/80x80',
    },
    {
      name: `${base} — edição limitada`,
      price: 'R$ 329,90',
      image: 'https://placehold.co/80x80',
    },
    {
      name: `${base} — linha premium`,
      price: 'R$ 459,90',
      image: 'https://placehold.co/80x80',
    },
  ];
}

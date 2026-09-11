/**
 * Endereçamento das fixtures do Figma.
 *
 * As fixtures são um array ACHATADO com `depth`, e o endereçamento original era
 * `find(rows, nome, nth)` — nth GLOBAL. Um nó novo no Figma reordenava
 * silenciosamente todos os nth seguintes, e a medição passava a comparar a
 * caixa errada sem reprovar nada.
 *
 * Aqui a árvore é reconstruída (o pai de `i` é o último nó antes de `i` com
 * `depth === depth_i - 1`) e o nth passa a ser ENTRE IRMÃOS. Nó novo fora do
 * caminho não quebra nada; nó novo no caminho quebra com mensagem clara.
 */

/** Reconstrói pai/filhos a partir do `depth`. Devolve os nós anotados. */
export function arvore(linhas) {
  const nos = linhas.map((n, i) => ({ ...n, i, filhos: [], pai: null }));
  const pilha = [];
  for (const no of nos) {
    while (pilha.length && pilha[pilha.length - 1].depth >= no.depth)
      pilha.pop();
    const pai = pilha[pilha.length - 1] ?? null;
    if (pai) {
      no.pai = pai;
      pai.filhos.push(no);
    }
    pilha.push(no);
  }
  return nos;
}

/** Os filhos diretos de um nó com um dado nome. */
export const filhos = (no, nome) =>
  (no?.filhos ?? []).filter(f => f.name === nome);

/**
 * Endereça por caminho entre irmãos: `'Frame 143 > Frame 146[2] > Heading 3'`.
 * Devolve `undefined` se o caminho não resolver — o chamador reprova.
 */
export function caminho(nos, expr) {
  const partes = expr.split('>').map(p => p.trim());
  let atual = nos.find(n => n.depth === 0);
  // O primeiro segmento pode ser a própria raiz.
  if (atual && partes[0] === atual.name) partes.shift();
  for (const parte of partes) {
    if (!atual) return undefined;
    const m = /^(.*?)(?:\[(\d+)\])?$/.exec(parte);
    const nome = m[1].trim();
    const idx = m[2] ? Number(m[2]) - 1 : 0;
    atual = filhos(atual, nome)[idx];
  }
  return atual;
}

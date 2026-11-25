import type { SlotDaLoja } from './conteudoLoja';

/**
 * "Editar na loja" leva ao slot certo do painel "Conteúdo da loja" (ex.: o card
 * de uma vitrine leva a Produtos). O pedido pode chegar antes do painel montar —
 * o mesmo clique troca o destino do rail — ou com ele já aberto; por isso fica
 * guardado E vira um evento.
 */
const EVENTO = 'etemas:foco-na-loja';
let pendente: SlotDaLoja | null = null;

export function pedirFocoNaLoja(slot: SlotDaLoja) {
  pendente = slot;
  window.dispatchEvent(new CustomEvent<SlotDaLoja>(EVENTO, { detail: slot }));
}

/** O painel chama ao montar e a cada pedido; rola o slot para o topo. */
export function ouvirFocoNaLoja(rolar: (slot: SlotDaLoja) => void) {
  const aoPedir = (e: Event) => {
    pendente = null;
    rolar((e as CustomEvent<SlotDaLoja>).detail);
  };
  if (pendente) {
    const slot = pendente;
    pendente = null;
    // Depois do primeiro desenho: o slot ainda não está no DOM durante o efeito do pai.
    requestAnimationFrame(() => rolar(slot));
  }
  window.addEventListener(EVENTO, aoPedir);
  return () => window.removeEventListener(EVENTO, aoPedir);
}

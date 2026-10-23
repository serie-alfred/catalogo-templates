/**
 * Onde o editor guarda o que o usuário está montando.
 *
 * O TRABALHO é por aba (`sessionStorage`): seções, plataforma, cores, fontes,
 * os três assets, os modos Checkout/LP, o token da Wake e os vínculos da aba
 * (tema salvo e preview ao vivo). Antes tudo isso ficava no `localStorage`, que
 * é um só para todas as abas da origem: abrir o /gerador numa segunda guia
 * trazia o layout da primeira, e as duas passavam a gravar nas mesmas chaves —
 * mexer numa alterava a outra no próximo recarregar. O `sessionStorage`
 * sobrevive ao recarregar da MESMA aba e nasce vazio numa aba nova.
 *
 * PREFERÊNCIAS de tela continuam no `localStorage` (painéis recolhidos, zoom):
 * valem para todas as abas, como uma preferência deve valer.
 *
 * O que fica de fora do sessionStorage: "duplicar aba" do navegador copia o
 * sessionStorage (é do navegador, não daqui) — a cópia começa igual e depois
 * segue sozinha.
 */

/** As chaves do trabalho da aba. Quem semeia o editor de fora (o funil) usa estas. */
export const CHAVES_DA_ABA = [
  'layoutSelections',
  'layoutPlatform',
  'colors',
  'fonts',
  'logo',
  'favicon',
  'ogImage',
  'editorMode',
  'checkout',
  'lp',
  'wakeToken',
  // Vínculos da aba: o tema do histórico em que ela salva e o preview que ela
  // mantém atualizado (ver useLayoutGenerator).
  'temaAtual',
  'previewAtual',
] as const;

export type ChaveDaAba = (typeof CHAVES_DA_ABA)[number];

/**
 * As chaves que o editor gravava no `localStorage` antes de o trabalho ser por
 * aba. Lidas UMA vez, na primeira aba que abrir depois da mudança, e apagadas
 * em seguida: o trabalho em andamento de quem atualizou não se perde, e da
 * segunda aba em diante cada uma nasce vazia.
 */
const CHAVES_ANTIGAS: readonly ChaveDaAba[] = [
  'layoutSelections',
  'layoutPlatform',
  'colors',
  'fonts',
  'logo',
  'favicon',
  'ogImage',
  'editorMode',
  'checkout',
  'lp',
  'wakeToken',
];

/** A migração roda uma vez por carga de página, antes da primeira leitura. */
let migrou = false;

export const estadoDaAba = {
  get(chave: ChaveDaAba): string | null {
    if (!migrou) {
      migrou = true;
      migrarEstadoAntigo();
    }
    try {
      return sessionStorage.getItem(chave);
    } catch {
      return null;
    }
  },
  set(chave: ChaveDaAba, valor: string) {
    sessionStorage.setItem(chave, valor);
  },
  remove(chave: ChaveDaAba) {
    try {
      sessionStorage.removeItem(chave);
    } catch {
      /* armazenamento indisponível: nada a remover */
    }
  },
};

/**
 * Traz para a aba o trabalho que ainda estiver no `localStorage` (formato de
 * antes) — só se a aba ainda não tem nada seu. Devolve true se trouxe.
 */
export function migrarEstadoAntigo(): boolean {
  try {
    const abaTemAlgo = CHAVES_DA_ABA.some(
      k => sessionStorage.getItem(k) !== null
    );
    if (abaTemAlgo) return false;
    const antigas = CHAVES_ANTIGAS.filter(
      k => localStorage.getItem(k) !== null
    );
    if (antigas.length === 0) return false;
    for (const k of antigas) {
      sessionStorage.setItem(k, localStorage.getItem(k) as string);
      localStorage.removeItem(k);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * O preview acompanha a edição — como, e por quê assim.
 *
 * O editor regrava o snapshot no MESMO id a cada edição (debounce no hook,
 * `PUT /gerador/api/preview/{id}`), e o /p aberto se atualiza por dois
 * caminhos, que se completam:
 *
 * 1. **BroadcastChannel** (este arquivo): no mesmo navegador, o editor avisa
 *    na hora em que a gravação termina. É o caso de quem edita com o preview
 *    aberto numa aba ao lado — atualiza sem esperar nada.
 * 2. **Polling leve** (`GET /api/preview/{id}?rev=1`, a cada 5 s com a aba
 *    visível): só a revisão, um número. É o que alcança o cliente que abriu o
 *    link em OUTRO navegador. A aba escondida não consulta.
 *
 * Nos dois, quem atualiza é o `router.refresh()` do Next: o /p é renderizado
 * no servidor a partir do snapshot, então recarregar o RSC traz o tema novo
 * sem perder a rolagem nem a página aberta. Sem WebSocket nem SSE: a Vercel
 * não mantém conexão aberta em função serverless, e o KV já é a fonte única.
 */

const CANAL = 'etemas-preview';

export interface AvisoDePreview {
  id: string;
  rev: number;
}

/** O editor gravou o preview `id` na revisão `rev`. */
export function avisarPreviewAtualizado(id: string, rev: number) {
  if (typeof BroadcastChannel === 'undefined') return;
  const canal = new BroadcastChannel(CANAL);
  canal.postMessage({ id, rev } satisfies AvisoDePreview);
  canal.close();
}

/** Escuta os avisos do preview `id`. Devolve a função que para de escutar. */
export function ouvirPreview(id: string, aoMudar: (rev: number) => void) {
  if (typeof BroadcastChannel === 'undefined') return () => {};
  const canal = new BroadcastChannel(CANAL);
  canal.onmessage = (event: MessageEvent<AvisoDePreview>) => {
    if (event.data?.id === id && typeof event.data.rev === 'number')
      aoMudar(event.data.rev);
  };
  return () => canal.close();
}

import { lerMidiaDeDev, tipoDoNome } from '@/lib/midiasStore';

/**
 * Só em desenvolvimento sem Vercel Blob: serve as imagens que o CS subiu
 * (`.preview-store/midias/`). PÚBLICA de propósito — o /p é público e mostra
 * essas imagens. Com o Blob, as URLs do conteúdo são do Blob e esta rota não é
 * usada (devolve 404: a pasta não existe na função).
 *
 * `Access-Control-Allow-Origin` é o que deixa o html2canvas (com `useCORS`) pôr
 * a imagem no PNG do "Baixar"; `nosniff` impede o navegador de tratar o arquivo
 * como outra coisa que não imagem.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ arquivo: string }> }
) {
  const { arquivo } = await params;
  const bytes = await lerMidiaDeDev(arquivo);
  if (!bytes) return new Response('Imagem não encontrada', { status: 404 });
  return new Response(bytes as unknown as BodyInit, {
    headers: {
      'Content-Type': tipoDoNome(arquivo),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

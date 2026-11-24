import { prepararImagem } from '@/utils/imagem';

/**
 * Envia uma imagem do conteúdo do cliente: prepara no navegador (redimensiona e
 * recomprime em WebP) e sobe para `/gerador/api/midias`. Devolve a URL que vai
 * no campo. Lança com a mensagem do servidor quando ele recusa.
 */
export async function enviarImagem(arquivo: File, larguraMax: number): Promise<string> {
  const pronta = await prepararImagem(arquivo, larguraMax);
  const form = new FormData();
  form.append('arquivo', pronta, 'imagem');
  const resp = await fetch('/gerador/api/midias', { method: 'POST', body: form });
  const corpo = (await resp.json().catch(() => ({}))) as { url?: string; message?: string };
  if (!resp.ok || !corpo.url) throw new Error(corpo.message ?? `Falha no envio (HTTP ${resp.status}).`);
  return corpo.url;
}

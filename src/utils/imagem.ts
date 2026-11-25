/**
 * Prepara no NAVEGADOR a imagem que o CS envia: redimensiona e recomprime em
 * WebP antes de subir. É o que deixa o preview leve para o cliente (um banner de
 * 4 MB vira ~200–300 KB) e mantém o envio bem abaixo do limite de 4,5 MB do
 * corpo de uma função da Vercel. Mantém a transparência (WebP tem alfa).
 *
 * GIF animado vira imagem parada; SVG não entra (pode carregar script).
 */

const ACEITOS = /^image\/(png|jpe?g|webp|gif|avif)$/i;
const TETO_DE_ENTRADA = 20 * 1024 * 1024;

/** Largura máxima pelo nome do campo: arte mobile e logos não precisam de 2400 px. */
export function larguraMaximaDoCampo(chave: string): number {
  if (/swatch/i.test(chave)) return 600;
  if (/mobile|product|produto/i.test(chave)) return 1200;
  if (/logo|icon|seal|selo|payment|brand/i.test(chave)) return 800;
  return 2400;
}

export async function prepararImagem(arquivo: File, larguraMax = 2400): Promise<Blob> {
  if (!ACEITOS.test(arquivo.type)) throw new Error('Envie PNG, JPG, WebP, GIF ou AVIF.');
  if (arquivo.size > TETO_DE_ENTRADA) throw new Error('A imagem passa de 20 MB.');

  const bitmap = await createImageBitmap(arquivo);
  const escala = Math.min(1, larguraMax / bitmap.width);
  const largura = Math.max(1, Math.round(bitmap.width * escala));
  const altura = Math.max(1, Math.round(bitmap.height * escala));
  const canvas = document.createElement('canvas');
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('O navegador não conseguiu processar a imagem.');
  ctx.drawImage(bitmap, 0, 0, largura, altura);
  bitmap.close();

  // Navegador que não codifica WebP devolve PNG: o servidor aceita os dois.
  const blob = await new Promise<Blob | null>(resolve =>
    canvas.toBlob(resolve, 'image/webp', 0.82)
  );
  if (!blob) throw new Error('Não foi possível converter a imagem.');
  return blob;
}

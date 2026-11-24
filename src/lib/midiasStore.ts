import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Onde moram as imagens que o CS sobe para o conteúdo do cliente.
 *
 * - Com `BLOB_READ_WRITE_TOKEN` (o Blob store ligado ao projeto na Vercel): no
 *   Vercel Blob, público, com cache longo — o nome é um UUID, então a URL nunca
 *   muda de conteúdo.
 * - Em desenvolvimento sem o token: em `.preview-store/midias/` (ignorada pelo
 *   git), servida por `/api/midias/<arquivo>` — o /p, que é público, também lê.
 * - Em produção sem o token: erro de configuração, que a rota vira 503 dizendo o
 *   que falta (como o histórico e o preview sem KV).
 *
 * Os arquivos ainda não são registrados por tema: a limpeza de imagens sem uso e
 * o caminho por tema são da fase de operação (ver docs/CONTEUDO-DO-CLIENTE.md).
 */

export class MidiasConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MidiasConfigError';
  }
}

const PASTA_DEV = path.join(process.cwd(), '.preview-store', 'midias');

const EXTENSAO: Record<string, string> = {
  'image/webp': 'webp',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

const TIPO_DA_EXTENSAO = Object.fromEntries(
  Object.entries(EXTENSAO).map(([tipo, ext]) => [ext, tipo])
);

/** O nome que `salvarMidia` gera em dev: UUID + extensão de imagem. */
export const NOME_DE_MIDIA = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(webp|png|jpg|gif|avif)$/;

/**
 * O tipo da imagem pelos BYTES, não pelo nome nem pelo `Content-Type` que o
 * navegador mandou. Fora destes cinco (SVG incluído), null.
 */
export function tipoPelosBytes(b: Uint8Array): string | null {
  const ascii = (inicio: number, fim: number) => String.fromCharCode(...b.subarray(inicio, fim));
  if (b.length < 12) return null;
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  if (b[0] === 0x89 && ascii(1, 4) === 'PNG') return 'image/png';
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (ascii(0, 4) === 'GIF8') return 'image/gif';
  if (ascii(4, 8) === 'ftyp' && /^avi[fs]$/.test(ascii(8, 12))) return 'image/avif';
  return null;
}

export function tipoDoNome(nome: string): string {
  return TIPO_DA_EXTENSAO[nome.split('.').pop() ?? ''] ?? 'application/octet-stream';
}

/** Grava a imagem e devolve a URL que vai no conteúdo. */
export async function salvarMidia(bytes: Uint8Array, tipo: string): Promise<string> {
  const ext = EXTENSAO[tipo];
  if (!ext) throw new Error(`tipo de imagem não aceito: ${tipo}`);
  const nome = `${crypto.randomUUID()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`conteudo/${nome}`, Buffer.from(bytes), {
      access: 'public',
      contentType: tipo,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });
    return blob.url;
  }

  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    throw new MidiasConfigError(
      'Envio de imagem sem armazenamento: crie um Blob store na Vercel (Storage → Blob) ' +
        'ligado ao projeto — ele cadastra BLOB_READ_WRITE_TOKEN — e faça um novo deploy.'
    );
  }

  await fs.mkdir(PASTA_DEV, { recursive: true });
  await fs.writeFile(path.join(PASTA_DEV, nome), bytes);
  return `/api/midias/${nome}`;
}

/** Só dev: os bytes de uma imagem gravada em `.preview-store/midias/`. */
export async function lerMidiaDeDev(nome: string): Promise<Uint8Array | null> {
  if (!NOME_DE_MIDIA.test(nome)) return null;
  try {
    return new Uint8Array(await fs.readFile(path.join(PASTA_DEV, nome)));
  } catch {
    return null;
  }
}

import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';
import type { LayoutSelection } from '@/hooks/useLayoutGenerator';

/**
 * Snapshot serializável de um tema montado no /gerador. É o payload de um
 * preview compartilhável — reconstrói exatamente o que o cliente vê no editor.
 */
export interface PreviewSnapshot {
  platform: string | null;
  selections: LayoutSelection[];
  colors: {
    colorPrimary: string;
    colorSecondary: string;
    colorTertiary: string;
    colorPrimaryBackground: string;
    colorSecondaryBackground: string;
    colorTertiaryBackground: string;
    colorFooter: string;
    colorFooterText: string;
    colorPrimaryText: string;
    colorSecondaryText: string;
  };
  fonts: {
    fontPrimary: string;
    fontSecondary: string;
    fontTertiary: string;
  };
  logo: string;
  favicon: string;
}

interface PreviewStore {
  save(id: string, snapshot: PreviewSnapshot): Promise<void>;
  get(id: string): Promise<PreviewSnapshot | null>;
}

// TTL do preview em produção (KV): 3 dias.
const PREVIEW_TTL_SECONDS = 60 * 60 * 24 * 3;

// Prefixo das chaves no KV, para não colidir com outros usos do banco.
const KV_PREFIX = 'preview:';

/**
 * Backend de desenvolvimento: grava/lê arquivos JSON em `.preview-store/`.
 * Zero configuração — funciona no localhost sem serviço externo. Não expira.
 */
const fileStore: PreviewStore = {
  async save(id, snapshot) {
    const dir = path.join(process.cwd(), '.preview-store');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, `${id}.json`),
      JSON.stringify(snapshot),
      'utf8'
    );
  },
  async get(id) {
    try {
      const file = path.join(process.cwd(), '.preview-store', `${id}.json`);
      const raw = await fs.readFile(file, 'utf8');
      return JSON.parse(raw) as PreviewSnapshot;
    } catch {
      return null;
    }
  },
};

/**
 * Backend de produção: Vercel KV / Upstash Redis. Importado de forma dinâmica
 * para o `fileStore` (dev) não exigir credenciais nem o pacote em runtime.
 */
const kvStore: PreviewStore = {
  async save(id, snapshot) {
    const { kv } = await import('@vercel/kv');
    await kv.set(`${KV_PREFIX}${id}`, snapshot, { ex: PREVIEW_TTL_SECONDS });
  },
  async get(id) {
    const { kv } = await import('@vercel/kv');
    return (await kv.get<PreviewSnapshot>(`${KV_PREFIX}${id}`)) ?? null;
  },
};

// Usa o KV quando as credenciais existem (produção na Vercel); senão, arquivo local.
function getStore(): PreviewStore {
  return process.env.KV_REST_API_URL ? kvStore : fileStore;
}

const ID_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/** ID curto base62 (10 chars) usando CSPRNG. */
function generateId(): string {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  let id = '';
  for (const byte of bytes) id += ID_ALPHABET[byte % ID_ALPHABET.length];
  return id;
}

/** Persiste um snapshot e retorna o ID gerado. */
export async function savePreview(snapshot: PreviewSnapshot): Promise<string> {
  const id = generateId();
  await getStore().save(id, snapshot);
  return id;
}

/** Recupera um snapshot pelo ID, ou null se inexistente/expirado. */
export function getPreview(id: string): Promise<PreviewSnapshot | null> {
  return getStore().get(id);
}

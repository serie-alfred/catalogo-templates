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
  /**
   * Escreve uma chave trivial só para registrar atividade no backend. Existe por
   * causa do plano Free do Upstash, que apaga o banco após 14 dias sem nenhuma
   * requisição (ver src/app/api/keep-alive/route.ts).
   */
  ping(): Promise<void>;
}

// TTL do preview em produção (KV): 3 dias.
const PREVIEW_TTL_SECONDS = 60 * 60 * 24 * 3;

// Prefixo das chaves no KV, para não colidir com outros usos do banco.
const KV_PREFIX = 'preview:';

// TTL da chave do keep-alive: 30 dias, folgado sobre a janela de 14 dias.
const KEEP_ALIVE_TTL_SECONDS = 60 * 60 * 24 * 30;

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
  async ping() {
    // Em dev não há nada para manter vivo; garantir a pasta já basta como no-op.
    await fs.mkdir(path.join(process.cwd(), '.preview-store'), { recursive: true });
  },
};

/**
 * Erro de configuração (não de runtime): o preview compartilhável foi acionado
 * num ambiente sem armazenamento. A rota traduz isso num 503 com mensagem útil,
 * em vez do 500 genérico que escondia a causa.
 */
export class PreviewStoreConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PreviewStoreConfigError';
  }
}

/**
 * Credenciais do Redis, aceitando os DOIS nomes que a Vercel injeta:
 *   - KV_REST_API_URL / KV_REST_API_TOKEN ....... integração Vercel KV (legado)
 *   - UPSTASH_REDIS_REST_URL / ..._TOKEN ........ integração Upstash do Marketplace
 * O `@vercel/kv` só lê o primeiro par por conta própria; quando a integração
 * injeta apenas o segundo, o store caía no fileStore e estourava EROFS.
 */
function kvCredentials(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  return url && token ? { url, token } : null;
}

/**
 * Backend de produção: Vercel KV / Upstash Redis. Importado de forma dinâmica
 * para o `fileStore` (dev) não exigir credenciais nem o pacote em runtime.
 */
const kvStore: PreviewStore = {
  async save(id, snapshot) {
    const { createClient } = await import('@vercel/kv');
    const kv = createClient(kvCredentials()!);
    await kv.set(`${KV_PREFIX}${id}`, snapshot, { ex: PREVIEW_TTL_SECONDS });
  },
  async get(id) {
    const { createClient } = await import('@vercel/kv');
    const kv = createClient(kvCredentials()!);
    return (await kv.get<PreviewSnapshot>(`${KV_PREFIX}${id}`)) ?? null;
  },
  async ping() {
    const { createClient } = await import('@vercel/kv');
    const kv = createClient(kvCredentials()!);
    // TTL maior que a janela de inatividade: a chave se renova a cada execução e
    // nunca vira lixo permanente no banco.
    await kv.set(`${KV_PREFIX}keep-alive`, new Date().toISOString(), {
      ex: KEEP_ALIVE_TTL_SECONDS,
    });
  },
};

/**
 * Usa o KV quando há credenciais; senão, arquivo local.
 *
 * O fileStore NÃO serve em serverless: na Vercel o filesystem é read-only fora de
 * /tmp, então `fs.mkdir('.preview-store')` estoura EROFS e a rota devolvia
 * "Falha ao salvar preview" sem dizer que faltava configurar o banco. Por isso,
 * em produção, a ausência de credenciais falha explicitamente.
 */
function getStore(): PreviewStore {
  if (kvCredentials()) return kvStore;

  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    throw new PreviewStoreConfigError(
      'Preview compartilhável sem armazenamento: defina KV_REST_API_URL e ' +
        'KV_REST_API_TOKEN (ou UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN) ' +
        'no projeto da Vercel e faça um novo deploy.'
    );
  }

  return fileStore;
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

/**
 * Toca o backend só para registrar atividade. Devolve qual store respondeu, para
 * o endpoint de keep-alive conseguir dizer se falou mesmo com o Redis.
 */
export async function pingPreviewStore(): Promise<'kv' | 'file'> {
  const store = getStore();

  await store.ping();

  return kvCredentials() ? 'kv' : 'file';
}

import 'server-only';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * O pedaço do Redis que o histórico de temas e o limite de tentativas do login
 * usam, atrás de uma interface só.
 *
 * Em produção é o Vercel KV / Upstash que o preview já usa (as mesmas
 * credenciais, `kvCredentials`). Em desenvolvimento, sem credenciais, é um
 * arquivo JSON em `.preview-store/kv.json` — a mesma pasta, ignorada pelo git,
 * em que o preview grava em dev. As duas implementações têm a MESMA semântica
 * para estas operações, então a lógica de cima (temasStore, auth) roda igual
 * nos dois: o teste em dev exercita o código de produção, só a primitiva muda.
 */
export interface MiniKv {
  get<T>(key: string): Promise<T | null>;
  mget<T>(keys: string[]): Promise<(T | null)[]>;
  set(key: string, value: unknown, opts?: { ex?: number }): Promise<void>;
  del(keys: string[]): Promise<void>;
  /** Incrementa e devolve o valor novo; `ex` põe o prazo só na criação. */
  incr(key: string, ex: number): Promise<number>;
  zadd(key: string, score: number, member: string): Promise<void>;
  zrem(key: string, member: string): Promise<void>;
  /** Membros do maior score para o menor. */
  zrevAll(key: string): Promise<string[]>;
}

/** Ambiente sem banco onde ele é obrigatório (produção). */
export class KvConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'KvConfigError';
  }
}

/**
 * Credenciais do Redis, aceitando os DOIS nomes que a Vercel injeta:
 *   - KV_REST_API_URL / KV_REST_API_TOKEN ....... integração Vercel KV (legado)
 *   - UPSTASH_REDIS_REST_URL / ..._TOKEN ........ integração Upstash do Marketplace
 */
export function kvCredentials(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redisKv(): Promise<MiniKv> {
  const { createClient } = await import('@vercel/kv');
  const kv = createClient(kvCredentials()!);
  return {
    get: key => kv.get(key),
    mget: async <T>(keys: string[]) =>
      keys.length ? ((await kv.mget(...keys)) as (T | null)[]) : [],
    async set(key, value, opts) {
      if (opts?.ex) await kv.set(key, value, { ex: opts.ex });
      else await kv.set(key, value);
    },
    async del(keys) {
      if (keys.length) await kv.del(...keys);
    },
    async incr(key, ex) {
      const n = await kv.incr(key);
      if (n === 1) await kv.expire(key, ex);
      return n;
    },
    async zadd(key, score, member) {
      await kv.zadd(key, { score, member });
    },
    async zrem(key, member) {
      await kv.zrem(key, member);
    },
    zrevAll: key => kv.zrange<string[]>(key, 0, -1, { rev: true }),
  };
}

/* ── dev: um arquivo ──────────────────────────────────────────────────────── */

interface Arquivo {
  valores: Record<string, { v: unknown; exp?: number }>;
  conjuntos: Record<string, Record<string, number>>;
}

const ARQUIVO = path.join(process.cwd(), '.preview-store', 'kv.json');

/** Uma operação por vez: ler-modificar-gravar sem corrida no mesmo processo. */
let fila: Promise<unknown> = Promise.resolve();

function comArquivo<T>(fn: (a: Arquivo) => T): Promise<T> {
  const passo = fila.then(async () => {
    let a: Arquivo = { valores: {}, conjuntos: {} };
    try {
      a = JSON.parse(await fs.readFile(ARQUIVO, 'utf8')) as Arquivo;
    } catch {
      /* primeiro uso */
    }
    const agora = Date.now();
    for (const [k, e] of Object.entries(a.valores))
      if (e.exp && e.exp <= agora) delete a.valores[k];
    const antes = JSON.stringify(a);
    const out = fn(a);
    if (JSON.stringify(a) !== antes) {
      await fs.mkdir(path.dirname(ARQUIVO), { recursive: true });
      await fs.writeFile(ARQUIVO, JSON.stringify(a), 'utf8');
    }
    return out;
  });
  fila = passo.catch(() => {});
  return passo;
}

const clone = <T>(v: T): T =>
  v === undefined ? v : (JSON.parse(JSON.stringify(v)) as T);

const arquivoKv: MiniKv = {
  get: <T>(key: string) =>
    comArquivo(a => clone((a.valores[key]?.v as T) ?? null)),
  mget: <T>(keys: string[]) =>
    comArquivo(a => keys.map(k => clone((a.valores[k]?.v as T) ?? null))),
  set: (key, value, opts) =>
    comArquivo(a => {
      a.valores[key] = {
        v: clone(value),
        ...(opts?.ex ? { exp: Date.now() + opts.ex * 1000 } : {}),
      };
    }),
  del: keys =>
    comArquivo(a => {
      for (const k of keys) delete a.valores[k];
    }),
  incr: (key, ex) =>
    comArquivo(a => {
      const atual = a.valores[key];
      const n = (typeof atual?.v === 'number' ? atual.v : 0) + 1;
      a.valores[key] = {
        v: n,
        exp: atual?.exp ?? Date.now() + ex * 1000,
      };
      return n;
    }),
  zadd: (key, score, member) =>
    comArquivo(a => {
      (a.conjuntos[key] ??= {})[member] = score;
    }),
  zrem: (key, member) =>
    comArquivo(a => {
      if (a.conjuntos[key]) delete a.conjuntos[key][member];
    }),
  zrevAll: key =>
    comArquivo(a =>
      Object.entries(a.conjuntos[key] ?? {})
        .sort((x, y) => y[1] - x[1])
        .map(([m]) => m)
    ),
};

/**
 * KV quando há credenciais; o arquivo em dev. Em produção sem credenciais
 * lança `KvConfigError` — o filesystem da Vercel é read-only, e um fallback
 * calado gravaria em lugar nenhum.
 */
export async function getKv(): Promise<MiniKv> {
  if (kvCredentials()) return redisKv();
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    throw new KvConfigError(
      'Sem banco: defina KV_REST_API_URL e KV_REST_API_TOKEN (ou ' +
        'UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN) no projeto da ' +
        'Vercel e faça um novo deploy.'
    );
  }
  return arquivoKv;
}

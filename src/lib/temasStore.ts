import 'server-only';
import { getKv } from './kv';
import type { EstadoDoEditor } from '@/types/estadoEditor';

/**
 * Histórico de temas, atrás do login. Cada tema tem nome, DONO e uma lista de
 * versões; cada versão é o `EstadoDoEditor` inteiro, como a aba estava ao salvar.
 *
 * Dono: o id (Supabase Auth) da conta que criou o tema. A agência vê e mexe em
 * todos; uma conta de convidado, só nos seus (`podeMexer`, aplicado nas rotas).
 * Tema de antes das contas não tem dono e é da agência — e os salvos pelas
 * contas de convidado do login antigo (dono = nome de usuário, não um id)
 * também ficam só com a agência.
 *
 * Chaves (prefixo `tema` para não colidir com `preview:` no mesmo banco):
 *   - `temas` ............... sorted set: id → atualizadoEm (ordem da lista)
 *   - `tema:{id}` ........... resumo (nome, plataforma, datas, versões)
 *   - `tema:{id}:v:{n}` ..... a versão n
 *
 * As versões ficam em chaves próprias porque o estado leva logo/favicon/OG em
 * data URL (até 2 MB cada): um documento único com todas as versões cresceria
 * a cada "Salvar" e passaria do limite de tamanho por requisição do Upstash.
 * Sem TTL: é histórico, não cache. Passando de `MAX_VERSOES`, a mais antiga sai.
 */

export interface VersaoResumo {
  n: number;
  salvoEm: number;
}

export interface TemaResumo {
  id: string;
  nome: string;
  platform: string | null;
  criadoEm: number;
  atualizadoEm: number;
  versoes: VersaoResumo[];
  /** Id da conta que criou; ausente = da agência (temas de antes das contas). */
  dono?: string;
}

/** A conta pode ver/salvar/apagar este tema? A agência, sempre. */
export function podeMexer(
  tema: TemaResumo,
  conta: { id: string; papel: 'admin' | 'convidado' }
): boolean {
  return conta.papel === 'admin' || (!!tema.dono && tema.dono === conta.id);
}

const MAX_VERSOES = 50;
const INDICE = 'temas';
const chaveTema = (id: string) => `tema:${id}`;
const chaveVersao = (id: string, n: number) => `tema:${id}:v:${n}`;

const ID_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateId(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let id = '';
  for (const byte of bytes) id += ID_ALPHABET[byte % ID_ALPHABET.length];
  return id;
}

export function idDeTemaValido(id: string): boolean {
  return /^[A-Za-z0-9]{12}$/.test(id);
}

/** Os temas que a conta enxerga (todos, para a agência). */
export async function listarTemas(conta: {
  id: string;
  papel: 'admin' | 'convidado';
}): Promise<TemaResumo[]> {
  const kv = await getKv();
  const ids = await kv.zrevAll(INDICE);
  const resumos = await kv.mget<TemaResumo>(ids.map(chaveTema));
  return resumos.filter((t): t is TemaResumo => !!t && podeMexer(t, conta));
}

/** Só o resumo (para as rotas conferirem o dono antes de agir). */
export async function lerResumo(id: string): Promise<TemaResumo | null> {
  const kv = await getKv();
  return kv.get<TemaResumo>(chaveTema(id));
}

export async function criarTema(
  nome: string,
  doc: EstadoDoEditor,
  dono: string
): Promise<TemaResumo> {
  const kv = await getKv();
  const agora = Date.now();
  const tema: TemaResumo = {
    id: generateId(),
    nome,
    platform: doc.platform ?? null,
    criadoEm: agora,
    atualizadoEm: agora,
    versoes: [{ n: 1, salvoEm: agora }],
    dono,
  };
  // A versão antes do resumo, e o resumo antes do índice: uma falha no meio
  // deixa no máximo uma chave órfã, nunca um tema listado sem conteúdo.
  await kv.set(chaveVersao(tema.id, 1), doc);
  await kv.set(chaveTema(tema.id), tema);
  await kv.zadd(INDICE, agora, tema.id);
  return tema;
}

/** Acrescenta uma versão. `null` = o tema não existe (apagado em outra aba). */
export async function salvarVersao(
  id: string,
  doc: EstadoDoEditor,
  nome?: string
): Promise<TemaResumo | null> {
  const kv = await getKv();
  const tema = await kv.get<TemaResumo>(chaveTema(id));
  if (!tema) return null;
  const agora = Date.now();
  const n = (tema.versoes.at(-1)?.n ?? 0) + 1;
  await kv.set(chaveVersao(id, n), doc);
  const versoes = [...tema.versoes, { n, salvoEm: agora }];
  const sobra = versoes.slice(0, Math.max(0, versoes.length - MAX_VERSOES));
  const atualizado: TemaResumo = {
    ...tema,
    nome: nome ?? tema.nome,
    platform: doc.platform ?? null,
    atualizadoEm: agora,
    versoes: versoes.slice(-MAX_VERSOES),
  };
  await kv.set(chaveTema(id), atualizado);
  await kv.zadd(INDICE, agora, id);
  if (sobra.length) await kv.del(sobra.map(v => chaveVersao(id, v.n)));
  return atualizado;
}

/** Uma versão (a última, sem `n`). `null` = tema ou versão inexistente. */
export async function lerTema(
  id: string,
  n?: number
): Promise<{ tema: TemaResumo; doc: EstadoDoEditor; versao: number } | null> {
  const kv = await getKv();
  const tema = await kv.get<TemaResumo>(chaveTema(id));
  if (!tema) return null;
  const versao = n ?? tema.versoes.at(-1)?.n;
  if (!versao || !tema.versoes.some(v => v.n === versao)) return null;
  const doc = await kv.get<EstadoDoEditor>(chaveVersao(id, versao));
  return doc ? { tema, doc, versao } : null;
}

export async function apagarTema(id: string): Promise<boolean> {
  const kv = await getKv();
  const tema = await kv.get<TemaResumo>(chaveTema(id));
  if (!tema) return false;
  await kv.zrem(INDICE, id);
  await kv.del([chaveTema(id), ...tema.versoes.map(v => chaveVersao(id, v.n))]);
  return true;
}

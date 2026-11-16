import 'server-only';
import { getKv } from './kv';
import { iguaisEmTempoConstante, usuarioDaAgencia } from './auth';
import { PLATFORMS, type Platform } from '@/types/platform';

/**
 * Contas de CONVIDADO (stakeholders): criadas pela agência no painel
 * `/gerador/contas`, cada uma presa a algumas plataformas. A conta da agência
 * não mora aqui: é a das variáveis (src/lib/auth.ts).
 *
 * Chaves (prefixo `conta` para não colidir com `preview:`/`tema:` no mesmo banco):
 *   - `contas` .............. sorted set: usuário → criadaEm (ordem da lista)
 *   - `conta:{usuario}` ..... a conta (com o hash da senha)
 *
 * Senha: PBKDF2-SHA256 com sal aleatório por conta (Web Crypto, sem
 * dependência). Nunca sai daqui: `publica()` tira hash, sal e carimbo.
 *
 * Carimbo: aleatório, vai assinado no cookie e é comparado a cada requisição
 * (src/lib/contaAtual.ts). Trocar a senha ou desativar a conta troca o
 * carimbo, e com isso derruba as sessões abertas dela. Mudar as plataformas
 * não troca: elas são lidas daqui a cada requisição e valem na hora.
 */

export interface Conta {
  usuario: string;
  /** Quem é (para a lista do painel): "Fulana — cliente X". */
  nome: string;
  plataformas: Platform[];
  ativa: boolean;
  hash: string;
  sal: string;
  carimbo: string;
  criadaEm: number;
  atualizadaEm: number;
}

export type ContaPublica = Omit<Conta, 'hash' | 'sal' | 'carimbo'>;

const INDICE = 'contas';
const chaveConta = (usuario: string) => `conta:${usuario}`;

const ITERACOES = 210_000;
export const SENHA_MINIMA = 8;

/** Erro de entrada do painel: a mensagem vai para a tela como está. */
export class ContaInvalida extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContaInvalida';
  }
}

const enc = new TextEncoder();

function hex(bytes: ArrayBuffer | Uint8Array): string {
  return [...(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes))]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function aleatorio(n: number): string {
  const b = new Uint8Array(n);
  crypto.getRandomValues(b);
  return hex(b);
}

function deHex(texto: string): Uint8Array {
  return Uint8Array.from(texto.match(/../g) ?? [], h => parseInt(h, 16));
}

async function derivar(senha: string, salHex: string): Promise<string> {
  const chave = await crypto.subtle.importKey(
    'raw',
    enc.encode(senha),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: deHex(salHex),
      iterations: ITERACOES,
    },
    chave,
    256
  );
  return hex(bits);
}

/** Usuário: minúsculas, números, ponto, hífen e sublinhado; 3 a 40. */
export function normalizarUsuario(valor: unknown): string | null {
  if (typeof valor !== 'string') return null;
  const u = valor.trim().toLowerCase();
  return /^[a-z0-9][a-z0-9._-]{2,39}$/.test(u) ? u : null;
}

/** Só as plataformas OFERECIDAS, sem repetir, na ordem do seletor. */
export function normalizarPlataformas(valor: unknown): Platform[] | null {
  if (!Array.isArray(valor)) return null;
  const escolhidas = PLATFORMS.filter(p => valor.includes(p));
  return escolhidas.length ? escolhidas : null;
}

function validarSenha(senha: unknown): string {
  if (typeof senha !== 'string' || senha.length < SENHA_MINIMA)
    throw new ContaInvalida(
      `A senha precisa de pelo menos ${SENHA_MINIMA} caracteres.`
    );
  if (senha.length > 200) throw new ContaInvalida('Senha longa demais.');
  return senha;
}

function validarNome(nome: unknown): string {
  const n = typeof nome === 'string' ? nome.trim() : '';
  if (n.length > 80) throw new ContaInvalida('Nome com mais de 80 caracteres.');
  return n;
}

export function publica(conta: Conta): ContaPublica {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { hash, sal, carimbo, ...resto } = conta;
  return resto;
}

export async function lerConta(usuario: string): Promise<Conta | null> {
  const u = normalizarUsuario(usuario);
  if (!u) return null;
  const kv = await getKv();
  return kv.get<Conta>(chaveConta(u));
}

export async function listarContas(): Promise<ContaPublica[]> {
  const kv = await getKv();
  const usuarios = await kv.zrevAll(INDICE);
  const contas = await kv.mget<Conta>(usuarios.map(chaveConta));
  return contas.filter((c): c is Conta => !!c).map(publica);
}

export async function criarConta(dados: {
  usuario: unknown;
  nome?: unknown;
  senha: unknown;
  plataformas: unknown;
}): Promise<ContaPublica> {
  const usuario = normalizarUsuario(dados.usuario);
  if (!usuario)
    throw new ContaInvalida(
      'Usuário inválido: 3 a 40 caracteres, só letras minúsculas, números, ponto, hífen e sublinhado.'
    );
  const agencia = usuarioDaAgencia();
  if (agencia && agencia.toLowerCase() === usuario)
    throw new ContaInvalida('Esse usuário é o da agência.');
  const plataformas = normalizarPlataformas(dados.plataformas);
  if (!plataformas) throw new ContaInvalida('Escolha ao menos uma plataforma.');
  const senha = validarSenha(dados.senha);
  const nome = validarNome(dados.nome);

  const kv = await getKv();
  if (await kv.get<Conta>(chaveConta(usuario)))
    throw new ContaInvalida('Já existe uma conta com esse usuário.');

  const agora = Date.now();
  const sal = aleatorio(16);
  const conta: Conta = {
    usuario,
    nome,
    plataformas,
    ativa: true,
    hash: await derivar(senha, sal),
    sal,
    carimbo: aleatorio(16),
    criadaEm: agora,
    atualizadaEm: agora,
  };
  await kv.set(chaveConta(usuario), conta);
  await kv.zadd(INDICE, agora, usuario);
  return publica(conta);
}

/**
 * Muda nome, plataformas, senha ou se a conta está ativa. Senha nova ou
 * desativar trocam o carimbo: as sessões abertas da conta caem.
 */
export async function atualizarConta(
  usuario: string,
  mudancas: {
    nome?: unknown;
    plataformas?: unknown;
    senha?: unknown;
    ativa?: unknown;
  }
): Promise<ContaPublica | null> {
  const atual = await lerConta(usuario);
  if (!atual) return null;
  const conta: Conta = { ...atual, atualizadaEm: Date.now() };

  if (mudancas.nome !== undefined) conta.nome = validarNome(mudancas.nome);
  if (mudancas.plataformas !== undefined) {
    const p = normalizarPlataformas(mudancas.plataformas);
    if (!p) throw new ContaInvalida('Escolha ao menos uma plataforma.');
    conta.plataformas = p;
  }
  if (mudancas.senha !== undefined) {
    conta.sal = aleatorio(16);
    conta.hash = await derivar(validarSenha(mudancas.senha), conta.sal);
    conta.carimbo = aleatorio(16);
  }
  if (mudancas.ativa !== undefined) {
    if (typeof mudancas.ativa !== 'boolean')
      throw new ContaInvalida('Valor inválido para "ativa".');
    if (atual.ativa && !mudancas.ativa) conta.carimbo = aleatorio(16);
    conta.ativa = mudancas.ativa;
  }

  const kv = await getKv();
  await kv.set(chaveConta(conta.usuario), conta);
  return publica(conta);
}

export async function apagarConta(usuario: string): Promise<boolean> {
  const atual = await lerConta(usuario);
  if (!atual) return false;
  const kv = await getKv();
  await kv.zrem(INDICE, atual.usuario);
  await kv.del([chaveConta(atual.usuario)]);
  return true;
}

/** Sal fixo para gastar o mesmo tempo quando o usuário não existe. */
const SAL_FALSO = '00'.repeat(16);

/**
 * Confere usuário e senha de um convidado. Usuário inexistente também passa
 * pelo PBKDF2 (com um sal falso), para o tempo da resposta não dizer quais
 * usuários existem. Conta desativada não entra.
 */
export async function autenticarConvidado(
  usuario: string,
  senha: string
): Promise<Conta | null> {
  const u = normalizarUsuario(usuario);
  const conta = u ? await lerConta(u) : null;
  const calculado = await derivar(senha, conta?.sal ?? SAL_FALSO);
  if (!conta || !conta.ativa) return null;
  return iguaisEmTempoConstante(calculado, conta.hash) ? conta : null;
}

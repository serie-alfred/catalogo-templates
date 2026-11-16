/**
 * Login do /gerador: a conta da AGÊNCIA (administradora) e as contas de
 * CONVIDADO (stakeholders, cada uma presa a algumas plataformas). Sessão num
 * cookie assinado.
 *
 * Roda no middleware (Edge) e nas rotas (Node), então só usa Web Crypto — nada
 * de `crypto` do Node aqui, e nada de KV (a implementação de dev do KV é um
 * arquivo, que o Edge não lê).
 *
 * Variáveis (cadastradas na Vercel; NUNCA no código — este repo é público):
 *   ETEMAS_LOGIN_USER ....... o usuário da agência
 *   ETEMAS_LOGIN_PASSWORD ... a senha da agência
 *   ETEMAS_SESSION_SECRET ... segredo que assina o cookie (32+ caracteres)
 *
 * As contas de convidado moram no KV (src/lib/contas.ts) e são criadas pela
 * agência no painel `/gerador/contas`.
 *
 * Três modos (`modoAuth`):
 *   - `ligado` ........... as três existem: /gerador e as APIs pedem sessão;
 *   - `fechado` .......... produção sem elas (ou com segredo curto): NINGUÉM
 *                          entra, e o /login diz o que cadastrar. Abrir por
 *                          falta de configuração seria o pior default;
 *   - `desligado-dev` .... desenvolvimento sem elas: o login some, com aviso,
 *                          para o `yarn dev` e o funil rodarem sem credencial.
 *
 * O cookie (v2) é `v2.<carga>.<assinatura>`: a carga é o JSON
 * `{ u, p, c, e }` (usuário, papel, carimbo, expira) em base64url, e a
 * assinatura é o HMAC-SHA256 do segredo sobre `v2.<carga>`. O que a assinatura
 * garante: o cookie saiu deste servidor e não foi mexido. O que ela NÃO
 * garante sozinha: que a conta ainda vale. Para isso existe o CARIMBO:
 *   - agência: `sha256(admin|usuário|senha)`, das variáveis — o middleware o
 *     recalcula, então trocar a senha (ou o usuário) derruba as sessões dela
 *     já no Edge, como antes;
 *   - convidado: um valor aleatório guardado na conta, no KV, trocado quando a
 *     senha muda ou a conta é desativada. O Edge não lê o KV: quem compara é a
 *     camada Node (`contaDoCookie` em src/lib/contaAtual.ts), que é por onde
 *     passa tudo que o editor faz — a página do editor e todas as APIs.
 * As PLATAFORMAS de um convidado não vão no cookie: a camada Node as lê do KV
 * a cada requisição, então mudar as plataformas de uma conta vale na hora.
 *
 * Cookie v1 (o formato da conta única) não é mais aceito: quem estava logado
 * entra de novo uma vez.
 */

export const COOKIE_SESSAO = 'etemas_sessao';

/** Duração da sessão: 7 dias. */
export const SESSAO_SEGUNDOS = 60 * 60 * 24 * 7;

/** Abaixo disto o segredo é adivinhável: tratado como ausente. */
const SEGREDO_MINIMO = 32;

export type ModoAuth = 'ligado' | 'fechado' | 'desligado-dev';

/** `admin` é a conta da agência (variáveis); `convidado`, as contas do KV. */
export type Papel = 'admin' | 'convidado';

/** O que o cookie diz, depois de conferida a assinatura e a validade. */
export interface SessaoLida {
  usuario: string;
  papel: Papel;
  carimbo: string;
  expira: number;
}

interface Credenciais {
  usuario: string;
  senha: string;
  segredo: string;
}

function credenciais(): Credenciais | null {
  const usuario = process.env.ETEMAS_LOGIN_USER ?? '';
  const senha = process.env.ETEMAS_LOGIN_PASSWORD ?? '';
  const segredo = process.env.ETEMAS_SESSION_SECRET ?? '';
  if (!usuario || !senha || segredo.length < SEGREDO_MINIMO) return null;
  return { usuario, senha, segredo };
}

export function modoAuth(): ModoAuth {
  if (credenciais()) return 'ligado';
  return process.env.NODE_ENV === 'production' ? 'fechado' : 'desligado-dev';
}

/** O usuário da agência (para recusar uma conta de convidado com o mesmo nome). */
export function usuarioDaAgencia(): string | null {
  return credenciais()?.usuario ?? null;
}

/** O que falta configurar, por NOME (nunca o valor). */
export function variaveisFaltando(): string[] {
  const falta: string[] = [];
  if (!process.env.ETEMAS_LOGIN_USER) falta.push('ETEMAS_LOGIN_USER');
  if (!process.env.ETEMAS_LOGIN_PASSWORD) falta.push('ETEMAS_LOGIN_PASSWORD');
  const segredo = process.env.ETEMAS_SESSION_SECRET ?? '';
  if (segredo.length < SEGREDO_MINIMO)
    falta.push(
      segredo
        ? `ETEMAS_SESSION_SECRET (com ${SEGREDO_MINIMO}+ caracteres)`
        : 'ETEMAS_SESSION_SECRET'
    );
  return falta;
}

const enc = new TextEncoder();
const dec = new TextDecoder();

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  let s = '';
  for (const b of bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes))
    s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function deBase64url(texto: string): Uint8Array | null {
  try {
    const b64 = texto.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
    return Uint8Array.from(bin, c => c.charCodeAt(0));
  } catch {
    return null;
  }
}

export async function sha256Hex(texto: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', enc.encode(texto));
  return [...new Uint8Array(d)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmac(segredo: string, texto: string): Promise<string> {
  const chave = await crypto.subtle.importKey(
    'raw',
    enc.encode(segredo),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return base64url(await crypto.subtle.sign('HMAC', chave, enc.encode(texto)));
}

/** Igualdade sem atalho: o tempo não depende de onde as strings divergem. */
export function iguaisEmTempoConstante(a: string, b: string): boolean {
  const x = enc.encode(a);
  const y = enc.encode(b);
  let dif = x.length ^ y.length;
  const n = Math.max(x.length, y.length);
  for (let i = 0; i < n; i++) dif |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return dif === 0;
}

/** O carimbo da agência: muda quando o usuário ou a senha das variáveis mudam. */
export async function carimboDaAgencia(): Promise<string | null> {
  const c = credenciais();
  return c ? sha256Hex(`admin|${c.usuario}|${c.senha}`) : null;
}

/**
 * Valor do cookie de uma sessão nova. `null` se o login não está ligado.
 * Para a agência, o carimbo é sempre o das variáveis (o argumento é ignorado).
 */
export async function criarSessao(
  usuario: string,
  papel: Papel,
  carimbo: string
): Promise<string | null> {
  const c = credenciais();
  if (!c) return null;
  const expira = Math.floor(Date.now() / 1000) + SESSAO_SEGUNDOS;
  const carimboFinal =
    papel === 'admin' ? ((await carimboDaAgencia()) ?? '') : carimbo;
  const carga = base64url(
    enc.encode(
      JSON.stringify({ u: usuario, p: papel, c: carimboFinal, e: expira })
    )
  );
  return `v2.${carga}.${await hmac(c.segredo, `v2.${carga}`)}`;
}

/**
 * Lê o cookie: assinatura certa, dentro do prazo e, se for da agência, com o
 * carimbo das variáveis de agora. Convidado só tem a assinatura e o prazo
 * conferidos AQUI — a conta (ativa, carimbo, plataformas) é conferida no KV
 * pela camada Node (`contaDoCookie`).
 */
export async function lerSessao(
  valor: string | undefined
): Promise<SessaoLida | null> {
  const c = credenciais();
  if (!c || !valor) return null;
  const partes = valor.split('.');
  if (partes.length !== 3 || partes[0] !== 'v2') return null;
  const [, carga, assinatura] = partes;
  const esperada = await hmac(c.segredo, `v2.${carga}`);
  if (!iguaisEmTempoConstante(assinatura, esperada)) return null;

  const bytes = deBase64url(carga);
  if (!bytes) return null;
  let dados: { u?: unknown; p?: unknown; c?: unknown; e?: unknown };
  try {
    dados = JSON.parse(dec.decode(bytes));
  } catch {
    return null;
  }
  const { u, p, c: carimbo, e } = dados;
  if (typeof u !== 'string' || typeof carimbo !== 'string') return null;
  if (p !== 'admin' && p !== 'convidado') return null;
  if (typeof e !== 'number' || !Number.isInteger(e)) return null;
  if (e <= Math.floor(Date.now() / 1000)) return null;

  if (p === 'admin') {
    if (!iguaisEmTempoConstante(u, c.usuario)) return null;
    const atual = await carimboDaAgencia();
    if (!atual || !iguaisEmTempoConstante(carimbo, atual)) return null;
  }
  return { usuario: u, papel: p, carimbo, expira: e };
}

/** O cookie vale no Edge: assinatura, prazo e (agência) carimbo. */
export async function sessaoValida(
  valor: string | undefined
): Promise<boolean> {
  return (await lerSessao(valor)) !== null;
}

/**
 * Confere usuário e senha DA AGÊNCIA. Os dois são comparados sempre (sem
 * retorno antecipado no usuário errado), e sobre os resumos SHA-256 — mesmo
 * tamanho, então o tempo não revela nem o comprimento da senha.
 */
export async function credenciaisConferem(
  usuario: string,
  senha: string
): Promise<boolean> {
  const c = credenciais();
  if (!c) return false;
  const [u1, u2, s1, s2] = await Promise.all([
    sha256Hex(usuario),
    sha256Hex(c.usuario),
    sha256Hex(senha),
    sha256Hex(c.senha),
  ]);
  const okUsuario = iguaisEmTempoConstante(u1, u2);
  const okSenha = iguaisEmTempoConstante(s1, s2);
  return okUsuario && okSenha;
}

/**
 * Destino depois do login: só caminho DESTA origem. `//outro.site` e
 * `/\outro.site` são URLs absolutas para o navegador — o clássico open redirect.
 */
export function destinoSeguro(next: string | null | undefined): string {
  if (
    !next ||
    !next.startsWith('/') ||
    next.startsWith('//') ||
    next.startsWith('/\\')
  )
    return '/gerador';
  return next;
}

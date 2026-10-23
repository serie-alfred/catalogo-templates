/**
 * Login da agência: UMA conta (usuário + senha), sessão num cookie assinado.
 *
 * Roda no middleware (Edge) e nas rotas (Node), então só usa Web Crypto — nada
 * de `crypto` do Node aqui.
 *
 * Variáveis (cadastradas na Vercel; NUNCA no código — este repo é público):
 *   ETEMAS_LOGIN_USER ....... o usuário
 *   ETEMAS_LOGIN_PASSWORD ... a senha
 *   ETEMAS_SESSION_SECRET ... segredo que assina o cookie (32+ caracteres)
 *
 * Três modos (`modoAuth`):
 *   - `ligado` ........... as três existem: /gerador e as APIs de escrita pedem
 *                          sessão;
 *   - `fechado` .......... produção sem elas (ou com segredo curto): NINGUÉM
 *                          entra, e o /login diz o que cadastrar. Abrir por
 *                          falta de configuração seria o pior default;
 *   - `desligado-dev` .... desenvolvimento sem elas: o login some, com aviso,
 *                          para o `yarn dev` e o funil rodarem sem credencial.
 *
 * O cookie é `<expira>.<assinatura>`, HMAC-SHA256 do segredo sobre
 * `v1|usuário|expira|sha256(senha)`. Trocar a senha (ou o usuário, ou o
 * segredo) invalida todas as sessões abertas, sem lista de sessões no banco.
 */

export const COOKIE_SESSAO = 'etemas_sessao';

/** Duração da sessão: 7 dias. */
export const SESSAO_SEGUNDOS = 60 * 60 * 24 * 7;

/** Abaixo disto o segredo é adivinhável: tratado como ausente. */
const SEGREDO_MINIMO = 32;

export type ModoAuth = 'ligado' | 'fechado' | 'desligado-dev';

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

function base64url(bytes: ArrayBuffer): string {
  let s = '';
  for (const b of new Uint8Array(bytes)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256Hex(texto: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', enc.encode(texto));
  return [...new Uint8Array(d)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function assinar(c: Credenciais, expira: number): Promise<string> {
  const chave = await crypto.subtle.importKey(
    'raw',
    enc.encode(c.segredo),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const msg = `v1|${c.usuario}|${expira}|${await sha256Hex(c.senha)}`;
  return base64url(await crypto.subtle.sign('HMAC', chave, enc.encode(msg)));
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

/** Valor do cookie de uma sessão nova. `null` se o login não está ligado. */
export async function criarSessao(): Promise<string | null> {
  const c = credenciais();
  if (!c) return null;
  const expira = Math.floor(Date.now() / 1000) + SESSAO_SEGUNDOS;
  return `${expira}.${await assinar(c, expira)}`;
}

/** O cookie vale: assinatura certa e dentro do prazo. */
export async function sessaoValida(
  valor: string | undefined
): Promise<boolean> {
  const c = credenciais();
  if (!c || !valor) return false;
  const [expiraTxt, assinatura] = valor.split('.');
  const expira = Number(expiraTxt);
  if (!Number.isInteger(expira) || !assinatura) return false;
  if (expira <= Math.floor(Date.now() / 1000)) return false;
  return iguaisEmTempoConstante(assinatura, await assinar(c, expira));
}

/**
 * Confere usuário e senha. Os DOIS são comparados sempre (sem retorno
 * antecipado no usuário errado), e sobre os resumos SHA-256 — mesmo tamanho,
 * então o tempo não revela nem o comprimento da senha.
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

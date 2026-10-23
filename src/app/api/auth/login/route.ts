import { NextResponse } from 'next/server';
import {
  COOKIE_SESSAO,
  SESSAO_SEGUNDOS,
  criarSessao,
  credenciaisConferem,
  destinoSeguro,
  modoAuth,
} from '@/lib/auth';
import { getKv } from '@/lib/kv';

export const dynamic = 'force-dynamic';

/** Tentativas erradas por IP antes do bloqueio, e a janela do bloqueio. */
const MAX_FALHAS = 10;
const JANELA_SEGUNDOS = 15 * 60;

function ipDe(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local'
  );
}

/** Volta ao /login com o motivo na URL (nunca o que foi digitado). */
function deVolta(request: Request, erro: string, next: string) {
  const url = new URL('/login', request.url);
  url.searchParams.set('erro', erro);
  url.searchParams.set('next', next);
  return NextResponse.redirect(url, 303);
}

/**
 * POST do formulário do /login (form nativo: funciona sem JavaScript).
 *
 * Limite de tentativas: 10 erros por IP em 15 minutos, contados no mesmo KV do
 * preview (em dev, o arquivo de `src/lib/kv.ts`). Sem banco o login segue
 * funcionando, só sem o limite — derrubar o login por causa do contador seria
 * trocar um risco pequeno por uma porta fechada.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const usuario = String(form.get('usuario') ?? '');
  const senha = String(form.get('senha') ?? '');
  const next = destinoSeguro(String(form.get('next') ?? ''));

  if (modoAuth() !== 'ligado') return deVolta(request, 'config', next);

  const chave = `login-falhas:${ipDe(request)}`;
  const kv = await getKv().catch(() => null);
  const falhas = kv ? ((await kv.get<number>(chave).catch(() => 0)) ?? 0) : 0;
  if (falhas >= MAX_FALHAS) return deVolta(request, 'limite', next);

  if (!(await credenciaisConferem(usuario, senha))) {
    await kv?.incr(chave, JANELA_SEGUNDOS).catch(() => {});
    return deVolta(request, 'credenciais', next);
  }

  await kv?.del([chave]).catch(() => {});
  const sessao = await criarSessao();
  const res = NextResponse.redirect(new URL(next, request.url), 303);
  res.cookies.set(COOKIE_SESSAO, sessao!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSAO_SEGUNDOS,
  });
  return res;
}

import { NextResponse } from 'next/server';
import { destinoSeguro, modoAuth } from '@/lib/auth';
import { limiteDoLogin } from '@/lib/limiteDoLogin';
import { clienteDoServidor } from '@/lib/supabase/servidor';

export const dynamic = 'force-dynamic';

/** Volta ao /login com o motivo na URL (nunca o que foi digitado). */
function deVolta(request: Request, next: string, erro?: string) {
  const url = new URL('/login', request.url);
  if (erro) url.searchParams.set('erro', erro);
  url.searchParams.set('next', next);
  return NextResponse.redirect(url, 303);
}

/**
 * POST do formulário de e-mail e senha do /login (form nativo: funciona sem
 * JavaScript). Senha certa dá uma sessão `aal1`, que ainda NÃO abre o editor:
 * de volta ao /login, que pede o código do app (ou o cadastro dele, no
 * primeiro acesso). Ver src/lib/limiteDoLogin.ts para o limite de tentativas.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get('email') ?? '')
    .trim()
    .toLowerCase();
  const senha = String(form.get('senha') ?? '');
  const next = destinoSeguro(String(form.get('next') ?? ''));

  const sb = modoAuth() === 'ligado' ? await clienteDoServidor() : null;
  if (!sb) return deVolta(request, next, 'config');

  const limite = await limiteDoLogin(request);
  if (limite.bloqueado) return deVolta(request, next, 'limite');

  if (!email || !senha) return deVolta(request, next, 'credenciais');
  const { error } = await sb.auth.signInWithPassword({
    email,
    password: senha,
  });
  if (error) {
    if (error.code === 'user_banned') return deVolta(request, next, 'inativa');
    if (error.status === 429) return deVolta(request, next, 'limite');
    if (error.code !== 'invalid_credentials')
      console.error('Login: erro do Supabase', error.code, error.message);
    await limite.falhou();
    return deVolta(request, next, 'credenciais');
  }
  // A senha valeu; o código do app (ou o cadastro dele) é a próxima tela.
  return deVolta(request, next);
}

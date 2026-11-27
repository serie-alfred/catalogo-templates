import { NextResponse } from 'next/server';
import { modoAuth } from '@/lib/auth';
import { normalizarEmail } from '@/lib/contas';
import { clienteDoServidor } from '@/lib/supabase/servidor';

export const dynamic = 'force-dynamic';

/**
 * "Esqueci a senha": pede ao Supabase o e-mail de redefinição, com o link
 * voltando a /auth/callback → /auth/nova-senha. A resposta é SEMPRE a mesma
 * ("se o e-mail tiver conta, chega um link"), exista a conta ou não: a tela não
 * pode servir para descobrir quais e-mails têm acesso.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const email = normalizarEmail(form.get('email'));
  const volta = new URL('/auth/esqueci', request.url);

  const sb = modoAuth() === 'ligado' ? await clienteDoServidor() : null;
  if (!sb) {
    volta.searchParams.set('erro', 'config');
    return NextResponse.redirect(volta, 303);
  }
  if (!email) {
    volta.searchParams.set('erro', 'email');
    return NextResponse.redirect(volta, 303);
  }

  const origem = new URL(request.url).origin;
  const { error } = await sb.auth.resetPasswordForEmail(email, {
    redirectTo: `${origem}/auth/callback?next=/auth/nova-senha`,
  });
  // Erro (limite de envio, SMTP…) só no log: a tela diz o mesmo para todos.
  if (error)
    console.error(
      'Esqueci a senha: erro do Supabase',
      error.code,
      error.message
    );

  volta.searchParams.set('enviado', '1');
  return NextResponse.redirect(volta, 303);
}

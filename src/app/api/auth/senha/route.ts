import { NextResponse } from 'next/server';
import { modoAuth, SENHA_MINIMA } from '@/lib/auth';
import { limiteDoLogin } from '@/lib/limiteDoLogin';
import { clienteDoServidor } from '@/lib/supabase/servidor';

export const dynamic = 'force-dynamic';

/**
 * Define a senha: a do convite (/auth/definir-senha) e a do "esqueci a senha"
 * (/auth/nova-senha). Os dois chegam aqui com a sessão que o link do e-mail
 * abriu (/auth/callback).
 *
 * Quem já tem o app de autenticação cadastrado manda também o código: o
 * Supabase só troca a senha de uma conta com 2FA numa sessão `aal2`, e o link
 * do e-mail sozinho é `aal1`. Pedir o código aqui também é o certo: um e-mail
 * vazado não pode bastar para tomar a conta.
 *
 * Deu certo → /login, que leva ao editor (`aal2`) ou ao cadastro do app.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const tipo = form.get('tipo') === 'definir' ? 'definir' : 'nova';
  const senha = String(form.get('senha') ?? '');
  const confirmacao = String(form.get('confirmacao') ?? '');
  const codigo = String(form.get('codigo') ?? '').replace(/\D/g, '');

  const deVolta = (erro: string) => {
    const url = new URL(`/auth/${tipo}-senha`, request.url);
    url.searchParams.set('erro', erro);
    return NextResponse.redirect(url, 303);
  };

  const sb = modoAuth() === 'ligado' ? await clienteDoServidor() : null;
  if (!sb) return deVolta('config');

  const { data } = await sb.auth.getClaims();
  const claims = data?.claims;
  if (!claims?.sub) return deVolta('sessao');

  if (senha.length < SENHA_MINIMA) return deVolta('curta');
  if (senha.length > 200) return deVolta('longa');
  if (senha !== confirmacao) return deVolta('diferentes');

  if (claims.aal !== 'aal2') {
    const fatores = await sb.auth.mfa.listFactors();
    const fator = fatores.data?.totp.find(f => f.status === 'verified');
    if (fator) {
      const limite = await limiteDoLogin(request);
      if (limite.bloqueado) return deVolta('limite');
      if (codigo.length !== 6) return deVolta('codigo');
      const { error } = await sb.auth.mfa.challengeAndVerify({
        factorId: fator.id,
        code: codigo,
      });
      if (error) {
        await limite.falhou();
        return deVolta(error.status === 429 ? 'limite' : 'codigo');
      }
      await limite.zerar();
    }
  }

  const { error } = await sb.auth.updateUser({ password: senha });
  if (error) {
    if (error.code === 'weak_password') return deVolta('fraca');
    if (error.code === 'same_password') return deVolta('igual');
    console.error('Definir senha: erro do Supabase', error.code, error.message);
    return deVolta('falha');
  }

  const url = new URL('/login', request.url);
  url.searchParams.set('senha', tipo);
  return NextResponse.redirect(url, 303);
}

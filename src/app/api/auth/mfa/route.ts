import { NextResponse } from 'next/server';
import { destinoSeguro, modoAuth } from '@/lib/auth';
import { limiteDoLogin } from '@/lib/limiteDoLogin';
import { clienteDoServidor } from '@/lib/supabase/servidor';

export const dynamic = 'force-dynamic';

/**
 * O código de 6 dígitos do app de autenticação: tanto o do login de todo dia
 * quanto o que CONFIRMA o cadastro do app no primeiro acesso (os dois são um
 * `challengeAndVerify` no fator). Certo, a sessão vira `aal2` e abre o editor.
 *
 * Responde JSON quando o pedido aceita JSON (o formulário com JavaScript, que
 * mostra o erro sem recarregar — no cadastro, recarregar geraria outro QR
 * code); sem JavaScript, o form nativo volta ao /login com o erro na URL.
 */
export async function POST(request: Request) {
  const json = request.headers.get('accept')?.includes('application/json');
  const form = await request.formData();
  const fator = String(form.get('fator') ?? '');
  const codigo = String(form.get('codigo') ?? '').replace(/\D/g, '');
  const next = destinoSeguro(String(form.get('next') ?? ''));

  const responder = (erro: string | null, destino?: string) => {
    if (json)
      return NextResponse.json(erro ? { erro } : { destino }, {
        status: erro ? 400 : 200,
      });
    const url = new URL(destino ?? '/login', request.url);
    if (erro) {
      url.searchParams.set('erro', erro);
      url.searchParams.set('next', next);
    }
    return NextResponse.redirect(url, 303);
  };

  const sb = modoAuth() === 'ligado' ? await clienteDoServidor() : null;
  if (!sb) return responder('config');

  const { data } = await sb.auth.getClaims();
  if (!data?.claims?.sub) return responder('sessao');

  const limite = await limiteDoLogin(request);
  if (limite.bloqueado) return responder('limite');

  if (!fator || codigo.length !== 6) return responder('codigo');
  const { error } = await sb.auth.mfa.challengeAndVerify({
    factorId: fator,
    code: codigo,
  });
  if (error) {
    if (error.status === 429) return responder('limite');
    if (error.code !== 'mfa_verification_failed')
      console.error('MFA: erro do Supabase', error.code, error.message);
    await limite.falhou();
    return responder('codigo');
  }
  await limite.zerar();
  return responder(null, next);
}

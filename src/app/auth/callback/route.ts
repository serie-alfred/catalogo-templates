import { NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { destinoSeguro, modoAuth } from '@/lib/auth';
import { clienteDoServidor } from '@/lib/supabase/servidor';

export const dynamic = 'force-dynamic';

const TIPOS: EmailOtpType[] = [
  'invite',
  'recovery',
  'signup',
  'magiclink',
  'email',
  'email_change',
];

/**
 * Onde os links dos e-mails do Supabase chegam (convite e "esqueci a senha").
 * O destino vem em `next` (/auth/definir-senha, /auth/nova-senha), só desta
 * origem. Três formatos, conforme quem pediu e o modelo de e-mail:
 *   - `?token_hash=…&type=…` (modelo de e-mail com `{{ .TokenHash }}`):
 *     `verifyOtp`, aqui. O mais robusto — vale em qualquer navegador;
 *   - `?code=…` (PKCE: o "esqueci a senha" pedido por ESTE navegador):
 *     `exchangeCodeForSession`, aqui;
 *   - `#access_token=…` (fluxo implícito: o convite do painel): o fragmento não
 *     chega ao servidor, então vai a /auth/confirmar — o navegador mantém o
 *     fragmento no redirecionamento — que o lê e posta em /api/auth/sessao.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const p = url.searchParams;
  const next = destinoSeguro(p.get('next'));
  const falhou = () =>
    NextResponse.redirect(new URL('/auth/esqueci?erro=link', request.url));

  if (p.get('error') || p.get('error_description')) return falhou();

  const sb = modoAuth() === 'ligado' ? await clienteDoServidor() : null;
  if (!sb) return NextResponse.redirect(new URL('/login', request.url));

  const tokenHash = p.get('token_hash');
  const tipo = p.get('type') as EmailOtpType | null;
  const code = p.get('code');

  if (tokenHash && tipo && TIPOS.includes(tipo)) {
    const { error } = await sb.auth.verifyOtp({
      type: tipo,
      token_hash: tokenHash,
    });
    return error ? falhou() : NextResponse.redirect(new URL(next, url));
  }
  if (code) {
    const { error } = await sb.auth.exchangeCodeForSession(code);
    return error ? falhou() : NextResponse.redirect(new URL(next, url));
  }

  const confirmar = new URL('/auth/confirmar', url);
  confirmar.searchParams.set('next', next);
  return NextResponse.redirect(confirmar);
}

import { NextResponse } from 'next/server';
import { modoAuth } from '@/lib/auth';
import { clienteDoServidor } from '@/lib/supabase/servidor';

export const dynamic = 'force-dynamic';

/**
 * Grava nos cookies a sessão que veio no FRAGMENTO do link do e-mail
 * (`#access_token=…&refresh_token=…`): é assim que o Supabase devolve o convite
 * feito pelo painel (`auth.admin.inviteUserByEmail`) e o "reenviar acesso" —
 * fluxo implícito, porque quem pediu foi o servidor, não este navegador. O
 * fragmento não chega ao servidor; /auth/confirmar o lê e posta aqui.
 *
 * Só da MESMA origem: sem isso, outro site poderia logar o visitante numa conta
 * alheia (login CSRF). `setSession` confere o token no Supabase antes de gravar.
 */
export async function POST(request: Request) {
  const origem = request.headers.get('origin');
  if (!origem || origem !== new URL(request.url).origin)
    return NextResponse.json({ ok: false }, { status: 403 });

  const sb = modoAuth() === 'ligado' ? await clienteDoServidor() : null;
  if (!sb) return NextResponse.json({ ok: false }, { status: 503 });

  const corpo = (await request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  const access_token =
    typeof corpo.access_token === 'string' ? corpo.access_token : '';
  const refresh_token =
    typeof corpo.refresh_token === 'string' ? corpo.refresh_token : '';
  if (!access_token || !refresh_token)
    return NextResponse.json({ ok: false }, { status: 400 });

  const { error } = await sb.auth.setSession({ access_token, refresh_token });
  if (error) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true });
}

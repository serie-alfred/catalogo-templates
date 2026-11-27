import { NextResponse } from 'next/server';
import { clienteDoServidor } from '@/lib/supabase/servidor';

export const dynamic = 'force-dynamic';

/**
 * Sai: encerra a sessão DESTE navegador no Supabase (`scope: 'local'`; as de
 * outros aparelhos continuam) e volta ao /login. POST, para um <img> alheio
 * não deslogar.
 */
export async function POST(request: Request) {
  const sb = await clienteDoServidor();
  await sb?.auth.signOut({ scope: 'local' }).catch(() => {});
  return NextResponse.redirect(new URL('/login?saiu=1', request.url), 303);
}

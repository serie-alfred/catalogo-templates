import { NextResponse } from 'next/server';
import { exigirConta } from '@/lib/contaAtual';
import { convidarConta, listarContas } from '@/lib/contas';
import { erroDasContas } from './erros';

// As contas mudam a cada ação do painel: nada de cache.
export const dynamic = 'force-dynamic';

/** A lista das contas de convidado (só a agência). */
export async function GET() {
  const g = await exigirConta({ admin: true });
  if ('resposta' in g) return g.resposta;
  try {
    return NextResponse.json({ contas: await listarContas() });
  } catch (error) {
    return erroDasContas(error, 'listar as contas');
  }
}

/**
 * Convida: `{ email, nome?, plataformas }` (só a agência). O Supabase manda o
 * e-mail do convite; o link volta a esta origem (/auth/callback).
 */
export async function POST(request: Request) {
  const g = await exigirConta({ admin: true });
  if ('resposta' in g) return g.resposta;
  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const conta = await convidarConta(
      { email: body.email, nome: body.nome, plataformas: body.plataformas },
      new URL(request.url).origin
    );
    return NextResponse.json({ conta }, { status: 201 });
  } catch (error) {
    return erroDasContas(error, 'convidar');
  }
}

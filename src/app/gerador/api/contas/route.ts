import { NextResponse } from 'next/server';
import { exigirConta } from '@/lib/contaAtual';
import { criarConta, listarContas } from '@/lib/contas';
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

/** Conta nova: `{ usuario, nome?, senha, plataformas }` (só a agência). */
export async function POST(request: Request) {
  const g = await exigirConta({ admin: true });
  if ('resposta' in g) return g.resposta;
  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const conta = await criarConta({
      usuario: body.usuario,
      nome: body.nome,
      senha: body.senha,
      plataformas: body.plataformas,
    });
    return NextResponse.json({ conta }, { status: 201 });
  } catch (error) {
    return erroDasContas(error, 'criar a conta');
  }
}

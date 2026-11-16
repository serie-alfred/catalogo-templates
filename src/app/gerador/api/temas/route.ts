import { NextResponse } from 'next/server';
import { contaPode, exigirConta, plataformaRecusada } from '@/lib/contaAtual';
import { criarTema, listarTemas } from '@/lib/temasStore';
import { docValido, erroDoHistorico, nomeValido } from './validacao';

// O histórico muda a cada "Salvar": nada de cache.
export const dynamic = 'force-dynamic';

/**
 * A lista do histórico (resumos, do mais recente para o mais antigo): todos
 * para a agência, só os próprios para uma conta de convidado.
 */
export async function GET() {
  const g = await exigirConta();
  if ('resposta' in g) return g.resposta;
  try {
    return NextResponse.json({ temas: await listarTemas(g.conta) });
  } catch (error) {
    return erroDoHistorico(error, 'listar os temas');
  }
}

/** Tema novo, com a versão 1: `{ nome, doc }`. O dono é quem salvou. */
export async function POST(request: Request) {
  const g = await exigirConta();
  if ('resposta' in g) return g.resposta;
  try {
    const body = (await request.json()) as { nome?: unknown; doc?: unknown };
    const nome = nomeValido(body?.nome);
    if (!nome || !docValido(body?.doc)) {
      return NextResponse.json(
        { message: 'Informe um nome (até 80 caracteres) e o tema.' },
        { status: 400 }
      );
    }
    if (g.conta.papel !== 'admin' && !contaPode(g.conta, body.doc.platform))
      return plataformaRecusada();
    return NextResponse.json({
      tema: await criarTema(nome, body.doc, g.conta.usuario),
    });
  } catch (error) {
    return erroDoHistorico(error, 'salvar o tema');
  }
}

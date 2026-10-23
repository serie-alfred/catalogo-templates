import { NextResponse } from 'next/server';
import { criarTema, listarTemas } from '@/lib/temasStore';
import { docValido, erroDoHistorico, nomeValido } from './validacao';

// O histórico muda a cada "Salvar": nada de cache.
export const dynamic = 'force-dynamic';

/** A lista do histórico (resumos, do mais recente para o mais antigo). */
export async function GET() {
  try {
    return NextResponse.json({ temas: await listarTemas() });
  } catch (error) {
    return erroDoHistorico(error, 'listar os temas');
  }
}

/** Tema novo, com a versão 1: `{ nome, doc }`. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { nome?: unknown; doc?: unknown };
    const nome = nomeValido(body?.nome);
    if (!nome || !docValido(body?.doc)) {
      return NextResponse.json(
        { message: 'Informe um nome (até 80 caracteres) e o tema.' },
        { status: 400 }
      );
    }
    return NextResponse.json({ tema: await criarTema(nome, body.doc) });
  } catch (error) {
    return erroDoHistorico(error, 'salvar o tema');
  }
}

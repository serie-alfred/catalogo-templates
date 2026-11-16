import { NextResponse } from 'next/server';
import { contaPode, exigirConta, plataformaRecusada } from '@/lib/contaAtual';
import {
  apagarTema,
  idDeTemaValido,
  lerResumo,
  lerTema,
  podeMexer,
  salvarVersao,
} from '@/lib/temasStore';
import type { ContaAtual } from '@/types/conta';
import { docValido, erroDoHistorico, nomeValido } from '../validacao';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

const naoAchou = () =>
  NextResponse.json({ message: 'Tema não encontrado' }, { status: 404 });

/**
 * O tema existe E é da conta? Tema de outra conta responde 404, como se não
 * existisse: um convidado não descobre ids alheios pela diferença 403/404.
 */
async function temaDaConta(id: string, conta: ContaAtual): Promise<boolean> {
  const tema = await lerResumo(id);
  return !!tema && podeMexer(tema, conta);
}

/** Uma versão do tema para reabrir: a última, ou `?versao=n`. */
export async function GET(request: Request, { params }: Ctx) {
  const g = await exigirConta();
  if ('resposta' in g) return g.resposta;
  const { id } = await params;
  if (!idDeTemaValido(id)) return naoAchou();
  const param = new URL(request.url).searchParams.get('versao');
  const n = param ? Number(param) : undefined;
  if (n !== undefined && !Number.isInteger(n)) return naoAchou();
  try {
    if (!(await temaDaConta(id, g.conta))) return naoAchou();
    const lido = await lerTema(id, n);
    return lido ? NextResponse.json(lido) : naoAchou();
  } catch (error) {
    return erroDoHistorico(error, 'abrir o tema');
  }
}

/** Versão nova do tema: `{ doc, nome? }`. */
export async function POST(request: Request, { params }: Ctx) {
  const g = await exigirConta();
  if ('resposta' in g) return g.resposta;
  const { id } = await params;
  if (!idDeTemaValido(id)) return naoAchou();
  try {
    const body = (await request.json()) as { nome?: unknown; doc?: unknown };
    const nome = body?.nome === undefined ? undefined : nomeValido(body.nome);
    if (nome === null || !docValido(body?.doc)) {
      return NextResponse.json(
        { message: 'Tema ou nome inválido.' },
        { status: 400 }
      );
    }
    if (!(await temaDaConta(id, g.conta))) return naoAchou();
    if (g.conta.papel !== 'admin' && !contaPode(g.conta, body.doc.platform))
      return plataformaRecusada();
    const tema = await salvarVersao(id, body.doc, nome);
    return tema ? NextResponse.json({ tema }) : naoAchou();
  } catch (error) {
    return erroDoHistorico(error, 'salvar a versão');
  }
}

/** Apaga o tema e todas as versões. */
export async function DELETE(_request: Request, { params }: Ctx) {
  const g = await exigirConta();
  if ('resposta' in g) return g.resposta;
  const { id } = await params;
  if (!idDeTemaValido(id)) return naoAchou();
  try {
    if (!(await temaDaConta(id, g.conta))) return naoAchou();
    return (await apagarTema(id))
      ? NextResponse.json({ ok: true })
      : naoAchou();
  } catch (error) {
    return erroDoHistorico(error, 'apagar o tema');
  }
}

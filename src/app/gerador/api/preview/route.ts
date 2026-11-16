import { NextResponse } from 'next/server';
import {
  savePreview,
  PreviewStoreConfigError,
  type PreviewSnapshot,
} from '@/lib/previewStore';
import { contaPode, exigirConta, plataformaRecusada } from '@/lib/contaAtual';

export async function POST(request: Request) {
  const g = await exigirConta();
  if ('resposta' in g) return g.resposta;
  try {
    const snapshot = (await request.json()) as PreviewSnapshot;

    if (!snapshot || !Array.isArray(snapshot.selections)) {
      return NextResponse.json(
        { message: 'Snapshot inválido' },
        { status: 400 }
      );
    }

    // Convidado só publica preview das plataformas da conta.
    if (g.conta.papel !== 'admin' && !contaPode(g.conta, snapshot.platform))
      return plataformaRecusada();

    const id = await savePreview(snapshot);
    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error('Erro ao salvar preview:', error);

    // Falta de banco é configuração do ambiente, não falha da requisição: sai
    // como 503 com a mensagem que diz o que fazer, em vez do 500 genérico que
    // escondia a causa (ver getStore em src/lib/previewStore.ts).
    if (error instanceof PreviewStoreConfigError) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }

    return NextResponse.json(
      { message: 'Falha ao salvar preview' },
      { status: 500 }
    );
  }
}

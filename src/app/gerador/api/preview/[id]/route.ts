import { NextResponse } from 'next/server';
import {
  idDePreviewValido,
  updatePreview,
  PreviewStoreConfigError,
  type PreviewSnapshot,
} from '@/lib/previewStore';
import { contaPode, exigirConta, plataformaRecusada } from '@/lib/contaAtual';

/**
 * Regrava o preview `id` com o tema de agora — é o que faz o /p acompanhar a
 * edição (ver src/utils/previewAoVivo.ts). Escrita: atrás do login, como o
 * POST que cria o preview (src/middleware.ts).
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const g = await exigirConta();
  if ('resposta' in g) return g.resposta;
  const { id } = await params;
  if (!idDePreviewValido(id)) {
    return NextResponse.json({ message: 'Id inválido' }, { status: 400 });
  }
  try {
    const snapshot = (await request.json()) as PreviewSnapshot;
    if (!snapshot || !Array.isArray(snapshot.selections)) {
      return NextResponse.json(
        { message: 'Snapshot inválido' },
        { status: 400 }
      );
    }
    if (g.conta.papel !== 'admin' && !contaPode(g.conta, snapshot.platform))
      return plataformaRecusada();
    const rev = await updatePreview(id, snapshot);
    return NextResponse.json({ id, rev }, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar preview:', error);
    if (error instanceof PreviewStoreConfigError) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { message: 'Falha ao atualizar preview' },
      { status: 500 }
    );
  }
}

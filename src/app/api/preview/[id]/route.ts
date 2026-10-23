import { NextResponse } from 'next/server';
import {
  getPreview,
  idDePreviewValido,
  PreviewStoreConfigError,
} from '@/lib/previewStore';

// Nunca de cache: é por esta rota que o /p aberto sabe que o tema mudou.
export const dynamic = 'force-dynamic';

/**
 * Leitura PÚBLICA de um preview — o mesmo conteúdo que o /p/{id} já mostra a
 * qualquer um com o link, então não expõe nada novo.
 *
 * - `?rev=1`: só a revisão (`{ rev }`). É o polling leve do /p aberto.
 * - sem parâmetro: o snapshot inteiro. É o que o "Editar" do /p usa para abrir
 *   o tema no editor (`/gerador?preview={id}`).
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!idDePreviewValido(id)) {
    return NextResponse.json({ message: 'Id inválido' }, { status: 400 });
  }
  try {
    const snapshot = await getPreview(id);
    if (!snapshot) {
      return NextResponse.json(
        { message: 'Preview inexistente ou expirado' },
        { status: 404 }
      );
    }
    const soRev = new URL(request.url).searchParams.has('rev');
    return NextResponse.json(soRev ? { rev: snapshot.rev ?? 0 } : snapshot, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Erro ao ler preview:', error);
    if (error instanceof PreviewStoreConfigError) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { message: 'Falha ao ler preview' },
      { status: 500 }
    );
  }
}

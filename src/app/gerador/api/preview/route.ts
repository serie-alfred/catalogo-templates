import { NextResponse } from 'next/server';
import { savePreview, type PreviewSnapshot } from '@/lib/previewStore';

export async function POST(request: Request) {
  try {
    const snapshot = (await request.json()) as PreviewSnapshot;

    if (!snapshot || !Array.isArray(snapshot.selections)) {
      return NextResponse.json(
        { message: 'Snapshot inválido' },
        { status: 400 }
      );
    }

    const id = await savePreview(snapshot);
    return NextResponse.json({ id }, { status: 200 });
  } catch (error) {
    console.error('Erro ao salvar preview:', error);
    return NextResponse.json(
      { message: 'Falha ao salvar preview' },
      { status: 500 }
    );
  }
}

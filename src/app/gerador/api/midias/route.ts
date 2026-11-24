import { NextResponse } from 'next/server';

import { exigirConta } from '@/lib/contaAtual';
import { MidiasConfigError, salvarMidia, tipoPelosBytes } from '@/lib/midiasStore';

export const dynamic = 'force-dynamic';

/**
 * Recebe uma imagem do conteúdo do cliente (`arquivo`, multipart) e devolve a
 * URL dela. Atrás do login. A imagem já chega redimensionada e em WebP
 * (`prepararImagem`, no navegador); o teto aqui é a rede de segurança, abaixo
 * do limite de 4,5 MB do corpo de uma função da Vercel.
 */
const TETO = 4 * 1024 * 1024;

export async function POST(request: Request) {
  const g = await exigirConta();
  if ('resposta' in g) return g.resposta;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: 'Envie a imagem como formulário.' }, { status: 400 });
  }
  const arquivo = form.get('arquivo');
  if (!(arquivo instanceof File)) {
    return NextResponse.json({ message: 'Envie a imagem no campo "arquivo".' }, { status: 400 });
  }
  if (arquivo.size > TETO) {
    return NextResponse.json({ message: 'A imagem passa de 4 MB depois de comprimida.' }, { status: 413 });
  }

  const bytes = new Uint8Array(await arquivo.arrayBuffer());
  const tipo = tipoPelosBytes(bytes);
  if (!tipo) {
    return NextResponse.json(
      { message: 'Formato não aceito: envie PNG, JPG, WebP, GIF ou AVIF.' },
      { status: 415 }
    );
  }

  try {
    return NextResponse.json({ url: await salvarMidia(bytes, tipo) });
  } catch (error) {
    if (error instanceof MidiasConfigError) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }
    console.error('Erro ao salvar imagem:', error);
    return NextResponse.json({ message: 'Falha ao salvar a imagem.' }, { status: 500 });
  }
}

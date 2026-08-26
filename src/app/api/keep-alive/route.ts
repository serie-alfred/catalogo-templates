import { NextResponse } from 'next/server';
import { pingPreviewStore, PreviewStoreConfigError } from '@/lib/previewStore';

/**
 * Keep-alive do banco do preview compartilhável.
 *
 * O plano Free do Upstash apaga o banco após 14 dias SEM NENHUMA requisição — e
 * o preview é usado de forma esporádica, então uma janela de duas semanas sem
 * gerar link é plausível (já aconteceu). Uma escrita trivial por dia zera esse
 * contador. Agendado em vercel.json.
 *
 * Custo: 1 comando por execução, ~30/mês contra os 500.000 do plano.
 *
 * Segurança: quando `CRON_SECRET` existe, a Vercel envia
 * `Authorization: Bearer <CRON_SECRET>` nas chamadas do cron e a rota passa a
 * exigir esse header. Sem a variável definida, a rota fica aberta — ela só
 * escreve uma chave fixa, mas defina o segredo para ninguém ficar consumindo
 * sua cota de graça.
 */

// Sempre executa: resposta de keep-alive não pode ser servida de cache.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  try {
    const backend = await pingPreviewStore();

    return NextResponse.json(
      { ok: true, backend, at: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro no keep-alive do preview:', error);

    if (error instanceof PreviewStoreConfigError) {
      return NextResponse.json({ message: error.message }, { status: 503 });
    }

    return NextResponse.json(
      { message: 'Falha ao tocar o banco do preview' },
      { status: 500 }
    );
  }
}

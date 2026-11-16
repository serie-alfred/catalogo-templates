import { NextResponse } from 'next/server';
import { exigirConta } from '@/lib/contaAtual';
import { apagarConta, atualizarConta } from '@/lib/contas';
import { erroDasContas } from '../erros';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ usuario: string }> };

const naoAchou = () =>
  NextResponse.json({ message: 'Conta não encontrada' }, { status: 404 });

/**
 * Muda a conta: `{ nome?, plataformas?, senha?, ativa? }` (só a agência).
 * Senha nova ou `ativa: false` derrubam as sessões abertas da conta.
 */
export async function PATCH(request: Request, { params }: Ctx) {
  const g = await exigirConta({ admin: true });
  if ('resposta' in g) return g.resposta;
  const { usuario } = await params;
  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const conta = await atualizarConta(decodeURIComponent(usuario), {
      nome: body.nome,
      plataformas: body.plataformas,
      senha: body.senha,
      ativa: body.ativa,
    });
    return conta ? NextResponse.json({ conta }) : naoAchou();
  } catch (error) {
    return erroDasContas(error, 'atualizar a conta');
  }
}

/** Apaga a conta (só a agência). Os temas salvos por ela ficam com a agência. */
export async function DELETE(_request: Request, { params }: Ctx) {
  const g = await exigirConta({ admin: true });
  if ('resposta' in g) return g.resposta;
  const { usuario } = await params;
  try {
    return (await apagarConta(decodeURIComponent(usuario)))
      ? NextResponse.json({ ok: true })
      : naoAchou();
  } catch (error) {
    return erroDasContas(error, 'apagar a conta');
  }
}

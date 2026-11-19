import { NextResponse } from 'next/server';
import { exigirConta } from '@/lib/contaAtual';
import {
  apagarConta,
  atualizarConta,
  reenviarConvite,
  zerar2fa,
} from '@/lib/contas';
import { erroDasContas } from '../erros';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

const naoAchou = () =>
  NextResponse.json({ message: 'Conta não encontrada' }, { status: 404 });

/**
 * Muda a conta: `{ nome?, plataformas?, ativa? }` (só a agência).
 * `ativa: false` bane o usuário no Auth e derruba as sessões dele na hora.
 */
export async function PATCH(request: Request, { params }: Ctx) {
  const g = await exigirConta({ admin: true });
  if ('resposta' in g) return g.resposta;
  const { id } = await params;
  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    const conta = await atualizarConta(id, {
      nome: body.nome,
      plataformas: body.plataformas,
      ativa: body.ativa,
    });
    return conta ? NextResponse.json({ conta }) : naoAchou();
  } catch (error) {
    return erroDasContas(error, 'atualizar a conta');
  }
}

/**
 * Ações sobre o acesso: `{ acao: 'reenviar' }` (convite de novo, ou e-mail de
 * senha nova para quem já entrou) e `{ acao: 'zerar-2fa' }` (apaga o app de
 * autenticação cadastrado; a pessoa cadastra outro no próximo login).
 */
export async function POST(request: Request, { params }: Ctx) {
  const g = await exigirConta({ admin: true });
  if ('resposta' in g) return g.resposta;
  const { id } = await params;
  try {
    const body = (await request.json().catch(() => ({}))) as Record<
      string,
      unknown
    >;
    if (body.acao === 'reenviar') {
      const enviado = await reenviarConvite(id, new URL(request.url).origin);
      return enviado ? NextResponse.json({ enviado }) : naoAchou();
    }
    if (body.acao === 'zerar-2fa') {
      const conta = await zerar2fa(id);
      return conta ? NextResponse.json({ conta }) : naoAchou();
    }
    return NextResponse.json({ message: 'Ação desconhecida' }, { status: 400 });
  } catch (error) {
    return erroDasContas(error, 'mexer no acesso');
  }
}

/** Apaga a conta (só a agência). Os temas salvos por ela ficam com a agência. */
export async function DELETE(_request: Request, { params }: Ctx) {
  const g = await exigirConta({ admin: true });
  if ('resposta' in g) return g.resposta;
  const { id } = await params;
  try {
    return (await apagarConta(id))
      ? NextResponse.json({ ok: true })
      : naoAchou();
  } catch (error) {
    return erroDasContas(error, 'apagar a conta');
  }
}

import { NextResponse } from 'next/server';
import { modoAuth } from '@/lib/auth';
import { contaAtual } from '@/lib/contaAtual';

export const dynamic = 'force-dynamic';

/**
 * O modo do login e quem está logado, para o rail decidir entre o "Sair", o
 * aviso de login desligado e o atalho "Contas" (só da agência). Lido em
 * runtime porque o modo é do ambiente em que o app roda.
 *
 * `conta` vem SEM senha nem carimbo (src/types/conta.ts); `null` = ninguém
 * logado, ou uma sessão de convidado revogada.
 */
export async function GET() {
  const conta = await contaAtual().catch(() => null);
  return NextResponse.json(
    { modo: modoAuth(), conta },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

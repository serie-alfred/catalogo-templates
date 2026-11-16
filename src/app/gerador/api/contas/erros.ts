import { NextResponse } from 'next/server';
import { ContaInvalida } from '@/lib/contas';
import { KvConfigError } from '@/lib/kv';

/** Erro de entrada vira 400 com a mensagem; sem banco, 503; o resto, 500. */
export function erroDasContas(error: unknown, acao: string) {
  if (error instanceof ContaInvalida)
    return NextResponse.json({ message: error.message }, { status: 400 });
  console.error(`Erro ao ${acao}:`, error);
  if (error instanceof KvConfigError)
    return NextResponse.json({ message: error.message }, { status: 503 });
  return NextResponse.json({ message: `Falha ao ${acao}` }, { status: 500 });
}

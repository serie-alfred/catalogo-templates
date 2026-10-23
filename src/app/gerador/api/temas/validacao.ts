import { NextResponse } from 'next/server';
import { KvConfigError } from '@/lib/kv';
import type { EstadoDoEditor } from '@/types/estadoEditor';

/** Nome de tema: texto de 1 a 80 caracteres depois do trim. */
export function nomeValido(nome: unknown): string | null {
  if (typeof nome !== 'string') return null;
  const t = nome.trim();
  return t.length > 0 && t.length <= 80 ? t : null;
}

/** O mínimo para ser um estado do editor; o resto o editor sanitiza ao abrir. */
export function docValido(doc: unknown): doc is EstadoDoEditor {
  return (
    !!doc &&
    typeof doc === 'object' &&
    Array.isArray((doc as EstadoDoEditor).selections)
  );
}

/** Falta de banco vira 503 com o que fazer; o resto, 500 genérico. */
export function erroDoHistorico(error: unknown, acao: string) {
  console.error(`Erro ao ${acao}:`, error);
  if (error instanceof KvConfigError) {
    return NextResponse.json({ message: error.message }, { status: 503 });
  }
  return NextResponse.json({ message: `Falha ao ${acao}` }, { status: 500 });
}

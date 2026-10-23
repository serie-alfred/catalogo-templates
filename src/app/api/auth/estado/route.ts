import { NextResponse } from 'next/server';
import { modoAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * O modo do login, para o editor decidir entre o "Sair" e o aviso de login
 * desligado. Lido em runtime (e não no layout) porque o /gerador é
 * pré-renderizado no build, e o modo é do ambiente em que ele roda.
 */
export function GET() {
  return NextResponse.json(
    { modo: modoAuth() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

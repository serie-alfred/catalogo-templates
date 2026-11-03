import { NextResponse, type NextRequest } from 'next/server';
import { getKv } from '@/lib/kv';
import { comerciais, mensagemInicial } from '@/lib/comercial';

export const dynamic = 'force-dynamic';

/**
 * O botão de WhatsApp do site: redireciona para o `wa.me` de um comercial, com
 * a mensagem pronta (e o template que o visitante estava provando).
 *
 * Rodízio grudado: visitante novo recebe o PRÓXIMO da fila (contador no KV) e
 * guarda o nome num cookie de 30 dias, então quem volta fala com a mesma
 * pessoa. Se esse nome saiu da lista, entra na fila de novo. Sem KV, sorteia.
 * Sem ninguém em `COMERCIAIS`, leva ao formulário.
 */
const COOKIE = 'etemas_comercial';
const TRINTA_DIAS = 60 * 60 * 24 * 30;
const DEZ_ANOS = 60 * 60 * 24 * 365 * 10;

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const lista = comerciais();
  if (!lista.length) {
    return NextResponse.redirect(new URL('/#contato', url), 302);
  }

  // O Next codifica e decodifica o valor do cookie sozinho: nome com espaço
  // ou acento ("Ana Paula", "João") volta igual.
  const nomeGuardado = request.cookies.get(COOKIE)?.value ?? null;

  let escolhido = lista.find(c => c.nome === nomeGuardado);
  if (!escolhido) {
    const kv = await getKv().catch(() => null);
    const vez = kv
      ? await kv.incr('comercial:rodizio', DEZ_ANOS).catch(() => null)
      : null;
    escolhido =
      vez === null
        ? lista[Math.floor(Math.random() * lista.length)]
        : lista[(vez - 1) % lista.length];
  }

  const texto = mensagemInicial(url.searchParams.get('template'));
  const destino = `https://wa.me/${escolhido.numero}?text=${encodeURIComponent(texto)}`;
  const resposta = NextResponse.redirect(destino, 302);
  resposta.cookies.set(COOKIE, escolhido.nome, {
    maxAge: TRINTA_DIAS,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
  resposta.headers.set('Cache-Control', 'no-store');
  return resposta;
}

import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_SESSAO, modoAuth, sessaoValida } from '@/lib/auth';

/**
 * A porta do /gerador (ver src/lib/auth.ts para os modos).
 *
 * PROTEGIDO: tudo sob `/gerador` — o editor, o iframe do canvas
 * (`/gerador/frame-mobile`) e as APIs (`/gerador/api/*`: criar e regravar
 * preview, histórico, envio do config, catálogo de fontes).
 *
 * PÚBLICO, de propósito: a home, o preview `/p/...` e a leitura dele
 * (`/api/preview/{id}`), o `/login` e o `/api/auth/*`, o `/api/keep-alive` do
 * cron, e os ARQUIVOS estáticos que moram sob `/gerador/` no `public/` (as
 * fixtures do checkout e as imagens das famílias): o /p os carrega, e o
 * visitante do link não tem sessão. A regra para eles é "último segmento com
 * extensão" — nenhuma rota do app tem ponto no nome, e um arquivo novo no
 * `public/gerador/` fica público sem lista para manter.
 */
export const config = {
  matcher: ['/gerador', '/gerador/:path*'],
};

let avisou = false;

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Arquivo do public/ (fixture do checkout, imagem da família 08…).
  if (/\.[a-z0-9]+$/i.test(pathname.split('/').pop() ?? '')) {
    return NextResponse.next();
  }

  const modo = modoAuth();
  const ehApi = pathname.startsWith('/gerador/api/');

  if (modo === 'desligado-dev') {
    if (!avisou) {
      avisou = true;
      console.warn(
        '⚠️  Login DESLIGADO (desenvolvimento sem ETEMAS_LOGIN_USER, ' +
          'ETEMAS_LOGIN_PASSWORD e ETEMAS_SESSION_SECRET). Em produção, sem elas, ' +
          'o /gerador fica fechado.'
      );
    }
    return NextResponse.next();
  }

  if (
    modo === 'ligado' &&
    (await sessaoValida(request.cookies.get(COOKIE_SESSAO)?.value))
  ) {
    return NextResponse.next();
  }

  if (ehApi) {
    return modo === 'fechado'
      ? NextResponse.json(
          {
            message:
              'Acesso fechado: o login do E-temas não está configurado neste ambiente.',
          },
          { status: 503 }
        )
      : NextResponse.json(
          { message: 'Sessão ausente ou expirada: faça login.' },
          { status: 401 }
        );
  }

  const login = new URL('/login', request.url);
  login.searchParams.set('next', `${pathname}${search}`);
  return NextResponse.redirect(login);
}

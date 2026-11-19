import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { configDoSupabase, modoAuth } from '@/lib/auth';

/**
 * A porta do /gerador (ver src/lib/auth.ts para os modos).
 *
 * PROTEGIDO: tudo sob `/gerador` — o editor, o iframe do canvas
 * (`/gerador/frame-mobile`) e as APIs (`/gerador/api/*`). Só passa sessão
 * Supabase `aal2` (senha + código do app de autenticação). Página sem ela vai
 * ao `/login?next=…` (que leva ao código, ou ao cadastro do app, quando a senha
 * já foi); API responde 401 JSON.
 *
 * O Edge confere o JWT (assinatura e `aal`). Se a conta está ATIVA, e quais
 * plataformas tem, é a camada Node que confere (src/lib/contaAtual.ts), na
 * página do editor e em toda API: o Edge não lê a tabela `contas`.
 *
 * `/login` e `/auth/*` também passam por aqui, só para RENOVAR a sessão
 * (cookies) antes da página rodar — uma página não consegue gravar cookie, e
 * um refresh token renovado e não gravado é um token queimado.
 *
 * PÚBLICO, de propósito: a home, o preview `/p/...` e a leitura dele
 * (`/api/preview/{id}`), o `/login`, o `/auth/*` e o `/api/auth/*`, o
 * `/api/keep-alive` do cron, e os ARQUIVOS estáticos que moram sob `/gerador/`
 * no `public/` (as fixtures do checkout e as imagens das famílias): o /p os
 * carrega, e o visitante do link não tem sessão. A regra para eles é "último
 * segmento com extensão" — nenhuma rota do app tem ponto no nome.
 */
export const config = {
  matcher: ['/gerador', '/gerador/:path*', '/login', '/auth/:path*'],
};

let avisou = false;

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Arquivo do public/ (fixture do checkout, imagem da família 08…).
  if (/\.[a-z0-9]+$/i.test(pathname.split('/').pop() ?? '')) {
    return NextResponse.next();
  }

  const protegido = pathname === '/gerador' || pathname.startsWith('/gerador/');
  const ehApi = pathname.startsWith('/gerador/api/');
  const modo = modoAuth();

  if (modo === 'desligado-dev') {
    if (!avisou) {
      avisou = true;
      console.warn(
        '⚠️  Login DESLIGADO (desenvolvimento sem NEXT_PUBLIC_SUPABASE_URL, ' +
          'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY e SUPABASE_SECRET_KEY). Em ' +
          'produção, sem elas, o /gerador fica fechado.'
      );
    }
    return NextResponse.next();
  }

  const supa = configDoSupabase();
  if (modo === 'fechado' || !supa) {
    if (!protegido) return NextResponse.next();
    if (ehApi)
      return NextResponse.json(
        {
          message:
            'Acesso fechado: o login do E-temas não está configurado neste ambiente.',
        },
        { status: 503 }
      );
    return paraOLogin(request, `${pathname}${search}`);
  }

  // A receita do @supabase/ssr: os cookies renovados vão para o pedido (o que
  // a página vai ler) E para a resposta (o que o navegador grava).
  let resposta = NextResponse.next({ request });
  const cabecalhos: Record<string, string> = {};
  const supabase = createServerClient(supa.url, supa.chave, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(lista, headers) {
        for (const { name, value } of lista) request.cookies.set(name, value);
        resposta = NextResponse.next({ request });
        for (const { name, value, options } of lista)
          resposta.cookies.set(name, value, options);
        Object.assign(cabecalhos, headers);
        for (const [k, v] of Object.entries(headers))
          resposta.headers.set(k, v);
      },
    },
  });

  // Nada entre criar o cliente e o getClaims: é ele que renova a sessão.
  const { data, error } = await supabase.auth.getClaims();
  const claims = error ? null : data?.claims;

  if (!protegido || claims?.aal === 'aal2') return resposta;

  // Sem sessão aal2: recusa, levando os cookies renovados junto.
  const recusa = ehApi
    ? NextResponse.json(
        {
          message: claims
            ? 'Falta o código do app de autenticação: faça login.'
            : 'Sessão ausente ou expirada: faça login.',
        },
        { status: 401 }
      )
    : paraOLogin(request, `${pathname}${search}`);
  for (const c of resposta.cookies.getAll()) recusa.cookies.set(c);
  for (const [k, v] of Object.entries(cabecalhos)) recusa.headers.set(k, v);
  return recusa;
}

function paraOLogin(request: NextRequest, next: string) {
  const login = new URL('/login', request.url);
  login.searchParams.set('next', next);
  return NextResponse.redirect(login);
}

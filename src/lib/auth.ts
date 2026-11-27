/**
 * Login do /gerador: Supabase Auth, com verificação em duas etapas (TOTP)
 * OBRIGATÓRIA. Só uma sessão `aal2` (senha + código) chega ao editor.
 *
 * Este arquivo roda no middleware (Edge) e nas rotas (Node): só lê o
 * ambiente, sem cliente nem chave secreta. Os clientes ficam em
 * `src/lib/supabase/` (o da chave secreta é `server-only`).
 *
 * Variáveis (cadastradas na Vercel; NUNCA no código — este repo é público):
 *   NEXT_PUBLIC_SUPABASE_URL ............. a URL do projeto
 *   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY . a chave pública (`sb_publishable_…`)
 *   SUPABASE_SECRET_KEY .................. a chave secreta (`sb_secret_…`), SÓ
 *                                          no servidor: lê e grava a tabela
 *                                          `contas` e administra os usuários
 *
 * Três modos (`modoAuth`):
 *   - `ligado` ........... as três existem: /gerador e as APIs pedem sessão aal2;
 *   - `fechado` .......... produção sem elas: NINGUÉM entra, e o /login diz o
 *                          que cadastrar. Abrir por falta de configuração seria
 *                          o pior default;
 *   - `desligado-dev` .... desenvolvimento sem elas: o login some, com aviso,
 *                          para o `yarn dev` e o funil rodarem sem credencial.
 *
 * Quem é o quê (agência ou convidado, plataformas, ativa) mora na tabela
 * `public.contas` (supabase/migrations), conferida a cada requisição pela
 * camada Node (`src/lib/contaAtual.ts`): o JWT diz quem é, a tabela diz se
 * ainda pode.
 */

export type ModoAuth = 'ligado' | 'fechado' | 'desligado-dev';

/** `admin` é a agência; `convidado`, as contas que ela cria. */
export type Papel = 'admin' | 'convidado';

/** Senha mínima (convite e redefinição). */
export const SENHA_MINIMA = 8;

/** As variáveis do login, por NOME. */
export const VARIAVEIS_DO_LOGIN = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SECRET_KEY',
] as const;

/**
 * URL e chave pública do projeto, ou `null` se o login não está configurado.
 * Lidas pelo nome literal: o Next só embute as `NEXT_PUBLIC_*` acessadas assim.
 */
export function configDoSupabase(): { url: string; chave: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';
  if (!url || !chave || !process.env.SUPABASE_SECRET_KEY) return null;
  return { url, chave };
}

export function modoAuth(): ModoAuth {
  if (configDoSupabase()) return 'ligado';
  return process.env.NODE_ENV === 'production' ? 'fechado' : 'desligado-dev';
}

/** O que falta configurar, por NOME (nunca o valor). */
export function variaveisFaltando(): string[] {
  const presentes: Record<(typeof VARIAVEIS_DO_LOGIN)[number], boolean> = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY: !!process.env.SUPABASE_SECRET_KEY,
  };
  return VARIAVEIS_DO_LOGIN.filter(v => !presentes[v]);
}

/**
 * Destino depois do login: só caminho DESTA origem. `//outro.site` e
 * `/\outro.site` são URLs absolutas para o navegador — o clássico open redirect.
 */
export function destinoSeguro(next: string | null | undefined): string {
  if (
    !next ||
    !next.startsWith('/') ||
    next.startsWith('//') ||
    next.startsWith('/\\')
  )
    return '/gerador';
  return next;
}

/** O IP de quem pede (para o limite de tentativas). */
export function ipDe(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local'
  );
}

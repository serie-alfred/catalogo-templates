import 'server-only';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { configDoSupabase } from '@/lib/auth';

/**
 * Cliente do Supabase com a sessão de QUEM PEDE (cookies), para páginas e
 * rotas. Usa a chave PÚBLICA: age como o usuário, nunca como administrador
 * (esse é o `clienteAdmin`, de src/lib/supabase/admin.ts).
 *
 * Numa página (Server Component) o Next não deixa gravar cookie: o `setAll`
 * engole o erro. Não perde nada — o middleware já renovou a sessão antes de
 * a página rodar (o matcher inclui /gerador, /login e /auth).
 *
 * `null` quando o login não está configurado (`modoAuth() !== 'ligado'`).
 */
export async function clienteDoServidor() {
  const config = configDoSupabase();
  if (!config) return null;
  const loja = await cookies();
  return createServerClient(config.url, config.chave, {
    cookies: {
      getAll: () => loja.getAll(),
      setAll(lista) {
        try {
          for (const { name, value, options } of lista)
            loja.set(name, value, options);
        } catch {
          // Server Component: só leitura (ver acima).
        }
      },
    },
  });
}

export type ClienteDoServidor = NonNullable<
  Awaited<ReturnType<typeof clienteDoServidor>>
>;

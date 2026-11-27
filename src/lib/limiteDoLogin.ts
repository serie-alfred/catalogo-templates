import 'server-only';

import { ipDe } from './auth';
import { getKv } from './kv';

/**
 * Limite de tentativas do login: 10 erros (senha OU código do app) por IP em
 * 15 minutos, contados no mesmo KV do preview (em dev, o arquivo de
 * `src/lib/kv.ts`). O Supabase tem limites próprios; este fica na frente, por IP.
 *
 * Sem banco o login segue funcionando, só sem o limite — derrubar o login por
 * causa do contador seria trocar um risco pequeno por uma porta fechada.
 */
const MAX_FALHAS = 10;
const JANELA_SEGUNDOS = 15 * 60;

export async function limiteDoLogin(request: Request) {
  const chave = `login-falhas:${ipDe(request)}`;
  const kv = await getKv().catch(() => null);
  const falhas = kv ? ((await kv.get<number>(chave).catch(() => 0)) ?? 0) : 0;
  return {
    bloqueado: falhas >= MAX_FALHAS,
    async falhou() {
      await kv?.incr(chave, JANELA_SEGUNDOS).catch(() => {});
    },
    async zerar() {
      await kv?.del([chave]).catch(() => {});
    },
  };
}

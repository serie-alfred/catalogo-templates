import { NextResponse } from 'next/server';
import { pingPreviewStore, PreviewStoreConfigError } from '@/lib/previewStore';
import { clienteAdmin } from '@/lib/supabase/admin';

/**
 * Keep-alive dos dois bancos de plano gratuito, uma vez por dia (vercel.json):
 *
 *   - PREVIEW (Upstash/Vercel KV): o plano Free apaga o banco após 14 dias SEM
 *     NENHUMA requisição — e o preview é usado de forma esporádica (já
 *     aconteceu). Uma escrita trivial por dia zera esse contador. ~30 comandos
 *     por mês contra os 500.000 do plano.
 *   - LOGIN (Supabase): o plano Free PAUSA o projeto após 7 dias sem
 *     atividade, e com ele pausado ninguém entra no /gerador. Uma leitura leve
 *     (a contagem da tabela `contas`, com a chave secreta) por dia basta. Sem
 *     a tabela (migração ainda não rodou), lista um usuário do Auth, que também
 *     é atividade no banco.
 *
 * A resposta diz ok/erro POR SERVIÇO e é 200 só com todos ok — o painel de cron
 * da Vercel mostra a falha de qualquer um. Serviço não configurado neste
 * ambiente (Supabase sem as variáveis) aparece como `pulado`, sem reprovar.
 *
 * Segurança: quando `CRON_SECRET` existe, a Vercel envia
 * `Authorization: Bearer <CRON_SECRET>` nas chamadas do cron e a rota passa a
 * exigir esse header. Sem a variável definida, a rota fica aberta — ela só faz
 * leituras e uma escrita fixa, mas defina o segredo para ninguém ficar
 * consumindo sua cota de graça.
 */

// Sempre executa: resposta de keep-alive não pode ser servida de cache.
export const dynamic = 'force-dynamic';

type Resultado =
  | { ok: true; detalhe: string }
  | { ok: false; erro: string }
  | { ok: true; pulado: string };

async function preview(): Promise<Resultado> {
  try {
    return { ok: true, detalhe: await pingPreviewStore() };
  } catch (error) {
    console.error('Erro no keep-alive do preview:', error);
    return {
      ok: false,
      erro:
        error instanceof PreviewStoreConfigError
          ? error.message
          : 'Falha ao tocar o banco do preview',
    };
  }
}

async function supabase(): Promise<Resultado> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY)
    return { ok: true, pulado: 'Supabase não configurado neste ambiente' };
  try {
    const sb = clienteAdmin();
    const { error, count } = await sb
      .from('contas')
      .select('user_id', { count: 'exact' })
      .limit(1);
    if (!error) return { ok: true, detalhe: `contas: ${count ?? 0}` };
    // Tabela ausente: ainda é atividade, pelo Auth.
    const auth = await sb.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (auth.error) throw new Error(auth.error.message);
    return {
      ok: true,
      detalhe: `auth (contas: ${error.code ?? error.message})`,
    };
  } catch (error) {
    console.error('Erro no keep-alive do Supabase:', error);
    return { ok: false, erro: 'Falha ao tocar o Supabase' };
  }
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
  }

  const [p, s] = await Promise.all([preview(), supabase()]);
  const ok = p.ok && s.ok;
  return NextResponse.json(
    { ok, servicos: { preview: p, supabase: s }, at: new Date().toISOString() },
    { status: ok ? 200 : 500 }
  );
}

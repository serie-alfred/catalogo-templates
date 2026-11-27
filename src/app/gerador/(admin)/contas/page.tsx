import { redirect } from 'next/navigation';
import { contaAtual } from '@/lib/contaAtual';
import { listarContas, type ContaPublica } from '@/lib/contas';
import { PLATFORMS, rotuloDaPlataforma } from '@/types/platform';
import PainelDeContas from './PainelDeContas';

// Lê a sessão e o Supabase: nunca pré-renderizar.
export const dynamic = 'force-dynamic';

/**
 * Contas e acessos: a agência convida as contas de convidado (stakeholders,
 * pelo e-mail) e escolhe quais plataformas cada uma vê no editor. Só a
 * agência fica aqui: a página confere a conta inteira (e a API, de novo).
 */
export default async function ContasPage() {
  const conta = await contaAtual();
  if (!conta) redirect('/login?next=/gerador/contas');
  if (conta.papel !== 'admin') redirect('/gerador');

  let contas: ContaPublica[] = [];
  let erro: string | null = null;
  try {
    contas = await listarContas();
  } catch (e) {
    erro =
      e instanceof Error
        ? e.message
        : 'Não foi possível ler as contas do banco.';
  }

  return (
    <PainelDeContas
      inicial={contas}
      erroInicial={erro}
      agencia={conta.usuario}
      plataformas={PLATFORMS.map(p => ({
        valor: p,
        rotulo: rotuloDaPlataforma(p),
      }))}
    />
  );
}

import { redirect } from 'next/navigation';
import { usuarioDaAgencia } from '@/lib/auth';
import { contaAtual } from '@/lib/contaAtual';
import { listarContas, SENHA_MINIMA, type ContaPublica } from '@/lib/contas';
import { PLATFORMS, rotuloDaPlataforma } from '@/types/platform';
import PainelDeContas from './PainelDeContas';

// Lê o cookie e o KV: nunca pré-renderizar.
export const dynamic = 'force-dynamic';

/**
 * Contas e acessos: a agência cria as contas de convidado (stakeholders) e
 * escolhe quais plataformas cada uma vê no editor. Só a agência chega aqui (o
 * middleware barra o convidado; esta página confere de novo, pela conta inteira).
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
      agencia={usuarioDaAgencia() ?? conta.usuario}
      senhaMinima={SENHA_MINIMA}
      plataformas={PLATFORMS.map(p => ({
        valor: p,
        rotulo: rotuloDaPlataforma(p),
      }))}
    />
  );
}

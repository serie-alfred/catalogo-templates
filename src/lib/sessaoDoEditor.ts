import 'server-only';

import { contaAtual } from './contaAtual';

/**
 * Quem está vendo esta página entraria no /gerador agora? É o que decide o
 * "Editar" do /p: o link do preview vai ao cliente, e só quem tem conta,
 * logado, pode voltar dele ao editor.
 *
 * Mesma regra do editor (`contaAtual`): com o login ligado, a conta inteira
 * conferida — inclusive a de convidado revogada ou desativada, que o cookie
 * sozinho não revela; em desenvolvimento sem as variáveis o editor é aberto a
 * todos, então sim; e com o acesso fechado (produção sem as variáveis), ninguém.
 *
 * Fora do middleware de propósito: lê `next/headers` e o KV, que o Edge não
 * carrega, e torna a página dinâmica (o /p já é: lê o KV).
 */
export async function podeAbrirOEditor(): Promise<boolean> {
  return (await contaAtual()) !== null;
}

import 'server-only';

import { cookies } from 'next/headers';

import { COOKIE_SESSAO, modoAuth, sessaoValida } from './auth';

/**
 * Quem está vendo esta página entraria no /gerador agora? É o que decide o
 * "Editar" do /p: o link do preview vai ao cliente, e só a agência, logada,
 * pode voltar dele ao editor.
 *
 * Mesma regra do middleware: com o login ligado, vale o cookie de sessão; em
 * desenvolvimento sem as variáveis o editor é aberto a todos, então sim; e com
 * o acesso fechado (produção sem as variáveis), ninguém.
 *
 * Fora do middleware de propósito: lê `next/headers`, que o Edge não precisa
 * carregar, e torna a página dinâmica (o /p já é: lê o KV).
 */
export async function podeAbrirOEditor(): Promise<boolean> {
  const modo = modoAuth();
  if (modo === 'desligado-dev') return true;
  if (modo === 'fechado') return false;
  return sessaoValida((await cookies()).get(COOKIE_SESSAO)?.value);
}

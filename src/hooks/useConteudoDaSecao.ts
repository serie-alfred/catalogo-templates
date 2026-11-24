import { useContext, useMemo } from 'react';

import { SecaoConteudoContext } from '@/context/ConteudoContext';
import { resolverConteudo, sanitizarConteudo } from '@/utils/conteudo';

/**
 * O conteúdo que o template deve desenhar: o `mock` com o que o CS mudou por
 * cima. É a ÚNICA porta pela qual um template lê conteúdo — o mock fica no
 * próprio arquivo (`const MOCK: XConteudo = {…}`, com os nomes de campo do
 * schema do starter) e o render usa só o que este hook devolve.
 *
 *   const { benefits } = useConteudoDaSecao(MOCK);
 *
 * Passe uma constante de módulo: o `useMemo` compara o `mock` por referência.
 * O nível 1 é sanitizado aqui porque também chega do snapshot do /p, que é
 * público (ver `sanitizarConteudo`).
 */
export function useConteudoDaSecao<T extends object>(mock: T): T {
  const conteudo = useContext(SecaoConteudoContext)?.conteudo;
  return useMemo(
    () => resolverConteudo(mock, sanitizarConteudo(conteudo)),
    [mock, conteudo]
  );
}

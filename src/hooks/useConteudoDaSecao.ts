import { useContext, useMemo } from 'react';

import {
  ConteudoLojaContext,
  SecaoConteudoContext,
} from '@/context/ConteudoContext';
import { resolverConteudo, sanitizarConteudo } from '@/utils/conteudo';
import { projetarLoja } from '@/utils/conteudoLoja';

/**
 * O conteúdo que o template deve desenhar: o `mock`, com o conteúdo da loja por
 * cima (os vínculos de src/utils/conteudoLoja.ts) e o que o CS mudou NESTA
 * seção por cima de tudo. É a ÚNICA porta pela qual um template lê conteúdo — o
 * mock fica no próprio arquivo (`const MOCK: XConteudo = {…}`, com os nomes de
 * campo do schema do starter) e o render usa só o que este hook devolve.
 *
 *   const { benefits } = useConteudoDaSecao(MOCK);
 *
 * Passe uma constante de módulo: o `useMemo` compara o `mock` por referência.
 * O nível 1 é sanitizado aqui porque também chega do snapshot do /p, que é
 * público (ver `sanitizarConteudo`); a loja chega sanitizada do ThemeRenderer.
 */
export function useConteudoDaSecao<T extends object>(mock: T): T {
  const secao = useContext(SecaoConteudoContext);
  const loja = useContext(ConteudoLojaContext);
  const componente = secao?.componente ?? '';
  const conteudo = secao?.conteudo;
  return useMemo(
    () =>
      resolverConteudo(
        mock,
        projetarLoja(componente, loja, mock).conteudo,
        sanitizarConteudo(conteudo)
      ),
    [mock, componente, loja, conteudo]
  );
}

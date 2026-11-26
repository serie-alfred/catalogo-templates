import { useContext } from 'react';

import { ConteudoLojaContext } from '@/context/ConteudoContext';

/**
 * O nome da loja (Conteúdo da loja → "Nome da loja") para a marca em texto de um
 * header que não tem campo de nome no schema (o "SERIE//A" fixo das famílias 01,
 * 06, 07 e 08). '' = sem nome, o template mantém a marca do modelo.
 *
 * Vale em toda plataforma, como todo o conteúdo da loja (ver useConteudoDaSecao).
 */
export function useNomeDaLoja(): string {
  const loja = useContext(ConteudoLojaContext);
  return (loja?.nomeDaLoja ?? '').trim();
}

import { useContext, useMemo } from 'react';

import { ConteudoLojaContext } from '@/context/ConteudoContext';
import { produtosDaLoja, type ProdutoNormal } from '@/utils/produtos';

/**
 * Os produtos do cliente (`ConteudoLoja.produtos`, já normalizados), ou `null`
 * quando a loja não cadastrou nenhum — e aí a peça mostra os de exemplo.
 *
 * Toda lista de produtos (vitrine, vitrine com banner, grade da categoria,
 * relacionados) e toda PDP lê daqui, e converte para o tipo do próprio card com
 * o `deProdutoNN` da família:
 *
 *   const daLoja = useProdutosDaLoja();
 *   const lista = daLoja ? daLoja.map(deProduto09) : PRODUTOS;
 *
 * A loja chega pelo `ThemeRenderer` (canvas, /p, palco do export); fora dele
 * (thumbs) é sempre `null`.
 */
export function useProdutosDaLoja(): ProdutoNormal[] | null {
  const loja = useContext(ConteudoLojaContext);
  return useMemo(() => produtosDaLoja(loja), [loja]);
}

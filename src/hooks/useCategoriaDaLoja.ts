import { useContext, useMemo } from 'react';

import { ConteudoLojaContext } from '@/context/ConteudoContext';
import { categoriaDaLoja, type CategoriaNormal } from '@/utils/categoriaDaLoja';

/**
 * A categoria da página de categoria (nome, descrição, FAQ), ou `null` quando
 * o CS não preencheu — e aí a peça mostra a categoria de exemplo dela.
 *
 * O título, a descrição e a grade da página de categoria de toda família leem
 * daqui: nas plataformas isso vem do cadastro da categoria, não do CMS da seção.
 *
 *   const categoria = useCategoriaDaLoja();
 *   const nome = categoria?.name || NOME_DE_EXEMPLO;
 */
export function useCategoriaDaLoja(): CategoriaNormal | null {
  const loja = useContext(ConteudoLojaContext);
  return useMemo(() => categoriaDaLoja(loja), [loja]);
}

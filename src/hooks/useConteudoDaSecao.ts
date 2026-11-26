import { useContext, useMemo } from 'react';

import {
  ConteudoLojaContext,
  PlataformaContext,
  SecaoConteudoContext,
} from '@/context/ConteudoContext';
import { resolverConteudo, sanitizarConteudo } from '@/utils/conteudo';
import { projetarLoja } from '@/utils/conteudoLoja';
import { camposEditaveis, soEditaveis } from '@/utils/editaveis';

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
 *
 * O Nível 1 (o que o CS digitou NA SEÇÃO) só vale nos campos que o lojista da
 * plataforma muda depois (src/utils/editaveis.ts); nos outros fica o mock, o texto
 * fixo do tema. O conteúdo da LOJA (nome, menu, contato…) passa sempre:
 * são dados da loja, que a implantação leva ao tema em qualquer plataforma.
 */
export function useConteudoDaSecao<T extends object>(mock: T): T {
  const secao = useContext(SecaoConteudoContext);
  const loja = useContext(ConteudoLojaContext);
  const platform = useContext(PlataformaContext);
  const componente = secao?.componente ?? '';
  const conteudo = secao?.conteudo;
  return useMemo(() => {
    const editaveis = camposEditaveis(platform, componente);
    return resolverConteudo(
      mock,
      projetarLoja(componente, loja, mock).conteudo,
      soEditaveis(sanitizarConteudo(conteudo), editaveis, mock)
    );
  }, [mock, componente, loja, conteudo, platform]);
}

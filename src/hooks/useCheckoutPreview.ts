'use client';

import { useMemo } from 'react';

import { useLayout } from '@/context/LayoutContext';
import { resolverPapeis, variaveisGlobais } from '@/utils/checkout';

/**
 * Os dois níveis do checkout a partir do estado do editor, memoizados: o nível
 * 2 (as cores e fontes globais da loja, no formato `faststore.variables`) e o
 * nível 1 (os papéis do checkout). O canvas e o painel de papéis leem os MESMOS
 * objetos — e o export chama a mesma `variaveisGlobais`.
 */
export function useCheckoutPreview() {
  const {
    colorPrimary,
    colorSecondary,
    colorTertiary,
    colorPrimaryBackground,
    colorSecondaryBackground,
    colorTertiaryBackground,
    colorFooter,
    colorFooterText,
    colorPrimaryText,
    colorSecondaryText,
    fontPrimary,
    fontSecondary,
    fontTertiary,
    checkout,
  } = useLayout();

  const level2 = useMemo(
    () =>
      variaveisGlobais(
        {
          colorPrimary,
          colorSecondary,
          colorTertiary,
          colorPrimaryBackground,
          colorSecondaryBackground,
          colorTertiaryBackground,
          colorFooter,
          colorFooterText,
          colorPrimaryText,
          colorSecondaryText,
        },
        { fontPrimary, fontSecondary, fontTertiary }
      ),
    [
      colorPrimary,
      colorSecondary,
      colorTertiary,
      colorPrimaryBackground,
      colorSecondaryBackground,
      colorTertiaryBackground,
      colorFooter,
      colorFooterText,
      colorPrimaryText,
      colorSecondaryText,
      fontPrimary,
      fontSecondary,
      fontTertiary,
    ]
  );

  const level1 = checkout.variables;
  const resolvidos = useMemo(
    () => resolverPapeis(level2, level1),
    [level2, level1]
  );

  return { level2, level1, resolvidos };
}

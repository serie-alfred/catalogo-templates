import { useLayout } from '@/context/LayoutContext';

/**
 * O logo que um rodapé mostra: o "Logo do rodapé" enviado no /gerador e, sem
 * ele, o logo principal. Existe porque header claro + rodapé escuro com o
 * mesmo logo apaga a marca num dos dois. O header continua com `logo`.
 */
export function useLogoDoRodape(): string {
  const { logo, footerLogo } = useLayout();
  return footerLogo || logo;
}

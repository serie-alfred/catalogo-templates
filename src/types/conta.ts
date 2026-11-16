import type { Platform } from './platform';

/**
 * Quem está usando o editor, como o servidor resolveu (src/lib/contaAtual.ts).
 * Vai para o cliente: sem senha, hash ou carimbo.
 *
 * `plataformas` já são as que a conta pode usar AGORA (lidas do KV a cada
 * requisição para o convidado; todas as oferecidas para a agência).
 */
export interface ContaAtual {
  usuario: string;
  papel: 'admin' | 'convidado';
  plataformas: Platform[];
}

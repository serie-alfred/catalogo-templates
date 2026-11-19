import type { Platform } from './platform';

/**
 * Quem está usando o editor, como o servidor resolveu (src/lib/contaAtual.ts).
 * Vai para o cliente: sem token, senha ou fator.
 *
 * `id` é o do usuário no Supabase Auth (é o `dono` dos temas salvos);
 * `usuario` é o e-mail, para mostrar (assunto do e-mail do config, painel).
 * `plataformas` já são as que a conta pode usar AGORA (lidas da tabela
 * `contas` a cada requisição; todas as oferecidas para a agência).
 */
export interface ContaAtual {
  id: string;
  usuario: string;
  papel: 'admin' | 'convidado';
  plataformas: Platform[];
}

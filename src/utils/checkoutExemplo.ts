/**
 * O texto de EXEMPLO do rodapé do checkout no preview do /gerador (gate0 #26).
 *
 * O `checkout-footer.html` do modelo sai do compose com três placeholders que
 * o cliente não preenche no /gerador — razão social, CNPJ e aviso legal são
 * dados da empresa, que o time de implantação completa antes de subir o
 * template no Admin (o README do `checkout/` lista cada um). No canvas, um
 * `{{CNPJ}}` cru parece defeito; por isso o PREVIEW troca cada um por um texto
 * de exemplo, e só ele: o compose, o export e o arquivo entregue continuam com
 * os placeholders (o funil 3-export confere no compose do config exportado).
 *
 * Nada aqui é dado real — o catálogo é repo PÚBLICO.
 *
 * Puro e sem o alias `@/`: o funil (2-checkout, 3-export) importa este arquivo
 * direto pelo type-stripping do Node.
 */
export const EXEMPLO_DO_RODAPE: Readonly<Record<string, string>> = {
  '{{RAZAO_SOCIAL}}': 'Razão Social da Loja LTDA',
  // O template já escreve "CNPJ: " antes do placeholder.
  '{{CNPJ}}': '00.000.000/0001-00',
  '{{AVISO_LEGAL}}':
    'Aviso legal de exemplo: preços e condições de pagamento exclusivos para compras neste site.',
};

/** Os placeholders que o preview troca, na ordem do rodapé. */
export const PLACEHOLDERS_DO_RODAPE = Object.keys(EXEMPLO_DO_RODAPE);

/**
 * O rodapé composto com o texto de exemplo no lugar dos placeholders — o que o
 * slot do footer mostra no preview. Não use no que é entregue.
 */
export function rodapeDeExemplo(footer: string): string {
  let saida = footer;
  for (const [placeholder, exemplo] of Object.entries(EXEMPLO_DO_RODAPE))
    saida = saida.split(placeholder).join(exemplo);
  return saida;
}

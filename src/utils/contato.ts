/** Opções do formulário de contato: o rodapé e a rota `/api/contato` leem daqui. */
export const SEGMENTOS = [
  { valor: 'moda', rotulo: 'Moda' },
  { valor: 'casa-construcao', rotulo: 'Casa e construção' },
  { valor: 'alimentacao', rotulo: 'Alimentação e bebidas' },
  { valor: 'beleza-saude', rotulo: 'Beleza e saúde' },
  { valor: 'eletronicos', rotulo: 'Eletrônicos' },
  { valor: 'varejo', rotulo: 'Varejo geral' },
  { valor: 'outro', rotulo: 'Outro' },
] as const;

export const FAIXAS_COLABORADORES = [
  '1-20',
  '21-50',
  '51-100',
  '100+',
] as const;

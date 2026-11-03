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

export const PLATAFORMAS = [
  { valor: 'vtex', rotulo: 'VTEX FastStore' },
  { valor: 'wake', rotulo: 'Wake' },
  { valor: 'tray', rotulo: 'Tray' },
  { valor: 'outra', rotulo: 'Outra ou ainda não tenho' },
] as const;

/** Como o visitante prefere que o comercial responda. */
export const PREFERENCIAS = [
  { valor: 'whatsapp', rotulo: 'WhatsApp' },
  { valor: 'email', rotulo: 'E-mail' },
] as const;

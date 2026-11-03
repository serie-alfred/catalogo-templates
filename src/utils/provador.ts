/**
 * O "provador" da home: cada template completo tem uma cara para o site vestir
 * quando o visitante o prova — o fundo da página, o acento, a amostra do leque
 * e a fonte em que o nome dele aparece. É direção de arte do site, não o tema
 * da loja (esse está em `TEMA_DAS_FAMILIAS`): o fundo é sempre um escuro
 * tingido para o texto claro da home continuar legível.
 *
 * `fonte` é a variável do `next/font` declarada em `app/(home)/fonts.ts`.
 * Família sem entrada aqui (a 01, que não tem nome nem desenho próprio) fica
 * fora do leque e do título, e entra só na arara.
 */
export type VisualDoTemplate = {
  /** Nome curto, o que aparece no leque e no título. */
  nome: string;
  fonte: string;
  peso: number;
  estilo: 'normal' | 'italic';
  /** Fundo da página inteira enquanto o template está provado. */
  fundo: string;
  /** Botão principal, módulo do logo e passos ativos. */
  acento: string;
  textoNoAcento: string;
  /** Amostra do leque, card da arara e bloco final. */
  amostra: string;
  textoNaAmostra: string;
};

export const VISUAL_DOS_TEMPLATES: Record<string, VisualDoTemplate> = {
  '15': {
    nome: 'Luxo',
    fonte: 'var(--f-luxo)',
    peso: 500,
    estilo: 'italic',
    fundo: '#17130c',
    acento: '#c9a961',
    textoNoAcento: '#17130c',
    amostra: '#1a1714',
    textoNaAmostra: '#e6cf98',
  },
  '16': {
    nome: 'Infantil',
    fonte: 'var(--f-infantil)',
    peso: 600,
    estilo: 'normal',
    fundo: '#141030',
    acento: '#ffc93c',
    textoNoAcento: '#2a2350',
    amostra: '#ffc93c',
    textoNaAmostra: '#2a2350',
  },
  '14': {
    nome: 'Esportiva',
    fonte: 'var(--f-esportiva)',
    peso: 700,
    estilo: 'italic',
    fundo: '#1c080d',
    acento: '#ff2d4f',
    textoNoAcento: '#ffffff',
    amostra: '#e4002b',
    textoNaAmostra: '#ffffff',
  },
  '13': {
    nome: 'Noturno',
    fonte: 'var(--f-noturno)',
    peso: 700,
    estilo: 'normal',
    fundo: '#0d0d14',
    acento: '#c8c6ff',
    textoNoAcento: '#0d0d14',
    amostra: '#1b1b26',
    textoNaAmostra: '#e2e1f5',
  },
  '12': {
    nome: 'Suave',
    fonte: 'var(--f-suave)',
    peso: 400,
    estilo: 'normal',
    fundo: '#24101d',
    acento: '#f4dcd6',
    textoNoAcento: '#3b1f33',
    amostra: '#f4dcd6',
    textoNaAmostra: '#7a2e5f',
  },
  '11': {
    nome: 'Grade',
    fonte: 'var(--f-grade)',
    peso: 600,
    estilo: 'normal',
    fundo: '#121212',
    acento: '#ff4f00',
    textoNoAcento: '#0a0a0a',
    amostra: '#ffffff',
    textoNaAmostra: '#0a0a0a',
  },
  '10': {
    nome: 'Varejo',
    fonte: 'var(--f-varejo)',
    peso: 800,
    estilo: 'normal',
    fundo: '#0a1130',
    acento: '#ffcf24',
    textoNoAcento: '#101828',
    amostra: '#1340d8',
    textoNaAmostra: '#ffcf24',
  },
  '9': {
    nome: 'Editorial',
    fonte: 'var(--f-editorial)',
    peso: 600,
    estilo: 'normal',
    fundo: '#1d130e',
    acento: '#e9a27f',
    textoNoAcento: '#1d1b18',
    amostra: '#f7f4ef',
    textoNaAmostra: '#9c4a2f',
  },
};

/** A cara de um template sem desenho próprio (a 01): a do site, neutra. */
export const VISUAL_NEUTRO: Omit<VisualDoTemplate, 'nome'> = {
  fonte: 'var(--f-display)',
  peso: 800,
  estilo: 'normal',
  fundo: '#17130c',
  acento: '#ecebe4',
  textoNoAcento: '#17130c',
  amostra: '#ecebe4',
  textoNaAmostra: '#17130c',
};

/** O que o cliente da home recebe de cada template: serializável. */
export type TemplateDoProvador = {
  /** "16", o segmento da URL. */
  slug: string;
  /** "16 · Infantil" ou "Template 01", o nome do catálogo. */
  titulo: string;
  /** "Fredoka e Nunito". */
  fontes: string;
  pecas: number;
  imagem: string;
  link: string;
  visual: VisualDoTemplate | null;
};

/** As variáveis CSS que o site inteiro lê enquanto um template está provado. */
export function variaveisDoVisual(
  v: Omit<VisualDoTemplate, 'nome'>
): Record<string, string> {
  return {
    '--p-fundo': v.fundo,
    '--p-acento': v.acento,
    '--p-texto-acento': v.textoNoAcento,
    '--p-amostra': v.amostra,
    '--p-texto-amostra': v.textoNaAmostra,
  };
}

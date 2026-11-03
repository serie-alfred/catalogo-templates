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

/*
 * Regras dos campos, lidas pelo formulário (aviso campo a campo) e pela rota
 * `/api/contato` (que reprova o mesmo): as duas pontas não podem divergir.
 */

/** DDDs que existem no Brasil (Anatel). */
const DDDS = new Set(
  (
    '11 12 13 14 15 16 17 18 19 21 22 24 27 28 31 32 33 34 35 37 38 41 42 43 ' +
    '44 45 46 47 48 49 51 53 54 55 61 62 63 64 65 66 67 68 69 71 73 74 75 77 ' +
    '79 81 82 83 84 85 86 87 88 89 91 92 93 94 95 96 97 98 99'
  ).split(' ')
);

/** Os dígitos do telefone, sem o +55 do país nem o 0 de operadora: até 11. */
export function digitosDoTelefone(valor: string): string {
  let d = valor.replace(/\D/g, '');
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
  return d.replace(/^0+/, '').slice(0, 11);
}

/** `(11) 99999-9999` ou `(11) 3333-3333`, conforme o que já foi digitado. */
export function mascararTelefone(valor: string): string {
  const d = digitosDoTelefone(valor);
  if (!d) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  const corte = d.length === 11 ? 7 : 6;
  return `(${d.slice(0, 2)}) ${d.slice(2, corte)}-${d.slice(corte)}`;
}

/** O que está errado no telefone, ou null. */
export function erroDoTelefone(
  valor: string,
  preferencia: string
): string | null {
  const d = digitosDoTelefone(valor);
  if (!d) return 'Informe um telefone com DDD.';
  if (d.length < 10) return 'Faltam dígitos: confira o DDD e o número.';
  if (!DDDS.has(d.slice(0, 2))) return `O DDD ${d.slice(0, 2)} não existe.`;
  const celular = /[6-9]/.test(d[2]);
  if (d.length === 11 && d[2] !== '9')
    return 'Com 11 dígitos, o número começa com 9 depois do DDD.';
  if (d.length === 10 && celular) return 'Falta o 9 do celular.';
  if (d.length === 10 && preferencia === 'whatsapp')
    return 'Esse número é fixo. Para falar pelo WhatsApp, informe um celular.';
  return null;
}

const EMAIL_VALIDO = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i;

/** O que está errado no e-mail, ou null. */
export function erroDoEmail(valor: string): string | null {
  const v = valor.trim();
  if (!v) return 'Informe seu e-mail.';
  if (!v.includes('@')) return 'Falta o @ do e-mail.';
  if (!EMAIL_VALIDO.test(v)) return 'Esse e-mail parece incompleto.';
  return null;
}

/** Erros de digitação comuns no domínio do e-mail. */
const DOMINIOS_TROCADOS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.com.br': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
  'uol.com': 'uol.com.br',
  'bol.com': 'bol.com.br',
};

/** O e-mail com o domínio provável, quando o digitado parece um erro comum. */
export function sugestaoDeEmail(valor: string): string | null {
  const [usuario, dominio] = valor.trim().toLowerCase().split('@');
  const certo = dominio && DOMINIOS_TROCADOS[dominio];
  return usuario && certo ? `${usuario}@${certo}` : null;
}

/** O endereço da loja sem protocolo, `www.` nem barra no fim, em minúsculas. */
export function normalizarLoja(valor: string): string {
  return valor
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '');
}

/** O que está errado no endereço da loja (opcional), ou null. */
export function erroDaLoja(valor: string): string | null {
  const v = normalizarLoja(valor);
  if (!v) return null;
  return /^([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/.test(v)
    ? null
    : 'Algo como sualoja.com.br.';
}

/** Nome de gente ou de empresa: duas letras pelo menos. */
export function erroDoNome(valor: string, vazio: string): string | null {
  const v = valor.trim();
  if (!v) return vazio;
  return (v.match(/\p{L}/gu)?.length ?? 0) >= 2 ? null : 'Escreva por extenso.';
}

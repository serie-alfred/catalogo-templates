import 'server-only';

/**
 * O time comercial que atende pelo WhatsApp, lido de `COMERCIAIS` na Vercel:
 *
 *   COMERCIAIS="Ana:5511999990000,Bruno:5511988880000"
 *
 * Nome e número com DDI e DDD, só dígitos. Fica FORA do código de propósito:
 * o repo é público. Entrada malformada é ignorada; sem nenhuma válida, quem
 * clica no WhatsApp cai no formulário (`/#contato`).
 */
export type Comercial = { nome: string; numero: string };

export function comerciais(): Comercial[] {
  return (process.env.COMERCIAIS || '')
    .split(',')
    .map(par => {
      const [nome, numero] = par.split(':').map(s => s?.trim() ?? '');
      const digitos = (numero || '').replace(/\D/g, '');
      return nome && digitos.length >= 12 && digitos.length <= 15
        ? { nome, numero: digitos }
        : null;
    })
    .filter((c): c is Comercial => c !== null);
}

/** "Oi! Vim pelo site do E-temas e gostei do template Luxo." */
export function mensagemInicial(template?: string | null): string {
  const t = template?.trim().slice(0, 40);
  return t
    ? `Oi! Vim pelo site do E-temas e gostei do template ${t}. Pode me ajudar?`
    : 'Oi! Vim pelo site do E-temas e quero saber mais sobre os templates.';
}

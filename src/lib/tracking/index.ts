import { track as rastrearNaVercel } from '@vercel/analytics';

/**
 * Os eventos de conversão do site, com nomes estáveis — é por eles que o GTM,
 * o GA4 e o Pixel vão montar as campanhas quando a mídia paga começar:
 *
 *   cta_ver_templates      botão "Ver os templates"
 *   trocar_template_hero   o visitante provou um template no leque
 *   abrir_template         abriu a vitrine de um template (`/templates/NN`)
 *   clique_whatsapp        qualquer botão que leva ao WhatsApp do comercial
 *   enviar_formulario      formulário enviado com sucesso (também `generate_lead`)
 *
 * Vai sempre para o `dataLayer` (o GTM só existe depois do consentimento, e lê
 * a fila quando carrega) e para o Vercel Analytics, que não usa cookie. O Pixel
 * recebe os dois que são conversão de verdade.
 */
export type Evento =
  | 'cta_ver_templates'
  | 'trocar_template_hero'
  | 'abrir_template'
  | 'clique_whatsapp'
  | 'enviar_formulario';

type Parametros = Record<string, string | number | undefined>;

type Janela = Window & {
  dataLayer?: unknown[];
  fbq?: (...args: unknown[]) => void;
};

const NO_PIXEL: Partial<Record<Evento, string>> = {
  clique_whatsapp: 'Contact',
  enviar_formulario: 'Lead',
};

export function rastrear(evento: Evento, parametros: Parametros = {}) {
  if (typeof window === 'undefined') return;
  const w = window as Janela;
  const limpos = Object.fromEntries(
    Object.entries(parametros).filter(([, v]) => v !== undefined)
  ) as Record<string, string | number>;

  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: evento, ...limpos });
  if (evento === 'enviar_formulario') {
    w.dataLayer.push({ event: 'generate_lead', ...limpos });
  }

  const doPixel = NO_PIXEL[evento];
  if (doPixel && w.fbq) w.fbq('track', doPixel, limpos);

  try {
    rastrearNaVercel(evento, limpos);
  } catch {
    // Analytics fora do ar não pode quebrar um clique.
  }
}

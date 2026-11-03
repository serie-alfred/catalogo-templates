/**
 * O consentimento LGPD para cookies de análise e de anúncios. Enquanto não há
 * resposta, nada de GTM, GA4 ou Pixel carrega — a recusa é o padrão. Fica no
 * `localStorage` do visitante; mudar de ideia é apagar a chave (link
 * "Preferências de cookies" do rodapé).
 */
export type Consentimento = 'aceito' | 'recusado';

const CHAVE = 'etemas-consentimento';
export const EVENTO_CONSENTIMENTO = 'etemas:consentimento';

export const IDS_DE_RASTREIO = {
  gtm: process.env.NEXT_PUBLIC_GTM_ID || '',
  ga4: process.env.NEXT_PUBLIC_GA4_ID || '',
  pixel: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
};

/** Sem nenhum ID configurado não há o que consentir: o banner nem aparece. */
export const temRastreio = () =>
  Boolean(IDS_DE_RASTREIO.gtm || IDS_DE_RASTREIO.ga4 || IDS_DE_RASTREIO.pixel);

export function lerConsentimento(): Consentimento | null {
  try {
    const v = localStorage.getItem(CHAVE);
    return v === 'aceito' || v === 'recusado' ? v : null;
  } catch {
    return null;
  }
}

export function gravarConsentimento(v: Consentimento | null) {
  try {
    if (v) localStorage.setItem(CHAVE, v);
    else localStorage.removeItem(CHAVE);
  } catch {
    // Sem armazenamento, a escolha vale só para esta página.
  }
  window.dispatchEvent(new CustomEvent(EVENTO_CONSENTIMENTO, { detail: v }));
}

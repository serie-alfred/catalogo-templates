/**
 * Como o `config.json` é entregue: download (desenvolvimento) ou e-mail para a
 * equipe de implantação (qualquer outro host).
 *
 * Mora aqui, e não dentro de `exportLayout`, porque o rótulo do botão precisa da
 * MESMA resposta — um botão escrito "Baixar" que envia e-mail é pior do que
 * qualquer um dos dois comportamentos isolados.
 *
 * O gate é `localhost`, não um domínio de produção: o host já mudou uma vez
 * (troca de conta na Vercel) e, com gate por domínio, o envio simplesmente
 * parou de acontecer sem nenhum erro.
 */
export function isLocalDelivery(hostname: string): boolean {
  return (
    hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]'
  );
}

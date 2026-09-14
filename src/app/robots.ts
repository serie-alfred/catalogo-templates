import type { MetadataRoute } from 'next';

/**
 * O site inteiro fica fora da busca — mas o bloqueio de verdade é o
 * `robots: { index: false, follow: false }` na metadata de CADA layout raiz
 * ((home), gerador/(editor), gerador/(frame) e p). São quatro layouts e nenhum
 * pai comum, então não existe um só lugar para declarar isso.
 *
 * Este arquivo LIBERA o rastreamento de propósito. Um `disallow: '/'` aqui
 * pareceria mais forte e seria mais fraco: o robô nunca baixaria a página, logo
 * nunca leria o `noindex` da meta, e a URL podia continuar aparecendo na busca
 * (sem título nem descrição) por causa de links externos. Para SAIR do índice, o
 * rastreamento precisa acontecer.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
  };
}
